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
 	// document.addEventListener("deviceready", deviceready, true);
 }
 var db;

 function deviceready() {
 	console.log("in deviceready");
 	// loadScript();
 	db = window.openDatabase("store", "1.0", "store_list", 10000000);
 	db.transaction(setup, errorHandler, dbReady);
 }

// function loadScript() {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'http://maps.google.cn/maps/api/js?region=cn&language=en-US&sensor=true';
//   document.body.appendChild(script);
// }


 function setup(tx) {
//TEST hide navbar footer
	// $("#gpsLoading").hide();
 // suppress drop table
 tx.executeSql('DROP TABLE store');
 tx.executeSql('DROP TABLE subway');
 tx.executeSql('DROP TABLE storeSub');
 tx.executeSql('DROP TABLE contentList');
 tx.executeSql('DROP TABLE userParam');

 tx.executeSql('create table if not exists store('
 	+ ' id INTEGER  PRIMARY KEY, ' 
 	+ ' wifi TEXT,'
 	+ ' latte TEXT,'
 	+ ' name TEXT,'
 	+ ' brand TEXT,' 
 	+ ' addresseng TEXT,'
 	+ ' addresscn TEXT,'  
 	+ ' open1 TEXT,' 
 	+ ' open2 TEXT,' 
 	+ ' open3 TEXT,' 
 	+ ' open4 TEXT,' 
 	+ ' description TEXT,'
 	+ ' phone TEXT,' 
 	+ ' website TEXT,'  
 	+ ' lat FLOAT,'
 	+ ' lng FLOAT)');

 tx.executeSql('create table if not exists contentList('
 	+ 'id INTEGER PRIMARY KEY,' 
 	+ 'content TEXT)');

  tx.executeSql('create table if not exists userParam('
 	+ 'id INTEGER PRIMARY KEY,'
 	+ 'paramname TEXT,'
 	+ 'value TEXT)');

 tx.executeSql('create table if not exists subway('
 	+ ' id INTEGER PRIMARY KEY,' 	
 	+ ' station TEXT,' 
 	+ ' line1 INTEGER,'
 	+ ' line2 INTEGER,'
 	+ ' line3 INTEGER,'
 	+ ' line4 INTEGER,'
 	+ ' lat FLOAT,'
 	+ ' lng FLOAT)');

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
	console.log("errorHandler report: " +e.message);
}

function dbReady() {
 	// loadOldList();
 	// console.log("in db ready");
 	db.transaction(function(tx) {
 		tx.executeSql("select * from store order by id asc", [], populatedb,
 			errorHandler);
 	});

 	// AFTER CUSTOMIZATION print the new coordinates in the console 
	$('#printNewLatLng').on("tap", printNewCoordinates);

	// the 2 buttons to use geolocation
	$('#getLocation').on("tap", getMyPos);
	$('#getLocation1').on("tap", getMyPos);
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


	$("#autocomplete").on('vclick', 'li', function() {
		var searchvalue = $(this).text();
		$("#search-1").val(searchvalue);
		search();
	});

	$("#headline").on('pagebeforeshow',headlinePreDisplay);

	$("#main").on('pageshow', initMap);

	$("#emailMe").on('vclick', emailMeFunction);
}

//////////**************************************************///////////////
//////////******************* ASYNC LOADING ****************///////////////
//link to the javascipt in the bottom of the html
function loadTheMapScript() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://maps.google.cn/maps/api/js?region=cn&language=en-US&sensor=true&'+'callback=initialized';
      document.body.appendChild(script);
    };

//callback after loading
function initialized(){
	console.log("google map script loaded");
	// can put init map here directly maybe
}
//////////**************************************************///////////////


