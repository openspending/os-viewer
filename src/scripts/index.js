import React from 'react'
import { render } from 'react-dom'
//import { createStore } from 'redux'
//import { Provider } from 'react-redux'
//import App from './containers/App'
//import {actions, store} from 'fiscaldata-js'

import AppRedux from './AppRedux'

// webpack
import './../styles/app.scss'

const rootElement = document.getElementById('root');
render(
    <AppRedux />,
  rootElement
)
