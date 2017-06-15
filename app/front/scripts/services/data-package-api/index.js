'use strict';

var url = require('url');
var _ = require('lodash');
var Promise = require('bluebird');
var downloader = require('../downloader');

module.exports.apiConfig = {};
module.exports.searchConfig = {};
module.exports.osExplorerUrl = null;
module.exports.defaultSettingsUrl = 'settings.json';

function loadConfig(settingsUrl) {
  var url = settingsUrl || module.exports.defaultSettingsUrl;
  return downloader.getJson(url).then(function(config) {
    module.exports.apiConfig = config.api;
    module.exports.searchConfig = config.search;
    module.exports.dataMineConfig = config.dataMine;
    module.exports.osExplorerUrl = config.osExplorerUrl;
    return config;
  });
}

function getDataPackages(authToken, packageId, userId) {
  return loadConfig().then(function() {
    var searchConfig = module.exports.searchConfig;
    var url = searchConfig.url + '?size=10000';
    if (authToken) {
      url += '&jwt=' + encodeURIComponent(authToken);
    }
    if (packageId) {
      url += '&id=' + encodeURIComponent(JSON.stringify(packageId));
    }
    if (userId) {
      url += '&package.owner=' + encodeURIComponent(JSON.stringify(userId));
    }
    return downloader.getJson(url).then(function(packages) {
      return _.chain(packages)
        .filter(function(dataPackage) {
          var result = true;
          if (packageId && (dataPackage.id != packageId)) {
            result = false;
          }
          if (userId && (dataPackage.package.owner != userId)) {
            result = false;
          }
          return result;
        })
        .map(function(dataPackage) {
          dataPackage.author = _.chain(dataPackage.package.author)
            .split(' ')
            .dropRight(1)
            .join(' ')
            .value();
          return {
            id: dataPackage.id,
            author: dataPackage.author,
            title: dataPackage.package.title,
            description: dataPackage.package.description
          };
        })
        .value();
    });
  });
}

function getDataPackageMetadata(dataPackage, model) {
  // jscs:disable
  var originUrl = dataPackage.__origin_url ? dataPackage.__origin_url :
    [
      'http://datastore.openspending.org',
      dataPackage.owner,
      dataPackage.name,
      'datapackage.json'
    ].join('/');
  // jscs:enable

  return {
    name: dataPackage.name,
    title: dataPackage.title,
    description: dataPackage.description,
    owner: dataPackage.owner,
    author: dataPackage.author,
    countryCode: (function(countryCode) {
      var result = _.isArray(countryCode) ? _.first(countryCode) : countryCode;
      return _.isString(result) ? result.toUpperCase() : undefined;
    })(dataPackage.countryCode),
    // jscs:disable
    factTable: model ? model.fact_table : null,
    // jscs:enable
    url: originUrl,
    resources: _.chain(dataPackage.resources)
      .map(function(resource) {
        var resourceUrl = null;
        if (resource.url) {
          resourceUrl = resource.url;
        }
        if (resource.path) {
          resourceUrl = url.resolve(originUrl, resource.path);
        }

        if (resourceUrl) {
          return {
            name: resource.name,
            url: resourceUrl
          };
        }
      })
      .filter()
      .value()
  };
}

function getMeasuresFromModel(dataPackage, model) {
  // Populate some additional model properties
  var measureMappings = null;
  if (_.isObject(dataPackage.model)) {
    if (_.isObject(dataPackage.model.measures)) {
      measureMappings = dataPackage.model.measures;
    }
  }

  return _.chain(model.aggregates)
    .filter(function(aggregate) {
      return aggregate.measure && model.measures[aggregate.measure];
    })
    .map(function(aggregate) {
      var result = {};
      result.id = aggregate.measure;
      result.key = aggregate.ref;
      result.label = aggregate.label;

      if (measureMappings) {
        var measure = model.measures[aggregate.measure];
        // jscs:disable
        var originalMeasure = measureMappings[measure.orig_measure];
        // jscs:enable
        if (originalMeasure) {
          result.currency = originalMeasure.currency;
        }
      }

      return result;
    })
    .sortBy(function(item) {
      return item.label;
    })
    .value();
}

