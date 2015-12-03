import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class LoadData extends Component {
  handleSubmit(event) {
    event.preventDefault();
    event.returnValue = false;

    const { actions } = this.props;
    const node = this.refs.input;
    const text = node.value.trim();
    if (text) {
      actions.loadFiscalDataPackage(text);
      node.value = text;
    }

    return false;
  }

  render() {
    return (
      <Row className="margin-bottom-16">
        <Col xs={12}>
          <form className="input-group" onSubmit={(event) => this.handleSubmit(event)}>
            <input className="form-control" type="text" placeholder="URL" ref="input" />
            <span className="input-group-btn">
              <button className="btn btn-default">Load</button>
            </span>
          </form>
        </Col>
      </Row>
    )
  }
}
