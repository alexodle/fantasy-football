var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./app/js/index.jsx",
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'dist',
    publicPath: 'dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
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
  ],
  devServer: {
    contentBase: 'app/views/',
    publicPath: '/dist/'
  }
};
