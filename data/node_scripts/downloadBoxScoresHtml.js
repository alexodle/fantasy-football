const _ = require('lodash');
const createScheduler = require('./utils/createScheduler');
const fs = require('fs');
const http = require('http');
const path = require('path');
const Promise = require('promise');
const utils = require('./utils/utils');

const FETCH_THROTTLE_LOW = 500;
const FETCH_THROTTLE_HIGH = 1500;

const scheduler = createScheduler(FETCH_THROTTLE_LOW, FETCH_THROTTLE_HIGH);

function scheduleFetch(fulfill, reject, url) {
  scheduler.schedule(() => {
    http.get(url, (resp) => {
      if (resp.statusCode !== 200) {
        console.error(`Bad response (${resp.statusCode}) for url: "${url}"`);
        reject(new Error(resp.statusCode));
        return;
      }
      fulfill(resp);
    });
  });
}

function getFilePath(outputDir, game) {
  var name = `wk${game.week}_${game.teams[0]}_${game.teams[1]}.html`;
  name = utils.sanitizeFileName(name);
  return path.resolve(outputDir, name);
}

function downloadBoxScore(outputDir, game) {
  const filePath = getFilePath(outputDir, game);
  const file = fs.createWriteStream(filePath);
  return new Promise((fulfill, reject) => {
    scheduleFetch(fulfill, reject, game.boxScoreUrl);
  })
  .catch(err => {
    file.end();
    throw err;
  })
  .then(resp => {
    return new Promise((fulfill, _reject) => {
      resp
        .on('data', data => file.write(data))
        .on('end', () => {
          file.end();
          fulfill();
        });
    });
  });
}

function run(boxScoreLinksFile, outputDir, week, config) {
  console.log('downloadBoxScoresHtml.run:');
  console.log('\tboxScoreLinksFile: ' + boxScoreLinksFile);
  console.log('\toutputDir: ' + outputDir);
  console.log('');

  return utils.readFile(boxScoreLinksFile, 'utf8')
    .then(data => {
      return JSON.parse(data).data;
    })
    .then((allGames) => {
      const filtered = _(allGames)

        // Filter for a single week
        .filter(g => g.week === week)

        // At least one of the teams must be in out team_filter
        .reject(g => _.isEmpty(_.intersection(config.team_filter, g.teams)))
        .value();

      return Promise.all(_.map(filtered, g => downloadBoxScore(outputDir, g)));
    })
    .catch(err => console.error(err));
}

function main() {
  const argv = require('yargs')
    .usage('Usage: $0 -i -d -w [num] -c')
    .describe('i', 'box score links json file')
    .describe('d', 'output directory')
    .describe('w', 'week')
    .describe('c', 'config')
    .demand(['i', 'd', 'w', 'c'])
    .argv;

  run(argv.i, argv.d, argv.w, require(argv.c));
}

if (require.main === module) {
  main();
}

module.exports = run;
