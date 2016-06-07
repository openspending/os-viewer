;(function(angular) {
  var app = angular.module('Application');

  app.factory('NavigationService', ['$location', '_', function($location, _) {
    var
      _isChangingLocation = false;
    return {
      isChanging: function() {
        return _isChangingLocation;
      },

      changed: function() {
        _isChangingLocation = false;
      },

      updateLocation: function(state, isEmbedded) {
        isEmbedded = isEmbedded || false;

        _isChangingLocation = true;
        var filterList = [];
        _.forEach(state.dimensions.current.filters, function(value, key) {
          filterList.push(key + '|' + value);
        });

        var embedded = isEmbedded ? 'embed/' : '';

        $location.path('/' + embedded + state.availablePackages.current);
        $location.search({
          measure: state.measures.current,
          order: state.orderBy.key + '|' + state.orderBy.direction,
          'visualizations[]': state.selectedVisualizations,
          'groups[]': state.dimensions.current.groups,
          'series[]': state.dimensions.current.series,
          'rows[]': state.dimensions.current.rows,
          'columns[]': state.dimensions.current.columns,
          filters: filterList
        });
      },

      getParams: function() {
        var searchParams = $location.search();

        // Hack for angular query parser
        searchParams.visualizations = searchParams.visualizations ||
          searchParams['visualizations[]'];
        searchParams.groups = searchParams.groups || searchParams['groups[]'];
        searchParams.series = searchParams.series || searchParams['series[]'];
        searchParams.rows = searchParams.rows || searchParams['rows[]'];
        searchParams.columns = searchParams.columns ||
          searchParams['columns[]'];

        var orderBy = [];
        if (searchParams.order) {
          orderBy = searchParams.order.split('|');
        }
        if (orderBy.length == 2) {
          orderBy = {
            key: orderBy[0],
            direction: ('' + orderBy[1]).toLowerCase() == 'desc' ?
              'desc' : 'asc'
          };
        } else {
          orderBy = null;
        }

        var filters = {};
        searchParams.filters = (searchParams.filters) ?
          searchParams.filters :
          [];
        searchParams.filters =
          (_.isArray(searchParams.filters)) ?
          searchParams.filters : [searchParams.filters];

        _.forEach(searchParams.filters, function(value) {
          var filter = value.split('|');
          if (filter.length == 2) {
            filters[filter[0]] = filter[1];
          }
        });

        var groups = (searchParams.groups) ?
          ((_.isArray(searchParams.groups)) ?
            searchParams.groups : [searchParams.groups]) :
          [];

        var series = (searchParams.series) ?
          ((_.isArray(searchParams.series)) ?
            searchParams.series : [searchParams.series]) :
          [];

        var rows = (searchParams.rows) ?
          ((_.isArray(searchParams.rows)) ?
            searchParams.rows : [searchParams.rows]) :
          [];

        var columns = (searchParams.columns) ?
          ((_.isArray(searchParams.columns)) ?
            searchParams.columns : [searchParams.columns]) :
          [];

        var visualizations = (searchParams.visualizations) ?
          ((_.isArray(searchParams.visualizations)) ?
            searchParams.visualizations : [searchParams.visualizations]) :
          [];

        var params = {
          dataPackage: '',
          visualizations: visualizations,
          measure: (searchParams.measure) ? searchParams.measure : '',
          groups: groups,
          series: series,
          rows: rows,
          columns: columns,
          filters: filters
        };
        if (orderBy) {
          params.orderBy = orderBy;
        }

        var path = $location.path();
        var sections = path.substr(1).split('/');
        if (sections.length == 1) {
          params.dataPackage = sections[0];
        } else if ((sections.length == 2) && (sections[0] == 'embed')) {
          params.dataPackage = sections[1];
        } else if ((sections.length == 3) && (sections[0] == 'embed')) {
          params.currentTab = sections[1];
          params.dataPackage = sections[2];
        }

        return params;
      }
    };
  }]);
})(angular);
