'use strict';

var OSStyles = require('os-styles');
var themes = {
  default: require('./default'),
  wacky: require('./wacky')
};

module.exports = new OSStyles(themes);
