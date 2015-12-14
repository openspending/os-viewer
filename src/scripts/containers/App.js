import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { loaders } from 'fiscaldata-js';
import _ from 'lodash';

import { Header, LoadData, Actions, Views, Footer } from '../components';
import { bindActions } from '../utils';

class App extends Component {
  render() {
    const { dispatch, data, ui, currentData, dataPackages, flags } = this.props;
    const headers = data.fields;
    const actions = bindActions(dispatch);

    let metaInfo = null;
    if (flags.isLoaded) {
      //metaInfo = flags.meta;
    } else
    if (flags.fdpMetaInfoLoaded) {
      metaInfo = flags.meta;
    }

    return (
      <div>
        <Header />
        <div className='container'>
          <LoadData actions={ actions } packages={ dataPackages } metaInfo={ metaInfo } />

          { flags.isLoaded ?
            <div>
              <Actions model={data.model} headers={ headers } actions={actions} ui={ui}/>
              <Views
                data={ currentData }
                headers={ headers }
                ui={ui}
                actions={actions}
                undoDisabled={this.props.undoDisabled}
                redoDisabled={this.props.redoDisabled}
              />
            </div>
            :
            <div className="waiter">
              <i className="fa fa-spinner fa-pulse fa-4x"></i><span>Loading...</span>
            </div>
          }

        </div>
        <Footer />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

function select(state) {
  return {
    undoDisabled: state.app.past.length <= 1,
    redoDisabled: state.app.future.length === 0,
    data: state.app.present.data,
    ui: state.app.present.ui,
    flags: state.flags,
    currentData: loaders.getCurrentData(state.app.present),
    dataPackages: _.isArray(dataPackages) ? dataPackages : [] // Global variable
  }
}

export default connect(select)(App);
