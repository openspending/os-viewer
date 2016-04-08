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

        var embedded = isEmbedded ? 'embed/': '';

        $location.path('/'+ embedded + state.availablePackages.current);
        $location.search({
          measure: state.measures.current,
          'groups[]': state.dimensions.current.groups,
          'rows[]': state.dimensions.current.rows,
          'columns[]': state.dimensions.current.columns,
          filters: filterList
        });
      },

      getParams: function() {
        var searchParams = $location.search();

        // Hack for angular query parser
        searchParams.groups = searchParams.groups || searchParams['groups[]'];
        searchParams.rows = searchParams.rows || searchParams['rows[]'];
        searchParams.columns = searchParams.columns ||
          searchParams['columns[]'];

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

        var rows = (searchParams.rows) ?
          ((_.isArray(searchParams.rows)) ?
            searchParams.rows : [searchParams.rows]) :
          [];

        var columns = (searchParams.columns) ?
          ((_.isArray(searchParams.columns)) ?
            searchParams.columns : [searchParams.columns]) :
          [];

        var params = {
          dataPackage: '',
          measure: (searchParams.measure) ? searchParams.measure : '',
          groups: groups,
          rows: rows,
          columns: columns,
          filters: filters
        };

        var path = $location.path();
        var sections = path.substr(1).split('/');
        if (sections.length == 1) {
          params.dataPackage = sections[0];
        } else {
          if ((sections.length == 3) && (sections[0] == 'embed')) {
            params.currentTab = sections[1];
            params.dataPackage = sections[2];
          }
        }

        return params;
      }
    };
  }]);
})(angular);
