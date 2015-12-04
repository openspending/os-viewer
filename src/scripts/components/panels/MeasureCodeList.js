import React, { Component, PropTypes } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
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
      <ButtonGroup>
        {_.keys(measures).map(function(measure) {
          let isSelected = _.contains(selected, measure);
          return <Button active={isSelected} bsStyle={isSelected ? 'success' : 'default'}
            key={measure} onClick={ (event) => self.toggleMeasure(event, measure) }>{ headers[measure].title }</Button>
        })}
      </ButtonGroup>
    )
  }
}
export default MeasureCodeList