function getDimensionsFromModel(dataPackage, model) {
  // Populate some additional model properties
  var dimensionMappings = null;
  if (_.isObject(dataPackage.model)) {
    if (_.isObject(dataPackage.model.dimensions)) {
      dimensionMappings = dataPackage.model.dimensions;
    }
  }

  return _.chain(model.dimensions)
    .map(function(dimension, index) {
      var result = {};

      result.id = index;
      // jscs:disable
      result.key = dimension.key_ref;
      result.label = dimension.label;
      result.valueRef = dimension.label_ref || dimension.key_ref;
      result.sortKey = dimension.label_ref || dimension.key_ref;
      // jscs:enable
      result.hierarchy = dimension.hierarchy;

      if (dimensionMappings) {
        // jscs:disable
        var originalDimension = dimensionMappings[dimension.orig_dimension];
        // jscs:enable

        if (originalDimension) {
          result.dimensionType = originalDimension.dimensionType;
        }
      }
      return result;
    })
    .sortBy(function(item) {
      return item.label;
    })
    .value();
}

function loadDimensionValues(packageId, dimension, filters) {
  return loadConfig().then(function() {
    var apiConfig = module.exports.apiConfig;

    var cut = _.extend({}, filters);
    delete cut[dimension.key];
    cut = serializeCut(cut).join('|');
    if (cut != '') {
      cut = '?cut=' + encodeURIComponent(cut);
    }

    var url = apiConfig.url + '/cubes/' +
      encodeURIComponent(packageId) + '/members/' +
      encodeURIComponent(dimension.id) + cut;

    return downloader.getJson(url).then(function(results) {
      return _.chain(results.data)
        .map(function(value) {
          var key = value[dimension.key];
          var label = value[dimension.valueRef];
          if (!!key) {
            return {
              key: key,
              label: (label && label != key) ? key + ' - ' + label : key
            };
          }
        })
        .filter()
        .value();
    });
  });
}

function mapDimensionValues(dimension, rawValues) {
  return _.chain(rawValues)
    .map(function(value) {
      var key = value[dimension.key];
      var label = value[dimension.valueRef];
      if (!!key) {
        return {
          key: key,
          label: (label && label != key) ? key + ' - ' + label : key
        };
      }
    })
    .filter()
    .sortBy('label')
    .value();
}

// `dimensions` is optional; if omitted - all dimensions will be populated
function loadDimensionsValues(packageModel, dimensions, filters) {
  dimensions = _.isArray(dimensions) ? dimensions : packageModel.dimensions;
  if (dimensions.length == 0) {
    return Promise.resolve(packageModel);
  }
  filters = _.extend({}, filters);
  var apiConfig = null;

  return loadConfig()
    .then(function() {
      apiConfig = module.exports.apiConfig;

      // Prepare dimensions that are mentioned in filters but
      // have no values yet
      var promises = _.chain(dimensions)
        .map(function(dimension) {
          var isFiltered = (filters[dimension.key] || []).length > 0;
          var hasValues = _.isArray(dimension.values);
          if (isFiltered && !hasValues) {
            var url = apiConfig.url + '/cubes/' +
              encodeURIComponent(packageModel.id) + '/members/' +
              encodeURIComponent(dimension.id);
            return downloader.getJson(url).then(function(result) {
              dimension.values = mapDimensionValues(dimension, result.data);
              return result;
            });
          }
        })
        .filter()
        .value();

      return Promise.all(promises);
    })
    .then(function() {
      var promises = _.map(dimensions, function(dimension) {
        var cut = _.clone(filters);
        delete cut[dimension.key];
        cut = serializeCut(cut).join('|');
        if (cut != '') {
          cut = '?cut=' + encodeURIComponent(cut);
        }

        var url = apiConfig.url + '/cubes/' +
          encodeURIComponent(packageModel.id) + '/members/' +
          encodeURIComponent(dimension.id) + cut;
        return downloader.getJson(url).then(function(result) {
          // Save current values; after loading new values, some of selected
          // values may be missed in the new set, so we'll need to add them
          result.savedValues = dimension.values;
          result.filters = filters[dimension.key] || [];
          result.dimension = dimension;
          return result;
        });
      });

      return Promise.all(promises).then(function(results) {
        _.each(results, function(result) {
          var dimension = result.dimension;
          dimension.values = mapDimensionValues(dimension, result.data);

          // Add missing selected values
          _.chain(result.filters)
            .difference(_.map(dimension.values, function(value) {
              return value.key;
            }))
            .each(function(key) {
              var value = _.find(result.savedValues, {key: key});
              if (value) {
                dimension.values.push(value);
              }
            })
            .value();

          dimension.values = _.sortBy(dimension.values, 'label');
        });
        return packageModel;
      });
    });
}

