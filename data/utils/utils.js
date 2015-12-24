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

// TODO: Is this enough?
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
