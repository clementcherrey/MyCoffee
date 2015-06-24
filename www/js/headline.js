
function headlinePreDisplay(){
	var tmpStation = null;
	var tmpSubwayLine = [];	
	console.log("in headline headlinePreDisplay");
	db.transaction(function(tx) {
		tx.executeSql("select * from storeSub where storeId = ? order by distanceValue desc",
			[storeInfo.id],function(tx, results){	
				if (results.rows.length == 0) {
					console.log(" no result for subway association");
					headlineNewDisplay(tmpStation,tmpSubwayLine);
				}else{
					var closestSubId = results.rows.item(0).subwayId;
					console.log("distance: " + results.rows.item(0).distanceValue + ", sub id : " + closestSubId);
					tx.executeSql("select * from subway where id = ? ",
						[closestSubId],function(tx, result){
							tmpStation = result.rows.item(0).station;
							tx.executeSql("select * from subway where station = ? ",
								[tmpStation],function(tx, resultsub){
									tmpSubwayLine.push(resultsub.rows.item(0).line1);
									tmpSubwayLine.push(resultsub.rows.item(0).line2);
									tmpSubwayLine.push(resultsub.rows.item(0).line3);
									tmpSubwayLine.push(resultsub.rows.item(0).line4);
									console.log("number of line insublines: "+ tmpSubwayLine.length);
									headlineNewDisplay(tmpStation,tmpSubwayLine);
								});
						});
				}				
			});
});
}

function headlineNewDisplay(station,sublines) {
	console.log("in headline for new display");
	$('#store-data').empty();
	$('.header-title').empty();

	for ( var i = 0; i < storeInfo.result.length; i++) {
		if (storeInfo.result[i].id == storeInfo.id) {
			console.log("storeInfo.id: " + storeInfo.id);
			var tmpName = storeInfo.result[i].name;
			// $('.header-title').append(tmpName);
			var tmpBrand = storeInfo.result[i].brand;
			alert(tmpBrand);
			$('.header-title').append(tmpBrand);
			var tmpWifi = storeInfo.result[i].wifi;
			var tmpAddress = storeInfo.result[i].addresseng;
			var tmpDescription = storeInfo.result[i].description;
			console.log("address: "+ tmpAddress);
			var tmpDistance = new String(storeInfo.distance);
			var tmpPrice = storeInfo.result[i].latte;
			var tmpPhone = storeInfo.result[i].phone;
			var tmpWebsite = storeInfo.result[i].website;

			var tmpOpen1 = storeInfo.result[i].open1;
			var tmpOpen2 = storeInfo.result[i].open2;
			var tmpOpen3 = storeInfo.result[i].open3;
			var tmpOpen4 = storeInfo.result[i].open4;


			mapInfo.centerLat = storeInfo.result[i].lat;
			mapInfo.centerLng = storeInfo.result[i].lng;
			mapInfo.mapZoom = 18;

			//------------------ TEST ------------------------

			//------------------ Name + distance ------------------------
			$('#store-data')
			.append(
				'<li id="detail-head"style="white-space:normal;">'
				+'<span id="detail-name">'+ tmpName + '</span></br></br>'
				+'<span id="detail-distance">'+ tmpDistance + '</span></br></br>'
				+'<span id="detail-position"> from '+ searchTerm +' station</span>'
				+'</li>');

			//----------------------- Key Info---------------------------
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/detail/wifi.png" alt ="wifi" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+ tmpWifi + '</span></li>');
			$('#store-data')
			.append(
				'<li style="white-space:normal;">'
				+'<img src = "img/detail/address.png" alt ="address" class="ui-li-icon ui-corner-none>"'
				+'<span>'
				+ tmpAddress + '</span></li>');
			if (station!=null) {	
				$('#store-data')
				.append(
					'<li class="detail-multiline" style="white-space:normal;">'
					+'<img src = "img/detail/subway.png" alt ="subway" class="ui-li-icon ui-corner-none>"'
					+'<div id="detail-subway">'
					+'<table><tr><td id="detail-station">'
					+ station
					+'</td>'
					+'<td id="line1" class="detail-subline"></td>'
					+'<td id="line2" class="detail-subline"></td>'
					+'<td id="line3" class="detail-subline"></td>'
					+'<td id="line4" class="detail-subline"></td>'
					+'</tr></table>'
					+'</div>'
					+'</li>');

				console.log("sublines length: "+ sublines.length+", sublines 0 = "+sublines[0]);
				for (var i = 1; i< sublines.length+1; i++) {
					if(sublines[i-1]!=""){
						console.log(sublines[i-1]);
						$('#line'+i).append(
							'<img src="img/line2'
							+ sublines[i]
							+ '.png" />');
					}
				};
				$('#store-data').listview('refresh');
			}

			//------------------------ Opening-----------------------------
			if (tmpOpen1!=null && tmpOpen1!="") {
				var openings = tmpOpen1;
				if (tmpOpen2!="") {
					openings = openings+ '</br>'+ tmpOpen2;
					if (tmpOpen3!=""){
						openings = openings+ '</br>'+ tmpOpen3;
						if (tmpOpen4!=""){
							openings = openings+ '</br>'+ tmpOpen4;
						}
					}
				}
				console.log("tmpOpen1: "+ tmpOpen1+", tmpOpen2 : "+tmpOpen2
					+", tmpOpen3 : "+tmpOpen3+", tmpOpen4 : "+tmpOpen4);
				console.log("openings = " + openings);
				$('#store-data')
				.append(
					'<li id="detail-opendiv" class="detail-multiline" style="white-space:normal;">'
					+'<img src = "img/detail/open.png" alt ="opening" class="ui-li-icon ui-corner-none>"'
					+'<div>'	
					+ openings
					+ '</div>'
					+'</li>');
			}

			//----------------------- More Info-----------------------------
			if (tmpPhone!=null && tmpDescription!=null && tmpWebsite!=null) {
				$('#store-data')
				.append(
					'<li data-role="list-divider">'
					+ 'More</li>');
			};
			if (tmpDescription!=null && tmpDescription!="") {		
				$('#store-data')
				.append(
					'<li class="detail-multiline" style="white-space:normal;">'
					+'<img src = "img/detail/description.png" alt ="description" class="ui-li-icon ui-corner-none>"'
					+'<span>'
					+ tmpDescription + '</span></li>');
			};
			if (tmpPhone!=null && tmpPhone!="") {
				$('#store-data')
				.append(
					'<li style="white-space:normal;">'
					+'<img src = "img/detail/phone.png" alt ="phone" class="ui-li-icon ui-corner-none>"'
					+'<span>'
					+tmpPhone
					+ '</span></li>');
			};
			if (tmpWebsite!=null && tmpWebsite!="") {
				$('#store-data')
				.append(
					'<li style="white-space:normal;">'
					+'<img src = "img/detail/website.png" alt ="website" class="ui-li-icon ui-corner-none>"'
					+'<span>'
					+tmpWebsite
					+ '</span></li>');
			};

			$('#store-data').listview('refresh');
			
			$('#store-data')
				.append(
					'<li style="white-space:normal;">'
					+'<div id="detail-staticMap">'
					+ '</div></li>');
			break;
		}
	}
	$('#store-data').listview('refresh');
	loadStaticMap(storeInfo.id,"detail-staticMap","store-data");
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
			// $('.header-title').append(tmpName);
			var tmpBrand = storeInfo.result[i].brand;
			alert(tmpBrand);
			$('.header-title').append(tmpBrand);
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