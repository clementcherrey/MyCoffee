var tmpSubwayDetail = null;
var tmpStation = null;

function headlinePreDisplay(){
	console.log("in headline headlinePreDisplay");
	var tmpSubwayLine = [];	
	db.transaction(function(tx) {
		tx.executeSql("select * from storeSub where storeId = ? order by distanceValue desc",
			[storeInfo.id],function(tx, results){	
				if (results.rows.length == 0) {
					console.log(" no result for subway association");
					tmpSubwayDetail = "No close subway station";
					headlineDisplay();
				}else{
					var closestSubId = results.rows.item(0).subwayId;
					console.log("distance: " + results.rows.item(0).distanceValue + ", sub id : " + closestSubId);
					tmpSubwayDetail = results.rows.item(0).distanceText + " from the station";
					tx.executeSql("select * from subway where id = ? ",
						[closestSubId],function(tx, result){
							tmpStation = result.rows.item(0).station;
							tx.executeSql("select * from subway where station = ? ",
								[tmpStation],function(tx, resultsub){
									console.log("nombres de lignes : "+resultsub.rows.length);
									for (var i = resultsub.rows.length - 1; i >= 0; i--) {
										tmpSubwayLine.push(resultsub.rows.item(i).line);
										console.log("line number "+i+ " : "+tmpSubwayLine[i]);
										console.log("subway line length: "+tmpSubwayLine.length);
									}
									headlineDisplay(tmpSubwayLine);
								});
						});
				}				
			});
});
}

function headlineDisplay(sublines) {
	console.log("in headline for display");
	$('#store-data').empty();
	$('.header-title').empty();

	for ( var i = 0; i < storeInfo.result.length; i++) {
		if (storeInfo.result[i].id == storeInfo.id) {
			console.log("storeInfo.id: " + storeInfo.id);
			var tmpName = storeInfo.result[i].name;
			$('.header-title').append(tmpName);

			var tmpBrand = storeInfo.result[i].brand;
			var tmpNote = "2";
			var tmpWifi = storeInfo.result[i].wifi;
			var tmpAddress = storeInfo.result[i].address;
			var tmpDescription = "blablabla bla blablabla blablablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla blablabla bla";
			//var tmpDistance = mapInfo.distances[i].distance;
			var tmpDistance = storeInfo.distance;
			// console.log("storeInfo.distance: "+ storeInfo.distance);
			var tmpPrice = storeInfo.result[i].latte;

			mapInfo.centerLat = storeInfo.result[i].lat;
			mapInfo.centerLng = storeInfo.result[i].lng;
			mapInfo.mapZoom = 14;



			$('#store-data')
			.append(
				'<li><div class="bigcontainer">'
				+ '<div class="container2"><img src="img/'
				+ tmpBrand
				+ '.png"/></div>'
				+ '<div class = "container1"><div><p>'
				+ tmpName
				+ '</p><p><img src="img/dollar-'
				+ tmpNote
				+ '.png" style="height: 30px;"/></p></div></div>'						
				+ '</div></li>');

			$('#store-data')
			.append(
				'<li class="containerWifi"><div class="ui-grid-b">'
				+ '<div class="ui-block-a grids"><div class="ui-body ui-body-d"><p>Distance:</p><p><span style="font-weight:bold; ">'
				+ tmpDistance
				+ '</span></p></div></div>'
				+ '<div class="ui-block-b grids"><div class="ui-body ui-body-d"><p>Wifi : </p><p><span style="font-weight:bold; ">'
				+ tmpWifi
				+ ' wifi</span></p></div></div>'
				+ '<div class="ui-block-c grids"><div class="ui-body ui-body-d"><p>Price latte: </p><p><span style="font-weight:bold; ">'
				+ tmpPrice
				+ ' Rmb</span></p></div></div>'
				+ '</div></li>');
			$('#store-data')
			.append(
				'<li style="white-space:normal;"><span style="font-weight:bold;">Address: </span>'
				+ tmpAddress + '</li>');
			$('#store-data')
			.append(
				'<li class="containerSubway" style="white-space:normal;"><div><div>'
				+ '<p style="font-size: 16px"><span style="font-weight:bold; ">Station:</span>  '
				+ tmpStation
				+ '</p><div id="subway-lines" style="display:table;font-weight:bold; font-size: 16px;"><span style="vertical-align: middle;display: table-cell"> Line: </span>'
				+ '	</div>'			
				+ '<p style="font-size: 15px;">'
				+ tmpSubwayDetail
				+ '</p>'
				+'<div></div></li>');
			$('#store-data')
			.append(
				'<li style="white-space:normal; font-size: medium"><span style="font-weight:bold;">Description :</span>'
				+ tmpDescription
				+ '</li>');


			$('#store-data').listview('refresh');

			break;
		}
	}
	console.log("ATTENTION : "+sublines.length);
	for (var i = sublines.length - 1; i >= 0; i--) {
		console.log(sublines.length);
		$('#subway-lines')
		.append(
			'<span style="vertical-align: middle;display: table-cell;"><img src="img/line2'
			// + sublines[i]
			+ '.png" /></span>');			
	};
	$('#store-data').listview('refresh');
}