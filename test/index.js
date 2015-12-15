/**
 * Created by Ihor Borysyuk on 15.12.15.
 */
require('babel-core/register');

import { expect, should } from 'chai'
import _ from 'lodash'
import App from '../src/scripts/containers/App'

import React from 'react/addons'

const TestUtils = React.addons.TestUtils;
const shallowRenderer = TestUtils.createRenderer();

describe('App', () => {
  it('test', () => {
    shallowRenderer.render(React.createElement(App))
    const component = shallowRenderer.getRenderOutput();
    console.log(component);
    expect([]).to.deep.equal([])
  })

})

