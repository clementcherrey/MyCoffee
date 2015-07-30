document.addEventListener("deviceready", initListener, false);
function initListener() {
    console.log("in initListener");
    document.addEventListener("backbutton", function(e){
    	console.log("tap backbutton detected");
        if($.mobile.activePage.is('#homepage')){
        	console.log("in homepage");
            e.preventDefault();
             history.go(-(history.length - 1))
        }else{
            navigator.app.backHistory()
        	console.log("in other page");
        }
    }, false);

    $("#emailMe").on('vclick', emailMeFunction);

    $("#downloadMe").on('vclick', downloadStaticMap);

}