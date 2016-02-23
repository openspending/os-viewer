/**
 * Created by Ihor Borysyuk on 18.02.16.
 */

'use strict';
var Promise = require('bluebird');
var downloader = require('../downloader');
var _ = require('underscore');

module.exports = function (config) {
  var _config = config;
  return {
    //returns list of packages
    getPackages: function () {
      var url_api_all_packages = _config.url + '/cubes';
      return downloader.get(url_api_all_packages).then(function (text) {
        var result = [];
        try {
          var packages = JSON.parse(text);
          _.each(packages.data, function (dataPackage) {
            result.push({
              key: dataPackage.name,
              value: dataPackage.name
            });
          });
        } catch (e) {
        }
        return result;
      });
    },

    //returns data package
    getDataPackage: function (packageName) {
      var url_api_package = _config.url + '/info/{packageName}/package';
      return downloader.get(url_api_package.replace('{packageName}', packageName)).then(function (text) {
        var result = {};
        try {
          result = JSON.parse(text);
        } catch (e) {
        }
        return result;
      });
    },

    //returns model of data package
    getDataPackageModel: function (packageName) {
      var url_api_package_model = _config.url + '/cubes/{packageName}/model';
      return downloader.get(url_api_package_model.replace('{packageName}', packageName)).then(function (text) {
        var result = {};
        try {
          result = JSON.parse(text).model;
        } catch (e) {
        }
        return result;
      });
    },

    //returns possible values of some dimension
    getDimensionValues: function (packageName, dimension) {
      var url_api_dimension_values = _config.url + '/cubes/{packageName}/members/{dimension}';

      return downloader.get(
        url_api_dimension_values.replace('{packageName}', packageName).replace('{dimension}', dimension)
      ).then(function (text) {
        var result = {};
        try {
          result = JSON.parse(text);
        } catch (e) {
        }
        return result;
      });
    },

    getMeasuresFromModel: function (model) {
      var result = [];
      _.each(model.aggregates, function (value, key) {
        if (value.measure) {
          result.push({
            key: key,
            value: value.label
          });
        }
      });
      return result;
    },

    getDimensionKeyById: function (model, id) {
      return model.dimensions[id].label;
    },

    getDrillDownDimensionKey: function (model, dimensionId) {
      var result = undefined;
      var dimension = model.dimensions[dimensionId];
      var hierarchy = model.hierarchies[dimension.hierarchy];
      if (hierarchy) {
        var dimensionLevel = hierarchy.levels.indexOf(dimensionId);
        if (dimensionLevel > -1) {
          var drillDownDimensionId = hierarchy.levels[dimensionLevel + 1];
          if (drillDownDimensionId) {
            result = this.getDimensionKeyById(model, drillDownDimensionId);
          }
        }
      }
      return result;
    },

    getDimensionsSortingIndexes: function (model) {
      var results = {};
      var i = 0;
      _.each(model.hierarchies, function (hierarchy) {
        _.each(hierarchy.levels, function (dimension) {
          results[model.dimensions[dimension].label] = i++;
        });
      });
      return results;
    },

    getDimensionsFromModel: function (model) {
      var that = this;
      var result = [];
      _.each(model.dimensions, function (value, id) {
        result.push({
          id: id,
          key: that.getDimensionKeyById(model, id),
          code: value.label,
          hierarchy: value.hierarchy,
          name: value.attributes[value.key_attribute].column,
          label: value.hierarchy + '.' + value.label_attribute,
          drillDown: that.getDrillDownDimensionKey(model, id)
        });
      });

      return _.sortBy(result, function(value) {return value.key});
    },

    buildDimensionValue: function (dimension, possibleValue) {
      return {
        key: possibleValue[dimension.key_ref],
        value: (dimension.key_ref == dimension.label_ref) ?
          possibleValue[dimension.key_ref] : possibleValue[dimension.label_ref]
      }
    },

    getAllDimensionValues: function (packageName, model) {
      var promises = [];
      var result = {};
      var that = this;

      _.each(model.dimensions, function (dimension, id) {
        promises.push(that.getDimensionValues(packageName, id).then(function (possibleValues) {
          _.each(possibleValues.data, function (value) {
            var dimensionCode = that.getDimensionKeyById(model, id);
            result[dimensionCode] = result[dimensionCode] || [];
            result[dimensionCode].push(that.buildDimensionValue(dimension, value));
          });
        }));
      });

      return Promise.all(promises).then(function () {
        return result;
      });
    },
  };
};