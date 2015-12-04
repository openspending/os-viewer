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
