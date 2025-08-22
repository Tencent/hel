const { getConfig } = require('../config');

function bumpTplStore() {
  const { pkgManager, helMonoTemplates } = getConfig();
  const { isSuccess, modPath, err } = getDepPathStat(helMonoTemplates);
  if (!isSuccess) {
    return console.error(err);
  }

  const oldVer = getHelMonoTemplatesVerByPath(modPath);
  const parentDir = modPath.split(`/${helMonoTemplates}`)[0];
  logPurple(`Hel cli will bump ${helMonoTemplates} at ${parentDir}`);
  shell.cd(parentDir);

  const npmCmd = `${pkgManager} install ${helMonoTemplates}@latest`;
  logPurple(`Bump ${helMonoTemplates} by '${npmCmd}'...`);

  shell.exec(npmCmd);
  const newVer = getHelMonoTemplatesVerByPath(modPath, true);

  logPurple(`Bump ${helMonoTemplates} from ${oldVer} to ${newVer}`);
}

module.exports = {
  bumpTplStore,
};
