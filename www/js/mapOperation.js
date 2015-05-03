var map;
var markers = [];
var contents = [];




function initMap() {
	console.log("in intiMap !");
	// add listener for return cleaning markers
	$("#back-home").on('tap', function() {
		alert("back-home");
		infoWindow.close();
	});
	// init the map if no map
	if (mapInfo.createNb == 0) {
		console.log("in no map created !");
		var mapOptions = {
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
	deleteMarkers();
}

function clickCurrentMarker(){
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
	console.log("in initMarkers")
	var infoWindow = new google.maps.InfoWindow( {
		content : null
	});	 
	contents = [];
	infoWindow = new google.maps.InfoWindow( {
		content : null
	});
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
			infoWindow.content = "YO";
			infoWindow.setContent(this.content);
			infoWindow.open(map, this);
		});
	};
	if(storeInfo.id != null){
		clickCurrentMarker();
	}
}


// Sets the map on all markers in the array.
function setAllMap(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
	if (map == null) {
		initMarkers();
	};
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	console.log("in delete marker")
	clearMarkers();
	markers = [];
}

