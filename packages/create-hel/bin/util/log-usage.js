function logUsage() {
  const usageStr =
    '\nHel <command> usage:\n\n'
    + 'hel init <project-name>              create hel project\n'
    + 'hel init <project-name> -t <type>    create hel project by type (Default:react-mono)\n'
    + 'hel init <project-name> -u <url>     create hel project by url\n'
    + 'hel -v,--version                     see cli version\n'
    + 'hel -d,--debug                       execute hel cli command (init, help etc) with debug log\n'
    + 'hel help                             see help info\n\n'
    + '# The following usage is only available under the hel-mono type project\n'
    + 'hel start <mod-name-or-dir>          start hel mod with legacy mode\n'
    + 'hel start <mod-name-or-dir>:hel      start hel mod with micro-module mode\n'
    + 'hel build <mod-name-or-dir>          build hel mod with legacy mode\n'
    + 'hel build <mod-name-or-dir>:hel      build hel mod with micro-module mode\n'
    + 'hel create <dir-name>                create a hel app\n'
    + 'hel create <dir-name> -t             create a hel app with type (Default:react-app)\n'
    + 'hel create <dir-name> -n             create a hel app with package name\n'
    + 'hel create <dir-name> -a             create a hel app with alias\n'
    + 'hel create-mod <dir-name>            create a hel mod\n'
    + 'hel create-mod <dir-name> -t         create a hel mod with type (Default:ts-lib)\n'
    + 'hel create-mod <dir-name> -n         create a hel mod with package name\n'
    + 'hel create-mod <dir-name> -a         create a hel mod with package alias\n'
    + 'hel test <mod-name-or-dir>           test hel mod\n'
    + 'hel test-watch <mod-name-or-dir>     test hel mod witch watch mode\n'
    + 'hel deps <mod-name-or-dir>           start micro-module dev servers of hel mod deps\n'
    + '';
  console.log(usageStr);
}

module.exports = {
  logUsage,
};
