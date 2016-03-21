;(function(angular) {

  var app = angular.module('Application');

  var availableVisualizations = [
    {
      id: 'Treemap',
      name: 'Tree Map',
      type: ''
    },
    {
      id: 'PieChart',
      name: 'Pie Chart',
      type: ''
    },
    {
      id: 'BarChart',
      name: 'Bar Chart',
      type: ''
    },
    {
      id: 'LineChart',
      name: 'Line Chart',
      type: ''
    },
    {
      id: 'BubbleTree',
      name: 'Bubble Tree',
      type: ''
    },
    {
      id: 'Map',
      name: 'Map',
      type: ''
    }
  ];

  app.directive('visualizations', [
    '_',
    function(_) {
      return {
        templateUrl: 'templates/visualizations.html',
        replace: false,
        restrict: 'E',
        scope: {
          state: '=',
          events: '='
        },
        link: function($scope, element) {
          $scope.availableVisualizations = availableVisualizations;
          $scope.selectedVisualizations = [];

          $scope.getAvailableVisualizations = function() {
            var canShowMap = false;
            if ($scope.state && $scope.state.availablePackages) {
              canShowMap = $scope.state.availablePackages.locationAvailable &&
                $scope.state.availablePackages.locationSelected;
            }

            return _.filter(availableVisualizations, function(item) {
              if (item.id == 'Map') {
                return canShowMap;
              }
              return true;
            });
          };

          $scope.getVisualizationById = function(visualization) {
            return _.find(availableVisualizations, function(item) {
              return item.id == visualization;
            });
          };

          var modal = element.find('.x-visualization-add-modal').modal({
            show: false
          });

          $scope.showAddVisualizationDialog = function() {
            modal.modal('show');
          };

          $scope.addVisualization = function(visualization) {
            var alreadyAdded = !!_.find(
              $scope.selectedVisualizations,
              function(item) {
                return item == visualization;
              }
            );

            if (!alreadyAdded) {
              $scope.selectedVisualizations.push(visualization);
            }
          };

          $scope.removeVisualization = function(visualization) {
            $scope.selectedVisualizations = _.filter(
              $scope.selectedVisualizations,
              function(item) {
                return item != visualization;
              }
            );
          };

          $scope.removeAllVisualizations = function() {
            $scope.selectedVisualizations = [];
          };
        }
      };
    }
  ]);
})(angular);
