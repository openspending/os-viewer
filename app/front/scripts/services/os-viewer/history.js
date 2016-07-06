'use strict';

var _ = require('lodash');

function init() {
  return {
    items: [],
    hasNext: false,
    hasPrev: false
  };
}

function push(state) {
  var current = state.params;
  var index = _.findIndex(state.history.items, function(item) {
    return item === current;
  });

  var historyWasNotEmpty = state.history.items.length > 0;

  // If state is not already in history, then save it
  if (index == -1) {
    state.history.items.push(current);
    state.history.hasNext = false;
    state.history.hasPrev = historyWasNotEmpty;
  }
}

function trim(state) {
  var current = state.params;
  var index = _.findIndex(state.history.items, function(item) {
    return item === current;
  });
  if (index >= 0) {
    var items = state.history.items;
    items.splice(index + 1, items.length);
  }
}

function back(state) {
  var current = state.params;
  var index = _.findIndex(state.history.items, function(item) {
    return item === current;
  });

  var firstIndex = 0;

  if ((index > -1) && (index > firstIndex)) {
    state.params = state.history.items[index - 1];
    state.history.hasNext = true;
    state.history.hasPrev = index > firstIndex + 1;
  }
}

function forward(state) {
  var current = state.params;
  var index = _.findIndex(state.history.items, function(item) {
    return item === current;
  });

  var lastIndex = state.history.items.length - 1;

  if ((index > -1) && (index < lastIndex)) {
    state.params = state.history.items[index + 1];
    state.history.hasNext = index < lastIndex - 1;
    state.history.hasPrev = true;
  }
}

module.exports.init = init;
module.exports.trim = trim;
module.exports.push = push;
module.exports.back = back;
module.exports.forward = forward;
