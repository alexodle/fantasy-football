var express = require('express');
var fs = require("fs");
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var WebpackDevServer = require('webpack-dev-server');

var FILES_DIR = path.resolve('./test/mockserver');

var expressApp = express();

var compiler = webpack(webpackConfig);
var webpackDevServer = new WebpackDevServer(compiler, {
  contentBase: path.resolve('./app/views/'),
  publicPath: '/dist/',
  proxy: { '/api/*': 'http://localhost:8081/' }
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
    var json = {};
    json[dataType] = JSON.parse(data);
    res.json(json);
  });
});

webpackDevServer.listen(8080, 'localhost', function() {});
expressApp.listen(8081, function () {});
