/**
 * Created by clement on 12/29/14.
 */
function init(){
   // alert("in init");
    document.addEventListener("deviceready", deviceready, true);

}
var db;

function deviceready(){
    db = window.openDatabase("store","1.0","store_list", 10000000);
    db.transaction(setup, errorHandler, dbReady);
}

function setup(tx){
    tx.executeSql('create table if not exists store(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    ' name TEXT,' +
    ' added DATE,' +
    ' brand TEXT,' +
    ' comfort FLOAT,' +
    ' location TEXT,'+
    ' lat FLOAT,'+
    ' lng FLOAT)');
   // alert("table created");
   
}


function errorHandler(e){
    alert(e.message);
}

function dbReady(){
    //alert("in db ready");
        db.transaction(function(tx){
            tx.executeSql("select * from store order by id asc",[],populatedb, errorHandler);
        });

    $("#store-list").on('vclick', 'li a', function(){
            //alert("click detected");
            storeInfo.id = $(this).attr('data-id');
           // alert(storeInfo.id);
            $("body").pagecontainer("change", "#headline", { role: "page" });
        });

    $("#headline").on('pagebeforeshow', function(){
       // alert("in headline before show");
        $('#store-data').empty();
        for (var i = 0; i < storeInfo.result.rows.length; i++) {
            if(i == storeInfo.id) {
            //    alert("in the if");
                var tmpName = storeInfo.result.rows.item(i).name;
                var tmpBrand = storeInfo.result.rows.item(i).brand;
                var tmpComfort = storeInfo.result.rows.item(i).comfort;
                var tmpLocation = storeInfo.result.rows.item(i).location;
                
                mapInfo.centerLat =  storeInfo.result.rows.item(i).lat;
                mapInfo.centerLng =  storeInfo.result.rows.item(i).lng;
                mapInfo.mapZoom = 14;

               
                $('#store-data').append('<li><h1>'+tmpName+'</h1>'+
                		'<h3>Note : 4.5 / 5</h3>'+
                		'<h4> 1376 Nanjing West Road Jingan, Shanghai</h4>'+
                		'</li>');
                $('#store-data').append('<li><div class="ui-grid-a">'+
                	    '<div class="ui-block-a"><div class="ui-body ui-body-d"><img src="img/150.png"/></div></div>'+
                	    '<div class="ui-block-b"><div class="ui-body ui-body-d">Distance</div></div>'+
                		'</li>');
                $('#store-data').append('<li><h3>Comfort : '+tmpComfort+'</h3></li>');
                $('#store-data').append('<li>How to go : '+tmpLocation+'</li>');
                $('#store-data').append('<li>Description : </li>');
                $('#store-data').listview('refresh');
            }
        };
        $('#store-data').listview('refresh');
    });
    
    $("#main").on('pageshow', function(){
    alert("in map show");
//	test de geolocation
    getMyPos();

	
    if(mapInfo.createNb == 0){
    var image = 'img/xigua.png';
    var map;
    var mapOptions = {
    	   zoom: mapInfo.mapZoom,
    	   center: new google.maps.LatLng( mapInfo.centerLat, mapInfo.centerLng)
    	  };
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    for (var i = 0; i < storeInfo.result.rows.length; i++) {
      var tmplat = storeInfo.result.rows.item(i).lat;
      var tmplng = storeInfo.result.rows.item(i).lng;
      var tmpLatlng = new google.maps.LatLng(tmplat,tmplng);
      
      var marker = new google.maps.Marker({
          position: tmpLatlng,
          map: map,
          icon: image
      });   
     };
    
    
    }else{
   // alert("map already created");   
    map.setCenter(new google.maps.LatLng( mapInfo.centerLat, mapInfo.centerLng));
    map.setZoom(mapInfo.mapZoom);
    }
    
    });      
}


var storeInfo = {
    id : null,
    result : null
}

var mapInfo ={
	createNb : 0,
	centerLat : 31.225523,
	centerLng : 121.491344,
	mapZoom : 12,
	currentLat : 32.0500,
	currentLng : 118.7667,
	distances : null,
	title : "coffee shop in Shanghai"
	
}


