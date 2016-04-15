;(function(angular) {

  var components = require('components');
  var viewerService = {};

  angular.module('Application')
    .controller(
      'main',
      ['$scope',
        '$rootScope',
        'NavigationService',
        '_',
        'HistoryService',
        '$q',
        '$timeout',
        'SettingsService',
        '$window',

        function($scope,
          $rootScope,
          NavigationService,
          _,
          HistoryService,
          $q,
          $timeout,
          SettingsService,
          $window) {

          function updateLocation() {
            NavigationService.
              updateLocation($scope.state, $rootScope.isEmbedded);
          }

          function initScopeEvents() {
            $scope.events = {};

            $scope.$on('treemap-click',
              function(event, treeMapComponent, info) {
                var dimension = _.find(
                  $scope.state.dimensions.items, {
                    key: _.first($scope.state.dimensions.current.groups)
                  });

                if (dimension && dimension.drillDown) {
                  $scope.state.dimensions.current.groups = [
                    dimension.drillDown
                  ];
                  var item = _.find(dimension.values, {key: info._key});
                  if (item) {
                    $scope.state.dimensions.current.filters[dimension.key] =
                      item.key;
                  }
                  updateLocation();
                  updateBabbage();
                }
              });

            $scope.events.changePackage = function(searchPackage, packageInfo) {
              changePackage(searchPackage, packageInfo);
            };

            $scope.events.changeMeasure = function(measure) {
              $scope.state.measures.current = measure;
              updateLocation();
              updateBabbage();
            };
            $scope.events.findDimension = function(key) {
              return _.find($scope.state.dimensions.items, function(item) {
                return item.key == key;
              });
            };

            $scope.events.isGroupSelected = function(key) {
              return $scope.state.dimensions.current.groups.indexOf(key) >= 0;
            };

            $scope.events.isFilterSelected = function(key) {
              return !_.isUndefined(
                $scope.state.dimensions.current.filters[key]
              );
            };

            $scope.events.getSelectedValue = function(dimension) {
              var valueKey =
                $scope.state.dimensions.current.filters[dimension.key];

              var result = _.find(dimension.values, function(item) {
                return item.key == valueKey;
              });
              if (result) {
                return result.value;
              } else {
                return '';
              }
            };

            $scope.events.changeGroup = function(group, dropFilters) {
              var index = $scope.state.dimensions.current.groups.indexOf(group);
              if (index > -1) {
                if ($scope.state.dimensions.current.groups.length > 1) {
                  $scope.state.dimensions.current.groups.splice(index, 1);
                }
              } else {
                //babbage.ui doesn't support multy-drilldown
                //$scope.state.dimensions.current.groups.push(group);
                $scope.state.dimensions.current.groups = [group];
              }
              if (!!dropFilters) {
                $scope.state.dimensions.current.filters = {};
              }
              updateLocation();
              updateBabbage();
            };

            $scope.events.changeFilter = function(filter, value) {
              $scope.state.dimensions.current.filters[filter] = value;
              updateLocation();
              updateBabbage();
            };
            $scope.events.dropFilter = function(filter) {
              delete $scope.state.dimensions.current.filters[filter];
              updateLocation();
              updateBabbage();
            };

            $scope.events.changePivot = function(axis, dimension, replace) {
              var current = $scope.state.dimensions.current;
              if (!replace) {
                var isSelected = _.find(current[axis], function(item) {
                  return item == dimension;
                });
                if (!isSelected) {
                  current[axis].push(dimension);
                }
              } else {
                current[axis] = [dimension];
              }

              updateLocation();
              updateBabbage();
            };
            $scope.events.dropPivot = function(axis, dimension, clear) {
              var current = $scope.state.dimensions.current;
              if (!clear) {
                current[axis] = _.filter(current[axis], function(item) {
                  return item != dimension;
                });
              } else {
                current[axis] = undefined;
              }
              updateLocation();
              updateBabbage();
            };

            $scope.events.canBack = function() {
              return HistoryService.canBack();
            };
            $scope.events.canForward = function() {
              return HistoryService.canForward();
            };
            $scope.events.back = function() {
              var history = HistoryService.back();
              setState(history);
            };
            $scope.events.forward = function() {
              var history = HistoryService.forward();
              setState(history);
            };
          }

          function refreshBabbageComponents() {
            $timeout(function() {
              $scope.state.flag.renderingCharts = true;
              $timeout(function() {
                $scope.state.flag.renderingCharts = false;
              });
            });
          }

          function setState(state) {
            $scope.state = _.extend($scope.state, state);
            updateLocation();
            refreshBabbageComponents();
          }

          function chooseStateParams(defaultParams) {
            //validate and populate default params
            $scope.state.selectedVisualizations = [];
            $scope.state.measures.current = '';
            $scope.state.dimensions.current.groups = [];
            $scope.state.dimensions.current.series = [];
            $scope.state.dimensions.current.rows = [];
            $scope.state.dimensions.current.columns = [];
            $scope.state.dimensions.current.filters = {};

            if (_.isArray(defaultParams.visualizations)) {
              $scope.state.selectedVisualizations =
                defaultParams.visualizations;
            }

            // Measures
            if (_.find($scope.state.measures.items, {
                key: defaultParams.measure
              })) {
              $scope.state.measures.current = defaultParams.measure;
            }

            // Groups
            _.forEach(defaultParams.groups, function(value) {
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.groups.push(value);
              }
            });

            // Series
            _.forEach(defaultParams.series, function(value) {
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.series.push(value);
              }
            });

            // Rows
            _.forEach(defaultParams.rows, function(value) {
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.rows.push(value);
              }
            });

            // Columns
            _.forEach(defaultParams.columns, function(value) {
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.columns.push(value);
              }
            });

            // Filters
            _.forEach(defaultParams.filters, function(value, key) {
              var dimension = _.find($scope.state.dimensions.items,
                function(item) {
                  return item.code == key;
                });
              if (dimension) {
                $scope.state.dimensions.current.filters[key] = value;
              }
            });
          }

          function changePackage(searchPackage, defaultParams) {
            defaultParams = defaultParams || {};
            $scope.state.isPackageLoading = true;
            var packageInfo = searchPackage.package;
            var packageName = searchPackage.id;
            $scope.state.availablePackages.current = packageName;
            $scope.dataPackageInfo = packageInfo;

            $scope.state.availablePackages.description =
              packageInfo.description;

            $scope.state.availablePackages.title = packageInfo.title;

            $scope.state.availablePackages.locationCountry =
              _.isArray(packageInfo.countryCode) ?
                _.first(packageInfo.countryCode) : packageInfo.countryCode;
            $scope.state.availablePackages.locationAvailable = false;

            $q(function(resolve, reject) {
              viewerService.buildState(packageName)
                .then(resolve)
                .catch(reject);
            }).then(function(state) {
              $scope.state.dimensions.items = state.dimensions.items;
              $scope.state.measures.items = state.measures.items;
              $scope.state.hierarchies = state.hierarchies;
              chooseStateParams(defaultParams);

              // Measures
              if (!$scope.state.measures.current) {
                $scope.state.measures.current = state.measures.current;
              }

              // Groups
              if ($scope.state.dimensions.current.groups.length == 0) {
                $scope.state.dimensions.current.groups = [
                  _.first(
                    _.first(state.hierarchies).dimensions
                  ).key];
              }

              // Rows
              if ($scope.state.dimensions.current.rows.length == 0) {
                $scope.state.dimensions.current.rows = [
                  _.first(
                    _.first(state.hierarchies).dimensions
                  ).key];
              }
              // Rows
              if ($scope.state.dimensions.current.columns.length == 0) {
                $scope.state.dimensions.current.columns = [
                  _.first(
                    _.first(state.hierarchies).dimensions
                  ).key];
              }

              $scope.state.availablePackages.locationAvailable =
                !!$scope.state.availablePackages.locationCountry &&
                !!_.find(state.dimensions.items, {
                  dimensionType: 'location'
                });
              $scope.state.availablePackages.locationSelected = false;
            }).finally(function() {
              $scope.state.isPackageLoading = false;
              updateBabbage();
              updateLocation();
            });
          }

          function updateBabbage() {
            var cut = _.map(
              $scope.state.dimensions.current.filters,
              function(value, key) {
                return key + ':"' + value + '"';
              });

            var series = $scope.state.dimensions.current.series;
            if (series) {
              series = [series];
            }

            $scope.state.babbage = {
              aggregates: $scope.state.measures.current,
              group: [_.first($scope.state.dimensions.current.groups)],
              series: series,
              filter: cut
            };

            $scope.state.babbagePivot = {
              aggregates: $scope.state.measures.current,
              rows: $scope.state.dimensions.current.rows,
              cols: $scope.state.dimensions.current.columns,
              filter: cut
            };

            HistoryService.pushState($scope.state);

            refreshBabbageComponents();
          }

          function applyLocationParams() {
            var params = NavigationService.getParams();
            var foundPackage =
                _.find($scope.state.availablePackages.items,
                    {key: params.dataPackage});
            if (!foundPackage) {
              foundPackage =
                _.first($scope.state.availablePackages.items);
              params.dataPackage = foundPackage.key;
            }

            if (params.dataPackage !== $scope.state.availablePackages.current) {
              $timeout(changePackage(foundPackage.value, params));
            } else {
              chooseStateParams(params);
              updateBabbage();
            }
          }

          $rootScope.isEmbedded = $window.isEmbedded;

          $scope.$watchCollection('state.selectedVisualizations',
            function(value) {
              if (_.isArray(value)) {
                NavigationService.updateLocation($scope.state);
              }
            });

          $scope.$watch('state.dimensions.current.groups', function(value) {
            if ($scope.state && $scope.state.availablePackages) {
              var currentGroup = _.find($scope.state.dimensions.items, {
                key: _.first(value)
              });
              $scope.state.availablePackages.locationSelected =
                _.isObject(currentGroup) &&
                (currentGroup.dimensionType == 'location');
            }
          });

          $scope.$watch('state.measures.current', function(value) {
            if ($scope.state && $scope.state.availablePackages) {
              var currentMeasure = _.find($scope.state.measures.items, {
                key: value
              });

              $scope.state.availablePackages.currencySign =
                _.isObject(currentMeasure) ? currentMeasure.currency : null;
            }
          });

          $scope.$on('$locationChangeSuccess',
            function(angularEvent, newUrl, oldUrl) {
              if (NavigationService.isChanging()) {
                NavigationService.changed();
                return;
              }
              if ((newUrl == oldUrl)) {
                return;
              }
              applyLocationParams();
            });

          function init() {
            $scope.state = {};
            $scope.state.isStarting = true;
            var searchSettings;

            return SettingsService.get('search')
                .then(function(_searchSettings) {
                  searchSettings = _searchSettings;
                  $scope.state.searchUrl = searchSettings.url;
                  return SettingsService.get('api');
                })
                .then(function(apiSettings) {
                  $scope.state.apiUrl = apiSettings.url;
                  $scope.state.cosmoUrl = apiSettings.cosmoUrl;
                  viewerService =
                      components.osViewerService(apiSettings, searchSettings);
                  return $q(function(resolve, reject) {
                    viewerService.start({}).then(function(state) {
                      resolve(state);
                    });
                  });
                });
          }

          init().then(function(state) {
            $scope.state = _.extend($scope.state, state);
            applyLocationParams();
          });

          initScopeEvents();
        }]);
})(angular);
