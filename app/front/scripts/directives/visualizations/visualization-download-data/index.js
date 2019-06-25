'use strict';

var url = require('url');
var ngModule = require('../../../module');
var visualizationsService = require('../../../services/visualizations');
var babbageApi = require('babbage.ui/lib/api');


function getUrl(params) {
  var api = new babbageApi.Api();
  var endpoint = params.babbageApiUrl;
  var cube = params.packageId;
  var state = visualizationsService.paramsToBabbageState(params);

  var aggregateUrl = api.buildAggregateUrl(endpoint, cube, state, params.model);
  var parsedUrl = url.parse(aggregateUrl, true);

  // url.format() only uses the .query object if there's no .search
  delete parsedUrl.search;
  parsedUrl.query.format = 'csv';

  return url.format(parsedUrl);
}

ngModule.directive('visualizationDownloadData', [
  function() {
    return {
      template: require('./template.html'),
      replace: false,
      restrict: 'E',
      scope: {
        params: '='
      },
      link: function($scope, element) {
        $scope.$watch('params', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.url = getUrl(newValue);
          }
        }, true);

        $scope.url = getUrl($scope.params);
      }
    };
  }
]);
