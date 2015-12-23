function sanitizeFileName(fileName) {
  return fileName
    .replace(' ', '-');
}

module.exports = {
  sanitizeFileName
};
