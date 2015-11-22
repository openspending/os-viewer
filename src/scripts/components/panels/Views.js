import React, { Component } from 'react'
import { Row, Col, ButtonGroup, Button, Tabs, Tab } from 'react-bootstrap'
import { Treemap, Table, Pie } from '../views'

class Views extends Component {
  render() {
    const { data, model } = this.props
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
        <Col xs={12} md={8}>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="Treemap"><Treemap data={data.base} /></Tab>
            <Tab eventKey={2} title="Pie Chart"><Pie data={data.base} /></Tab>
          </Tabs>
        </Col>
        <Col xs={12} md={4}>
          <Table headers={data.headers} data={data.base} />
        </Col>
      </Row>
    )
  }
}

export default Views
