'use strict';

var packageModel = require('./package1-packagemodel');
var babbageModel = require('./package1-model');

module.exports = {
  package: packageModel,
  params: {
    lang: 'en',
    theme: null,
    measures: [],
    groups: [],
    series: [],
    rows: [],
    columns: [],
    filters: {},
    orderBy: {},
    visualizations: [],
    drilldown: [],
    packageId: 'Package1',
    countryCode: 'CM',
    dateTimeDimension: 'date_2.Annee',
    babbageApiUrl: 'http://api.example.com',
    cosmopolitanApiUrl: 'http://cosmopolitan.example.com',
    source: undefined,
    target: undefined,
    model: babbageModel.model
  },
  history: {
    items: [],
    hasNext: false,
    hasPrev: false
  }
};
