var express = require('express');
var app = express();
app.get('/', function(request,response){
	response.sendFile(__dirname+"/hello.html");
});
app.listen(8080);	