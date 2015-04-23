function initMap() {
	console.log("in intiMap !");
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
	initMarkers();
	if(storeInfo.id != null){
		clickCurrentMarker();
	}
}
function clickCurrentMarker(){
		for ( var i = 0; i < storeInfo.result.length; i++) {
		console.log(" storeInfo.result[i].id: "+storeInfo.result[i].id+" , storeInfo.id:"+storeInfo.id);
			if( storeInfo.result[i].id == storeInfo.id){
				console.log("in if");
				google.maps.event.trigger(markers[i], 'click');
				break;
			}	
		}
	}


function initMarkers(){
		var infoWindow = null;
		markers = [];
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

			contents.push('<div>' + '<img class="info1" src="img/mini-'
				+ tmpBrand + '.png"/>' + '<h3>'
				+ tmpName + '</h3><div>'
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

}