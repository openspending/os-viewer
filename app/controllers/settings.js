'use strict';

module.exports = function(req, res) {
  var config = req.app.get('config');
  res.json({
    api: config.get('api'),
    search: config.get('search'),
    dataMine: config.get('dataMine'),
    osExplorerUrl: config.get('osExplorerUrl'),
    osConductorUrl: config.get('osConductorUrl')
  });
};

