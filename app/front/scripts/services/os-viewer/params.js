'use strict';

var _ = require('lodash');
var visualizationsService = require('../visualizations');

var defaultOrderByDirection = 'desc';

function cloneState(state) {
  return _.cloneDeep(state);
}

function getDefaultState(variablePart) {
  return _.extend({
    measures: [],
    groups: [],
    series: [],
    rows: [],
    columns: [],
    filters: {},
    orderBy: {},
    visualizations: [],
    drilldown: [],
    lang: 'en',
    theme: null
  }, variablePart);
}

function normalizeUrlParams(params, packageModel) {
  var result = {};

  if (!!params.measure) {
    result.measures = [params.measure];
  }

  _.each(['groups', 'series', 'rows', 'columns'], function(axis) {
    if (!!params[axis]) {
      if (_.isArray(params[axis])) {
        result[axis] = params[axis];
      } else {
        result[axis] = [params[axis]];
      }
      result[axis] = _.filter(result[axis]);
    }
  });

  if (!!params.filters) {
    result.filters = params.filters;
    if (_.isArray(params.filters)) {
      result.filters = _.chain(params.filters)
        .map(function(value) {
          value = value.split('|');
          if (value.length == 2) {
            return value;
          }
        })
        .filter()
        .fromPairs()
        .value();
    }
  }

  if (!!params.order) {
    var orderBy = params.order.split('|');
    if (orderBy.length == 2) {
      result.orderBy = {
        key: orderBy[0],
        direction: orderBy[1]
      };
    }
  }

  result.visualizations = [];
  if (!!params.visualizations) {
    if (_.isArray(params.visualizations)) {
      result.visualizations = params.visualizations;
    } else {
      result.visualizations = [params.visualizations];
    }
    result.visualizations = _.filter(result.visualizations);
  }

  result.lang = 'en';
  if (!!params.lang) {
    result.lang = params.lang;
  }
  result.theme = null;
  if (!!params.theme) {
    result.theme = params.theme;
  }

  return result;
}

function extractDrilldownLevels(params, packageModel) {
  var result = _.cloneDeep(params);

  var drilldown = [];
  var dimensionKey = _.first(params.groups);
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    return !!_.find(hierarchy.dimensions, {key: dimensionKey});
  });
  if (hierarchy) {
    _.each(hierarchy.dimensions, function(dimension) {
      if (dimension.key == dimensionKey) {
        // Break
        return false;
      }
      // For each dimension there should be the only selected filter;
      // otherwise it is not drilldown
      var filters = params.filters[dimension.key];
      if (_.isArray(filters) && (filters.length == 1)) {
        drilldown.push({
          dimension: dimension.key,
          filter: _.first(filters)
        });
      } else {
        // Break and clear drilldown info
        drilldown = [];
        return false;
      }
    });
  }

  result.drilldown = drilldown;
  result.filters = _.chain(result.filters)
    .map(function(values, key) {
      var isDrilldown = !!_.find(drilldown, {dimension: key});
      if (!isDrilldown) {
        return [key, values];
      }
    })
    .filter()
    .fromPairs()
    .value();

  return result;
}

function validateUrlParams(params, packageModel) {
  var result = {};

  result.lang = params.lang;
  result.theme = params.theme;

  var visualizations = visualizationsService.getVisualizationsByIds(
    params.visualizations);
  if (visualizations.length == 0) {
    return result;
  }

  var type = _.first(visualizations).type;
  var defaults = {};
  switch (type) {
    case 'drilldown':
    case 'sortable-series':
      initCommonParams(defaults, packageModel);
      if (type == 'sortable-series') {
        defaults.series = [];
      }
      break;
    case 'time-series':
      initParamsForTimeSeries(defaults, packageModel);
      break;
    case 'location':
      initParamsForLocation(defaults, packageModel);
      break;
    case 'pivot-table':
      initParamsForPivotTable(defaults, packageModel);
      break;
  }
  defaults.filters = {};

  _.each(defaults, function(unused, key) {
    result[key] = params[key] || defaults[key];
  });

  result.visualizations = _.chain(visualizations)
    .filter({type: type})
    .map(function(item) {
      return item.id;
    })
    .value();

  // Extract drilldown levels
  if (type == 'drilldown') {
    result = extractDrilldownLevels(result, packageModel);
  }

  return result;
}

