'use strict';

var _ = require('lodash');
var visualizationsService = require('../visualizations');

var defaultOrderByDirection = 'desc';

function cloneState(state) {
  return _.cloneDeep(state);
}

function init(packageModel, initialParams) {
  var anyDateTimeHierarchy = _.first(packageModel.dateTimeHierarchies);

  return {
    isEmbedded: !!initialParams.isEmbedded,
    packageId: packageModel.id,
    countryCode: packageModel.meta.countryCode,
    measures: [],
    groups: [],
    series: [],
    rows: [],
    columns: [],
    filters: {},
    orderBy: {},
    dateTimeDimension: _.first(anyDateTimeHierarchy.dimensions).key,
    visualizations: []
  };
}

function changeMeasure(state, measure) {
  var result = cloneState(state);
  var orderByIsMeasure = result.measures.indexOf(result.orderBy.key) >= 0;
  result.measures = [measure];
  if (orderByIsMeasure) {
    result.orderBy.key = measure;
    result.orderBy.direction = defaultOrderByDirection;
  }
  return result;
}

function changeFilter(state, filter, value) {
  var result = cloneState(state);
  result.filters[filter] = value;
  return result;
}

function clearFilter(state, filter) {
  var result = cloneState(state);
  delete result.filters[filter];
  return result;
}

function clearFilters(state) {
  var result = cloneState(state);
  result.filters = {};
  return result;
}

function changeDimension(state, axis, dimension) {
  var result = cloneState(state);

  var isSingleSelect = false;

  // All types are multi-select, except of `groups` (in all cases) and
  // `series` (when `time-series` vis selected)
  if (axis == 'groups') {
    isSingleSelect = true;
  }
  if (axis == 'series') {
    var visualization = visualizationsService.getVisualizationById(
      _.first(result.visualizations));
    if (visualization) {
      if (visualization.type == 'time-series') {
        isSingleSelect = true;
      }
    }
  }

  if (isSingleSelect) {
    var orderByIsGroup = false;
    if (axis == 'groups') {
      orderByIsGroup = result.groups.indexOf(result.orderBy.key) >= 0;
    }
    result[axis] = [dimension];
    if (orderByIsGroup) {
      result.orderBy.key = dimension;
      result.orderBy.direction = defaultOrderByDirection;
    }
  } else {
    result[axis] = _.filter(result[axis], function(value) {
      return value != dimension;
    });
    result[axis].push(dimension);
  }
  return result;
}

function clearDimension(state, axis, dimension) {
  var result = cloneState(state);
  result[axis] = _.filter(result[axis], function(value) {
    return value != dimension;
  });
  return result;
}

function clearDimensions(state, axis) {
  var result = cloneState(state);
  result[axis] = [];
  return result;
}

function drillDown(state, drillDownValue, packageModel) {
  var result = cloneState(state);

  var groupKey = _.first(result.groups);
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    return !!_.find(hierarchy.dimensions, {key: groupKey});
  });

  if (hierarchy) {
    var index = _.findIndex(hierarchy.dimensions, {key: groupKey});
    index += 1;
    if (index <= hierarchy.dimensions.length - 1) {
      var nextGroup = hierarchy.dimensions[index];
      result.filters[groupKey] = drillDownValue;
      result.groups = [nextGroup.key];
    }
  }

  return result;
}

function applyBreadcrumb(state, breadcrumb) {
  var result = cloneState(state);

  result.groups = breadcrumb.groups;
  result.filters = breadcrumb.filters;

  return result;
}

function changeOrderBy(state, key, direction) {
  direction = ('' + direction).toLowerCase();
  var result = cloneState(state);
  result.orderBy = {
    key: key,
    direction: (direction == 'desc') ? 'desc' : 'asc'
  };
  return result;
}

// Functions for initializing params according to added visualizations

function initCommonParams(params, packageModel) {
  var measure = _.first(packageModel.measures);
  var hierarchy = _.first(packageModel.hierarchies);
  var dimension = _.first(hierarchy.dimensions);

  params.measures = [measure.key];
  params.groups = [dimension.key];
  params.orderBy = {
    key: measure.key,
    direction: defaultOrderByDirection
  };
}

