/**
 * Created by Ihor Borysyuk on 26.01.16.
 */

;(function (angular) {

  var app = angular.module('Application');
  app.factory('ApiService', ['$q', '_', 'downloader', 'SettingsService', function ($q, _, downloader, SettingsService) {
    return {
      getPackages: function () {
        return SettingsService.get('api').then(function(api_settings){
          var url_api_all_packages = api_settings.url + '/cubes';

          return downloader.get(url_api_all_packages).then(function (text) {
            var result = [];
            try {
              var packages = JSON.parse(text);
              result = _.pluck(packages.data, 'name');
            } catch (e) {
            }
            return result;
          })

        });
      },

      getPackage: function (packageName) {
        return SettingsService.get('api').then(function(api_settings){
          var url_api_package = api_settings.url + '/info/{packageName}/package';
          return downloader.get(url_api_package.replace('{packageName}', packageName)).then(function (text) {
            var result = {};
            try {
              result = JSON.parse(text);
            } catch (e) {
            }
            return result;
          })
        });
      },

      getPackageModelInfo: function (packageName) {
        return SettingsService.get('api').then(function(api_settings){
          var url_api_package_model = api_settings.url + '/cubes/{packageName}/model';
          return downloader.get(url_api_package_model.replace('{packageName}', packageName)).then(function (text) {
            var result = {};
            try {
              result = JSON.parse(text);
            } catch (e) {
            }
            return result;
          })
        });
      },

      getPackageModel: function (packageName) {
        var that = this;
        var packageModel = {dimensions:{}, measures: {}};

        return that.getPackageModelInfo(packageName).then(function (packageModelInfo){
          //fill measures
          console.log(packageModelInfo);
          packageModel.measures.items = {};
          _.each(packageModelInfo.model.aggregates, function (value, key) {
            if (value.measure) {
              packageModel.measures.items[key] = value.label;
            }
          });
          packageModel.measures.current = _.first(_.keys(packageModel.measures.items));

          //hierarchy
          var hierarchies = {};
          _.each(packageModelInfo.model.hierarchies, function (hierarchy, key) {
            hierarchies[key] = {};
            for(var i=1; i<hierarchy.levels.length; i++){
              hierarchies[key][hierarchy.levels[i-1]] = packageModelInfo.model.dimensions[hierarchy.levels[i]];
            }
          });

          //fill dimensions
          var promises = [];
          var items = [];
          _.each(packageModelInfo.model.dimensions, function (value, key) {
            var dimension_values_key_field = value.key_ref;
            var dimension_values_label_field = value.label_ref;
            promises.push(that.getDimensionValues(packageName, key).then(function (values) {
              var result = {};
              var values_keys = {};

              _.each(values.data, function (value) {
                values_keys[value[dimension_values_label_field]] = value[dimension_values_key_field];

                result[value[dimension_values_key_field]] =
                  (dimension_values_key_field == dimension_values_label_field) ?
                    value[dimension_values_key_field] :
                    (value[dimension_values_key_field] + ' | ' + value[dimension_values_label_field]);

              });

              if (_.keys(result).length > 1){
                var drillDownDimension = undefined;
                if (
                  value.hierarchy &&
                  hierarchies[value.hierarchy] &&
                  hierarchies[value.hierarchy][key]
                ){
                  drillDownDimension = hierarchies[value.hierarchy][key].label;
                }

                items.push( {
                  key: value.label,
                  code: value.label,
                  name: value.attributes[value.key_attribute].column ,
                  label: value.hierarchy + '.' + value.label_attribute,
                  drillDown: drillDownDimension,
                  values: result,
                  values_keys: values_keys
                });
              }
            }));
          });

          return $q.all(promises).then(function(){
            packageModel.dimensions.items = _.sortBy(items, function(item){
              return item.name;
            });
            return packageModel;
          });
        });
      },

      getDimensionValues: function (packageName, dimension) {
        return SettingsService.get('api').then(function(api_settings) {

          var url_api_dimension_values = api_settings.url + '/cubes/{packageName}/members/{dimension}';
          return downloader.get(
            url_api_dimension_values.replace('{packageName}', packageName)
              .replace('{dimension}', dimension)
          ).then(function (text) {
            var result = {};
            try {
              result = JSON.parse(text);
            } catch (e) {
            }
            return result;
          })
        });
      },
    }
  }]);

})(angular);