
var addressArray = [];
function jsonTransform() {
	alert("in json function");
	$.getJSON("ajax/metro.json",function(data) {
		$.each(data,function(key, val) {
			addressArray.push({id: val.id, name: val.name, address: val.address});
			// codeAddress(val.address);

		});
		alert(addressArray[0].address);
		// codeAddress(addressArray[1].address);
		initializeGeo();
	});
	
}s


//need a loop on all the line of the JSON

function initializeGeo() {
	alert("in initializeGeo function");
	alert(addressArray.length);
	syncLoop(addressArray.length, function(loop){
		alert("loop : " + loop.iteration());
		var tmpId = loop.iteration();
		function callnext() {
			alert("callback");
			loop.next();
		}
		codeAddress(addressArray[loop.iteration()].address, tmpId, callnext);

	}, function (){alert("finish !")});

}


function codeAddress(address, tmpId, callback) {
	alert("in codeAddress function");
	alert(address);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, 
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) { 
				alert(results[0].geometry.location);
				alert(results[0].geometry.location.lat());
				var tmplat = results[0].geometry.location.lat();
				var tmplng = results[0].geometry.location.lng();
				alert(tmpId+ " , " + tmplat + " , " + tmplng);

				addressArray[tmpId] = {lat: tmplat, lng: tmplng};

				alert("After push");
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			} 
			callback();
		});
}












