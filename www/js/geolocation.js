function getMyPos() {

    $.mobile.loading( "show", {
            text: "custom",
            textVisible: true,
            theme: $.mobile.loader.prototype.options.theme,
            textonly: true,
            html: "<img style='width: 100%;' src='img/load-gps.gif'>"
    });

	console.log("in getMyPos");
	var options = {
		enableHighAccuracy : false,
		maximumAge : 1000,
		timeout : 4000
	};

	var onSuccess = function(position) {
		console.log("Success get my pos");
		console.log('my position Latitude= ' + position.coords.latitude + '\n' + 'Longitude= '
			+ position.coords.longitude + '\n');
		// set the origin for the distance calc using the geolocation result
		// ***uncomment the first two when outside city test is
		// done**********
		console.log("before test");
		console.log(mapInfo.maxLat);
		var test1 = position.coords.latitude < mapInfo.maxLat;
		var test2 = position.coords.longitude < mapInfo.maxLng;
		var test3 = mapInfo.minLng < position.coords.longitude;
		var test4 = mapInfo.minLat < position.coords.latitude;
		console.log(test1 + " " + test2 + " " + test3 + " " + test4);
		if (test1 && test2 && test3 && test4) {
			console.log("test succeed");
			mapInfo.currentLat = position.coords.latitude - 0.0021;
			mapInfo.currentLng = position.coords.longitude + 0.0042;
			preCalc();
		} else {
			console.log("You are not in Shanghai");
			preCalc();
		}
	};

	var onError = function(error) {
		// alert("in error");
		console.log('error code: ' + error.code + '\n' + 'message: ' + error.message
			+ '\n');
		// alert("impossible to get your current position. Make sure you authorize shanghaiCoffee to access your location");
		preCalc();
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}