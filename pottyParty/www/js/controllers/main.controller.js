angular.module('pottyParty.controllers')
	.controller('MainCtrl', ['$scope', 'mapFuncs', function($scope, mapFuncs){
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
	}]);