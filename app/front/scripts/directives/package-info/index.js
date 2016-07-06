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
          datapackage: '='
        },
        link: function($scope) {
          $scope.login = login;

          function updateDataMineUrl(dataPackage) {
            $scope.datamineUrl = null;
            if (!dataPackage) {
              return;
            }

            var token = login.getToken();
            if (dataPackage.factTable && token) {
              var query = 'SELECT * FROM ' + dataPackage.factTable +
                ' LIMIT 10';
              $scope.datamineUrl =
                'http://rd.openspending.org/queries/new?queryText=' +
                encodeURIComponent(query) + '&focusedTable=' +
                encodeURIComponent(dataPackage.factTable) +
                '&jwt=' + token;
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
