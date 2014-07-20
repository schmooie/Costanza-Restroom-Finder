angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder', 'storage',
    function($scope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder, storage) {

      var mapOptions = {
        center: new google.maps.LatLng(40.754926, -73.984281),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 13
      };

      var mapCanvas;
      var allRestrooms = storage.getObject('allRestrooms');

      var loadMarkers = function () {
	      if (allRestrooms === null) {
	        console.log('Requesting data from server...');
	        $http.get('http://nycrestrooms.herokuapp.com/api/v1/Restrooms')
	        	.success(function(restrooms){
	        		allRestrooms = restrooms;
	            storage.setObject('allRestrooms', allRestrooms);
	         //    allRestrooms.forEach(function(el){
	      			// 	mapFuncs.makeMarker(true, mapCanvas, el);
	      			// });
	        		console.log(allRestrooms);
	        	}).error(function(err) {
	            console.log('Failed to get restrooms: ', err);
	          });
	      } else {
	        console.log('Loaded from localStorage: ', allRestrooms);
	      }
      };

      var filterByRadius = function(origin, data, radius) {
        // 0.0145 lat/lng
        var c2 = radius*radius;
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
          var a2 = (place.coords[1]-origin.latitude)*(place.coords[1]-origin.latitude);
          var b2 = (place.coords[0]-origin.longitude)*(place.coords[0]-origin.longitude);
          if (a2 + b2 <= c2) {
            filteredLocations.push(place);
          }
        });

        return filteredLocations;
      };

      var initialize = function() {
        mapCanvas = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
        loadMarkers();
      };

      google.maps.event.addDomListener(window, 'load', initialize);

      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
          var currentLocation = res.coords;
          var address = res.coords.latitude + ',' + res.coords.longitude;

          var userLocation = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
          mapCanvas.setCenter(userLocation);
          mapCanvas.setZoom(15);

          // GEORGE COSTANZA
          var costanza = mapFuncs.makeMarker(false, mapCanvas, userLocation, 'George Costanza');
          // costanza.setMap(mapCanvas);

          geocoder.geocodeAddress(address).then(function(res) {
            $scope.searchAddress = res.formattedAddress;
            console.log('GEOCODE success: ', res);
          }, function(err) {
            console.log('GEOCODE fail: ', err);
          });

          console.log(currentLocation);
          var someRestrooms = filterByRadius(currentLocation, allRestrooms, 0.0145);

          console.log(someRestrooms);
          someRestrooms.forEach(function(el){
             mapFuncs.makeMarker(true, mapCanvas, el);
          });


        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };



    }
  ]);
