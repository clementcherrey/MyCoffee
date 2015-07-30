var mapInfo = {
	createNb : 0,
	centerLat : 31.225523,
	centerLng : 121.491344,
	mapZoom : 16,
	currentLat : 31.2278431219,
	currentLng : 121.5198713565,
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


function initEdit() {
	console.log("in init edit");
	$( document ).ready(function() {
		setupDB();
	}); 	

	function setupDB(){
		console.log("in setupDB");
		db = window.openDatabase("store", "1.0", "store_list", 10000000);
		db.transaction(createTables, errorHandler, function(tx){console.log("Success createTables")});
	}

	function createTables(tx) {
		console.log("in createTables");
	tx.executeSql('DROP TABLE store');
	 // tx.executeSql('DROP TABLE subway');
	 // tx.executeSql('DROP TABLE storeSub');
	 // tx.executeSql('DROP TABLE contentList');
	 // tx.executeSql('DROP TABLE userParam');

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

	//Populate the DB with all stores
	// addAllBrands(loadAllinCache);	

	// add only one brand
	putBrandinDB("newSB", loadAllinCache);
}

function errorHandler(e) {
	console.log("errorHandler report: " +e.message);
}


function putBrandinDB(brand, callback){
	console.log("in put brand: "+brand);
	$.getJSON(
		"ajax/"+ brand +".json",
		function(data) {
			db.transaction(function(tx) {
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
							val.lng ], 
							function(){
								// console.log("Success!");
							},
							function errorHandler(transaction, error) {
								alert("Error : " + error.message);
							});
					});
				console.log("after insert"+brand);
				callback();
			});
		});
}

function addAllBrands(callback){
	console.log("in addAllBrands");
		//Get the list of brand from json file
		var tmpBrandArray = [];
		$.getJSON(
			"ajax/listBrands.json",
			function(data) {	
				$.each(data,
					function(key, val) {
						tmpBrandArray.push(val.brand);
					}
					);
				console.log("tmpBrandArray length = "+tmpBrandArray.length);
				console.log(tmpBrandArray);
				myLoop();
			});

		// Synchronous Loop to add brand
		var i = 0; 
		var myLoop = function  () {
			if (i < tmpBrandArray.length ){
				putBrandinDB(tmpBrandArray[i],myLoop);
				i++;
			}else{
				callback();
			}
		}
	}

}