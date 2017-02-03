'use strict';

var ngModule = require('../../module');

ngModule.directive('autoselect', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, element) {
        element.on('focus', function() {
          element.select();
        });
      }
    };
  }
]);
