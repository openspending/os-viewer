import React, { Component, PropTypes } from 'react'
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap'
import _ from 'lodash'

class MeasureCodeList extends Component {
  toggleMeasure(event, fieldName) {
    event.preventDefault();
    event.returnValue = false;

    const { actions, selected } = this.props;
    actions.changeMeasure(fieldName, !_.contains(selected, fieldName));

    return false;
  }

  render() {
    const { measures, headers, selected } = this.props;
    const self = this;
    return (
      <Row>
        <Col xs={12}>
          <ButtonGroup justified={true} id="measures">
            {_.keys(measures).map(function (measure) {
              let isSelected = _.contains(selected, measure);
              return <Button active={isSelected}
                             bsStyle={isSelected ? 'success' : 'default'}
                             href={'javascript:void(0)'}
                             className="text-ellipsis"
                             title={ headers[measure].title }
                             key={measure}
                             onClick={ (event) => self.toggleMeasure(event, measure) }>{ headers[measure].title }</Button>
            })}
          </ButtonGroup>
        </Col>
      </Row>
    )
  }
}
export default MeasureCodeList
