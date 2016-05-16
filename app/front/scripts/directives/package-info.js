;(function(angular) {

  angular.module('Application')
    .directive('packageInfo', [
      '_',
      function(_) {
        return {
          templateUrl: 'templates/package-info.html',
          replace: false,
          restrict: 'E',
          scope: {
            datapackage: '='
          },
          link: function($scope) {
            function updateInfo(dataPackage) {
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
            updateInfo($scope.datapackage);
            $scope.$watch('datapackage', updateInfo);
          }
        };
      }
    ]);

})(angular);