function getHierarchiesFromModel(dataPackage, model, packageModel) {
  return _.chain(model.hierarchies)
    .map(function(hierarchy, index) {
      return {
        id: index,
        key: index,
        label: hierarchy.label,
        dimensions: _.map(hierarchy.levels, function(dimensionId) {
          return _.find(packageModel.dimensions, function(dimension) {
            return dimension.id == dimensionId;
          });
        })
      };
    })
    .sortBy(function(item) {
      return item.label;
    })
    .value();
}

function filterHierarchiesByType(hierarchies, type) {
  return _.chain(hierarchies)
    .map(function(hierarchy) {
      var result = _.extend({}, hierarchy);
      result.dimensions = _.filter(hierarchy.dimensions,
        function(item) {
          return item.dimensionType == type;
        });
      if (result.dimensions.length > 0) {
        return result;
      }
    })
    .filter()
    .value();
}

function createPackageModel(packageId, dataPackage, model) {
  var packageModel = {
    id: packageId,
    meta: getDataPackageMetadata(dataPackage, model),
    measures: getMeasuresFromModel(dataPackage, model),
    dimensions: getDimensionsFromModel(dataPackage, model)
  };

  packageModel.hierarchies = getHierarchiesFromModel(dataPackage,
    model, packageModel);
  packageModel.columnHierarchies = packageModel.hierarchies;
  packageModel.locationHierarchies = filterHierarchiesByType(
    packageModel.hierarchies, 'location');
  packageModel.dateTimeHierarchies = filterHierarchiesByType(
    packageModel.hierarchies, 'datetime');

  return packageModel;
}

// If loadBareModel == true, this function will load only
// minimal amount of data required to build model structure.
// Data like dimension values will not be loaded.
function getDataPackage(packageId, loadBareModel) {
  return loadConfig().then(function() {
    var apiConfig = module.exports.apiConfig;

    var promises = [
      downloader.getJson(apiConfig.url + '/info/' +
        encodeURIComponent(packageId) + '/package'),
      downloader.getJson(apiConfig.url + '/cubes/' +
        encodeURIComponent(packageId) + '/model')
    ];

    return Promise.all(promises)
      .then(function(results) {
        return createPackageModel(packageId, results[0], results[1].model);
      })
      .then(function(packageModel) {
        if (loadBareModel) {
          return packageModel;
        }
        return loadDimensionsValues(packageModel);
      });
  });
}

function serializeCut(filters, drilldown) {
  // Add filters from drilldown, if any
  if (_.isArray(drilldown)) {
    filters = _.cloneDeep(filters);
    _.each(drilldown, function(item) {
      // When drilldown - replace filters for all drilldown
      // dimensions: they cannot be selected by user, but ensure
      // that there are no any garbage
      filters[item.dimension] = [item.filter];
    });
  }

  return _.chain(filters)
    .map(function(values, key) {
      return key + ':' + _.chain(values)
        .map(function(value) {
          return JSON.stringify(value);
        })
        .join(';')
        .value();
    })
    .value();
}

module.exports.serializeCut = serializeCut;
module.exports.loadConfig = loadConfig;
module.exports.getDataPackages = getDataPackages;
module.exports.getDataPackage = getDataPackage;
module.exports.loadDimensionValues = loadDimensionValues;
module.exports.loadDimensionsValues = loadDimensionsValues;
module.exports.createPackageModel = createPackageModel;
