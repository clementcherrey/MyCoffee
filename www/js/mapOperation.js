
function initMap() {
	myInfoWindow = new google.maps.InfoWindow( {
		content : null
	});
	myInfoWindow.close();
	console.log("in intiMap !");

	// init the map if no map
	if (mapInfo.createNb == 0) {
		console.log("in no map created !");
	// add listener for return cleaning markers
	$("#back-home").on('click', function() {
		deleteMarkers();
		storeInfo.id = null;
		console.log("back-home");
	});

		var mapOptions = {
			mapTypeControl: false,
			streetViewControl: false,
			panControl: false,
			scaleControl: false,
    		zoomControl: true,
    		zoomControlOptions: {
        	style: google.maps.ZoomControlStyle.LARGE,
        	position: google.maps.ControlPosition.RIGHT_BOTTOM
   			 },
			zoom : mapInfo.mapZoom,
			center : new google.maps.LatLng(mapInfo.currentLat,
				mapInfo.currentLng)
		};
		map = new google.maps.Map(document.getElementById('map_canvas'),
			mapOptions);
		console.log(mapInfo.currentLat+"  ---  "+mapInfo.currentLng);
		mapInfo.createNb++;
	} else {
		console.log("map already created");
		map.setCenter(new google.maps.LatLng(mapInfo.currentLat,
			mapInfo.currentLng));
		map.setZoom(mapInfo.mapZoom);
	}
	initMarkers();
	// getPointclicked();
}

function clickCurrentMarker(){
console.log("click Marker");
	for ( var i = 0; i < markers.length; i++) {
		// console.log(" storeInfo.result[i].id: "+storeInfo.result[i].id+" , storeInfo.id:"+storeInfo.id);
		if( markers[i].markerId == storeInfo.id){
			console.log("in if");
			google.maps.event.trigger(markers[i], 'click');
			break;
		}	
	}
}


function initMarkers(){
	console.log("in initMarkers");
	myInfoWindow.content = null;
	contents = [];
	if(storeInfo.result != null){
		for ( var i = 0; i < storeInfo.result.length; i++) {
			var tmplat = storeInfo.result[i].lat;
			var tmplng = storeInfo.result[i].lng;
			var tmpId = storeInfo.result[i].id;
			var tmpLatlng = new google.maps.LatLng(tmplat, tmplng);

			var tmpName = storeInfo.result[i].name;
			var tmpBrand = storeInfo.result[i].brand;
			var tmpAddress = storeInfo.result[i].addresseng;

			contents.push('<div>' + '<h3>'
				+ tmpBrand + '</h3>'
				+ tmpAddress 
				+'</br><a href="#headline">view detail</a></div>');

			markers.push( new google.maps.Marker({
				position : tmpLatlng,
				map : map,
				icon : 'img/marker1.png',
				content : contents[i],
				markerId: tmpId
			}));
			
			google.maps.event.addListener(markers[i], 'click',  function(){
				myInfoWindow.content = "YO";
				myInfoWindow.setContent(this.content);
				myInfoWindow.open(map, this);
			// TO CUSTOMIZE THE LAT AND LNG
				// getActiveMarker(this);
		});
		};
	}

	// TEST FOR THE LAT LNG BAIDU
	var testjiashan = new google.maps.LatLng(31.202855,121.460856);

	var testSBJiashan = new google.maps.LatLng(31.203489,121.462607);
	var testCostJiashan = new google.maps.LatLng(31.203513, 121.461977);
	var testLatLngB = new google.maps.LatLng(31.208523,121.466471);
	var testLatLngC = new google.maps.LatLng(31.208907,121.468067);
	var testLatLngF = new google.maps.LatLng(31.208515,121.467329);
	var testLatLngI = new google.maps.LatLng(31.208955,121.468806);

	var testLatLngb = new google.maps.LatLng(31.228867,121.526159);
	var testLatLngc = new google.maps.LatLng(31.232997,121.475939);
	var testLatLngf = new google.maps.LatLng(31.217996,121.414437);
	var testLatLngi = new google.maps.LatLng(31.391508,121.237312);




	var myPos = new google.maps.LatLng(mapInfo.currentLat,mapInfo.currentLng);
	// mapInfo.currentLat =  31.205451999999998;
	// mapInfo.currentLng = 121.4577775;
	// remove GPS correction
	var customlat = mapInfo.currentLat + 0.0021;
	var customlng = mapInfo.currentLng - 0.0042;
	var custompos = new google.maps.LatLng(customlat,customlng);

	markers.push( new google.maps.Marker({
		position : testjiashan,
		map : map,
		icon : 'img/marker-cup.png',
	}));
	markers.push( new google.maps.Marker({
		position : custompos,
		map : map,
		icon : 'img/size.png',
	}));
	markers.push( new google.maps.Marker({
		position : myPos,
		map : map,
		icon : 'img/xigua.png',
	}));
	// markers.push( new google.maps.Marker({
	// 	position : testSBJiashan,
	// 	map : map,
	// 	icon : 'img/marker.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testCostJiashan,
	// 	map : map,
	// 	icon : 'img/marker.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngB,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngC,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngF,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngI,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// 	markers.push( new google.maps.Marker({
	// 	position : testLatLngb,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngc,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngf,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));
	// markers.push( new google.maps.Marker({
	// 	position : testLatLngi,
	// 	map : map,
	// 	icon : 'img/150.png',
	// }));

	// --------Test for the position of subwats
	// printSubways();
	//---------
	if(storeInfo.id != null){
		clickCurrentMarker();
	}
}


// Sets the map on all markers in the array.
function setAllMap(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	console.log("in delete marker");
	clearMarkers();
	markers = [];
}

