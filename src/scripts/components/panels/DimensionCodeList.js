import React, { Component } from 'react';
import { ButtonGroup, DropdownButton, MenuItem, Col, Row } from 'react-bootstrap';
import  SelectedFilters from './SelectedFilters';
import DimensionsGroups from './DimensionsGroups';
import _ from 'lodash';

class DimensionCodeList extends Component {
  handleClick(event, fieldName, value) {
    event.preventDefault();
    event.returnValue = false;

    const { actions } = this.props;
    actions.changeFilter(fieldName, value);

    return false;
  }

  render() {
    const { dimensions, actions, headers, ui } = this.props;
    const self = this;
    let validDimensions = _.pick(dimensions, function (item) {
      return item.values.length > 1;
    });
    return (
      <Row>
        <Col xs={12}>
          <div>Group</div>
          <DimensionsGroups dimensions={validDimensions} headers={headers}
                            selected={ui.selections.dimensions.groups}
                            actions={actions}/>
        </Col>
        <Col xs={12} className="margin-top-8">
          <div>Filter</div>
          <ButtonGroup id="data-filter-buttons">
            {_.map(validDimensions, function (value, key) {
              return <DropdownButton id={ 'filter-' + key }
                                     title={headers[key].title} key={ key }>
                {value.values.map(function (option, innerKey) {
                  return <MenuItem key={ innerKey } eventKey={option}
                                   onClick={(event) => self.handleClick(event, key, option)}>{option}</MenuItem>
                })}
              </DropdownButton>
            })}
          </ButtonGroup>
        </Col>
        <Col xs={12} className="margin-top-8">
          <SelectedFilters filters={ui.selections.dimensions.filters}
                           headers={headers} actions={actions}/>
        </Col>
      </Row>
    )
  }
}

export default DimensionCodeList;
