## Udacity Nanodegree Project 5 - Neightborhood Map

# Goal
Create an app using knockout.js, google maps a third party api of developer's choice, which will show a neighborhood map with selected locations and info about them.
The Goal is to show understanding of google maps, MVVM framework and the ability to familiarize with third party api's and effectively use them in an application.

# Features
This application is based on an area around the Empire State Building. First, the application loads a number of locations of a certain type within a specified range around Empire State Building.
The range selected is 1 kilometer and the locations type is bars, restaurants, stores, cafe and bakery. When the markers are created, the menu is populated with the location names with the help of knockout.js.
Pressing a location from the list or clicking on a marker opens an infowindow, which is templated with underscore.js templating. The content is separated into 3 tabs, first being basic information from google map.
Second tab is yelp data, which is loaded from yelp api by using oauth authorisation. After that the content from wikipedia api about the place is loaded. If there is no info to load or the api is not accessible, the messages are displayed and special links
are provided which make it easier for the user to search for the desired information himself. Other functionality includes:

1. Being able to open close menu (knockout.js)
2. Being able to filter locations with the input field (knockout.js)

If all locations are filtered out, a message is displayed instead of the locations list.

# What have I learned
For this project developers were not given any assets and we had to start from scratch, which can be very intimidating. It was very important to overcome this and be able to lay out a clear plan of how to act and which way to go first.
Although we were tought some ajax and MVVM frameworks basics, there were still a lot of missing bits in our knowledge. This showed the importance of being able to efficiently read documentation and pick the most important parts
from it. Where documentation was not enough, the usage of forums (such as Udacity and stackoverflow) and git repositories (which showed quite useful for oauth examples) was essential.
This project encompassed pretty much everything: html layout, individual design, usage of api's, MVVM framework, and all of these was a great lesson of what a real full featured project feels like.

# How to run application
Simply download the project via 'Download ZIP' button, or git clone to a desired destination. Navigate to the `build/` folder and open index.html file in your favorite browser.

# Sources
General:

- [Udacity forums](https://discussions.udacity.com/)
- [StackOverflow forums](http://stackoverflow.com/)

Knockout.js:

- [Knockout.js documentation](http://knockoutjs.com/documentation/introduction.html)
- [Post on computed observables](http://www.barbarianmeetscoding.com/blog/2013/10/20/barbarian-meets-knockout-knockout-dot-js-computed-observables/)

Api's and other information:

- [Wikipedia Api](https://www.mediawiki.org/wiki/API:Main_page)
- [Yelp Api](https://www.yelp.co.uk/developers/documentation/v2/overview)
- [OAuth documentation](http://oauth.net/core/1.0a/)
- [OAuth example for yelp](https://github.com/Yelp/yelp-api/commit/5d7ac91825b5bc119a17fe2022ec4d3ccc2b9ac2)
- [Post on JSONP](https://johnnywey.wordpress.com/2012/05/20/jsonp-how-does-it-work/)
