/**
 * Created by Ihor Borysyuk on 02.02.16.
 */
ngBabbage.directive('pieChart', ['$rootScope', '$http', '_', function($rootScope, $http, _) {
  return {
    restrict: 'EA',
    require: '^babbage',
    scope: {
      chartType: '@'
    },
    templateUrl: 'templates/pie-chart.html',
    link: function(scope, element, attrs, babbageCtrl) {
      scope.queryLoaded = false;
      scope.cutoffWarning = false;
      scope.cutoff = 0;

      var getNames = function(model) {
        var names = {};
        for (var ref in model.refs) {
          var concept = model.refs[ref];
          names[ref] = concept.label || concept.name || ref;
        }
        return names;
      };

      var generateColumns = function(cells, category, grouping, value) {
        var columns = [];
        _.each(cells, function(cell){
          columns.push([cell[category], cell[value]]);
        });
        return _.sortBy(columns, function(value){
          return -value[1];
        });
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
        var wrapper = element.find('.pie-chart')[0],
          size = babbageCtrl.size(wrapper, function(w) {
            return w * 0.6;
          }),
          colors = ngBabbageGlobals.colorScale.copy(),
          columns = generateColumns(data.cells, category, grouping, value);

        var colors = _.chain(columns)
          .values()
          .map(function(value, index){
            return [value[0], colors(index)];
          })
          .object()
          .value();

        d3.select(wrapper)
          .style("width", size.width + "px")
          .style("height", size.height + "px");

        var chart = c3.generate({
          bindto: wrapper,
          data: {
            columns: columns,
            colors: colors,
            type: 'pie'
          },
        });

        scope.queryLoaded = true;
        scope.cutoffWarning = data.total_cell_count > q.pagesize;
        scope.cutoff = q.pagesize;
      };

      var unsubscribe = babbageCtrl.subscribe(function(event, model, state) {
        query(model, state);
      });
      scope.$on('$destroy', unsubscribe);

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
        }
      };

        queryModel.category = {
          label: 'Categories',
          addLabel: 'set bars',
          types: ['attributes'],
          defaults: [],
          sortId: 0,
          multiple: false
        };

      babbageCtrl.init(queryModel);
    }
  }

}]);
