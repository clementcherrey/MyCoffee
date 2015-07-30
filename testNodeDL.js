var https = require('https');
var fs = require('fs');
var http = require('http');

var downloadZip = function(){
	var startTime = new Date();
	var craftedUrl = "http://mycoffee.site11.com/costaMap.zip";
	console.log(craftedUrl);
	var file = fs.createWriteStream("./maps/costaMap.zip");
	var request = http.get(craftedUrl,
		function(response) {
			response.pipe(file);

		});	
	setInterval(function () {
    	console.log("ms since the start: " + (new Date() - startTime));
	}, 1000);
}

downloadZip();

