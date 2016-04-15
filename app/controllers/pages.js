'use strict';

var _ = require('lodash');
var paramParser = require('../front/scripts/components/url-param-parser');

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

module.exports.main = function(req, res) {
  var config = req.app.get('config');
  req.isEmbedded = req.isEmbedded || false;

  res.render('pages/main.html', {
    title: 'Open Spending Viewer',
    basePath: getBasePath(config),
    isEmbedded: req.isEmbedded
  });
};

module.exports.embedded = function(req, res) {
  var config = req.app.get('config');
  req.isEmbedded = req.isEmbedded || false;
  req.cube = req.cube || '';
  req.view = req.view || 'treemap';

  var params = paramParser.parse(req.query);

  var cut = _.map(params.filters, function(value, key) {
    return key + ':"' + value + '"';
  });

  res.render('pages/embedded.html', {
    basePath: getBasePath(config),
    cube: req.cube,
    view: req.view,
    apiUrl: config.get('api').url,
    cosmoUrl: config.get('api').cosmoUrl,
    params: JSON.stringify({
      aggregates: params.measure,
      group: params.groups,
      series: params.series,
      filter: cut
    }),
    paramsPivot: JSON.stringify({
      aggregates: params.measure,
      rows: params.rows,
      cols: params.columns,
      filter: cut
    })
  });
};
