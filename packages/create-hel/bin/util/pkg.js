const fs = require('fs-extra');
const path = require('path');

async function modifyPkgInfo({ projectName, dirPath }) {
  const pkgPath = path.join(dirPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

module.exports = {
  modifyPkgInfo,
};
