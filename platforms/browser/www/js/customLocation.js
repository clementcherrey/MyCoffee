var storeArray = [];
var customID;

function loadAllinCache(){
	db.transaction(function(tx) {
		tx.executeSql("select * from store",[], putInArray, errorHandler);
	});
	var putInArray = function(tx, result){
		for (var i = result.rows.length - 1; i >= 0; i--) {
			storeArray.push({
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
				lng: result.rows.item(i).lng,
			});
		}
		alert(storeArray);
	}
}

function getActiveMarker(marker){
	var tmpMarkerID = marker.markerId;
	storeInfo.id = marker.markerId;
	for (var i = storeArray.length - 1; i >= 0; i--) {
		if(storeArray[i].id == tmpMarkerID){
			customID = i;
			break;
		}
	};
	console.log("the marker for "+storeArray[i].name+ " is now active");
}

function getPointclicked(){
	// This event listener will call  getLatLng when the map is clicked.
	google.maps.event.addListener(map, 'click', function(event) {
		updateLatLng(event.latLng);
	});

	var updateLatLng = function(myLatLng){
		alert("Coordinates updated in Cache");
		//get lat and lng
		var newLat = myLatLng.lat();
		var newLng = myLatLng.lng();

    	// update active marker lat,lng
    	storeArray[customID].lat = newLat;
    	storeArray[customID].lng = newLng;
    	console.log("the store "+storeArray[customID].name+ " get new lat,lng: ");
    	console.log(storeArray[customID].lat+", "+storeArray[customID].lng);
    }
}

function printNewCoordinates(){
	console.log("*********************************");
	console.log("--------- NEW COORDINATES -------");
	console.log("*********************************");
	for (var i = storeArray.length - 1; i >= 0; i--) {
		console.log("$"+storeArray[i].id
			+"$"+ storeArray[i].brand
			+"$"+ storeArray[i].name
			+"$"+storeArray[i].lat
			+"$"+storeArray[i].lng);
	};
	console.log("*********************************");

}




