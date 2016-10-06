'use strict';

var _ = require('lodash');
var TextEncoder = require('text-encoding').TextEncoder;
var angular = require('angular');
var template = require('./template.html');

var papaparse = require('papaparse');

function processCell(rows, rowIndex, colspan, rowspan, text) {
  var colIndex = 0;
  while (rows[rowIndex][colIndex] !== undefined) {
    colIndex ++;
  }

  for (var rs = 0; rs < rowspan; rs++) {
    for (var cs = 0; cs < colspan; cs++) {
      rows[rowIndex + rs][colIndex + cs] = text;
      text = '';
    }
  }
}

function getCsvDataFromTable(table) {
  var rows = _.map(table.rows, function() {
    return [];
  });

  _.forEach(table.rows, function(tableRow, rowIndex) {
    _.forEach(tableRow.cells, function(tableCell) {
      tableCell = $(tableCell);
      var text = tableCell.text();

      var colspan = parseInt(tableCell.attr('colspan'));
      if (!isFinite(colspan) || (colspan < 1)) {
        colspan = 1;
      }

      var rowspan = parseInt(tableCell.attr('rowspan'));
      if (!isFinite(rowspan) || (rowspan < 1)) {
        rowspan = 1;
      }

      processCell(rows, rowIndex, colspan, rowspan, text);
    });
  });

  // There may be short rows; pad them to avoid PapaParse error
  var maxRowLength = _.max(_.map(rows, function(row) { return row.length; }));
  _.forEach(rows, function(row) {
    while (row.length < maxRowLength) {
      row.push('');
    }
  });

  return papaparse.unparse(rows);
}

angular.module('Application')
  .directive('exportControl', [
    '$window', '$rootScope',
    function($window, $rootScope) {
      return {
        template: template,
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

            var i18n = $rootScope._t;
            var charset = i18n('CSV export encoding');

            var encoder = null;
            try {
              encoder = new TextEncoder(charset, {
                // Allow encodings other that utf-8
                NONSTANDARD_allowLegacyEncoding: true
              });
            } catch (error) {
              encoder = new TextEncoder('utf-8');
            }

            var bytes = encoder.encode(getCsvDataFromTable(table.get(0)));
            var data = new Blob([bytes], {
              type: 'text/csv;charset=' + charset
            });
            var fileName = ($scope.fileName || 'exported') + '.csv';
            $window.saveAs(data, fileName, true);
          };
        }
      };
    }
  ]);
