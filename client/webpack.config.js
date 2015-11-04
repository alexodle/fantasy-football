var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./js/index.js",
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'distd',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx($|\?)/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  stats: {
    // Configure the console output
    colors: true,
    modules: true,
    reasons: true
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Fantasy Football App'
    })
  ]
};
