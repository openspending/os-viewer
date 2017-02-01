'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('Application')
  .filter('urlencode', [
    function() {
      return encodeURIComponent;
    }
  ]);
