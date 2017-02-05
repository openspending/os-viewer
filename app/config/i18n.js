'use strict';

var _ = require('lodash');
var Polyglot = require('node-polyglot');

module.exports.init = function(lang) {
  var translations = require('./translations.json');
  var locale_parts = lang ? lang.split('_') : [];
  var strings;
  if (locale_parts.length > 1) {
    strings = _.extend({}, translations.en, translations[locale_parts[0]], translations[lang]);
  } else {
    strings = _.extend({}, translations.en, translations[lang]);
  }
  var polyglot = new Polyglot();
  polyglot.extend(strings);
  return polyglot.t.bind(polyglot);
};

