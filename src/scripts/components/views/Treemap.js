import React, { Component } from 'react'
import { Treemap as D3Treemap } from 'react-d3'
import { dataToSingleSeries } from '../../utils'

class Treemap extends Component {
  render() {
    const { data } = this.props
    const chartData = dataToSingleSeries(data)
    return (
      <D3Treemap
        data={chartData}
        width={450}
        height={250}
        textColor="#484848"
        fontSize="12px"
        title="Treemap"
        hoverAnimation={false}
      />
    )
  }
}

export default Treemap
