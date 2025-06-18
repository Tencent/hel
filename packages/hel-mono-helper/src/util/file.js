const path = require('path');

/**
 * 获取父目录下所有一级子目录名称和路径
 */
exports.getDirInfoList = function (parentDirPath) {
  const names = fs.readdirSync(parentDirPath);
  const dirInfoList = [];
  names.forEach((name) => {
    const mayDirPath = path.join(parentDirPath, name);
    const stats = fs.statSync(mayDirPath);
    if (stats.isDirectory()) {
      dirInfoList.push({ name, path: mayDirPath });
    }
  });
  return dirInfoList;
};
