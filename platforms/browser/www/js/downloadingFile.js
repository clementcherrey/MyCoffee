function downloadStaticMap(){
    console.log("in downloadStaticMap");

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
        var sPath = fileEntry.toURL().replace("staticMapNoDL.zip","staticMap.zip");
        var unzipPath = fileEntry.toNativeURL().replace("staticMapNoDL.zip","");
        var fileTransfer = new FileTransfer();
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
            "http://mycoffee.site11.com/costaMap.zip",
            sPath,
            function(theFile) {
                console.log("url new file: "+ theFile.toURL());
                zip.unzip(sPath, unzipPath,
                    function(code){
                        console.log("unzip code: " + code)},fail);
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code: " + error.code);
                console.log("download error exception: " + error.exception);
            }
            );
    }

    function fail(error){
        console.log(" FAIL somewhere!!");
        console.log(" error source " + error.source);
        console.log(" error target " + error.target);
        console.log(" error code: " + error.code);
        console.log(" error exception: " + error.exception);
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
}
