angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder',
    function($scope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder) {

      var mapOptions = {
        center: new google.maps.LatLng(40.754926, -73.984281),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 13
      };

      var mapCanvas;
      var allRestrooms;

      var initialize = function() {
        mapCanvas = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
      };

      google.maps.event.addDomListener(window, 'load', initialize);

      $http.get('http://localhost:3000/api/v1/Restrooms')
      	.success(function(restrooms){
      		allRestrooms = restrooms;
      		allRestrooms.forEach(function(el){
      			mapFuncs.makeMarker(true, mapCanvas, el);
      		});
      	});

      $scope.getCurrentPosition = function(options) {
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is pinpointing your exact location...');
        $cordovaGeolocation.getCurrentPosition(options).then(function(res) {
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


        }, function(err) {
          $cordovaToast.showLongCenter('Uh oh. The Potty Satellite 5000 seems to be out of orbit. Try again.');
        });
      };



    }
  ]);
