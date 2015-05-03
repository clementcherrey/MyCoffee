// ********************* sync the loop to request distances *************************//
function syncLoop(iterations, process, exit) {
	// alert("in syncLoop");
	var index = 0, done = false, shouldExit = false;
	var loop = {
		next : function() {
			// console.log("in next");
			if (done) {
				if (shouldExit && exit) {
					return exit(); // Exit if we're done
				}
			}
			// If we're not finished
			if (index < iterations) {
				// console.log("in if iteration: ");
				// console.log(iterations);
				index++; // Increment our index
				process(loop); // Run our process, pass in the loop
				// Otherwise we're done
			} else {
				done = true; // Make sure we say we're done
				if (exit)
					exit(); // Call the callback on exit
			}
		},
		iteration : function() {
			return index - 1; // Return the loop number we're on
		},
		stop : function(end) {
			done = true; // End the loop
			shouldExit = end; // Passing end as true means we still call the
			// exit callback
		}
	};
	loop.next();
	return loop;
}

function preCalc(){
	storeInfo.result = [];
	mapInfo.distances = [];
	db.transaction(function(tx) {
		tx.executeSql("select * from store",
			[], function(tx,results){
				console.log("results: "+results);
				console.log("results length: "+results.rows.length);
				for (var i = results.rows.length - 1; i >= 0; i--) {
					storeInfo.result.push({
						id : results.rows.item(i).id,
						wifi: results.rows.item(i).wifi,
						latte: results.rows.item(i).latte,
						brand: results.rows.item(i).brand,
						name: results.rows.item(i).name,
						address: results.rows.item(i).address,
						lat: results.rows.item(i).lat,
						lng: results.rows.item(i).lng,
					});
				};
				console.log("finish for");
				initDistCalc();
			});
	});
}


function estimateDiff(objArr){
	console.log("in init estimateDiff");
	var diffOp = function (lat,lng){
		return (mapInfo.currentLat - lat) * (mapInfo.currentLat - lat) + (mapInfo.currentLng- lng)*(mapInfo.currentLng- lng);
	};

	var diffArr = $.map(objArr, function(n,i){
		return [{id: n.id, diff: diffOp(n.lat,n.lng)}];
	})

	// for (var i = diffArr.length - 1; i >= 0; i--) {
	// 	console.log(" row one diffArr id: "+ diffArr[i].id + ", diff: "+ diffArr[i].diff);
	// };
	

	// sort using diff
	function compareDiff(a, b) {
		if (a.diff < b.diff)
			return -1;
		if (a.diff > b.diff)
			return 1;
		return 0;
	}
	diffArr.sort(compareDiff);
	// console.log(" row one diffArr id: "+ diffArr[0].id + ", diff: "+ diffArr[0].diff);
	return diffArr; 
}



// ***** use the sync loop to launch the distances calc*******//
function initDistCalc() {
	console.log("in init calc");
	var currentDiff = estimateDiff(storeInfo.result);
	// only send 20 locations per request for distqnces
	console.log ("number of store : " + storeInfo.result.length);
	var divbytwenty = storeInfo.result.length / 20;
	// alert(divbytwenty);

	// test for new limit to replace divby twenty
	var nbOfLoop = 1

	syncLoop(nbOfLoop, function(loop) {
		var j = loop.iteration() * 20;
		console.log("my counter equal" + j);
		var tableLatLng = [];
		for ( var i = 0; i < 20 && i < storeInfo.result.length - j; i++) {
			var itID = j+i;
			var tmpId = currentDiff[itID].id;
			console.log("tmpId: " + tmpId);

			for ( var k = 0; k < storeInfo.result.length; i++) {
				console.log("lol");
				if(storeInfo.result[k].id == tmpId){
					console.log("storeInfo.result.id == tmpId");
					var tmpLat = storeInfo.result[k].lat;
					var tmpLng = storeInfo.result[k].lng;
					break;
				}
			}
			tableLatLng[i] = new google.maps.LatLng(tmpLat, tmpLng);
		}
		// alert('loop done');
		// alert("length table : " + tableLatLng.length);
		function callnext() {
			loop.next();
		}
		calculateDistances(tableLatLng, callnext);
		// callnext();
	}, function() {
		sortDistance();
		displaySearchResult();
		// alert('done');
	});
}

// ********************* calculate distances *************************//
var callbackBase = -20;

function calculateDistances(tableLL, callback) {
	console.log("in calculate");
	var service = new google.maps.DistanceMatrixService();
	var origin = new google.maps.LatLng(mapInfo.currentLat, mapInfo.currentLng);
	service.getDistanceMatrix( {
		origins : [ origin ],
		destinations : tableLL,
		travelMode : google.maps.TravelMode.DRIVING,
		unitSystem : google.maps.UnitSystem.METRIC,
		avoidHighways : false,
		avoidTolls : false
	}, function(response, status) {
		console.log("in callbackDistance");
		if (status == google.maps.DistanceMatrixStatus.OK) {
	// alert("in else");
	callbackBase += 20;
	for ( var i = 0; i < response.rows[0].elements.length; i++) {
		// console.log (response.rows[0].elements[i].status);
		var valueId = callbackBase + i;
		if (true) {
			mapInfo.distances.push( {
				id : valueId,
				distanceText : new String(
					response.rows[0].elements[i].distance.text),
				distanceValue: response.rows[0].elements[i].distance.value
			});
		}
	}
}else if (status === google.maps.DistanceMatrixStatus.OVER_QUERY_LIMIT) {   
	console.log("OVER_QUERY_LIMIT"); 
	setTimeout(function() {
		calculateDistances(tableLL, callback);
	}, 5000);
}else {
	console.log('distance calc was not successful for the following reason: ' + status);
} 
callback();
});
}

// ****** sort the distance array from close to far ******//
function sortDistance() {
	function compare(a, b) {
		if (a.distanceValue < b.distanceValue)
			return -1;
		if (a.distanceValue > b.distanceValue)
			return 1;
		return 0;
	}
	mapInfo.distances.sort(compare);
}
