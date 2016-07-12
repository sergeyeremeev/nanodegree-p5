"use strict";function AppViewModel(){function e(e){return new google.maps.Marker({position:e.geometry.location,map:i,animation:google.maps.Animation.DROP,id:"marker-"+e.place_id})}function t(t,a){if(a==google.maps.places.PlacesServiceStatus.OK){for(var n=t.length,s=0;n>s;s++){var r=t[s],l=e(r);o(l,r),r.placeMatches=ko.observable(!0),c.places.push(r),p[r.name]=l,f.extend(new google.maps.LatLng(r.geometry.location.lat(),r.geometry.location.lng()))}i.fitBounds(f),c.placesLoaded(!0)}}function a(e,t){r.setContent('<span class="iw-loading"></span>'),n(e,function(t){r.setContent(h(e,t))}),r.open(i,t),t.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){t.setAnimation(null)},1400)}function n(e,t){var a={oauth_consumer_key:v.consumerKey,oauth_token:v.accessToken,oauth_signature_method:"HMAC-SHA1",limit:1,callback:"cb",oauth_nonce:Math.floor(1e12*Math.random()).toString(),oauth_timestamp:Math.floor(Date.now()/1e3),location:e.vicinity,term:e.name};a.oauth_signature=oauthSignature.generate("GET",v.url,a,v.consumerSecret,v.accessTokenSecret);var n={yelp:null,wiki:null};$.ajax({url:v.url,data:a,cache:!0,dataType:"jsonp",success:function(){console.log("yelp successful")},error:function(){console.log("Yelp not available")},complete:function(a){n.yelp=a,s(e,n,t)}})}function s(e,t,a){var n={action:"parse",prop:"text",format:"json",page:e.name,section:0};$.ajax({url:"https://en.wikipedia.org/w/api.php",data:n,dataType:"jsonp",success:function(){console.log("wiki successful")},error:function(){console.log("wiki not available")},complete:function(e){t.wiki=e,a(t)}})}function o(e,t){google.maps.event.addListener(e,"click",function(){a(t,e)})}var i,r,l,c=this,p={};c.places=ko.observableArray(),c.placeFilter=ko.observable(""),c.placesLoaded=ko.observable(!1),c.noMatches=ko.observable(!1),$(document).width()>=768?c.menuOpen=ko.observable(!0):c.menuOpen=ko.observable(!1);var u=new google.maps.LatLng(40.7484444,-73.9878441,17),m=[{featureType:"administrative",elementType:"all",stylers:[{visibility:"on"},{lightness:33}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2e5d4"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#c5dac6"}]},{featureType:"poi.park",elementType:"labels",stylers:[{visibility:"on"},{lightness:20}]},{featureType:"road",elementType:"all",stylers:[{lightness:20}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#c5c6c6"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#e4d7c6"}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#fbfaf7"}]},{featureType:"water",elementType:"all",stylers:[{visibility:"on"},{color:"#acbcc9"}]}],g={mapTypeId:"roadmap",center:u,styles:m,zoom:15};i=new google.maps.Map(document.getElementById("map"),g);var y={location:u,radius:"1000",types:["restaurant","cafe","bakery","bar","store"]},d=new google.maps.places.PlacesService(i),f=new google.maps.LatLngBounds;d.nearbySearch(y,t);var v={consumerKey:"iLsXatdw5GShDtUd3IKqYw",consumerSecret:"A1LpfhnBOIgJWIXCggtt_nF9P_0",accessToken:"UNJtXwRqzWVHmwelKlCNDeqi-xLtEaon",accessTokenSecret:"rnbRnALSvXj9CS3CU_Z0Xlm6ttU",serviceProvider:{signatureMethod:"HMAC-SHA1"},url:"https://api.yelp.com/v2/search"};r=new google.maps.InfoWindow,_.templateSettings.variable="rc";var b=_.template($("#infowindow-content").html()),h=function(e,t){console.log(t);var a="",n="";if(t.wiki.responseJSON)if(t.wiki.responseJSON.error)a="Sorry, wiki data for this place is not available.";else{var s=t.wiki.responseJSON.parse.text["*"];n="https://www.wikipedia.org/wiki/"+e.name.replace(/ /g,"_"),a=$("<div/>").html(s).text().substring(0,330)+"..."}else a="Wikipedia service is not available";var o={message:"",name:"",img:"",text:"",rating:"",ratingStars:"",reviewCount:"",url:""},i="";return t.yelp.responseJSON?0===t.yelp.responseJSON.businesses.length?o.message="Sorry, yelp data for this place is not available.":(o.name=t.yelp.responseJSON.businesses[0].name,o.img=t.yelp.responseJSON.businesses[0].image_url,o.text=t.yelp.responseJSON.businesses[0].snippet_text,o.rating=t.yelp.responseJSON.businesses[0].rating,o.ratingStars=t.yelp.responseJSON.businesses[0].rating_img_url,o.reviewCount=t.yelp.responseJSON.businesses[0].review_count,o.url=t.yelp.responseJSON.businesses[0].url,i=t.yelp.responseJSON.businesses[0].display_phone):o.message="Yelp service is not available",b({tabs:[{name:"Info",content:{title:e.name,address:e.vicinity,phone:i,openNow:e.opening_hours}},{name:"Reviews",content:{message:o.message,name:o.name,img:o.img,text:o.text,rating:o.rating,ratingStars:o.ratingStars,reviewCount:o.reviewCount,url:o.url}},{name:"Wiki",content:{text:a,link:n}}]})};$(document).on("click",".tabs li",function(){l=$(this),$(".tabs").find("li").removeClass("selected"),l.addClass("selected"),$(".tab-single").removeClass("current"),$('.tab-single[data-content="'+l.data("content")+'"]').addClass("current")}),c.toggleMarker=function(e){var t=p[e.name];a(e,t)},c.filterPlaces=ko.computed(function(){if(c.placesLoaded()){for(var e=c.places(),t=e.length,a=t,n=0;t>n;n++){var s=e[n],o=p[s.name];-1===s.name.toLowerCase().indexOf(c.placeFilter().toLowerCase())&&""!==c.placeFilter()?(o.setMap(null),s.placeMatches(!1),a--):(o.setMap(i),s.placeMatches(!0))}0===a?c.noMatches(!0):c.noMatches(!1)}}),c.toggleMenu=function(){c.menuOpen(!c.menuOpen())}}function initMap(){ko.applyBindings(new AppViewModel)}