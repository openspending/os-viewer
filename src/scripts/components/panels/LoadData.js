import React, { Component, PropTypes } from 'react';
import { Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';

class LoadData extends Component {
  handleClick(event, packageUrl) {
    event.preventDefault();
    event.returnValue = false;

    const { actions, metaInfo } = this.props;
    if (!metaInfo || (packageUrl != metaInfo.url)) {
      actions.loadFiscalDataPackage(packageUrl);
    }

    return false;
  }

  render() {
    const { packages, metaInfo } = this.props;
    const self = this;
    return (
      <Row className="margin-bottom-16">
        {metaInfo && metaInfo.title &&
        <Col xs={12}><h4>{ metaInfo.title }</h4></Col>}
        {metaInfo && metaInfo.description &&
        <Col xs={12}>{ metaInfo.description }</Col>}
        <Col xs={12}>
          {packages.length > 1 &&
          <DropdownButton id={ 'package-selector' }
            title={ metaInfo ? metaInfo.url : 'None' }>
            {_.map(packages, function(packageUrl, key) {
              return <MenuItem key={ 'package-' + key } eventKey={ packageUrl }
                onClick={(event) => self.handleClick(event, packageUrl)}>{ packageUrl }</MenuItem>
            })}
          </DropdownButton>
          }
          {packages.length == 1 &&
          <div className="form-control-static">{ 'Package: ' + (metaInfo ? metaInfo.url : 'None') }</div>
          }
          {packages.length == 0 &&
          <div className="form-control-static">{ 'No packages available.' }</div>
          }
        </Col>
      </Row>
    )
  }
}

export default LoadData;
