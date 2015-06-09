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

//put the brand as parmeter for futur version
function getStore(){
	console.log("in get store");
	$.getJSON("ajax/starbucks.json",function(data) {
		$.each(data,function(key, val) {	
			storeArray.push({id: val.id, name: val.name, lat: val.lat, lng: val.lng });
		});

		$( "#searchsub" ).submit(function( event ) {
			alert( "Handler for .submit() called." );
			event.preventDefault();
			var searchid = $("#search-sub").val();
			// alert(searchid);
			loopOnSub(searchid);
		});
		// loopOnSub(0);
	});
}

// loop on subway station: for each sub
function loopOnSub(it){
	console.log("enter loop on sub");
	syncLoop(20
	//process	
	, function(loop) {
		myID = loop.iteration()+ 20*it;
		console.log("myID : " + myID);

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
	var diffOp = function (lat,lng){
		return (origin.lat - lat) * (origin.lat - lat) + (origin.lng- lng)*(origin.lng- lng);
	};

	var diffArr = $.map(objArr, function(n,i){
		return [{id: n.id, diff: diffOp(n.lat,n.lng)}];
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
	// console.log("in init calc");
	tempSubStore = [];
	var currentDiff = estimateDiff2(myOrigin,storeArray);
	// only send 20 locations per request for distqnces
	// console.log ("number of store : " + currentDiff.length);
	var divbytwenty = currentDiff.length / 20;
	// test for new limit to replace divby twenty
	var nbOfLoop = 2

	syncLoop(nbOfLoop, function(loop) {
		var j = loop.iteration() * 20;
		// console.log("my counter equal" + j);
		var tableLatLng = [];
		var valueId =[];
		for ( var i = 0; i < 20 && i < storeArray.length - j; i++) {
			var itID = j+i;
			var tmpId = currentDiff[itID].id;
			console.log("itID: "+itID +", tmpId: " + tmpId);
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
		travelMode : google.maps.TravelMode.DRIVING,
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
			console.log("OVER_QUERY_LIMIT"); 
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
	// console.log("///////////// TABLE /////////////");
	for (var i =0; i<tempSubStore.length;i++){
		console.log( ","+tempSubStore[i].storeId+","+tempSubStore[i].subID
			+","+tempSubStore[i].distanceText+","+tempSubStore[i].distanceValue);

	// console.log(storeArray[tempSubStore[i].storeId].id +", "
	// 	+storeArray[tempSubStore[i].storeId].name);
};
	// console.log("/////////////	/////////////");
}
