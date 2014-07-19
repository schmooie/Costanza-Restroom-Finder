'use strict';

var ngCordova = angular.module('ngCordova', []);

ngCordova
    .factory('$cordovaGeolocation', ['$q',
        function($q) {

            return {
                getCurrentPosition: function(options) {
                    var q = $q.defer();

                    navigator.geolocation.getCurrentPosition(function(result) {
                        // Do any magic you need
                        q.resolve(result);
                    }, function(err) {
                        q.reject(err);
                    }, options);

                    return q.promise;
                },
                watchPosition: function(options) {
                    var q = $q.defer();

                    var watchId = navigator.geolocation.watchPosition(function(result) {
                        // Do any magic you need
                        q.notify(result);

                    }, function(err) {
                        q.reject(err);
                    }, options);

                    return {
                        watchId: watchId,
                        promise: q.promise
                    };
                },

                clearWatch: function(watchID) {
                    return navigator.geolocation.clearWatch(watchID);
                }
            };
        }
    ]);

ngCordova
    .factory('$cordovaSplashscreen', [
        function() {

            return {
                hide: function() {
                    return navigator.splashscreen.hide();
                },

                show: function() {
                    return navigator.splashscreen.show();
                }
            };

        }
    ]);

ngCordova
    .factory('$cordovaToast', ['$q',
        function($q) {

            if (!window.hasOwnProperty('plugins')) {
              window.plugins = {
                toast: {
                  showShortTop: function(){},
                  showShortCenter: function(){},
                  showShortBottom: function(){},
                  showLongTop: function(){},
                  showLongCenter: function(){},
                  showLongBottom: function(){},
                  show: function(){}
                }
              };
            }

            return {
                showShortTop: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showShortTop(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },

                showShortCenter: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showShortCenter(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },

                showShortBottom: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showShortBottom(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },

                showLongTop: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showLongTop(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },

                showLongCenter: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showLongCenter(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },

                showLongBottom: function(message) {
                    var q = $q.defer();
                    window.plugins.toast.showLongBottom(message, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                },


                show: function(message, duration, position) {
                    var q = $q.defer();
                    window.plugins.toast.show(message, duration, position, function(response) {
                        q.resolve(response);
                    }, function(error) {
                        q.reject(error);
                    });
                    return q.promise;
                }
            };

        }
    ]);
