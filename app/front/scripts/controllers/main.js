'use strict';

var _ = require('lodash');
var angular = require('angular');

var $q = require('../services/ng-utils').$q;
var osViewerService = require('../services/os-viewer');

angular.module('Application')
  .controller('MainController', [
    '$scope', '$location', 'Configuration',
    function($scope, $location, Configuration) {
      // Flag for skipping `$locationChangeSuccess` event when
      // it is triggered while updating url
      var isChangingUrl = false;

      // This function should be called before updating $scope.state.params
      function updateStateParams(newParams, updateHistory, updateUrl) {
        updateHistory = _.isUndefined(updateHistory) || !!updateHistory;
        updateUrl = _.isUndefined(updateUrl) || !!updateUrl;

        // Remove all items after current and then store current
        if (updateHistory) {
          osViewerService.history.trim($scope.state);
        }
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

        if (updateHistory) {
          osViewerService.history.push($scope.state);
        }

        // Update page URL; set flag to skip nearest location change event
        if (updateUrl) {
          isChangingUrl = true;
          $location.url(osViewerService.buildUrl($scope.state.params));
        }
      }

      // Initialization stuff
      $q(osViewerService.loadDataPackages())
        .then(function(dataPackages) {
          $scope.isLoading.application = false;
          $scope.availablePackages = dataPackages;

          $scope.isLoading.package = true;
          return $q(osViewerService.getInitialState(dataPackages,
            $location.url()));
        })
        .then(function(state) {
          $scope.state = state;
          return $q(osViewerService.fullyPopulateModel(state));
        })
        .then(function(state) {
          $scope.state = state;
          updateStateParams(state.params);
          $scope.isLoading.package = false;
        });

      // Event listeners

      // History events
      $scope.$on(Configuration.events.history.back, function() {
        osViewerService.history.back($scope.state);
      });
      $scope.$on(Configuration.events.history.forward, function() {
        osViewerService.history.forward($scope.state);
      });

      // Location change event
      $scope.$on('$locationChangeSuccess', function($event, newUrl, oldUrl) {
        var wasChangingUrl = isChangingUrl;
        isChangingUrl = false;
        if ((newUrl != oldUrl) && !wasChangingUrl) {
          var urlParams = osViewerService.parseUrl(newUrl);
          $scope.$emit(Configuration.events.packageSelector.change,
            urlParams.packageId, newUrl);
        }
      });

      // Package selector events
      $scope.$on(Configuration.events.packageSelector.change,
        function($event, packageId, url) {
          // `url` is optional and passed only  from
          // `$locationChangeSuccess` event handler
          if (!packageId) {
            return;
          }

          if (!$scope.state || (packageId != $scope.state.package.id)) {
            $scope.isLoading.package = true;

            $q(osViewerService.loadDataPackage(packageId))
              .then(function(state) {
                $scope.state = state;
                return $q(osViewerService.fullyPopulateModel(state));
              })
              .then(function(state) {
                $scope.isLoading.package = false;
                $scope.state = state;

                if (url) {
                  var urlParams = osViewerService.parseUrl(url);
                  updateStateParams(state.params, false, false);
                  updateStateParams(osViewerService.params.updateFromUrlParams(
                    $scope.state.params, urlParams, $scope.state.package),
                    false, false);
                } else {
                  updateStateParams(state.params);
                }
              });
          } else {
            if (url) {
              var urlParams = osViewerService.parseUrl(url);
              updateStateParams(osViewerService.params.updateFromUrlParams(
                $scope.state.params, urlParams, $scope.state.package),
                false, false);
            }
          }
        });

      // Visualizations events
      $scope.$on(Configuration.events.visualizations.add,
        function($event, visualizationId, toggle) {
          updateStateParams(osViewerService.params.addVisualization(
            $scope.state.params, visualizationId, toggle,
            $scope.state.package));
        });

      $scope.$on(Configuration.events.visualizations.remove,
        function($event, visualizationId) {
          updateStateParams(osViewerService.params.removeVisualization(
            $scope.state.params, visualizationId, $scope.state.package));
        });

      $scope.$on(Configuration.events.visualizations.removeAll,
        function() {
          updateStateParams(osViewerService.params
            .removeAllVisualizations($scope.state.params,
              $scope.state.package));
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
