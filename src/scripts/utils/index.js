import _ from 'lodash'
import { ActionCreators } from 'redux-undo'
import { actions, loaders } from 'fiscaldata-js';

export const chartDataMappers = {};

export function formatAmountWithSuffix(n) {
  var prefix = '';
  if (n < 0) {
    n = -1 * n;
    prefix = '-';
  }
  if (n >= 1000000000000) {
    return prefix + Math.round(n / 100000000000) / 10 + 't';
  }
  if (n >= 1000000000) {
    return prefix + Math.round(n / 100000000) / 10 + 'b';
  }
  if (n >= 1000000) {
    return prefix + Math.round(n / 100000) / 10 + 'm';
  }
  if (n >= 1000) {
    return prefix + Math.round(n / 100) / 10 + 'k';
  }
  return prefix + n;
}

chartDataMappers.collectData = function(collection, value, label) {
  return _.map(collection, function(item) {
    let val = item[value];
    let lbl = val;
    if (_.isString(label) || (_.isArray(label) && label.length)) {
      lbl = _.chain(item).pick(label).values().value().join(', ');
    }
    return {
      value: val,
      label: lbl
    }
  });
};

chartDataMappers.reduceData = function(collection, reduceLimit) {
  if (collection.length > reduceLimit) {
    collection = _.chain(collection)
      .sortBy('value')
      .reverse()
      .value();

    let compare = collection[reduceLimit].value;
    let result = [];
    let aggr = {
      value: 0.0,
      label: 'Other'
    };
    _.each(collection, function(item) {
      if (item.value >= compare) {
        result.push(item);
      } else {
        aggr.value += item.value;
      }
    });
    result.push(aggr);
    return result;
  }
  return collection;
};

chartDataMappers.pie = function(collection, value, label) {
  let result = _.chain(chartDataMappers.collectData(collection, value, label))
    .filter(function(item) {
      return item.value > 0;
    })
    .value();

  // Do some additional aggregation on large arrays
  return chartDataMappers.reduceData(result, 20);
};

chartDataMappers.treeMap = function(collection, value, label) {
  let result = _.chain(chartDataMappers.collectData(collection, value, label))
    .filter(function(item) {
      return item.value > 0;
    })
    .value();
  // Do some additional aggregation on large arrays
  return chartDataMappers.reduceData(result, 50);
};

chartDataMappers.bubbleTree = function(collection, value, label) {
  let result = _.chain(chartDataMappers.collectData(collection, value, label))
    .filter(function(item) {
      return item.value > 0;
    })
    .value();
  // Do some additional aggregation on large arrays
  result = chartDataMappers.reduceData(result, 50);
  return {
    label: 'Total',
    amount: _.sum(_.pluck(result, 'value')),
    children: _.map(result, function(item) {
      return {
        label: item.label,
        amount: item.value
      }
    })
  }
};

export function bindActions(dispatch) {
  let result = {};

  result.loadFiscalDataPackage = function(url) {
    dispatch(actions.resetStateTree());
    dispatch(actions.fdpLoading());
    loaders.fdp(url, {}, {
      //proxy: 'http://gobetween.oklabs.org/pipe/{url}',
      onMetaInfoLoaded: (meta) => {
        dispatch(actions.fdpMetaInfoLoaded(meta))
      }
    }).then(function(data) {
      dispatch(actions.setDefaultState(data));
      dispatch(actions.fdpLoaded());
    });
  };

  result.changeMeasure = function(fieldName, isSelected) {
    let measures = {};
    measures[fieldName] = !!isSelected;
    dispatch(actions.selectMeasure(measures));
  };

  result.changeFilter = function(fieldName, value) {
    let filters = {};
    filters[fieldName] = value || null;
    dispatch(actions.setDimensionFilter(filters));
  };

  result.changeGroup = function(fieldName, isSelected) {
    let groups = {};
    groups[fieldName] = !!isSelected;
    dispatch(actions.setGroupField(groups));
  };

  result.undo = function() {
    dispatch(ActionCreators.undo());
  };

  result.redo = function() {
    dispatch(ActionCreators.redo());
  };

  return result;
}
