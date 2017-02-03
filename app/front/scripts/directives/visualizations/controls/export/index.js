'use strict';

var ngModule = require('../../../../module');
var utils = require('./utils');

ngModule.directive('exportControl', [
  '$window', 'i18n',
  function($window, i18n) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        targetSelector: '@',
        fileName: '@'
      },
      link: function($scope) {
        $scope.exportData = function() {
          var container = $($scope.targetSelector);
          var table = container.filter('table');
          if (table.length == 0) {
            table = container.find('table');
          }
          if (table.length == 0) {
            return;
          }

          var data = utils.createCSVFile(
            utils.getCSVDataFromTable(table.get(0)),
            i18n('CSV export encoding')
          );
          var fileName = ($scope.fileName || 'exported') + '.csv';
          $window.saveAs(data, fileName, true);
        };
      }
    };
  }
]);
