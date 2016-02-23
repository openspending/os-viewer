'use strict';

var Promise = require('bluebird');
require('isomorphic-fetch');

var _cache = {};

module.exports = {
  get: function(url) {
    if (_cache[url]) {
      return new Promise(function(resolve, reject) {
        resolve(_cache[url]);
      });
    } else {
      return fetch(url).then(function(response) {
        return response.text();
      }).then(function(text) {
        _cache[url] = text;
        return text;
      });
    }
  }
};
