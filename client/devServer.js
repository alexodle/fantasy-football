var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var WebpackDevServer = require('webpack-dev-server');

var FILES_DIR = path.resolve('./test/mockserver');
var ARTIFICIAL_DELAY_LOW = 200;
var ARTIFICIAL_DELAY_HIGH = 2000;

function getArtificialDelay() {
  return _.random(ARTIFICIAL_DELAY_LOW, ARTIFICIAL_DELAY_HIGH);
}

var expressApp = express();

var compiler = webpack(webpackConfig);
var webpackDevServer = new WebpackDevServer(compiler, {
  contentBase: path.resolve('./app/static/'),
  publicPath: '/dist/',
  proxy: { '/api/*': 'http://localhost:8081/' },
  hot: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: { colors: true }
});

expressApp.get('/api/*', function(req, res) {
  var reqPath = req.path.substring(1);

  var filePath = path.join(FILES_DIR, reqPath) + '.json';
  var dataType = path.basename(filePath, '.json');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      res.sendStatus(404);
      return;
    }
    setTimeout(function () {
      var json = {};
      json[dataType] = JSON.parse(data);
      res.json(json);
    }, getArtificialDelay());
  });
});

webpackDevServer.listen(8080, 'localhost', function() {});
expressApp.listen(8081, function () {});
