import React, { Component } from 'react'
import { chartDataMappers } from '../../utils'
import BubbleTreeConstructor from 'bubbletree';

var randomData = (function() {
  var randomNames = ['Burgis', 'Pascal', 'Lysann', 'Theo', 'Julia', 'Barnabas',
    'Immanuel', 'Marisa', 'Folker', 'Hadumod', 'Friedegunde', 'Marco', 'Otto',
    'Sonnhardt', 'Arntraud', 'Andree', 'Wiltrudis', 'Astrid', 'Kathrein',
    'Raoul', 'Vivien', 'Ole', 'Leo', 'Dankward', 'David', 'Ferfried',
    'Sonngard', 'Fabio', 'Hansjakob', 'Huberta', 'Doro', 'Gordian', 'Sturmius',
    'Sturmhard', 'Reintraud', 'Sabine', 'Georg', 'Sylvia', 'Ann', 'Editha',
    'Gunhard', 'Etienne', 'Hildtraud', 'Noah', 'Margarete', 'Stilla', 'Brian',
    'Pauline', 'Edgar', 'Kathrin'];
  var nodeCount = 1;

  function generateRandomData(node, level) {
    if (!level) level = 1;
    var numChildren = 3 + Math.round(Math.random() * 5);
    node.children = [];
    var amount = node.amount;
    for (var i = 0; i < numChildren; i++) {
      nodeCount++;
      var child = {
        label: randomNames[Number(String(level - 1) + String(i))],
        amount: i + 1 < numChildren ? amount * Math.random() * .6 : amount
      };
      amount -= child.amount;
      node.children.push(child);
      if (level < 3) {
        generateRandomData(child, level + 1);
      }
    }
    return node;
  }

  return generateRandomData({
    label: 'Random data',
    amount: 100000000,
    color: '#2996cc'
  });
})();

class BubbleTree extends Component {
  updateBubbleTree() {
    new BubbleTreeConstructor({
      data: randomData,
      container: this.refs.container
    });
  }
  componentDidMount() {
    this.updateBubbleTree();
  }
  componentDidUpdate() {
    this.updateBubbleTree();
  }
  render() {
    return (
      <div className="bubbletree" ref="container" style={{width: '100%', height: '400px'}} />
    )
  }
}

export default BubbleTree
