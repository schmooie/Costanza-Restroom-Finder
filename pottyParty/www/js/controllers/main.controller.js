angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', 'mapFuncs', '$cordovaGeolocation', '$cordovaToast', 'geocoder',
    function($scope, mapFuncs, $cordovaGeolocation, $cordovaToast, geocoder) {
      var mapOptions = {
        center: new google.maps.LatLng(40.754926, -73.984281),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 13
      };

      var map;

      var initialize = function() {
        map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
      };

      google.maps.event.addDomListener(window, 'load', initialize);

      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
          var address = res.coords.latitude + ',' + res.coords.longitude;

          var userLocation = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
          map.setCenter(userLocation);
          map.setZoom(15);

          geocoder.geocodeAddress(address).then(function(res) {
            $scope.searchAddress = res.formattedAddress;
            console.log('GEOCODE success: ', res);
          }, function(err) {
            console.log('GEOCODE fail: ', err);
          });


        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };



    }
  ]);
