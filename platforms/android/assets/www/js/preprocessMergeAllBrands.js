function initMerge() {
	console.log("in init merge");
	$( document ).ready(function() {
		setupDB();
	}); 	
}

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

	//Populate the DB
	addAllBrands(loadAllinCache);	
}

function errorHandler(e) {
	console.log("errorHandler report: " +e.message);
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


var cacheArray=[];

function loadAllinCache(){
	console.log("in loadAllinCache");
	cacheArray = [];
	db.transaction(function(tx) {
		tx.executeSql("select * from store",[], putInArray, errorHandler);
	});
	var putInArray = function(tx, result){
		for (var i = result.rows.length - 1; i >= 0; i--) {
			cacheArray.push({
				id : result.rows.item(i).id,
				wifi: result.rows.item(i).wifi,
				latte: result.rows.item(i).latte,
				brand: result.rows.item(i).brand,
				name: result.rows.item(i).name,
				// namecn: result.rows.item(i).namecn,
				addresseng: result.rows.item(i).addresseng,
				addresscn: result.rows.item(i).addresscn,
				open1: result.rows.item(i).open1,
				open2: result.rows.item(i).open2,
				open3: result.rows.item(i).open3,
				open4: result.rows.item(i).open4,
				description: result.rows.item(i).description,
				phone: result.rows.item(i).phone,
				website: result.rows.item(i).website,
				// latbaidu: result.rows.item(i).latbaidu,
				// lngbaidu: result.rows.item(i).lngbaidu,
				lat: result.rows.item(i).lat,
				lng: result.rows.item(i).lng,
			});
		}
		console.log("number of store in cache: "+cacheArray.length);
		console.log(cacheArray);
		$("#printNewLatLng").on( "click", function(){printNewCoordinates()});
	}
}


function printNewCoordinates(){
	console.log("*********************************");
	console.log("--------- NEW COORDINATES -------");
	console.log("*********************************");
	var tmpData = JSON.stringify(cacheArray);
	console.log("tmpData = "+ tmpData);
	sendData(tmpData);
	console.log("*********************************");
}