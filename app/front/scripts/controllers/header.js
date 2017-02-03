'use strict';

var ngModule = require('../module');

ngModule.controller('HeaderController', [
  '$scope', 'LoginService',
  function($scope, LoginService) {
    $scope.login = LoginService;
  }
]);
