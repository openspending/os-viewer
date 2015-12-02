import React, { Component, PropTypes } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import _ from 'lodash'

class MeasureCodeList extends Component {
  render() {
    const { measures } = this.props
    return (
      <ButtonGroup>
        {_.keys(measures).map(function(measure) {
          return <Button active key={measure}>{measure.toUpperCase()}</Button>
        })}
      </ButtonGroup>
    )
  }
}
export default MeasureCodeList
