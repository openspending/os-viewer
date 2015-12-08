import React, { Component, PropTypes } from 'react';
import { Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';

class LoadData extends Component {
  handleClick(event, packageUrl) {
    event.preventDefault();
    event.returnValue = false;

    const { actions } = this.props;
    actions.loadFiscalDataPackage(packageUrl);

    return false;
  }

  componentDidMount() {
    const { packages, actions } = this.props;
    actions.loadFiscalDataPackage(_.first(packages));
  }

  render() {
    const { packages, currentPackageUrl } = this.props;
    const self = this;
    return (
      <Row className="margin-bottom-16">
        <Col xs={12}>
          {packages.length > 1 &&
          <DropdownButton id={ 'package-selector' }
            title={ currentPackageUrl || 'None' }>
            {_.map(packages, function(packageUrl, key) {
              return <MenuItem key={ 'package-' + key } eventKey={ packageUrl }
                onClick={(event) => self.handleClick(event, packageUrl)}>{ packageUrl }</MenuItem>
            })}
          </DropdownButton>
          }
          {packages.length == 1 &&
            <div className="form-control-static">{ 'Package: ' + (currentPackageUrl || 'None') }</div>
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
