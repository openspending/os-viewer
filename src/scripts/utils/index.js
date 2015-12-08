import _ from 'lodash'
import { actions, loaders } from 'fiscaldata-js';

export const chartDataMappers = {};

function decimalRound2(value) {
  return Math.round(value * 100) / 100;
}

chartDataMappers.collectData = function(collection, value, label) {
  let sum = 0.0;
  _.each(collection, function(item) {
    sum += parseFloat(item[value]);
  });
  return _.map(collection, function(item) {
    let val = decimalRound2(parseFloat(item[value]) / sum * 100);
    let lbl = val + '%';
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
    aggr.value = decimalRound2(aggr.value);
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

export function bindActions(dispatch) {
  let result = {};

  result.loadFiscalDataPackage = function(url) {
    dispatch(actions.resetStateTree());
    loaders.fdp(url).then(function(data) {
      dispatch(actions.setDefaultUi(data.ui));
      dispatch(actions.setDefaultData(data.data));
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

  return result;
}
