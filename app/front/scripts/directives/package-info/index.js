'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('packageInfo', [
    'LoginService',
    function(login) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          datapackage: '=',
          modelInfo: '='
        },
        link: function($scope) {
          $scope.login = login;

          function updateInfo(dataPackage, model) {
            $scope.datamineUrl = null;
            if (model && model.fact_table) {
              var query =
                "/* This is a sample query, go ahead and modify it! */\n" +
                "SELECT *\n" +
                "FROM " + model.fact_table + "\n" +
                "LIMIT 10";
              query = encodeURIComponent(query);
              $scope.datamineUrl =
                "http://rd.openspending.org/queries/new?queryText="+query+
                "&focusedTable="+model.fact_table+
                "&jwt="+login.getToken();
            }

            $scope.packageUrl = null;
            $scope.resources = [];

            // jscs:disable
            var originUrl = dataPackage && dataPackage.__origin_url ?
              dataPackage.__origin_url :
                ['http://datastore.openspending.org',
                 dataPackage.owner,
                 dataPackage.name,
                 'datapackage.json'].join('/');
            // jscs:enable

            if (originUrl) {
              $scope.packageUrl = originUrl;

              var baseUrl = ('' + originUrl).split('/');
              baseUrl.pop();
              baseUrl = baseUrl.join('/') + '/';

              $scope.resources = _.chain(dataPackage.resources)
                .map(function(resource) {
                  var resourceUrl = null;
                  if (resource.url) {
                    resourceUrl = resource.url;
                  }
                  if (resource.path) {
                    resourceUrl = baseUrl + resource.path;
                  }

                  if (resourceUrl) {
                    return {
                      name: resource.name,
                      url: resourceUrl
                    };
                  }
                })
                .filter()
                .value();
            }
          }
          updateInfo($scope.datapackage, $scope.modelInfo);
          $scope.$watch('datapackage', function() {
            updateInfo($scope.datapackage, $scope.modelInfo);
          });
          $scope.$watch('login.isLoggedIn', function() {
            updateInfo($scope.datapackage, $scope.modelInfo);
          });
        }
      };
    }
  ]);
