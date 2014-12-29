/**
 * Created by clement on 12/29/14.
 */
function init(){
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
    ' comfort INTEGER,' +
    ' location TEXT)');
    alert("table created");
}


function errorHandler(e){
    alert(e.message);
}

function dbReady(){
    alert("in db ready");
  //  $("#testbutton").on("touchstart", function(e){
   //     alert("touch test detected");
        db.transaction(function(tx){
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store starbucks one","starbucks",4,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["costa store 1","costa",3,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store starbucks two","starbucks",4,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["costa store 52","costa",3,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store starbucks 33","starbucks",4,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["second costa store","costa",3,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store starbucks very big","starbucks",4,"unknow"]);
            tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["costa store","costa",3,"unknow"]);
            tx.executeSql("select * from store order by id asc",[],gotlog, errorHandler);
        });
    //})
}

function gotlog(tx, results){
    if(results.rows.length == 0){
    alert("no data");
        return false;
    }

   // var s="";
   // s += results.rows.length + "<br/>";
    for(var i = 0; i<results.rows.length; i++){
        var tmpName = results.rows.item(i).name;
        var tmpBrand = results.rows.item(i).brand;
        var tmpComfort = results.rows.item(i).comfort;
        var tmpLocation = results.rows.item(i).location;

        $('#store-list').append('<li><a href="#" data-id="' + i + '">' +
        '<img src="img/' + tmpBrand + '.jpeg"/>' +
        '<h3>' + tmpName + '</h3>' +
        '<p>comfort: ' + tmpComfort + '/5</p>' +
        '<p>location: ' + tmpLocation + '</p></a></li>');
    }

    $('#store-list').listview('refresh');

    $("#results").html(s);
}
