/**
 * Created by Ihor Borysyuk on 11.02.16.
 */

'use strict';

module.exports.main = function(req, res) {
  var config = req.app.get('config');
  res.json({api: config.get('api')});
};

