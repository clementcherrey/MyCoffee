
var subArray = [];
var storeArray = [];

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
	$.getJSON("ajax/costa.json",function(data) {
		$.each(data,function(key, val) {	
			storeArray.push({id: val.id, name: val.name, lat: val.lat, lng: val.lng });
		});
		loopOnSub();
	});
}

// loop on subway station: for each sub
function loopOnSub(){
	// console.log("enter loop on sub");
	syncLoop(subArray.length
	//process	
	, function(loop) {
	myID = loop.iteration();
	// console.log("myID : " + myID);

	function callnext() {
			// console.log("in call next");
			callbackBase = 0;
			loop.next();
	}

	initDistCalc2(subArray[myID], callnext);
	}
	//callback
	,function() {alert ("finish subway loop")});
}

var tempSubStore = [];

// loop on subway store
function initDistCalc2(myOrigin, callcall) {
	// console.log("before tempsubstore clean");
	tempSubStore = [];
	// console.log("storeArray.length : "+ storeArray.length);
	var divbytwenty = storeArray.length / 20;
	
	syncLoop(divbytwenty, function(loop) {
		var j = loop.iteration() * 20;
		// console.log("my counter equal" + j);
		var tableLatLng = [];
		var storesIDS = [];
		for ( var i = 0; i < 20 && i <  storeArray.length - j; i++) {
			var tmpId = j + i;
			var tmpLat = storeArray[tmpId].lat;
			var tmpLng = storeArray[tmpId].lng;
			var tmpStore = storeArray[tmpId].id;
			tableLatLng[i] = new google.maps.LatLng(tmpLat, tmpLng);
			storesIDS[i] = tmpStore;
		}

		function callnext() {
			// console.log("in call next");
			loop.next();
		}
		// console.log(tableLatLng);
		// console.log(callbackBase);
		calculateDistances2(myOrigin, storesIDS, tableLatLng, callnext);
		// callnext();
	}, function() {
		sortDistance2();		
		callcall();

	});
}

function calculateDistances2(myOrigin, storesIDS, tableLL, callback) {
	// console.log("in calculate 2");
	var service = new google.maps.DistanceMatrixService();
	var origin = new google.maps.LatLng(myOrigin.lat, myOrigin.lng);
	// console.log(myOrigin.lat + " , " + myOrigin.lng);
	service.getDistanceMatrix( {
		origins : [ origin ],
		destinations : tableLL,
		travelMode : google.maps.TravelMode.DRIVING,
		unitSystem : google.maps.UnitSystem.METRIC,
		avoidHighways : false,
		avoidTolls : false
	}, function(response, status) {
		// console.log("in callbackDistance");
		if (status != google.maps.DistanceMatrixStatus.OK) {
			// console.log('Error was: ' + status);
			 setTimeout(function() {
			calculateDistances2(myOrigin, storesIDS, tableLL, callback);
            }, 8000);
		} else {
			// console.log("status reponse OK");
			callbackBase += 20;
			for ( var i = 0; i < response.rows[0].elements.length; i++) {
		// alert (response.rows[0].elements[i].status);
				var valueId = storesIDS[i];
				var distance = response.rows[0].elements[i].distance.value;
				// if distance < 2 km
				if (distance < 2000) {
					tempSubStore.push( {
						storeId : valueId,
						subID : myOrigin.id,
						distanceText : new String(
								response.rows[0].elements[i].distance.text),
						distanceValue : distance
					});
				}
			}
			callback();
		}
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
	for (var i = tempSubStore.length - 1; i >= 0; i--) {
	console.log( tempSubStore[i].storeId+", "+tempSubStore[i].subID
		+", "+tempSubStore[i].distanceText+", "+tempSubStore[i].distanceValue);

	// console.log(storeArray[tempSubStore[i].storeId].id +", "
	// 	+storeArray[tempSubStore[i].storeId].name);
	};
	// console.log("/////////////	/////////////");
}

