import 'babel-polyfill'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { App } from './containers'

// webpack
import '../styles/app.scss'

const mockStateTree = {
  "model": {
    "measures": {
      "projected": {
        "currency": "USD"
      },
      "adjusted": {
        "currency": "USD"
      }
    },
    "dimensions": {
      "category": {
        "type": "functional",
        "values": ["Education", "Arts"] // Calculated from data.values
      },
      "year": {
        "type": "date",
        "values": [2010, 2011, 2012, 2013, 2014] // Calculated from data.values
      }
    }
  },
  "data": {
    "headers": ["projected", "adjusted", "year", "category"],
    "values": [
      {"projected": 10, "adjusted": 12, "year": 2010, "category": "Education"},
      {"projected": 20, "adjusted": 12, "year": 2011, "category": "Education"},
      {"projected": 30, "adjusted": 19, "year": 2012, "category": "Education"},
      {"projected": 40, "adjusted": 34, "year": 2013, "category": "Education"},
      {"projected": 50, "adjusted": 56, "year": 2014, "category": "Education"},
      {"projected": 100, "adjusted": 397, "year": 2010, "category": "Arts"},
      {"projected": 200, "adjusted": 299, "year": 2011, "category": "Arts"},
      {"projected": 300, "adjusted": 302, "year": 2012, "category": "Arts"},
      {"projected": 400, "adjusted": 376, "year": 2013, "category": "Arts"},
      {"projected": 500, "adjusted": 617, "year": 2014, "category": "Arts"}
    ],
    "selections": {
      "measures": ["projected"], // always only one for measures
      "dimensions": { // always at least one for dimensions
        "filters": { "year": 2014 },
        "sum": ["category"]
      }
    },
    "states": {
      "previous": [], // sequence of data objects. filtered to a view state
      "current": [ // The current data object for the view state
        {"projected": 50, "adjusted": 56, "year": 2014, "category": "Education"},
        {"projected": 500, "adjusted": 617, "year": 2014, "category": "Arts"}
      ],
      "future": [] // sequence of data objects. filtered to a view state
    }
  }
}

render(
  <App data={mockStateTree.data} model={mockStateTree.model} />,
  document.getElementById('application')
)
