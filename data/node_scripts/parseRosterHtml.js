var _ = require('lodash');
var cheerio = require('cheerio');
var path = require('path');
var Promise = require('Promise');
var utils = require('./utils/utils');

const ROSTER_ROW = {
  NUMBER: 0,
  NAME: 1,
  POS: 2,
  CLASS: 5
};

function parseRosterHtml(team, html) {
  const $ = cheerio.load(html);
  var parsed = [];
  $('tr.evenrow, tr.oddrow').each((i, row) => {
    const tds = $('td', $(row)).get();
    const number = _.parseInt($(tds[ROSTER_ROW.NUMBER]).text());
    const name = $(tds[ROSTER_ROW.NAME]).text();
    const pos = $(tds[ROSTER_ROW.POS]).text();
    parsed.push({ team, number, name, pos });
  });
  return parsed;
}

function run(rosterDir, outputFile, config) {
  console.log('parseRosterHtml.run:');
  console.log('\trosterDir: ' + rosterDir);
  console.log('\toutputFile: ' + outputFile);
  console.log('\tconfig: ' + config);
  console.log('');
  return Promise.all(_.map(config.team_filter, (teamName) => {
    const htmlFile = path.resolve(rosterDir, utils.sanitizeFileName(teamName + '.html'));
    return utils
      .readFile(htmlFile, 'utf8')
      .then(html => parseRosterHtml(teamName, html));
  }))
  .then(results => {
    const json = JSON.stringify({ data: _.flatten(results) }, null, 2);
    return utils.writeFile(outputFile, json);
  })
  .catch(err => console.error(err));
}

function main() {
  const argv = require('yargs')
    .usage('Usage: $0 -d -o -c')
    .describe('d', 'roster html directory')
    .describe('o', 'output json file')
    .describe('c', 'config file')
    .demand(['d', 'o', 'c'])
    .argv;

  run(argv.d, argv.o, require(argv.c));
}

if (require.main === module) {
  main();
}

module.exports = run;
