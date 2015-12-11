import React, { Component } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'
import _ from 'lodash';

class Table extends Component {
  render() {
    const { headers, data } = this.props;
    let slicedData = data.slice(0, 500);
    return (
      <div className="x-smaller-font margin-top-8">
        <BootstrapTable responsive striped condensed>
          <thead>
            <tr>
              {_.map(headers, function(header, key) {
                return <td key={ key }>{ header.title }</td>
              })}
            </tr>
          </thead>
          <tbody>
            {slicedData.map(function(row, rowKey) {
              return <tr key={ rowKey }>
                {_.map(headers, function(header, key) {
                  return <td key={ key }>{ row[key] }</td>
                })}
              </tr>
            })}
            {
              (data.length > slicedData.length) &&
              <tr>
                <td
                  colSpan={headers.length}>{ '...and ' + (data.length - slicedData.length) + ' more rows' }</td>
              </tr>
            }
          </tbody>
        </BootstrapTable>
      </div>
    )
  }
}

export default Table
