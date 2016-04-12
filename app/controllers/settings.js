'use strict';

module.exports.main = function(req, res) {
  var config = req.app.get('config');
  res.json({api: config.get('api'),
            search: config.get('search')});
};

