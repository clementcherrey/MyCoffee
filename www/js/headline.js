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
					headlineNewDisplay(null);
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
									headlineNewDisplay(tmpSubwayLine);
									//headlineDisplay(tmpSubwayLine);
								});
						});
				}				
			});
});
}

function headlineNewDisplay(sublines) {
	console.log("in headline for display");
	$('#store-data').empty();
	$('.header-title').empty();

	for ( var i = 0; i < storeInfo.result.length; i++) {
		if (storeInfo.result[i].id == storeInfo.id) {
			console.log("storeInfo.id: " + storeInfo.id);
			var tmpName = storeInfo.result[i].name;
			$('.header-title').append(tmpName);

			var tmpBrand = storeInfo.result[i].brand;
			var tmpWifi = storeInfo.result[i].wifi;
			var tmpAddress = storeInfo.result[i].addresseng;
			var tmpDescription = storeInfo.result[i].description;
			console.log("open: "+ tmpAddress);
			var tmpDistance = storeInfo.distance;
			var tmpPrice = storeInfo.result[i].latte;
			var tmpPhone = storeInfo.result[i].phone;
			var tmpWebsite = storeInfo.result[i].website;

			var tmpOpen1 = storeInfo.result[i].open1;
			var tmpOpen2 = storeInfo.result[i].open2;
			var tmpOpen3 = storeInfo.result[i].open3;
			var tmpOpen4 = storeInfo.result[i].open4;


			mapInfo.centerLat = storeInfo.result[i].lat;
			mapInfo.centerLng = storeInfo.result[i].lng;
			mapInfo.mapZoom = 14;

			//------------------ TEST ------------------------

			//------------------ Name + distance ------------------------
			$('#store-data')
			.append(
				'<li id="detail-head"style="white-space:normal;">'
				+'<span id="detail-name">'+ tmpName + '</span></br></br>'
				+'<span id="detail-distance">'+ tmpDistance + '</span><span detail-close> Close</span></br></br>'
				+'<span id="detail-position"> from your last position</span>'
				+'</li>');

			//----------------------- Key Info---------------------------
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="wifi" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+ tmpWifi + '</span></li>');
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="address" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+ tmpAddress + '</span></li>');
			$('#store-data')
			.append(
				'<li class="detail-multiline" style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="subway" class="ui-li-icon ui-corner-none>"'
				+'<p class="detail-centerp">'	
				+ tmpStation
				+ '</br>'				
				+ tmpStation
				+ '</p></li>');
			$('#store-data')
			.append(
				'<li class="detail-multiline" style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="opening" class="ui-li-icon ui-corner-none>"'
				+'<div>'	
				+ tmpOpen1
				+ '</br>'				
				+ tmpOpen2
				+ '</br>'				
				+ tmpOpen3
				+ '</br>'				
				+ tmpOpen4
				+ '</div></li>');
			//----------------------- More Info-----------------------------
			$('#store-data')
			.append(
				'<li data-role="list-divider">'
				+ 'More</li>');
			$('#store-data')
			.append(
				'<li class="detail-multiline" style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="description" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+ tmpDescription + '</span></li>');
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="phone" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+tmpPhone
				+ '</span></li>');			
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/150.png" alt ="website" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+tmpPhone
				+ '</span></li>');

			$('#store-data').listview('refresh');

			break;
		}
	}
	$('#store-data').listview('refresh');

}

///////////////*******************************//////////////////
///////////////********* OLD VERSION *********//////////////////
///////////////*******************************//////////////////

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
			var tmpOpen = storeInfo.result[i].open;
			var tmpDescription = storeInfo.result[i].description;
			console.log("open: "+ tmpOpen+", description: "+tmpDescription);
			var tmpDistance = storeInfo.distance;
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
				+ '</p><p>'
				+	tmpOpen
				+'</p></div></div>'						
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