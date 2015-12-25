const _ = require('lodash');
const cheerio = require('cheerio');
const url = require('url');
const utils = require('./utils/utils');

const SCHED_ROWS = {
  WEEK: 1,
  BOX_SCORE_URL: 2,
  POINTS: 6,
  TEAM1: 5,
  TEAM2: 8
};

// Filter out possible ranking at front of team name
const TEAM_NAME_RE = /(\([0-9]+\)\s+)?(.*)/;
const TEAM_NAME_GROUP = 2;

function parseTeamName(teamName) {
  const match = TEAM_NAME_RE.exec(teamName);
  return match[TEAM_NAME_GROUP];
}

function parseScheduleRow($, $row, baseUrl) {
  const tds = $('td', $row).get();

  // Ensure game wasn't cancelled
  var boxScoreUrl = $(tds[SCHED_ROWS.BOX_SCORE_URL])
    .find('a')
    .attr('href');
  if (_.isEmpty(boxScoreUrl)) return null;

  const week = _.parseInt($(tds[SCHED_ROWS.WEEK]).text());
  const isComplete = !_.isEmpty($(tds[SCHED_ROWS.POINTS]).text().trim());
  const teams = _.map([
    $(tds[SCHED_ROWS.TEAM1]).text().trim(),
    $(tds[SCHED_ROWS.TEAM2]).text().trim()
  ], parseTeamName);

  boxScoreUrl = url.resolve(baseUrl, boxScoreUrl);
  return { week, isComplete, teams, boxScoreUrl };
}

function run(inFilePath, outFilePath, baseUrl) {
  console.log('parseBoxScoreLinksHtml.run:');
  console.log('\tinFilePath: ' + inFilePath);
  console.log('\toutFilePath: ' + outFilePath);
  console.log('\tbaseUrl: ' + baseUrl);
  console.log('');

  return utils.readFile(inFilePath, 'utf8')
    .then(data => {
      const $ = cheerio.load(data);
      var parsed = [];
      $('#schedule tbody tr')
        .not('.thead')
        .each((i, elem) => {
          parsed.push(parseScheduleRow($, $(elem), baseUrl));
        });

      // Remove invalid rows (skipped games, etc.)
      parsed = _.compact(parsed);

      return parsed;
    })
    .then(parsed => {
      const json = JSON.stringify({ data: parsed }, null, 2);
      return utils.writeFile(outFilePath, json);
    })
    .catch(err => console.error(err));
}

function main() {
  const argv = require('yargs')
    .usage('Usage: $0 -i -o -b')
    .describe('i', 'input html file')
    .describe('o', 'output file')
    .describe('b', 'base url')
    .demand(['i', 'o', 'b'])
    .argv;

  run(argv.i, argv.o, argv.b);
}

if (require.main === module) {
  main();
}

module.exports = run;
