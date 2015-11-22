import 'babel-polyfill'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { App } from './containers'

const state = {
  "model": {},
  "data": {}
}

render(
  <App model={state.model} data={state.data} />,
  document.getElementById('application')
)
