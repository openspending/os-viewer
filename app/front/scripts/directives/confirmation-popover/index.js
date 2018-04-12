'use strict';

var ngModule = require('../../module');

ngModule.directive('confirmationPopover', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      template: '',
      scope: {
        onClick: '&',
        container: '@'
      },
      link: function($scope, element, attrs) {
        var container = $scope.container;
        var onClickHandler = $scope.onClick;
        element.popover({
          content: $scope.content,
          html: true,
          container: container,
          trigger: 'focus',
          placement: 'bottom'
        });
        element.on('inserted.bs.popover', function(e) {
          $(container + ' button').on('click', function() {
            onClickHandler();
            element.popover('hide');
            $scope.$applyAsync();
          });
        });
      }
    };
  }
]);
