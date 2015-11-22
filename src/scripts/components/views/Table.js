import React, { Component } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'

class Table extends Component {
  render() {
    const { headers, data } = this.props
    return (
      <BootstrapTable responsive striped>
        <thead>
          <tr>
            {headers.map(function(header) {
              return <td>{header.toUpperCase()}</td>
            })}
          </tr>
        </thead>
        <tbody>
          {data.map(function(row) {
            return <tr>
              {headers.map(function(header) {
                return <td>{row[header]}</td>
              })}
            </tr>
          })}
        </tbody>
      </BootstrapTable>
    )
  }
}

export default Table
