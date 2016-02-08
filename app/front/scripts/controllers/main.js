/**
 * Created by Ihor Borysyuk on 25.01.16.
 */
;(function (angular) {

  angular.module('Application')
    .controller(
      'main',
      ['$scope', '_', 'ApiService', 'HistoryService', '$q', '$timeout',
        function ($scope, _, ApiService, HistoryService, $q, $timeout) {


          function initScopeEvents(){
            $scope.events = {};
            $scope.events.changePackage = function (packageNameIndex) {
              changePackage($scope.state.availablePackages.items[packageNameIndex]);
            };
            $scope.events.changeMeasure = function (measure) {
              $scope.state.measures.current = measure;
              updateBabbage();
            };
            $scope.events.findDimension = function(key) {
              return _.find($scope.state.dimensions.items, {key: key});
            };
            $scope.events.isGroupSelected = function(key) {
              return $scope.state.dimensions.current.groups.indexOf(key) >= 0
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
              updateBabbage();
            };
            $scope.events.changeFilter = function (filter, value) {
              $scope.state.dimensions.current.filters[filter] = value;
              updateBabbage();
            }
            $scope.events.dropFilter = function (filter) {
              delete $scope.state.dimensions.current.filters[filter];
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

          function setState(state) {
            $scope.state = _.extend($scope.state, state);
            $timeout(function(){
              $scope.state.flag.renderingCharts = true;
              $timeout(function() {
                $scope.state.flag.renderingCharts = false;
              })
            });
          }

          function changePackage(packageName) {
            $scope.currentTab = 'Treemap';
            $scope.state.isPackageLoading = true;
            $scope.state.availablePackages.current = packageName;

            ApiService.getPackage(packageName).then(function (package) {
              $scope.state.availablePackages.description = (package.description) ? package.description : package.title;
            });

            $scope.state.measures.current = '';
            $scope.state.dimensions.current.groups = [];
            $scope.state.dimensions.current.filters = {};

            ApiService.getPackageModel(packageName).then(function (packageModel){
              $scope.state.dimensions.items = packageModel.dimensions.items;
              $scope.state.measures.items = packageModel.measures.items;
              $scope.state.measures.current = packageModel.measures.current;
              $scope.state.dimensions.current.groups = [(_.first(packageModel.dimensions.items)).key];

            }).finally(function(){
              $scope.state.isPackageLoading = false;
              updateBabbage();
            });
          }

          function updateBabbage(){
            $timeout(function(){
              $scope.state.flag.renderingCharts = true;
              $timeout(function() {

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

                $scope.state.flag.renderingCharts = false;
                HistoryService.pushState($scope.state);
              });
            });
          }


          ApiService.getPackages().then(function (packages) {
            $scope.state.availablePackages.items = packages;
            $scope.state.isStarting = false;
            $timeout(changePackage(_.first($scope.state.availablePackages.items)));
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

          initScopeEvents();

        }]);
})(angular);
