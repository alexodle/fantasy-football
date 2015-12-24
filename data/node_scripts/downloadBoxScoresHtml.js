const _ = require('lodash');
const fs = require('fs');
const http = require('http');
const path = require('path');
const Promise = require('promise');
const utils = require('./utils/utils');

const FETCH_THROTTLE = 5000; // 1 fetch per second max

// Throttle our fetches to be nice to the server
const throttledFetch = _.throttle((fulfill, reject, url) => {
  http.get(url, (resp) => {
    if (resp.statusCode !== 200) {
      console.error(`Bad response (${resp.statusCode}) for url: "${url}"`);
      reject(new Error(resp.statusCode));
      return;
    }
    fulfill(resp);
  });
}, FETCH_THROTTLE);

function getFilePath(outputDir, game) {
  const name = `wk${game.week}_${game.teams[0]}_${game.teams[1]}.html`;
  name = utils.sanitizeFileName(name);
  return path.resolve(outputDir, name);
}

function downloadBoxScore(outputDir, game) {
  const filePath = getFilePath(outputDir, game);
  const file = fs.createWriteStream(filePath);
  return new Promise((fulfill, reject) => {
    throttledFetch(fulfill, reject, game.boxScoreUrl);
  })
  .then(resp => {
    return new Promise((fulfill, _reject) => {
      resp
        .on('data', file.write)
        .on('end', fulfill);
    });
  })
  .finally(file.end);
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
