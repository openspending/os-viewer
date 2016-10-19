'use strict';

var url = require('url');
var qs = require('qs');
var _ = require('lodash');
var Promise = require('bluebird');
var dataPackageApi = require('../data-package-api');
var stateParams = require('./params');
var history = require('./history');
var visualizationsService = require('../visualizations');

var maxDimensionValuesForColumns = 50;

function getHierarchiesWithLimitedDimensionValues(hierarchies, minValueCount,
  maxValueCount) {
  return _.chain(hierarchies)
    .map(function(hierarchy) {
      var result = _.extend({}, hierarchy);
      result.dimensions = _.filter(hierarchy.dimensions,
        function(dimension) {
          var n = dimension.values.length;
          return (n >= minValueCount) && (n <= maxValueCount);
        });
      if (result.dimensions.length > 0) {
        return result;
      }
    })
    .filter()
    .value();
}

function loadDataPackages(authToken) {
  return dataPackageApi.getDataPackages(authToken);
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
      };
    });
}

function fullyPopulateModel(state) {
  return dataPackageApi.loadDimensionsValues(state.package)
    .then(function(packageModel) {
      packageModel.columnHierarchies =
        getHierarchiesWithLimitedDimensionValues(packageModel.hierarchies,
          1, maxDimensionValuesForColumns);
      // Get some special hierarchies
      packageModel.seriesHierarchies = getHierarchiesWithLimitedDimensionValues(
        packageModel.hierarchies, 1, 10);
      // Update dateTime hierarchies list
      packageModel.dateTimeHierarchies =
        getHierarchiesWithLimitedDimensionValues(
          packageModel.dateTimeHierarchies, 2, Number.MAX_VALUE);
      return state;
    });
}

function partiallyPopulateModel(state) {
  var selectedGroup = _.first(state.params.groups);
  if (selectedGroup) {
    var hierarchy = _.find(state.package.hierarchies, function(hierarchy) {
      return !!_.find(hierarchy.dimensions, {
        key: selectedGroup
      });
    });
    if (hierarchy) {
      return dataPackageApi.loadDimensionsValues(state.package,
        hierarchy.dimensions)
        .then(function(packageModel) {
          return state;
        });
    }
  }
  return Promise.resolve(state);
}

function parseUrl(pageUrl) {
  var urlParams = url.parse(pageUrl || '');
  urlParams.query = qs.parse(urlParams.query);

  var path = urlParams.pathname || '';
  if (path.substr(0, 1) == '/') {
    path = path.substr(1, path.length);
  }
  if (path.substr(-1, 1) == '/') {
    path = path.substr(0, path.length - 1);
  }
  path = path.split('/');

  var result = urlParams.query;
  result.packageId = null;

  if (path.length == 1) {
    result.packageId = path[0];
  }
  if ((path.length == 2) && (path[0] == 'embed')) {
    result.packageId = path[1];
  }
  if ((path.length == 3) && (path[0] == 'embed')) {
    result.packageId = path[2];
    var visualization = visualizationsService.findVisualization({
      embed: path[1]
    });
    if (visualization) {
      result.visualizations = [visualization.id];
    }
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

function getInitialState(dataPackages, pageUrl) {
  var urlParams = parseUrl(pageUrl);

  var packageId = choosePackage(dataPackages, urlParams.packageId);
  if (packageId) {
    // If package identified by url does not exist -
    // invalidate other params from url
    if (packageId != urlParams.packageId) {
      urlParams = {
        packageId: packageId
      };
    }
    return loadDataPackage(packageId, urlParams);
  }

  return Promise.reject(new Error('No packages available'));
}

function getAvailableSorting(state) {
  var packageModel = state.package;
  var params = state.params;
  return _.chain([
      _.find(packageModel.measures, function(item) {
        return params.measures.indexOf(item.key) >= 0;
      }),
      _.find(packageModel.dimensions, function(item) {
        return params.groups.indexOf(item.key) >= 0;
      })
    ])
    .filter()
    .map(function(item) {
      return {
        label: item.label,
        key: item.sortKey || item.key
      };
    })
    .value();
}

function getCurrencySign(state) {
  var measure = _.first(state.params.measures);
  measure = _.find(state.package.measures, {key: measure});
  return measure ? measure.currency : null;
}

// Helper functions for `buildBreadcrumbs()`
function getBaseFilters(filters, dimensions) {
  var result = {};

  _.each(filters, function(values, key) {
    var dimension = _.find(dimensions, {key: key});
    if (!dimension) {
      result[key] = values;
    }
  });

  return result;
}

function getSelectedFilters(state) {
  var params = state.params;
  var packageModel = state.package;

  return _.chain(params.filters)
    .map(function(valueKeys, dimensionKey) {
      var dimension = _.find(packageModel.dimensions, {
        key: dimensionKey
      });
      var values = _.filter(dimension.values, function(item) {
        return !!_.find(valueKeys, function(key) {
          return key == item.key;
        });
      });

      return {
        dimensionLabel: dimension.label,
        dimensionKey: dimension.key,
        valueLabel: _.map(values, function(item) { return item.label; }),
        valueKey: _.map(values, function(item) { return item.key; })
      };
    })
    .filter()
    .sortBy('dimensionLabel')
    .value();
}

function buildBreadcrumbs(state) {
  var params = state.params;
  var packageModel = state.package;
  var result = [];

  var groupKey = null;
  if (_.isArray(params.drilldown) && (params.drilldown.length > 0)) {
    groupKey = _.first(params.drilldown).dimension;
  } else {
    groupKey = _.first(params.groups);
  }
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    return !!_.find(hierarchy.dimensions, {key: groupKey});
  });

  if (hierarchy) {
    result.push({
      label: hierarchy.label,
      index: 0
    });
    _.each(params.drilldown, function(item, index) {
      var dimension = _.find(hierarchy.dimensions, {key: item.dimension});
      if (dimension) {
        var value = _.find(dimension.values, {key: item.filter});
        if (value) {
          result.push({
            label: value.label,
            index: index + 1
          });
        }
      }
    });
  }

  return result;
}

