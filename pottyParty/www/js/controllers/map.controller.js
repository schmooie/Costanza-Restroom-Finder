angular.module('pottyParty.controllers')
  .controller('MapCtrl', ['$scope', '$rootScope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder', 'storage', 'googleMaps',
    function($scope, $rootScope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder, storage, googleMaps) {

      var mapCanvas = googleMaps.getMap('mainMap');
      var markers = [];

      $rootScope.showMap = true;

      var makeClusters = function() {
        var mc = new MarkerClusterer(mapCanvas, markers, mapFuncs.mcOptions);
      };

      // TODO: Repurpose existing markers + markerClusters on each getCurrentPosition call
      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
          // TEMPORARY HARD CODE -- swap back in currentLocation commented below
          var currentLocation = {latitude: 40.754926, longitude: -73.984281};
          //var currentLocation = res.coords;
          console.log(currentLocation);

          var address = currentLocation.latitude + ',' + currentLocation.longitude;
          var userLocationObj = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);

          mapCanvas.setCenter(userLocationObj);
          mapCanvas.setZoom(15);

          // GEORGE COSTANZA
          var costanza = mapFuncs.makeMarker(mapCanvas, userLocationObj, {
            onTop: true,
            title:'George Costanza',
            rawCoords: false
          });

          geocoder.geocodeAddress(address).then(function(res) {
            $scope.searchAddress = res.formattedAddress;
            console.log('GEOCODE success: ', res);
          }, function(err) {
            console.log('GEOCODE fail: ', err);
          });

          var someRestrooms = mapFuncs.filterByRadius(currentLocation, $scope.allRestrooms, 0.0145);

          console.log(someRestrooms);
          someRestrooms.forEach(function(el) {
            markers.push(mapFuncs.makeMarker(mapCanvas, el, {
              rawCoords: true
            }));
          });
          makeClusters();
        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };
    }
  ]);
