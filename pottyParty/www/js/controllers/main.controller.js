angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', '$rootScope', '$http', 'mapFuncs', 'storage', 'googleMaps',
    function($scope, $rootScope, $http, mapFuncs, storage, googleMaps) {

      $rootScope.showMap = true;

      $scope.allRestrooms = storage.getObject('allRestrooms');
      if ($scope.allRestrooms === null) {
        console.log('Requesting data from server...');
        $http.get('http://nycrestrooms.herokuapp.com/api/v1/Restrooms')
          .success(function(restrooms) {
            $scope.allRestrooms = restrooms;
            storage.setObject('allRestrooms', restrooms);
            console.log($scope.allRestrooms);
          }).error(function(err) {
            console.log('Failed to get restrooms: ', err);
          });
      } else {
        console.log('Loaded from localStorage: ', $scope.allRestrooms);
      }

    }
  ]);
