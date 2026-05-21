function logUsage() {
  const usageStr =
    '\nHel <command> usage:\n\n'
    + 'hel init <project-name>              create hel project\n'
    + 'hel init <project-name> -t <type>    create hel project by type (Default:react-mono)\n'
    + 'hel init <project-name> -u <url>     create hel project by url\n'
    + 'hel -v,--version                     see cli version\n'
    + 'hel -b,--bump                        bump hel-mono-templates version to latest\n'
    + 'hel -d,--debug                       execute hel cli command (init, help etc) with debug log\n'
    + 'hel help                             see help info\n\n'
    + '# The following usage is only available under the hel-mono type project\n'
    + 'hel start <mod-name-or-dir>          start hel mod with legacy mode\n'
    + 'hel start <mod-name-or-dir>:hel      start hel mod with micro-module mode\n'
    + 'see more usage at https://tencent.github.io/hel/docs/tutorial/helpack/other/hel-cmd\n'
    + '';
  console.log(usageStr);
}

module.exports = {
  logUsage,
};
