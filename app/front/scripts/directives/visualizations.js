;(function(angular) {

  var app = angular.module('Application');

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
          $scope.selectedVisualizations = ['Treemap'];

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
