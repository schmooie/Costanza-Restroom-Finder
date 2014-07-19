angular.module('pottyParty.controllers')
	.controller('MainCtrl', ['$scope', 'mapFuncs', '$cordovaGeolocation', 'geocoder', function($scope, mapFuncs, $cordovaGeolocation, geocoder){
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 8
      };
      var map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.getCurrentPosition = function(options) {
      $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
        console.log('GEOLOCATION success: ', res);
        var address = res.coords.latitude + ',' + res.coords.longitude;
        console.log(address);
        geocoder.geocodeAddress(address).then(function(res) {
          $scope.searchAddress = res.formattedAddress;
          console.log('GEOCODE success: ', res);
        }, function (err) {
          console.log('GEOCODE fail: ', err);
        });

      }, function(err) {
        console.log('GEOLOCATION fail: ', err);
      });
    };

	}]);