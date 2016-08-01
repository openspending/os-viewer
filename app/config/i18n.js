'use strict';

var Polyglot = require('node-polyglot');

module.exports.init = function(lang) {
  var translations = require('./translations.json');
  var strings = translations[lang];
  if (!strings) {
    strings = translations.en;
  }
  var polyglot = new Polyglot();
  polyglot.extend(strings);
  return polyglot.t.bind(polyglot);
};

