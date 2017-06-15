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
      assert.equal(items.length, 9);
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
        series: ['economic_classification_3.Article']
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
});