function populatedb(tx, results){
	if (results.rows.length==0){
		//alert("no data");
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks one","starbucks",4.1,"unknow",31.225523, 121.491344]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 2","starbucks",4.2,"unknow",31.228562, 121.512470]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 3","starbucks",4.3,"unknow",31.228268, 121.516761]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 4","starbucks",4.4,"unknow",31.239423, 121.484489]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 5","starbucks",4.5,"unknow",31.220928, 121.475048]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 6","starbucks",4.6,"unknow",31.226800, 121.463718]);
		tx.executeSql("insert into store(name,brand,comfort,location,lat,lng) values(?,?,?,?,?,?)",["store starbucks 7","starbucks",4.7,"unknow",31.203164, 121.462688]);
		
		//alert("new data added");
        tx.executeSql("select * from store order by id asc",[],gotlog, errorHandler);
		
	} else {
		//	alert("db already full");
		gotlog(tx,results);
		};
		
	
	}

function gotlog(tx, results){
    //alert("in gotlog");

    if(results.rows.length == 0){
    alert("no data");
        return false;
    }
    else {
        storeInfo.result = results;        
//      calculateDistances(31.225523, 121.491344);
        initDistCalc();
        for (var i = 0; i < results.rows.length; i++) {
            var tmpName = results.rows.item(i).name;
            var tmpBrand = results.rows.item(i).brand;
            var tmpComfort = results.rows.item(i).comfort;
            var tmpLocation = results.rows.item(i).location;
  
            $('#store-list').append('<li><a href="#headline" data-transition="slide" data-id="' + i + '">' +
            '<img src="img/' + tmpBrand + '.jpeg"/>' +
            '<h3>' + tmpName + '</h3>' +
            '<div id="dist_'+ i +'_">success</div></a></li>');
        }
    }
    $('#store-list').listview('refresh');
}

function initDistCalc(){
	alert("in initDistCalc");
	var tableLatLng = [];
	for (var i = 0; i < storeInfo.result.rows.length; i++) {
//	alert("boucle one time");
	var tmpLat = storeInfo.result.rows.item(i).lat;
	var tmpLng = storeInfo.result.rows.item(i).lng;
	tableLatLng[i] =  new google.maps.LatLng(tmpLat, tmpLng);
	}
	calculateDistances(tableLatLng);
}


function calculateDistances(tableLL) {
	alert("in calculate");
	
	  var service = new google.maps.DistanceMatrixService();
	  var origin = new google.maps.LatLng(mapInfo.currentLat, mapInfo.currentLng);
	  service.getDistanceMatrix(
	    {
	      origins: [origin],
	      destinations : tableLL,
	      travelMode: google.maps.TravelMode.DRIVING,
	      unitSystem: google.maps.UnitSystem.METRIC,
	      avoidHighways: false,
	      avoidTolls: false
	    }, callbackDistance);
	}

function callbackDistance(response, status) {
	alert("in callback");
	  if (status != google.maps.DistanceMatrixStatus.OK) {
	    alert('Error was: ' + status);
	  } else {
	    mapInfo.distances =  response.rows[0].elements;
	    for (var i = 0; i < mapInfo.distances.length; i++) {
//	    	alert(mapInfo.distances[i].distance.text);
	    	var tmpId = "dist_"+ i +"_";
	    	var outputDiv = document.getElementById(tmpId);
	    	outputDiv.innerHTML = '';
	    	outputDiv.innerHTML += '<h2>'+ mapInfo.distances[i].distance.text +'</h2>';
	    }
	  }
}

function getMyPos(){
	// onSuccess Callback
	// This method accepts a Position object, which contains the
	// current GPS coordinates
	//
	alert("in getMyPos");
	var options = { enableHighAccuracy: true, maximumAge: 300, timeout: 90000 };

	if(navigator.geolocation){
		alert(" TRUUUUUUUE !!!");
	}
	
	var onSuccess = function(position) {
	alert("in onSuccess");

	    alert('Latitude: '          + position.coords.latitude          + '\n' +
	          'Longitude: '         + position.coords.longitude         + '\n' +
	          'Altitude: '          + position.coords.altitude          + '\n' +
	          'Accuracy: '          + position.coords.accuracy          + '\n' +
	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          'Heading: '           + position.coords.heading           + '\n' +
	          'Speed: '             + position.coords.speed             + '\n' +
	          'Timestamp: '         + position.timestamp                + '\n');
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
		alert("in error");
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	alert("end getMyPos");

}

