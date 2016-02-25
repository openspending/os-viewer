'use strict';

var Promise = require('bluebird');
require('isomorphic-fetch');

var _cache = {};

module.exports = {
  get: function(url) {
    if (_cache[url]) {
      return Promise.resolve(_cache[url]);
    } else {
      return fetch(url).then(function(response) {
        return response.text();
      }).then(function(text) {
        _cache[url] = text;
        return text;
      });
    }
  },
  getJson: function(url) {
    return this.get(url).then(JSON.parse);
  }
};
