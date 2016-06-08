'use strict';

var angular = require('angular');

angular.module('Application')
  .controller('HeaderController', [
    '$scope', 'LoginService',
    function($scope, LoginService) {
      $scope.login = LoginService;
    }
  ]);
