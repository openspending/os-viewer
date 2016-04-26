var nock = require('nock');
var assert = require('chai').assert;
var _ = require('lodash');

var apiConfig = {
  url: 'http://some-server-api.com'
};
var searchConfig = {
  url: 'http://some-other-server-api.com/search/package'
};

var api = require('../app/front/scripts/components/' +
  'data-package-api/')(apiConfig, searchConfig);

describe('DataPackage API', function() {
  var dataPackages = require('./data/data-package-api/' +
    'datapackages.json');
  var dataPackage1 = require('./data/data-package-api/' +
    'datapackage-package1.json');
  var dataPackage2 = require('./data/data-package-api/' +
    'datapackage-package2.json');
  var model1 = require('./data/data-package-api/' +
    'model1.json');
  var model2 = require('./data/data-package-api/' +
    'model2.json');
  var dataPackage1Dimension1 = require('./data/data-package-api/' +
    'package1-dimension1.json');

  var dataPackage1From = require('./data/data-package-api/' +
    'package1-from.json');
  var dataPackage1To = require('./data/data-package-api/' +
    'package1-to.json');
  var dataPackage1TimeDay = require('./data/data-package-api/' +
    'package1-time-day.json');
  var dataPackage1TimeMonth = require('./data/data-package-api/' +
    'package1-time-month.json');
  var dataPackage1TimeYear = require('./data/data-package-api/' +
    'package1-time-year.json');
  var dataPackage2Admin1 = require('./data/data-package-api/' +
    'package2-administrative-classification-admin1.json');
  var dataPackage2Admin2 = require('./data/data-package-api/' +
    'package2-administrative-classification-admin2.json');
  var dataPackage2Admin3 = require('./data/data-package-api/' +
    'package2-administrative-classification-admin3.json');
  var dataPackage2Location = require('./data/data-package-api/' +
    'package2-location.json');
  var dataPackage2OtherExpType = require('./data/data-package-api/' +
    'package2-other-exp-type.json');
  var dataPackage2OtherFinSource = require('./data/data-package-api/' +
    'package2-other-fin-source.json');
  var dataPackage2OtherTransfer = require('./data/data-package-api/' +
    'package2-other-transfer.json');

  before(function(done) {

    //mock datapackages
    nock('http://some-other-server-api.com')
      .persist()
      .get('/search/package?size=10000')
      .reply(200, dataPackages, {'access-control-allow-origin': '*'});

    //mock package
    nock(apiConfig.url)
      .persist()
      .get('/info/Package1/package')
      .reply(200, dataPackage1, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/info/Package2/package')
      .reply(200, dataPackage1, {'access-control-allow-origin': '*'});

    //mock model1
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/model')
      .reply(200, model1, {'access-control-allow-origin': '*'});

    //mock model2
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/model')
      .reply(200, model2, {'access-control-allow-origin': '*'});

    //mock dimension values
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/Dimension1')
      .reply(200, dataPackage1Dimension1, {'access-control-allow-origin': '*'});

    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/from')
      .reply(200, dataPackage1From, {'access-control-allow-origin': '*'});

    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/to')
      .reply(200, dataPackage1To, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/time_day')
      .reply(200, dataPackage1TimeDay, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/time_month')
      .reply(200, dataPackage1TimeMonth, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package1/members/time_year')
      .reply(200, dataPackage1TimeYear, {'access-control-allow-origin': '*'});

    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin1')
      .reply(200, dataPackage2Admin1, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin2_code')
      .reply(200, dataPackage2Admin2, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin3_code')
      .reply(200, dataPackage2Admin3, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/location')
      .reply(200, dataPackage2Location, {'access-control-allow-origin': '*'});
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/other_exp_type')
      .reply(200, dataPackage2OtherExpType, {
        'access-control-allow-origin': '*'
      });
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/other_fin_source')
      .reply(200, dataPackage2OtherFinSource, {
        'access-control-allow-origin': '*'
      });
    nock(apiConfig.url)
      .persist()
      .get('/cubes/Package2/members/other_transfer')
      .reply(200, dataPackage2OtherTransfer, {
        'access-control-allow-origin': '*'
      });

    done();
  });

  it('Should exists', function(done) {
    assert.isObject(api);
    done();
  });

  it('Should return list of datapackages', function(done) {
    api.getPackages().then(function(datapackages) {
      var expectedResult =
          [
            {
              'key': 'Package1',
              'value': {
                'package': {
                  'author': 'Charles <charlie@sheen.me>'
                },
                'id': 'Package1',
                'author': 'Charles'
              }
            },
            {
              'value': {
                'author': 'Charles',
                'id': 'Package2',
                'package': {
                  'author': 'Charles <charlie@sheen.me>'
                }
              },
              'key': 'Package2'
            },
            {
              'key': 'Package3',
              'value': {
                'package': {
                  'author': 'Charles <charlie@sheen.me>'
                },
                'author': 'Charles',
                'id': 'Package3'
              }
            }
          ];
      assert.deepEqual(datapackages, expectedResult);
      done();
    });
  });

  it('Should return datapackage', function(done) {
    api.getDataPackage('Package1').then(function(datapackage) {
      assert.isObject(datapackage);
      assert.equal(datapackage.name, 'Package1');
      done();
    });
  });

  it('Should return model', function(done) {
    api.getDataPackageModel('Package1').then(function(datapackageModel) {
      assert.isObject(datapackageModel);
      assert.isObject(datapackageModel.dimensions);
      assert.isObject(datapackageModel.measures);
      assert.isObject(datapackageModel.hierarchies);
      done();
    });
  });

  it('Should return possible values of dimension', function(done) {
    api.getDimensionValues('Package1', 'Dimension1')
      .then(function(dimensionValues) {
        assert.isObject(dimensionValues);
        assert.isArray(dimensionValues.data);
        assert.isArray(dimensionValues.fields);
        done();
      });
  });

  it('Should return measures from model', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      var measures = api.getMeasuresFromModel(model);
      assert.deepEqual(measures, [{
        key: 'amount.sum',
        value: 'amount',
        currency: 'UGX'
      }]);
      done();
    });
  });

  it('Should return dimension key by id', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      var dimensionKey = api.getDimensionKeyById(model, 'from');
      assert.equal(dimensionKey, 'from.name');

      var dimensionKey = api.getDimensionKeyById(model, 'time_day');
      assert.equal(dimensionKey, 'time_day.day');

      done();
    });
  });

  it('Should return undefined  for dimension when model doesn\'t ' +
    'have hierarchy for that dimension', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      var dimensionKey = api.getDrillDownDimensionKey(model, 'from');
      assert(_.isUndefined(dimensionKey));
      done();
    });
  });

  it('Should return DrillDown Dimension Key for dimension', function(done) {
    api.getDataPackageModel('Package2').then(function(model) {
      var dimensionKey = api.getDrillDownDimensionKey(
        model,
        'administrative_classification_admin1'
      );
      assert.equal(dimensionKey,
        'administrative_classification_admin2_code.admin2_code');
      done();
    });
  });

  it('Should return undefined  for last dimension ' +
    'in hierarchy', function(done) {
    api.getDataPackageModel('Package2').then(function(model) {
      var dimensionKey = api.getDrillDownDimensionKey(
        model,
        'administrative_classification_admin3_code'
      );
      assert(_.isUndefined(dimensionKey));
      done();
    });
  });

  it('Should return dimensions from model', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      var dimensions = api.getDimensionsFromModel(model);
      assert.isArray(dimensions);
      assert.deepEqual(dimensions, [
        {
          id: 'from',
          key: 'from.name',
          code: 'from',
          hierarchy: 'from',
          dimensionType: undefined,
          name: 'from.name',
          label: 'from.name',
          drillDown: undefined
        },
        {
          id: 'time_day',
          key: 'time_day.day',
          code: 'time.day',
          hierarchy: 'time',
          dimensionType: undefined,
          name: 'time_day.day',
          label: 'time_day.day',
          drillDown: undefined
        },
        {
          id: 'time_month',
          key: 'time_month.month',
          code: 'time.month',
          hierarchy: 'time',
          dimensionType: undefined,
          name: 'time_month.month',
          label: 'time_month.month',
          drillDown: 'time_day.day'
        },
        {
          id: 'time_year',
          key: 'time_year.year',
          code: 'time.year',
          hierarchy: 'time',
          dimensionType: undefined,
          name: 'time_year.year',
          label: 'time_year.year',
          drillDown: 'time_month.month'
        },
        {
          id: 'to',
          key: 'to.name',
          code: 'to',
          hierarchy: 'to',
          dimensionType: undefined,
          name: 'to.name',
          label: 'to.name',
          drillDown: undefined
        }
      ]);
      done();
    });
  });

  it('Should return correct dimensions from model', function(done) {
    api.getDataPackageModel('Package2').then(function(model) {
      var dimensions = api.getDimensionsFromModel(model);
      assert.isArray(dimensions);
      assert.deepEqual(dimensions, [
        {
          id: 'administrative_classification_admin1',
          key: 'administrative_classification_admin1.admin1',
          code: 'administrative_classification.admin1',
          hierarchy: 'administrative_classification',
          dimensionType: undefined,
          name: 'administrative_classification_admin1.admin1',
          label: 'administrative_classification_admin1.admin1',
          drillDown: 'administrative_classification_admin2_code.admin2_code'
        },
        {
          id: 'administrative_classification_admin2_code',
          key: 'administrative_classification_admin2_code.admin2_code',
          code: 'administrative_classification.admin2_code',
          hierarchy: 'administrative_classification',
          dimensionType: undefined,
          name: 'administrative_classification_admin2_code.admin2_code',
          label: 'administrative_classification_admin2_code.admin2_label',
          drillDown: 'administrative_classification_admin3_code.admin3_code'
        },
        {
          id: 'administrative_classification_admin3_code',
          key: 'administrative_classification_admin3_code.admin3_code',
          code: 'administrative_classification.admin3_code',
          hierarchy: 'administrative_classification',
          dimensionType: undefined,
          name: 'administrative_classification_admin3_code.admin3_code',
          label: 'administrative_classification_admin3_code.admin3_label',
          drillDown: undefined
        },
        {
          id: 'location',
          key: 'location.title',
          code: 'location',
          hierarchy: 'location',
          dimensionType: undefined,
          name: 'location.title',
          label: 'location.title',
          drillDown: undefined
        },
        {
          id: 'other_exp_type',
          key: 'other_exp_type.exp_type',
          code: 'other.exp_type',
          hierarchy: 'other',
          dimensionType: undefined,
          name: 'other_exp_type.exp_type',
          label: 'other_exp_type.exp_type',
          drillDown: 'other_transfer.transfer'
        },
        {
          id: 'other_fin_source',
          key: 'other_fin_source.fin_source',
          code: 'other.fin_source',
          hierarchy: 'other',
          dimensionType: undefined,
          name: 'other_fin_source.fin_source',
          label: 'other_fin_source.fin_source',
          drillDown: 'other_exp_type.exp_type'
        },
        {
          id: 'other_transfer',
          key: 'other_transfer.transfer',
          code: 'other.transfer',
          hierarchy: 'other',
          dimensionType: undefined,
          name: 'other_transfer.transfer',
          label: 'other_transfer.transfer',
          drillDown: undefined
        }
      ]);
      done();
    });
  });

  it('Should build value object for possible ' +
    'value of dimension', function(done) {
    // jscs:disable
    var dimension = {
      key_ref: 'other_exp_type.exp_type',
      label_ref: 'other_exp_type.exp_type'
    };

    var value = {
      'other_exp_type.exp_type': 'Capital'
    };
    // jscs:enable

    var valueObj = api.buildDimensionValue(dimension, value);
    assert.deepEqual(valueObj, {key: 'Capital', value: 'Capital'});
    done();
  });

  it('Should build value object for possible value of dimension ' +
    'with `label-for` field',
    function(done) {
      // jscs:disable
      var dimension = {
        key_ref: 'other_exp_type.exp_type',
        label_ref: 'other_exp_type.exp_type_label'
      };

      var value = {
        'other_exp_type.exp_type': '110',
        'other_exp_type.exp_type_label': 'Capital'
      };
      // jscs:enable

      var valueObj = api.buildDimensionValue(dimension, value);
      assert.deepEqual(valueObj, {key: '110', value: 'Capital'});
      done();
    });

  it('Should return all possible values of dimensions', function(done) {
    api.getDataPackageModel('Package1').then(function(model) {
      api.getAllDimensionValues('Package1', model)
        .then(function(possibleValues) {
          assert.deepEqual(possibleValues,
            {
              'to.name': [
                {key: 'agriculture', value: 'agriculture'},
                {key: 'education', value: 'education'},
                {key: 'energy-minerals-total', value: 'energy-minerals-total'},
                {key: 'grand-total', value: 'grand-total'},
                {key: 'health', value: 'health'},
                {key: 'public-admin-total', value: 'public-admin-total'},
                {key: 'roads-works', value: 'roads-works'},
                {key: 'security-total', value: 'security-total'},
                {key: 'water', value: 'water'}],
              'from.name': [{key: '0', value: '0'},
                {key: '1', value: '1'},
                {key: '2', value: '2'},
                {key: '3', value: '3'},
                {key: '4', value: '4'},
                {key: '5', value: '5'},
                {key: '6', value: '6'},
                {key: '7', value: '7'},
                {key: '8', value: '8'}],
              'time_month.month': [{key: 1, value: 1}],
              'time_year.year': [{key: 2000, value: 2000}],
              'time_day.day': [{key: 1, value: 1}]
            }
          );
          done();
        });
    });
  });
});
