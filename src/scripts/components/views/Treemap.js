import _ from 'lodash'
import React, { Component } from 'react'
import { Treemap as D3Treemap } from 'react-d3'
import { chartDataMappers } from '../../utils'

class Treemap extends Component {
  render() {
    const { data, ui } = this.props;
    const measure = _.first(ui.selections.measures);
    const label = ui.selections.dimensions.groups;
    let processedData = [];
    if (measure) {
      processedData = chartDataMappers.treeMap(data, measure, label);
    }
    return (
      <D3Treemap
        data={processedData}
        width={600}
        height={400}
        textColor="#484848"
        fontSize="12px"
        hoverAnimation={true}
      />
    )
  }
}

export default Treemap
