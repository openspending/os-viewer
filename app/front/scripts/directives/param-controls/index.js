'use strict';

var $q = require('../../services/ng-utils').$q;
var dataPackageApi = require('../../services/data-package-api');

var ngModule = require('../../module');


ngModule.directive('paramControls', [
  'LoginService', 'Configuration',
  function(LoginService, Configuration) {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        datapackage: '=',
        params: '=',
        defaultParams: '=',
        isOwner: '=?'
      },
      controllerAs: 'vm',
      controller: function($scope) {
        var vm = this;

        var setDefaultParams = function(params) {
          var token = LoginService.permissionToken;
          $q(dataPackageApi.setDefaultParams(token,
                                             vm.datapackage.id,
                                             params))
            .then(function(success) {
              vm.defaultParams = params;
            });
        };

        vm.setCurrentViewAsDefault = function() {
          setDefaultParams(vm.params);
        };

        vm.clearParamsAndVisualisations = function() {
          $scope.$emit(Configuration.events.visualizations.clearAllParams);
        };

        vm.resetToDefaults = function() {
          $scope.$emit(Configuration.events.visualizations.resetToDefault,
                       _.extend({}, vm.params, vm.defaultParams));
        };
      },
      bindToController: true
    };
  }
]);
