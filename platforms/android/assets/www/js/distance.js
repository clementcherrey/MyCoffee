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

// ********************* use the sync loop to launch the distances calc
// *************************//
function initDistCalc() {
	// alert("in init calc");
	// only send 20 locations per request for distqnces
	alert (storeInfo.result.rows.length);
	var divbytwenty = storeInfo.result.rows.length / 20;
	// alert(divbytwenty);
	
	syncLoop(divbytwenty, function(loop) {
		var j = loop.iteration() * 20;
		// alert("my counter equal" + j);
		var tableLatLng = [];
		for ( var i = 0; i < 20 && i < storeInfo.result.rows.length - j; i++) {
			var tmpId = j + i;
			// alert("temp Id" + tmpId);
			var tmpLat = storeInfo.result.rows.item(tmpId).lat;
			var tmpLng = storeInfo.result.rows.item(tmpId).lng;
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
		displayList();
		// alert('done');
	});
}

// ********************* calculate distances *************************//
var callbackBase = -20;

function calculateDistances(tableLL, callback) {
// alert("in calculate");
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
		// alert("in callbackDistance");
		if (status != google.maps.DistanceMatrixStatus.OK) {
			// alert('Error was: ' + status);
		} else {
			// alert("in else");
			callbackBase += 20;
			for ( var i = 0; i < response.rows[0].elements.length; i++) {
		// alert (response.rows[0].elements[i].status);
				var valueId = callbackBase + i;
				if (true) {
					mapInfo.distances.push( {
						id : valueId,
						distance : new String(
								response.rows[0].elements[i].distance.text)
					});
				}
			}
			callback();
		}
	});
}

// ****** sort the distance array from close to far ******//
function sortDistance() {
	function compare(a, b) {
		if (a.distance < b.distance)
			return -1;
		if (a.distance > b.distance)
			return 1;
		return 0;
	}
	mapInfo.distances.sort(compare);
}
