'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var plugins = [
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
    app: './app/front/scripts/index.js',
    snippets: _.map(fs.readdirSync('./app/front/scripts/snippets/'),
                    function(filename) {
                      return './app/front/scripts/snippets/' + filename;
                    })
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: './public/scripts'
  },
  resolve: {
    alias: {
      // Resolve all `resuire('jquery')` into project-level `jquery` version
      // (fixes different jQuery version issue in `babbage.ui/pivottable` viz)
      jquery$: require.resolve('jquery')
    },
    // This is needed for when we're using dependencies linked with `npm-link`.
    // This allows them to locate their missing dependencies (e.g. jQuery) in
    // our own "node_modules"
    fallback: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json/, loader: 'json'},
      // Evaluate app/config/translations.js
      {
        test: require.resolve('./app/config/translations'),
        loaders: ['raw', 'val']
      }
    ]
  },
  plugins: plugins
};
