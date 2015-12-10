import React, { Component, PropTypes } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import _ from 'lodash'

class DimensionsGroups extends Component {
  toggleGroups(event, fieldName) {
    event.preventDefault();
    event.returnValue = false;

    const { actions, selected } = this.props;
    actions.changeGroup(fieldName, !_.contains(selected, fieldName));

    return false;
  }
  render() {
    const { dimensions, headers, selected } = this.props;
    const self = this;
    return (
      <Row>
        <Col xs={12}>
          <ButtonGroup>
            {_.map(dimensions, function (value, key) {
              let isSelected = _.contains(selected, key);
              return <Button active={isSelected} bsStyle={isSelected ? 'success' : 'default'}
                key={ key } onClick={(event) => self.toggleGroups(event, key)}>{headers[key].title}</Button>
            })}
          </ButtonGroup>
        </Col>
      </Row>
    )
  }
}

export default DimensionsGroups;
