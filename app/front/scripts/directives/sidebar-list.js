;(function(angular) {

  var app = angular.module('Application');

  app.directive('sidebarList', [
    '_', '$filter',
    function(_, $filter) {
      return {
        templateUrl: 'templates/sidebar-list.html',
        replace: false,
        restrict: 'E',
        scope: {
          items: '=',
          selected: '=',
          title: '@',
          maxItems: '@?',
          canClear: '@?',
          plainList: '@?',
          key: '@?'
        },
        link: function($scope) {
          $scope.filter = {};

          function isSelected(key) {
            return !_.isUndefined(_.find($scope.selected, function(item) {
              return item == key;
            }));
          }
          $scope.isSelected = isSelected;

          $scope.selectedItems = [];
          function updateSelectedItems() {
            var selectedItems = [];
            selectedItems.splice(0, selectedItems.length);

            var maxItems = parseInt($scope.maxItems);
            if (_.isFinite(maxItems) && (maxItems > 0) &&
              _.isArray($scope.items) && ($scope.items.length > maxItems)) {
              _.forEach($scope.items, function(item) {
                if (item && isSelected(item.key)) {
                  selectedItems.push(item);
                }
              });
            }

            $scope.selectedItems = selectedItems;
          }

          function updateItems() {
            var maxItems = parseInt($scope.maxItems);
            if (!_.isFinite(maxItems) || (maxItems < 0)) {
              maxItems = 0;
            }

            var items = _.isArray($scope.items) ? $scope.items : [];

            if ((maxItems > 0) && (items.length > maxItems)) {
              items = _.filter(items, function(item) {
                return !isSelected(item.key);
              });
            }

            _.forEach(items, function(item) {
              item.displayName = item.name || item.value;
            });

            items = $filter('filter')(items, $scope.filter);
            items = $filter('orderBy')(items, 'displayName');

            $scope.hasMoreItems = false;
            if (maxItems > 0) {
              $scope.hasMoreItems = items.length > maxItems;
              items = items.slice(0, maxItems);
            }

            $scope.itemsToDisplay = items;
            updateSelectedItems();
          }

          $scope.$watchCollection('items', updateItems);
          $scope.$watchCollection('selected', updateItems);
          $scope.$watch('maxItems', updateItems);
          $scope.$watch('filter.displayName', updateItems);

          $scope.selectItem = function($event, item) {
            $scope.$emit('sidebarList.changeItemSelection',
              item, true, $scope.key);
            $event.stopPropagation();
          };
          $scope.unselectItem = function($event, item) {
            $scope.$emit('sidebarList.changeItemSelection',
              item, false, $scope.key);
            $event.stopPropagation();
          };
        }
      };
    }
  ]);
})(angular);
