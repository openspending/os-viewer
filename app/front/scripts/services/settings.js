;(function(angular) {
  var downloader = require('components').downloader;

  var app = angular.module('Application');
  app.factory('SettingsService',
    ['_', '$q', function(_, $q) {
      var _settings = {};
      return {
        load: function() {
          return downloader.get('settings.json').then(function(data) {
            var result = {};
            try {
              result = JSON.parse(data);
            } catch (e) {
            }
            _settings = result;
            return _settings;
          });
        },

        get: function(key) {
          if (_.isEmpty(_settings)) {
            return this.load().then(function() {
              return $q.resolve(_settings[key]);
            });
          } else {
            return $q.resolve(_settings[key]);
          }
        }
      };
    }]);
})(angular);
