/**
 * Created by Ihor Borysyuk on 18.02.16.
 */

var nock = require('nock');
var assert = require('chai').assert;
var _ = require('underscore');

var api_config = {
  url: 'http://some-server-api.com'
};

var api = require('../app/front/scripts/components/data-package-api/')(api_config);

describe('DataPackage API', function () {
  var dataPackages = require('./data/data-package-api/datapackages.json');
  var dataPackage1 = require('./data/data-package-api/datapackage-package1.json');
  var model1 = require('./data/data-package-api/model1.json');
  var model2 = require('./data/data-package-api/model2.json');
  var dataPackage1Dimension1 = require('./data/data-package-api/package1-dimension1.json');

  var dataPackage1From = require('./data/data-package-api/package1-from.json');
  var dataPackage1To = require('./data/data-package-api/package1-to.json');
  var dataPackage1TimeDay = require('./data/data-package-api/package1-time-day.json');
  var dataPackage1TimeMonth = require('./data/data-package-api/package1-time-month.json');
  var dataPackage1TimeYear = require('./data/data-package-api/package1-time-year.json');

  var dataPackage2Admin1 = require('./data/data-package-api/package2-administrative-classification-admin1.json');
  var dataPackage2Admin2 = require('./data/data-package-api/package2-administrative-classification-admin2.json');
  var dataPackage2Admin3 = require('./data/data-package-api/package2-administrative-classification-admin3.json');
  var dataPackage2Location = require('./data/data-package-api/package2-location.json');
  var dataPackage2OtherExpType = require('./data/data-package-api/package2-other-exp-type.json');
  var dataPackage2OtherFinSource = require('./data/data-package-api/package2-other-fin-source.json');
  var dataPackage2OtherTransfer = require('./data/data-package-api/package2-other-transfer.json');

  before(function (done) {

    //mock datapackages
    nock(api_config.url)
      .persist()
      .get('/cubes')
      .reply(200, dataPackages, {'access-control-allow-origin': '*'});

    //mock package
    nock(api_config.url)
      .persist()
      .get('/info/Package1/package')
      .reply(200, dataPackage1, {'access-control-allow-origin': '*'});

    //mock model1
    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/model')
      .reply(200, model1, {'access-control-allow-origin': '*'});

    //mock model2
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/model')
      .reply(200, model2, {'access-control-allow-origin': '*'});

    //mock dimension values
    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/Dimension1')
      .reply(200, dataPackage1Dimension1, {'access-control-allow-origin': '*'});

    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/from')
      .reply(200, dataPackage1From, {'access-control-allow-origin': '*'});

    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/to')
      .reply(200, dataPackage1To, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/time_day')
      .reply(200, dataPackage1TimeDay, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/time_month')
      .reply(200, dataPackage1TimeMonth, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package1/members/time_year')
      .reply(200, dataPackage1TimeYear, {'access-control-allow-origin': '*'});

    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin1')
      .reply(200, dataPackage2Admin1, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin2_code')
      .reply(200, dataPackage2Admin2, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/administrative_classification_admin3_code')
      .reply(200, dataPackage2Admin3, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/location')
      .reply(200, dataPackage2Location, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/other_exp_type')
      .reply(200, dataPackage2OtherExpType, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/other_fin_source')
      .reply(200, dataPackage2OtherFinSource, {'access-control-allow-origin': '*'});
    nock(api_config.url)
      .persist()
      .get('/cubes/Package2/members/other_transfer')
      .reply(200, dataPackage2OtherTransfer, {'access-control-allow-origin': '*'});

    done();
  });

  it('Should exists', function (done) {
    assert.isObject(api);
    done();
  });

  it('Should return list of datapackages', function (done) {
    api.getPackages().then(function (datapackages) {
      var expectedResult = [
        {value: 'Package1', key: 'Package1'},
        {value: 'Package2', key: 'Package2'},
        {value: 'Package3', key: 'Package3'}
      ];
      assert.deepEqual(datapackages, expectedResult);
      done();
    });
  });

  it('Should return datapackage', function (done) {
    api.getDataPackage('Package1').then(function (datapackage) {
      assert.isObject(datapackage);
      assert.equal(datapackage.name, 'Package1');
      done();
    });
  });

  it('Should return model', function (done) {
    api.getDataPackageModel('Package1').then(function (datapackageModel) {
      assert.isObject(datapackageModel);
      assert.isObject(datapackageModel.dimensions);
      assert.isObject(datapackageModel.measures);
      assert.isObject(datapackageModel.hierarchies);
      done();
    });
  });

  it('Should return possible values of dimension', function (done) {
    api.getDimensionValues('Package1', 'Dimension1').then(function (dimensionValues) {
      assert.isObject(dimensionValues);
      assert.isArray(dimensionValues.data);
      assert.isArray(dimensionValues.fields);
      done();
    });
  });

  it("Should return measures from model", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      var measures = api.getMeasuresFromModel(model);
      assert.deepEqual(measures, [{key: 'amount.sum', value: 'amount'}]);
      done();
    });
  });

  it("Should return dimension key by id", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      var dimensionKey = api.getDimensionKeyById(model, 'from');
      assert.equal(dimensionKey, 'from');

      var dimensionKey = api.getDimensionKeyById(model, 'time_day');
      assert.equal(dimensionKey, 'time.day');

      done();
    });
  });

  it("Should return undefined  for dimension when model doesn't have hierarchy for that dimension", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      var dimensionKey = api.getDrillDownDimensionKey(model, 'from');
      assert(_.isUndefined(dimensionKey));
      done();
    });
  });

  it("Should return DrillDown Dimension Key for dimension", function (done) {
    api.getDataPackageModel('Package2').then(function (model) {
      var dimensionKey = api.getDrillDownDimensionKey(model, 'administrative_classification_admin1');
      assert.equal(dimensionKey, 'administrative_classification.admin2_code');
      done();
    });
  });

  it("Should return undefined  for last dimension in hierarchy", function (done) {
    api.getDataPackageModel('Package2').then(function (model) {
      var dimensionKey = api.getDrillDownDimensionKey(model, 'administrative_classification_admin3_code');
      assert(_.isUndefined(dimensionKey));
      done();
    });
  });

  it("Should return dimensions from model", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      var dimensions = api.getDimensionsFromModel(model);
      assert.isArray(dimensions);
      assert.deepEqual(dimensions, [
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
          id: 'time_day',
          key: 'time.day',
          code: 'time.day',
          hierarchy: 'time',
          name: 'time_day',
          label: 'time.day',
          drillDown: undefined
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
          id: 'time_year',
          key: 'time.year',
          code: 'time.year',
          hierarchy: 'time',
          name: 'time_year',
          label: 'time.year',
          drillDown: 'time.month'
        },
        {
          id: 'to',
          key: 'to',
          code: 'to',
          hierarchy: 'to',
          name: 'to_name',
          label: 'to.name',
          drillDown: undefined
        }]
      );
      done();
    });
  });

  it("Should return correct dimensions from model", function (done) {
    api.getDataPackageModel('Package2').then(function (model) {
      var dimensions = api.getDimensionsFromModel(model);
      assert.isArray(dimensions);

      assert.deepEqual(dimensions, [
        {
          id: 'administrative_classification_admin1',
          key: 'administrative_classification.admin1',
          code: 'administrative_classification.admin1',
          hierarchy: 'administrative_classification',
          name: 'admin1',
          label: 'administrative_classification.admin1',
          drillDown: 'administrative_classification.admin2_code'
        },
        {
          id: 'administrative_classification_admin2_code',
          key: 'administrative_classification.admin2_code',
          code: 'administrative_classification.admin2_code',
          hierarchy: 'administrative_classification',
          name: 'admin2_code',
          label: 'administrative_classification.admin2_label',
          drillDown: 'administrative_classification.admin3_code'
        },
        {
          id: 'administrative_classification_admin3_code',
          key: 'administrative_classification.admin3_code',
          code: 'administrative_classification.admin3_code',
          hierarchy: 'administrative_classification',
          name: 'admin3_code',
          label: 'administrative_classification.admin3_label',
          drillDown: undefined
        },
        {
          id: 'location',
          key: 'location',
          code: 'location',
          hierarchy: 'location',
          name: 'admin2_label',
          label: 'location.title',
          drillDown: undefined
        },
        {
          id: 'other_exp_type',
          key: 'other.exp_type',
          code: 'other.exp_type',
          hierarchy: 'other',
          name: 'exp_type',
          label: 'other.exp_type',
          drillDown: 'other.transfer'
        },
        {
          id: 'other_fin_source',
          key: 'other.fin_source',
          code: 'other.fin_source',
          hierarchy: 'other',
          name: 'fin_source',
          label: 'other.fin_source',
          drillDown: 'other.exp_type'
        },
        {
          id: 'other_transfer',
          key: 'other.transfer',
          code: 'other.transfer',
          hierarchy: 'other',
          name: 'transfer',
          label: 'other.transfer',
          drillDown: undefined
        }
      ]);
      done();
    });
  });

  it("Should build value object for possible value of dimension", function (done) {
    var dimension = {
      key_ref: "other_exp_type.exp_type",
      label_ref: "other_exp_type.exp_type"
    };

    var value = {
      "other_exp_type.exp_type": "Capital"
    };

    var valueObj = api.buildDimensionValue(dimension, value);
    assert.deepEqual(valueObj, {key: "Capital", value: "Capital"});
    done();
  });

  it("Should build value object for possible value of dimension with `label-for` field", function (done) {
    var dimension = {
      key_ref: "other_exp_type.exp_type",
      label_ref: "other_exp_type.exp_type_label"
    };

    var value = {
      "other_exp_type.exp_type": "110",
      "other_exp_type.exp_type_label": "Capital"
    };

    var valueObj = api.buildDimensionValue(dimension, value);
    assert.deepEqual(valueObj, {key: "110", value: "Capital"});
    done();
  });


  it("Should return all possible values of dimensions", function (done) {
    api.getDataPackageModel('Package1').then(function (model) {
      api.getAllDimensionValues('Package1', model).then(function (possibleValues) {
        assert.deepEqual(possibleValues,
          {
            to: [{key: 'agriculture', value: 'agriculture'},
              {key: 'education', value: 'education'},
              {key: 'energy-minerals-total', value: 'energy-minerals-total'},
              {key: 'grand-total', value: 'grand-total'},
              {key: 'health', value: 'health'},
              {key: 'public-admin-total', value: 'public-admin-total'},
              {key: 'roads-works', value: 'roads-works'},
              {key: 'security-total', value: 'security-total'},
              {key: 'water', value: 'water'}],
            from: [{key: '0', value: '0'},
              {key: '1', value: '1'},
              {key: '2', value: '2'},
              {key: '3', value: '3'},
              {key: '4', value: '4'},
              {key: '5', value: '5'},
              {key: '6', value: '6'},
              {key: '7', value: '7'},
              {key: '8', value: '8'}],
            'time.month': [{key: 1, value: 1}],
            'time.year': [{key: 2000, value: 2000}],
            'time.day': [{key: 1, value: 1}]
          }
        );
        done();
      })
    });
  });
})


