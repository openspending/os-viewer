'use strict';

var babbage = require('babbage.ui/lib/bindings/angular');

var application = angular.module('Application');

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

pieDirective.init(application);
chartDirective.init(application);
treeMapDirective.init(application);
tableDirective.init(application);
bubbleTreeDirective.init(application);
geoViewDirective.init(application);
pivotTableDirective.init(application);
factsDirective.init(application);
sankeyDirective.init(application);

// Application directives
require('./filter-list');
require('./history-navigation');
require('./package-selector');
require('./package-info');
require('./popover');
require('./sidebar');
require('./visualizations');
