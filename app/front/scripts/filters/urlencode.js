'use strict';

var ngModule = require('../module');

ngModule.filter('urlencode', [
  function() {
    return encodeURIComponent;
  }
]);
