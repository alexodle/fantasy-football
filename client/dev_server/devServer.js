import _ from 'lodash';
import bodyParser from 'body-parser';
import createRedisClient from './createRedisClient';
import express from 'express';
import fs from 'fs';
import MemoryFS from 'memory-fs';
import path from 'path';
import proxy from 'express-http-proxy';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.dev.js';

const FILES_DIR = __dirname;
const ARTIFICIAL_DELAY_LOW = 1;
const ARTIFICIAL_DELAY_HIGH = 400;
const PORTS = {
  devApi: 4000,
  prodApi: 5000
};
const INDEX_FILE = path.resolve(__dirname, '../app/static/index.html');

function getArtificialDelay() {
  return _.random(ARTIFICIAL_DELAY_LOW, ARTIFICIAL_DELAY_HIGH);
}

const expressApp = express();
expressApp.use(bodyParser.json());

const redisClient = createRedisClient();

expressApp.use('/api', proxy(`http://localhost:${PORTS.prodApi}`, {
  forwardPath: function(req, _res) {
    const path = `/api${req.path}`;
    console.log('Forwarding: ' + path);
    return path;
  }
}));

const memoryFs = new MemoryFS();
const compiler = webpack(webpackConfig);
compiler.outputFileSystem = memoryFs;
compiler.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
}, function(err, stats) {
  if (err) {
    console.error(err);
    return;
  }
  console.dir(stats);
});

function serveIndex(req, res) {
  fs.readFile(INDEX_FILE, 'utf8', function (err, data) {
    if (err) {
      console.error('Index file not found: ' + INDEX_FILE);
      return;
    }
    res.send(data);
  });
}
expressApp.get('/', serveIndex);
expressApp.get('/login', serveIndex);
expressApp.get('/draft/:draftId', serveIndex);

expressApp.get('/dist/*', function (req, res) {
  console.log('Fetching: ' + req.path);
  res.send(memoryFs.readFileSync(req.path).toString('utf8'));
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

const extraPicks = [];
expressApp.post('/dev_api/league/:leagueId/draft_picks', function (req, res) {
  extraPicks.push(req.body);
  res.sendStatus(200);
  redisClient.publish('draft:updates', JSON.stringify({
    league_id: req.params.leagueId
  }));
});

expressApp.listen(PORTS.devApi, _.noop);
