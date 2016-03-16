'use strict';

module.exports.main = function(req, res) {
  var config = req.app.get('config');
  req.isEmbedded = req.isEmbedded || false;

  var template = (req.isEmbedded)? 'pages/embedded.html' : 'pages/main.html';

  res.render(template, {
    title: 'Open Spending Viewer',
    basePath: config.get('basePath'),
    isEmbedded: req.isEmbedded
  });
};

