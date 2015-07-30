var https = require('https');
var fs = require('fs');
var http = require('http');

// -------------- START TEST -------------
process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});
// --------------- END TEST --------------	

var downloadStaticMap = function(id,lat,lng){
	var prefix = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAr3xKgQ9kNySsvxPBVMox3g2g3kafnZyo&region=cn&language=en-US&zoom=17&size=400x400&markers=color:red%7Clabel:A%7C"
	var coordinates = lat +",%20"+lng;
	var craftedUrl = prefix + coordinates;
	console.log(craftedUrl);
	var file = fs.createWriteStream("./maps/"+ id +".png");
	var request = https.get(craftedUrl,
		function(response) {
			response.pipe(file);
		});
}

// 120 maps at a time (need 3 times for SB)
fs.readFile('./www/ajax/wagas.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var json = JSON.parse(data);
    console.log(json.length);
    var i = 0; 
    var maxDLmaps = 400;               
	function myLoop () {           //  create a loop function
   		setTimeout(function () {    //  call a 3s setTimeout when the loop is called
     		console.log("id: "+json[i].id +", store name: "+ json[i].name);
			downloadStaticMap(json[i].id,json[i].lat,json[i].lng);
     	 	i++;                     //  increment the counter
      		if (i < json.length && i < maxDLmaps) {            //  if the counter < 10, call the loop function
         		myLoop();             //  ..  again which will trigger another 
      		}                        //  ..  setTimeout()
  		}, 500)
	}
	myLoop();	
});
// --------------------------------------------------------------
