'use strict';

var _ = require('lodash');
var shortUrl = require('../services/short-url').tinyUrl();

module.exports = function(req, res) {
  var url = req.query.url;
  if (!_.isString(url)) {
    return res.sendStatus(400);  // Bad request
  }
  shortUrl(url)
    .then(function(shortUrl) {
      return res.json({
        success: true,
        shortUrl: shortUrl,
        url: url
      });
    })
    .catch(function(error) {
      return res.json({
        success: false,
        url: url,
        error: error instanceof Error ? error.message : '' + error
      });
    });
};
