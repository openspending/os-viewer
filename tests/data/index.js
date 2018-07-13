'use string';

var _ = require('lodash');
var nock = require('nock');
var dataPackageApi =
  require('../../app/front/scripts/services/data-package-api');

module.exports.settings = require('./settings.json');
module.exports.dataPackages = require('./datapackages.json');
module.exports.loadedPackages = require('./loaded-packages');

module.exports.package1Package = require('./package1-datapackage.json');
module.exports.package1Model = require('./package1-model.json');
module.exports.package1Members = require('./package1-members.json');
module.exports.package1PackageModelBare =
  require('./package1-packagemodel-bare');
module.exports.package1PackageModel = require('./package1-packagemodel');
module.exports.package1InitialState = require('./package1-initial-state');

module.exports.testUserId = 'test-user-id';

module.exports.initMocks = function() {
  var data = module.exports;

  dataPackageApi.defaultSettingsUrl = 'http://example.com/settings.json';
  // Settings
  nock('http://example.com')
    .persist()
    .get('/settings.json')
    .reply(200, data.settings, {'access-control-allow-origin': '*'});

  // List of data packages
  nock('http://search.example.com')
    .persist()
    .get('/?package.owner=' +
      encodeURIComponent(JSON.stringify(module.exports.testUserId)) +
      '&size=10000')
    .reply(200, data.dataPackages, {'access-control-allow-origin': '*'});

  nock('http://search.example.com')
    .persist()
    .get('/?size=10000')
    .reply(200, data.dataPackages, {'access-control-allow-origin': '*'});

  // Data package, model and model members
  nock('http://api.example.com')
    .persist()
    .get('/info/Package1/package')
    .reply(200, data.package1Package, {'access-control-allow-origin': '*'});
  nock('http://api.example.com')
    .persist()
    .get('/cubes/Package1/model/')
    .reply(200, data.package1Model, {'access-control-allow-origin': '*'});

  _.each(data.package1Members, function(member) {
    nock('http://api.example.com')
      .persist()
      .get('/cubes/Package1/members/' + member.key)
      .reply(200, member.data, {'access-control-allow-origin': '*'});
  });
};
