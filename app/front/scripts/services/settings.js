'use strict';

var _ = require('lodash');
var angular = require('angular');

var downloader = require('../components/downloader');

angular.module('Application')
  .factory('SettingsService', [
    '$q',
    function($q) {
      var settings = {};
      return {
        load: function() {
          return downloader.get('settings.json').then(function(data) {
            var result = {};
            try {
              result = JSON.parse(data);
            } catch (e) {
            }
            settings = result;
            return settings;
          });
        },

        get: function(key) {
          if (_.isEmpty(settings)) {
            return this.load().then(function() {
              return $q.resolve(settings[key]);
            });
          } else {
            return $q.resolve(settings[key]);
          }
        }
      };
    }
  ]);
