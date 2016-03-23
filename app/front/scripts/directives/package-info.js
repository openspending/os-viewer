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

              if (dataPackage && dataPackage.__origin_url) {
                $scope.packageUrl = dataPackage.__origin_url;

                var baseUrl = ('' + dataPackage.__origin_url).split('/');
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
