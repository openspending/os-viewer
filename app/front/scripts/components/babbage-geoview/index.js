'use strict';

var directive = require('./directive');

module.exports = function(ngModule) {
  directive(ngModule);

  ngModule.directive('babbageGeoview', [
    '$http', '$timeout', '_',
    function($http, $timeout, _) {
      return {
        restrict: 'EA',
        require: '^babbage',
        scope: {
          countryCode: '@',
          currencySign: '@?',
        },
        template: '<geoview country-code="{{ countryCode }}" ' +
          'currency-sign="{{ currencySign }}" values="values"></geoview>',
        replace: false,
        link: function($scope, element, attrs, babbageCtrl) {
          $scope.queryLoaded = false;

          var query = function(model, state) {
            var category = asArray(state.category)[0];
            var grouping = asArray(state.grouping)[0];
            var value = asArray(state.value)[0];

            if (!value || !category) {
              return;
            }

            var q = babbageCtrl.getQuery();
            q.aggregates = [value];
            q.drilldown = [category];
            if (grouping) {
              q.drilldown.push(grouping);
            }

            var order = [];
            for (var i in q.order) {
              var o = q.order[i];
              if ([value, category].indexOf(o.ref) != -1) {
                order.push(o);
              }
            }
            if (!order.length) {
              order = [{ref: value, direction: 'desc'}];
            }
            if (grouping && order[0] && order[0].ref != grouping) {
              order.unshift({ref: grouping, direction: 'asc'});
            }

            q.order = order;
            q.page = 0;
            q.pagesize = 10000;

            var dfd = $http.get(babbageCtrl.getApiUrl('aggregate'),
              babbageCtrl.queryParams(q));
            dfd.then(function(res) {
              queryResult(res.data, q, model, state, category, grouping, value);
            });
          };

          var queryResult = function(data, q, model, state, category,
            grouping, value) {
            var columns = {};
            _.each(data.cells, function(cell) {
              columns[cell[category]] = cell[value];
            });

            $scope.values = columns;
            $scope.queryLoaded = true;
          };

          var unsubscribe = babbageCtrl.subscribe(
            function(event, model, state) {
              query(model, state);
            }
          );
          $scope.$on('$destroy', unsubscribe);

          var queryModel = {
            value: {
              label: 'Value',
              addLabel: 'set height',
              types: ['aggregates'],
              defaults: [],
              sortId: 1,
              multiple: false
            },
            grouping: {
              label: 'Grouping (opt)',
              addLabel: 'select',
              types: ['attributes'],
              defaults: [],
              sortId: 2,
              remove: true,
              multiple: false
            },
            category: {
              label: 'Categories',
              addLabel: 'set bars',
              types: ['attributes'],
              defaults: [],
              sortId: 0,
              multiple: false
            }
          };

          babbageCtrl.init(queryModel);
        }
      };
    }
  ]);
};
