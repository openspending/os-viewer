import _ from 'lodash'

export function objectMap(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

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
