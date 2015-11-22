import React, { Component } from 'react'
import { PieChart } from 'react-d3'
import { dataToSingleSeries } from '../../utils'

class Pie extends Component {
  render() {
    const { data } = this.props
    const chartData = dataToSingleSeries(data)
    return (
      <PieChart
        data={chartData}
        width={400}
        height={400}
        radius={100}
        innerRadius={20}
        sectorBorderColor="white"
        title="Pie Chart"
      />
    )
  }
}

export default Pie
