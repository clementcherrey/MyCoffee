function downloadFile(){
console.log("in downloadFile");
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    function onFileSystemSuccess(fileSystem) {
        console.log("in onFileSystemSuccess");
        fileSystem.root.getFile(
        "dummy.html", {create: true, exclusive: false}, 
        function gotFileEntry(fileEntry) {
            var sPath = fileEntry.toURL().replace("dummy.html","");
            var fileTransfer = new FileTransfer();
            fileEntry.remove();
            console.log("sPath: "+sPath);
            fileTransfer.download(
                "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                sPath + "theFile.pdf",
                function(theFile) {
                    console.log("download complete: " + theFile.toURI());
                    showLink(theFile.toURI());
                },
                function(error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code: " + error.code);
                    console.log("upload error exception: " + error.exception);
                }
            );
        }, fail);
    }, fail);
};

function fail(){
    console.log("download FAIL !!");
}