function init(packageModel, initialParams) {
  var anyDateTimeHierarchy = _.first(packageModel.dateTimeHierarchies);
  initialParams = normalizeUrlParams(initialParams || {}, packageModel);
  initialParams = validateUrlParams(initialParams, packageModel);

  var defaults = getDefaultState({
    packageId: packageModel.id,
    countryCode: packageModel.meta.countryCode,
    dateTimeDimension: anyDateTimeHierarchy ?
      _.first(anyDateTimeHierarchy.dimensions).key : null
  });

  return _.extend(defaults, initialParams);
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

function changeFilter(state, filter, filterValue, packageModel) {
  var result = cloneState(state);

  result.filters[filter] = _.filter(result.filters[filter], function(value) {
    return value != filterValue;
  });
  result.filters[filter].push(filterValue);

  return result;
}

function clearDependentFilters(state, filter, packageModel) {
  var result = cloneState(state);

  var index = -1;
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    index = _.findIndex(hierarchy.dimensions, {key: filter});
    return index >= 0;
  });
  if (hierarchy && (index >= 0)) {
    for (var i = index + 1; i < hierarchy.dimensions.length; i++) {
      var dimension = hierarchy.dimensions[i];
      delete result.filters[dimension.key];
    }
  }

  return result;
}

function clearFilter(state, filter, value, packageModel) {
  var result = cloneState(state);
  if (_.isUndefined(value)) {
    delete result.filters[filter];
    result = clearDependentFilters(result, filter, packageModel);
  } else {
    result.filters[filter] = _.filter(result.filters[filter], function(item) {
      return item != value;
    });
    if (result.filters[filter].length == 0) {
      delete result.filters[filter];
      result = clearDependentFilters(result, filter, packageModel);
    }
  }
  return result;
}

function clearFilters(state, packageModel) {
  var result = cloneState(state);
  result.filters = {};
  return result;
}

function updateSourceTarget(params, packageModel) {
  params.source = undefined;
  params.target = undefined;

  var groupKey = _.first(params.groups);
  var hierarchy = _.find(packageModel.hierarchies, function(hierarchy) {
    return !!_.find(hierarchy.dimensions, {key: groupKey});
  });

  if (hierarchy && (hierarchy.dimensions.length > 0)) {
    // Find source and target dimensions.
    // `source` should be selected dimension, and `target` - next
    // dimension to selected. If selected last dimension, then
    // last dimension is `target` and previous to it - `source`
    var source = null;
    var target = null;
    _.each(hierarchy.dimensions, function(item) {
      if (source && (source.key == groupKey)) {
        target = item;
        return false;
      }
      if (item.key == groupKey) {
        source = item;
      }
    });
    if (source && !target) {
      target = source;
      source = _.last(_.dropRight(hierarchy.dimensions, 1));
      if (!source) {
        source = target;
      }
    }

    params.source = source ? source.key : undefined;
    params.target = target ? target.key : undefined;
  }

  return params;
}

function changeDimension(state, axis, dimension, packageModel) {
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
      orderByIsGroup = result.measures.indexOf(result.orderBy.key) == -1;
    }
    result[axis] = [dimension];
    if (orderByIsGroup) {
      var dimensionItem = _.find(packageModel.dimensions, {key: dimension});
      var orderByKey = dimension;
      if (dimensionItem) {
        orderByKey = dimensionItem.sortKey || dimensionItem.key;
      }

      result.orderBy.key = orderByKey;
      result.orderBy.direction = defaultOrderByDirection;
    }
  } else {
    result[axis] = _.filter(result[axis], function(value) {
      return value != dimension;
    });
    result[axis].push(dimension);
  }

  // Update `source` and `target` when changing group
  if (axis == 'groups') {
    result.drilldown = [];
    updateSourceTarget(result, packageModel);
  }

  return result;
}

