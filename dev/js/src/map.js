/* global google, ko, _, $*/
'use strict';

function AppViewModel() {

    // variables that are frequently reused throughout the application
    var self = this,
        map,
        infoWindow,
        markers = {},
        $this;

    // observable variables to create locations list, monitor filter field,
    // check when all places have been loaded from google maps,
    // check if filter matches any place names and set menu state
    self.places = ko.observableArray();
    self.placeFilter = ko.observable('');
    self.placesLoaded = ko.observable(false);
    self.noMatches = ko.observable(false);
    if ($(document).width() >= 768) {
        self.menuOpen = ko.observable(true);
    } else {
        self.menuOpen = ko.observable(false);
    }


    /* --------------------------------------------------
     * Google map options, markers, locations, etc
     * ------------------------------------------------*/

    // set Empire State Building as the central coordinate for the map
    var empireStateBldgLoc = new google.maps.LatLng(40.7484444, -73.9878441, 17),

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

    // initialize google map in #map div using the mapOptions
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // search for restaurants and cafes in a 1km radius around Empire State Bldg
    var requestedLocation = {
            location: empireStateBldgLoc,
            radius: '1000',
            types: ['restaurant', 'cafe', 'bakery', 'bar', 'store']
        },

    // call PlacesService method to search for nearby places
        service = new google.maps.places.PlacesService(map),

    // initialize bounds variable to be updated by nearbySearchCallback function
        bounds = new google.maps.LatLngBounds();

    service.nearbySearch(requestedLocation, nearbySearchCallback);

    // function to return a new marker for a specified place
    function createMarker(place) {
        return new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            id: 'marker-' + place.place_id
        });
    }

    // callback function for nearbySearch function to find nearby places and create markers for each place
    function nearbySearchCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var resultsLength = results.length;
            
            for (var i = 0; i < resultsLength; i++) {
                var thisResult = results[i],
                    marker = createMarker(thisResult);

                // add click event listener to each marker
                clickMarker(marker, thisResult);

                thisResult.placeMatches = ko.observable(true);

                // push each result to our places array, to display them as list items in our search
                self.places.push(thisResult);

                // push markers to markers object
                markers[thisResult.name] = marker;

                // extend bounds for each marker created
                bounds.extend(
                    new google.maps.LatLng(
                        thisResult.geometry.location.lat(),
                        thisResult.geometry.location.lng()
                    )
                );
            }
            // update map zoom and center after all markers are created, to make sure they all fit on screen
            map.fitBounds(bounds);

            // set placesLoaded to true, so we can now use filter function
            self.placesLoaded(true);
        }
    }


    /* --------------------------------------------------
     * Infowindow, content, api data, marker click event
     * ------------------------------------------------*/

    // function for setting marker's infowindow content and opening it
    function openInfoWindow(place, marker) {

        // clear infowindow before opening next one
        infoWindow.setContent('<span class="iw-loading"></span>');

        // call functions that get yelp and wiki data and then sets
        // infowindow content as a callback after receiving data from both calls
        getPlaceInfo(place, function(placeData) {
            infoWindow.setContent(iwContent(place, placeData));
        });

        // open infowindow above the clicked marker
        infoWindow.open(map, marker);

        // set marker bounce with 1400 timeout for exactly 2 bounces
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);
    }

    // yelp authentication values object
    var yelpAuth = {
        consumerKey: "iLsXatdw5GShDtUd3IKqYw",
        consumerSecret: "A1LpfhnBOIgJWIXCggtt_nF9P_0",
        accessToken: "UNJtXwRqzWVHmwelKlCNDeqi-xLtEaon",
        accessTokenSecret: "rnbRnALSvXj9CS3CU_Z0Xlm6ttU",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        },
        url: 'https://api.yelp.com/v2/search'
    };

    // function that first requests yelp data and then calls wiki function
    function getPlaceInfo(place, callback) {

        // yelp parameters for a selected place
        var parameters = {
            oauth_consumer_key: yelpAuth.consumerKey,
            oauth_token: yelpAuth.accessToken,
            oauth_signature_method: 'HMAC-SHA1',
            limit: 1,
            callback: 'cb',
            oauth_nonce: Math.floor(Math.random() * 1e12).toString(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            location: place.vicinity,
            term: place.name
        };

        // get oauth signature for the specified parameters
        parameters.oauth_signature = oauthSignature.generate('GET', yelpAuth.url, parameters,
            yelpAuth.consumerSecret, yelpAuth.accessTokenSecret);

        //placeData object which will store data returned by yelp and wiki requests
        var placeData = {
            yelp: null,
            wiki: null
        };

        // yelp ajax request
        $.ajax({
            url: yelpAuth.url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',

            // log successes and errors for convenience
            success: function() {
                console.log('yelp successful');
            },
            error: function() {
                console.log('Yelp not available');
            },

            // store data and call wiki function after yelp request returns data
            complete: function(data) {
                placeData.yelp = data;
                getWikiInfo(place, placeData, callback);
            }
        });
    }

    // function that requests data about a place from wikipedia
    // the request is based on place name.
    function getWikiInfo(place, placeData, callback) {

        // wikipedia parameters
        var wikiParams = {
            action: 'parse',
            prop: 'text',
            format: 'json',
            page: place.name,
            section: 0
        };

        // wiki ajax request
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: wikiParams,
            dataType: 'jsonp',
            // log successes and errors for convenience
            success: function() {
                console.log('wiki successful');
            },
            error: function() {
                console.log('wiki not available');
            },
            complete: function(data) {
                placeData.wiki = data;
                callback(placeData);
            }
        });
    }

    // function to add click event listeners to each marker
    function clickMarker(marker, place) {

        // call openInfoWindow function on marker click
        google.maps.event.addListener(marker, 'click', function () {
            openInfoWindow(place, marker);
        });
    }

    // initialize infowindow
    infoWindow = new google.maps.InfoWindow();

    // underscore templating for infowindow content
    _.templateSettings.variable = 'rc';
    var infoWindowTemplate = _.template($('#infowindow-content').html()),

        iwContent = function (place, placeData) {
            console.log(placeData);

            // check that wiki request has returned data, display 'not available' error if not, then
            // check that wiki has returned text for specified location. Display error text if not.
            // If there is text, strip html tags from it and set to max length of 330 characters.
            // Add read more link at the end of the snippet
            var wikiText = '',
                wikiLink = '';
            if (placeData.wiki.responseJSON) {
                if (placeData.wiki.responseJSON.error) {
                    wikiText = 'Sorry, wiki data for this place is not available.';
                } else {
                    var wikiHtml = placeData.wiki.responseJSON.parse.text['*'];
                    wikiLink = 'https://www.wikipedia.org/wiki/' + place.name.replace(/ /g,"_");
                    wikiText = $('<div/>').html(wikiHtml).text().substring(0, 330) + '...';
                }
            } else {
                wikiText = 'Wikipedia service is not available';
            }

            // initialize yelp variables
            var yelpData = {
                    message: '',
                    name: '',
                    img: '',
                    text: '',
                    rating: '',
                    ratingStars: '',
                    reviewCount: '',
                    url: ''
                },
                yelpPhone = '';

            // check that yelp request returned data, if not, display 'not available' error, then
            // check that yelp has returned any business. If not, display 'no data returned' message
            // else, assign appropriate data to the variables
            if (placeData.yelp.responseJSON) {
                if (placeData.yelp.responseJSON.businesses.length === 0) {
                    yelpData.message = 'Sorry, yelp data for this place is not available.';
                } else {
                    yelpData.name = placeData.yelp.responseJSON.businesses[0].name;
                    yelpData.img = placeData.yelp.responseJSON.businesses[0].image_url;
                    yelpData.text = placeData.yelp.responseJSON.businesses[0].snippet_text;
                    yelpData.rating = placeData.yelp.responseJSON.businesses[0].rating;
                    yelpData.ratingStars = placeData.yelp.responseJSON.businesses[0].rating_img_url;
                    yelpData.reviewCount = placeData.yelp.responseJSON.businesses[0].review_count;
                    yelpData.url = placeData.yelp.responseJSON.businesses[0].url;
                    yelpPhone = placeData.yelp.responseJSON.businesses[0].display_phone;
                }
            } else {
                yelpData.message = 'Yelp service is not available';
            }

            return infoWindowTemplate({
                tabs: [
                    {
                        name: 'Info',
                        content: {
                            title: place.name,
                            address: place.vicinity,
                            phone: yelpPhone,
                            openNow: place.opening_hours
                        }
                    },
                    {
                        name: 'Reviews',
                        content: {
                            message: yelpData.message,
                            name: yelpData.name,
                            img: yelpData.img,
                            text: yelpData.text,
                            rating: yelpData.rating,
                            ratingStars: yelpData.ratingStars,
                            reviewCount: yelpData.reviewCount,
                            url: yelpData.url
                        }
                    },
                    {
                        name: 'Wiki',
                        content: {
                            text: wikiText,
                            link: wikiLink
                        }
                    }
                ]
            });
        };

    // switch between infowindow tabs
    $(document).on('click', '.tabs li', function () {
        $this = $(this);
        $('.tabs').find('li').removeClass('selected');
        $this.addClass('selected');
        $('.tab-single').removeClass('current');
        $('.tab-single[data-content="' + $this.data('content') + '"]').addClass('current');
    });


    /* --------------------------------------------------
     * Menu list, filter input, menu toggle state
     * ------------------------------------------------*/

    // toggle marker on list item click
    self.toggleMarker = function(place) {
        var marker = markers[place.name];
        openInfoWindow(place, marker);
    };

    // filter list items and markers on filter field input
    self.filterPlaces = ko.computed(function() {
        if (self.placesLoaded()) {
            var allPlaces = self.places(),
                totalPlaces = allPlaces.length;

            // all places are visible initially
            var visiblePlaces = totalPlaces;

            for (var i = 0; i < totalPlaces; i++) {
                var thisPlace = allPlaces[i];
                var thisMarker = markers[thisPlace.name];

                if (thisPlace.name.toLowerCase().indexOf(self.placeFilter().toLowerCase()) === -1 &&
                        self.placeFilter() !== '') {
                    thisMarker.setMap(null);
                    thisPlace.placeMatches(false);
                    visiblePlaces--;
                } else {
                    thisMarker.setMap(map);
                    thisPlace.placeMatches(true);
                }
            }

            // if all places are invisible, show 'no results' message
            visiblePlaces === 0 ? self.noMatches(true) : self.noMatches(false);
        }
    });

    // revert menuOpen value on toggle menu button click
    self.toggleMenu = function() {
        self.menuOpen(!self.menuOpen());
    };
}

function initMap() {
    ko.applyBindings(new AppViewModel());
}