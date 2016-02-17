/**
 * Created by Ihor Borysyuk on 02.02.16.
 */
ngBabbage.directive('bubbleTree', ['$rootScope', '$http', '_', function($rootScope, $http, _) {
  return {
    restrict: 'EA',
    require: '^babbage',
    scope: {
    },
    templateUrl: 'templates/bubble-tree.html',
    link: function(scope, element, attrs, babbageCtrl) {
      scope.queryLoaded = false;
      scope.cutoffWarning = false;
      scope.cutoff = 0;

      var generateBubbuleTreeData = function (cells, category, grouping, value) {
        return {
          label: 'Total',
          amount: _.reduce(
            _.pluck(cells, value),
            function(memo, num){
              return memo + num
            },
            0
          ),
          children: _.map(cells, function (cell) {
            return {
              label: cell[category],
              amount:  cell[value]
            }
          })
        }
      };

      var query = function(model, state) {
        var category = asArray(state.category)[0],
          grouping = asArray(state.grouping)[0],
          value = asArray(state.value)[0];

        if (!value || !category) return;

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

      var queryResult = function(data, q, model, state, category, grouping, value) {
        var wrapper = element.find('.bubbletree')[0],
          colors = ngBabbageGlobals.colorScale.copy(),
          data = generateBubbuleTreeData(data.cells, category, grouping, value);

        var colors = _.chain(data).values().map(function(value, index){
            return [value[0], colors(index)];
          }).object().value();

        this.bubbleTree = new BubbleTree({
          autoColors: true,
          data: data,
          container: wrapper
        });

        scope.queryLoaded = true;
        scope.cutoffWarning = data.total_cell_count > q.pagesize;
        scope.cutoff = q.pagesize;
      };

      var unsubscribe = babbageCtrl.subscribe(function(event, model, state) {
        query(model, state);
      });
      scope.$on('$destroy', unsubscribe);

      babbageCtrl.init({});
    }
  }

}]);
