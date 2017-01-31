'use strict';

var express = require('express');
var pages = require('../controllers/pages');
var settings = require('../controllers/settings');

module.exports = function() {
  // eslint-disable-next-line new-cap
  var router = express.Router();

  router.get('/settings.json', settings.main);

  router.get('/', pages.main);

  // eslint-disable-next-line max-len
  router.get(/embed\/(treemap|piechart|barchart|linechart|bubbletree|table|map|pivottable|radar|sankey)\/(.*)/, function(req, res, next) {
    req.isEmbedded = true;
    req.view = 'embedded';
    next();
  }, pages.main);

  router.get(/embed\/(.*)\//, function(req, res, next) {
    res.status(404).send('Can not find view.');
  }, pages.main);

  router.get(/embed\/(.*)/, function(req, res, next) {
    req.isEmbedded = true;
    req.view = 'main';
    next();
  }, pages.main);

  router.get(/(.*)/, pages.main);

  return router;
};
