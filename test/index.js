/**
 * Created by Ihor Borysyuk on 15.12.15.
 */

//require('./utils/dom.js');

require('babel-core/register');

//var BubbleTree = require('../src/scripts/components/views/BubbleTree.js');


import { expect, should } from 'chai'
import _ from 'lodash'
import React from 'react/addons'

import LoadData from '../src/scripts/components/panels/LoadData'
import Header from '../src/scripts/components/panels/Header'
import Footer from '../src/scripts/components/panels/Footer'
import MoreInformation from '../src/scripts/components/panels/MoreInformation'
import SelectedFilters from '../src/scripts/components/panels/SelectedFilters'
import MeasureCodeList from '../src/scripts/components/panels/MeasureCodeList'
import DimensionsGroups from '../src/scripts/components/panels/DimensionsGroups'
import DimensionCodeList from '../src/scripts/components/panels/DimensionCodeList'
import Table from '../src/scripts/components/views/Table'
import Pie from '../src/scripts/components/views/Pie'
import Treemap from '../src/scripts/components/views/Treemap'
import { chartDataMappers } from '../src/scripts/utils'
//import BubbleTree from '../src/scripts/components/views/BubbleTree'

import sd from 'skin-deep'

describe('LoadData component', () => {
  var data = {
    packages: ['1', '2', '3'],
    metaInfo: {title: 'hello', url: 'localhost', description: 'some text',}
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(LoadData, data))
  })

  it('should correct display meta info without description and title', () => {
    let testData = _.cloneDeep(data)
    testData.metaInfo.description = ''
    testData.metaInfo.title = ''
    let tree = sd.shallowRender(React.createElement(LoadData, testData))

    expect(tree.findNode('h4')).to.equal(false)
  })

  it('should correct display meta info without description ', () => {
    let testData = _.cloneDeep(data)
    testData.metaInfo.description = ''
    let tree = sd.shallowRender(React.createElement(LoadData, testData))
    expect(tree.findNode('h4').props.children).to.equal('hello')
    expect(tree.findNode('#package-selector').props.title).to.equal('localhost')
  })

  it('should correct display meta info with description ', () => {
    let testData = _.cloneDeep(data);
    let tree = sd.shallowRender(React.createElement(LoadData, testData))
    expect(tree.findNode('h4').props.children).to.equal('hello')
    expect(tree.findNode('#package-selector').props.title).to.equal('localhost')
    expect(tree.findNode('#package-description').props.children).to.equal('some text')
  })

  it('should correct display available packages ', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(LoadData, testData))
    let packages = tree.findNode('#package-selector').props.children
    expect(packages.length).to.equal(3)

    _.forEach(packages, (pack, key) => {
      expect(pack.props.children).to.be.equal(testData.packages[key])
    })
  })

  it('should correct display 1 package ', () => {
    let testData = _.cloneDeep(data)
    testData.packages = ['1']
    let tree = sd.shallowRender(React.createElement(LoadData, testData))
    let node = tree.findNode('.form-control-static')
    expect(node).to.be.not.equal(false)
    expect(node.props.children).to.be.not.equal('No packages available.')
  })

  it('should correct display without packages ', () => {
    let testData = _.cloneDeep(data)
    testData.packages = []
    let tree = sd.shallowRender(React.createElement(LoadData, testData))
    let node = tree.findNode('.form-control-static')
    expect(node).to.be.not.equal(false)
    expect(node.props.children).to.be.equal('No packages available.')
  })
})

describe('Header component', () => {
  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Header))
  })
})

describe('Footer component', () => {
  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Footer))
  })
})

describe('MoreInformation component', () => {
  var
    data = {
      metaInfo: {
        resources: [
          {name: 'resource1'},
          {name: 'resource2'},
          {name: 'resource3'}
        ]
      }
    };

  it('should exists', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(MoreInformation, testData.metaInfo))
  })

  it('should display resources', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(MoreInformation, testData))

    expect(tree.findNode('h3')).to.be.not.equal(false);
    let node = tree.findNode('#package-resources')
    expect(node).to.be.not.equal(false)
    expect(node.props.children).to.be.contains('resource1,resource2,resource3')
  })

  it('should doesn\'t display resources if resources are empty', () => {
    let tree = sd.shallowRender(React.createElement(MoreInformation, {metaInfo: {resources: []}}))

    let node = tree.findNode('#package-resources')
    expect(node).to.be.equal(false)
  })

})

