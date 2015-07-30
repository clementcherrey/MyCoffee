var storeInfo = {
	id : null,
	distance: null,
	result : null
};
var customID;

function loadAllinCache(){
	console.log("in loadAllinCache");
	storeInfo.result = [];
	db.transaction(function(tx) {
		tx.executeSql("select * from store",[], putInArray, errorHandler);
	});
	var putInArray = function(tx, result){
		for (var i = result.rows.length - 1; i >= 0; i--) {
			storeInfo.result.push({
				id : result.rows.item(i).id,
				wifi: result.rows.item(i).wifi,
				latte: result.rows.item(i).latte,
				brand: result.rows.item(i).brand,
				name: result.rows.item(i).name,
				// namecn: result.rows.item(i).namecn,
				addresseng: result.rows.item(i).addresseng,
				addresscn: result.rows.item(i).addresscn,
				open1: result.rows.item(i).open1,
				open2: result.rows.item(i).open2,
				open3: result.rows.item(i).open3,
				open4: result.rows.item(i).open4,
				description: result.rows.item(i).description,
				phone: result.rows.item(i).phone,
				website: result.rows.item(i).website,
				// latbaidu: result.rows.item(i).latbaidu,
				// lngbaidu: result.rows.item(i).lngbaidu,
				lat: result.rows.item(i).lat,
				lng: result.rows.item(i).lng,
			});
		}
		console.log("number of store in cache: "+storeInfo.result.length);
		console.log(storeInfo.result);
		$("#printNewLatLng").on( "click", function(){printNewCoordinates()});
		initMap();
	}
}

function getActiveMarker(marker){
	var tmpMarkerID = marker.markerId;
	storeInfo.id = marker.markerId;
	for (var i = storeInfo.result.length - 1; i >= 0; i--) {
		if(storeInfo.result[i].id == tmpMarkerID){
			customID = i;
			break;
		}
	};
	console.log("the marker for "+storeInfo.result[i].name+ " is now active");
}

// REMEMBER TO ACTIVATE IT IN MAPOPERATION
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
    	storeInfo.result[customID].lat = newLat;
    	storeInfo.result[customID].lng = newLng;
    	console.log("the store "+storeInfo.result[customID].name+ " get new lat,lng: ");
    	console.log(storeInfo.result[customID].lat+", "+storeInfo.result[customID].lng);
    }
}

function printNewCoordinates(){
	console.log("*********************************");
	console.log("--------- NEW COORDINATES -------");
	console.log("*********************************");
	var tmpData = JSON.stringify(storeInfo.result);
	console.log("tmpData = "+ tmpData);
	sendData(tmpData);
	console.log("*********************************");
}