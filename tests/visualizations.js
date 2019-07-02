'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var visualizations = require('../app/front/scripts/services/visualizations');

var data = require('./data');

var sourceParams = {
  measures: ['Depenses_realisees.sum'],
  groups: ['date_2.Annee'],
  series: ['economic_classification_3.Article'],
  rows: ['date_2.Annee'],
  columns: ['economic_classification_3.Article'],
  filters: {
    'economic_classification_Compte.Compte': ['610100']
  },
  orderBy: {
    key: 'Depenses_realisees.sum',
    direction: 'asc'
  },
  dateTimeDimension: 'date_2.Annee'
};

describe('Visualizations', function() {
  describe('Retrieve visualizations', function() {
    it('Should get visualization by id', function(done) {
      var item = visualizations.getVisualizationById('Map');
      assert.isObject(item);
      assert.equal(item.id, 'Map');
      done();
    });

    it('Should get multiple visualizations by ids', function(done) {
      var items = visualizations.getVisualizationsByIds(['Map', 'Table']);

      assert.isArray(items);
      assert.equal(items.length, 2);

      assert.isObject(items[0]);
      assert.equal(items[0].id, 'Table');

      assert.isObject(items[1]);
      assert.equal(items[1].id, 'Map');

      done();
    });

    it('Should find visualization by predicate', function(done) {
      var item = visualizations.findVisualization({
        type: 'location'
      });
      assert.isObject(item);
      assert.equal(item.id, 'Map');
      done();
    });

    it('Should get visualizations for package', function(done) {
      var items = visualizations.getAvailableVisualizations(
        data.package1PackageModel);

      assert.isArray(items);
      assert.equal(items.length, 10);
      _.each(items, function(item) {
        assert.isObject(item);
      });

      var ids = _.chain(items)
        .map(function(item) {
          return item.id;
        })
        .sort()
        .value();
      assert.deepEqual(ids, [
        'BarChart',
        'BubbleTree',
        'DonutChart',
        'LineChart',
        'PieChart',
        'PivotTable',
        'Radar',
        'Sankey',
        'Table',
        'Treemap'
      ]);

      done();
    });
  });

  describe('Prepare params for displaying visualization', function() {
    it('Should prepare params', function(done) {
      var params = visualizations.paramsToBabbageState(sourceParams);
      assert.deepEqual(params, {
        aggregates: 'Depenses_realisees.sum',
        group: ['date_2.Annee'],
        filter: [
          'economic_classification_Compte.Compte:"610100"'
        ],
        order: [{
          key: 'Depenses_realisees.sum',
          direction: 'asc'
        }],
        series: ['economic_classification_3.Article'],
        model: undefined
      });
      done();
    });

    it('Should prepare params for facts table', function(done) {
      var params = visualizations.paramsToBabbageStateFacts(sourceParams);
      assert.deepEqual(params, {
        aggregates: 'Depenses_realisees.sum',
        group: ['date_2.Annee'],
        filter: [
          'economic_classification_Compte.Compte:"610100"'
        ]
      });
      done();
    });

    it('Should prepare params for pivot table', function(done) {
      var params = visualizations.paramsToBabbageStatePivot(sourceParams);
      assert.deepEqual(params, {
        aggregates: 'Depenses_realisees.sum',
        rows: ['date_2.Annee'],
        cols: ['economic_classification_3.Article'],
        filter: [
          'economic_classification_Compte.Compte:"610100"'
        ],
        order: [{
          key: 'Depenses_realisees.sum',
          direction: 'asc'
        }]
      });
      done();
    });

    it('Should prepare params for time series chart', function(done) {
      var params = visualizations.paramsToBabbageStateTimeSeries(sourceParams);
      assert.deepEqual(params, {
        aggregates: 'Depenses_realisees.sum',
        group: ['date_2.Annee'],
        filter: [
          'economic_classification_Compte.Compte:"610100"'
        ],
        order: [{
          key: 'date_2.Annee',
          direction: 'asc'
        }],
        series: ['economic_classification_3.Article']
      });
      done();
    });
  });

  describe('formatValue', function() {
    var formatValue = visualizations.formatValue({
      Million: 1000000,
      Thousand: 1000
    });

    var testCases = [
      {value: 0, expected: '0.0'},
      {value: 500.99, expected: '500.99'},
      {value: 500.999, expected: '501.0'},
      {value: 999, expected: '999.0'},

      {value: 999.999, expected: '1.0 Thousand'},
      {value: 1000, expected: '1.0 Thousand'},
      {value: 1001, expected: '1.0 Thousand'},
      {value: 1500, expected: '1.5 Thousand'},
      {value: -1000, expected: '-1.0 Thousand'},
      {value: -1001, expected: '-1.0 Thousand'},
      {value: -1500, expected: '-1.5 Thousand'},
      {value: -1590, expected: '-1.59 Thousand'},

      {value: 1000000, expected: '1.0 Million'},
      {value: 1000001, expected: '1.0 Million'},
      {value: 1500000, expected: '1.5 Million'},
      {value: 1590000, expected: '1.59 Million'},
      {value: 1599000, expected: '1.6 Million'}
    ];

    testCases.forEach(function(testCase) {
      it(`correctly formats ${testCase.value}`, () => {
        assert.strictEqual(formatValue(testCase.value), testCase.expected);
      });
    });

    it.skip('correctly formats 999999', () => {
      // FIXME: This case is tricky, because we use `toFixed()`, which rounds numbers,
      // after finding the suffix
      assert.strictEqual(formatValue(999999), '1.0 Million');
    });
  });
});
