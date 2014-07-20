angular.module('pottyParty.services')
  .factory('mapFuncs', [

    function() {
      return {
        style: [{
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "lightness": 100
          }, {
            "visibility": "simplified"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "on"
          }, {
            "color": "#C6E2FF"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#C5E3BF"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#D1D1B8"
          }]
        }],
        mcOptions: {
          gridSize: 40,
          maxZoom: 17,
          styles: [{
            textColor: 'black',
            url: 'img/tp_53.png',
            height: 53,
            width: 53
          }, {
            textColor: 'black',
            url: 'img/tp_56.png',
            height: 56,
            width: 56
          }, {
            textColor: 'black',
            url: 'img/tp_66.png',
            height: 66,
            width: 66
          }, {
            textColor: 'black',
            url: 'img/tp_78.png',
            height: 78,
            width: 78
          }]
        },
        makeMarker: function(map, data, options) {
          var animation = null;
          var position;
          var icon;
          var title;

          if (options.rawCoords) {
            // raw data coordinates = [long, lat]
            position = new google.maps.LatLng(data.coords[1], data.coords[0]);
            title = data.name;
          } else {
            position = data;
            animation = google.maps.Animation.DROP;
            title = options.title;
          }

          if (data.category === 'Coffee Shop') {
            icon = 'img/coffee.png';
          } else if (data.category === 'Public') {
            icon = 'img/public.png';
          } else if (data.category === 'Hotel') {
            icon = 'img/hotel.png';
          } else if (data.category === 'Book Store') {
            icon = 'img/book.png';
          } else if (data.category === 'Other') {
            icon = 'img/other.png';
          } else {
            icon = 'img/costanza.png';
          }

          var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            icon: icon,
            animation: animation
          });

          if (options.onTop) {
          	// Need a custom overlay so that Costanza sits on top of the clusters -- zIndex DOES NOT work
          }
          return marker;
        },
        filterByRadius: function(origin, data, radius) {
          // 0.0145 lat/lng
          var c2 = radius * radius;
          var xMin = origin.latitude - radius;
          var xMax = origin.latitude + radius;
          var yMin = origin.longitude - radius;
          var yMax = origin.longitude + radius;
          var filteredLocations = [];

          data.forEach(function(place) {
            if (place.coords[1] > xMax || place.coords[1] < xMin ||
              place.coords[0] > yMax || place.coords[0] < yMin) {
              return;
            }
            var a2 = (place.coords[1] - origin.latitude) * (place.coords[1] - origin.latitude);
            var b2 = (place.coords[0] - origin.longitude) * (place.coords[0] - origin.longitude);
            if (a2 + b2 <= c2) {
              filteredLocations.push(place);
            }
          });
          return filteredLocations;
        }
      };
    }
  ]);
