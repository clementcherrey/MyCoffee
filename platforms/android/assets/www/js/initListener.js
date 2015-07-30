function initMainListeners() {
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

    $("#rateMe").on('vclick', rateSimple);

    $("#downloadMe").on('vclick', function(){
        setTimeout(function(){setupDownload()},200);
    });

    $("#store-list").on('vclick', 'li a', function() {
        storeInfo.id = $(this).attr('data-id');
        storeInfo.distance = $(this).attr('data-dist');
        $("body").pagecontainer("change", "#headline", {
            role : "page"
        });
    });

    $( "#searchForm" ).submit(function( event ) {
        console.log( "Handler for .submit() called." );
        event.preventDefault();
        search();
    });

    $("#autocomplete").on('vclick', 'li', function() {
        var searchvalue = $(this).text();
        $("#search-1").val(searchvalue);
        search();
    });

    console.log("after autocomplete listener")

    $("#headline").on('pagebeforeshow',headlinePreDisplay);
}