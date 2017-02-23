'use strict';

var _ = require('lodash');
var webpack = require('webpack');
var requiredir = require('requiredir');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

var plugins = [
  new VirtualModulePlugin({
    moduleName: 'app/config/translations.json',
    contents: JSON.stringify(_.omit(requiredir('./translations'), ['length']))
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV == 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: {
    'app': './app/front/scripts/index.js'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: './public/scripts'
  },
  resolve: {
    alias: {
      // Use `webpack-raphael` instead of `raphael` which is somehow
      // incompatible with webpack
      raphael$: 'webpack-raphael'
    }
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json/, loader: 'json'}
    ]
  },
  plugins: plugins
};
