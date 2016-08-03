'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

var visualizationsService = require('../../services/visualizations');

require('./barchart');
require('./bubbletree');
require('./facts');
require('./linechart');
require('./map');
require('./piechart');
require('./pivottable');
require('./sankey');
require('./table');
require('./treemap');

require('./visualization-add-modal');
require('./visualization-share-modal');
require('./visualization-container');

angular.module('Application')
  .directive('visualizations', [
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
          // Update list of available visualizations based on package info
          function updateAvailableVisualizations() {
            $scope.availableVisualizations = visualizationsService
              .getAvailableVisualizations($scope.datapackage);
          }

          updateAvailableVisualizations();
          $scope.$watch('datapackage', function(oldValue, newValue) {
            if (newValue !== oldValue) {
              updateAvailableVisualizations();
            }
          }, true);

          // Update list of selected visualizations - get objects by IDs.
          function updateSelectedVisualizations() {
            $scope.selectedVisualizations = visualizationsService
              .getVisualizationsByIds($scope.params.visualizations);

            // When list of selected visualizations is updated, let's check
            // if user can add more visualizations. If he cannot - hide
            // Add vis modal (no matter if it is visible or not)
            var anySelected = _.first($scope.selectedVisualizations);
            if (anySelected) {
              var selectedIds = _.map($scope.selectedVisualizations,
                function(item) {
                  return item.id;
                });

              var moreItems = _.chain($scope.availableVisualizations)
                .filter(function(item) {
                  return item.type == anySelected.type;
                })
                .map(function(item) {
                  return item.id;
                })
                .difference(selectedIds)
                .value();

              if (moreItems.length == 0) {
                $scope.$broadcast(Configuration.events
                  .visualizations.hideModals);
              }
            }
          }

          updateSelectedVisualizations();
          $scope.$watchCollection('params.visualizations', function() {
            updateSelectedVisualizations();
          });

          $scope.$on(Configuration.events.visualizations.showShareModal,
            function($event, visualization, skipThisEvent) {
              if (!skipThisEvent) {
                // $scope will receive this event during $broadcast,
                // so let's skip it to avoid infinite loop
                $scope.$broadcast(Configuration.events.visualizations
                  .showShareModal, visualization, true);
              }
            });
        }
      };
    }
  ]);
