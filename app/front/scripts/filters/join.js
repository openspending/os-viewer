'use strict';

var _ = require('lodash');
var ngModule = require('../module');

ngModule.filter('join', [
  function() {
    return function(input, separator) {
      if (_.isArray(input)) {
        return _.filter(input).join(separator || ', ');
      }
      return input;
    };
  }
]);
