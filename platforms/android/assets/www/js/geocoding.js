
var addressArray = [];

//to get the coordinate from the address
function jsonTransform() {
	console.log("in json function");
	$.getJSON("ajax/costaPregeo.json",function(data) {
		$.each(data,function(key, val) {	
			addressArray.push({id: val.id, name: val.name,addresseng: val.addresseng, addresscn: val.addresscn});
		});
		initializeGeo();	
	});
}

function jsonTransformSub() {
	console.log("in json function");
	$.getJSON("ajax/subwayPreGeocode.json",function(data) {
		$.each(data,function(key, val) {	
			addressArray.push({id: val.id, station: val.station});
		});
		initializeGeo();	
	});
}


function testCoordinate(){
	var myAddress = "上海市黄浦区肇嘉浜路212号";
	alert ("myAddress: "+ myAddress);
	function callnext(){
		alert("lol");
	}
	codeAddress(myAddress, 0, callnext);
}


//need a loop on all the line of the JSON
function initializeGeo() {
	console.log("in initializeGeo function");
	console.log(addressArray.length);
	syncLoop(addressArray.length, function(loop){
	// console.log("loop : " + loop.iteration());
	var tmpId = loop.iteration();
		function callnext() {
			loop.next();
		}
		// SUBWAY GOOGLE
		// codeAddressGoogle(addressArray[loop.iteration()].station, tmpId, callnext);

		// STORE BAIDU
		codeAddressBaidu(addressArray[loop.iteration()].addresscn, tmpId, callnext);

	}, function (){
		// console.log("finish !")
	});

}

// BAIDU Geocoding
function codeAddressBaidu(address, tmpId, callback) {
	// console.log("in BAIDU geocode");
	var myGeo = new BMap.Geocoder(); 
	myGeo.getPoint(address, function(point){
		if (point) {  
			console.log("/" + tmpId + "/" + address+ "/" + point.lat + "/" + point.lng);
		callback();	
		}else{
			alert("No point for address: "+address);
			console.log("No point for address: "+address);
			codeAddressBaidu(address, tmpId, callback);
		}
	}, "上海市");
}


// OLD VERSION TO GEOCOD AN ADDRESS
function codeAddressGoogle(address, tmpId, callback) {
	// alert("in codeAddress function");
	// console.log(address);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, 
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) { 
				// alert(results[0].geometry.location);
				// console.log("lat: " +results[0].geometry.location.lat());
				var tmplat = results[0].geometry.location.lat();
				var tmplng = results[0].geometry.location.lng();
				console.log("/" + tmpId + "/" + address+ "/" + tmplat + "/" + tmplng);

				addressArray[tmpId] = {lat: tmplat, lng: tmplng};

				// alert("After push");
				callback();
			} else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {   
			// console.log("OVER_QUERY_LIMIT"); 
            setTimeout(function() {
                codeAddressGoogle(address, tmpId, callback);
            }, 1500);
        	} else {
        		console.log('Geocode fail for the address: ' + address);
				console.log('Geocode was not successful for the following reason: ' + status);
			} 
		});
}












