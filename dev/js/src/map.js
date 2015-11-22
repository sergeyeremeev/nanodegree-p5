/* global google*/
'use strict';
 
var map;

function initMap() {
    // check if google is loaded and log error if not
    if (typeof google !== 'object' || typeof google.maps !== 'object') {
        console.log('google is not loaded');
        return;
    }

    // set Empire State Building as the central coordinate for the map
    var empireStateBldgLoc = new google.maps.LatLng(40.7484444,-73.9878441,17),
    
    // use 'Pale Dawn' google map theme from https://snazzymaps.com/style/1/pale-dawn   
        mapStyles = [
            {   
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 33
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2e5d4"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c5dac6"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c5c6c6"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e4d7c6"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fbfaf7"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#acbcc9"
                    }
                ]
            }
        ],
    // set map options
        mapOptions = {
            mapTypeId: 'roadmap',
            center: empireStateBldgLoc,
            styles: mapStyles,
            zoom: 15
        };
        
    // create google map in #map div using the mapOptions
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
    // search for restaurants and cafes in a 1km radius around Empire State Bldg
    var requestedLocation = {
        location: empireStateBldgLoc,
        radius: '1000',
        types: ['restaurant', 'cafe', 'bakery', 'bar', 'store']
    },
        
    // call PlacesService method to search for nearby places
        service = new google.maps.places.PlacesService(map);
    
    service.nearbySearch(requestedLocation, nearbySearchCallback);
        
    var infoWindow = new google.maps.InfoWindow();
}

// callback function for nearbySearch function to find nearby places and create markers for each place
function nearbySearchCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

// create markers for
function createMarker(place) {
    // create a Marker object
    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        animation: google.maps.Animation.DROP
    });
}