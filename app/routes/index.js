'use strict';

var express = require('express');
var controllers = require('../controllers');

module.exports = function() {
  // eslint-disable-next-line new-cap
  var router = express.Router();

  router.get('/settings.json', controllers.settings);
  router.get('/shorturl', controllers.shortUrl);

  router.get('/', controllers.main);

  // eslint-disable-next-line max-len
  router.get(/^\/embed\/(treemap|piechart|barchart|linechart|bubbletree|table|map|pivottable|radar|sankey)\/(.*)/, function(req, res, next) {
    req.isEmbedded = true;
    req.view = 'embedded';
    next();
  }, controllers.main);

  router.get(/^\/embed\/(.*)\//, function(req, res, next) {
    res.status(404).send('Can not find view.');
  }, controllers.main);

  router.get(/^\/embed\/(.*)/, function(req, res, next) {
    req.isEmbedded = true;
    req.view = 'main';
    next();
  }, controllers.main);

  router.get(/^\/(.*)/, controllers.main);

  return router;
};
