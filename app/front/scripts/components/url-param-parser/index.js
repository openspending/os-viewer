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

    var orderBy = [];
    if (params.order) {
      orderBy = params.order.split('|');
    }
    if (orderBy.length == 2) {
      orderBy = {
        key: orderBy[0],
        direction: ('' + orderBy[1]).toLowerCase() == 'desc' ?
          'desc' : 'asc'
      };
    } else {
      orderBy = null;
    }

    var groups = (params.groups) ?
      ((_.isArray(params.groups)) ?
        params.groups : [params.groups]) :
      [];

    var series = (params.series) ?
      ((_.isArray(params.series)) ?
        params.series : [params.series]) :
      [];

    var rows = (params.rows) ?
      ((_.isArray(params.rows)) ?
        params.rows : [params.rows]) :
      [];

    var columns = (params.columns) ?
      ((_.isArray(params.columns)) ?
        params.columns : [params.columns]) :
      [];

    var visualizations = (params.visualizations) ?
      ((_.isArray(params.visualizations)) ?
        params.visualizations : [params.visualizations]) :
      [];

    var result = {
      measure: (params.measure) ? params.measure : '',
      visualizations: visualizations,
      groups: groups,
      series: series,
      rows: rows,
      columns: columns,
      filters: filters
    };

    result.order = [orderBy || {
        key: result.measure,
        order: 'desc'
      }];

    return result;
  }
};
