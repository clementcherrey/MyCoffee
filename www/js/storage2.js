/**
 * Created by clement on 12/29/14.
 */
 function init() {
 	console.log("in init");
 	//****FOR BROWSER*****//
 			$( document ).ready(function() {
			deviceready();
		}); 	

 	//****FOR PHONE*****//
 	document.addEventListener("deviceready", deviceready, true);
 }
 var db;

 function deviceready() {
 	console.log("in deviceready");
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
 	}

 	function errorHandler(e) {
 		alert(e.message);
 	}

 	function dbReady() {
 	// loadOldList();
	console.log("in db ready");
	db.transaction(function(tx) {
		tx.executeSql("select * from store order by id asc", [], populatedb,
			errorHandler);

		tx.executeSql("select * from contentList", [], checkPreviousList,
			errorHandler);
	});

	// the 2 buttons to use geolocation
	$('#getLocation').on("tap", getMyPos);
	$('#getLocation2').on("tap", getMyPos);

	$("#store-list").on('vclick', 'li a', function() {
		storeInfo.id = $(this).attr('data-id');
		storeInfo.distance = $(this).attr('data-dist');
		$("body").pagecontainer("change", "#headline", {
			role : "page"
		});
	});

	$( "#searchForm" ).submit(function( event ) {
  	console.log( "Handler for .submit() called." );
  	event.preventDefault();
  	search();
	});

$("#headline").on('pagebeforeshow',headlinePreDisplay);

$("#main").on('pageshow', initMap);
}


var storeInfo = {
	id : null,
	distance: null,
	result : null
};

var subway ={

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

function checkPreviousList(tx, results){
	if (results.rows.length == 0) {
		alert("no list before");
	} else {
		alert("content previoussly stored");
		loadOldList();
	}
}

// Save the current home Page
function storeCurrentList(){
	alert("in save current list");
	db.transaction(function(tx) {
		var tmpContent = $('#store-list').html();
		var contentString = new String(tmpContent);
		// console.log(tmpContent);
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
			console.log ("in SCB");
			console.log ("loaded content: " +results.rows.item(0).content);
			console.log (results.rows.item(1).content);
			$('#store-list').append(results.rows.item(1).content);
		}
	});
}


function gotlog(tx, results) {
	console.log("in gotlog");
	if (results.rows.length == 0) {	
		alert("no data");
		return false;
	} else {
		 storeInfo.result = results;
		// console.log("results length: "+results.rows.length);
		// 		for (var i = results.rows.length - 1; i >= 0; i--) {
		// 			storeInfo.result.push({
		// 				id : results.rows.item(i).id,
		// 				wifi: results.rows.item(i).wifi,
		// 					latte: results.rows.item(i).latte,
		// 				brand: results.rows.item(i).brand,
		// 				name: results.rows.item(i).name,
		// 				address: results.rows.item(i).address,
		// 				lat: results.rows.item(i).lat,
		// 				lng: results.rows.item(i).lng,
		// 			});
		// 		};
		// console.log("storeInfo length : "+ storeInfo.result.rows.length);
		// console.log("item id 0 in storeInfo : "+ storeInfo.result.rows.item(0).name);
	}
};

function getMyPos() {
	// hide button for geolocation
	$("#twobutt").empty();
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
			preCalc();
		} else {
			alert(" You are not in Shanghai. Impossible to calculate distances from your current position");
			preCalc();
		}
	};

	var onError = function(error) {
		// alert("in error");
		alert('error code: ' + error.code + '\n' + 'message: ' + error.message
			+ '\n');
		alert("impossible to get your current position. Make sure you authorize shanghaiCoffee to access your location");
		preCalc();
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

// $.getJSON(
// 		"ajax/starbucks.json",
// 		function(data) {
// 			// alert(data);
// 			db
// 			.transaction(function(tx) {
// 				$.each(data,
// 					function(key, val) {
// 						tx
// 						.executeSql(
// 							"insert into store(id,wifi,latte,brand,name,address,lat,lng) values(?,?,?,?,?,?,?,?)",
// 							[
// 							val.id + 84,
// 							val.wifi,
// 							val.latte,
// 							val.brand,
// 							val.name,
// 							val.address,
// 							val.lat,
// 							val.lng ]);
// 					});

// 				alert("after insert");
// 				tx.executeSql("select * from store",
// 					[], gotlog, errorHandler);
// 			});

// 		});

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

				alert("after insert");
				tx.executeSql("select * from store",
					[], gotlog, errorHandler);

			// getStarbucks();

			});

		});
}
