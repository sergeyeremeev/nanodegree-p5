var map,
	markers;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.722953, lng: -74.0119745},
		zoom: 11
	});
}

markers = [
	['London Eye, London', 51.503454, -0.119562],
	['Palace of Westminster, London', 51.499633, -0.124755]
];