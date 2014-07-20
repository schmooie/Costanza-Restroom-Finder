'use strict';

angular.module('pottyParty.services')
.factory('googleMaps', ['mapFuncs', function(mapFuncs) {
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

  var map_id = 'map-canvas';
  var mapOptions = {
    center: new google.maps.LatLng(40.754926, -73.984281),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapFuncs.style,
    zoom: 13
  };

  var map = initialize(map_id, mapOptions);

  addMap('mainMap', map);

  return {
    addMap: addMap,
    getMap: getMap
  };
}]);

