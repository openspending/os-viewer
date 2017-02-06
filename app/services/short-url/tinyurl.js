'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Cache = require('lru-cache');
require('isomorphic-fetch');

var endpoint = 'https://tinyurl.com/api-create.php';

var cache = new Cache({
  // 5k entries - not too much since every change entry is just a pair of URLs
  max: 5000,
  // short URLs may never change at all; but let they live at most 7 days
  maxAge: 1000 * 60 * 60 * 24 * 7
});

function handleFetchResponse(response) {
  if (response.status != 200) {
    throw new Error('Failed loading data from ' + response.url);
  }
  return response.text();
}

function getShortUrl(url) {
  var shortUrl = cache.get(url);
  if (_.isString(shortUrl)) {
    return Promise.resolve(shortUrl);
  }

  var options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    body: 'url=' + encodeURIComponent(url)
  };
  return fetch(endpoint, options)
    .then(handleFetchResponse)
    .then(function(shortUrl) {
      cache.set(url, shortUrl);
      return shortUrl;
    });
}

module.exports = function() {
  return getShortUrl;
};