function getStoreIndexById(theId){
	// console.log("getStoreIndexById for id = "+theId);
	for ( var k = 0; k < storeInfo.result.length ; k++) {
		if (storeInfo.result[k].id == theId) {
			return k;
		};
	}
	return null;
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

var contents = [];



function populatedb(tx, results) {
	if (results.rows.length == 0) {
		// alert("no data");
		jsonpopulate();
	} else {
		//old version data loading
		console.log("db already full");
		tx.executeSql("select * from subway",[], populateSubList,errorHandler);
		gotlog(tx, results);
	}
}

function displayList() {
	// alert("in display");

	$.mobile.loading('hide');
	$('#store-list').empty();
	console.log("number of line in display: " + mapInfo.distances.length);

	for ( var i = 0; i < mapInfo.distances.length; i++) {
		var tmpId = Number(mapInfo.distances[i].id);
		var tmpDistance = mapInfo.distances[i].distance;
		// alert(tmpId+ " : " + tmpDistance);
		var myId = storeInfo.result.rows.item(tmpId).id;
		var tmpName = storeInfo.result.rows.item(tmpId).name;
		var tmpBrand = storeInfo.result.rows.item(tmpId).brand;
		var tmpAddress = storeInfo.result.rows.item(tmpId).addresseng;
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

function checkPreviousList(){
	console.log("in check previous List");
	db.transaction(function(tx) {
		tx.executeSql("select * from contentList", [], loadOldList,
			errorHandler);
	});
}

// Save the current home Page
function storeCurrentList(){
	console.log("in save current list");
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

function loadOldList(tx,results){
	// console.log("in Load list");
	// hide button for geolocation
	$("#twobutt").empty();
	// show footer
	$("#homefooter").show();
	if (results.rows.length == 0) {
		console.log("no list before");
	} else {
		$('#store-list').append(results.rows.item(0).content);
		console.log("after puttting the html");
		storeInfo.result =[];
		$('#store-list > li > a').each(function () {
			// console.log("in each");
			var tmpId = $(this).attr('data-id');
			// console.log("current data-id fetch: " + tmpId);
			tx.executeSql("select * from store where id = ?",
				[tmpId],function(tx, result){
					// console.log("number of result: "+result.rows.length);
					// console.log("item 0: "+result.rows.item(0));
					// console.log("name: " + result.rows.item(0).name + "latte: "+ result.rows.item(0).latte);
					storeInfo.result.push({
						id : result.rows.item(0).id,
						wifi: result.rows.item(0).wifi,
						latte: result.rows.item(0).latte,
						brand: result.rows.item(0).brand,
						name: result.rows.item(0).name,
						address: result.rows.item(0).addresseng,
						open1: result.rows.item(0).open1,
						open2: result.rows.item(0).open2,
						open3: result.rows.item(0).open3,
						open4: result.rows.item(0).open4,
						description: result.rows.item(0).description,
						phone: result.rows.item(0).phone,
						website: result.rows.item(0).website,
						lat: result.rows.item(0).lat,
						lng: result.rows.item(0).lng,
					});
				},errorHandler);
		});

	}
}


function gotlog(tx, results) {
	// console.log("in gotlog");
	if (results.rows.length == 0) {	
		console.log("no data");
		return false;
	} else {
	// put data in the cache only after the DB is populate
	checkPreviousList();
}
};


function populateSubList(tx, results) {
for (var i = results.rows.length - 1; i >= 0; i--) {
	var tmpStation = results.rows.item(i).station;
	$('#autocomplete').append(
		'<li>'+ tmpStation +'</li>');	
}
$('#autocomplete').listview('refresh');
};

function getMyPos() {

    $.mobile.loading( "show", {
            text: "custom",
            textVisible: true,
            theme: $.mobile.loader.prototype.options.theme,
            textonly: true,
            html: "<img style='width: 100%;' src='img/load-gps.gif'>"
    });

	console.log("in getMyPos");
	var options = {
		enableHighAccuracy : false,
		maximumAge : 1000,
		timeout : 4000
	};

	var onSuccess = function(position) {
		console.log("Success get my pos");
		console.log('my position Latitude= ' + position.coords.latitude + '\n' + 'Longitude= '
			+ position.coords.longitude + '\n');
		// set the origin for the distance calc using the geolocation result
		// ***uncomment the first two when outside city test is
		// done**********
		console.log("before test");
		console.log(mapInfo.maxLat);
		var test1 = position.coords.latitude < mapInfo.maxLat;
		var test2 = position.coords.longitude < mapInfo.maxLng;
		var test3 = mapInfo.minLng < position.coords.longitude;
		var test4 = mapInfo.minLat < position.coords.latitude;
		console.log(test1 + " " + test2 + " " + test3 + " " + test4);
		if (test1 && test2 && test3 && test4) {
			console.log("test succeed");
			mapInfo.currentLat = position.coords.latitude;
			mapInfo.currentLng = position.coords.longitude;
			preCalc();
		} else {
			// alert(" You are not in Shanghai. Impossible to calculate distances from your current position");
			preCalc();
		}
	};

	var onError = function(error) {
		// alert("in error");
		console.log('error code: ' + error.code + '\n' + 'message: ' + error.message
			+ '\n');
		// alert("impossible to get your current position. Make sure you authorize shanghaiCoffee to access your location");
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
							val.subwayId,
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
						// console.log(val.id +", "+val.station+", "+val.line1+", "+val.lat+", "+val.lng);

						tx
						.executeSql(
							"insert into subway(id,station,line1,line2,line3,line4,lat,lng) values(?,?,?,?,?,?,?,?)",
							[
							val.id,
							val.station,
							val.line1,
							val.line2,
							val.line3,
							val.line4,
							val.lat,
							val.lng]);
					});
				// alert("insert subway lol");
				tx.executeSql("select * from subway",
					[], populateSubList,errorHandler);
			});
		});

	$.getJSON(
		"ajax/starbucks.json",
		function(data) {
			// console.log(data);
			db
			.transaction(function(tx) {
				$.each(data,
					function(key, val) {
						tx
						.executeSql(
							"insert into store(id,wifi,latte,brand,name,addresseng,addresscn,open1,open2,open3,open4,description,phone,website,lat,lng) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
							[
							val.id,
							val.wifi,
							val.latte,
							val.brand,
							val.name,
							val.addresseng,
							val.addresscn,
							val.open1,
							val.open2,
							val.open3,
							val.open4,
							val.description,
							val.phone,
							val.website,
							val.lat,
							val.lng ]);
					});

				// alert("after insert");
				insertCosta();
			});

		});

	function insertCosta(){
		$.getJSON(
			"ajax/costa.json",
			function(data) {
			// alert(data);
			db
			.transaction(function(tx) {
				$.each(data,
					function(key, val) {
	console.log(val.id +", "+val.wifi+", "+val.latte+", "+val.brand+", "+val.lat+", "+val.lng+", "+val.addresseng+", "+val.addresscn+", "
		+val.open1 +", "+val.description+", "+val.phone+", "+val.website+", "+val.name);

						tx
						.executeSql(
							"insert into store(id,wifi,latte,brand,name,addresseng,addresscn,open1,open2,open3,open4,description,phone,website,lat,lng) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
							[
							val.id,
							val.wifi,
							val.latte,
							val.brand,
							val.name,
							val.addresseng,
							val.addresscn,
							val.open1,
							val.open2,
							val.open3,
							val.open4,
							val.description,
							val.phone,
							val.website,
							val.lat,
							val.lng ], 
							function(){console.log("Success!");},
							function errorHandler(transaction, error) {
       						 alert("Error : " + error.message);
   							 });
					});

				console.log("after insert");
				tx.executeSql("select * from store",
					[], gotlog, errorHandler);

			});

		});
	}
}
