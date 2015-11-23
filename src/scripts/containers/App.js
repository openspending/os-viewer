import React, { Component } from 'react'
import { Actions, Header, Footer, Views } from '../components'

class App extends Component {
  render() {
    const { data, model } = this.props
    return (
      <div>
        <Header />
        <div className='container'>
          <Actions model={model} />
          <Views data={data} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default App
