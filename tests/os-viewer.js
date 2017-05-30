'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var osViewerService = require('../app/front/scripts/services/os-viewer');
var historyService =
  require('../app/front/scripts/services/os-viewer/history');
var paramsService =
  require('../app/front/scripts/services/os-viewer/params');

var data = require('./data');

var sourceParams = {
  packageId: 'Package1',
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
  dateTimeDimension: 'date_2.Annee',
  lang: 'es',
  theme: null
};

describe('OS Viewer core service', function() {
  describe('History', function() {
    it('Should initialize history object', function(done) {
      var history = historyService.init();
      assert.isObject(history);
      assert.deepEqual(history.items, []);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, false);
      done();
    });

    it('Should add item to history', function(done) {
      var history = historyService.init();
      var state = {
        history: history,
        params: 'test'
      };
      historyService.push(state);
      assert.deepEqual(history.items, [state.params]);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, false);
      done();
    });

    it('Should add several items to history', function(done) {
      var history = historyService.init();
      historyService.push({
        history: history,
        params: 1
      });
      historyService.push({
        history: history,
        params: 2
      });
      historyService.push({
        history: history,
        params: 3
      });
      assert.equal(history.items.length, 3);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, true);
      done();
    });

    it('Should navigate back and forward', function(done) {
      var history = historyService.init();
      historyService.push({
        history: history,
        params: 1
      });
      historyService.push({
        history: history,
        params: 2
      });
      historyService.push({
        history: history,
        params: 3
      });
      assert.equal(history.items.length, 3);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, true);

      var state = {
        history: history,
        params: 3
      };

      // Back
      historyService.back(state);
      assert.equal(state.params, 2);
      assert.equal(history.hasNext, true);
      assert.equal(history.hasPrev, true);

      // Forward
      historyService.forward(state);
      assert.equal(state.params, 3);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, true);

      done();
    });

    it('Should remove trailing items from history', function(done) {
      var history = historyService.init();
      historyService.push({
        history: history,
        params: 1
      });
      historyService.push({
        history: history,
        params: 2
      });
      historyService.push({
        history: history,
        params: 3
      });
      assert.equal(history.items.length, 3);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, true);

      // Trim
      historyService.trim({
        history: history,
        params: 1
      });
      assert.equal(history.items.length, 1);
      assert.equal(history.hasNext, false);
      assert.equal(history.hasPrev, false);

      done();
    });
  });

  describe('Params', function() {
    it('Should initialize params', function(done) {
      var params = paramsService.init(data.package1PackageModel, {
        visualizations: ['Treemap']
      });
      assert.deepEqual(params, {
        lang: 'en',
        theme: null,
        measures: ['Depenses_realisees.sum'],
        groups: ['activity_2.Nature'],
        series: [],
        rows: [],
        columns: [],
        filters: {},
        orderBy: {
          key: 'Depenses_realisees.sum',
          direction: 'desc'
        },
        drilldown: [],
        source: 'activity_2.Nature',
        target: 'activity_2.Nature',
        visualizations: ['Treemap'],
        packageId: 'Package1',
        countryCode: 'CM',
        dateTimeDimension: 'date_2.Annee'
      });
      done();
    });

    it('Should set the params groups, source and target correctly', function() {
      // See bug https://github.com/openspending/openspending/issues/1234
      const packageModel = data.package1PackageModel;
      const hierarchy = _.find(packageModel.hierarchies, (hierarchy) => hierarchy.dimensions.length > 1);

      assert.isDefined(
        hierarchy,
        'We need a hierarchy with more than 1 dimension to test this behaviour'
      );

      const initialParams = {
        groups: [hierarchy.dimensions[0].key],
        visualizations: ['Treemap']
      };

      const params = paramsService.init(packageModel, initialParams);

      assert.deepEqual(params.groups, initialParams.groups);
      assert.equal(params.source, hierarchy.dimensions[0].key);
      assert.equal(params.target, hierarchy.dimensions[1].key);
    });
  });

  describe('Core', function() {
    // Setup mocks
    before(function(done) {
      data.initMocks();
      done();
    });

    it('Should load empty list of datapackages', function(done) {
      osViewerService.loadDataPackages()
        .then(function(results) {
          assert.deepEqual(results, []);
          done();
        })
        .catch(done);
    });

    it('Should load datapackages', function(done) {
      osViewerService.loadDataPackages(null, null, data.testUserId)
        .then(function(results) {
          assert.deepEqual(results, data.loadedPackages);
          done();
        })
        .catch(done);
    });

    it('Should parse URL', function(done) {
      var parsed = osViewerService.parseUrl(
        '/8c248ff162c3c3b957f487138850eaf2:ekondo-titi-trial?' +
        'measure=Depenses_realisees.sum&order=Depenses_realisees.sum%7Cdesc&' +
        'groups%5B%5D=activity_2.Nature&rows%5B%5D=activity_2.Nature&' +
        'columns%5B%5D=activity_2.Nature');
      assert.deepEqual(parsed, {
        measure: 'Depenses_realisees.sum',
        order: 'Depenses_realisees.sum|desc',
        groups: ['activity_2.Nature'],
        rows: ['activity_2.Nature'],
        columns: ['activity_2.Nature'],
        packageId: '8c248ff162c3c3b957f487138850eaf2:ekondo-titi-trial'
      });
      done();
    });

    it('Should build URL', function(done) {
      var params = _.cloneDeep(sourceParams);
      params.visualizations = ['Pivot'];
      var regularUrl = osViewerService.buildUrl(params);
      var embedUrl = osViewerService.buildUrl(params, {
        visualization: 'Treemap',
        protocol: 'https',
        host: 'example.com',
        port: '8080',
        base: '/viewer'
      });

      assert.equal(regularUrl, '/Package1?measure="Depenses_realisees.sum"&' +
        'groups[]="date_2.Annee"&' +
        'series[]="economic_classification_3.Article"&rows[]="date_2.Annee"&' +
        'columns[]="economic_classification_3.Article"&' +
        'filters[economic_classification_Compte.Compte][]="610100"&' +
        'order="Depenses_realisees.sum|asc"&visualizations[]="Pivot"&lang=es');
      assert.equal(embedUrl, 'https://example.com:8080/viewer/embed/Treemap/' +
        'Package1?measure="Depenses_realisees.sum"&groups[]="date_2.Annee"&' +
        'series[]="economic_classification_3.Article"&rows[]="date_2.Annee"&' +
        'columns[]="economic_classification_3.Article"&' +
        'filters[economic_classification_Compte.Compte][]="610100"&' +
        'order="Depenses_realisees.sum|asc"&lang=es');

      done();
    });

    it('Should get initial state', function(done) {
      osViewerService.getInitialState(data.loadedPackages, '/Package1')
        .then(function(state) {
          var initialState = _.cloneDeep(data.package1InitialState);
          initialState.package = data.package1PackageModelBare;
          assert.deepEqual(state, initialState);
          done();
        })
        .catch(done);
    });

    it('Should fully load data package', function(done) {
      osViewerService.loadDataPackage('Package1')
        .then(function(state) {
          return osViewerService.fullyPopulateModel(state);
        })
        .then(function(state) {
          assert.deepEqual(state, data.package1InitialState);
          done();
        })
        .catch(done);
    });
  });

  describe('updateFromParams', () => {
    it('returns default state if received empty state and URL params', () => {
      const packageModel = data.package1PackageModel;
      const stateParams = {};
      const urlParams = {};

      const params = paramsService.updateFromParams(stateParams, urlParams, packageModel);

      assert.deepEqual(params, paramsService._getDefaultState());
    });

    it('it does not overwrite the state params if there is no new value in the URL params', () => {
      const packageModel = data.package1PackageModel;
      const stateParams = {
        visualizations: ['Treemap']
      };
      const urlParams = {};

      const params = paramsService.updateFromParams(stateParams, urlParams, packageModel);

      assert.deepEqual(params.visualizations, stateParams.visualizations);
    });

    it('it overwrites the state params if there is another value in the URL params', () => {
      // I'm using "visualizations" here, but this should apply to any value in stateParams
      const packageModel = data.package1PackageModel;
      const stateParams = {
        visualizations: ['Treemap']
      };
      const urlParams = {
        visualizations: ['PieChart']
      };

      const params = paramsService.updateFromParams(stateParams, urlParams, packageModel);

      assert.deepEqual(params.visualizations, urlParams.visualizations);
    });
  });
});
