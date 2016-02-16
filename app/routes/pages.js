'use strict';

var express = require('express');
var pages = require('../controllers/pages');
var settings = require('../controllers/settings');

module.exports = function() {
  var router = express.Router();

  router.get('/settings.json', settings.main);

  router.get('/', pages.main);
  router.get(/embed\/(.*)/, function(req, res, next){
    req.isEmbedded = true;
    next();
  }, pages.main);
  router.get(/(.*)/, pages.main);

  return router;
};
