'use strict';

var _ = require('lodash');
var angular = require('angular');
var template = require('./template.html');
var dataPackageAPI = require('../../services/data-package-api');
var osViewerService = require('../../services/os-viewer');

angular.module('Application')
  .directive('packageInfo', [
    'LoginService',
    function(login) {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          datapackage: '='
        },
        link: function($scope) {
          $scope.login = login;

          function updateDataMineUrl(dataPackage) {
            $scope.datamineUrl = null;
            if (!dataPackage) {
              return;
            }

            var theme = osViewerService.theme.get()
            if (theme.dataMine) {
              var dataMinePath = theme.dataMine.path;

              if (_.includes(dataMinePath, '{query}')) {
                if (!theme.dataMine.query) return;
                var query = theme.dataMine.query;
                if (_.includes(query, '{factTable}')) {
                  if (!dataPackage.factTable) return;
                  query = _.replace(query, '{factTable}', dataPackage.factTable);
                }
                dataMinePath = _.replace(dataMinePath, '{query}', encodeURIComponent(query));
              }
              if (_.includes(dataMinePath, '{factTable}')) {
                if (!dataPackage.factTable) return;
                dataMinePath = _.replace(dataMinePath, '{factTable}', encodeURIComponent(dataPackage.factTable));
              }
              if (_.includes(dataMinePath, '{token}')) {
                var token = login.getToken();
                if (!token) return;
                dataMinePath = _.replace(dataMinePath, '{token}', token);
              }
              $scope.datamineUrl = dataPackageAPI.dataMineConfig.url + dataMinePath;
            }
          }

          updateDataMineUrl($scope.datapackage);
          $scope.$watch('datapackage', function() {
            updateDataMineUrl($scope.datapackage);
          });
          $scope.$watch('login.isLoggedIn', function() {
            updateDataMineUrl($scope.datapackage);
          });
        }
      };
    }
  ]);
