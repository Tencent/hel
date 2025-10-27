function getIsCustomArg(arg) {
  const isCustomArg = arg.startsWith('-') || arg.startsWith('--');
  return isCustomArg;
}

function getPureArgv() {
  const argv = process.argv;
  const pureArgv = argv.filter((v) => !getIsCustomArg(v));
  return pureArgv;
}

function getCustomArgv() {
  const argv = process.argv;
  const customArgv = argv.filter((v) => getIsCustomArg(v));
  return customArgv;
}

function getCustomArgvStr() {
  const customArgv = getCustomArgv();
  return customArgv.length ? ` ${customArgv.join(' ')}` : '';
}

module.exports = {
  getPureArgv,
  getCustomArgv,
  getCustomArgvStr,
};
