'use strict';

var _ = require('lodash');
var $ = require('jquery');

function calculateMetrics(table) {
  var result = {
    // dimensions in pixels of each side
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };

  var cell;

  // last row:
  // "Total" | col1 | ... | colN | total
  cell = table.find('tbody .pvtTotalLabel');
  result.left = cell.outerWidth() + 1;
  result.bottom = cell.outerHeight() + 1;

  cell = table.find('tbody .pvtGrandTotal');
  result.right = cell.last().outerWidth() + 1;

  // last cell is spanned to all header rows
  cell = table.find('thead .pvtTotalLabel');
  result.top = cell.outerHeight() + 1;

  return result;
}

function createPlaceholders(container, metrics) {
  return {
    left: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.left + 'px',
      height: metrics.height + 'px'
    }).appendTo(container),

    right: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.right + 'px',
      height: metrics.height + 'px'
    }).appendTo(container),

    top: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.width + 'px',
      height: metrics.top + 'px'
    }).appendTo(container),

    bottom: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.width + 'px',
      height: metrics.bottom + 'px'
    }).appendTo(container),

    topLeft: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.left + 'px',
      height: metrics.top + 'px'
    }).appendTo(container),

    topRight: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.right + 'px',
      height: metrics.top + 'px'
    }).appendTo(container),

    bottomLeft: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.left + 'px',
      height: metrics.bottom + 'px'
    }).appendTo(container),

    bottomRight: $('<div>').css({
      position: 'absolute',
      overflow: 'hidden',
      width: metrics.right + 'px',
      height: metrics.bottom + 'px'
    }).appendTo(container)
  };
}

function lockTable(table) {
  table.css({
    boxSizing: 'border-box',
    width: table.outerWidth(),
    height: table.outerHeight()
  });

  var selector = _.chain([
    '.pvtAxisLabel',
    '.pvtColLabel',
    '.pvtGrandTotal',
    '.pvtRowLabel',
    '.pvtTotal',
    '.pvtTotalLabel'
  ])
    .flatMap(function(item) {
      return ['td' + item, 'th' + item];
    })
    .join(',')
    .value();

  table.find(selector).each(function() {
    var cell = $(this);
    cell.css({
      boxSizing: 'border-box',
      width: cell.outerWidth(),
      height: cell.outerHeight()
    });
  });
}

function createFragments(table, placeholders, metrics) {
  var tableWidth = table.outerWidth();
  var tableHeight = table.outerHeight();
  var emptyTable = table.clone().empty();

  // Clone first cells except of cells with data and totals
  placeholders.left.append((function() {
    var tbody = $('<tbody>');
    table.find('tr').each(function() {
      var row = $('<tr>').append(
        $(this).find()
      );
      $('th, td', this).each(function() {
        var cell = $(this);
        if (cell.is('.pvtVal, .pvtColLabel, .pvtTotal')) {
          return false;
        }
        row.append(cell.clone());
      });
      tbody.append(row);
    });
    return emptyTable.clone().append(tbody).css({
      width: metrics.left + 'px',
      height: tableHeight + 'px'
    });
  })());

  // Clone last cell in each row
  placeholders.right.append((function() {
    var tbody = $('<tbody>');
    table.find('tr').each(function() {
      var cell = this.cells[this.cells.length - 1];
      tbody.append($('<tr>').append($(cell).clone()));
    });
    return emptyTable.clone().append(tbody).css({
      width: metrics.right + 'px',
      height: tableHeight + 'px'
    });
  })());

  // Clone header
  placeholders.top.append((function() {
    var rows = table.find('thead tr');
    return emptyTable.clone().append(
      $('<tbody>').append(rows.clone())
    ).css({
      width: tableWidth + 'px',
      height: metrics.top + 'px'
    });
  })());

  // Clone last row
  placeholders.bottom.append((function() {
    var rows = table.find('tbody tr:last');
    return emptyTable.clone().append(
      $('<tbody>').append(rows.clone())
    ).css({
      width: tableWidth + 'px',
      height: metrics.bottom + 'px'
    });
  })());

  // Clone first cells in header except of cells with data and totals
  placeholders.topLeft.append((function() {
    var tbody = $('<tbody>');
    table.find('thead tr').each(function() {
      var row = $('<tr>').append(
        $(this).find()
      );
      $('th, td', this).each(function() {
        var cell = $(this);
        if (cell.is('.pvtVal, .pvtColLabel, .pvtTotal')) {
          return false;
        }
        row.append(cell.clone());
      });
      tbody.append(row);
    });
    return emptyTable.clone().append(tbody).css({
      width: metrics.left + 'px',
      height: metrics.top + 'px'
    });
  })());

  // Pick the last cell from header
  placeholders.topRight.append((function() {
    var cell = table.find('thead .pvtTotalLabel').first();
    return emptyTable.clone().append(
      $('<tbody>').append($('<tr>').append(cell.clone()))
    ).css({
      width: metrics.right + 'px',
      height: metrics.top + 'px'
    });
  })());

  // Pick cells from the last row
  placeholders.bottomLeft.append((function() {
    var cell = table.find('tbody .pvtTotalLabel').first();
    return emptyTable.clone().append(
      $('<tbody>').append($('<tr>').append(cell.clone()))
    ).css({
      width: metrics.left + 'px',
      height: metrics.bottom + 'px'
    });
  })());

  placeholders.bottomRight.append((function() {
    // last cell in the last row
    var cell = table.find('tbody .pvtGrandTotal');
    return emptyTable.clone().append(
      $('<tbody>').append($('<tr>').append(cell.clone()))
    ).css({
      width: metrics.right + 'px',
      height: metrics.bottom + 'px'
    });
  })());
}

