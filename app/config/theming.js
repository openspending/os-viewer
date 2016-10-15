'use strict';

var themes = require('require-dir-all')('./themes');
var deepAssign = require('deep-assign');

module.exports.get = function(theme) {
  return deepAssign({}, themes.default, themes[theme])
};

