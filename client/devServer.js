var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var WebpackDevServer = require('webpack-dev-server');

var compiler = webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
  contentBase: path.resolve('./app/views/'),
  publicPath: '/dist/'
});

server.listen(8080, 'localhost', function() {});
