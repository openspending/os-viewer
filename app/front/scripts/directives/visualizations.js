;(function(angular) {

  var app = angular.module('Application');

  var availableVisualizations = [
    {
      id: 'Treemap',
      name: 'Tree Map',
      type: 'drilldown',
      embed: 'treemap',
      icon: 'viewer-icon viewer-icon-treemap'
    },
    {
      id: 'PieChart',
      name: 'Pie Chart',
      type: 'drilldown',
      embed: 'piechart',
      icon: 'viewer-icon viewer-icon-piechart'
    },
    {
      id: 'BubbleTree',
      name: 'Bubble Tree',
      type: 'drilldown',
      embed: 'bubbletree',
      icon: 'viewer-icon viewer-icon-bubbletree'
    },
    {
      id: 'BarChart',
      name: 'Bar Chart',
      type: 'sortable-series',
      embed: 'barchart',
      icon: 'viewer-icon viewer-icon-barchart'
    },
    {
      id: 'Table',
      name: 'Table',
      type: 'sortable-series',
      embed: 'table',
      icon: 'viewer-icon viewer-icon-table'
    },
    {
      id: 'LineChart',
      name: 'Line Chart',
      type: 'time-series',
      embed: 'linechart',
      icon: 'viewer-icon viewer-icon-linechart'
    },
    {
      id: 'Map',
      name: 'Map',
      type: 'location',
      embed: 'map',
      icon: 'viewer-icon viewer-icon-map'
    },
    {
      id: 'PivotTable',
      name: 'Pivot Table',
      type: 'pivot-table',
      embed: 'pivottable',
      icon: 'viewer-icon viewer-icon-layers'
    }
  ];

  app.directive('visualizations', [
    '_', '$location', '$browser',
    function(_, $location, $browser) {
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
          $scope.type = null;

          $scope.availableVisualizations = availableVisualizations;

          $scope.selectedVisualizations = $scope.state.selectedVisualizations;
          if (!_.isArray($scope.selectedVisualizations)) {
            $scope.selectedVisualizations = [];
          }
          var visualization = _.first($scope.selectedVisualizations);
          visualization = _.find(availableVisualizations, function(item) {
            return item.id == visualization;
          });
          if (visualization) {
            $scope.type = visualization.type;
          } else {
            $scope.type = null;
          }

          function updateAvailableVisualizations() {
            $scope.state.selectedVisualizations = $scope.selectedVisualizations;

            $scope.availableVisualizations = _.chain(availableVisualizations)
              .map(function(item) {
                if ((item.id == 'Map') && !$scope.geoViewAvailable) {
                  return null;
                }
                if ((item.id == 'LineChart') && !$scope.lineChartAvailable) {
                  return null;
                }

                var result = _.extend({}, item);
                result.isEnabled = true;
                if ($scope.type && (item.type != $scope.type)) {
                  result.isEnabled = false;
                }
                return result;
              })
              .filter()
              .value();
          }

          updateAvailableVisualizations();
          $scope.$watch('type', updateAvailableVisualizations);

          function updateSpecialChartTypes() {
            $scope.geoViewAvailable = false;
            $scope.lineChartAvailable = false;

            // GeoView
            if (
              $scope.state &&
              $scope.state.availablePackages &&
              $scope.state.availablePackages.locationAvailable
            ) {
              $scope.geoViewAvailable =
                $scope.state.availablePackages.locationAvailable;
            }

            // Line Chart
            if (
              $scope.state &&
              $scope.state.dimensions &&
              $scope.state.dimensions.items
            ) {
              $scope.lineChartAvailable = !!_.find(
                $scope.state.dimensions.items,
                function(dimension) {
                  return dimension.dimensionType == 'datetime';
                });
            }

            updateAvailableVisualizations();
          }

          updateSpecialChartTypes();
          $scope.$watch('state.availablePackages.locationAvailable',
            updateSpecialChartTypes);
          $scope.$watch('state.state.dimensions',
            updateSpecialChartTypes);

          $scope.getVisualizationById = function(visualization) {
            return _.find(availableVisualizations, function(item) {
              return item.id == visualization;
            });
          };

          var addVisModal = element.find('.x-visualization-add-modal').modal({
            show: false
          });

          var shareModal = element.find('.x-visualization-share-modal').modal({
            show: false
          });

          $scope.showAddVisualizationDialog = function() {
            addVisModal.modal('show');
          };

          $scope.showShareModal = function(visualization) {
            visualization = _.find(availableVisualizations, function(item) {
              return item.id == visualization;
            });
            if (visualization && visualization.embed) {
              var base = $browser.baseHref();
              if (base.substr(0, 1) != '/') {
                base = '/' + base;
              }
              if (base.substr(-1, 1) == '/') {
                base = base.substr(0, base.length - 1);
              }

              var protocol = $location.protocol() + '://';
              var host = $location.host();
              var port = $location.port() == '80' ? '' :
                ':' + $location.port();
              var url = $location.url();

              $scope.shareUrl = protocol + host + port + base +
                '/embed/' + visualization.embed + url;
              shareModal.modal('show');
            }
          };

          $scope.addVisualization = function(visualization, removeIfAdded) {
            var alreadyAdded = !!_.find(
              $scope.selectedVisualizations,
              function(item) {
                return item == visualization;
              }
            );

            if (!alreadyAdded) {
              $scope.selectedVisualizations.push(visualization);

              $scope.type = _.find(availableVisualizations, function(item) {
                return item.id == visualization;
              }).type;
              updateAvailableVisualizations();
            } else
            if (removeIfAdded) {
              $scope.removeVisualization(visualization);
            }
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
            updateAvailableVisualizations();
          };

          $scope.removeAllVisualizations = function() {
            $scope.selectedVisualizations = [];
            $scope.type = null;
            updateAvailableVisualizations();
          };
        }
      };
    }
  ]);
})(angular);
