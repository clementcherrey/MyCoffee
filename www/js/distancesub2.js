var subArray = [];
var storeArray = [];
var tempSubStore = [];

function getsub(){
	console.log("in get sub");
	$.getJSON("ajax/subway.json",function(data) {
		$.each(data,function(key, val) {	
			subArray.push({id: val.id, station: val.station, lat: val.lat, lng: val.lng});
		});
		getStore();
	});
}

//use the file with all the brands
function getStore(){
	console.log("in get store");
	$.getJSON("ajax/allStores.json",function(data) {
		$.each(data,function(key, val) {	
			storeArray.push({id: val.id, name: val.name, lat: val.lat, lng: val.lng });
		});	

		$( "#searchsub" ).submit(function( event ) {
			console.log( "Handler for .submit() called." );
			event.preventDefault();
			var searchid = $("#search-sub").val();
			console.log("searchid = " +searchid);
			loopOnSub(searchid);
		});
		$( "#search-sub").focus().tap();
	});
}	

// loop on subway station: for each sub
function loopOnSub(it){
	console.log("enter loop on sub");
	syncLoop(20
	//process	
	, function(loop) {
		myID = loop.iteration()+ 20*it;
		// console.log("myID : " + myID);

		function callnext() {
			// console.log("in call next");
			callbackBase = 0;
			loop.next();
		}

		initDistCalc2(subArray[myID], callnext);
	}
	//callback
	,function() {
		console.log("finish loop");
	});
}
// custom estimateDiff
function estimateDiff2(origin,objArr){
	// console.log("in init estimateDiff");
	// OLD FUNCTION TO ESTIMATE DIST
	// var diffOp = function (lat,lng){
	// 	return (origin.lat - lat) * (origin.lat - lat) + (origin.lng- lng)*(origin.lng- lng);
	// };
	// NEW FUNCTION TO CALCULATE DIST
	function getDistanceFromLatLonInKm(lat2,lon2) {
  	var R = 6371; // Radius of the earth in km
  	var dLat = deg2rad(lat2-origin.lat);  // deg2rad below
  	var dLon = deg2rad(lon2-origin.lng); 
  	var a = 
  		Math.sin(dLat/2) * Math.sin(dLat/2) +
  		Math.cos(deg2rad(origin.lat)) * Math.cos(deg2rad(lat2)) * 
  		Math.sin(dLon/2) * Math.sin(dLon/2); 
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  	var d = R * c; // Distance in km
  	return d;
	}

	function deg2rad(deg) {
	return deg * (Math.PI/180)
	}

	var diffArr = $.map(objArr, function(n,i){
	return [{id: n.id, diff: getDistanceFromLatLonInKm(n.lat,n.lng)}];
	})
	// sort using diff
	function compareDiff(a, b) {
		if (a.diff < b.diff)
			return -1;
		if (a.diff > b.diff)
			return 1;
		return 0;
	}
	diffArr.sort(compareDiff);
	return diffArr; 
}




// ***** use the sync loop to launch the distances calc*******//
function initDistCalc2(myOrigin, callcall) {
	// console.log("in init calc 2");
	tempSubStore = [];
	var currentDiff = estimateDiff2(myOrigin,storeArray);
	// console.log(currentDiff);
	// console.log ("number of store : " + currentDiff.length);
	var divbytwenty = currentDiff.length / 20;
	// test for new limit to replace divby twenty
	var nbOfLoop = 3

	syncLoop(nbOfLoop, function(loop) {
		var j = loop.iteration() * 20;
		// console.log("my counter equal" + j);
		var tableLatLng = [];
		var valueId =[];
		for ( var i = 0; i < 20 && i < storeArray.length - j; i++) {
			var itID = j+i;
			var tmpId = currentDiff[itID].id;
			// console.log("itID: "+itID +", tmpId: " + tmpId);
			for ( var k = 0; k < storeArray.length ; k++) {
				// console.log("storeInfo store id: " + storeInfo.result[k].id);
				if (storeArray[k].id == tmpId) {
					valueId.push(tmpId);
					tableLatLng.push(new google.maps.LatLng(storeArray[k].lat, storeArray[k].lng));
					break;
				};
			}
		}


		function callnext() {
			loop.next();
		}
		calculateDistances2(myOrigin,valueId, tableLatLng, callnext);
	}, function() {
		sortDistance2();
		callcall();
	});
}

// ********************* calculate distances *************************//

function calculateDistances2(myOrigin,valueId, tableLL, callback) {
	// console.log("in calculate");
	var service = new google.maps.DistanceMatrixService();
	var origin = new google.maps.LatLng(myOrigin.lat, myOrigin.lng);

	service.getDistanceMatrix( {
		origins : [ origin ],
		destinations : tableLL,
		travelMode : google.maps.TravelMode.WALKING,
		unitSystem : google.maps.UnitSystem.METRIC,
		avoidHighways : false,
		avoidTolls : false
	}, function(response, status) {
		// console.log("in callbackDistance");
		if (status == google.maps.DistanceMatrixStatus.OK) {
			for ( var i = 0; i < response.rows[0].elements.length; i++) {
				var myIndex = i;
				var myId = valueId[myIndex];
				var distance = response.rows[0].elements[i].distance.value;

				if (distance < 2000) {
					tempSubStore.push( {
						storeId : myId,
						subID : myOrigin.id,
						distanceText : new String(
							response.rows[0].elements[i].distance.text),
						distanceValue : distance
					});
				}
			}
			callback();
		}else if (status === google.maps.DistanceMatrixStatus.OVER_QUERY_LIMIT) {   
			// console.log("OVER_QUERY_LIMIT"); 
			setTimeout(function() {
				calculateDistances2(myOrigin,valueId, tableLL, callback);
			}, 2000);
		}else {
			console.log('distance calc was not successful for the following reason: ' + status);
		} 
		// callback();
	});
}

function sortDistance2() {
	// console.log("in sortDistance 2");
	function compare(a, b) {
		if (a.distanceValue < b.distanceValue)
			return -1;
		if (a.distanceValue > b.distanceValue)
			return 1;
		return 0;
	}
	tempSubStore.sort(compare);
	if (tempSubStore.length>0) {
		printNewCoordinates();
	};

	// OLD WAY TO SEND DATA
	// for (var i =0; i<tempSubStore.length;i++){
	// 	console.log( ","+tempSubStore[i].storeId+","+tempSubStore[i].subID
	// 		+","+tempSubStore[i].distanceText+","+tempSubStore[i].distanceValue);
	// 	var tmpData = "storeId="+tempSubStore[i].storeId
	// 					+"&subID="+ tempSubStore[i].subID+"&distanceText="
	// 					+ tempSubStore[i].distanceText+"&distanceValue="
	// 					+ tempSubStore[i].distanceValue+"&file="
	// 					+ 'lol' ;
	// 	console.log("tmpData = "+ tmpData);
	// 	sendData(tmpData);

	// console.log(storeArray[tempSubStore[i].storeId].id +", "
	// 	+storeArray[tempSubStore[i].storeId].name);
	// };
	// console.log("/////////////	/////////////");
}


function printNewCoordinates(){
	console.log("*********************************");
	console.log("--------- NEW COORDINATES -------");
	console.log("*********************************");
	var tmpData = JSON.stringify(tempSubStore);
	console.log("tmpData = "+ tmpData);
	sendData(tmpData);
	console.log("*********************************");
}
