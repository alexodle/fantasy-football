const Promise = require('promise');
const fs = require('fs');

const readFile = Promise.denodeify(fs.readFile);
const writeFile = Promise.denodeify(fs.writeFile);

function sanitizeFileName(fileName) {
  return fileName
    .replace(' ', '-')
    .toLowerCase();
}

module.exports = {
  sanitizeFileName,
  readFile,
  writeFile
};
