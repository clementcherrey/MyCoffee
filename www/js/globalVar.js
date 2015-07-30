 var db;

var autoMapLoading = true;

 var tableToPopulate = 6;
 var storeInfo = {
	id : null,
	distance: null,
	result : null
};

var userInfo = {
	mapLoaded : null
};

var subway ={

};

var mapInfo = {
	createNb : 0,
	centerLat : 31.225523,
	centerLng : 121.491344,
	mapZoom : 16,
	currentLat : 32.0500,
	currentLng : 118.7667,
	distances : [],
	title : "coffee shop in Shanghai",
	// border for the city
	minLat : 30.767159,
	maxLat : 31.511922,
	minLng : 121.013019,
	maxLng : 122.493735
};

var map;
var markers = [];
var contents = [];
var myInfoWindow;

