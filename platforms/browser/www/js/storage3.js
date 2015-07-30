
/*
* prepare the array of locations
* fix how the function is called
*/
function mySubways(){
	alert("in mySubways");
	alert(subways[0]);

	var origin = null;
	origin = {
		lat : storeInfo.result.rows.item(0).lat,
		lng : storeInfo.result.rows.item(0).lng};

		// test closest location
		alert(origin);
		closeLocations(origin, subways);
	}

// declare as a global variable to be accessible by all the function
var estimations = null;
var maxDist =  400;

/*
 * find locations close enough of one place. Use one place location, one array
 * of locations, the maximum distance. Return an array.
 * locations array {id, lat, lng}
 * Return array {id, dist}
 */
 function closeLocations(origin, locations) {
 	alert("in closeLocations");
 	
 	alert(locations[0].id+"  , "+ locations[0].lat);
	/*
	 * first calculus for distance location = {id, lat, lng}
	 * return = {id,distance}
	 */
	 var calcDist = function(location) {
	 	var result = 300 + location.id; 
	 	return {id: location.id, lat: location.lat, lng: location.lng, distance: result};
	 };

	 estimations = locations.map(function(location) {
	 	var result = 300 + location.id; 
	 	return {id: location.id, lat: location.lat, lng: location.lng, distance: result};
	});// calcDist on Locations
	 alert(estimations[0].distance);
	 alert(estimations[2].distance);


	// sort locations by calcDist cut at 20;
	
//	sort
var compare = function(a, b) {
	if (a.distance < b.distance)
		return -1;
	if (a.distance > b.distance)
		return 1;
	return 0;
}
	estimations.sort(compare); //estimation sorted
//	cut prepare for google calculation
	//loop index <24
	var tableLatLng = [];
	for ( var i = 0; i < 24; i++) {
		tableLatLng[i] = new google.maps.LatLng(estimations[i].lat, estimations[i].lng);
	}
	alert(tableLatLng[0]);
	calcsub(origin, tableLatLng);
}




function calcsub(origin, tableLatLng){
	alert("in calcsub");
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix( {
		origins : [ origin ],
		destinations : tableLatLng,
		travelMode : google.maps.TravelMode.DRIVING,
		unitSystem : google.maps.UnitSystem.METRIC,
		avoidHighways : false,
		avoidTolls : false
	}, function(response, status) {
		alert("in ");
		if (status != google.maps.DistanceMatrixStatus.OK) {
			alert('Error was: ' + status);
		} else {
			for ( var i = 0; i < response.rows[0].elements.length; i++) {
				// alert (response.rows[0].elements[i].status);
				alert(response.rows[0].elements[i].distance.text);
				estimations[i].distance = response.rows[0].elements[i].distance.text;
			}
		}
	} );
}

function editJson(){
	for ( var i = 0; i < 24; i++) {
		if(estimations[i].distance < maxDist){
			// update the JSON
		}
	} 
}





