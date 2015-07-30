function initDB() {
	console.log("in initDB");
	db = window.openDatabase("store", "1.0", "store_list", 1000000);
	db.transaction(createTable, errorHandler, isDBfull);

	function createTable(tx){
		// tx.executeSql('DROP TABLE store');
		// tx.executeSql('DROP TABLE subway');
		// tx.executeSql('DROP TABLE storeSub');
		// tx.executeSql('DROP TABLE contentList');
		// tx.executeSql('DROP TABLE userParam');
		// tx.executeSql('DROP TABLE brand');
		// tx.executeSql('DROP TABLE onlinePack');

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

		tx.executeSql('create table if not exists brand('
			+ 'id INTEGER PRIMARY KEY,' 
			+ 'name TEXT)');

		tx.executeSql('create table if not exists onlinePack('
			+ 'id INTEGER PRIMARY KEY,' 
			+ 'url TEXT,'
			+ 'brand_id INTEGER,'
			+ 'complete BOOLEAN,'
			+ 'FOREIGN KEY (brand_id) REFERENCES brand (id))');

		tx.executeSql('create table if not exists userParam('
			+ 'id INTEGER PRIMARY KEY,'
			+ 'userName TEXT,'
			+ 'firstTime BOOLEAN,'
			+ 'geolocTap BOOLEAN,'
			+ 'searchTap BOOLEAN,'
			+ 'downloadSM BOOLEAN,'
			+ 'unzipSM BOOLEAN,'
			+ 'welcomeMsg INTEGER,'
			+ 'lastLat FLOAT,'
			+ 'lastLng FLOAT,'
			+ 'vpn BOOLEAN)');

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

	function isDBfull (){
		var dBfull;
		db.transaction(function(tx) {
 			tx.executeSql("SELECT id FROM userParam;", [], 
 				function(tx, rs){
 					 console.log(rs.rows.length);
 					 if (rs.rows.length == 0) {
 					 	populateDB();
 					 }else{
						tx.executeSql("select station from subway",[],
						 populateSubList,errorHandler);
						sayFinish();
 					 };
 				},errorHandler);
 		});
	}


	function populateDB(){
		console.log("in populateDB");
		function popStore(){
			$.getJSON(
				"ajax/allStores.json",
				function(data) {
					function myfunction(){
						var deferredObject = $.Deferred();
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
											val.lng ]);
									});
								console.log("in transaction");
							},errorHandler,function(){deferredObject.resolve();} ); 
						console.log("Finish popStore");
						// console.log("stop");
						return deferredObject.promise();
					}

					var myStores = myfunction();

					$.when(myStores).done(function() {
						// console.log("stop 2");
						console.log("DONE!");
						sayFinish();
					});

				});	
		}	
		popStore();
		popBrand();
		popContentList();
		popOnlinePack();
		popUserParam();
		popSubway();
		popStoreSub();
}	


	var popContentList = function(){}
	

	var popBrand = function(){
		db.transaction(function(tx) {
			tx.executeSql("insert into brand(name) values(?)",
				["costa"]);
			tx.executeSql("insert into brand(name) values(?)",
				["wagas"]);
			tx.executeSql("insert into brand(name) values(?)",
				["starbucks1"]);
			tx.executeSql("insert into brand(name) values(?)",
				["starbucks2"]);
		});
	}

	var popOnlinePack =function(){
		db.transaction(function(tx) {
			tx.executeSql("insert into onlinePack(url,brand_id,complete) values(?,?,?)",
				["http://smmap.oss-cn-hangzhou.aliyuncs.com/costaMap.zip",1,false]);

			tx.executeSql("insert into onlinePack(url,brand_id,complete) values(?,?,?)",
				["http://smmap.oss-cn-hangzhou.aliyuncs.com/WagMap.zip",2,false]);

			tx.executeSql("insert into onlinePack(url,brand_id,complete) values(?,?,?)",
				["http://smmap.oss-cn-hangzhou.aliyuncs.com/Sb1Map.zip",3,false]);

			tx.executeSql("insert into onlinePack(url,brand_id,complete) values(?,?,?)",
				["http://smmap.oss-cn-hangzhou.aliyuncs.com/Sb2Map.zip",4,false]);
		});
	}

	var popUserParam = function(){
		db.transaction(function(tx) {
				tx.executeSql("insert into userParam(id,userName,firstTime,geolocTap,searchTap,downloadSM,unzipSM,welcomeMsg,lastLat,lastLng,vpn) values(?,?,?,?,?,?,?,?,?,?,?)",
			[0,"localUser",false,false,false,false,false,0,31.225523,121.491344,false]);
		});
	}

	var popSubway = function(){
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
				tx.executeSql("select station from subway",
					[], populateSubList,errorHandler);
			});
		});
	}

	var popStoreSub = function(){
		$.getJSON("ajax/storeSub.json",
			function(data) {
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
			});
		});
	}

	function sayFinish(){
		console.log("Finish");
		$.event.trigger({type: "DBready"});
	}

	function populateSubList(tx, results) {
		for (var i = results.rows.length - 1; i >= 0; i--) {
			var tmpStation = results.rows.item(i).station;
			$('#autocomplete').append(
				'<li>'+ tmpStation +'</li>');	
		}
		$('#autocomplete').listview('refresh');
	};

}

var errorHandler = function(error){
	console.log("errorHandler report: " +error.message);
}
