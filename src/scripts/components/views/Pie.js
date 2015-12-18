import _ from 'lodash'
import React, { Component } from 'react'
import { PieChart } from 'react-d3'
import { chartDataMappers, formatAmountWithSuffix } from '../../utils'

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
      <PieChart id="pie"
        data={(processedData)}
        width={600}
        height={600}
        radius={200}
        innerRadius={20}
        sectorBorderColor="white"
        valueTextFormatter={(v) => {return formatAmountWithSuffix(v)}}
      />
    )
  }
}

export default Pie
