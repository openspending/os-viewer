import React, { Component } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'
import _ from 'lodash';

class Table extends Component {
  render() {
    const { headers, data } = this.props;
    let slicedData = data.slice(0, 500);
    return (
      <BootstrapTable responsive striped>
        <thead>
          <tr>
            {headers.map(function(header, key) {
              return <td key={ key }>{header.toUpperCase()}</td>
            })}
          </tr>
        </thead>
        <tbody>
          {slicedData.map(function(row, rowKey) {
            return <tr key={ rowKey }>
              {headers.map(function(header, key) {
                return <td key={ key }>{row[header]}</td>
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
    )
  }
}

export default Table
