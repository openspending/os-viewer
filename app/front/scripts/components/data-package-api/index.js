'use strict';

var Promise = require('bluebird');
var downloader = require('../downloader');
var _ = require('lodash');

module.exports = function(apiConfig, searchConfig) {
  var _APIconfig = apiConfig;
  var _searchConfig = searchConfig;
  return {
    //returns list of packages
    getPackages: function() {
      var urlApiAllPackages = _searchConfig.url + '?size=10000';
      return downloader.get(urlApiAllPackages).then(function(text) {
        var result = [];
        try {
          var packages = JSON.parse(text);
          _.forEach(packages, function(dataPackage) {
            dataPackage.author =
                _.join(
                    _.dropRight(
                        _.split(dataPackage.package.author,' '),
                        1),
                    ' ');
            result.push({
              key: dataPackage.id,
              value: dataPackage
            });
          });
        } catch (e) {
        }
        return result;
      });
    },

    //returns data package
    getDataPackage: function(packageName) {
      var urlApiPackage = _APIconfig.url + '/info/{packageName}/package';
      return downloader.getJson(
        urlApiPackage.replace('{packageName}', packageName)
      );
    },

    //returns model of data package
    getDataPackageModel: function(packageName) {
      var that = this;
      var urlApiPackageModel = _APIconfig.url + '/cubes/{packageName}/model';
      var model = null;

      return downloader.getJson(
        urlApiPackageModel.replace('{packageName}', packageName)
      )
        .then(function(data) {
          model = data.model;
          return that.getDataPackage(packageName);
        })
        .then(function(dataPackage) {
          // Populate some additional model properties
          var dimensionMappings = null;
          var measureMappings = null;
          if (_.isObject(dataPackage.model)) {
            if (_.isObject(dataPackage.model.dimensions)) {
              dimensionMappings = dataPackage.model.dimensions;
            }
            if (_.isObject(dataPackage.model.measures)) {
              measureMappings = dataPackage.model.measures;
            }
          }

          if (dimensionMappings) {
            _.forEach(model.dimensions, function(dimension) {
              // jscs:disable
              var originalDimension =
                dimensionMappings[dimension.orig_dimension];
              // jscs:enable

              if (originalDimension) {
                dimension.dimensionType = originalDimension.dimensionType;
              }
            });
          }

          if (measureMappings) {
            _.forEach(model.measures, function(measure) {
              // jscs:disable
              var originalMeasure = measureMappings[measure.orig_measure];
              // jscs:enable

              if (originalMeasure) {
                measure.currency = originalMeasure.currency;
              }
            });
          }

          return model;
        });
    },

    //returns possible values of some dimension
    getDimensionValues: function(packageName, dimension) {
      var urlApiDimensionValues = _APIconfig.url +
        '/cubes/{packageName}/members/{dimension}';

      var url = urlApiDimensionValues
        .replace('{packageName}', packageName)
        .replace('{dimension}', dimension);

      return downloader.getJson(url);
    },

    getMeasuresFromModel: function(model) {
      var result = [];
      _.forEach(model.aggregates, function(value, key) {
        if (value.measure) {
          result.push({
            key: key,
            value: value.label,
            currency: model.measures[value.measure].currency
          });
        }
      });
      return result;
    },

    getDimensionKeyById: function(model, id) {
      // jscs:disable
      return model.dimensions[id].key_ref;
      // jscs:enable
    },

    getDrillDownDimensionKey: function(model, dimensionId) {
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

    getDimensionsSortingIndexes: function(model) {
      var results = {};
      var i = 0;
      _.forEach(model.hierarchies, function(hierarchy) {
        _.forEach(hierarchy.levels, function(dimension) {
          results[model.dimensions[dimension].label] = i++;
        });
      });
      return results;
    },

    getDimensionsFromModel: function(model) {
      var that = this;
      var result = [];
      _.forEach(model.dimensions, function(value, id) {

        // jscs:disable
        var keyAttribute = value.key_attribute;
        var labelAttribute = value.label_attribute;
        // jscs:enable

        result.push({
          id: id,
          key: that.getDimensionKeyById(model, id),
          code: value.label,
          hierarchy: value.hierarchy,
          dimensionType: value.dimensionType,
          name: model.dimensions[id].key_ref,
          label: model.dimensions[id].label_ref,
          drillDown: that.getDrillDownDimensionKey(model, id)
        });

      });

      return _.sortBy(result, function(value) {
        return value.key;
      });
    },

    buildDimensionValue: function(dimension, possibleValue) {
      // jscs:disable
      return {
        key: possibleValue[dimension.key_ref],
        value: (dimension.key_ref == dimension.label_ref) ?
          possibleValue[dimension.key_ref] : possibleValue[dimension.label_ref]
      };
      // jscs:enable
    },

    getAllDimensionValues: function(packageName, model) {
      var promises = [];
      var result = {};
      var that = this;

      _.forEach(model.dimensions, function(dimension, id) {
        var promise = that.getDimensionValues(packageName, id);
        promise.then(function(possibleValues) {
          _.forEach(possibleValues.data, function(value) {
            var dimensionCode = that.getDimensionKeyById(model, id);
            result[dimensionCode] = result[dimensionCode] || [];
            result[dimensionCode].push(
              that.buildDimensionValue(dimension, value)
            );
          });
        });
        promises.push(promise);
      });

      return Promise.all(promises).then(function() {
        return result;
      });
    }
  };
};
