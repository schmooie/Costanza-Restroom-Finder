angular.module('pottyParty.controllers')
  .controller('MapCtrl', ['$scope', '$rootScope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder', 'storage', 'googleMaps',
    function($scope, $rootScope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder, storage, googleMaps) {

      var currentAddress = {};
      var mapCanvas = googleMaps.getMap('mainMap');
      var markers = [];
      var RANGE = 0.0075;
      // var RANGE = 0.0145;

      $rootScope.showMap = true;
      // Add a Legend
      mapCanvas.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));

      var makeClusters = function() {
        var mc = new MarkerClusterer(mapCanvas, markers, mapFuncs.mcOptions);
      };

      // TODO: Repurpose existing markers + markerClusters on each loadNearbyRestrooms call
      var loadNearbyRestrooms = function(address, latLng) {
        // Don't reload data if we haven't changed locations
        if (typeof latLng !== 'undefined') {
          if (latLng.latitude === currentAddress.latitude ||
            latLng.longitude === currentAddress.longitude) {
            console.log('Didn\'t reload data -- address is the same');
            return;
          }
        }
        if (address === currentAddress.address) {
          console.log('Didn\'t reload data -- address is the same');
          return;
        }

        geocoder.geocodeAddress(address).then(function(res) {
          console.log(res);
          var currentLocation = {
            latitude: res.lat,
            longitude: res.lng
          };

          var userLocationObj = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);

          mapCanvas.setCenter(userLocationObj);
          mapCanvas.setZoom(15);

          // GEORGE COSTANZA
          var costanza = mapFuncs.makeMarker(mapCanvas, userLocationObj, {
            onTop: true,
            title: 'George Costanza',
            rawCoords: false
          });

          $scope.addressForm.startAddress = res.formattedAddress;

          currentAddress.address = res.formattedAddress;
          currentAddress.latitude = res.lat;
          currentAddress.longitude = res.lng;

          console.log('GEOCODE success: ', res);

          var someRestrooms = mapFuncs.filterByRadius(currentLocation, $scope.allRestrooms, RANGE);

          googleMaps.getDistanceMatrix([userLocationObj], someRestrooms).then(function(res) {
            console.log('Distance Matrix results: ', res);
          }, function(err) {
            console.log('Failed to get distance matrix: ', arguments);
          });

          someRestrooms.forEach(function(el) {
            markers.push(mapFuncs.makeMarker(mapCanvas, el, {
              rawCoords: true
            }));
          });

          makeClusters();

        }, function(err) {
          console.log('GEOCODE fail: ', err);
          $cordovaToast.showLongCenter('Darn. The Potty Satellite 5000 is having trouble figuring out the address. Try again.');
        });
      };

      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
          // TEMPORARY HARD CODE -- swap back in currentLocation commented below
          //var currentLocation = res.coords;
          var currentLocation = {
            latitude: 40.7549694,
            longitude: -73.98433690000002
          };
          var address = currentLocation.latitude + ',' + currentLocation.longitude;

          loadNearbyRestrooms(address, currentLocation);

        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };

      $scope.getAddressPosition = function(address) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is searching the requested address...');
        loadNearbyRestrooms(address);
      };

      $scope.setFormScope = function(scope) {
        $scope.addressForm = scope;
      };
    }
  ]);
