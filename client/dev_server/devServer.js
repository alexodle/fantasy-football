import _ from 'lodash';
import bodyParser from 'body-parser';
import createRedisClient from '../../node_server/createRedisClient';
import express from 'express';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import WebpackDevServer from 'webpack-dev-server';

const FILES_DIR = __dirname;
const ARTIFICIAL_DELAY_LOW = 1;
const ARTIFICIAL_DELAY_HIGH = 400;
const PORTS = {
  webpack: 4000,
  devApi: 4001,
  prodApi: 5000
};

function getArtificialDelay() {
  return _.random(ARTIFICIAL_DELAY_LOW, ARTIFICIAL_DELAY_HIGH);
}

const expressApp = express();
expressApp.use(bodyParser.json());

const redisClient = createRedisClient();

const compiler = webpack(webpackConfig);
const webpackDevServer = new WebpackDevServer(compiler, {
  contentBase: path.resolve(`${__dirname}/../app/static/`),
  publicPath: '/dist/',
  proxy: {
    '/api/*': `http://localhost:${PORTS.prodApi}/`,
    '/dev_api/*': `http://localhost:${PORTS.devApi}/`
  },
  hot: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: { colors: true }
});

// Turn this on to test auth redirect
/*expressApp.get('/dev_api/league/1/fantasy_teams/', function(req, res) {
  res.sendStatus(403);
});*/

const extraPicks = [];
expressApp.post('/dev_api/league/:leagueId/draft_picks', function (req, res) {
  extraPicks.push(req.body);
  res.sendStatus(200);
  redisClient.publish('draft:updates', JSON.stringify({
    league_id: req.params.leagueId
  }));
});

expressApp.get('/dev_api/*', function (req, res) {
  var reqPath = req.path.substring(1);
  if (reqPath.endsWith('/')) {
    reqPath = reqPath.substring(0, reqPath.length - 1);
  }

  var filePath = path.join(FILES_DIR, reqPath) + '.json';

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      res.sendStatus(404);
      return;
    }

    let parsed = JSON.parse(data);
    if (reqPath === 'dev_api/league/1/draft_picks') {
      parsed = parsed.concat(extraPicks);
    }
    setTimeout(() => res.json({ data: parsed }), getArtificialDelay());
  });
});

webpackDevServer.listen(PORTS.webpack, 'localhost', _.noop);
expressApp.listen(PORTS.devApi, _.noop);
