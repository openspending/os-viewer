import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

class MeasureCodeList extends Component {
  render() {
    const { measures } = this.props
    return (
      <ButtonGroup>
        {measures.map(function(measure) {
          return <Button>{measure.toUpperCase()}</Button>
        })}
      </ButtonGroup>
    )
  }
}

export default MeasureCodeList
