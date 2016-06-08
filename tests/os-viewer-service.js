'use strict';

var nock = require('nock');
var assert = require('chai').assert;
var _ = require('lodash');

var apiConfig = {
  url: 'http://some-server-api.com'
};
var searchConfig = {
  url: 'http://some-other-server-api.com/search/package'
};

var osViewerService = require('../app/front/scripts/services/' +
  'os-viewer-service/')(apiConfig, searchConfig);
var api = require('../app/front/scripts/services/' +
  'data-package-api/')(apiConfig, searchConfig);

describe('osViewerService', function() {

  it('Should exists', function(done) {
    assert(_.isObject(osViewerService));
    assert(_.isFunction(osViewerService.getState));
    assert(_.isFunction(osViewerService.initState));
    done();
  });

  it('Should return current state', function(done) {
    osViewerService.initState({name: 'test'});
    var state = osViewerService.getState();
    assert.deepEqual(state, {name: 'test'});
    done();
  });

  it('Should return sorting indexes for dimensions', function(done) {
    api.getDataPackageModel('Package2').then(function(model) {
      var sortIndexes = osViewerService._getDimensionsSortingIndexes(model);
      assert.deepEqual(sortIndexes, {
        'Administrative_classification-Admin1': 0,
        'Administrative_classification-Admin2_code': 1,
        'Administrative_classification-Admin3_code': 2,
        'Other-Fin_source': 3,
        'Other-Exp_type': 4,
        'Other-Transfer': 5
      });
      done();
    });
  });

  it('Should build hierarchy object', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      var dimensions = api.getDimensionsFromModel(model);
      var hierarchies = osViewerService._buildHierarchies(model, dimensions);
      var expected = require('./data/os-viewer-service/expected/' +
        'hierarchy1.js');
      assert.deepEqual(hierarchies, expected);
      done();
    });

  });

  it('Should build state object', function(done) {
    osViewerService.buildState('Package1').then(function(state) {
      assert(_.isObject(state.measures));
      assert(_.isObject(state.dimensions));
      assert(_.isObject(state.hierarchies));

      _.each(state.dimensions.items, function(item) {
        assert(_.isArray(item.values));
      });
      done();
    });
  });

  it('Should start state initialization', function(done) {
    osViewerService.start({});
    done();
  });
});