function initParamsForTimeSeries(params, packageModel) {
  var measure = _.first(packageModel.measures);

  params.measures = [measure.key];
  params.groups = [];
  params.orderBy = {};
}

function initParamsForLocation(params, packageModel) {
  var measure = _.first(packageModel.measures);
  var hierarchy = _.first(packageModel.locationHierarchies);
  var dimension = _.first(hierarchy.dimensions);

  params.measures = [measure.key];
  params.groups = [dimension.key];
  params.orderBy = {
    key: measure.key,
    direction: defaultOrderByDirection
  };
}

function initParamsForPivotTable(params, packageModel) {
  var measure = _.first(packageModel.measures);

  var hierarchy = _.first(packageModel.hierarchies);
  var rowDimension = _.first(hierarchy.dimensions);

  // Choose dimension for columns. First try to find `datetime` dimension
  // with more than one value; if such dimension not found - try any other
  hierarchy = _.first(packageModel.columnHierarchies);
  var columnDimension = _.first(hierarchy.dimensions);
  _.each(packageModel.columnHierarchies, function(hierarchy) {
    var dimension = _.find(hierarchy.dimensions, {
      dimensionType: 'datetime'
    });
    if (dimension) {
      if (dimension.values.length > 1) {
        columnDimension = dimension;
        return false;
      }
    }
  });

  params.measures = [measure.key];
  params.rows = [rowDimension.key];
  params.columns = [columnDimension.key];
  params.orderBy = {
    key: measure.key,
    direction: defaultOrderByDirection
  };
}

function initParams(params, packageModel) {
  var visualization = visualizationsService.getVisualizationById(
    _.first(params.visualizations));
  switch (visualization.type) {
    case 'drilldown':
    case 'sortable-series':
      initCommonParams(params, packageModel);
      break;
    case 'time-series':
      initParamsForTimeSeries(params, packageModel);
      break;
    case 'location':
      initParamsForLocation(params, packageModel);
      break;
    case 'pivot-table':
      initParamsForPivotTable(params, packageModel);
      break;
  }
}

function clearParams(params, packageModel) {
  params.measures = [];
  params.groups = [];
  params.series = [];
  params.rows = [];
  params.columns = [];
  params.filters = {};
  params.orderBy = {};
  params.visualizations = [];
}

function addVisualization(state, visualizationId, toggle, packageModel) {
  var result = cloneState(state);

  var alreadyAdded = !!_.find(state.visualizations, function(item) {
    return item == visualizationId;
  });

  if (alreadyAdded) {
    if (toggle) {
      result.visualizations = _.filter(result.visualizations, function(item) {
        return item != visualizationId;
      });
    }
  } else {
    result.visualizations.push(visualizationId);
  }

  if (result.visualizations.length == 0) {
    clearParams(result, packageModel);
  }
  if (result.visualizations.length == 1) {
    initParams(result, packageModel);
  }

  return result;
}

function removeVisualization(state, visualizationId, packageModel) {
  var result = cloneState(state);
  result.visualizations = _.filter(result.visualizations, function(item) {
    return item != visualizationId;
  });
  if (result.visualizations.length == 0) {
    clearParams(result.packageModel);
  }
  return result;
}

function removeAllVisualizations(state, packageModel) {
  var result = cloneState(state);
  result.visualizations = [];
  clearParams(result, packageModel);
  return result;
}

module.exports.init = init;
module.exports.changeMeasure = changeMeasure;
module.exports.changeFilter = changeFilter;
module.exports.clearFilter = clearFilter;
module.exports.clearFilters = clearFilters;
module.exports.changeDimension = changeDimension;
module.exports.clearDimension = clearDimension;
module.exports.clearDimensions = clearDimensions;
module.exports.drillDown = drillDown;
module.exports.applyBreadcrumb = applyBreadcrumb;
module.exports.addVisualization = addVisualization;
module.exports.removeVisualization = removeVisualization;
module.exports.removeAllVisualizations = removeAllVisualizations;
module.exports.changeOrderBy = changeOrderBy;
