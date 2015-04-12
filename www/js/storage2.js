/**
 * Created by clement on 12/29/14.
 */
 function init() {
 	alert("in init");
 	//for browser
 	$( document ).ready(function() {
		deviceready();
	}); 	

 	//for phone
 	document.addEventListener("deviceready", deviceready, true);
 }
 var db;

 function deviceready() {
 	// alert("in deviceready");
 	db = window.openDatabase("store", "1.0", "store_list", 10000000);
 	db.transaction(setup, errorHandler, dbReady);
 }

 function setup(tx) {

 // suppress drop table
 tx.executeSql('DROP TABLE store');
 tx.executeSql('DROP TABLE subway');
 tx.executeSql('DROP TABLE storeSub');


 tx.executeSql('create table if not exists store('
 	+ ' id INTEGER  PRIMARY KEY, ' 
 	+ ' wifi TEXT,'
 	+ ' latte TEXT,'
 	+ ' name TEXT,'
 	+ ' brand TEXT,' 
 	+ ' address TEXT,' 
 	+ ' lat FLOAT,'
 	+ ' lng FLOAT)');

 tx.executeSql('create table if not exists contentList('
 	+ 'id INTEGER PRIMARY KEY,' 
 	+ 'content TEXT)');

 tx.executeSql('create table if not exists subway('
 	+ ' id INTEGER PRIMARY KEY,' 
 	+ ' lat FLOAT,'
 	+ ' lng FLOAT,'
 	+ ' station TEXT,' 
 	+ ' line INTEGER'
 	+ ' test FLOAT)');

tx.executeSql('create table if not exists storeSub('
	+'storeId INTEGER NOT NULL,' 
	+'subwayId INTEGER NOT NULL,'
	+'distanceText TEXT,' 
	+'distanceValue INTEGER,' 
	+'FOREIGN KEY (storeId) REFERENCES store (id),' 
	+'FOREIGN KEY (subwayId) REFERENCES subway (id),' 
	+'PRIMARY KEY (storeId, subwayId))');

 	 // alert("table joint created");
 	}

 	function errorHandler(e) {
 		alert(e.message);
 	}

 	function dbReady() {
 	// loadOldList();
	// alert("in db ready");
	db.transaction(function(tx) {
		tx.executeSql("select * from store order by id asc", [], populatedb,
			errorHandler);
	});

	$("#store-list").on('vclick', 'li a', function() {
		// alert("click detected");
		storeInfo.id = $(this).attr('data-id');
		// alert(storeInfo.id);
		$("body").pagecontainer("change", "#headline", {
			role : "page"
		});
	});

	$("#buttonsearch").on('click', function(event){
		// alert("In click handler");
		search();
	});

$("#headline")
.on(
	'pagebeforeshow',
	function() {
						// alert("in headline before show");
						$('#store-data').empty();
						$('.header-title').empty();

						for ( var i = 0; i < storeInfo.result.rows.length; i++) {
							if (i == storeInfo.id) {
								// alert("in the if");
								var tmpName = storeInfo.result.rows.item(i).name;
								$('.header-title').append(tmpName);

								var tmpBrand = storeInfo.result.rows.item(i).brand;
								var tmpNote = "4";
								var tmpWifi = "freewifi";
								var tmpAddress = "1376 Nanjing West Road Jingan, jianpu district";
								var tmpStation = "People square";
								var tmpSubwayDetail = "500 metres from exit 4, on your right";
								var tmpDescription = "blablabla bla blablabla blablablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla";
								//var tmpDistance = mapInfo.distances[i].distance;
								var tmpDistance = "33 km";
								var tmpPrice = "$$$";
								var tmpSubwayLine = "2";
								// alert("lol");

								mapInfo.centerLat = storeInfo.result.rows
								.item(i).lat;
								mapInfo.centerLng = storeInfo.result.rows
								.item(i).lng;
								mapInfo.mapZoom = 14;



								$('#store-data')
								.append(
									'<li>'
									+ '<div class="container2"><img src="img/'
									+ tmpBrand
									+ '.png"/></div>'
									+ '<div class = "container1"><div><p>'
									+ tmpName
									+ '</p><p><img src="img/'
									+ tmpNote
									+ '-stars.png" style="width: 80px;"/></p></div></div>'						
									+ '</li>');

								$('#store-data')
								.append(
									'<li class="containerWifi"><div class="ui-grid-b">'
									+ '<div class="ui-block-a grids"><div class="ui-body ui-body-d"><p>From your location:</p><p>'
									+ tmpDistance
									+ '</p></div></div>'
									+ '<div class="ui-block-b grids"><div class="ui-body ui-body-d"><img src="img/'
									+ tmpWifi
									+ '.png"/></div></div>'
									+ '<div class="ui-block-c grids"><div class="ui-body ui-body-d"><p>Price : </p><p>'
									+ tmpPrice
									+ '</p></div></div>'
									+ '</div></li>');
								$('#store-data')
								.append(
									'<li style="white-space:normal;"><span style="font-weight:bold;">Address :</span>'
									+ tmpAddress + '</li>');
								$('#store-data')
								.append(
									'<li style="white-space:normal;"><div><div>'
									+ '<p style="font-weight:bold; font-size: medium">Station: '
									+ tmpStation
									+ '</p><div style="display:table;"><span style="vertical-align: middle;display: table-cell"> Subway line: </span> <span style="vertical-align: middle;display: table-cell;">'
									+ '<img src="img/line'
									+ tmpSubwayLine
									+ '.png" /></span></div>'			
									+ '<p>'
									+ tmpSubwayDetail
									+ '</p>'
									+'<div></div></li>');
								$('#store-data')
								.append(
									'<li style="white-space:normal; font-size: medium"><span style="font-weight:bold;">Description :</span>'
									+ tmpDescription
									+ '</li>');
								// to delete after test
								$('#store-data').listview('refresh');
							}
						}
						;
						$('#store-data').listview('refresh');
					});

$("#main").on('pageshow', initMap);
}

