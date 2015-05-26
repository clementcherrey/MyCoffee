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
				console.log("results length: "+results.rows.length);
				for (var i = results.rows.length - 1; i >= 0; i--) {
					storeInfo.result.push({
						id : result.rows.item(i).id,
						wifi: result.rows.item(i).wifi,
						latte: result.rows.item(i).latte,
						brand: result.rows.item(i).brand,
						name: result.rows.item(i).name,
						address: result.rows.item(i).addresseng,
						open1: result.rows.item(i).open1,
						open2: result.rows.item(i).open2,
						open3: result.rows.item(i).open3,
						open4: result.rows.item(i).open4,
						description: result.rows.item(i).description,
						phone: result.rows.item(i).phone,
						website: result.rows.item(i).website,
						lat: result.rows.item(i).lat,
						lng: result.rows.item(i).lng,					});
				};
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
	// sort using diff
	function compareDiff(a, b) {
		if (a.diff < b.diff)
			return -1;
		if (a.diff > b.diff)
			return 1;
		return 0;
	}
	diffArr.sort(compareDiff);
	return diffArr; 
}



// ***** use the sync loop to launch the distances calc*******//
function initDistCalc() {
	console.log("in init calc");
	var currentDiff = estimateDiff(storeInfo.result);
	// only send 20 locations per request for distqnces
	console.log ("number of store : " + storeInfo.result.length);
	var divbytwenty = storeInfo.result.length / 20;
	// test for new limit to replace divby twenty
	var nbOfLoop = 2

	syncLoop(nbOfLoop, function(loop) {
		var j = loop.iteration() * 20;
		console.log("my counter equal" + j);
		var tableLatLng = [];
		var valueId =[];
		for ( var i = 0; i < 20 && i < storeInfo.result.length - j; i++) {
			var itID = j+i;
			var tmpId = currentDiff[itID].id;
			// console.log("itID: "+itID +", tmpId: " + tmpId);
			for ( var k = 0; k < storeInfo.result.length ; k++) {
				// console.log("storeInfo store id: " + storeInfo.result[k].id);
				if (storeInfo.result[k].id == tmpId) {
					valueId.push(tmpId);
					tableLatLng.push(new google.maps.LatLng(storeInfo.result[k].lat, storeInfo.result[k].lng));
					break;
				};
			}
		}


		function callnext() {
			loop.next();
		}
		calculateDistances(valueId, tableLatLng, callnext);
	}, function() {
		sortDistance();
		displaySearchResult();
	});
}

// ********************* calculate distances *************************//

function calculateDistances(valueId, tableLL, callback) {
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
			for ( var i = 0; i < response.rows[0].elements.length; i++) {
				var myIndex = i;
				var myId = valueId[myIndex];
				if (true) {
					mapInfo.distances.push( {
						id : myId,
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