describe('SelectedFilters component', () => {
  var data = {
    filters: {'AÑO': '2014', 'PROGRAMA': '15101'},
    headers: {
      AÑO: {
        title: 'year'
      },
      PROGRAMA: {
        title: 'some program'
      }
    }
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(SelectedFilters))
  })

  it('should display all selected filters', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(SelectedFilters, testData))

    let filters = tree.findNode('#selected-filters').props.children;
    expect(filters.length).to.be.equal(2)

    _.forEach(filters, (filter, key) => {
      expect(filter.props.children).to.be.include((_.values(testData.headers))[key].title)
      expect(filter.props.children[1]).to.be.equal(': ')
      expect(filter.props.children).to.be.include((_.values(testData.filters))[key])
    });
  })

  it('should correct display without selected filters', () => {
    let testData = _.cloneDeep(data)
    testData.filters = []
    let tree = sd.shallowRender(React.createElement(SelectedFilters, testData))

    let filters = tree.findNode('#selected-filters').props.children;
    expect(filters).to.be.deep.equal([])
  })

})

describe('MeasureCodeList component', () => {
  var data = {
    measures: {
      AÑO: {},
      PROGRAMA: {}
    },
    headers: {
      AÑO: {
        title: 'year'
      },
      PROGRAMA: {
        title: 'some program'
      }
    },
    selected: 'PROGRAMA'
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(MeasureCodeList))
  })

  it('should display all measures and highlight selected measure only', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(MeasureCodeList, testData))

    let measures = tree.findNode('#measures').props.children;
    expect(measures.length).to.be.equal(2)

    _.forEach(measures, (measure, key) => {
      expect(measure.props.children).to.be.include((_.values(testData.headers))[key].title)
      expect(measure.props.active).to.be.equal(measure.props.children == testData.headers[testData.selected].title)
    });
  })
})

describe('DimensionsGroups component', () => {
  var data = {
    dimensions: {
      AÑO: {
        'type': 'Year'
      },
      PROGRAMA: {
        'type': 'program'
      }
    },
    headers: {
      AÑO: {
        title: 'year'
      },
      PROGRAMA: {
        title: 'some program'
      }
    },
    selected: 'PROGRAMA'
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(DimensionsGroups))
  })

  it('should display all group of dimensions and highlight selected group only', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(DimensionsGroups, testData))

    let dimensionGroups = tree.findNode('#dimensions-group').props.children;
    expect(dimensionGroups.length).to.be.equal(2)

    _.forEach(dimensionGroups, (dimensionGroup, key) => {
      expect(dimensionGroup.props.children).to.be.include((_.values(testData.headers))[key].title)
      expect(dimensionGroup.props.active).to.be.equal(dimensionGroup.props.children == testData.headers[testData.selected].title)
    });
  })

})

describe('DimensionCodeList component', () => {
  var data = {
    dimensions: {
      AÑO: {
        values: ['2013', '2014', '2015']
      },
      PROGRAMA: {
        values: ['01', '02', '03', '04']
      }
    },
    actions: {},
    headers: {
      AÑO: {
        title: 'year'
      },
      PROGRAMA: {
        title: 'some program'
      }
    },
    ui: {
      selections: {
        measures: 'projected',
        dimensions: {
          filters: {AÑO: '2014', PROGRAMA: '04'},
          groups: ['PROGRAMA']
        }
      }
    }
  }


  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(DimensionCodeList, data))
  })

  it('should display all dimensions', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(DimensionCodeList, testData))

    let dimensions = tree.findNode('#data-filter-buttons').props.children;

    expect(dimensions.length).to.be.equal(2)

    _.forEach(dimensions, (dimension) => {
      expect(dimension.props.title).to.be.equal(testData.headers[dimension.key].title)
      let values = dimension.props.children;
      let expectValues = _.map(values, (value) => {
        return value.props.children
      })
      expect(expectValues).to.be.deep.equal(testData.dimensions[dimension.key].values);
    });
  })

  it('should hide the dimensions which has one possible value', () => {
    let testData = _.cloneDeep(data)
    testData.dimensions.AÑO.values = ['2014']

    let tree = sd.shallowRender(React.createElement(DimensionCodeList, testData))

    let dimensions = tree.findNode('#data-filter-buttons').props.children;

    expect(dimensions.length).to.be.equal(1)

    _.forEach(dimensions, (dimension) => {
      expect(dimension.props.title).to.be.equal(testData.headers[dimension.key].title)
      let values = dimension.props.children;
      let expectValues = _.map(values, (value) => {
        return value.props.children
      })
      expect(expectValues).to.be.deep.equal(testData.dimensions[dimension.key].values);
      expect(dimension.key).to.be.not.equal('AÑO');
    });
  })
})

