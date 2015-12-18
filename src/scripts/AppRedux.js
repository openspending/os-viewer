/**
 * Created by Ihor Borysyuk on 15.12.15.
 */

import React, { Component, PropTypes  } from 'react'
import { Provider } from 'react-redux'
import App from './containers/App'
import {actions, store} from 'fiscaldata-js'

class AppRedux extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

export default AppRedux