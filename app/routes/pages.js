'use strict';

var express = require('express');
var pages = require('../controllers/pages');

module.exports = function() {
  var router = express.Router();

  router.get('/', pages.main);

  return router;
};
