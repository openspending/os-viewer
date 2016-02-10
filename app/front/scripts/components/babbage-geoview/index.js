'use strict';

var geoview = require('./render');
var api = require('./api');

module.exports = function(ngModule) {
  ngModule.directive('babbageGeoview', [
    '$window', '$timeout',
    function($window, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          countryCode: '@',
          data: '='
        },
        template: '<div class="babbage-geoview"></div>',
        replace: false,
        link: function($scope, element) {
          $timeout(function() {
            $scope.data = {
              'District Council Cantemir': 100,
              'District Council ATU Gagauzia': 50,
              'District Council Cahul': 340,
              'District Council Taraclia': 300
            };
          }, 5000);

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
                    data: data,
                    bindResize: function(callback) {
                      resizeHandlers.push(callback);
                      $window.addEventListener('resize', callback);
                    }
                  });
                });
              });
          }

          if ($scope.countryCode) {
            handle = createHandle($scope.countryCode, $scope.data || {});
          }

          $scope.$watch('data', function(newValue, oldValue) {
            if (handle && (newValue != oldValue)) {
              handle.updateData(newValue || {});
            }
          });

          $scope.$watch('countryCode', function(newValue, oldValue) {
            if (newValue != oldValue) {
              createHandle(newValue, $scope.data || {});
            }
          });

          $scope.$destroy(function() {
            removeResizeListeners();
            handle.destroy();
          });
        }
      };
    }
  ]);
};