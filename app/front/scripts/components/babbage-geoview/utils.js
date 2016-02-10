'use strict';

var _ = require('underscore');
var d3 = require('d3');

var ordinalColorScale = null;

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

function updateValues(geoJson, options) {
  var sum = 0;
  var max = null;
  _.each(geoJson.features, function(item) {
    item.value = options.data[item.properties.name] || 0;
    sum += item.value;
    if ((max === null) || (item.value > max)) {
      max = item.value;
    }
  });

  _.each(geoJson.features, function(item) {
    item.percentValue = item.value / (sum || 1);
    item.normalizedValue = item.value / (max || 1);

    //item.color = d3.rgb(options.color(index));
    //item.color = d3.rgb(options.color(item.percentValue));
    item.color = d3.rgb(options.color(item.normalizedValue));
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
      return d.properties.name + ': ' + d.value;
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
      return '<span>' + datum.properties.name + '</span>: <b>' +
        datum.value + '</b>';
    }
  };
}

module.exports.getOrdinalColorScale = getOrdinalColorScale;
module.exports.getLinearColorScale = getLinearColorScale;
module.exports.createPath = createPath;
module.exports.prepareGeoJson = prepareGeoJson;
module.exports.updateDimensions = updateDimensions;
module.exports.updateScales = updateScales;
module.exports.updateValues = updateValues;
module.exports.setSelection = setSelection;
