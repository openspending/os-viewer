'use strict';

require('isomorphic-fetch');
var Promise = require('bluebird');

var cache = {};

module.exports = {
  get: function(url) {
    if (!cache[url]) {
      cache[url] = fetch(url).then(function(response) {
        return response.text();
      });
    }
    return new Promise(function(resolve, reject) {
      cache[url].then(resolve).catch(reject);
    });
  },
  getJson: function(url) {
    return this.get(url).then(JSON.parse);
  }
};
