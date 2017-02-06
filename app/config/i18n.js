'use strict';

var _ = require('lodash');
var Polyglot = require('node-polyglot');

module.exports.init = function(lang) {
  var translations = require('./translations.json');
  var localeParts = lang ? lang.split('_') : [];
  var strings;
  if (localeParts.length > 1) {
    strings = _.extend({}, translations.en, translations[localeParts[0]],
      translations[lang]);
  } else {
    strings = _.extend({}, translations.en, translations[lang]);
  }
  var polyglot = new Polyglot();
  polyglot.extend(strings);
  return polyglot.t.bind(polyglot);
};

