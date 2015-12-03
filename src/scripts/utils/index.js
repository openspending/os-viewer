import _ from 'lodash'
import { actions, loaders } from 'fiscaldata-js';

export function dataToSingleSeries(
  collection,
  value = 'projected',
  label = 'category'
) {
  function mapper(object) {
    return { value: object[value], label: object[label] }
  }
  return _.map(collection, mapper)
}

export function bindActions(dispatch) {
  let result = {};

  result.loadFiscalDataPackage = function(url) {
    loaders.fdp(url).then(function(data) {
      dispatch(actions.setDefaultStateTree(data.ui));
      dispatch(actions.setDefaultStateTree(data.data));
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
