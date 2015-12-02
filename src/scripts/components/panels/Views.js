import React, { Component } from 'react'
import { Row, Col, ButtonGroup, Button, Tabs, Tab } from 'react-bootstrap'
import { Treemap, Table, Pie } from '../views'

class Views extends Component {
  render() {
    const { data, headers } = this.props
    const currentData = data
    return (
      <Row>
        <Col xs={12} md={12}>
          <h2>
            Views
            <ButtonGroup className='pull-right'>
              <Button className='fa fa-arrow-left' />
              <Button className='fa fa-arrow-right' />
            </ButtonGroup>
          </h2>
        </Col>

        <Col xs={12} md={4}>
          <Table headers={headers} data={currentData} />
        </Col>
      </Row>
    )
  }
}

export default Views