function updatePlaceholders(placeholders, metrics, scrollLeft, scrollTop) {
  var leftPosition = scrollLeft;
  var rightPosition = scrollLeft + metrics.width - metrics.right;
  var topPosition = scrollTop;
  var bottomPosition = scrollTop + metrics.height - metrics.bottom;

  placeholders.left.css({
    left: leftPosition + 'px',
    top: topPosition + 'px',
    height: metrics.height + 'px'
  }).scrollTop(scrollTop);

  placeholders.right.css({
    left: rightPosition + 'px',
    top: topPosition + 'px',
    height: metrics.height + 'px'
  }).scrollTop(scrollTop);

  placeholders.top.css({
    left: leftPosition + 'px',
    top: topPosition + 'px',
    width: metrics.width + 'px'
  }).scrollLeft(scrollLeft);

  placeholders.bottom.css({
    left: leftPosition + 'px',
    top: bottomPosition + 'px',
    width: metrics.width + 'px'
  }).scrollLeft(scrollLeft);

  placeholders.topLeft.css({
    left: leftPosition + 'px',
    top: topPosition + 'px'
  });

  placeholders.topRight.css({
    left: rightPosition + 'px',
    top: topPosition + 'px'
  });

  placeholders.bottomLeft.css({
    left: leftPosition + 'px',
    top: bottomPosition + 'px'
  });

  placeholders.bottomRight.css({
    left: rightPosition + 'px',
    top: bottomPosition + 'px'
  });
}

function initialize(element) {
  element = $(element);
  var table = element.find('table');

  lockTable(table);

  element.css({
    position: 'relative',
    overflow: 'auto'
  });

  var metrics = calculateMetrics(table);
  metrics.width = Math.min(element.prop('clientWidth'), table.outerWidth());
  metrics.height = Math.min(element.prop('clientHeight'), table.outerHeight());
  var placeholders = createPlaceholders(element, metrics);

  updatePlaceholders(placeholders, metrics,
    element.scrollLeft(), element.scrollTop());

  createFragments(table, placeholders, metrics);

  element.on('scroll', function() {
    updatePlaceholders(placeholders, metrics,
      element.scrollLeft(), element.scrollTop());
  });

  var previousBounds = element.get(0).getBoundingClientRect();

  function update() {
    previousBounds = element.get(0).getBoundingClientRect();
    metrics.width = Math.min(element.prop('clientWidth'),
      table.outerWidth());
    metrics.height = Math.min(element.prop('clientHeight'),
      table.outerHeight());
    updatePlaceholders(placeholders, metrics,
      element.scrollLeft(), element.scrollTop());
  }

  return {
    update: function() {
      update();
      return true;
    },
    resize: function() {
      var result = false;
      var bounds = element.get(0).getBoundingClientRect();
      var widthChanged = bounds.width != previousBounds.width;
      var heightChanged = bounds.height != previousBounds.height;
      if (widthChanged || heightChanged) {
        update();
        result = true;
      }
      previousBounds = bounds;
      return result;
    }
  };
}

module.exports = initialize;
