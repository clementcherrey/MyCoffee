/**
 * Created by clement on 12/29/14.
 */
function init() {
	// alert("in init");
	document.addEventListener("deviceready", deviceready, true);

}
var db;

function deviceready() {
	db = window.openDatabase("store", "1.0", "store_list", 10000000);
	db.transaction(setup, errorHandler, dbReady);
}

function setup(tx) {
	tx.executeSql('create table if not exists store('
			+ 'id INTEGER PRIMARY KEY AUTOINCREMENT, ' + ' name TEXT,'
			+ ' added DATE,' + ' brand TEXT,' + ' comfort FLOAT,'
			+ ' location TEXT,' + ' lat FLOAT,' + ' lng FLOAT,'
			+ 'distance TEXT)');
	// alert("table created");

	// to test json
	tx.executeSql('create table if not exists phones('
			+ 'id INTEGER PRIMARY KEY AUTOINCREMENT, ' + ' phone TEXT,'
			+ ' os TEXT,' + ' size_inch FLOAT,' + ' size_cm FLOAT,'
			+ ' ppi ININTEGER)');
	alert("table jsoncreated");

}

function errorHandler(e) {
	alert(e.message);
}

function dbReady() {
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

	$("#headline")
			.on(
					'pagebeforeshow',
					function() {
						// alert("in headline before show");
						$('#store-data').empty();
						for ( var i = 0; i < storeInfo.result.rows.length; i++) {
							if (i == storeInfo.id) {
								// alert("in the if");
								var tmpName = storeInfo.result.rows.item(i).name;
								var tmpBrand = storeInfo.result.rows.item(i).brand;
								var tmpComfort = storeInfo.result.rows.item(i).comfort;
								var tmpLocation = storeInfo.result.rows.item(i).location;

								mapInfo.centerLat = storeInfo.result.rows
										.item(i).lat;
								mapInfo.centerLng = storeInfo.result.rows
										.item(i).lng;
								mapInfo.mapZoom = 14;

								$('#store-data')
										.append(
												'<li><span class="store-name">'
														+ tmpName
														+ '</span></br>'
														+ '<span class="store-name"><img src="img/45.png"/></span></br>'
														+ '<span class="store-address"> 1376 Nanjing West Road Jingan, Shanghai</span>'
														+ '</li>');
								$('#store-data')
										.append(
												'<li><div class="ui-grid-a grids">'
														+ '<div class="ui-block-a"><img class="info1" src="img/'
														+ tmpBrand
														+ '.png"/></div>'
														+ '<div class="ui-block-b"><div><p><span>Distance: 1.3 km</span></br>'
														+ '<span>Wifi : YES</span></p></div>'
														+ '</div></li>');
								$('#store-data')
										.append(
												'<li style="white-space:normal;"><p style="font-size: medium;white-space:normal;"><span style="bold">Subway: Century Avenue (line 2)</span></br>'
														+ '<span style="bold">Tips :</span> Take exit 4 from the century avenue station then walk 100m along lolilol street, you will see the starbucks on your left. It is located in front a big Lianhua supermarket</span></p></li>');
								$('#store-data')
										.append(
												'<li><div class="ui-grid-a">'
														+ '<div class="ui-block-a"><div class="ui-body ui-body-d"><span class="info1">Comfort : '
														+ tmpComfort
														+ '</span><span class="info1"><img src="img/150.png"/></span></div></div>'
														+ '<div class="ui-block-b"><div class="ui-body ui-body-d"><span class="info1">Size : '
														+ tmpComfort
														+ '</span><span class="info1"><img src="img/size.png"/></span></div></div>'
														+ '</div></li>');
								$('#store-data').append(
										'<li style="white-space:normal;">Description :'
												+ tmpLocation + '</li>');
								$('#store-data').listview('refresh');
							}
						}
						;
						$('#store-data').listview('refresh');
					});

	$("#main")
			.on(
					'pageshow',
					function() {
						// alert("in map show");
						// test de geolocation

						if (mapInfo.createNb == 0) {
							var map;
							var mapOptions = {
								zoom : mapInfo.mapZoom,
								center : new google.maps.LatLng(
										mapInfo.centerLat, mapInfo.centerLng)
							};
							map = new google.maps.Map(document
									.getElementById('map_canvas'), mapOptions);
							for ( var i = 0; i < storeInfo.result.rows.length; i++) {
								var tmplat = storeInfo.result.rows.item(i).lat;
								var tmplng = storeInfo.result.rows.item(i).lng;
								var tmpLatlng = new google.maps.LatLng(tmplat,
										tmplng);

								var tmpName = storeInfo.result.rows.item(i).name;
								var tmpBrand = storeInfo.result.rows.item(i).brand;
								var tmpAddress = "1376 Nanjing West Road Jingan, jianpu district";

								var contentString = '<div>'
										+ '<img class="info1" src="img/mini-'
										+ tmpBrand + '.png"/>' + '<h13>'
										+ tmpName + '</h3><div>' + tmpAddress
										+ '</div>';

								var infowindow = new google.maps.InfoWindow( {
									content : contentString
								});

								var marker = new google.maps.Marker( {
									position : tmpLatlng,
									map : map,
									icon : 'img/old-cup.png',
									infowindow : infowindow
								});

								google.maps.event.addListener(marker, 'click',
										function() {
											this.infowindow.open(map, this);
										});
							}
							;
						} else {
							// alert("map already created");
							map.setCenter(new google.maps.LatLng(
									mapInfo.centerLat, mapInfo.centerLng));
							map.setZoom(mapInfo.mapZoom);
						}
					});
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
	title : "coffee shop in Shanghai"
};

