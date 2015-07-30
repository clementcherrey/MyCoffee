var searchTerm;
	function search(){
		// alert("Something happened!");
		searchTerm = $("#search-1").val();
		// reset serch field
		$("#search-1").val("");
		$('#autocomplete').listview('refresh');
		// update reference 
		$("#span-pos").text(searchTerm);
		// search in DB
		db.transaction(function(tx) {
			tx.executeSql("select * from subway where station = ?", [searchTerm], function(tx, result){
				// alert("StationId = " + result.rows.item(0).id);
				var StationId = result.rows.item(0).id;
				console.log("lat and lng = "+ result.rows.item(0).lat+ ", "+result.rows.item(0).lng);
				mapInfo.currentLat = result.rows.item(0).lat;
				mapInfo.currentLng = result.rows.item(0).lng;

				tx.executeSql("select storeId, distanceValue, distanceText from storeSub where subwayId = ?",
					[StationId],function(tx, results){
						storeInfo.result = [];
						mapInfo.distances =[];
						console.log("number of distance sub found : "+results.rows.length);
						for (var i = results.rows.length - 1; i >= 0; i--) {
							var tmpId = results.rows.item(i).storeId;
							var tmpDistVal = results.rows.item(i).distanceValue;
							var tmpDistText = results.rows.item(i).distanceText;

							mapInfo.distances.push( {
								id : tmpId,
								distanceText : new String(tmpDistText),
								distanceValue: tmpDistVal
							});
							// console.log("mapInfo.distances test: "+ mapInfo.distances[0].id+", "+mapInfo.distances[0].distanceText);
							// console.log(tmpId);
							tx.executeSql("select * from store where id = ?",
								[tmpId],function(tx, result){
									// console.log("name: " + result.rows.item(0).name + "latte: "+ result.rows.item(0).latte);
									storeInfo.result.push({
										id : result.rows.item(0).id,
										wifi: result.rows.item(0).wifi,
										latte: result.rows.item(0).latte,
										brand: result.rows.item(0).brand,
										name: result.rows.item(0).name,
										addresseng: result.rows.item(0).addresseng,
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
						};
					},errorHandler);
},function(){alert("No search result, please enter a valid subway station")});
},errorHandler, displaySearchResult);
}	

function getStoreIndexById(theId){
	// console.log("getStoreIndexById for id = "+theId);
	for ( var k = 0; k < storeInfo.result.length ; k++) {
		if (storeInfo.result[k].id == theId) {
			return k;
		};
	}
	return null;
}

function displaySearchResult() {
	console.log("in displaySearchResult");
	// sort the distance
	sortDistance();
	// 	hide welcome message
	$("#message-wrapper").hide();
	// hide loading animation
	$.mobile.loading( "hide");
	// remove previous content of the list
	$('#store-list').empty();
	console.log("number of line in display: " + mapInfo.distances.length);

	var i = 0; 
	var lastAdded = null;                    //  set your counter to 1
function myLoop () {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
   	// console.log("wow timeout");
		var tmpId = Number(mapInfo.distances[i].id);
		var tmpDistance = mapInfo.distances[i].distanceText;
		var tmpIndex = getStoreIndexById(tmpId);
		var storeId = storeInfo.result[tmpIndex].id;
		var tmpName = storeInfo.result[tmpIndex].name;
		var tmpBrand = storeInfo.result[tmpIndex].brand;
		var tmpAddress = storeInfo.result[tmpIndex].addresseng;
		$('#store-list').append(
			'<li data-icon="false">'
			+'<a id="'+ storeId + '" href="#headline" data-transition="slide" data-id="'
			+ storeId + '" data-dist="'+tmpDistance+'">' 
			+ '<img src="img/icons/' + tmpBrand + '2.png"/>'
			+ '<h3>' + tmpName + '</h3><p>' + tmpAddress
			+ '</p><span class="ui-li-count">' + tmpDistance
			+ '</span></a></li>');

		// apply style to the last added DON'T WORK
		if(lastAdded!=null){
			//reset default font and background
			$('#'+lastAdded+'').css("background", "#FFFFFF");
			$('#'+lastAdded+'').css("color", "black");
		}
		lastAdded = storeId;
		$('#'+lastAdded+'').css("background", "#f0fff6");
		// $('#'+lastAdded+'').css("color", "#FFFFFF");
      // increment counter
      i++; 
      //  increment the counter
      if (i < mapInfo.distances.length && i<30 ) {  // call the loop function
         myLoop();             //  ..  again which will trigger another 
         $('#store-list').listview('refresh');
     }else{
      	//end of the list
      	$('#'+lastAdded+'').css("background", "#FFFFFF");
      	$('#'+lastAdded+'').css("color", "black");
      	$('#store-list').css("border-bottom", "none");
      	$('#store-list').listview('refresh');
      	storeCurrentList();	
      }
  }, 80)
}

myLoop(); 

$('#store-list').listview('refresh');
}