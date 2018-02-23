'use strict';

var _ = require('lodash');
var i18n = require('../config/i18n');
var themes = require('../config/themes');
var utils = require('../services/utils');

function getBasePath(config) {
  var result = config.get('basePath');
  if (_.isUndefined(result) || _.isNull(result) || (result == '')) {
    return '';
  }
  result = '' + result;
  if (result.substr(0, 1) != '/') {
    result = '/' + result;
  }
  if (result.substr(-1, 1) == '/') {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

function getRequestURI(req) {
  return process.env.OS_BASE_URL || req.protocol + '://' + req.get('host') + req.originalUrl;
}

module.exports = function(req, res) {
  var config = req.app.get('config');

  var viewFileName = 'pages/' + (req.view || 'main') + '.html';
  var $t = i18n.init(req.query.lang);

  var packageId = _.chain(req.params).values().last().value();
  var dataPackageUrl = config.get('api:url') + '/info/' +
    packageId + '/package';

  utils.getDataPackageMetaData(dataPackageUrl)
    .then(function(metadata) {
      res.render(viewFileName, {
        title: $t('Open Spending Viewer'),
        basePath: getBasePath(config),
        isEmbedded: req.isEmbedded,
        theme: themes.getTheme(req.query.theme),
        shareMetadata: _.extend({
          title: $t('Open Spending Viewer'),
          description: $t('Open Spending Viewer'),
          url: getRequestURI(req)
        }, metadata)
      });
    });
};
