'use strict';

var _ = require('lodash');
var ngModule = require('../module');

var ngUtils = require('../services/ng-utils');
var $q = ngUtils.$q;
var $digest = ngUtils.$digest;
var osViewerService = require('../services/os-viewer');
var dataPackageApiService = require('../services/data-package-api');

ngModule.controller('MainController', [
  '$scope', '$location', '$window', '$timeout', 'Configuration',
  'LoginService', 'i18nFilter',
  function(
    $scope, $location, $window, $timeout, Configuration,
    LoginService, i18n
  ) {
    // Flag for skipping `$locationChangeSuccess` event when
    // it is triggered while updating url
    var isChangingUrl = false;

    // This function should be called before updating $scope.state.params
    function updateStateParams(newParams, updateHistory, updateUrl) {
      updateHistory = _.isUndefined(updateHistory) || !!updateHistory;
      updateUrl = _.isUndefined(updateUrl) || !!updateUrl;
      var isEmbedded = $scope.isEmbedded;

      // Remove all items after current and then store current
      if (updateHistory && !isEmbedded) {
        osViewerService.history.trim($scope.state);
      }
      $scope.state.params = newParams;

      // Extend state with some UI-related data
      $scope.state.params.isEmbedded = isEmbedded;
      $scope.state.params.availableSorting = osViewerService
        .getAvailableSorting($scope.state);
      $scope.state.params.breadcrumbs = osViewerService
        .buildBreadcrumbs($scope.state);
      $scope.state.params.currencySign = osViewerService
        .getCurrencySign($scope.state);
      $scope.state.params.selectedFilters = osViewerService
        .getSelectedFilters($scope.state);

      if (updateHistory && !isEmbedded) {
        osViewerService.history.push($scope.state);
      }

      // Update page URL; set flag to skip nearest location change event
      if (updateUrl && !isEmbedded) {
        isChangingUrl = true;
        $location.url(osViewerService.buildUrl($scope.state.params));
      }

      // Trigger digest safely - $digest is not triggered
      // when processing events
      $digest();
    }

    function updateFilterValues() {
      $scope.state.params.isFiltersUpdating = true;
      $q(osViewerService.fullyPopulateModel($scope.state))
        .then(function() {
          $scope.state.params.selectedFilters = osViewerService
            .getSelectedFilters($scope.state);
          $scope.state.params.isFiltersUpdating = false;
        });
    }

    // Initialization stuff
    function initRegular() {
      return $q(LoginService.tryGetToken())
        .then(function(token) {
          var userId = token ? LoginService.getUserId() : null;
          var urlParams = osViewerService.parseUrl($location.url());
          var packageId = urlParams.packageId;

          return $q(osViewerService.loadDataPackages(token, packageId, userId))
            .then(function(dataPackages) {
              // If user is not logged in, and there are no package ID in url -
              // no data packages will be loaded. In this case, redirect user
              // to OS Explorer
              if (!_.isArray(dataPackages) || (dataPackages.length == 0)) {
                // Can't access osExplorerUrl until config is loaded.
                dataPackageApiService.loadConfig().then(function() {
                  $window.location.href = dataPackageApiService.osExplorerUrl;
                });
              } else {
                $scope.isLoading.application = false;
                $scope.availablePackages = dataPackages;

                $scope.isLoading.package = true;
                return $q(osViewerService.getInitialState(dataPackages,
                  $location.url()))
                  .then(function(state) {
                    osViewerService.translateHierarchies(state, i18n);
                    osViewerService.addIsOwner(state, userId);
                    $scope.state = state;
                    return $q(osViewerService.fullyPopulateModel(state));
                  })
                  .then(function(state) {
                    $scope.state = state;
                    updateStateParams(state.params);
                    $scope.isLoading.package = false;
                  });
              }
            });
        });
    }

    function initEmbedded() {
      $scope.isLoading.application = false;
      $scope.isLoading.package = true;

      var urlParams = osViewerService.parseUrl($location.url());

      return $q(osViewerService.loadDataPackage(urlParams.packageId, urlParams))
        .then(function(state) {
          osViewerService.translateHierarchies(state, i18n);
          $scope.state = state;
          if (osViewerService.hasDrillDownVisualizations(state.params)) {
            $q(osViewerService.partiallyPopulateModel(state))
              .then(function() {
                updateStateParams($scope.state.params);
              });
          }
          return state;
        })
        .then(function(state) {
          $scope.isLoading.package = false;
          $scope.state = state;
          updateStateParams(state.params);
        });
    }

    // Wait for one digest cycle before check `$scope.isEmbedded`
    // since `ng-init` is executed after `ng-controller`
    $timeout(function() {
      var promise = $scope.isEmbedded ? initEmbedded() : initRegular();
      promise.then(function() {
        if ($scope.isMainView) {
          // Update filter values based on current filters
          $scope.$watch('state.params.filters', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              updateFilterValues();
            }
          }, true);
          $scope.$watch('state.params.drilldown', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              updateFilterValues();
            }
          }, true);
        }
      });
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

        var isUrlAvailable = !!url;
        var urlParams = osViewerService.parseUrl(url);
        if (!$scope.state || (packageId != $scope.state.package.id)) {
          $scope.isLoading.package = true;

          return $q(LoginService.tryGetToken())
            .then(function(token) {
              var userId = token ? LoginService.getUserId() : null;

              $q(osViewerService.loadDataPackage(packageId, urlParams))
                .then(function(state) {
                  state.params.lang = $scope.state.params.lang;
                  state.params.theme = $scope.state.params.theme;
                  $scope.state = state;
                  osViewerService.translateHierarchies(state, i18n);
                  osViewerService.addIsOwner(state, userId);
                  return $q(osViewerService.fullyPopulateModel(state));
                })
                .then(function(state) {
                  $scope.isLoading.package = false;
                  $scope.state = state;
                  // Do not update url and history when populating data from url
                  updateStateParams(state.params, !isUrlAvailable,
                    !isUrlAvailable);
                });
            });
        } else {
          if (isUrlAvailable) {
            updateStateParams(osViewerService.params.updateFromParams(
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

    $scope.$on(Configuration.events.visualizations.clearAllParams,
      function() {
        updateStateParams(osViewerService.params
          .clearAllParams($scope.state.params,
            $scope.state.package));
      });

    $scope.$on(Configuration.events.visualizations.resetToDefault,
      function($event, defaultParams) {
        updateStateParams(defaultParams, true, true);
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
          .applyBreadcrumb($scope.state.params, breadcrumb,
            $scope.state.package));
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
          .changeDimension($scope.state.params, axis, key,
            $scope.state.package));
      });

    $scope.$on(Configuration.events.sidebar.clearDimension,
      function($event, axis, key) {
        updateStateParams($scope.state.params = osViewerService.params
          .clearDimension($scope.state.params, axis, key,
            $scope.state.package));
      });

    $scope.$on(Configuration.events.sidebar.setFilter,
      function($event, filter, value) {
        updateStateParams($scope.state.params = osViewerService.params
          .changeFilter($scope.state.params, filter, value,
            $scope.state.package));
      });

    $scope.$on(Configuration.events.sidebar.clearFilter,
      function($event, filter, value) {
        updateStateParams($scope.state.params = osViewerService.params
          .clearFilter($scope.state.params, filter, value,
            $scope.state.package));
      });
  }
]);
