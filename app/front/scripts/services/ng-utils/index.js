'use strict';

var _ = require('lodash');
var angular = require('angular');

var q = null;
var timeout = null;

module.exports.$q = function(promise) {
  return q(function(resolve, reject) {
    promise.then(resolve).catch(reject);
  }).then(function(data) {
    return data;
  }).catch(function(error) {
    console.trace(error);
  });
};

module.exports.$digest = function(callback) {
  timeout(function() {
    if (_.isFunction(callback)) {
      callback();
    }
  }, 0);
};

angular.module('ng').run([
  '$q', '$timeout',
  function($q, $timeout) {
    q = $q;
    timeout = $timeout;
  }
]);
