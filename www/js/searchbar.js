	function search(){
		// alert("Something happened!");
		var searchTerm = $("#search-1").val();
		// alert("You're trying to search for "+searchTerm);
		db.transaction(function(tx) {
			tx.executeSql("select id from subway where station = ?", [searchTerm], function(tx, result){
				// alert("StationId = " + result.rows.item(0).id);
				var StationId = result.rows.item(0).id;
				tx.executeSql("select storeId, distanceValue, distanceText from storeSub where subwayId = ?",
					[StationId],function(tx, results){
						storeInfo.result = [];
						mapInfo.distances =[];
						for (var i = results.rows.length - 1; i >= 0; i--) {
							var tmpId = results.rows.item(i).storeId;
							var tmpDistVal = results.rows.item(i).distanceValue;
							var tmpDistText = results.rows.item(i).distanceText;

							mapInfo.distances.push( {
								id : tmpId,
								distanceText : new String(tmpDistText),
								distanceValue: tmpDistVal
							});
							console.log("mapInfo.distances test: "+ mapInfo.distances[0].id+", "+mapInfo.distances[0].distanceText);
							console.log(tmpId);
							tx.executeSql("select * from store where id = ?",
								[tmpId],function(tx, result){
									console.log("name: " + result.rows.item(0).name + "latte: "+ result.rows.item(0).latte);
									storeInfo.result.push({
										id : result.rows.item(0).id,
										wifi: result.rows.item(0).wifi,
										latte: result.rows.item(0).latte,
										brand: result.rows.item(0).brand,
										name: result.rows.item(0).name,
										address: result.rows.item(0).address,
										open: result.rows.item(0).open,
										description: result.rows.item(0).description,
										lat: result.rows.item(0).lat,
										lng: result.rows.item(0).lng,
									});
									// alert(storeInfo.result);
								},errorHandler);
						};
						// alert(storeInfo.result);
					// alert(storeInfo.result.rows.length);
				},errorHandler);
},function(){alert("No ssearch result, please enter a valid subway station")});
},errorHandler, displaySearchResult);
}	


function displaySearchResult() {
	console.log("in displaySearchResult");
	// hide button for geolocation
	$("#twobutt").empty();
	// show footer
	$("#homefooter").show();
	// remove previous content of the list
	$('#store-list').empty();
	console.log("number of line in display: " + mapInfo.distances.length);

	for ( var i = 0; i < mapInfo.distances.length && i<40 ; i++) {
		var tmpId = Number(mapInfo.distances[i].id);
		var tmpDistance = mapInfo.distances[i].distanceText;
		var tmpIndex = getStoreIndexById(tmpId);
		
		var storeId = storeInfo.result[tmpIndex].id;
		var tmpName = storeInfo.result[tmpIndex].name;
		var tmpBrand = storeInfo.result[tmpIndex].brand;
		var tmpAddress = storeInfo.result[tmpIndex].address;
		$('#store-list').append(
			'<li data-icon="false"><a href="#headline" data-transition="slide" data-id="'
			+ storeId + '" data-dist="'+tmpDistance+'">' 
			+ '<img src="img/' + tmpBrand + '.png"/>'
			+ '<h3>' + tmpName + '</h3><p>' + tmpAddress
			+ '</p><span class="ui-li-count">' + tmpDistance
			+ '</span></a></li>');
	}
	$('#store-list').listview('refresh');
	storeCurrentList();	
	
}