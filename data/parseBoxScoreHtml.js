const _ = require('lodash');
const utils = require('./utils/utils');
const path = require('path');
const Promise = require('promise');
const cheerio = require('cheerio');

const COMMON_ROW = {
  NAME: 0,
  TEAM: 1
};

const PASSING_ROW = {
  CMP: 2,
  ATT: 3,
  YDS: 5,
  TDS: 8,
  INTS: 9
};

const DEFAULT = {
  // Passing
  pass_completions: 0,
  pass_attempts: 0,
  pass_yds: 0,
  pass_tds: 0,
  pass_ints: 0
};

function parsePassingRow($, $row) {
  const tds = $('td', $row).get();
  const pass_completions = _.parseInt($(tds[PASSING_ROW.CMP]).text());
  const pass_attempts = _.parseInt($(tds[PASSING_ROW.ATT]).text());
  const pass_yds = _.parseInt($(tds[PASSING_ROW.YDS]).text());
  const pass_tds = _.parseInt($(tds[PASSING_ROW.TDS]).text());
  const pass_ints = _.parseInt($(tds[PASSING_ROW.INTS]).text());
  return {
    pass_completions,
    pass_attempts,
    pass_yds,
    pass_tds,
    pass_ints
  };
}

function commonParseRow($, $row) {
  const tds = $('td', $row).get();
  const name = $(tds[COMMON_ROW.NAME]).text();
  const team = $(tds[COMMON_ROW.TEAM]).text();
  return { name, team };
}

function parseBoxScoreHtml(html) {
  const $ = cheerio.load(html);
  const players = {};

  function ensurePlayer($row) {
    const testPlayer = commonParseRow($, $row);
    const playerKey = utils.hashPlayer(testPlayer.name, testPlayer.team);

    const p = players[playerKey] || testPlayer;
    players[playerKey] = p;

    return p;
  }

  // Passing stats
  $('#passing tbody tr').not('.thead').each((i, row) => {
    const $row = $(row);

    const fbPlayer = ensurePlayer($row);
    const newProps = parsePassingRow($, $row);

    // Edit player in place
    _.extend(fbPlayer, newProps);
  });



  return _.values(players);
}

function run(boxScoreHtmlDir, outputFile) {
  console.log('parseBoxScoreHtml.run:');
  console.log('\tboxScoreHtmlDir: ' + boxScoreHtmlDir);
  console.log('\toutputFile: ' + outputFile);
  console.log('');
  return utils.readdir(boxScoreHtmlDir)
    .then(files => {
      return Promise.all(_.map(files, f => {
        const htmlFile = path.join(boxScoreHtmlDir, f);
        return utils.readFile(htmlFile, 'utf8')
          .then(parseBoxScoreHtml);
      }));
    })
    .then(results => {
      const json = JSON.stringify({ data: _.flatten(results) }, null, 2);
      return utils.writeFile(outputFile, json);
    })
    .catch(err => console.error(err));
}

function main() {
  const argv = require('yargs')
    .usage('Usage: $0 -d -o -c')
    .describe('d', 'box score html directory')
    .describe('o', 'output json file')
    .demand(['d', 'o'])
    .argv;

  run(argv.d, argv.o);
}

if (require.main === module) {
  main();
}

module.exports = run;
