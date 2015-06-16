function downloadInCustomDirectory(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
}

function gotFS(fileSystem) {
 fileSystem.root.getDirectory("maptest", {create: true}, gotDir);
}

function gotDir(dirEntry) {
    dirEntry.getFile("dummy.html", {create: true, exclusive:true}, gotFile);
}

function gotFile(fileEntry) {
    var sPath = fileEntry.toURL().replace("dummy.html","");
    var fileTransfer = new FileTransfer();
    fileEntry.remove();
    console.log("sPath: "+sPath);
    fileTransfer.download(
        "https://maps.googleapis.com/maps/api/staticmap?region=cn&language=en-US&center=31.232844,%20121.47537&zoom=17&size=640x640&markers=color:orange%7Clabel:A%7C31.232844,%20121.47537&sensor=false",
        sPath + "myImage.png",
        function(theFile) {
            $('#mybigdivforimage').css('background-image', 'url(\'' + sPath + '/' +  'myImage.png'+ '\')'); 
            console.log("download complete: " + theFile.toURL());
            showLink(theFile.toURI());
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code: " + error.code);
            console.log("upload error exception: " + error.exception);
        }
        );
}

function fail(){
    console.log("download FAIL !!");
}