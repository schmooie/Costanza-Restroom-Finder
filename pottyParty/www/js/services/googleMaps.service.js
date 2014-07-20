'use strict';

angular.module('pottyParty.services')
  .factory('googleMaps', ['$q', '$rootScope', 'mapFuncs',
    function($q, $rootScope, mapFuncs) {
      var distanceMatrixService = new google.maps.DistanceMatrixService();
      var maps = {};

      var addMap = function(mapId, map) {
        maps[mapId] = map;
      };

      var getMap = function(mapId) {
        return maps[mapId];
      };

      var initialize = function(map_id, options) {
        return new google.maps.Map(document.getElementById(map_id), options);
      };

      var _getDistanceMatrixHelper = function(origins, destinations, travelMode) {
        var d = $q.defer();

        var opts = {
          origins: origins,
          destinations: destinations,
          travelMode: travelMode || google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        };

        distanceMatrixService.getDistanceMatrix(opts, function(data, status) {
          if (status == google.maps.DistanceMatrixStatus.OK) {
            d.resolve(data);
          } else {
            d.reject(arguments);
          }
        });
        return d.promise;
      };

      var getDistanceMatrix = function(origins, destinations, travelMode) {
        // There is a limit of 25 destinations in one request, so we must
        // split up the requests
        var LIMIT = 25;
        var numRequests = Math.ceil(destinations.length / LIMIT);
        var d = $q.defer();
        var tempDestinations;

        // Use existing list of LatLng or string coordinates
        if (destinations[0] instanceof google.maps.LatLng ||
            typeof(destinations[0]) === 'string') {
          tempDestinations = destinations;
        }
        else if (destinations[0].hasOwnProperty('coords')) {
          tempDestinations = destinations.map(function(dest) {
            return new google.maps.LatLng(dest.coords[1], dest.coords[0]);
          });
        } else {
          throw new Error('Unrecognized format for destinations (getDistanceMatrix)');
        }

        var promises = [];

        for (var i = 0; i < numRequests; i++) {
          var destinationsChunk = tempDestinations.slice((i*LIMIT), (i*LIMIT)+LIMIT);
          var dmPromise = _getDistanceMatrixHelper(origins, destinationsChunk, travelMode);
          promises.push(dmPromise);
        }

        // Attach results to the destination list under the 'details' key
        $q.all(promises).then(function(responses) {
            angular.forEach(responses, function(response, index) {

              response.destinationAddresses.forEach(function(destInfo, destInfoIndex) {
                var details = response.rows[0].elements[destInfoIndex];
                details.address = destInfo;

                var absoluteDestIndex = (index*LIMIT)+destInfoIndex;
                destinations[absoluteDestIndex].details = details;
              });

            });
            $rootScope.$broadcast('event-distances-computed', destinations);
            d.resolve(destinations);
          },
          function() {
            $rootScope.$broadcast('event-distances-failed', arguments);
            d.reject(arguments);
          });

        return d.promise;
      };

      var map_id = 'map-canvas';
      var mapOptions = {
        center: new google.maps.LatLng(40.754926, -73.984281),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapFuncs.style,
        zoom: 13
      };

      var map = initialize(map_id, mapOptions);
      // Add a Legend
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));

      addMap('mainMap', map);

      return {
        addMap: addMap,
        getMap: getMap,
        getDistanceMatrix: getDistanceMatrix
      };
    }
  ]);