function populatedb(tx, results) {
	if (results.rows.length == 0) {
		// alert("no data");
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[
								"Starbucks Century Avenue",
								"starbucks",
								4.1,
								"Choose the Selection tool appropriate to your purpose. Your choices, and how they work, are as follows: the Rectangle Select tool that lets you select any rectangular section of your image; the Ellipse Select tool that lets you select any elliptical or circular area in your image;",
								31.225523, 121.491344, "0 km" ]);
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[ "store starbucks 2", "starbucks", 4.2, "unknow",
								31.228562, 121.512470, "0 km" ]);
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[ "store starbucks 3", "starbucks", 4.3, "unknow",
								31.228268, 121.516761, "0 km" ]);
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[ "store starbucks 4", "starbucks", 4.4, "unknow",
								31.239423, 121.484489, "0 km" ]);
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[ "store starbucks 5", "starbucks", 4.5, "unknow",
								31.220928, 121.475048, "0 km" ]);
		tx
				.executeSql(
						"insert into store(name,brand,comfort,location,lat,lng,distance) values(?,?,?,?,?,?,?)",
						[ "store starbucks 6", "starbucks", 4.6, "unknow",
								31.226800, 121.463718, "0 km" ]);

		// alert("new data added");
		tx.executeSql("select * from store order by id asc", [], gotlog,
				errorHandler);

	} else {
		// alert("db already full");
		gotlog(tx, results);
	}
	;

}

function displayList() {
	alert("in display");

	$.mobile.loading('hide');

	$('#store-list').empty();
	for ( var i = 0; i < mapInfo.distances.length; i++) {
		// old version
		// var tmpName = storeInfo.result.rows.item(i).name;
		// var tmpBrand = storeInfo.result.rows.item(i).brand;
		// var tmpComfort = storeInfo.result.rows.item(i).comfort;
		// var tmpLocation = storeInfo.result.rows.item(i).location;
		// var tmpDistance = mapInfo.distances[i].distance;

		// new version
		alert(mapInfo.distances[i].id);
		var tmpId = Number(mapInfo.distances[i].id);
		alert(tmpId);
		var tmpDistance = mapInfo.distances[i].distance;
		alert(tmpId + " , " + tmpDistance);

		var tmpName = storeInfo.result.rows.item(tmpId).name;
		var tmpBrand = storeInfo.result.rows.item(tmpId).brand;
		alert(tmpName + " , " + tmpBrand);

		$('#store-list').append(
				'<li><a href="#headline" data-transition="slide" data-id="' + i
						+ '">' + '<img src="img/' + tmpBrand + '.png"/>'
						+ '<h3>' + tmpName + '</h3>' + '<div id="dist_' + i
						+ '_">' + tmpDistance + '</div></a></li>');
	}
	$('#store-list').listview('refresh');
}

function gotlog(tx, results) {
	alert("in gotlog");

	// ***************************
	// test parsing json file
	testjson();
	// ***************************

	$('#getLocation').on("tap", getMyPos);

	if (results.rows.length == 0) {
		alert("no data");
		return false;
	} else {
		storeInfo.result = results;
	}
};

function getMyPos() {
	// hide button for geolocation
	$("#getLocation").hide();

	// alert("in getMyPos");
	var options = {
		enableHighAccuracy : true,
		maximumAge : 300,
		timeout : 10000
	};

	var onSuccess = function(position) {
		// alert("in onSuccess");
		alert('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: '
				+ position.coords.longitude + '\n');
		// set the origin for the distance calc using the geolocation result
		mapInfo.currentLat = position.coords.latitude;
		mapInfo.currentLng = position.coords.longitude;
		alert("real position of the user:" + position.coords.latitude);
		alert("lat store in map info:" + mapInfo.currentLat);
		initDistCalc();

	};

	var onError = function(error) {
		alert("in error");
		alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		initDistCalc();
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

function initDistCalc() {
	var tableLatLng = [];
	for ( var i = 0; i < storeInfo.result.rows.length; i++) {
		// alert("boucle one time");
		var tmpLat = storeInfo.result.rows.item(i).lat;
		var tmpLng = storeInfo.result.rows.item(i).lng;
		tableLatLng[i] = new google.maps.LatLng(tmpLat, tmpLng);
	}
	calculateDistances(tableLatLng);
}

function calculateDistances(tableLL) {
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
	}, callbackDistance);
}

function callbackDistance(response, status) {
	// alert("in callback");
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {

		// mapInfo.distances = response.rows[0].elements;
		alert("oe of the distance calculated"
				+ response.rows[0].elements[1].distance.text);
		// alert("before for");
		for ( var i = 0; i < response.rows[0].elements.length; i++) {
			mapInfo.distances.push( {
				id : i,
				distance : new String(
						response.rows[0].elements[i].distance.text)
			});
			// alert('test de distance: ' + mapInfo.distances[i].distance);
		}
		// alert("before diplay");
		sortDistance();
		displayList();
	}
}

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

function testjson() {
	alert("in test json");
	$.getJSON("ajax/phones.json", function(data) {
		alert(data);
		db.transaction(function(tx) {
			$.each(data, function(key, val) {
//				alert("in each");
//				alert(val.phone);
				tx.executeSql(
						"insert into phones (phone,os,ppi) values(?,?,?)", [val.phone, val.os, val.ppi ]);
			}),verify()});
		
	});

	function verify() {
		alert("in verify");
		db.transaction(function(tx) {
		tx.executeSql("select * from phones", [], displayPhone, errorHandler);
		});
	}

	function displayPhone(tx, results) {
		alert("in displayPhone");
		alert(results);
		if (results.rows.length == 0) {
			alert("no data");
			return false;
		} else {
			for ( var i = 0; i < results.rows.length; i++) {
				alert("in for");
				alert(results.rows.item(i).phone);
			}
		}
	}
}
