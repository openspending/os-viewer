var nock = require('nock');
var assert = require('chai').assert;
var _ = require('lodash');

var apiConfig = {
  url: 'http://some-server-api.com'
};
var searchConfig = {
  url: 'http://some-other-server-api.com/search/package'
};

var osViewerService = require('../app/front/scripts/components/' +
  'os-viewer-service/')(apiConfig, searchConfig);
var api = require('../app/front/scripts/components/' +
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
      var expected = [
        {
          key: 'withoutHierarchy',
          name: 'Without hierarchy',
          dimensions: [
            {
              id: 'from',
              key: 'from.name',
              code: 'From',
              displayName: 'From',
              hierarchy: 'from',
              dimensionType: undefined,
              name: 'from.name',
              label: 'from.name',
              drillDown: undefined
            },
            {
              id: 'to',
              key: 'to.name',
              code: 'To',
              displayName: 'To',
              hierarchy: 'to',
              dimensionType: undefined,
              name: 'to.name',
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
              id: 'time_day',
              key: 'time_day.day',
              code: 'Time-Day',
              displayName: 'Time-Day',
              hierarchy: 'time',
              dimensionType: undefined,
              name: 'time_day.day',
              label: 'time_day.day',
              drillDown: undefined
            },
            {
              id: 'time_month',
              key: 'time_month.month',
              code: 'Time-Month',
              displayName: 'Time-Month',
              hierarchy: 'time',
              dimensionType: undefined,
              name: 'time_month.month',
              label: 'time_month.month',
              drillDown: 'time_day.day'
            },
            {
              id: 'time_year',
              key: 'time_year.year',
              code: 'Time-Year',
              displayName: 'Time-Year',
              hierarchy: 'time',
              dimensionType: undefined,
              name: 'time_year.year',
              label: 'time_year.year',
              drillDown: 'time_month.month'
            }
          ],
          common: false
        }
      ];
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
