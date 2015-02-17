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
            alert(storeInfo.id);
           // $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });;
            $("body").pagecontainer("change", "#headline", { role: "page" });
        });

    $("#headline").on('pagebeforeshow', function(){
        alert("in headline before show");
        $('#store-data').empty();
        for (var i = 0; i < storeInfo.result.rows.length; i++) {
            if(i == storeInfo.id) {
                alert("in the if");
                var tmpName = storeInfo.result.rows.item(i).name;
                var tmpBrand = storeInfo.result.rows.item(i).brand;
                var tmpComfort = storeInfo.result.rows.item(i).comfort;
                var tmpLocation = storeInfo.result.rows.item(i).location;

                $('#store-data').append('<li><img src="img/' + tmpBrand + '.jpeg"/></li>');
                $('#store-data').append('<li>Name: '+tmpName+'</li>');
                $('#store-data').append('<li>Comfort : '+tmpComfort+'</li>');
                $('#store-data').append('<li>Location : '+tmpLocation+'</li>');
                $('#store-data').listview('refresh');
            }
        };
        $('#store-data').listview('refresh');
    });
    
    $("#main").on('pageshow', function(){
       // alert("in map before show");

       var image = 'img/xigua.png';
       var myLatlng = new google.maps.LatLng(31.2000,121.5000);
       $('#map_canvas').gmap({ 'center': '31.2000,121.5000', 'zoom': 12}); 
       $('#map_canvas').gmap('addMarker', { 'position': myLatlng, 'icon': image});
       for (var i = 0; i < storeInfo.result.rows.length; i++) {
       // alert("in for");
       var tmplat = storeInfo.result.rows.item(i).lat;
       var tmplng = storeInfo.result.rows.item(i).lng;
        //alert("var passed");
       // alert(tmplat+" "+tmplng);
      $('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(tmplat,tmplng), 'icon': image});
      };
    });      
}


var storeInfo = {
    id : null,
    result : null
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
		
		alert("new data added");
        tx.executeSql("select * from store order by id asc",[],gotlog, errorHandler);
		
	} else {
		alert("db already full");
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
        //alert("result saved");
        for (var i = 0; i < results.rows.length; i++) {
            var tmpName = results.rows.item(i).name;
            var tmpBrand = results.rows.item(i).brand;
            var tmpComfort = results.rows.item(i).comfort;
            var tmpLocation = results.rows.item(i).location;

            $('#store-list').append('<li><a href="#headline" data-id="' + i + '">' +
            '<img src="img/' + tmpBrand + '.jpeg"/>' +
            '<h3>' + tmpName + '</h3>' +
            '<p>comfort: ' + tmpComfort + '/5 </p>' +
            '<p>location: ' + tmpLocation + '</p></a></li>');
        }
    }
    $('#store-list').listview('refresh');
}



