;(function(angular) {

  var components = require('components');
  var viewerService = {};

  angular.module('Application')
    .controller(
      'main',
      ['$scope',
        'NavigationService',
        '_',
        'HistoryService',
        '$q',
        '$timeout',
        'SettingsService',

        function($scope,
                 NavigationService,
                 _,
                 HistoryService,
                 $q,
                 $timeout,
                 SettingsService) {

          function initScopeEvents() {
            $scope.events = {};

            $scope.$on('drillDown', function(event, info) {
              var dimension = _.find(
                $scope.state.dimensions.items, {label: info.field}
              );

              if (dimension && dimension.drillDown) {
                $scope.state.dimensions.current.groups = [dimension.drillDown];
                var item = _.find(dimension.values, {value: info.value});
                if (item) {
                  $scope.state.dimensions.current.filters[dimension.key] =
                    item.key;
                }
                NavigationService.updateLocation($scope.state);
                updateBabbage();
              }
            });

            $scope.events.changePackage = function(packageNameIndex) {
              changePackage(packageNameIndex);
            };

            $scope.events.changeMeasure = function(measure) {
              $scope.state.measures.current = measure;
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.findDimension = function(key) {
              return _.findWhere($scope.state.dimensions.items, {key: key});
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

            $scope.events.changeGroup = function(group) {
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
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.changeFilter = function(filter, value) {
              $scope.state.dimensions.current.filters[filter] = value;
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.dropFilter = function(filter) {
              delete $scope.state.dimensions.current.filters[filter];
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.setTab = function(aTab) {
              $scope.currentTab = aTab;
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
            NavigationService.updateLocation($scope.state);
            refreshBabbageComponents();
          }

          function chooseStateParams(defaultParams) {
            //validate and populate default params
            $scope.state.measures.current = '';
            $scope.state.dimensions.current.groups = [];
            $scope.state.dimensions.current.filters = {};

            if (_.where($scope.state.measures.items, {
                key: defaultParams.measure
              })) {
              $scope.state.measures.current = defaultParams.measure;
            }

            _.each(defaultParams.groups, function(value) {
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.groups.push(value);
              }
            });

            _.each(defaultParams.filters, function(value, key) {
              var dimension = $scope.events.findDimension(key);
              if (dimension) {
                $scope.state.dimensions.current.filters[key] = value;
              }
            });
          }

          function changePackage(packageName, defaultParams) {
            defaultParams = defaultParams || {};
            $scope.currentTab = 'Treemap';
            $scope.state.isPackageLoading = true;
            $scope.state.availablePackages.current = packageName;

            $q(function(resolve, reject) {
              viewerService.getPackageInfo(packageName)
                .then(resolve)
                .catch(reject);
            }).then(function(packageInfo) {
              $scope.state.availablePackages.description =
                packageInfo.description;

              $scope.state.availablePackages.title = packageInfo.title;
            });

            $q(function(resolve, reject) {
              viewerService.buildState(packageName)
                .then(resolve)
                .catch(reject);
            }).then(function(state) {
              $scope.state.dimensions.items = state.dimensions.items;
              $scope.state.measures.items = state.measures.items;
              $scope.state.hierarchies = state.hierarchies;
              chooseStateParams(defaultParams);

              console.log($scope.state.measures);
              if (!$scope.state.measures.current) {
                $scope.state.measures.current = state.measures.current;
              }

              if ($scope.state.dimensions.current.groups.length == 0) {
                $scope.state.dimensions.current.groups = [
                  _.first(
                    _.first(state.hierarchies).dimensions
                  ).key];
              }
            }).finally(function() {
              $scope.state.isPackageLoading = false;
              updateBabbage();
              NavigationService.updateLocation($scope.state);
            });
          }

          function updateBabbage() {
            var labelField = (_.find($scope.state.dimensions.items, {
              key: _.first($scope.state.dimensions.current.groups)
            })).label;

            var cut = _.map(
              $scope.state.dimensions.current.filters,
              function(value, key) {
                return key + ':"' + value + '"';
              });
            $scope.state.babbageTreeMap = {
              grouping: _.first($scope.state.dimensions.current.groups),
              area: $scope.state.measures.current,
              tile: labelField,
              cut: cut,
            };
            $scope.state.babbageBar = {
              value: $scope.state.measures.current,
              area: $scope.state.measures.current,
              category: labelField,
              cut: cut,
            };
            $scope.state.babbageTable = {
              category: labelField,
              rows: [labelField],
              cut: cut,
            };
            HistoryService.pushState($scope.state);

            refreshBabbageComponents();
          }

          function applyLocationParams() {
            var params = NavigationService.getParams();
            if (
              !_.find($scope.state.availablePackages.items, {
                key: params.dataPackage
              })
            ) {
              params.dataPackage =
                _.first($scope.state.availablePackages.items).key;
            }

            if (params.dataPackage !== $scope.state.availablePackages.current) {
              $timeout(changePackage(params.dataPackage, params));
            } else {
              chooseStateParams(params);
              updateBabbage();
            }
          }

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

            return SettingsService.get('api').then(function(apiSettings) {
              $scope.state.apiUrl = apiSettings.url;
              viewerService = components.osViewerService(apiSettings);
              return $q(function(resolve, reject) {
                viewerService.start({}).then(function(state) {
                  resolve(state);
                });
              });
            });
          };

          init().then(function(state) {
            $scope.state = _.extend($scope.state, state);
            applyLocationParams();
          });

          initScopeEvents();
        }]);
})(angular);
