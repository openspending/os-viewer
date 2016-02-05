'use strict';

var Promise = require('bluebird');
require('isomorphic-fetch');

var url = 'https://rawgit.com/openspending/fiscal-data-package-demos/' +
  'master/boost-moldova/data/boost-moldova.geojson';

function loadGeoJson(countryCode) {
  return fetch(url)
    .then(function(response) {
      if (response.status != 200) {
        throw 'Failed loading data from ' + response.url;
      }
      return response.text().then(JSON.parse);
    });
}

module.exports.loadGeoJson = loadGeoJson;
