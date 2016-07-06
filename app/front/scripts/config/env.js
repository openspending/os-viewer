'use strict';

var angular = require('angular');

var config = {
  defaultErrorHandler: function(error) {
    (console.trace || console.log || function() {})(error);
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
  }
};

angular.module('Application')
  .constant('Configuration', config);
