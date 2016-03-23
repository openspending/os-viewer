;(function(angular) {

  var app = angular.module('Application');

  var availableVisualizations = [
    {
      id: 'Treemap',
      name: 'Tree Map',
      type: 'drilldown'
    },
    {
      id: 'PieChart',
      name: 'Pie Chart',
      type: 'drilldown'
    },
    {
      id: 'BarChart',
      name: 'Bar Chart',
      type: 'sortable-series'
    },
    {
      id: 'Table',
      name: 'Table',
      type: 'sortable-series'
    },
    {
      id: 'LineChart',
      name: 'Line Chart',
      type: 'time-series'
    },
    {
      id: 'BubbleTree',
      name: 'Bubble Tree',
      type: 'drilldown'
    },
    {
      id: 'Map',
      name: 'Map',
      type: 'location'
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
          events: '=',
          type: '='
        },
        link: function($scope, element) {
          $scope.availableVisualizations = availableVisualizations;
          $scope.selectedVisualizations = [];

          function updateAvailableVisualizations() {
            var canShowMap = false;
            if ($scope.state && $scope.state.availablePackages) {
              canShowMap = $scope.state.availablePackages.locationAvailable &&
                $scope.state.availablePackages.locationSelected;
            }

            $scope.availableVisualizations = _.map(availableVisualizations,
              function(item) {
                var result = _.extend({}, item);
                result.isEnabled = true;
                if ($scope.type && (item.type != $scope.type)) {
                  result.isEnabled = false;
                }
                return result;
              });
          }

          updateAvailableVisualizations();
          $scope.$watch('type', updateAvailableVisualizations);

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

            $scope.type = _.find(availableVisualizations, function(item) {
              return item.id == visualization;
            }).type;
          };

          $scope.removeVisualization = function(visualization) {
            $scope.selectedVisualizations = _.filter(
              $scope.selectedVisualizations,
              function(item) {
                return item != visualization;
              }
            );
            if ($scope.selectedVisualizations.length == 0) {
              $scope.type = null;
            }
          };

          $scope.removeAllVisualizations = function() {
            $scope.selectedVisualizations = [];
            $scope.type = null;
          };
        }
      };
    }
  ]);
})(angular);
