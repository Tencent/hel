function getDepPathStat(name) {
  try {
    return { modPath: require.resolve(name), isSuccess: true, err: '' };
  } catch (err) {
    return { modPath: '', isSuccess: false, err: err.message };
  }
}

function getDepPath(name) {
  const { modPath } = getDepPathStat(name);
  return modPath;
}

module.exports = {
  getDepPathStat,
  getDepPath,
};
