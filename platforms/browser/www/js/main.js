/**
 * Created by admin on 12/29/14.
 */
function init(){
    document.addEventListener("deviceready", deviceready, true);
}

var db;

function deviceready(){
db = window.openDatabase("test","1.0","test", 10000000);
db.transaction(setup, errorHandler, dbReady);
}

function setup(tx){
    tx.executeSql('create table if not exists log(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'log TEXT, created DATE)');
    alert("setup done");
}


function errorHandler(e){
    alert(e.message);
}

function dbReady(){
    alert("in db ready");
    $("#testbutton").on("touchstart", function(e){
        alert("touch test detected");
        db.transaction(function(tx){
            tx.executeSql("select * from log order by created desc",[],gotlog, errorHandler);
        },errorHandler,function(){});
    })

    $("#addbutton").on("touchstart", function(e){
        alert("touch add detected");
        db.transaction(function(tx){
            var msg = "log it ...";
            var date = new Date();
            date.setDate(date.getDate());
            tx.executeSql("insert into log(log,created) values(?,?)",[msg, date.getTime()]);
        },errorHandler,function(){$("#results").html("Added row");});
    })
}

function gotlog(tx, results){
if(results.rows.length == 0){
    $("#results").html("no data");
    return false;
}
    var s="";
    for(var i = 0; i<results.rows.length; i++){
        var d = new Date();
        d.setTime(results.rows.item(i).created);
        s += d.toDateString()+" "+ d.toTimeString() + "<br/>";
    }
    $("#results").html(s);
}
