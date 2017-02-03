'use strict';

var _ = require('lodash');
var papaparse = require('papaparse');
var TextEncoder = require('text-encoding').TextEncoder;

function processCell(rows, rowIndex, colspan, rowspan, text) {
  var colIndex = 0;
  while (rows[rowIndex][colIndex] !== undefined) {
    colIndex ++;
  }

  for (var rs = 0; rs < rowspan; rs++) {
    for (var cs = 0; cs < colspan; cs++) {
      rows[rowIndex + rs][colIndex + cs] = text;
      text = '';
    }
  }
}

function getCSVDataFromTable(table) {
  var rows = _.map(table.rows, function() {
    return [];
  });

  _.forEach(table.rows, function(tableRow, rowIndex) {
    _.forEach(tableRow.cells, function(tableCell) {
      tableCell = $(tableCell);
      var text = tableCell.text();

      var colspan = parseInt(tableCell.attr('colspan'));
      if (!isFinite(colspan) || (colspan < 1)) {
        colspan = 1;
      }

      var rowspan = parseInt(tableCell.attr('rowspan'));
      if (!isFinite(rowspan) || (rowspan < 1)) {
        rowspan = 1;
      }

      processCell(rows, rowIndex, colspan, rowspan, text);
    });
  });

  // There may be short rows; pad them to avoid PapaParse error
  var maxRowLength = _.max(_.map(rows, function(row) {
    return row.length;
  }));
  _.forEach(rows, function(row) {
    while (row.length < maxRowLength) {
      row.push('');
    }
  });

  return rows;
}

function createCSVFile(data, encoding) {
  if (!_.isString(data)) {
    if (_.isArray(data)) {
      data = papaparse.unparse(data);
    } else {
      data = '';
    }
  }

  var encoder = null;
  try {
    encoder = new TextEncoder(encoding, {
      // Allow encodings other that utf-8
      NONSTANDARD_allowLegacyEncoding: true
    });
  } catch (error) {
    encoding = 'utf-8';  // fallback
    encoder = new TextEncoder(encoding);
  }

  var bytes = encoder.encode(data);
  return new Blob([bytes], {
    type: 'text/csv;charset=' + encoding
  });
}

module.exports.getCSVDataFromTable = getCSVDataFromTable;
module.exports.createCSVFile = createCSVFile;
