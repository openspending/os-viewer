'use strict';

var _ = require('lodash');

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

  var viewFileName = 'pages/' +  (req.view || 'main') + '.html';

  res.render(viewFileName, {
    title: 'Open Spending Viewer',
    basePath: getBasePath(config),
    isEmbedded: req.isEmbedded
  });
};
