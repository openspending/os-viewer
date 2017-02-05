'use strict';

var _ = require('lodash');
var ngModule = require('../../module');

var visualizationsService = require('../../services/visualizations');

require('./drilldown');
require('./location');
require('./pivot-table');
require('./sortable-series');
require('./time-series');
require('./measures');
require('./filters');

require('./sidebar-list');
require('./sidebar-plain-list');

ngModule.directive('sidebar', [
  function() {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        datapackage: '=',
        params: '='
      },
      link: function($scope) {
        $scope.$watchCollection('params.visualizations', function() {
          $scope.type = null;

          var selected = visualizationsService
            .getVisualizationsByIds($scope.params.visualizations);
          var anySelected = _.first(selected);
          if (anySelected) {
            $scope.type = anySelected.type;
          }
        });
      }
    };
  }
]);
