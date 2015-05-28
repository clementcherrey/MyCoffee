
var addressArray = [];

//to get the coordinate from the address
function jsonTransform() {
	console.log("in json function");
	$.getJSON("ajax/SBpregeocod.json",function(data) {
		$.each(data,function(key, val) {	
			addressArray.push({id: val.id, name: val.name,addresseng: val.addresseng, addresscn: val.addresscn});
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
		codeAddress(addressArray[loop.iteration()].addresscn, tmpId, callnext);

	}, function (){
		// console.log("finish !")
	});

}


function codeAddress(address, tmpId, callback) {
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
                codeAddress(address, tmpId, callback);
            }, 1500);
        	} else {
        		console.log('Geocode fail for the address: ' + address);
				console.log('Geocode was not successful for the following reason: ' + status);
			} 
		});
}












