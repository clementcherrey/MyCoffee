function preDownload(){
URL =  "http://www.icosky.com/icon/png/Animal/Care%20Bears/Funshine%20Bear.png";
Folder_Name = "example3";
File_Name = "myImage";
DownloadFile(URL, Folder_Name, File_Name);
}

//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name) {
//Parameters mismatch check
if (URL == null && Folder_Name == null && File_Name == null) {
    return;
}
else {
    //checking Internet connection availablity
    // var networkState = navigator.connection.type;
    // if (networkState == Connection.NONE) {
    if(false){ 
        return;
    } else {
        download(URL, Folder_Name, File_Name); //If available download function call
    }
  }
}

//Second step to get Write permission and Folder Creation
function download(URL, Folder_Name, File_Name) {
//step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

function fileSystemSuccess(fileSystem) {
    var download_link = encodeURI(URL);
    ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

    var directoryEntry = fileSystem.root; // to get root path of directory
    directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
    var rootdir = fileSystem.root;
    // var fp = rootdir.fullPath; 
    var fp =  rootdir.toUrl();// Returns Fulpath of local directory
    
    fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
    // download function call
    filetransfer(download_link, fp);
}

function onDirectorySuccess(parent) {
    // Directory created successfuly
}

function onDirectoryFail(error) {
    //Error while creating directory
    alert("Unable to create new directory: " + error.code);
}

  function fileSystemFail(evt) {
    //Unable to access file system
    alert(evt.target.error.code);
 }
}


//Third step for download a file into created folder
function filetransfer(download_link, fp) {
var fileTransfer = new FileTransfer();
// File download function with URL and local path
fileTransfer.download(download_link, fp,
                    function (entry) {
                        alert("download complete: " + entry.fullPath);
                    },
                 function (error) {
                     //Download abort errors or download failed errors
                     console.log("download error source " + error.source);
                     console.log("download error target " + error.target);
                     console.log("upload error code" + error.code);
                     console.log("upload error exception: " + error.exception);
                 }
            );
}





function downloadInCustomDirectory(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
}

function gotFS(fileSystem) {
 fileSystem.root.getDirectory("example2", {create: true}, gotDir);
}

function gotDir(dirEntry) {
    dirEntry.getFile("dummy.html", {create: true, exclusive: true}, gotFile);
}

function gotFile(fileEntry) {
    var sPath = fileEntry.toURL().replace("dummy.html","");
    var fileTransfer = new FileTransfer();
    fileEntry.remove();
    console.log("sPath: "+sPath);
    fileTransfer.download(
        "http://www.icosky.com/icon/png/Animal/Care%20Bears/Funshine%20Bear.png",
        sPath + "myImage.png",
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
}

function fail(){
    console.log("download FAIL !!");
}