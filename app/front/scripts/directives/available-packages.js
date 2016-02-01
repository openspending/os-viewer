;(function(angular) {

  var app = angular.module('Application');

  app.directive('availablePackages', function() {
    var directiveDefinitionObject = {
      templateUrl: '/templates/available-packages.html',
      replace: true,
      transclude: false,
      restrict: 'E',
//      scope: false,
      //compile: function compile(tElement, tAttrs, transclude) {
      //  return {
      //    pre: function preLink(scope, iElement, iAttrs, controller) { ... },
      //    post: function postLink(scope, iElement, iAttrs, controller) { ... }
      //  }
      //},
      link: function postLink(scope, iElement, iAttrs) {
      }
    };
    return directiveDefinitionObject;
  });
})(angular);
