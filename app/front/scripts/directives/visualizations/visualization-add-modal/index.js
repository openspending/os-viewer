'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('visualizationAddModal', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '='
        },
        link: function($scope, element) {
          $scope.isEnabled = function(item) {
            // Sanity check
            if (!item || !_.isArray($scope.selected)) {
              return false;
            }

            // All items are enabled until one of them is selected
            var anySelected = _.first($scope.selected);
            if (!anySelected) {
              return true;
            }

            // Only items of the same type are enabled
            return item.type == anySelected.type;
          };

          $scope.isSelected = function(item) {
            // Sanity check
            if (!item) {
              return false;
            }

            // Try to find items in selected
            return !!_.find($scope.selected, function(selectedItem) {
              return item.id == selectedItem.id;
            })
          };

          $scope.addVisualization = function(visualizationId, toggle) {
            $scope.$emit(Configuration.events.visualizations.add,
              visualizationId, toggle);
          };

          $scope.removeAllVisualizations = function() {
            $scope.$emit(Configuration.events.visualizations.removeAll);
          };

          var addVisModal = element.find('.x-visualization-add-modal').modal({
            show: false
          });

          $scope.showAddVisualizationDialog = function() {
            addVisModal.modal('show');
          };

          $scope.$on(Configuration.events.visualizations.hideModals,
            function() {
              addVisModal.modal('hide');
            });
        }
      };
    }
  ]);
