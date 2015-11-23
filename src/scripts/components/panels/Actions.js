import React, { Component } from 'react'
import { Row, Col, Panel } from 'react-bootstrap'
import { MeasureCodeList, DimensionCodeList } from './index'
import _ from 'lodash'

class Actions extends Component {
  render() {
    const { model } = this.props
    return (
      <Row>
        <Col xs={12} md={4}>
          {!_.isEmpty(model.measures) &&
            <Panel header='Measures'>
              <MeasureCodeList measures={model.measures} />
            </Panel>
          }
        </Col>
        <Col xs={12} md={8}>
          {!_.isEmpty(model.dimensions) &&
            <Panel header='Dimensions'>
              <DimensionCodeList dimensions={model.dimensions} />
            </Panel>
          }
        </Col>
      </Row>
    )
  }
}

export default Actions
