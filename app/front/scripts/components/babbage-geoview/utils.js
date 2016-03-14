'use strict';

var _ = require('underscore');
var d3 = require('d3');

var ordinalColorScale = null;

var defaultOptions = {
  coloringStepsCount: 5
};

function getOrdinalColorScale() {
  if (!ordinalColorScale) {
    var categoryColors = [
      '#CF3D1E', '#F15623', '#F68B1F', '#FFC60B', '#DFCE21',
      '#BCD631', '#95C93D', '#48B85C', '#00833D', '#00B48D',
      '#60C4B1', '#27C4F4', '#478DCB', '#3E67B1', '#4251A3', '#59449B',
      '#6E3F7C', '#6A246D', '#8A4873', '#EB0080', '#EF58A0', '#C05A89'
    ];
    ordinalColorScale = d3.scale.ordinal()
      .range(categoryColors);
  }
  return ordinalColorScale;
}

function getLinearColorScale(color) {
  var c = d3.hsl(color);
  c.l = 0.925;
  return d3.scale.linear()
    .domain([0.0, 1.0])
    .range([c, color]);
}

function calculateDimensions(geoJson) {
  var bounds = d3.geo.bounds(geoJson);
  return {
    left: bounds[0][0],
    top: bounds[0][1],
    right: bounds[1][0],
    bottom: bounds[1][1]
  };
}

function calculateCenter(dimensions) {
  return [
    (dimensions.left + dimensions.right) / 2,
    (dimensions.top + dimensions.bottom) / 2
  ];
}

function calculateScale(pathBounds, viewportBounds) {
  return Math.min(
    viewportBounds.width / Math.abs(pathBounds[0][0] - pathBounds[1][0]),
    viewportBounds.height / Math.abs(pathBounds[0][1] - pathBounds[1][1])
  );
}

function createPath(options) {
  options.dimensions = calculateDimensions(options.geoObject);

  var projection = d3.geo.mercator()
    // Set initial scale to 1 instead of default - needed for auto-fit feature
    .scale(1)
    .translate([options.width / 2, options.height / 2]);

  return d3.geo.path()
    .projection(projection);
}

function updateDimensions(geoJson, options) {
  var path = options.path;
  _.each(geoJson.features, function(item) {
    item.dimensions = calculateDimensions(item);
    item.center = calculateCenter(item.dimensions);
    item.unscaledBounds = path.bounds(item);
  });

  geoJson.dimensions = calculateDimensions(geoJson);
  geoJson.center = calculateCenter(geoJson.dimensions);
  geoJson.unscaledBounds = path.bounds(geoJson);
}

// This algorithm is used to find min and max value for coloring range.
// Values array may contain several values that are 100 or more times larger
// then other values. In this case, we'll have few fully colored regions
// on map, and other ones will be desaturated (because all of them has
// 100 times less values, comparing to max). So this function applies
// median filter with adaptive window to array of values, and then takes min
// and max values. This makes min/max range much closer to most values in array.
function findMedianRange(values) {
  var min = null;
  var max = null;
  var radius = Math.ceil(values.length / 5);
  if (radius > 10) {
    radius = 10;
  }

  if (values.length > 0) {
    _.each(values, function(value, index) {
      var sum = 0;
      var j = 0;
      for (var i = index - radius; i <= index + radius; i++) {
        j = i;
        // Normalize index to array bounds
        if (j < 0) {
          j = values.length + j;
        }
        if (j >= values.length) {
          j = j - values.length;
        }
        // Use value
        sum += values[j];
      }
      sum = sum / (2 * radius + 1);
      if ((min === null) || (sum < min)) {
        min = sum;
      }
      if ((max === null) || (sum > max)) {
        max = sum;
      }
    });
  }

  var result = [min, max];
  result.min = min;
  result.max = max;
  return result;
}

function updateValues(geoJson, options) {
  var values = [];
  _.each(geoJson.features, function(item) {
    item.value = options.data[item.properties.name];
    if (!_.isUndefined(item.value)) {
      values.push(item.value);
    }
  });
  var range = findMedianRange(values);

  var scale = d3.scale.linear()
    .domain(range)
    .range([0, 1])
    .clamp(true);

  geoJson.valueRange = range;

  _.each(geoJson.features, function(item) {
    var scaledValue = _.isUndefined(item.value) ? 0 : scale(item.value);

    if (options.coloringStepsCount !== false) {
      var n = options.coloringStepsCount || defaultOptions.coloringStepsCount;
      scaledValue = Math.ceil(scaledValue * n) / n;
    }

    item.color = d3.rgb(options.color(scaledValue));
  });
}

