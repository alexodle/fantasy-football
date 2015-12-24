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

const RUSH_ROW = {
  ATT: 2,
  YDS: 3,
  TDS: 5
};

const REC_ROW = {
  REC: 6,
  YDS: 7,
  TDS: 9
};

const DEFAULTS = {
  // Passing
  pass_completions: 0,
  pass_attempts: 0,
  pass_yds: 0,
  pass_tds: 0,
  pass_ints: 0,

  // Rushing
  rush_attempts: 0,
  rush_yds: 0,
  rush_tds: 0,

  // Receiving
  rec_rec: 0,
  rec_yds: 0,
  rec_tds: 0
};

function parseStatInt(str) {
  return _.isEmpty(str) ? 0 : _.parseInt(str);
}

function parsePassingRow($, $row) {
  const tds = $('td', $row).get();
  const pass_completions = parseStatInt($(tds[PASSING_ROW.CMP]).text());
  const pass_attempts = parseStatInt($(tds[PASSING_ROW.ATT]).text());
  const pass_yds = parseStatInt($(tds[PASSING_ROW.YDS]).text());
  const pass_tds = parseStatInt($(tds[PASSING_ROW.TDS]).text());
  const pass_ints = parseStatInt($(tds[PASSING_ROW.INTS]).text());
  return {
    pass_completions,
    pass_attempts,
    pass_yds,
    pass_tds,
    pass_ints
  };
}

function parseRushRecRow($, $row) {
  const tds = $('td', $row).get();

  const rush_attempts = parseStatInt($(tds[RUSH_ROW.ATT]).text());
  const rush_yds = parseStatInt($(tds[RUSH_ROW.YDS]).text());
  const rush_tds = parseStatInt($(tds[RUSH_ROW.TDS]).text());

  const rec_rec = parseStatInt($(tds[REC_ROW.REC]).text());
  const rec_yds = parseStatInt($(tds[REC_ROW.YDS]).text());
  const rec_tds = parseStatInt($(tds[REC_ROW.TDS]).text());

  return {
    rush_attempts,
    rush_yds,
    rush_tds,
    rec_rec,
    rec_yds,
    rec_tds
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

    const p = players[playerKey] || _.extend({}, testPlayer, DEFAULTS);
    players[playerKey] = p;

    return p;
  }

  function addStats(newStats, $row) {
    const fbPlayer = ensurePlayer($row);

    // ensurePlayer makes sure this player is in our map, so just edit in place
    _.extend(fbPlayer, newStats);
  }

  function parseRows(query, parser) {
    $(query).not('.thead').each((i, row) => {
      const $row = $(row);
      const newStats = parser($, $row);
      addStats(newStats, $row);
    });
  }

  parseRows('#passing tbody tr', parsePassingRow);
  parseRows('#rushing_and_receiving tbody tr', parseRushRecRow);

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
