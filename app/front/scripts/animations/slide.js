'use strict';

var ngModule = require('../module');

ngModule.animation('.slide-animation', [
  function() {
    return {
      enter: function(element, doneFn) {
        $(element).hide().slideDown(350, doneFn);
      },
      leave: function(element, doneFn) {
        $(element).slideUp(350, doneFn);
      }
    };
  }
]);
