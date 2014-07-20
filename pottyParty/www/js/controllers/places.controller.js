angular.module('pottyParty.controllers')
  .controller('PlacesCtrl', ['$scope', '$rootScope', '$cordovaToast', 'mapFuncs', 'googleMaps',
    function($scope, $rootScope, $cordovaToast, mapFuncs, googleMaps) {
      var mapCanvas = googleMaps.getMap('mainMap');

      $rootScope.showMap = false;

      $scope.current = 'duration';
      $scope.reverse = false;
      $scope.predicate = 'details.duration.value';

      $scope.moveMap = function(restroom) {
        $cordovaToast.showShortCenter('Look at the map! You\'re going places (not your pants)!');
        var latLng = new google.maps.LatLng(restroom.coords[1], restroom.coords[0]);
        mapCanvas.setCenter(latLng);
        mapCanvas.setZoom(17);
      };

      $scope.changeCurrent = function(current) {
        if ($scope.current === current) {
          $scope.reverse = !$scope.reverse;
        }
        $scope.current = current;
        if (current === 'name') {
          $scope.predicate = 'name';
        } else if (current === 'address') {
          $scope.predicate = 'details.address';
        } else if (current === 'distance') {
          $scope.predicate = 'details.distance.value';
        } else if (current === 'duration') {
          $scope.predicate = 'details.duration.value';
        }
      };

    }
  ]);
