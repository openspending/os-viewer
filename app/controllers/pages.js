'use strict';

module.exports.main = function(req, res) {
  var config = req.app.get('config');
  res.render('pages/main.html', {
    title: 'Open Spending Viewer',
    basePath: config.get('basePath')
  });
};

