'use strict';

var theme = {};

function setTheme(value) {
  theme = value;
}

function getTheme() {
  return theme;
}

module.exports.set = setTheme;
module.exports.get = getTheme;
