var fs = require('fs');
var subArray = [];
var storeArray = [];
var tempSubStore = [];

function init(){
	fs.writeFile('test_distanceSub.txt', '[\n', function (err) {
  		if (err) return console.log(err);
  		console.log('init test_distanceSub.txt');
  		getsub();	
	});
}

function getsub(){
	fs.readFile('./www/ajax/subway.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var json = JSON.parse(data);
    console.log(json.length);
    var i = 0;                     //  set your counter to 0
	function myLoop () {           //  create a loop function
   		setTimeout(function () {    //  call a 3s setTimeout when the loop is called
     		console.log("id: "+json[i].id +", station name: "+ json[i].name);
			subArray.push({id: json[i].id, station: json[i].station, lat: json[i].lat, lng: json[i].lng});
     	 	i++;                     //  increment the counter
      		if (i < json.length && i < 240) {            //  if the counter < 10, call the loop function
         		myLoop();             //  ..  again which will trigger another 
      		}                        //  ..  setTimeout()
  		}, 2000)
	}
	myLoop();	
	});
	getStore();
}


function getStore(){
	fs.readFile('./www/ajax/costa.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var json = JSON.parse(data);
    console.log(json.length);
    var j = 0;                     //  set your counter to 0
	function myLoop2 () {           //  create a loop function
   		setTimeout(function () {    //  call a 3s setTimeout when the loop is called
     		console.log("id: "+json[j].id +", store name: "+ json[j].name);
			storeArray.push({id: json[j].id, name: json[j].name, lat: json[j].lat, lng: json[j].lng });
     	 	i++;                     //  increment the counter
      		if (i < json.length ) {            //  if the counter < 10, call the loop function
         		myLoop2();             //  ..  again which will trigger another 
      		}                        //  ..  setTimeout()
  		}, 2000)
	}
	myLoop2();	
	});
	loopOnSub(1);
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

	var diffArr = objArr.map(function(n,i){
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
//------------- END RE-USE --------------------------

function sortDistance() {
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
		writeDownString("{\n\"storeId\": \""+ tempSubStore[i].storeId +"\",\n");
		writeDownString("\"subID\": \""+ tempSubStore[i].subID +"\",\n");
		writeDownString("\"distanceText\": \""+ tempSubStore[i].distanceText +"\",\n");
		writeDownString("\"distanceValue\": \""+ tempSubStore[i].distanceValue +"\"\n},\n");
	};
}


var writeDownString = function(theString){
	fs.appendFile('test_distanceSub.txt', theString, function (err) {
	  if (err) return console.log(err);
	  console.log(theString+'> test_distanceSub.txt');
	});
}


function syncLoop(iterations, process, exit) {
	// alert("in syncLoop");
	var index = 0, done = false, shouldExit = false;
	var loop = {
		next : function() {
			// console.log("in next");
			if (done) {
				if (shouldExit && exit) {
					return exit(); // Exit if we're done
				}
			}
			// If we're not finished
			if (index < iterations) {
				// console.log("in if iteration: ");
				// console.log(iterations);
				index++; // Increment our index
				process(loop); // Run our process, pass in the loop
				// Otherwise we're done
			} else {
				done = true; // Make sure we say we're done
				if (exit)
					exit(); // Call the callback on exit
			}
		},
		iteration : function() {
			return index - 1; // Return the loop number we're on
		},
		stop : function(end) {
			done = true; // End the loop
			shouldExit = end; // Passing end as true means we still call the
			// exit callback
		}
	};
	loop.next();
	return loop;
}