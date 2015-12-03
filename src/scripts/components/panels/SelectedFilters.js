import React, { Component } from 'react';
import { Row, Col, Panel, Label } from 'react-bootstrap';
import _ from 'lodash'

class SelectedFilters extends Component {
  clearFilter(event, fieldName) {
    event.preventDefault();
    event.returnValue = false;

    const { actions } = this.props;
    actions.changeFilter(fieldName, null);

    return false;
  }
  render() {
    const { filters } = this.props;
    const self = this;
    return (
      <Row>
        <Col xs={12}>
          {_.map(filters, function(value, key) {
            return <Label className="margin-right-4"
              bsStyle="success">{ key }:&nbsp;{ value }&nbsp;<i onClick={(event) => self.clearFilter(event, key)}
              key={ key } className="fa fa-remove cursor-pointer" /></Label>;
          })}
        </Col>
      </Row>
    )
  }
}

export default SelectedFilters;
