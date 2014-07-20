angular.module('pottyParty.controllers')
  .controller('MainCtrl', ['$scope', '$rootScope', '$http', '$cordovaToast', 'mapFuncs', 'storage', 'googleMaps',
    function($scope, $rootScope, $http, $cordovaToast, mapFuncs, storage, googleMaps) {

      $rootScope.showMap = true;
      $rootScope.currentRestrooms = [];

      $rootScope.$on('event-distances-computed', function(event, data) {
        console.log('Event Distances Computed: ', data);
        $rootScope.currentRestrooms = data;
      });
      $rootScope.$on('event-distances-failed', function(event) {
        console.log('Failed to compute distances...', arguments);
        $cordovaToast.showLongCenter('The Potty Satellite 5000 is having trouble calculating distances. Try again.');
      });

      $rootScope.allRestrooms = storage.getObject('allRestrooms');
      if ($rootScope.allRestrooms === null) {
        console.log('Requesting data from server...');
        $http.get('http://nycrestrooms.herokuapp.com/api/v1/Restrooms')
          .success(function(restrooms) {
            $rootScope.allRestrooms = restrooms;
            storage.setObject('allRestrooms', restrooms);
            console.log($rootScope.allRestrooms);
          }).error(function(err) {
            console.log('Failed to get restrooms: ', err);
          });
      } else {
        console.log('Loaded from localStorage: ', $rootScope.allRestrooms);
      }

    }
  ]);
