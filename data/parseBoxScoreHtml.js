const _ = require('lodash');
const cheerio = require('cheerio');
const path = require('path');
const Promise = require('promise');
const utils = require('./utils/utils');

const COMMON_ROW = {
  NAME: 0,
  TEAM: 1
};

// TODO: What about offensive fumbles???!!!

/**
 * Maps stat categories to their corresponding table/column in the html
 *
 * key: html table column
 */
const CONFIG = {
  '#passing': {
    cols: {
      pass_completions: 2,
      pass_attempts: 3,
      pass_yds: 5,
      pass_tds: 8,
      pass_ints: 9
    }
  },
  '#rushing_and_receiving': {
    cols: {
      rush_attempts: 2,
      rush_yds: 3,
      rush_tds: 5,
      rec_rec: 6,
      rec_yds: 7,
      rec_tds: 9
    }
  },
  '#kicking_and_punting': {
    cols: {
      kick_xpm: 2,
      kick_xpa: 3,
      kick_fgm: 5,
      kick_fga: 6,
      punt_punt: 9,
      punt_yds: 10
    }
  },
  '#returns': {
    cols: {
      kickret_ret: 2,
      kickret_yds: 3,
      kickret_tds: 5,
      puntret_ret: 6,
      puntret_yds: 7,
      puntret_tds: 9
    }
  },
  '#defense': {
    cols: {
      tackle_solo: 2,
      tackle_ast: 3,
      tackle_tfl: 5,
      tackle_sk: 6,
      int_ints: 7,
      int_yds: 8,
      int_tds: 10,
      int_pd: 11, // passes defended
      fumbledef_rec: 12,
      fumbledef_yds: 13,
      fumbledef_tds: 14,
      fumbledef_ff: 15
    }
  }
};

// Default is every possible col mapped to 0
const DEFAULTS = _(CONFIG)
  .map(cfg => _.keys(cfg.cols))
  .flatten()
  .map(col => [col, 0])
  .object()
  .value();

function parseStatInt(str) {
  return _.isEmpty(str) ? 0 : _.parseInt(str);
}

function parseTdInt($, tds, i) {
   return parseStatInt($(tds[i]).text());
}

function commonParseRow($, tds) {
  const name = $(tds[COMMON_ROW.NAME]).text();
  const team = $(tds[COMMON_ROW.TEAM]).text();

  return { name, team };
}

function parseBoxScoreHtml(html) {
  const $ = cheerio.load(html);
  const players = {};

  function ensurePlayer(tds) {
    const testPlayer = commonParseRow($, tds);
    const playerKey = utils.hashPlayer(testPlayer.name, testPlayer.team);

    const p = players[playerKey] || _.extend({}, testPlayer, DEFAULTS);
    players[playerKey] = p;

    return p;
  }

  function addStats(newStats, tds) {
    const fbPlayer = ensurePlayer(tds);

    // ensurePlayer makes sure this player is in our map, so just edit in place
    _.extend(fbPlayer, newStats);
  }

  function fillValues($, tds, cols) {
    return _.mapValues(cols, colIndex => parseTdInt($, tds, colIndex));
  }

  function parseRows(cols, domId) {
    $(`${domId} tbody tr`).not('.thead').each((i, row) => {
      const tds = $('td', $(row)).get();
      const newStats = fillValues($, tds, cols);
      addStats(newStats, tds);
    });
  }

  _.each(CONFIG, (config, domId) => parseRows(config.cols, domId));

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
