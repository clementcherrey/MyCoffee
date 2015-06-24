function downloadStaticMap(){
    console.log("in downloadStaticMap");

    function gotFS(fileSystem) {
        console.log("in gotFS");
        fileSystem.root.getDirectory("maptest", {create: true}, gotDir, fail);
    }

    function gotDir(dirEntry) {
        console.log("in gotDir");
        var tmpFile = "staticMap.zip";
        dirEntry.getFile(tmpFile, {create: true, exclusive:true}, gotFile,fail);
        };

    function gotFile(fileEntry) {
        var sPath = fileEntry.toURL().replace("staticMap.zip","staticMapDl.zip");
        var unzipPath = fileEntry.toNativeURL().replace("staticMap.zip","");
        var fileTransfer = new FileTransfer();
        fileEntry.remove();
        console.log("sPath: "+sPath);
        console.log("unzipPath: "+unzipPath);
        fileTransfer.download(
            "http://mycoffee.site11.com/staticMap.zip",
            sPath,
            function(theFile) {
                console.log("url new file: "+ theFile.toURL());
                zip.unzip(sPath, unzipPath,
                    function(code){
                        console.log("unzip code : " + code)},fail);
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
        console.log("download FAIL somewhere!!");
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code: " + error.code);
        console.log("download error exception: " + error.exception);
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
}
