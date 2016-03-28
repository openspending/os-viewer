;(function(angular) {

  var customComponents = require('components');

    angular.module('Application', [
    'ngAnimate',
    //'ngBabbage',
    'angular.filter',
    'hc.marked',
    'authClient.services'
  ]);

  var pieDirective =
    new customComponents.babbage.PieChartDirective();

  var chartDirective =
    new customComponents.babbage.ChartDirective();

  var treemapDirective =
    new customComponents.babbage.TreemapDirective();

  var bubbleTreeDirective =
    new customComponents.babbage.BubbleTreeDirective();

  var tableDirective = new
    customComponents.babbage.BabbageTableDirective();

  var geoViewDirective = new
    customComponents.babbage.GeoViewDirective();

  var app = angular.module('Application');
  pieDirective.init(app);
  chartDirective.init(app);
  treemapDirective.init(app);
  tableDirective.init(app);
  bubbleTreeDirective.init(app);
  geoViewDirective.init(app);

})(angular);
