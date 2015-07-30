// get the url for all brands and launch the download for each of them
function setupDownload(){
    console.log("in setupDownload");
    var getPackageInfo = function(){
        db.transaction(function(tx) {
            tx.executeSql("SELECT brand.name, onlinePack.url FROM brand INNER JOIN onlinePack ON brand.id=onlinePack.brand_id",
                [],launchDownload); 
            console.log("after INNER JOIN");
        });  
    }

    var launchDownload = function (tx,result){
        console.log("in launchDownload");
        console.log(result.rows);
        var loopNUmber = result.rows.length;

        syncLoop(loopNUmber, function(loop){
            console.log("loop.iteration = "+ loop.iteration());
            var tmpItem = result.rows.item(loop.iteration());
            console.log("brand= " + tmpItem.name+", url= " + tmpItem.url);
            // update popup display
            updatePopDisplay(loop.iteration()+1,tmpItem.name);

            function callnext() {
                console.log("in callnext");
                // update onlinePack status in db
                downlaodDbUpdate(tx);
                // go to next DL
                loop.next();
            }

            var downlaodDbUpdate = function(tx){
                console.log("in downlaodDbUpdate for url="+tmpItem.url);
                tx.executeSql('UPDATE onlinePack SET complete=? WHERE url=?',[true,myUrl],
                    function(tx,results){console.log("Successfully UPDATE onlinePack")},
                    function(tx,error){console.log("Could not UPDATE onlinePack")}
                    );
            }

            function updatePopDisplay (counter,brand){
                console.log("in updatePopDisplay for brand="+tmpItem.name);
                $("#downloadBrand").empty();
                $("#downloadBrand").append(brand);

                $("#downloadedFiles").empty();
                $("#downloadedFiles").append("file "+counter+"/"+loopNUmber);
            }

            downloadStaticMap(tmpItem.name,tmpItem.url,callnext);

        }, function(){console.log("finish")});

    }
    getPackageInfo(); //init the global process
}


// download and unzip of ONE package of map
function downloadStaticMap(brand,packageUrl,dlFinish){
    console.log("in downloadStaticMap for url ="+packageUrl);
    $("#downloadMe").addClass('disableClick');

    function gotFS(fileSystem) {
        console.log("in gotFS");
        fileSystem.root.getDirectory("coffeeMap", {create: true}, gotDir, fail);
    }

    function gotDir(dirEntry) {
        console.log("in gotDir");
        var tmpFile = "staticMapNoDL.zip";
        dirEntry.getFile(tmpFile, {create: true, exclusive:true}, gotFile,fail);
        };

    function gotFile(fileEntry) {
        console.log("brand: " +brand);
        var sPath = fileEntry.toURL().replace("staticMapNoDL.zip",brand+".zip");
        var unzipPath = fileEntry.toNativeURL().replace("staticMapNoDL.zip","");
        var fileTransfer = new FileTransfer();
        initAboort(fileTransfer); //activate the cancel button
        fileEntry.remove();
        console.log("sPath: "+sPath);
        console.log("unzipPath: "+unzipPath);

        fileTransfer.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                console.log(perc + "% loaded...");
                $("#downloadStatus").empty();
                $("#downloadStatus").append(perc + "% loaded...");
            } else {
                console.log("Loading");
            }
        };

        fileTransfer.download(
            packageUrl,
            sPath,
            function(theFile) {
                console.log("url new file: "+ theFile.toURL());
                dlFinish();
                zip.unzip(sPath, unzipPath,
                    function(code){
                        console.log("unzip code: " + code);
                        $("#downloadMe").removeClass('disableClick');});

            },
            function(error) {
                // error.preventDefault();
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code: " + error.code);
                console.log("download error exception: " + error.exception);
                $("#downloadMe").removeClass('disableClick');
            },
            true);
    }

    function fail(error){
        console.log(" FAIL somewhere!!");
        console.log(" error source " + error.source);
        console.log(" error target " + error.target);
        console.log(" error code: " + error.code);
        console.log(" error exception: " + error.exception);
        $("#downloadMe").removeClass('disableClick');
    }

    function initAboort(ft){
        $("#more-cancel").on('vclick', function(){
            ft.abort();
        });
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
}



