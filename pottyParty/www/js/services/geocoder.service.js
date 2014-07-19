'use strict';
 /*
  * Original source: https://gist.github.com/benmj/6380466
  * @author: benmj
  *
  * Modified to use angularLocalStorage -- @author: Eddie Ng
  */
angular.module('pottyParty.services')
  .factory('geocoder', ['storage', '$q', '$timeout', '$rootScope',
  function (storage, $q, $timeout, $rootScope) {
    var locations = storage.get('locations') || {};

    var queue = [];

    // Amount of time (in milliseconds) to pause between each trip to the
    // Geocoding API, which places limits on frequency.
    var QUERY_PAUSE= 250;

    /**
     * executeNext() - execute the next function in the queue.
     *                  If a result is returned, fulfill the promise.
     *                  If we get an error, reject the promise (with message).
     *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
     */
    var executeNext = function () {
      var task = queue[0],
        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address : task.address }, function (result, status) {

        if (status === google.maps.GeocoderStatus.OK) {

          var parsedResult = {
            lat: result[0].geometry.location.lat(),
            lng: result[0].geometry.location.lng(),
            formattedAddress: result[0].formatted_address
          };

          locations[task.address] = parsedResult;
          storage.set("locations", locations);

          queue.shift();
          task.d.resolve(parsedResult);

        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          queue.shift();
          task.d.reject({
            type: 'zero',
            message: 'Zero results for geocoding address ' + task.address
          });
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          if (task.executedAfterPause) {
            queue.shift();
            task.d.reject({
              type: 'busy',
              message: 'Geocoding server is busy can not process address ' + task.address
            });
          }
        } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          queue.shift();
          task.d.reject({
            type: 'denied',
            message: 'Request denied for geocoding address ' + task.address
          });
        } else {
          queue.shift();
          task.d.reject({
            type: 'invalid',
            message: 'Invalid request for geocoding: status=' + status + ', address=' + task.address
          });
        }

        if (queue.length) {
          if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            var nextTask = queue[0];
            nextTask.executedAfterPause = true;
            $timeout(executeNext, QUERY_PAUSE);
          } else {
            $timeout(executeNext, 0);
          }
        }

        if (!$rootScope.$$phase) { $rootScope.$apply(); }
      });
    };

    return {
      geocodeAddress : function (address) {
        var d = $q.defer();

        if (_.has(locations, address)) {
          d.resolve(locations[address]);
        } else {
          queue.push({
            address: address,
            d: d
          });

          if (queue.length === 1) {
            executeNext();
          }
        }

        return d.promise;
      }
    };
}]);