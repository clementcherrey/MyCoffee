// ---------------- TRY AJAX -----------------
function sendData(myData){
	console.log("try request");
	$.ajax({
        url: 'http://localhost:8080/',
        // dataType: "jsonp",
        data: myData,
        type: 'POST',
        // jsonpCallback: 'callback',
        success: function (data) {
            console.log('Success: ')
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        },
    });
}
//------------------ END AJAX -------------------