describe('Table component', () => {
  var data = {
    data: [
      {AÑO: 2013, PROGRAMA: 'Education'},
      {AÑO: 2014, PROGRAMA: 'Education'},
      {AÑO: 2015, PROGRAMA: 'Arts'},
      {AÑO: 2016, PROGRAMA: 'Arts'},
      {AÑO: 2017, PROGRAMA: 'Science'}
    ],
    headers: {
      AÑO: {
        title: 'year'
      },
      PROGRAMA: {
        title: 'some program'
      }
    },
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Table, data))
  })

  it('should display header', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(Table, testData))

    let headers = tree.findNode('thead').props.children.props.children;
    expect(headers.length).to.be.equal((_.keys(testData.headers)).length)

    _.forEach(headers, (header, key) => {
      expect(header.key).to.be.equal(_.keys(testData.headers)[key])
      expect(header.props.children).to.be.equal((_.values(testData.headers))[key].title)
    })
  })


  it('should display data', () => {
    let testData = _.cloneDeep(data)
    let tree = sd.shallowRender(React.createElement(Table, testData))

    let rows = tree.findNode('tbody').props.children[0]
    expect(rows.length).to.be.equal(testData.data.length)

    _.forEach(rows, (row, rowNumber) => {
      _.forEach (row.props.children, (value) => {
        expect(value.props.children).to.be.equal(testData.data[rowNumber][value.key])
      })
    })
  })

  it('should correct display data over 500 rows', () => {
    let testData = _.cloneDeep(data)
    testData.data = []

    for (var i = 0; i < 1000; i++) {
      testData.data.push({AÑO: 1000 + i, PROGRAMA: 'Arts' + i});
    }

    let tree = sd.shallowRender(React.createElement(Table, testData))

    let rows = tree.findNode('tbody').props.children[0]
    expect(rows.length).to.be.equal(500)

    _.forEach(rows, (row, rowNumber) => {
      _.forEach (row.props.children, (value) => {
        expect(value.props.children).to.be.equal(testData.data[rowNumber][value.key])
      })
    })

    expect(tree.findNode('tbody').props.children[1].props.children.props.children).to.be.contains('500 more rows')
  })

})

describe('Pie component', () => {
  var data = {
    data: [
      {AÑO: 2013, PROGRAMA: 'Education1', val1: 110, val2: 210},
      {AÑO: 2014, PROGRAMA: 'Education2', val1: 120, val2: 220},
      {AÑO: 2015, PROGRAMA: 'Arts1', val1: 130, val2: 230},
      {AÑO: 2016, PROGRAMA: 'Arts2', val1: 140, val2: 240},
      {AÑO: 2017, PROGRAMA: 'Science', val1: 150, val2: 250}
    ],
    ui: {
      selections: {
        measures: ['val2'],
        dimensions: {
          groups: ['PROGRAMA']
        }
      }
    }
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Pie, data))
  })

  it('should prepare data', () => {
    let testData = _.cloneDeep(data)
    let processedData = chartDataMappers.pie(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )
    let expectedData = [
      {value: 210, label: 'Education1'},
      {value: 220, label: 'Education2'},
      {value: 230, label: 'Arts1'},
      {value: 240, label: 'Arts2'},
      {value: 250, label: 'Science'}
    ]
    expect(processedData).to.be.deep.equal(expectedData)
  })

  it('should prepare bigger than 20 rows data', () => {
    let testData = _.cloneDeep(data)

    testData.data = []
    for (var i = 1; i <= 100; i++) {
      testData.data.push({
        AÑO: 1900 + i,
        PROGRAMA: 'Arts' + i,
        val1: i,
        val2: 2 * i
      });
    }

    let processedData = chartDataMappers.pie(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )
    let expectedData = []
    for (var i = 100; i > 80; i--) {
      expectedData.push({value: 2 * i, label: 'Arts' + i})
    }
    expectedData.push({value: (2 + 160) / 2 * 80, label: 'Other'})

    expect(processedData).to.be.deep.equal(expectedData)
  })
})

