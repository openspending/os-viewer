'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('Application')
  .filter('join', [
    function() {
      return function(input, separator) {
        if (_.isArray(input)) {
          return _.filter(input).join(separator || ', ');
        }
        return input;
      };
    }
  ]);
