/**
 * Created by Ihor Borysyuk on 22.02.16.
 */

'use strict';
var Promise = require('bluebird');
var _ = require('underscore');

var
  _state = {};

module.exports = function (config) {
  var _config = config;
  var api = require('../data-package-api')(_config);

  return {
    initState: function (state) {
      _state = state;
    },

    getState: function () {
      return _state;
    },

    _getDimensionsSortingIndexes: function (model) {
      var results = {};
      var i = 0;
      _.each(model.hierarchies, function (hierarchy) {
        _.each(hierarchy.levels, function (dimension) {
          results[model.dimensions[dimension].label] = i++;
        });
      });
      return results;
    },

    _buildHierarchies: function (model, dimensionItems) {
      var result = {};
      _.each(dimensionItems, function (dimension) {
        var hierarchy_key = (model.hierarchies[dimension.hierarchy]) ? dimension.hierarchy : 'withoutHierarchy';
        if (_.isUndefined(result[hierarchy_key])) {
          result[hierarchy_key] = {
            key: hierarchy_key,
            name: (model.hierarchies[dimension.hierarchy]) ? model.hierarchies[dimension.hierarchy].label : 'Without hierarchy',
            dimensions: [],
            common: !(model.hierarchies[dimension.hierarchy])
          };
        }
        result[hierarchy_key].dimensions.push(dimension);
      });
      //sorting
      var sortIndexes = this._getDimensionsSortingIndexes(model);
      _.each(result, function (hierarchy, hierarchy_key) {
        result[hierarchy_key].dimensions = _.sortBy(hierarchy.dimensions, function (dimension) {
          return sortIndexes[dimension.key];
        });
      });
      return _.values(result);
    },

    buildState: function (packageName) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var result = {dimensions: {}, measures: {}, hierarchies: {}};
        api.getDataPackageModel(packageName).then(function (model) {
          api.getAllDimensionValues(packageName, model).then(function (possibleValues) {
            //init measures
            result.measures.items = api.getMeasuresFromModel(model);
            result.measures.current = (_.first(result.measures.items)).key;

            result.dimensions.items = api.getDimensionsFromModel(model);

            //combine dimensions with possible values
            _.each(result.dimensions.items, function (dimension) {
              dimension.values = possibleValues[dimension.key];
            });

            result.hierarchies = that._buildHierarchies(model, result.dimensions.items);

            resolve(result);
          });
        });
      });
    },

    getPackageInfo: function(packageName) {
      return api.getDataPackage(packageName);
    },

    start: function (initState) {
      var that = this;
      return new Promise(function (resolve, reject) {
        initState.isStarting = true;
        initState.flag = {};
        initState.availablePackages = {};
        initState.measures = {};
        initState.dimensions = {};
        initState.dimensions.current = {};
        initState.dimensions.current.groups = [];
        initState.dimensions.current.filters = {};

        that.initState(initState);
        api.getPackages().then(function (dataPackages) {
          _state.availablePackages.items = dataPackages;
          _state.isStarting = false;
          resolve(_state);
        });
      });
    },
  };
};
