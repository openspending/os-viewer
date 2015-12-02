import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'

import {actions, loaders} from 'fiscaldata-js'
import { Header, LoadData, Actions, Views, Footer } from '../components'

class App extends Component {

  loadDataFromFDP(dataSource) {
    const { dispatch } = this.props
    loaders.fdp(dataSource).then(function (data) {
      console.log('=====================loadDataFromFDP=========================');
      console.log(data);
      dispatch(actions.setDefaultStateTree(data.ui));
      dispatch(actions.setDefaultStateTree(data.data));
    });
  }

  render() {
    const { dispatch, data, currentData } = this.props
    return (
      <div>
        <Header />
        <div className='container'>

          <LoadData onLoadSubmit={text => this.loadDataFromFDP(text) }/>

          <Actions
            model={data.model}
            onFilter={filters => dispatch(actions.setVisibilityFilter(filters)) }
            ui={data.ui}
          />

        <Views data={currentData} headers={data.headers}  />

        </div>

        <Footer />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

function select(state) {
  console.log('******************* STATE *******************');
  console.log(state.data);
  return {
    data: state.data,
    currentData: state.data.values,
    currentData: loaders.getCurrentData(state)
  }
}

export default connect(select)(App)
