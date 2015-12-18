import React, { Component } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import _ from 'lodash'

class MoreInformation extends Component {
  render() {
    const { metaInfo } = this.props;
    return (
      <Row>
        { metaInfo &&
        <Col xs={12}>
          <h3>More information</h3>
          { metaInfo.resources && metaInfo.resources.length &&
          <div>
            <h4>Resources</h4>
            <p id="package-resources">This data package contains a resource
              called { _.pluck(metaInfo.resources, 'name').join(',') }</p>
          </div>
          }
        </Col>
        }
      </Row>
    )
  }
}

export default MoreInformation;
