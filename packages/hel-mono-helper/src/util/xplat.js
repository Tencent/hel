const os = require('os');

function getContentLines(content) {
  let lines = content.split(os.EOL);
  if (lines.length === 1) {
    lines = content.split('\n');
    if (lines.length === 1) {
      lines = content.split('\r\n');
    }
  }

  return lines;
}

module.exports = {
  getContentLines,
};
