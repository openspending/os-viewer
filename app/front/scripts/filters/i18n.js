'use strict';

var _ = require('lodash');
var i18n = require('../../../config/i18n');
var ngModule = require('../module');

var translate = (function() {
  var translate = _.identity;
  var result = function(input) {
    return translate(input);
  };
  result.setLanguage = function(language) {
    translate = i18n.init(language);
    return result;
  };
  return result;
})();

ngModule
  .filter('i18n', function() {
    return translate;
  })
  .service('i18n', function() {
    return translate;
  });
