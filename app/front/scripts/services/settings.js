/**
 * Created by Ihor Borysyuk on 11.02.16.
 */

;(function(angular) {
  var app = angular.module('Application');
  app.factory('SettingsService', ['downloader', '_', '$q', function(downloader, _, $q){
    var _settings = {};
    return {
      load: function () {
        return downloader.get('/settings.json').then(function (data) {
          var result  = {};
          try {
            result = JSON.parse(data);
          } catch (e){
          }
          _settings = result;
          return _settings;
        });
      },

      get: function (key) {
        if (_.isEmpty(_settings)){
          return this.load().then(function(){
            return $q.resolve(_settings[key]);
          });
        } else {
          return $q.resolve(_settings[key]);
        }
      }
    }
  }]);
})(angular)