'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Cache = require('lru-cache');
require('isomorphic-fetch');

var cache = new Cache({
  max: 500,  // 500 entries
  maxAge: 1000 * 60 * 60  // 1 hour
});

function dataPackageToMetaData(dataPackage) {
  var result = {};

  dataPackage = _.extend({}, dataPackage);  // Ensure it is an object

  if (dataPackage.name) {
    result.id = dataPackage.owner ? dataPackage.owner + ':' + dataPackage.name :
      dataPackage.name;
    result.title = dataPackage.title || dataPackage.name;
    if (dataPackage.description) {
      result.description = dataPackage.description;
    }
  }

  return result;
}

function getDataPackageMetaData(dataPackageUrl) {
  var entry = cache.get(dataPackageUrl);
  if (_.isObject(entry)) {
    return Promise.resolve(entry);
  }
  return fetch(dataPackageUrl)
    .then(function(response) {
      if (response.status != 200) {
        throw new Error('Failed loading data from ' + response.url);
      }
      return response.json();
    })
    .catch(function(error) {
      return null;  // On error, return nothing ('no metadata')
    })
    .then(dataPackageToMetaData)
    .then(function(result) {
      cache.set(dataPackageUrl, result);
      return result;
    });
}

module.exports.getDataPackageMetaData = getDataPackageMetaData;
