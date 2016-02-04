/**
 * Created by Ihor Borysyuk on 25.01.16.
 */
;(function (angular) {

  angular.module('Application')
    .controller(
      'main',
      ['$scope', '_', 'ApiService', '$q', '$timeout',
        function ($scope, _, ApiService, $q, $timeout) {


          $scope.isStarting = true;
          $scope.flag = {};

          function changePackage(packageName) {
            $scope.currentTab = 'Treemap';
            $scope.isPackageLoading = true;
            $scope.availablePackages.current = packageName;

            ApiService.getPackage(packageName).then(function (package) {
              $scope.availablePackages.description = (package.description) ? package.description : package.title;
            });

            $scope.measures.current = '';
            $scope.dimensions.current.groups = [];
            $scope.dimensions.current.filters = {};

            ApiService.getPackageModel(packageName).then(function (packageModel){
              $scope.dimensions.items = packageModel.dimensions.items;
              $scope.measures.items = packageModel.measures.items;
              $scope.measures.current = packageModel.measures.current;
              $scope.dimensions.current.groups = [(_.first(packageModel.dimensions.items)).key];

            }).finally(function(){
              $scope.isPackageLoading = false;
              updateBabbage();
            });
          }

          function updateBabbage(){
            $timeout(function(){
              $scope.flag.renderingCharts = true;
              $timeout(function() {

                var labelField = (_.find($scope.dimensions.items, {key: _.first($scope.dimensions.current.groups)})).label;
//                var labelField = $scope.dimensions.items[_.first($scope.dimensions.current.groups)].label;
                var cut = _.map($scope.dimensions.current.filters, function(value, key){ return key+':"'+value+'"'});
                $scope.babbageTreeMap = {
                  grouping: _.first($scope.dimensions.current.groups),
                  area: $scope.measures.current,
                  tile: labelField,
                  cut: cut,
                };
                $scope.babbageBar = {
                  value: $scope.measures.current,
                  area: $scope.measures.current,
                  category: labelField,
                  cut: cut,
                };
                $scope.babbageTable = {
                  category: labelField,
                  rows : [labelField],
                  cut: cut,
                }

                $scope.flag.renderingCharts = false;
              });
            });
          }


          ApiService.getPackages().then(function (packages) {
            $scope.availablePackages.items = packages;
            $scope.isStarting = false;
            $timeout(changePackage(_.first($scope.availablePackages.items)));
          });

          $scope.availablePackages = {};
          $scope.measures = {};
          $scope.dimensions = {};
          $scope.dimensions.current = {};
          $scope.dimensions.current.groups = [];
          $scope.dimensions.current.filters = {};

          $scope.availablePackages.changePackage = function (packageNameIndex) {
            changePackage($scope.availablePackages.items[packageNameIndex]);
          };

          $scope.measures.changeMeasure = function (measure) {
            $scope.measures.current = measure;
            updateBabbage();
          };

          $scope.dimensions.find = function(key) {
            return _.find($scope.dimensions.items, {key: key});
          };

          $scope.dimensions.current.changeGroup = function (group) {
            var index = $scope.dimensions.current.groups.indexOf(group);
            if (index > -1) {
              if ($scope.dimensions.current.groups.length > 1) {
                $scope.dimensions.current.groups.splice(index, 1);
              }
            } else {
//              $scope.dimensions.current.groups.push(group);//babbage.ui doesn't support multy-drilldown
              $scope.dimensions.current.groups = [group];
            }
            updateBabbage();
          };
          $scope.dimensions.current.changeFilter = function (filter, value) {
            $scope.dimensions.current.filters[filter] = value;
            updateBabbage();
          }

          $scope.dimensions.current.dropFilter = function (filter) {
            delete $scope.dimensions.current.filters[filter];
            updateBabbage();
          };

          $scope.setTab = function (aTab){
            $scope.currentTab = aTab;
          };
        }]);
})(angular);
