import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Tabs, Tab } from 'react-bootstrap';
import { Treemap, Table, Pie } from '../views';
import _ from 'lodash';

class Views extends Component {
  render() {
    const { data, headers, ui, actions } = this.props;
    return (
      <Row>
        <Col xs={12} md={12}>
          <h2>
            Views
            <ButtonGroup className='pull-right'>
              <Button className='fa fa-arrow-left' onClick={(event) => actions.undo()} />
              <Button className='fa fa-arrow-right' onClick={(event) => actions.redo()} />
            </ButtonGroup>
          </h2>
        </Col>

        <Col xs={12} md={8}>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="Pie Chart">
              <div className="margin-top-8">
                <Pie data={ data } ui={ ui } />
              </div>
            </Tab>
            <Tab eventKey={2} title="Treemap">
              <div className="margin-top-8">
                <Treemap data={ data } ui={ ui } />
              </div>
            </Tab>
          </Tabs>
        </Col>

        <Col xs={12} md={4}>
          <Table headers={ headers } data={ data } />
        </Col>
      </Row>
    )
  }
}

export default Views
