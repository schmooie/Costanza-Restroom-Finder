angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder', 'storage',
    function($scope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder, storage) {
      var mapCanvas;
      var mapOptions = {
        center: new google.maps.LatLng(40.754926, -73.984281),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 13
      };
      var markers = [];
      var allRestrooms = storage.getObject('allRestrooms');

      var initialize = function() {
        mapCanvas = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
        loadMarkers();
      };

      var loadMarkers = function() {
        if (allRestrooms === null) {
          console.log('Requesting data from server...');
          $http.get('http://nycrestrooms.herokuapp.com/api/v1/Restrooms')
            .success(function(restrooms) {
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

      var makeClusters = function() {
        var mc = new MarkerClusterer(mapCanvas, markers, mapFuncs.mcOptions);
      };

      google.maps.event.addDomListener(window, 'load', initialize);

      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
          var currentLocation = res.coords;
          var address = res.coords.latitude + ',' + res.coords.longitude;

          var userLocationObj = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
          // UNCOMMENT BELOW
          // mapCanvas.setCenter(userLocationObj);
          mapCanvas.setZoom(15);

          // GEORGE COSTANZA
          // temporary hard code -- switch back to userLocationObj
          var costanza = mapFuncs.makeMarker(false, mapCanvas, mapOptions.center, 'George Costanza');

          geocoder.geocodeAddress(address).then(function(res) {
            $scope.searchAddress = res.formattedAddress;
            console.log('GEOCODE success: ', res);
          }, function(err) {
            console.log('GEOCODE fail: ', err);
          });

          console.log(currentLocation);
          // TEMPORARY HARD CODE -- swap back in currentLocation
          var someRestrooms = mapFuncs.filterByRadius({
            latitude: 40.754926,
            longitude: -73.984281
          }, allRestrooms, 0.0145);

          console.log(someRestrooms);
          someRestrooms.forEach(function(el) {
            markers.push(mapFuncs.makeMarker(true, mapCanvas, el));
          });
          makeClusters();
        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };
    }
  ]);
