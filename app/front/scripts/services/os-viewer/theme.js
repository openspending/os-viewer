'use strict';

var theme = {};

function setTheme(_theme) {
  theme = _theme;
}

function getTheme() {
  return theme;
}

module.exports.set = setTheme;
module.exports.get = getTheme;
