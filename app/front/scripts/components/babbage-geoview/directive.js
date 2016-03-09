'use strict';

var geoview = require('./render');
var api = require('./api');

module.exports = function(ngModule) {
  ngModule.directive('geoview', [
    '$window', '$timeout',
    function($window, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          countryCode: '@',
          values: '='
        },
        template: '<div class="babbage-geoview"></div>',
        replace: false,
        link: function($scope, element) {
          var handle = null;

          var resizeHandlers = [];
          function removeResizeListeners() {
            resizeHandlers.forEach(function(callback) {
              $window.removeEventListener('resize', callback);
            });
            resizeHandlers = [];
          }

          function createHandle(countryCode, data) {
            api.loadGeoJson(countryCode)
              .then(function(geoJson) {
                // Check if countryCode did not change while loading data
                if ($scope.countryCode != countryCode) {
                  return;
                }
                $timeout(function() {
                  removeResizeListeners();
                  handle = geoview({
                    container: element.find('.babbage-geoview').get(0),
                    code: countryCode,
                    geoObject: geoJson,
                    data: data(),
                    bindResize: function(callback) {
                      resizeHandlers.push(callback);
                      $window.addEventListener('resize', callback);
                    }
                  });
                });
              });
          }

          if ($scope.countryCode) {
            handle = createHandle($scope.countryCode, function() {
              return $scope.values || {};
            });
          }

          $scope.$watch('values', function(newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }
            if (handle) {
              handle.updateData(newValue || {});
            }
          }, true);

          $scope.$watch('countryCode', function(newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }
            createHandle(newValue, function() {
              return $scope.values || {};
            });
          });

          $scope.$on('$destroy', function() {
            removeResizeListeners();
            handle.destroy();
          });
        }
      };
    }
  ]);
};