describe('Treemap component', () => {
  var data = {
    data: [
      {AÑO: 2013, PROGRAMA: 'Education1', val1: 110, val2: 210},
      {AÑO: 2014, PROGRAMA: 'Education2', val1: 120, val2: 220},
      {AÑO: 2015, PROGRAMA: 'Arts1', val1: 130, val2: 230},
      {AÑO: 2016, PROGRAMA: 'Arts2', val1: 140, val2: 240},
      {AÑO: 2017, PROGRAMA: 'Science', val1: 150, val2: 250}
    ],
    ui: {
      selections: {
        measures: ['val2'],
        dimensions: {
          groups: ['PROGRAMA']
        }
      }
    }
  }

  it('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Treemap, data))
  })

  it('should prepare data', () => {
    let testData = _.cloneDeep(data)
    let processedData = chartDataMappers.treeMap(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )
    let expectedData = [
      {value: 210, label: 'Education1'},
      {value: 220, label: 'Education2'},
      {value: 230, label: 'Arts1'},
      {value: 240, label: 'Arts2'},
      {value: 250, label: 'Science'}
    ]
    expect(processedData).to.be.deep.equal(expectedData)
  })

  it('should prepare bigger than 50 rows data', () => {
    let testData = _.cloneDeep(data)

    testData.data = []
    for (var i = 1; i <= 100; i++) {
      testData.data.push({
        AÑO: 1900 + i,
        PROGRAMA: 'Arts' + i,
        val1: i,
        val2: 2 * i
      });
    }

    let processedData = chartDataMappers.treeMap(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )
    let expectedData = []
    for (var i = 100; i > 50; i--) {
      expectedData.push({value: 2 * i, label: 'Arts' + i})
    }
    expectedData.push({value: (2 + 100) / 2 * 50, label: 'Other'})

    expect(processedData).to.be.deep.equal(expectedData)
  })

})

describe('BubbleTree component', () => {
  var data = {
    data: [
      {AÑO: 2013, PROGRAMA: 'Education1', val1: 110, val2: 210},
      {AÑO: 2014, PROGRAMA: 'Education2', val1: 120, val2: 220},
      {AÑO: 2015, PROGRAMA: 'Arts1', val1: 130, val2: 230},
      {AÑO: 2016, PROGRAMA: 'Arts2', val1: 140, val2: 240},
      {AÑO: 2017, PROGRAMA: 'Science', val1: 150, val2: 250}
    ],
    ui: {
      selections: {
        measures: ['val2'],
        dimensions: {
          groups: ['PROGRAMA']
        }
      }
    }
  }

  it.skip('should exists', () => {
    let tree = sd.shallowRender(React.createElement(Treemap, data))
  })

  it('should prepare data', () => {
    let testData = _.cloneDeep(data)
    let processedData = chartDataMappers.bubbleTree(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )

    let expectedData = {
      label: 'Total',
      amount: 1150,
      children: [
        {amount: 210, label: 'Education1'},
        {amount: 220, label: 'Education2'},
        {amount: 230, label: 'Arts1'},
        {amount: 240, label: 'Arts2'},
        {amount: 250, label: 'Science'}
      ]
    }
    expect(processedData).to.be.deep.equal(expectedData)
  })

  it('should prepare bigger than 50 rows data', () => {
    let testData = _.cloneDeep(data)

    testData.data = []
    for (var i = 1; i <= 100; i++) {
      testData.data.push({
        AÑO: 1900 + i,
        PROGRAMA: 'Arts' + i,
        val1: i,
        val2: 2 * i
      });
    }

    let processedData = chartDataMappers.bubbleTree(
      testData.data,
      _.first(testData.ui.selections.measures),
      testData.ui.selections.dimensions.groups
    )
    let expectedData = {
      label: 'Total',
      amount: (2 + 200) / 2 * 100,
      children: []
    }

    for (var i = 100; i > 50; i--) {
      expectedData.children.push({amount: 2 * i, label: 'Arts' + i})
    }
    expectedData.children.push({amount: (2 + 100) / 2 * 50, label: 'Other'})

    expect(processedData).to.be.deep.equal(expectedData)
  })
})
