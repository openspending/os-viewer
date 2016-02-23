;(function(angular) {

  angular.module('Application')
    .controller('HeaderController', [
      '$scope', 'LoginService',
      function($scope, LoginService) {
        $scope.login = LoginService;
      }
    ]);

})(angular);
