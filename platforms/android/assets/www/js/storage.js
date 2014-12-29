/**
 * Created by admin on 12/29/14.
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
    
    tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store1","brand1",4,"unknow"]);
    tx.executeSql("insert into store(name,brand,comfort,location) values(?,?,?,?)",["store2","brand2",3,"unknow"]);
    alert("initial data added");


}


function errorHandler(e){
    alert(e.message);
}

function dbReady(){
    alert("in db ready");
    $("#testbutton").on("touchstart", function(e){
        alert("touch test detected");
        db.transaction(function(tx){
            tx.executeSql("select * from store order by id desc",[],gotlog, errorHandler);
        },errorHandler,function(){});
    })

}

function gotlog(tx, results){
    if(results.rows.length == 0){
        $("#results").html("no data");
        return false;
    }
    var s="";
    s += results.rows.length + "<br/>";
    for(var i = 0; i<results.rows.length; i++){
        var tmpName = results.rows.item(i).name;
        var tmpName = results.rows.item(i).name;
        var tmpBrand = results.rows.item(i).brand;
        var tmpComfort = results.rows.item(i).comfort;
        var tmpLocation = results.rows.item(i).location;

        s += tmpName +" "+ tmpBrand+ " " + tmpComfort+ " "+ tmpLocation+" "+"<br/>";
    }
    $("#results").html(s);
}
