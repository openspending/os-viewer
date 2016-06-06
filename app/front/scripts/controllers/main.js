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
            if (!$window.isVisEmbedded) {
              NavigationService.
              updateLocation($scope.state, $rootScope.isEmbedded);
            }
          }

          function updateBreadcrumbs() {
            var filters = $scope.state.dimensions.current.filters;
            var groups = $scope.state.dimensions.current.groups;
            var dimension = _.find($scope.state.dimensions.items, {
              key: _.first(groups)
            });
            var hierarchy = _.find($scope.state.hierarchies, {
              key: dimension.hierarchy
            });

            var baseFilters = _.clone(filters);
            var breadcrumbsDimensions = [];

            var result = [
              {
                groups: undefined,
                filters: undefined,
                key: undefined,
                value: 'Top level',
                display: hierarchy.common ? 'Other Dimensions' : hierarchy.name
              }
            ];

            _.each(hierarchy.dimensions, function(dimension) {
              if (filters[dimension.key]) {
                breadcrumbsDimensions.push(dimension);
              }
            });

            lazyLoadManyDimensionValues(breadcrumbsDimensions)
              .then(function(results) {
                _.each(breadcrumbsDimensions, function(dimension) {
                  //delete hierarchy filters
                  baseFilters[dimension.key] = undefined;
                  result[result.length - 1].groups = dimension.key;
                  var value = _.find(dimension.values, {
                    key: filters[dimension.key]
                  }).value;
                  result.push({
                    key: dimension.key,
                    value: filters[dimension.key],
                    display: value,
                    groups: undefined,
                    filters: undefined
                  });
                });

                baseFilters = _.pickBy(baseFilters);
                _.each(result, function(breadcrumb) {
                  if (breadcrumb.key) {
                    baseFilters[breadcrumb.key] = breadcrumb.value;
                  }
                  breadcrumb.filters = _.clone(baseFilters);
                });

                $scope.state.breadcrumbs = result;
              });
          }

          function lazyLoadManyDimensionValues(dimensions) {
            var promises = _.map(dimensions, function(dimension) {
              return lazyLoadDimensionValues(dimension);
            });

            return $q.all(promises);
          }

          function lazyLoadDimensionValues(dimension) {
            return $q(function(resolve, reject) {
              viewerService.lazyLoadDimensionValues(dimension)
                .then(resolve)
                .catch(reject);
            });
          }

          function drillDown(value) {
            var dimension = _.find(
              $scope.state.dimensions.items, {
                key: _.first($scope.state.dimensions.current.groups)
              });

            if (dimension && dimension.drillDown) {
              $scope.state.dimensions.current.groups = [
                dimension.drillDown
              ];

              lazyLoadDimensionValues(dimension).then(function(values) {
                var item = _.find(values, {key: value});
                if (item) {
                  $scope.state.dimensions.current.filters[dimension.key] =
                    item.key;
                }
                updateLocation();
                updateBabbage();
              });
            }
          }

          function initScopeEvents() {
            $scope.events = {};

            $scope.$on('bubbletree-click',
              function(event, bubbleTreeComponent, info) {
                drillDown(info.label);
              });

            $scope.$on('treemap-click',
              function(event, treeMapComponent, info) {
                drillDown(info._key);
              });

            $scope.events.clickBreadcrumb = function(breadcrumb) {
              $scope.state.dimensions.current.groups = [breadcrumb.groups];
              $scope.state.dimensions.current.filters = _.clone(
                breadcrumb.filters);
              updateLocation();
              updateBabbage();
            };

            $scope.events.changePackage = function(searchPackage, packageInfo) {
              $scope.state.orderBy = null;
              changePackage(searchPackage, packageInfo);
            };

            $scope.events.changeMeasure = function(measure) {
              $scope.state.measures.current = measure;
              $scope.events.toggleOrderBy(measure);
              updateLocation();
              updateBabbage();
            };
            $scope.events.findDimension = function(key) {
              return _.find($scope.state.dimensions.items, function(item) {
                return item.key == key;
              });
            };

            $scope.events.getFilters = function() {
              return _.chain($scope.state.dimensions.current.filters)
                .toPairs()
                .map(function(pair) {
                  var dimension = $scope.events.findDimension(pair[0]);
                  if (dimension) {
                    pair.push(dimension.code);
                  }
                  if (pair[2]) {
                    return pair;
                  }
                })
                .filter()
                .value();
            };

            $scope.events.toggleOrderBy = function(key, direction,
              updateViews) {
              var order = null;
              var state = $scope.state;

              if (arguments.length > 2) {
                order = ('' + direction).toLowerCase();
                state.orderBy = {
                  key: key,
                  direction: (order == 'desc') ? 'desc' : 'asc'
                };
              } else {
                updateViews = direction;
                if (_.isObject(state.orderBy) && (state.orderBy.key == key)) {
                  order = ('' + state.orderBy.direction).toLowerCase();
                  state.orderBy.direction = (order == 'desc') ? 'asc' : 'desc';
                } else {
                  state.orderBy = {
                    key: key,
                    direction: 'desc'
                  };
                }
              }
              if (!!updateViews) {
                updateLocation();
                updateBabbage();
              }
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
              $scope.state.displayFilters = $scope.events.getFilters();
            };
            $scope.events.dropFilter = function(filter) {
              delete $scope.state.dimensions.current.filters[filter];
              updateLocation();
              updateBabbage();
              $scope.state.displayFilters = $scope.events.getFilters();
            };
            $scope.events.dropAllFilters = function() {
              $scope.state.dimensions.current.filters = {};
              updateLocation();
              updateBabbage();
              $scope.state.displayFilters = $scope.events.getFilters();
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
            if ($scope.state.measures.current) {
              $scope.events.toggleOrderBy($scope.state.measures.current);
            }

            // Order by
            if (defaultParams.orderBy) {
              $scope.state.orderBy = defaultParams.orderBy;
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
            $scope.state.dimensions.current.series.isDirty = true;

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
            $scope.state.dimensions.current.columns.isDirty = true;

            // Filters
            _.forEach(defaultParams.filters, function(value, key) {
              var dimension = _.find($scope.state.dimensions.items, {
                key: key
              });
              if (dimension) {
                $scope.state.dimensions.current.filters[key] = value;
              }
            });
            $scope.state.displayFilters = $scope.events.getFilters();
          }

          function changePackage(searchPackage, defaultParams) {
            defaultParams = defaultParams || {};
            $scope.state.isPackageLoading = true;
            var packageInfo = searchPackage.package;
            var modelInfo = searchPackage.model;
            var packageName = searchPackage.id;
            $scope.state.availablePackages.current = packageName;
            $scope.dataPackageInfo = packageInfo;
            $scope.modelInfo = modelInfo;

            $scope.state.availablePackages.description =
              packageInfo.description;

            $scope.state.availablePackages.title = packageInfo.title;

            $scope.state.availablePackages.locationCountry =
              _.isArray(packageInfo.countryCode) ?
                _.first(packageInfo.countryCode) : packageInfo.countryCode;
            $scope.state.availablePackages.locationAvailable = false;

            $q(function(resolve, reject) {
              viewerService.buildState(packageName, {
                withoutValues: $window.isVisEmbedded
              })
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
              if (!$scope.state.orderBy && $scope.state.measures.current) {
                $scope.events.toggleOrderBy($scope.state.measures.current);
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
              // Columns
              if ($scope.state.dimensions.current.columns.length == 0) {
                $scope.state.dimensions.current.columns = [
                  _.first(
                    _.first(state.hierarchies).dimensions
                  ).key];
                $scope.state.dimensions.current.columns.isDirty = true;
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
            if (series && !_.isArray(series)) {
              series = [series];
            }

            var babbageParams = {
              aggregates: $scope.state.measures.current,
              group: [_.first($scope.state.dimensions.current.groups)],
              filter: cut,
              order: [$scope.state.orderBy]
            };
            if (series && series.length) {
              babbageParams.series = series;
            }

            $scope.state.babbage = babbageParams;

            var babbageTimeSeries = babbageParams;
            if (babbageParams.series) {
              var seriesSameAsGroups = (babbageParams.series.length == 1) &&
                (babbageParams.series[0] == babbageParams.group[0]);
              if (seriesSameAsGroups) {
                babbageTimeSeries = _.extend({}, babbageParams);
                babbageTimeSeries.series = undefined;
              }
            }
            $scope.state.babbageTimeSeries = babbageTimeSeries;

            $scope.state.babbagePivot = {
              aggregates: $scope.state.measures.current,
              rows: $scope.state.dimensions.current.rows,
              cols: $scope.state.dimensions.current.columns,
              filter: cut,
              order: [$scope.state.orderBy]
            };

            $scope.state.babbageFacts = {
              aggregates: $scope.state.measures.current,
              group: [_.first($scope.state.dimensions.current.groups)],
              filter: cut
            };

            updateBreadcrumbs();
            HistoryService.pushState($scope.state);
            refreshBabbageComponents();
          }

          function applyLocationParams() {
            var params = NavigationService.getParams();
            var foundPackage =
              _.find($scope.state.availablePackages.items, {
                key: params.dataPackage
              });
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
                updateLocation($scope.state);
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
