'use strict';

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
