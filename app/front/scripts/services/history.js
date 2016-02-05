/**
 * Created by Ihor Borysyuk on 05.02.16.
 */

;(function(angular) {

  var app = angular.module('Application');

  app.factory('HistoryService', ['_', function(_) {
    var _histories = [];
    var _index = -1;

    return {
      back: function(){
        if (this.canBack()) {
          _index--;
          console.log('----History Log Start-------');
          console.log(_index);
          console.log('----History Log End-------');
          return JSON.parse(_histories[_index]);
        }
      },

      forward: function() {
        if (this.canForward()) {
          _index++;
          return JSON.parse(_histories[_index]);
        }
      },

      pushState: function(state) {
        if (_index >= 0) {
          _histories.splice(_index+1, Number.MAX_VALUE);
        }
        _histories.push(JSON.stringify(state));
        _index = _histories.length-1;
      },

      canBack: function() {
        return _index > 0;
      },

      canForward: function() {
        return _index < _histories.length-1;
      }
    };
  }]);

})(angular);
