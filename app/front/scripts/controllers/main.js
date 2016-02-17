/**
 * Created by Ihor Borysyuk on 25.01.16.
 */
;(function (angular) {

  angular.module('Application')
    .controller(
      'main',
      ['$scope', '$rootScope', 'NavigationService', '_', 'ApiService', 'HistoryService', '$q', '$timeout', 'SettingsService',
        function ($scope, $rootScope, NavigationService, _, ApiService, HistoryService, $q, $timeout, SettingsService) {

          function initScopeEvents(){
            $scope.events = {};

            $scope.$on('drillDown', function(event, info){
              var dimension = _.find($scope.state.dimensions.items, {label: info.field});
              if (dimension && dimension.drillDown) {
                $scope.state.dimensions.current.groups = [dimension.drillDown];
                $scope.state.dimensions.current.filters[dimension.key] = dimension.values_keys[info.value];
                NavigationService.updateLocation($scope.state);
                updateBabbage();
              }
            });

            $scope.events.changePackage = function (packageNameIndex) {
              changePackage($scope.state.availablePackages.items[packageNameIndex]);
            };
            $scope.events.changeMeasure = function (measure) {
              $scope.state.measures.current = measure;
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.findDimension = function(key) {
              return _.find($scope.state.dimensions.items, {key: key});
            };

            $scope.events.isGroupSelected = function(key) {
              return $scope.state.dimensions.current.groups.indexOf(key) >= 0
            };

            $scope.events.isFilterSelected = function(key) {
              return !_.isUndefined($scope.state.dimensions.current.filters[key]);
            };

            $scope.events.getFilterSelected = function(key) {
              return $scope.state.dimensions.current.filters[key];
            };

            $scope.events.changeGroup = function (group) {
              var index = $scope.state.dimensions.current.groups.indexOf(group);
              if (index > -1) {
                if ($scope.state.dimensions.current.groups.length > 1) {
                  $scope.state.dimensions.current.groups.splice(index, 1);
                }
              } else {
//              $scope.state.dimensions.current.groups.push(group);//babbage.ui doesn't support multy-drilldown
                $scope.state.dimensions.current.groups = [group];
              }
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.changeFilter = function (filter, value) {
              $scope.state.dimensions.current.filters[filter] = value;
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            }
            $scope.events.dropFilter = function (filter) {
              delete $scope.state.dimensions.current.filters[filter];
              NavigationService.updateLocation($scope.state);
              updateBabbage();
            };
            $scope.events.setTab = function (aTab){
              $scope.currentTab = aTab;
            };
            $scope.events.canBack = function (){
              return HistoryService.canBack();
            };
            $scope.events.canForward = function (){
              return HistoryService.canForward();
            }
            $scope.events.back = function (){
              var history = HistoryService.back();
              setState(history);
            };
            $scope.events.forward = function (){
              var history = HistoryService.forward();
              setState(history);
            }
          }

          function refreshBabbleComponents() {
            $timeout(function(){
              $scope.state.flag.renderingCharts = true;
              $timeout(function() {
                $scope.state.flag.renderingCharts = false;
              })
            });
          }

          function setState(state) {
            $scope.state = _.extend($scope.state, state);
            NavigationService.updateLocation($scope.state);
            refreshBabbleComponents();
          }

          function chooseStateParams(defaultParams) {
            //validate and populate default params
            $scope.state.measures.current = '';
            $scope.state.dimensions.current.groups = [];
            $scope.state.dimensions.current.filters = {};

            if ($scope.state.measures.items[defaultParams.measure]){
              $scope.state.measures.current = defaultParams.measure;
            }

            _.each(defaultParams.groups, function (value){
              var dimension = $scope.events.findDimension(value);
              if (dimension) {
                $scope.state.dimensions.current.groups.push(value);
              }
            });


            _.each(defaultParams.filters, function (value, key){
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

            ApiService.getPackage(packageName).then(function (package) {
              $scope.state.availablePackages.description = package.description;
              $scope.state.availablePackages.title = package.title;
            });

            ApiService.getPackageModel(packageName).then(function (packageModel){
              $scope.state.dimensions.items = packageModel.dimensions.items;
              $scope.state.measures.items = packageModel.measures.items;
              $scope.state.hierarchies = packageModel.hierarchies;

              chooseStateParams(defaultParams);

              if ($scope.state.measures.current == ''){
                $scope.state.measures.current = packageModel.measures.current;
              }

              if ($scope.state.dimensions.current.groups.length == 0){
                $scope.state.dimensions.current.groups = [(_.first(packageModel.dimensions.items)).key];
              }


            }).finally(function(){
              $scope.state.isPackageLoading = false;
              updateBabbage();
              NavigationService.updateLocation($scope.state);
            });
          }

          function updateBabbage(){
            var labelField = (_.find($scope.state.dimensions.items, {key: _.first($scope.state.dimensions.current.groups)})).label;
            var cut = _.map($scope.state.dimensions.current.filters, function(value, key){ return key+':"'+value+'"'});
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
              rows : [labelField],
              cut: cut,
            }
            HistoryService.pushState($scope.state);

            refreshBabbleComponents();
          }

          function applyLocationParams(){
            var params = NavigationService.getParams();
            if (!params.dataPackage.length || ($scope.state.availablePackages.items.indexOf(params.dataPackage) < 0)){
              params.dataPackage = _.first($scope.state.availablePackages.items);
            }

            if ((params.dataPackage !== $scope.state.availablePackages.current)) {
              $timeout(changePackage(params.dataPackage, params));
            } else {
              chooseStateParams(params);
              updateBabbage();
            }
          }

          var changeLocationEvent = $scope.$on('$locationChangeSuccess', function(angularEvent, newUrl, oldUrl, newState, oldState) {
            if (NavigationService.isChanging()) {
              NavigationService.changed();
              return;
            }
            console.log(newUrl, oldUrl);
            if ((newUrl == oldUrl)){
              return;
            }
            applyLocationParams();
          });


          ApiService.getPackages().then(function (packages) {
            $scope.state.availablePackages.items = packages;
            $scope.state.isStarting = false;
            applyLocationParams();
          });


          $scope.state = {};
          $scope.state.isStarting = true;
          $scope.state.flag = {};
          $scope.state.availablePackages = {};
          $scope.state.measures = {};
          $scope.state.dimensions = {};
          $scope.state.dimensions.current = {};
          $scope.state.dimensions.current.groups = [];
          $scope.state.dimensions.current.filters = {};
          SettingsService.get('api').then(function(api) {
            $scope.state.apiUrl = api.url;
          });

          initScopeEvents();
        }]);
})(angular);
