'use strict';
var _ = require('lodash');

module.exports = {
  parse: function(params) {
    var filters = {};
    params = params || {};
    params.filters = (params.filters) ? params.filters : [];
    params.filters =
      (_.isArray(params.filters)) ?
        params.filters : [params.filters];

    _.each(params.filters, function(value) {
      var filter = value.split('|');
      if (filter.length == 2) {
        filters[filter[0]] = filter[1];
      }
    });

    var groups = (params.groups) ?
      ((_.isArray(params.groups)) ?
        params.groups : [params.groups]) :
      [];

    var rows = (params.rows) ?
      ((_.isArray(params.rows)) ?
        params.rows : [params.rows]) :
      [];

    var columns = (params.columns) ?
      ((_.isArray(params.columns)) ?
        params.columns : [params.columns]) :
      [];

    var result = {
      measure: (params.measure) ? params.measure : '',
      groups: groups,
      rows: rows,
      columns: columns,
      filters: filters
    };

    return result;
  }
};
