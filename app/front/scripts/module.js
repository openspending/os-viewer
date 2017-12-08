'use strict';

var Promise = require('bluebird');
var angular = require('angular');
require('angular-marked');
require('angular-filter');
require('angular-animate');

if (globalConfig.snippets.raven) {
  var Raven = require('raven-js');
  Raven
    .config(globalConfig.snippets.raven, {logger: 'os-viewer-angular'})
    .addPlugin(require('raven-js/plugins/angular'), angular)
    .install();
}

var isAuthModuleAvailable = false;
try {
  isAuthModuleAvailable = !!angular.module('authClient.services');
} catch (e) {
}
if (!isAuthModuleAvailable) {
  // Fake auth library
  angular.module('authClient.services', [])
    .value('authenticate', {
      check: function() {
        return new Promise(function() {});
      },
      login: function() {},
      logout: function() {}
    })
    .value('authorize', {
      check: function() {
        return new Promise(function() {});
      }
    });
}

var visualizations = require('./services/visualizations');

window['@@sealer_hook'] = false;

var config = {
  sealerHook: function(delay) {
    delay = parseInt(delay, 10) || 0;
    setTimeout(function() {
      window['@@sealer_hook'] = true;
    }, delay > 0 ? delay : 0);
  },
  events: {
    packageSelector: {
      change: 'packageSelector.change'
    },
    history: {
      back: 'history.back',
      forward: 'history.forward'
    },
    visualizations: {
      add: 'visualizations.add',
      remove: 'visualizations.remove',
      removeAll: 'visualizations.removeAll',
      hideModals: 'visualizations.hideModals',
      drillDown: 'visualizations.drillDown',
      changeOrderBy: 'visualizations.changeOrderBy',
      showShareModal: 'visualizations.showShareModal',
      breadcrumbClick: 'visualizations.breadcrumbClick'
    },
    sidebar: {
      listItemChange: 'sidebar.listItemChange',
      changeMeasure: 'sidebar.changeMeasure',
      changeDimension: 'sidebar.changeDimension',
      clearDimension: 'sidebar.clearDimension',
      setFilter: 'sidebar.setFilter',
      clearFilter: 'sidebar.clearFilter'
    }
  },
  colorScales: {
    categorical: d3.scale.category10,
    constant: function() {
      return function() {
        return '#1f78b4';
      };
    }
  }
};

var moduleDeps = [
  'ngAnimate',
  'hc.marked',
  'angular.filter',
  'authClient.services'
];
if (globalConfig.snippets.raven) {
  moduleDeps.unshift('ngRaven');
}
console.log(moduleDeps);
var ngModule = angular.module('Application', moduleDeps)
  .constant('Configuration', config)
  .config([
    '$httpProvider', '$compileProvider', '$logProvider', '$locationProvider',
    'markedProvider',
    function($httpProvider, $compileProvider, $logProvider, $locationProvider,
      markedProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|file|javascript):/);
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = false;
      $logProvider.debugEnabled(true);

      $locationProvider.html5Mode(true);

      markedProvider.setOptions({gfm: true});
    }
  ])
  .run([
    '$rootScope', '$location', 'i18n', 'Configuration',
    function($rootScope, $location, i18n, Configuration) {
      $rootScope.isLoading = {
        application: true
      };

      i18n.setLanguage($location.search().lang);

      // "Suffix": scale, "Suffix 2": scale2
      Configuration.formatValue = visualizations.formatValue(
        i18n('Value Formatting Scale'));
    }
  ]);

module.exports = ngModule;
