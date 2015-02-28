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
	tx
			.executeSql('create table if not exists store('
					+ 'id INTEGER PRIMARY KEY AUTOINCREMENT, ' + ' name TEXT,'
					+ ' brand TEXT,' + ' address TEXT,' + ' lat FLOAT,'
					+ ' lng FLOAT)');
	alert("table created");

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
						$('#header-title').empty();

						for ( var i = 0; i < storeInfo.result.rows.length; i++) {
							if (i == storeInfo.id) {
								// alert("in the if");
								var tmpName = storeInfo.result.rows.item(i).name;
								$('#header-title').append(tmpName);

								var tmpBrand = storeInfo.result.rows.item(i).brand;
								var tmpNote = "4";
								var tmpWifi = "freewifi";
								var tmpAddress = "1376 Nanjing West Road Jingan, jianpu district";
								var tmpStation = "People square";
								var tmpSubwayDetail = "500 metres from exit 4, on your right";
								var tmpDescription = "blablabla bla blablabla blablablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla";
								var tmpDistance = mapInfo.distances[i].distance;
								var tmpSubwayLine = "2";

								mapInfo.centerLat = storeInfo.result.rows
										.item(i).lat;
								mapInfo.centerLng = storeInfo.result.rows
										.item(i).lng;
								mapInfo.mapZoom = 14;


								$('#store-data')
										.append(
												'<li><div class="ui-grid-a">'
														+ '<div class="ui-block-a"><div class="ui-body ui-body-d"><img src="img/'
														+ tmpBrand
														+ '.png"/></div></div>'
														+ '<div class="ui-block-b grids"><div class="ui-body ui-body-d"><p style="white-space:normal;">'
														+ tmpName
														+ '</p><p><img src="img/'
														+ tmpNote
														+ '-stars.png" style="width: 80px;"/></p></div></div>'
														+ '</div></li>');

								$('#store-data')
										.append(
												'<li><div class="ui-grid-a">'
														+ '<div class="ui-block-a grids"><div class="ui-body ui-body-d"><img src="img/'
														+ tmpWifi
														+ '.png"/></div></div>'
														+ '<div class="ui-block-b grids"><div class="ui-body ui-body-d"><p>Distance : '
														+ tmpDistance
														+ '</p></div></div>'
														+ '</div></li>');
								$('#store-data').append(
										'<li style="white-space:normal;"><span style="font-weight:bold;">Address :</span>'
												+ tmpAddress + '</li>');
								$('#store-data')
										.append(
												'<li style="white-space:normal;"><p><span style="font-weight:bold;">Station:'
														+ tmpStation
														+ '</span><img src="img/line'
														+ tmpSubwayLine
														+ '.png"/></p>'
														+ '<p><span id="subway-details>'
														+ tmpSubwayDetail
														+ '</span></p></li>');
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
		alert("no data");
		jsonpopulate();
	} else {
		alert("db already full");
		gotlog(tx, results);
	}
	;

}

function displayList() {
	alert("in display");

	$.mobile.loading('hide');
	$('#store-list').empty();
	alert(mapInfo.distances.length);
	
	for ( var i = 0; i < mapInfo.distances.length; i++) {
		var tmpId = Number(mapInfo.distances[i].id);
		// alert(tmpId);
		var tmpDistance = mapInfo.distances[i].distance;
		// alert(tmpId + " , " + tmpDistance);

		var tmpName = storeInfo.result.rows.item(tmpId).name;
		var tmpBrand = storeInfo.result.rows.item(tmpId).brand;
		var tmpBrand = storeInfo.result.rows.item(tmpId).address;
		// alert(tmpName + " , " + tmpBrand);

		$('#store-list').append(
				'<li data-icon="false"><a href="#headline" data-transition="slide" data-id="' + i
						+ '">' + '<img src="img/' + tmpBrand + '.png"/>'
						+ '<h3>' + tmpName + '</h3><p></p><span class="ui-li-count">' + tmpDistance + '</span></a></li>');
	}
	$('#store-list').listview('refresh');
}

function gotlog(tx, results) {
//	alert("in gotlog");
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
		mapInfo.currentLat = position.coords.latitude;
		mapInfo.currentLng = position.coords.longitude;
		alert("position user lat:" + position.coords.latitude);
		alert("lat map info:" + mapInfo.currentLat);
		initDistCalc();

	};

	var onError = function(error) {
		//alert("in error");
		alert('error code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		initDistCalc();
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

function initDistCalc() {
	//alert("in init cal");
	var divbytwenty = storeInfo.result.rows.length / 20;
	//alert(divbytwenty);
	for ( var j = 0; j < divbytwenty; j++) {
		var counter = j*20;
		//alert ("counter "+counter);
		var tableLatLng = [];
		for ( var i = 0; i < 20 && i < storeInfo.result.rows.length - counter ; i++) {
			var tmpId = counter+i;
			//alert("temp Id" + tmpId);
			var tmpLat = storeInfo.result.rows.item(tmpId).lat;
			var tmpLng = storeInfo.result.rows.item(tmpId).lng;
			tableLatLng[i] = new google.maps.LatLng(tmpLat, tmpLng);
		}
		//alert("length talbe : "+tableLatLng.length);
		calculateDistances(tableLatLng);
	}

	setTimeout(function() {
		sortDistance();
		displayList();
	}, 5000);
}

function calculateDistances(tableLL) {
	//alert("in calculate");
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

var callbackBase = -20;

function callbackDistance(response, status) {

	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {
		callbackBase += 20;
		//alert(callbackBase);
//		alert("one distance calculated"
//				+ response.rows[0].elements[1].distance.text);
		// alert("before for");
		for ( var i = 0; i < response.rows[0].elements.length; i++) {
			var valueId = callbackBase + i;
			if(true){
			mapInfo.distances.push( {
				id : valueId,
				distance : new String(
						response.rows[0].elements[i].distance.text)
			});
			}
			// alert('test de distance: ' + mapInfo.distances[i].distance);
		}
		// alert("before diplay");
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

function jsonpopulate() {
	alert("in json function");
	$
			.getJSON(
					"ajax/costa.json",
					function(data) {
						alert(data);
						db
								.transaction(function(tx) {
									$
											.each(
													data,
													function(key, val) {
														// alert("in
														// each");
														// alert(val.name);
														tx
																.executeSql(
																		"insert into store(name,brand,address,lat,lng) values(?,?,?,?,?)",
																		[
																				val.name,
																				val.brand,
																				val.address,
																				val.lat,
																				val.lng ]);
													});

									tx
											.executeSql(
													"select * from store order by id asc",
													[], gotlog, errorHandler);
								});

					});

}
