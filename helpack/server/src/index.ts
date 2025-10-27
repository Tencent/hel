process.on('uncaughtException', (err) => {
  console.log(err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise);
});

async function main() {
  const HelErrorMod = await import('./at/core/HelError');
  global.HelError = HelErrorMod.default;

  // 初始化 envConf 初始化
  const initAppEnvConfMod = await import('./at/core/initAppEnvConf');
  await initAppEnvConfMod.default();

  // 初始 app 引入的一些第三方驱动或库
  const initAppLibsMod = await import('./at/core/initAppLibs');
  await initAppLibsMod.default();

  // 初始化 app 各种应用级别的监听函数
  const initListenersMod = await import('./at/core/initAppListeners');
  await initListenersMod.default();

  // 启动整个应用
  await import('./at/core/runApp');
}

main();
