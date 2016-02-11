/**
 * Created by Ihor Borysyuk on 09.02.16.
 */

;(function(angular) {
  var app = angular.module('Application');

  app.factory('NavigationService', ['$location', '_', function($location, _){
    var
      _isChangingLocation = false;
    return {
      isChanging: function() {
        return _isChangingLocation;
      },

      changed: function() {
        _isChangingLocation = false;
      },

      isEmbeded: function (){
        return (this.getParams()).isEmbeded;
      },

      updateLocation: function(state) {
        _isChangingLocation = true;
        var filterList = [];
        _.each(state.dimensions.current.filters, function(value, key){
          filterList.push(key+'|'+value);
        });

        $location.path('/'+state.availablePackages.current);
        $location.search({
          measure: state.measures.current,
          groups: state.dimensions.current.groups,
          filters: filterList
        });
      },

      getParams: function(){
        var searchParams = $location.search();
        var filters = {};
        searchParams.filters = (searchParams.filters)?searchParams.filters : [];
        searchParams.filters = (_.isArray(searchParams.filters))? searchParams.filters : [searchParams.filters];
        _.each(searchParams.filters, function (value) {
          var filter = value.split('|');
          if (filter.length == 2){
            filters[filter[0]] = filter[1];
          }
        });

        var groups = (searchParams.groups) ?
          ((_.isArray(searchParams.groups))? searchParams.groups : [searchParams.groups]) :
          [];

        var params = {
          dataPackage: '',
          isEmbeded: false,
          measure: (searchParams.measure) ? searchParams.measure : '',
          groups: groups,
          filters: filters
        };

        var path = $location.path();
        var sections = path.substr(1).split('/');
        if (sections.length = 1){
          params.dataPackage = sections[0];
        } else {
          if ((sections.length = 2) && (sections[0] == 'embed')){
            params.dataPackage = sections[1];
            params.isEmbeded = true;
          }
        }

        return params;
      }
    }
  }]);
})(angular)