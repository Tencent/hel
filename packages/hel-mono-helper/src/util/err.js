function checkPkgsLenNotGT1(pkgs, modDirOrName) {
  if (pkgs.length > 1) {
    const errMsg =
      `these packages (${pkgs.join(',')}) belong to the same dir ${modDirOrName}, `
      + `you may operate mod with a parent dir name prefixed like xxx-parent-dir/${modDirOrName}`;
    throw new Error(errMsg);
  }
}

module.exports = {
  checkPkgsLenNotGT1,
};
