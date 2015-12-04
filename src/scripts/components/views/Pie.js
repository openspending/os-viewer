import React, { Component } from 'react'
import { PieChart } from 'react-d3'
import { chartDataMappers } from '../../utils'

class Pie extends Component {
  render() {
    const { data, ui } = this.props;
    const measure = _.first(ui.selections.measures);
    const label = ui.selections.dimensions.groups;
    let processedData = [];
    if (measure) {
      processedData = chartDataMappers.pie(data, measure, label);
    }
    return (
      <PieChart
        data={(processedData)}
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
