'use strict';

var babbage = require('babbage.ui/lib/bindings/angular');
var babbageApiExporter = require('babbage.ui/lib/api/exporter');

var ngModule = require('../module');

// Init babbage.ui
var pieDirective = new babbage.PieChartDirective();
var chartDirective = new babbage.ChartDirective();
var treeMapDirective = new babbage.TreemapDirective();
var bubbleTreeDirective = new babbage.BubbleTreeDirective();
var tableDirective = new babbage.BabbageTableDirective();
var geoViewDirective = new babbage.GeoViewDirective();
var pivotTableDirective = new babbage.PivotTableDirective();
var factsDirective = new babbage.FactsDirective();
var sankeyDirective = new babbage.SanKeyChartDirective();
var radarDirective = new babbage.RadarChartDirective();

pieDirective.init(ngModule);
chartDirective.init(ngModule);
treeMapDirective.init(ngModule);
tableDirective.init(ngModule);
bubbleTreeDirective.init(ngModule);
geoViewDirective.init(ngModule);
pivotTableDirective.init(ngModule);
factsDirective.init(ngModule);
sankeyDirective.init(ngModule);
radarDirective.init(ngModule);

babbageApiExporter.setExportFunc(function(key, value) {
  window[key] = value;
});

// Application directives
require('./autoselect');
require('./confirmation-popover');
require('./filter-list');
require('./history-navigation');
require('./package-selector');
require('./package-info');
require('./popover');
require('./sidebar');
require('./visualizations');
require('./param-controls');
