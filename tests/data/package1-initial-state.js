'use strict';

var packageModel = require('./package1-packagemodel');

module.exports = {
  package: packageModel,
  params: {
    measures: [],
    groups: [],
    series: [],
    rows: [],
    columns: [],
    filters: {},
    orderBy: {},
    visualizations: [],
    packageId: 'Package1',
    countryCode: 'CM',
    dateTimeDimension: 'date_2.Annee',
    babbageApiUrl: 'http://api.example.com',
    cosmopolitanApiUrl: 'http://cosmopolitan.example.com'
  },
  history: {
    items: [],
    hasNext: false,
    hasPrev: false
  }
};
