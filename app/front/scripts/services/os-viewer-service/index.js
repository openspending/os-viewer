'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

var
  _state = {};

module.exports = function(apiConfig, searchConfig) {
  var api = require('../data-package-api')(apiConfig, searchConfig);

  return {
    initState: function(state) {
      _state = state;
    },

    getState: function() {
      return _state;
    },

    _getDimensionsSortingIndexes: function(model) {
      var results = {};
      var i = 0;
      _.forEach(model.hierarchies, function(hierarchy) {
        _.forEach(hierarchy.levels, function(dimension) {
          results[model.dimensions[dimension].ref] = i++;
        });
      });
      return results;
    },

    _buildHierarchies: function(model, dimensionItems) {
      var result = {};
      _.forEach(dimensionItems, function(dimension) {
        var hierarchyKey = (model.hierarchies[dimension.hierarchy]) ?
          dimension.hierarchy :
          'withoutHierarchy';

        if (_.isUndefined(result[hierarchyKey])) {
          var hierarchyName = (model.hierarchies[dimension.hierarchy]) ?
            model.hierarchies[dimension.hierarchy].label :
            'Without hierarchy';

          result[hierarchyKey] = {
            key: hierarchyKey,
            name: hierarchyName,
            dimensions: [],
            common: !(model.hierarchies[dimension.hierarchy])
          };
        }
        result[hierarchyKey].dimensions.push(dimension);
      });
      //sorting
      var sortIndexes = this._getDimensionsSortingIndexes(model);
      _.forEach(result, function(hierarchy, hierarchyKey) {
        result[hierarchyKey].dimensions = _.sortBy(
          hierarchy.dimensions,
          function(dimension) {
            return sortIndexes[dimension.original.ref];
          });
      });
      return _.values(result);
    },

    getPossibleValues: function(packageName, dimension) {
      return api.getDimensionValues(packageName, dimension.id)
        .then(function(values) {
          var result = [];
          _.forEach(values.data, function(value) {
            result.push(
              api.buildDimensionValue(dimension.original, value)
            );
          });
          return result;
        });
    },

    lazyLoadDimensionValues: function(dimension, packageName) {
      if (dimension.values) {
        return Promise.resolve(dimension.values);
      } else {
        packageName = packageName || this.currentPackageName;
        return this.getPossibleValues(packageName, dimension)
          .then(function(possibleValues) {
            dimension.values = possibleValues;
            return dimension.values;
          });
      }
    },

    buildState: function(packageName, options) {
      options = options || {};
      this.currentPackageName = packageName;
      var that = this;
      var model = null;

      return api.getDataPackageModel(packageName)
        .then(function(result) {
          model = result;
          if (options.withoutValues) {
            return Promise.resolve({});
          } else {
            return api.getAllDimensionValues(packageName, model);
          }
        })
        .then(function(possibleValues) {
          var result = {dimensions: {}, measures: {}, hierarchies: {}};

          //init measures
          result.measures.items = api.getMeasuresFromModel(model);
          result.measures.current = (_.first(result.measures.items)).key;

          result.dimensions.items = api.getDimensionsFromModel(model);

          //combine dimensions with possible values
          _.forEach(result.dimensions.items, function(dimension) {
            dimension.values = possibleValues[dimension.key];
          });

          result.hierarchies = that._buildHierarchies(
            model,
            result.dimensions.items
          );

          return result;
        });
    },

    getPackageInfo: function(packageName) {
      return api.getDataPackage(packageName);
    },

    start: function(initState) {
      initState.isStarting = true;
      initState.flag = {};
      initState.availablePackages = {};
      initState.measures = {};
      initState.dimensions = {};
      initState.dimensions.current = {};
      initState.dimensions.current.groups = [];
      initState.dimensions.current.filters = {};

      this.initState(initState);
      return api.getPackages().then(function(dataPackages) {
        _state.availablePackages.items = dataPackages;
        _state.isStarting = false;
        return _state;
      });
    }
  };
};
