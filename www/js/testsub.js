							
function getSubways(){
	var subways = [];
	db.transaction(function(tx) {
		tx.executeSql("select * from subway",
			[],function(tx, result){
				for (var i = results.rows.length - 1; i >= 0; i--) {
					subways.push({
						id : result.rows.item(0).id,
						station : result.rows.item(0).lat,
						lat: result.rows.item(0).lat,
						lng: result.rows.item(0).lng,
					});
				}
			},errorHandler);
	});
	return subways;
}

function printSubways(){
	var subways = [];
	db.transaction(function(tx) {
		tx.executeSql("select * from subway",
			[],function(tx, result){
				for (var i = result.rows.length - 1; i >= 0; i--) {
					var tmpPosition = new google.maps.LatLng(result.rows.item(i).lat, result.rows.item(i).lng);
					markers.push(new google.maps.Marker({
						position : tmpPosition,
						map : map,
						icon : 'img/xigua.png',
					}));
				}
			},errorHandler);
	});
}