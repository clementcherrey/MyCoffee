
function checkPreviousList(){
	console.log("in check previous List");
	db.transaction(function(tx) {
		tx.executeSql("select * from contentList", [], loadOldList,
			errorHandler);
	});
}


function loadLastPosition(){
	db.transaction(function(tx) {
		tx.executeSql("select lastLat,lastLng from userParam where id = ?", [0],
			function(tx, result){ 
				mapInfo.currentLat = result.rows.item(0).lastLat;
				mapInfo.currentLng = result.rows.item(0).lastLng;
				console.log("Last position loaded");
			},errorHandler);
	});
}

function loadOldList(tx,results){
	// console.log("in Load list");
	if (results.rows.length == 0) {
		console.log("no list before");
		loadLastPosition();
		// display welcome message here
	} else {
		for (var i = 0; i < results.rows.length; i++) {
			$('#store-list').append('<li data-icon="false">'
				+results.rows.item(i).content+'</li>');
		}
		$('#store-list').listview('refresh');
		console.log("after puttting the html");
		storeInfo.result =[];
		$('#store-list > li > a').each(function () {
			// console.log("in each");
			var tmpId = $(this).attr('data-id');
			// console.log("current data-id fetch: " + tmpId);
			tx.executeSql("select * from store where id = ?",
				[tmpId],function(tx, result){
					console.log(result);
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
				},function(tx,error){console.log("Could not find store")});
		});
		loadLastPosition();
	}
}

function storeCurrentList(){
	console.log("in save current list");
	db.transaction(function(tx) {
		tx.executeSql("DROP TABLE contentList",[], 
    		function(tx,results){console.log("Successfully Dropped")},
    		function(tx,error){console.log("Could not delete")}
		);
		tx.executeSql('create table contentList('
 			+ 'id INTEGER PRIMARY KEY,' 
 			+ 'content TEXT)',[], 
    		function(tx,results){console.log("Successfully created contentList")},
    		function(tx,error){console.log("Could not create contentList")}
		);

		console.log("currentLat = " +mapInfo.currentLat);
		tx.executeSql('UPDATE userParam SET lastLat=?,lastLng=?',[mapInfo.currentLat,mapInfo.currentLng], 
    		function(tx,results){console.log("Successfully UPDATE userParam")},
    		function(tx,error){console.log("Could not UPDATE userParam")}
		);


		console.log("number of li selected: "+ $( '#store-list li').length);

		$('#store-list li').each(function(i) {
			console.log("this = "+ this);
  			var tmpContent = new String($(this).html());
  			console.log(tmpContent);		
  			tx.executeSql("insert into contentList(content) values(?)",
			[tmpContent], 
    		function(tx,results){console.log("Successfully inserted")},
    		function(tx,error){console.log("Could not insert")});
		});
	});
}