'use strict';

var url = require('url');
var qs = require('qs');
var _ = require('lodash');
var Promise = require('bluebird');
var dataPackageApi = require('../data-package-api');
var stateParams = require('./params');
var history = require('./history');

var maxDimensionValuesForColumns = 50;

function getHierarchiesWithLimitedDimensionValues(hierarchies, maxValueCount) {
  return _.chain(hierarchies)
    .map(function(hierarchy) {
      var result = _.extend({}, hierarchy);
      result.dimensions = _.filter(hierarchy.dimensions,
        function(dimension) {
          return dimension.values.length <= maxValueCount;
        });
      if (result.dimensions.length > 0) {
        return result;
      }
    })
    .filter()
    .value();
}

function loadDataPackages() {
  return dataPackageApi.getDataPackages();
}

function loadDataPackage(packageId, initialParams) {
  return dataPackageApi.getDataPackage(packageId, true)
    .then(function(packageModel) {
      var params = _.extend(
        stateParams.init(packageModel, initialParams), {
          babbageApiUrl: dataPackageApi.apiConfig.url,
          cosmopolitanApiUrl: dataPackageApi.apiConfig.cosmoUrl
        }
      );

      return {
        package: packageModel,
        params: params,
        history: history.init()
      }
    });
}

function fullyPopulateModel(state) {
  return dataPackageApi.loadDimensionsValues(state.package)
    .then(function(packageModel) {
        packageModel.columnHierarchies =
          getHierarchiesWithLimitedDimensionValues(packageModel.hierarchies,
            maxDimensionValuesForColumns);
       return state;
    });
}

function parseUrl(pageUrl, baseUrl) {
  baseUrl = baseUrl || '';
  if (baseUrl.substr(0, 1) != '/') {
    baseUrl = '/' + baseUrl;
  }
  if (baseUrl.substr(-1, 1) != '/') {
    baseUrl = baseUrl + '/';
  }

  var urlParams = url.parse(pageUrl);
  urlParams.query = qs.parse(urlParams.query);

  var path = urlParams.pathname;
  path = path.substr(baseUrl.length, path.length);
  if (path.substr(-1, 1) == '/') {
    path = path.substr(0, path.length - 1);
  }

  var result = urlParams.query;
  result.isEmbedded = false;
  result.packageId = null;

  // TODO: Parse embed urls

  if (path != '') {
    result.packageId = path;
  }

  return result;
}

function choosePackage(dataPackages, packageId) {
  var dataPackage = _.find(dataPackages, function(item) {
    return item.id == packageId;
  });
  if (!dataPackage) {
    dataPackage = _.first(dataPackages);
  }
  return dataPackage ? dataPackage.id : null;
}

function getInitialState(dataPackages, pageUrl, baseUrl) {
  var urlParams = parseUrl(pageUrl, baseUrl);

  var packageId = choosePackage(dataPackages, urlParams.packageId);
  if (packageId) {
    // If package identified by url does not exist -
    // invalidate other params from url
    if (packageId != urlParams.packageId) {
      urlParams = {
        packageId: packageId,
        isEmbedded: urlParams.isEmbedded
      }
    }
    return loadDataPackage(packageId, urlParams);
  }

  return Promise.reject(new Error('No packages available'));
}

function getAvailableSorting(state) {
  var packageModel = state.package;
  var params = state.params;
  return _.filter([
    _.find(packageModel.measures, function(item) {
      return params.measures.indexOf(item.key) >= 0;
    }),
    _.find(packageModel.dimensions, function(item) {
      return params.groups.indexOf(item.key) >= 0;
    })
  ]);
}

function getCurrencySign(state) {
  var measure = _.first(state.params.measures);
  measure = _.find(state.package.measures, {key: measure});
  return measure ? measure.currency : null;
}

// Helper functions for `buildBreadcrumbs()`
function getBaseFilters(filters, dimensions) {
  var result = {};

  _.each(filters, function(value, key) {
    var dimension = _.find(dimensions, {key: key});
    if (!dimension) {
      result[key] = value;
    }
  });

  return result;
}

function getSelectedFilters(state) {
  var params = state.params;
  var packageModel = state.package;

  return _.chain(params.filters)
    .map(function(valueKey, dimensionKey) {
      var dimension = _.find(packageModel.dimensions, {
        key: dimensionKey
      });
      var value = _.find(dimension.values, {
        key: valueKey
      });

      return {
        dimensionLabel: dimension.label,
        dimensionKey: dimension.key,
        valueLabel: value.label,
        valueKey: value.key
      };
    })
    .sortBy('dimensionLabel')
    .value();
}

function buildBreadcrumbs(state) {
  var params = state.params;
  var packageModel = state.package;
  var result = [];

  var groupKey = _.first(params.groups);
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    return !!_.find(hierarchy.dimensions, {key: groupKey});
  });

  if (hierarchy) {
    var originalFilters = params.filters;
    var baseFilters = getBaseFilters(params.filters, hierarchy.dimensions);
    var currentDimension = _.first(hierarchy.dimensions);
    result.push({
      label: hierarchy.label,
      groups: [currentDimension.key],
      filters: _.clone(baseFilters)
    });

    _.each(hierarchy.dimensions, function(dimension) {
      if (dimension.key != currentDimension.key) {
        var value = _.find(currentDimension.values, {
          key: originalFilters[currentDimension.key]
        });
        if (value) {
          baseFilters[currentDimension.key] = value.key;

          result.push({
            label: value.label,
            groups: [dimension.key],
            filters: _.clone(baseFilters)
          });
        }
      }

      currentDimension = dimension;
      // Break on current group
      if (dimension.key == groupKey) {
        return false;
      }
    });
  }

  return result;
}

module.exports.params = stateParams;
module.exports.history = history;
module.exports.loadDataPackages = loadDataPackages;
module.exports.loadDataPackage = loadDataPackage;
module.exports.getInitialState = getInitialState;
module.exports.fullyPopulateModel = fullyPopulateModel;
module.exports.getAvailableSorting = getAvailableSorting;
module.exports.getCurrencySign = getCurrencySign;
module.exports.getSelectedFilters = getSelectedFilters;
module.exports.buildBreadcrumbs = buildBreadcrumbs;
