function testWalkingDistance(){
// People Square station
var origin1 = new google.maps.LatLng(31.232844, 121.47537);
// People's Park Xizang Road
var destinationA = new google.maps.LatLng(31.2331118226, 121.4748416798);
// Shimao Store
var destinationB = new google.maps.LatLng(31.2340385288, 121.4751124253);
// Launch calulus for the two modes
getDrivingDistance();
getWalkingDistance();

function getDrivingDistance(){
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }, callback);

  function callback(response, status) {
    console.log("Driving distance to destinationA: " +response.rows[0].elements[0].distance.text);
    console.log("Driving distance to destinationB: " +response.rows[0].elements[1].distance.text);

  }
}

function getWalkingDistance(){
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: true,
    avoidTolls: true,
  }, callback);

  function callback(response, status) {
   console.log("Status: " +status);
   console.log ("length: "+response.rows[0].elements.length);
   console.log ("element 0: "+response.rows[0].elements[0].status);
   console.log("Walking distance to destinationB: " +response.rows[0].elements[1].distance.value);
   console.log("Walking distance to destinationA: " +response.rows[0].elements[0].distance.value);

  }
}
}