function initHomeDisplay(){
	var firsTime = false;
	// TO DELETE later
	// firsttime = true
	if(firsTime){
		// display welcome message
		displayWelcomeMsg(firsTime);
		//show popups with delay
		showPopups();
		//update database
	}else{

	}
}

function displayWelcomeMsg(firsTime){
	$("#message-wrapper").show();
	if (firsTime) {
		$("#message-wrapper").append(
			'<img src="img/messages/firstMsg.png" class="homeMSg">');
	}else{
		//display next msg
	}
}

function showPopups(){
	//trigger search popup first
	$("#popupSearch").popup( "open", { positionTo: "#search-1"} );
	// add DB action to say that the pop has been display

	//trigger GPS popup after search popup close
	$( "#popupSearch" ).on( "popupafterclose", 
 		function( event, ui ) {
  			console.log("after close first popup");
  			// add DB action to say that the pop has been display
  			setTimeout(function() {
  				$("#popupGps").popup( "open", { positionTo: "#midbutt"} );
  			}, 500);
		} );

	$( "#popupGps" ).on( "popupafterclose", 
		function( event, ui ) {
			console.log("after GPS close");
		} );
}

