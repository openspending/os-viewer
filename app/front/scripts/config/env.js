;(function(angular) {

  var config = {
    defaultErrorHandler: function(error) {
      (console.trace || console.log || function() {})(error);
    },
    maxDimensionValuesForColumns: 50
  };

  angular.module('Application')
    .constant('Configuration', config);

})(angular);
