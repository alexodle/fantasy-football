const fs = require('fs');
const Promise = require('promise');

// Turns these functions in to promise-returners
const readFile = Promise.denodeify(fs.readFile);
const writeFile = Promise.denodeify(fs.writeFile);
const readdir = Promise.denodeify(fs.readdir);

function sanitizeFileName(fileName) {
  return fileName
    .replace(' ', '-')
    .toLowerCase();
}

// TODO: Is this enough? Do we need to include player position maybe? Maybe rely
// on a unique id from the source?
function hashPlayer(name, team) {
  return `${name}::${team}`;
}

module.exports = {
  sanitizeFileName,
  readFile,
  writeFile,
  readdir,
  hashPlayer
};
