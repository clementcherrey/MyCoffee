function init() {
 	console.log("in init");
 	//****FOR BROWSER*****//
	 	// $( document ).ready(function() {
	 	// 	listenForInit();
	 	// }); 	

 	//****FOR PHONE*****//
 	document.addEventListener("deviceready", listenForInit, true);
 }

function listenForInit(){
 	$(document).on("DBready", 
 		function(){
 			console.log("DB is ready");
 			initMainListeners();
 			loadTheMapScript();
 		});

 	$(document).on("MapReady", 
 		function(){
 			console.log("Map is ready");
 			activateMapButton();
 			checkPreviousList();
 		});

 	initDB();
}

function activateMapButton(){
 	$('#getLocation1').on("tap", getMyPos);
 	$('#mapButtoon').on("tap", function(){
 		$("body").pagecontainer("change", "#main", {
            role : "page"
        });
 	});
}

//link to the javascipt in the bottom of the html
function loadTheMapScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.google.cn/maps/api/js?region=cn&language=en-US&sensor=true&'+'callback=scriptLoaded';
	document.body.appendChild(script);
};

//callback after script is loaded
function scriptLoaded(){
	console.log("google map script loaded");
	if(autoMapLoading){
		// initMap();
		$("#main").on('pageshow', initMap);
	}else{
		$("#main").on('pageshow', initMap);
	}
	$.event.trigger({type: "MapReady"});
}