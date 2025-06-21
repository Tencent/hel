function isHelMode() {
  return process.env.HEL === '1';
}

function isHelStart() {
  return process.env.HEL_START === '1';
}

module.exports = {
  isHelMode,
  isHelStart,
};