function translateHierarchies(state, i18n) {
  _.forEach(state.package.hierarchies, function(hierarchy) {
    hierarchy.label = i18n(hierarchy.label);
  });
}

// embedParams is an object with options for creating embed url.
// Allowed properties:
// `visualization`: value from `<visualization>.embed` property;
// `protocol`, `host`, `port` - values to be appended to url;
// `base` - base url to be added to `path` part
function buildUrl(params, embedParams) {
  var query = {};

  if (!!params.lang) {
    query.lang = params.lang;
  }
  if (!!params.theme) {
    query.theme = params.theme;
  }

  if (params.measures.length > 0) {
    query.measure = _.first(params.measures);
  }
  _.each(['groups', 'series', 'rows', 'columns'], function(axis) {
    if (params[axis].length > 0) {
      query[axis] = params[axis];
    }
  });
  query.filters = _.cloneDeep(params.filters);
  if (_.isArray(params.drilldown)) {
    _.each(params.drilldown, function(item) {
      // When drilldown - replace filters for all drilldown
      // dimensions: they cannot be selected by user, but ensure
      // that there are no any garbage
      query.filters[item.dimension] = [item.filter];
    });
  }

  if (params.orderBy.key) {
    query.order = params.orderBy.key + '|' + params.orderBy.direction;
  }
  if ((params.visualizations.length > 0) && !embedParams) {
    query.visualizations = params.visualizations;
  }

  var path = '/' + params.packageId;
  if (embedParams) {
    path = '/embed/' + embedParams.visualization + path;
    if (embedParams.base) {
      var base = embedParams.base;
      if (base.substr(0, 1) != '/') {
        base = '/' + base;
      }
      if (base.substr(-1, 1) == '/') {
        base = base.substr(0, base.length - 1);
      }
      path = base + path;
    }
  }

  embedParams = embedParams || {}; // to simplify next lines

  return url.format({
    protocol: embedParams.protocol,
    hostname: embedParams.host,
    port: embedParams.port,
    pathname: path,
    search: qs.stringify(query, {
      arrayFormat: 'brackets',
      encode: false
    })
  });
}

function hasDrillDownVisualizations(params) {
  var result = false;
  if (_.isArray(params.visualizations)) {
    var visualizations = visualizationsService.getVisualizationsByIds(
      params.visualizations);
    _.each(visualizations, function(item) {
      if (item.type == 'drilldown') {
        result = true;
        return true;
      }
    });
  }
  return result;
}

module.exports.params = stateParams;
module.exports.history = history;
module.exports.loadDataPackages = loadDataPackages;
module.exports.loadDataPackage = loadDataPackage;
module.exports.parseUrl = parseUrl;
module.exports.getInitialState = getInitialState;
module.exports.fullyPopulateModel = fullyPopulateModel;
module.exports.partiallyPopulateModel = partiallyPopulateModel;
module.exports.getAvailableSorting = getAvailableSorting;
module.exports.getCurrencySign = getCurrencySign;
module.exports.getSelectedFilters = getSelectedFilters;
module.exports.buildBreadcrumbs = buildBreadcrumbs;
module.exports.buildUrl = buildUrl;
module.exports.translateHierarchies = translateHierarchies;
module.exports.hasDrillDownVisualizations = hasDrillDownVisualizations;
