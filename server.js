// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080);

var http = require('http');
var util = require('util');
var fs = require('fs');

var initFile = function(theFile){
    fs.writeFile(theFile, '[\n', function (err) {
        if (err) return console.log(err);
        console.log('init: '+theFile);
    });
}

var writeDownString = function(theFile, theString){
    fs.appendFile(theFile, theString, function (err) {
      if (err) return console.log(err);
      console.log(theString+'> '+theFile);
    });
}

http.createServer(function (req, res) {
//ONLY WORK FOR POST
    var body = '';
        req.on('data', function (data) {
            console.log(data);
            body += data;
            console.log("DATA RECEIVED: "+body);
            // Too much POST data, kill the connection!
            if (body.length > 1e6){
                console.log("body too big");
                req.connection.destroy();
            }
        });
        req.on('end', function () {
            console.log("before parsing");
            var post = JSON.parse(body);
            console.log("post ="+ post);   
            var fileToEdit = post.file;
            var dataType = post.dataType;
            console.log("file: "+ fileToEdit+ "\ndata type: "+dataType);
            if(fileToEdit == 'lol'){
                var tmpString1 = "{\n\"storeId\": \""+post.storeId+"\",\n";
                var tmpString2 = "\"subID\": \""+post.subID+"\",\n";
                var tmpString3 = "\"distanceText\": \""+post.distanceText+"\",\n";
                var tmpString4 =  "\"distanceValue\": \""+post.distanceValue+"\"\n},\n";
                var tmpFinalString = tmpString1+tmpString2+tmpString3+tmpString4;
                writeDownString('test_distanceSub.txt', tmpFinalString);
            }else if(dataType =='newPosition'){
            }else{
                // THE CASE THAT REALLY HAPPEN
                console.log("DATA TYPE UNKNOWN");
                writeDownString('tmp_server_received_data.txt', JSON.stringify(post));
            }
        });

    console.log('Request received: ');
    // util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
    // util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // req.on('data', function (chunk) {
    //     console.log('GOT DATA!');
    // });
    res.end('callback(\'{\"msg\": \"OK\"}\')');

}).listen(8080);

console.log('Server running on port 8080');
// initFile('test_distanceSub.txt'); // FOR DISTANCE SUBWAY
// initFile('test_newPosition.txt'); // FOR DISTANCE SUBWAY
