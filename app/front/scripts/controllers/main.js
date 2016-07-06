'use strict';

var _ = require('lodash');
var angular = require('angular');

var $q = require('../services/ng-utils').$q;
var osViewerService = require('../services/os-viewer');

angular.module('Application')
  .controller('MainController', [
    '$scope', '$location', '$browser', 'Configuration',
    function($scope, $location, $browser, Configuration) {
      // This function should be called before updating $scope.state.params
      function updateStateParams(newParams) {
        // Remove all items after current and then store current
        osViewerService.history.trim($scope.state);
        $scope.state.params = newParams;

        // Extend state with some UI-related data
        $scope.state.params.availableSoring = osViewerService
          .getAvailableSorting($scope.state);
        $scope.state.params.breadcrumbs = osViewerService
          .buildBreadcrumbs($scope.state);
        $scope.state.params.currencySign = osViewerService
          .getCurrencySign($scope.state);
        $scope.state.params.selectedFilters = osViewerService
          .getSelectedFilters($scope.state);

        osViewerService.history.push($scope.state);
      }

      // Initialization stuff
      $q(osViewerService.loadDataPackages())
        .then(function(dataPackages) {
          $scope.isLoading.application = false;
          $scope.availablePackages = dataPackages;

          $scope.isLoading.package = true;
          return $q(osViewerService.getInitialState(dataPackages,
            $location.absUrl(), $browser.baseHref()));
        })
        .then(function(state) {
          $scope.state = state;
          return $q(osViewerService.fullyPopulateModel(state));
        })
        .then(function(state) {
          $scope.state = state;
          updateStateParams(state.params);
          $scope.isLoading.package = false;
          console.log('load', state);
        });

      // Event listeners

      // History events
      $scope.$on(Configuration.events.history.back, function() {
        osViewerService.history.back($scope.state);
      });
      $scope.$on(Configuration.events.history.forward, function() {
        osViewerService.history.forward($scope.state);
      });

      // Package selector events
      $scope.$on(Configuration.events.packageSelector.change,
        function($event, packageId) {
          if (packageId) {
            $scope.isLoading.package = true;

            $q(osViewerService.loadDataPackage(packageId))
              .then(function(state) {
                $scope.state = state;
                return $q(osViewerService.fullyPopulateModel(state));
              })
              .then(function(state) {
                $scope.isLoading.package = false;
                $scope.state = state;
                updateStateParams(state.params);
                console.log('load', state);
              });
          }
        });

      // Visualizations events
      $scope.$on(Configuration.events.visualizations.add,
        function($event, visualizationId, toggle) {
          updateStateParams(osViewerService.params.addVisualization(
            $scope.state.params, visualizationId, toggle));
        });

      $scope.$on(Configuration.events.visualizations.remove,
        function($event, visualizationId) {
          updateStateParams(osViewerService.params.removeVisualization(
            $scope.state.params, visualizationId));
        });

      $scope.$on(Configuration.events.visualizations.removeAll,
        function() {
          updateStateParams(osViewerService.params
            .removeAllVisualizations($scope.state.params));
        });

      $scope.$on(Configuration.events.visualizations.drillDown,
        function($event, drillDownValue) {
          updateStateParams(osViewerService.params
            .drillDown($scope.state.params, drillDownValue,
              $scope.state.package));
        });

      $scope.$on(Configuration.events.visualizations.breadcrumbClick,
        function($event, breadcrumb) {
          updateStateParams(osViewerService.params
            .applyBreadcrumb($scope.state.params, breadcrumb));
        });

      $scope.$on(Configuration.events.visualizations.changeOrderBy,
        function($event, key, direction) {
          updateStateParams(osViewerService.params
            .changeOrderBy($scope.state.params, key, direction));
        });

      // Sidebar events
      $scope.$on(Configuration.events.sidebar.changeMeasure,
        function($event, key) {
          updateStateParams(osViewerService.params
            .changeMeasure($scope.state.params, key));
        });

      $scope.$on(Configuration.events.sidebar.changeDimension,
        function($event, axis, key) {
          updateStateParams($scope.state.params = osViewerService.params
            .changeDimension($scope.state.params, axis, key));
        });

      $scope.$on(Configuration.events.sidebar.clearDimension,
        function($event, axis, key) {
          updateStateParams($scope.state.params = osViewerService.params
            .clearDimension($scope.state.params, axis, key));
        });

      $scope.$on(Configuration.events.sidebar.setFilter,
        function($event, filter, value) {
          updateStateParams($scope.state.params = osViewerService.params
            .changeFilter($scope.state.params, filter, value));
        });

      $scope.$on(Configuration.events.sidebar.clearFilter,
        function($event, filter) {
          updateStateParams($scope.state.params = osViewerService.params
            .clearFilter($scope.state.params, filter));
        });
    }
  ]);
