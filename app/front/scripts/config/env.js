;(function(angular) {

  var config = {
    defaultErrorHandler: function(error) {
      (console.trace || console.log || function() {})(error);
    }
  };

  angular.module('Application')
    .constant('Configuration', config);

})(angular);
