var map;
var markers = [];
var contents = [];
var myInfoWindow;



function initMap() {
	myInfoWindow = new google.maps.InfoWindow( {
		content : null
	});
	myInfoWindow.close();
	console.log("in intiMap !");

	// init the map if no map
	if (mapInfo.createNb == 0) {
		console.log("in no map created !");
	//initialize button behaviour
	$("#test").on('click', function() {
		myInfoWindow.close();
	});
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
			center : new google.maps.LatLng(mapInfo.centerLat,
				mapInfo.centerLng)
		};
		map = new google.maps.Map(document.getElementById('map_canvas'),
			mapOptions);
		mapInfo.createNb++;
	} else {
		console.log("map already created");
		map.setCenter(new google.maps.LatLng(mapInfo.centerLat,
			mapInfo.centerLng));
		map.setZoom(mapInfo.mapZoom);
	}
	initMarkers();
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
	for ( var i = 0; i < storeInfo.result.length; i++) {
		var tmplat = storeInfo.result[i].lat;
		var tmplng = storeInfo.result[i].lng;
		var tmpId = storeInfo.result[i].id;
		var tmpLatlng = new google.maps.LatLng(tmplat, tmplng);

		var tmpName = storeInfo.result[i].name;
		var tmpBrand = storeInfo.result[i].brand;
		var tmpAddress = storeInfo.result[i].address;

		contents.push('<div>' + '<h3>'
			+ tmpName + '</h3>'
			+ tmpAddress + '</div>');

		markers.push( new google.maps.Marker({
			position : tmpLatlng,
			map : map,
			icon : 'img/marker.png',
			content : contents[i],
			markerId: tmpId
		}));
		
		google.maps.event.addListener(markers[i], 'click',  function(){
			myInfoWindow.content = "YO";
			myInfoWindow.setContent(this.content);
			myInfoWindow.open(map, this);
		});
	};


	// TEST FOR THE LAT LNG BAIDU
	var testSBJiashan = new google.maps.LatLng(31.203489,121.462607);
	var testCostJiashan = new google.maps.LatLng(31.203513, 121.461977);
	var testLatLngB = new google.maps.LatLng(31.208523,121.466471);
	var testLatLngC = new google.maps.LatLng(31.208907,121.468067);
	var testLatLngF = new google.maps.LatLng(31.208515,121.467329);
	var testLatLngI = new google.maps.LatLng(31.208955,121.468806);
	var myPos = new google.maps.LatLng(mapInfo.currentLat,mapInfo.currentLng);
	mapInfo.currentLat =  31.205451999999998;
	mapInfo.currentLng = 121.4577775;
	var customlat = mapInfo.currentLat - 0.0021;
	var customlng = mapInfo.currentLng + 0.0042;
	var custompos = new google.maps.LatLng(customlat,customlng);
	markers.push( new google.maps.Marker({
		position : custompos,
		map : map,
		icon : 'img/xigua.png',
	}));
	markers.push( new google.maps.Marker({
		position : myPos,
		map : map,
		icon : 'img/xigua.png',
	}));
	markers.push( new google.maps.Marker({
		position : testSBJiashan,
		map : map,
		icon : 'img/marker.png',
	}));
	markers.push( new google.maps.Marker({
		position : testCostJiashan,
		map : map,
		icon : 'img/marker.png',
	}));
	markers.push( new google.maps.Marker({
		position : testLatLngB,
		map : map,
		icon : 'img/150.png',
	}));
	markers.push( new google.maps.Marker({
		position : testLatLngC,
		map : map,
		icon : 'img/150.png',
	}));
	markers.push( new google.maps.Marker({
		position : testLatLngF,
		map : map,
		icon : 'img/150.png',
	}));
	markers.push( new google.maps.Marker({
		position : testLatLngI,
		map : map,
		icon : 'img/150.png',
	}));
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

