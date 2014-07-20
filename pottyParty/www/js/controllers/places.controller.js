angular.module('pottyParty.controllers')
  .controller('PlacesCtrl', ['$scope', '$rootScope', '$http', '$cordovaGeolocation', '$cordovaToast', 'mapFuncs', 'geocoder', 'storage',
    function($scope, $rootScope, $http, $cordovaGeolocation, $cordovaToast, mapFuncs, geocoder, storage) {
      $rootScope.showMap = false;
    }
  ]);
