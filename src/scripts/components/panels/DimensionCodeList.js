import React, { Component } from 'react'
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import { objectMap } from '../../utils'

class DimensionCodeList extends Component {
  handleClick(e, filterName, filterValue) {
    e.preventDefault()
    let filters = {};
    filters[filterName] = filterValue;

    this.props.onFilter(filters);
    return false;
  }
  render() {
    const { dimensions } = this.props
    const self = this;
    return (
      <ButtonGroup>
        {objectMap(dimensions, function (key, value) {
          return <DropdownButton title={key.toUpperCase()} id="dropdown-size-medium">
            {value.values.map(function(option) {
              return <MenuItem key={option} eventKey={option} onClick={(e) => self.handleClick(e, key, option)}>{option}</MenuItem>
            })}
          </DropdownButton>
        })}
      </ButtonGroup>
    )
  }
}

export default DimensionCodeList
