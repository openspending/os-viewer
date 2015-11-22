import React, { Component } from 'react'
import { Row, Col, Panel } from 'react-bootstrap'
import { MeasureCodeList, DimensionCodeList } from './index'
import _ from 'lodash'

class Actions extends Component {
  render() {
    const { data, model } = this.props
    const { measures, dimensions } = data.codeLists
    return (
      <Row>
        <Col xs={12} md={4}>
          {!_.isEmpty(measures) &&
            <Panel header='Measures'>
              <MeasureCodeList measures={measures} />
            </Panel>
          }
        </Col>
        <Col xs={12} md={8}>
          {!_.isEmpty(dimensions) &&
            <Panel header='Dimensions'>
              <DimensionCodeList dimensions={dimensions} />
            </Panel>
          }
        </Col>
      </Row>
    )
  }
}

export default Actions
