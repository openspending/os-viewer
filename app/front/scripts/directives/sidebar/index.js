'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

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

angular.module('Application')
  .directive('sidebar', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
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
