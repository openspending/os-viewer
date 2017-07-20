'use strict';

var url = require('url');
var ngModule = require('../../../module');
var babbageApi = require('babbage.ui/lib/api');


function getUrl(params) {
  var api = new babbageApi.Api();
  var endpoint = params.babbageApiUrl;
  var cube = params.packageId;

  return api.buildAggregateUrl(endpoint, cube, params)
    .then(function(_url) {
      var parsedUrl = url.parse(_url, true);

      // url.format() only uses the .query object if there's no .search
      delete parsedUrl.search;
      parsedUrl.query.format = 'csv';

      return url.format(parsedUrl);
    });
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
            getUrl(newValue).then(function(url) {
              $scope.url = url;
            });
          }
        }, true);

        getUrl($scope.params).then(function(url) {
          $scope.url = url;
        });
      }
    };
  }
]);
