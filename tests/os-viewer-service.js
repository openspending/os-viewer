/**
 * Created by Ihor Borysyuk on 22.02.16.
 */

var nock = require('nock');
var assert = require('chai').assert;
var _ = require('underscore');

var api_config = {
  url: 'http://some-server-api.com'
};

var osViewerService = require('../app/front/scripts/components/os-viewer-service/')(api_config);
var api = require('../app/front/scripts/components/data-package-api/')(api_config);

describe('osViewerService', function () {

  it("Should exists", function (done) {
    assert(_.isObject(osViewerService));
    assert(_.isFunction(osViewerService.getState));
    assert(_.isFunction(osViewerService.initState));
    done();
  });

  it("Should return current state", function (done) {
    osViewerService.initState({name: 'test'});
    var state = osViewerService.getState();
    assert.deepEqual(state, {name: 'test'});
    done();
  });

  it("Should return sorting indexes for dimensions", function (done) {
    api.getDataPackageModel('Package2').then(function (model) {
      var sortIndexes = osViewerService._getDimensionsSortingIndexes(model);
      assert.deepEqual(sortIndexes, {
        'administrative_classification.admin1': 0,
        'administrative_classification.admin2_code': 1,
        'administrative_classification.admin3_code': 2,
        'other.fin_source': 3,
        'other.exp_type': 4,
        'other.transfer': 5
      });
      done();
    });
  });

  it("Should build hierarchy object", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      var dimensions = api.getDimensionsFromModel(model);
      var hierarchies = osViewerService._buildHierarchies(model, dimensions);

      var expected = [
        {
          key: 'withoutHierarchy',
          name: 'Without hierarchy',
          dimensions: [
            {
              id: 'from',
              key: 'from',
              code: 'from',
              hierarchy: 'from',
              name: 'from_name',
              label: 'from.name',
              drillDown: undefined
            },
            {
              id: 'to',
              key: 'to',
              code: 'to',
              hierarchy: 'to',
              name: 'to_name',
              label: 'to.name',
              drillDown: undefined
            }
          ],
          common: true
        },
        {
          key: 'time',
          name: 'time',
          dimensions: [
            {
              id: 'time_year',
              key: 'time.year',
              code: 'time.year',
              hierarchy: 'time',
              name: 'time_year',
              label: 'time.year',
              drillDown: 'time.month'
            },
            {
              id: 'time_month',
              key: 'time.month',
              code: 'time.month',
              hierarchy: 'time',
              name: 'time_month',
              label: 'time.month',
              drillDown: 'time.day'
            },
            {
              id: 'time_day',
              key: 'time.day',
              code: 'time.day',
              hierarchy: 'time',
              name: 'time_day',
              label: 'time.day',
              drillDown: undefined
            }
          ],
          common: false
        }
      ];

      assert.deepEqual(hierarchies, expected);
      done();
    });

  });

  it("Should build state object", function(done) {
    osViewerService.buildState('Package1').then(function (state) {
      assert(_.isObject(state.measures));
      assert(_.isObject(state.dimensions));
      assert(_.isObject(state.hierarchies));

      _.each(state.dimensions.items, function(item) {
        assert(_.isArray(item.values));
      } )
      done();
    });
  });


  it("Should start state initialization", function (done) {
    osViewerService.start({});
    done();
  });
});