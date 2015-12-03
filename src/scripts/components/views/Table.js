import React, { Component } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'

class Table extends Component {
  render() {
    const { headers, data } = this.props
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
          {data.map(function(row, rowKey) {
            return <tr key={ rowKey }>
              {headers.map(function(header, key) {
                return <td key={ key }>{row[header]}</td>
              })}
            </tr>
          })}
        </tbody>
      </BootstrapTable>
    )
  }
}

export default Table
