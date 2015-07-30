function emailMeFunction(){
	console.log("emailMeFunction triggered!");
	cordova.plugins.email.isAvailable(
		function (isAvailable) {
			console.log("isAvailable: " +isAvailable);
			console.log('Email service isAvailable');
			cordova.plugins.email.open({
				to:      'clementcherrey518@163.com',
				cc:      '',
				bcc:     '',
				subject: 'Greetings',
				body:    'How are you? Nice greetings from my app'
			});
		}
		);
}


function rateSimple(){
	console.log("simple rate called");
	var url = encodeURI("https://play.google.com/store/apps/details?id=com.dotc.lockbooster");
	window.open(url,'_system','location=yes');
}