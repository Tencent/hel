function ensureHttpPrefix(url) {
  let target = url;
  if (!url.startsWith('http')) {
    target = `http://${url}`;
  }
  return target;
}

module.exports = {
  ensureHttpPrefix,
};
