'use strict';

var _ = require('lodash');

var availableVisualizations = [
  {
    id: 'Treemap',
    name: 'Tree Map',
    type: 'drilldown',
    embed: 'treemap',
    icon: 'os-icon os-icon-treemap'
  },
  {
    id: 'PieChart',
    name: 'Pie Chart',
    type: 'drilldown',
    embed: 'piechart',
    icon: 'os-icon os-icon-piechart'
  },
  {
    id: 'BubbleTree',
    name: 'Bubble Tree',
    type: 'drilldown',
    embed: 'bubbletree',
    icon: 'os-icon os-icon-bubbletree'
  },
  {
    id: 'BarChart',
    name: 'Bar Chart',
    type: 'sortable-series',
    embed: 'barchart',
    icon: 'os-icon os-icon-barchart'
  },
  {
    id: 'Table',
    name: 'Table',
    type: 'sortable-series',
    embed: 'table',
    icon: 'os-icon os-icon-table'
  },
  {
    id: 'LineChart',
    name: 'Line Chart',
    type: 'time-series',
    embed: 'linechart',
    icon: 'os-icon os-icon-linechart'
  },
  {
    id: 'Map',
    name: 'Map',
    type: 'location',
    embed: 'map',
    icon: 'os-icon os-icon-map'
  },
  {
    id: 'PivotTable',
    name: 'Pivot Table',
    type: 'pivot-table',
    embed: 'pivottable',
    icon: 'os-icon os-icon-layers'
  }
];

function getVisualizationById(id) {
  return _.find(availableVisualizations, function(item) {
    return item.id == id;
  });
}

function getVisualizationsByIds(ids) {
  return _.filter(availableVisualizations, function(item) {
    return !!_.find(ids, function(id) {
      return item.id == id;
    });
  });
}

function getAvailableVisualizations(packageModel) {
  if (!packageModel) {
    return [];
  }

  return _.chain(availableVisualizations)
    .filter(function(item) {
      var hierarchiesAvailable = false;
      var locationAvailable = false;

      if (item.type == 'location') {
        hierarchiesAvailable = packageModel.locationHierarchies.length > 0;
        locationAvailable = !!packageModel.meta.countryCode;
        if (!hierarchiesAvailable || !locationAvailable) {
          return false;
        }
      }
      if (item.type == 'time-series') {
        hierarchiesAvailable = packageModel.dateTimeHierarchies.length > 0;
        if (!hierarchiesAvailable) {
          return false;
        }
      }
      return true;
    })
    .value();
}

function paramsToBabbageState(params) {
  var result = {
    aggregates: _.first(params.measures),
    group: params.groups,
    filter: _.map(
      params.filters,
      function(value, key) {
        return key + ':' + JSON.stringify(value);
      }),
    order: [params.orderBy]
  };

  var series = params.series;
  if (series && !_.isArray(series)) {
    series = [series];
  }
  if (series && series.length) {
    result.series = series;
  }

  return result;
}

function paramsToBabbageStateFacts(params) {
  return {
    aggregates: _.first(params.measures),
    group: params.groups,
    filter: _.map(
      params.filters,
      function(value, key) {
        return key + ':' + JSON.stringify(value);
      })
  };
}

function paramsToBabbageStatePivot(params) {
  return {
    aggregates: _.first(params.measures),
    rows: params.rows,
    cols: params.columns,
    filter: _.map(
      params.filters,
      function(value, key) {
        return key + ':' + JSON.stringify(value);
      }),
    order: [params.orderBy]
  };
}

function paramsToBabbageStateTimeSeries(params) {
  var result = {
    aggregates: _.first(params.measures),
    group: [params.dateTimeDimension],
    filter: _.map(
      params.filters,
      function(value, key) {
        return key + ':' + JSON.stringify(value);
      }),
    order: [{
      key: params.dateTimeDimension,
      direction: 'asc'
    }]
  };

  var series = params.series;
  if (series && !_.isArray(series)) {
    series = [series];
  }
  if (series && series.length) {
    var seriesSameAsGroups = (series.length == 1) &&
      (series[0] == result.group[0]);
    if (!seriesSameAsGroups) {
      result.series = series;
    }
  }

  return result;
}

module.exports.getVisualizationById = getVisualizationById;
module.exports.getVisualizationsByIds = getVisualizationsByIds;
module.exports.getAvailableVisualizations = getAvailableVisualizations;

module.exports.paramsToBabbageState = paramsToBabbageState;
module.exports.paramsToBabbageStateFacts = paramsToBabbageStateFacts;
module.exports.paramsToBabbageStatePivot = paramsToBabbageStatePivot;
module.exports.paramsToBabbageStateTimeSeries = paramsToBabbageStateTimeSeries;
