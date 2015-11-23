import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import _ from 'lodash'

class MeasureCodeList extends Component {
  render() {
    const { measures } = this.props
    return (
      <ButtonGroup>
        {_.keys(measures).map(function(measure) {
          return <Button>{measure.toUpperCase()}</Button>
        })}
      </ButtonGroup>
    )
  }
}

export default MeasureCodeList
