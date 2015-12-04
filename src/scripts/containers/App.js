import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { loaders } from 'fiscaldata-js';
import _ from 'lodash';

import { Header, LoadData, Actions, Views, Footer } from '../components';
import { bindActions } from '../utils';

class App extends Component {
  render() {
    const { dispatch, data, ui, currentData } = this.props;
    const headers = data.fields;
    const actions = bindActions(dispatch);
    return (
      <div>
        <Header />
        <div className='container'>
          <LoadData actions={actions} />
          {data.flags.isLoaded &&
          <Actions model={data.model} headers={ headers } actions={actions} ui={ui}/>
          }
          {data.flags.isLoaded &&
          <Views data={ currentData } headers={ headers } ui={ui}/>
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
    data: state.data,
    ui: state.ui,
    currentData: loaders.getCurrentData(state)
  }
}

export default connect(select)(App);
