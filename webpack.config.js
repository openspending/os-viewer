var path = require('path')

module.exports = {
  context: __dirname,
  entry: './src/scripts/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'dist/'
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2|png|jpg)$/,
        loader: 'file'
      }
    ],
  }
};
