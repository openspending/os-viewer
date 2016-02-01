'use strict';

module.exports.main = function(req, res) {
  res.render('pages/main.html', {
    title: 'Open Spending Viewer'
  });
};

