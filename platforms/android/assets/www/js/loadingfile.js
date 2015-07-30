function loadStaticMap(storeID,divID,listID){
	console.log("loadStaticMap");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

	function gotFS (fileSystem) {
		console.log("storeID= " +storeID);
		console.log("divID= " +divID);
		console.log("in gotFS");
 		fileSystem.root.getDirectory("coffeeMap", {create: false}, gotDir);
	}

	var gotDir = function(dirEntry) {
		console.log("in gotDir");
		var tmpFile = storeID+".png";
        dirEntry.getFile(tmpFile, {create: false, exclusive:true}, gotFile);
	}

	var gotFile = function(fileEntry) {
		console.log("in gotFile");
    	var sPath = fileEntry.toURL();
    	console.log("sPath = "+ sPath);
    	$('#'+divID).css('height','400px');
    	$('#'+divID).css('background-image', 'url(\'' + sPath + '\')');
    	$('#'+listID).listview('refresh');
	}

	var fail = function(){
    	console.log("loadStaticMap FAIL somewhere!!");
	}
}