var storeInfo = {
	id : null,
	result : null
};

var mapInfo = {
	createNb : 0,
	centerLat : 31.225523,
	centerLng : 121.491344,
	mapZoom : 12,
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
var contents = [];
var markers = [];
function initMap() {
	alert("in intiMap !");
	if (mapInfo.createNb == 0) {
		alert("in no map created !");
		var mapOptions = {
			zoom : mapInfo.mapZoom,
			center : new google.maps.LatLng(mapInfo.centerLat,
				mapInfo.centerLng)
		};
		map = new google.maps.Map(document.getElementById('map_canvas'),
			mapOptions);

		// button to center the map on the actual location
		$('#test').on(
			"tap",
			function() {
			//	alert(" test !");
			var currentLatLng = new google.maps.LatLng(mapInfo.currentLat,
				mapInfo.currentLng);
			map.setCenter(currentLatLng);
		});
		// static info window
		var infoWindow = null;
		infoWindow = new google.maps.InfoWindow( {
			content : null
		});
		
		for ( var i = 0; i < storeInfo.result.rows.length; i++) {
			var tmplat = storeInfo.result.rows.item(i).lat;
			var tmplng = storeInfo.result.rows.item(i).lng;
			var tmpLatlng = new google.maps.LatLng(tmplat, tmplng);

			var tmpName = storeInfo.result.rows.item(i).name;
			var tmpBrand = storeInfo.result.rows.item(i).brand;
			var tmpAddress = "1376 Nanjing West Road Jingan, jianpu district";

			contents.push('<div>' + '<img class="info1" src="img/mini-'
				+ storeInfo.result.rows.item(i).brand + '.png"/>' + '<h13>'
				+ storeInfo.result.rows.item(i).name + '</h3><div>'
				+ tmpAddress + '</div>');

			markers.push( new google.maps.Marker({
				position : tmpLatlng,
				map : map,
				icon : 'img/marker.png',
				content : contents[i]
			}));
			// console.log("marker i content: "+ markers[i].content);
			
			google.maps.event.addListener(markers[i], 'click',  function(){
				infoWindow.content = "YO";
				infoWindow.setContent(this.content);
				infoWindow.open(map, this);
			});
		};
		mapInfo.createNb++;
		if(storeInfo.id != null){
			clickCurrentMarker();
		}
	} else {
		alert("map already created");
		map.setCenter(new google.maps.LatLng(mapInfo.centerLat,
			mapInfo.centerLng));
		map.setZoom(mapInfo.mapZoom);
		if(storeInfo.id != null){
			clickCurrentMarker();
		}
	}

	function clickCurrentMarker(){
		console.log(storeInfo.id);
		console.log(markers.length);
		console.log(markers[storeInfo.id].content);
		google.maps.event.trigger(markers[storeInfo.id], 'click');
	}

}

function populatedb(tx, results) {
	if (results.rows.length == 0) {
		// alert("no data");
		jsonpopulate();
	} else {
		//old version data loading
		alert("db already full");
		gotlog(tx, results);
	}
}

function displayList() {
	// alert("in display");

	$.mobile.loading('hide');
	$('#store-list').empty();
	alert("number of line in display: " + mapInfo.distances.length);

	for ( var i = 0; i < mapInfo.distances.length; i++) {
		var tmpId = Number(mapInfo.distances[i].id);
		var tmpDistance = mapInfo.distances[i].distance;
		// alert(tmpId+ " : " + tmpDistance);
		var myId = storeInfo.result.rows.item(tmpId).id;
		var tmpName = storeInfo.result.rows.item(tmpId).name;
		var tmpBrand = storeInfo.result.rows.item(tmpId).brand;
		var tmpAddress = storeInfo.result.rows.item(tmpId).address;
		$('#store-list').append(
			'<li data-icon="false"><a href="#headline" data-transition="slide" data-id="'
			+ myId + '">' + '<img src="img/' + tmpBrand + '.png"/>'
			+ '<h3>' + tmpName + '</h3><p>' + tmpAddress
			+ '</p><span class="ui-li-count">' + tmpDistance
			+ '</span></a></li>');
	}
	$('#store-list').listview('refresh');
	//storeCurrentList();
	
	
}

// Save the current home Page
function storeCurrentList(){
	alert("in save current list");
	db.transaction(function(tx) {
		var tmpContent = $('#store-list').html();
		alert(tmpContent);
		tx.executeSql("insert into contentList(id,content) values(?,?)",
			[0, tmpContent]);
		tx.executeSql("insert into contentList(id,content) values(?,?)",
			[1, "test test"]);
	});
}

function loadOldList(){
	alert("in Load list");
	var tmpContent = "null";
	db.transaction(function(tx) {
		tx.executeSql("select * from contentList",[], successCB);
		function successCB (tx, results){
			alert ("in SCB");
			alert (results.rows.item(0).content);
			$('#store-list').append(results.rows.item(0).content);
		}
	});
}


function gotlog(tx, results) {
	console.log("in gotlog");
	$('#getLocation').on("tap", getMyPos);
	if (results.rows.length == 0) {	
		alert("no data");
		return false;
	} else {
		storeInfo.result = results;
		console.log("storeInfo length : "+ storeInfo.result.rows.length);
		console.log("item id 0 in storeInfo : "+ storeInfo.result.rows.item(0).name);
	}
};

function getMyPos() {
	// hide button for geolocation

	$("#twobutt").empty();
	// $("#getLocation").hide();
	// $("#goMap").hide();
	// show footer
	$("#homefooter").show();

	alert("in getMyPos");
	var options = {
		enableHighAccuracy : true,
		maximumAge : 300,
		timeout : 2000
	};

	var onSuccess = function(position) {
		// alert("in onSuccess");
		alert('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: '
			+ position.coords.longitude + '\n');
		// set the origin for the distance calc using the geolocation result
		// ***uncomment the first two when outside city test is
		// done**********
		alert("before test");
		alert(mapInfo.maxLat);
		var test1 = position.coords.latitude < mapInfo.maxLat;
		var test2 = position.coords.longitude < mapInfo.maxLng;
		var test3 = mapInfo.minLng < position.coords.longitude;
		var test4 = mapInfo.minLat < position.coords.latitude;
		alert(test1 + " " + test2 + " " + test3 + " " + test4);
		if (test1 && test2 && test3 && test4) {
			alert("in if");
			mapInfo.currentLat = position.coords.latitude;
			mapInfo.currentLng = position.coords.longitude;
			initDistCalc();
		} else {
			alert(" You are not in Shanghai. Impossible to calculate distances from your current position");
			initDistCalc();
		}
	};

	var onError = function(error) {
		// alert("in error");
		alert('error code: ' + error.code + '\n' + 'message: ' + error.message
			+ '\n');
		alert("impossible to get your current position. Make sure you authorize shanghaiCoffee to access your location");
		initDistCalc();
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

function jsonpopulate() {
	// alert("in json function");
	$.getJSON("ajax/storeSub.json",
		function(data) {
			// alert(data);
			db.transaction(function(tx) {
				$.each(data,
					function(key, val) {
						tx
						.executeSql(
							"insert into storeSub(storeId,subwayId,distanceText,distanceValue) values(?,?,?,?)",
							[
							val.storeId,
							val.subId,
							val.distanceText,
							val.distanceValue]);
					});
							// alert("insert done");
							tx.executeSql("select * from storeSub",
								[], function(tx,result){
						// alert("lol");
					}
					,errorHandler);
						});

		});

	$.getJSON("ajax/subway.json",
		function(data) {
			// alert(data);
			db.transaction(function(tx) {
				$.each(data,
					function(key, val) {
						// console.log(val.id +", "+val.station+", "+val.line+", "+val.lat+", "+val.lng);

						tx
						.executeSql(
							"insert into subway(id,station,line,lat,lng) values(?,?,?,?,?)",
							[
							val.id,
							val.station,
							val.line,
							val.lat,
							val.lng]);

						// console.log("lol");
					});
				// alert("insert subway lol");
				tx.executeSql("select * from subway",
					[], function(tx,result){
						// alert("select subway");
					}
					,errorHandler);
			});
		});

	$.getJSON(
		"ajax/costa.json",
		function(data) {
			// alert(data);
			db
			.transaction(function(tx) {
				$.each(data,
					function(key, val) {
						tx
						.executeSql(
							"insert into store(id,wifi,latte,brand,name,address,lat,lng) values(?,?,?,?,?,?,?,?)",
							[
							val.id,
							val.wifi,
							val.latte,
							val.brand,
							val.name,
							val.address,
							val.lat,
							val.lng ]);
					});

				// alert("after insert");
				tx.executeSql("select * from store",
					[], gotlog, errorHandler);
			});

		});
}
