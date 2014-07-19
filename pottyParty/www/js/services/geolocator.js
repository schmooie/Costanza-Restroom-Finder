'use strict';

angular.module('pottyParty.factories')
  .factory('geolocator', ['$q',
  function ($q) {

    return {
      geolocate : function (timeout) {
        var d = $q.defer();

        if (navigator.hasOwnProperty('geolocation')) {
          navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var userCoords = { lat: lat, lng: lng };

                d.resolve(userCoords);

              }, function (error) {
                console.log(error);
                d.reject({ error: error, message: 'Geolocation failed: ' + error.message});
              },
              { timeout: timeout });

        } else {
          d.reject({message: 'Browser does not support geolocation'});
        }

        return d.promise;
      }
    };
}]);
