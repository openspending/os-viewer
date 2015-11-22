import React, { Component } from 'react'
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import { objectMap } from '../../utils'

class DimensionCodeList extends Component {
  render() {
    const { dimensions } = this.props
    return (
      <ButtonGroup>
        {objectMap(dimensions, function (key, value) {
          return <DropdownButton title={key.toUpperCase()} id="dropdown-size-medium">
            {value.map(function(option) {
              return <MenuItem eventKey={option}>{option}</MenuItem>
            })}
          </DropdownButton>
        })}
      </ButtonGroup>
    )
  }
}

export default DimensionCodeList
