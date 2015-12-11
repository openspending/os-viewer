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
  constructor() {
    super();
    this.bubbleTree = null;
  }
  recreateBubbleTree() {
    this.bubbleTree = new BubbleTreeConstructor({
      data: randomData,
      container: this.refs.container
    });
  }
  updateBubbleTree() {
    var self = this;
    setTimeout(function() {
      if (!!self.bubbleTree) {
        try {
          self.bubbleTree.onResize();
        } catch(e) {
        }
      }
      self.updateBubbleTree();
    }, 500);
  }
  componentDidMount() {
    this.recreateBubbleTree();
  }
  componentDidUpdate() {
    this.recreateBubbleTree();
  }
  render() {
    this.updateBubbleTree();
    return (
      <div style={{width: '100%', paddingTop: '60%', position: 'relative'}}>
        <div className="bubbletree" ref="container" style={{position: 'absolute', left: '0px', top: '0px', width: '100%', height: '100%'}} />
      </div>
    )
  }
}

export default BubbleTree
