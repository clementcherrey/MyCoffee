var https = require('https');
var fs = require('fs');
var http = require('http');

// -------------- START TEST -------------
var file = fs.createWriteStream("mypng.png");
var baiduUrl = "blob:https%3A//mega.co.nz/417d98b4-b731-40f3-9363-26dfc58d8187";
var request = https.get(baiduUrl,
 function(response) {
  response.pipe(file);
});
// --------------- END TEST --------------	

var downloadStaticMap = function(id,lat,lng){
	var prefix = "https://maps.googleapis.com/maps/api/staticmap?region=cn&language=en-US&zoom=17&size=400x400&markers=color:red%7Clabel:A%7C"
	var coordinates = lat +",%20"+lng;
	var craftedUrl = prefix + coordinates;
	console.log(craftedUrl);
	var file = fs.createWriteStream("./maps/"+ id +".png");
	var request = https.get(craftedUrl,
		function(response) {
			response.pipe(file);
		});
}

fs.readFile('./www/ajax/starbucks.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var json = JSON.parse(data);
    console.log(json.length);
    for (var i = json.length - 1; i >= json.length - 3; i--) {
    	console.log("id: "+json[i].id +", store name: "+ json[i].name);
    	// downloadStaticMap(json[i].id,json[i].lat,json[i].lng);
    };
});