function clearDimension(state, axis, dimension, packageModel) {
  var result = cloneState(state);
  result[axis] = _.filter(result[axis], function(value) {
    return value != dimension;
  });

  // Update `source` and `target` when changing group
  if (axis == 'groups') {
    result.drilldown = [];

    var orderByIsGroup = result.measures.indexOf(result.orderBy.key) == -1;
    if (orderByIsGroup) {
      result.orderBy.key = _.first(result.measures);
      result.orderBy.direction = defaultOrderByDirection;
    }

    updateSourceTarget(result, packageModel);
  }

  return result;
}

function clearDimensions(state, axis) {
  var result = cloneState(state);
  result[axis] = [];

  if (axis == 'groups') {
    result.drilldown = [];
    result.source = undefined;
    result.target = undefined;

    var orderByIsGroup = result.measures.indexOf(result.orderBy.key) == -1;
    if (orderByIsGroup) {
      result.orderBy.key = _.first(result.measures);
      result.orderBy.direction = defaultOrderByDirection;
    }
  }

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
      result.groups = [nextGroup.key];
      result.drilldown.push({
        dimension: groupKey,
        filter: drillDownValue
      });
    }
  }

  updateSourceTarget(result, packageModel);

  return result;
}

function applyBreadcrumb(state, breadcrumb, packageModel) {
  var result = cloneState(state);

  var index = breadcrumb.index;
  var length = result.drilldown.length;
  if (_.isArray(result.drilldown)) {
    if ((index >= 0) && (index < length)) {
      // Change group and remove the rest drilldown levels
      // (dimensions + filters)
      result.groups = [result.drilldown[index].dimension];
      result.drilldown.splice(index, length);
      updateSourceTarget(result, packageModel);
    }
  }

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

  updateSourceTarget(params, packageModel);
}

function initParamsForTimeSeries(params, packageModel) {
  var measure = _.first(packageModel.measures);

  params.measures = [measure.key];
  params.groups = [];
  params.series = [];
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
    if (dimension && dimension.values) {
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

function getDefaultDateTimeFilter(params, packageModel) {
  var result = {};

  var dateTimeDimension = _.find(packageModel.dimensions, {
    key: params.dateTimeDimension
  });
  if (
    dateTimeDimension &&
    _.isArray(dateTimeDimension.values) &&
    (dateTimeDimension.values.length > 1)
  ) {
    var filters = params.filters[dateTimeDimension.key] || [];
    if (filters.length == 0) {
      result[dateTimeDimension.key] = [
        _.chain(dateTimeDimension.values)
          .map(function(item) {
            return item.key;
          })
          .max()
          .value()
      ];
    }
  }

  return result;
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
  params.drilldown = [];

  // Filter by largest datetime dimension value for some types
  switch (visualization.type) {
    case 'location':
    case 'drilldown':
    case 'pivot-table':
      _.extend(params.filters, getDefaultDateTimeFilter(params, packageModel));
      break;
  }
}

function clearParams(params, packageModel) {
  params.measures = [];
  params.groups = [];
  params.series = [];
  params.rows = [];
  params.columns = [];
  params.source = undefined;
  params.target = undefined;
  params.filters = {};
  params.orderBy = {};
  params.visualizations = [];
  params.drilldown = [];
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
    clearParams(result, packageModel);
  }
  return result;
}

function removeAllVisualizations(state, packageModel) {
  var result = cloneState(state);
  result.visualizations = [];
  clearParams(result, packageModel);
  return result;
}

function updateFromParams(state, urlParams, packageModel) {
  urlParams = normalizeUrlParams(urlParams || {}, packageModel);
  urlParams = validateUrlParams(urlParams, packageModel);
  var result = _.extend(cloneState(state), getDefaultState(), urlParams);
  updateSourceTarget(result, packageModel);
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
module.exports.updateFromParams = updateFromParams;
