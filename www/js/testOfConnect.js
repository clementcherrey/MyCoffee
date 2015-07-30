
function(){
	var img = document.createElement("img");
	img.onload = function(){console.log("image loaded")};
	img.onerror = function(){console.log("image cannot be loaded")};
	img.src = "//apps.facebook.com/favicon.ico"; //thanks @RobW
	document.body.appendChild(img);
}