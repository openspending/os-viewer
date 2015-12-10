import React, { Component, PropTypes  } from 'react'
import { Row, Col, Panel } from 'react-bootstrap'
import { MeasureCodeList, DimensionCodeList } from './index'
import _ from 'lodash'

class Actions extends Component {
  render() {
    const { model, actions, headers, ui } = this.props;
    return (
      <Row>
        <Col xs={12} md={4}>
          {!_.isEmpty(model.measures) &&
            <Panel header='Measures'>
              <MeasureCodeList headers={ headers } measures={model.measures} actions={actions} selected={ui.selections.measures } ui={ui} />
            </Panel>
          }
        </Col>
        <Col xs={12} md={8}>
          {!_.isEmpty(model.dimensions) &&
            <Panel header='Dimensions'>
              <DimensionCodeList dimensions={model.dimensions} headers={ headers } actions={actions} ui={ui} />
            </Panel>
          }
        </Col>
      </Row>
    )
  }
}

Actions.propTypes = {
  model: PropTypes.object.isRequired
};

export default Actions
