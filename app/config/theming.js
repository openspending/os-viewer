'use strict';

var themes = require('require-dir-all')('./themes');
var _ = require('lodash');

module.exports.get = function(theme) {
  return _.merge({}, themes.default, themes[theme]);
};