function updateScales(geoJson, options) {
  _.each(geoJson.features, function(item) {
    item.scale = calculateScale(item.unscaledBounds, options) * 0.7;
  });
  geoJson.scale = calculateScale(geoJson.unscaledBounds, options) * 0.95;
}

function prepareGeoJson(geoJson, options) {
  updateDimensions(geoJson, options);
  updateScales(geoJson, options);
  updateValues(geoJson, options);
}

function formatValue(value, currencySign) {
  if (_.isUndefined(value)) {
    return 'N/A';
  }
  return formatAmount(value, currencySign);
}

function formatAmount(value, currencySign) {
  var suffixes = [
    [1000000000, ' Billions'],
    [1000000, ' Millions'],
    [1000, ' Thousands']
  ];
  var suffix = '';
  for (var i = 0; i < suffixes.length; i++) {
    if (value > suffixes[i][0]) {
      value = value / suffixes[i][0];
      suffix = suffixes[i][1];
      break;
    }
  }

  var result = (new Number(value)).toFixed(2) + suffix;
  if (currencySign) {
    result += ' ' + currencySign;
  }

  return result;
}

function setSelection(datum, options) {
  return {
    current: function() {
      return datum;
    },
    className: function(d) {
      if (d == datum) {
        return 'selected';
      }
      return '';
    },
    hideLabels: function() {
      if (!datum) {
        return 'on';
      }
      return options.width < 600 ? 'on' : null;
    },
    strokeColor: function(d) {
      if (!datum || (d == datum)) {
        return d.color.darker(3);
      }
      return '#7f7f7f';
    },
    fillColor: function(d) {
      if (!datum || (d == datum)) {
        return d.color;
      }
      return '#fafafa';
    },
    title: function(d) {
      var result = '';
      if (d.properties.name) {
        result += d.properties.name + ': ';
      }
      result += formatValue(d.value, options.currencySign);
      return result;
    },
    text: function(d) {
      return d.properties.name;
    },
    textPosition: function(d) {
      return 'translate(' + options.path.centroid(d) + ')';
    },
    textFill: function(d) {
      if (!datum || (d == datum)) {
        return '#272727';
      }
      return '#7f7f7f';
    },
    textSize: function(d) {
      return d == datum ? '22px' : '11px';
    },
    info: function() {
      if (!datum) {
        return false;
      }
      var result = '';
      if (datum.properties.name) {
        result += '<span>' + datum.properties.name + '</span>: ';
      }
      result += '<b>' + formatValue(datum.value, options.currencySign) + '</b>';

      return result;
    },
    currencySign: function(value) {
      if (arguments.length > 0) {
        options.currencySign = value;
      } else {
        return options.currencySign;
      }
    }
  };
}

function generateValueRanges(range, stepCount) {
  stepCount = stepCount || defaultOptions.coloringStepsCount;
  var scale = d3.scale.linear()
    .domain([0, 1])
    .range(range);
  var result = [];

  result.push({
    scaledValue: 0,
    value: scale(0),
    isMin: true
  });
  stepCount --;
  for (var i = 1; i < stepCount; i++) {
    var v = i / stepCount;
    result.push({
      scaledValue: v,
      value: scale(v)
    });
  }
  result.push({
    scaledValue: 1,
    value: scale(1),
    isMax: true
  });
  return result;
}

module.exports.defaults = defaultOptions;
module.exports.getOrdinalColorScale = getOrdinalColorScale;
module.exports.getLinearColorScale = getLinearColorScale;
module.exports.createPath = createPath;
module.exports.prepareGeoJson = prepareGeoJson;
module.exports.updateDimensions = updateDimensions;
module.exports.updateScales = updateScales;
module.exports.updateValues = updateValues;
module.exports.setSelection = setSelection;
module.exports.formatAmount = formatAmount;
module.exports.generateValueRanges = generateValueRanges;
