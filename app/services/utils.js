'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Cache = require('lru-cache');
require('isomorphic-fetch');

var cache = new Cache({
  max: 500,
  maxAge: 1000 * 60 * 60
});

function dataPackageToMetaData(dataPackage) {
  if (!_.isObject(dataPackage) || !_.isString(dataPackage.name)) {
    return {};
  }
  return {
    id: dataPackage.owner + ':' + dataPackage.name,
    title: dataPackage.title || dataPackage.name || '',
    description: dataPackage.description || ''
  };
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
      console.trace(error);
      return null;  // On error, return nothing ('no metadata')
    })
    .then(dataPackageToMetaData)
    .then(function(result) {
      cache.set(dataPackageUrl, result);
      return result;
    });
}

module.exports.getDataPackageMetaData = getDataPackageMetaData;
