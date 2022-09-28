async function main() {
  const { libReady } = await import('hel-lib-proxy');
  const { LIB_NAME } = await import('./configs/subApp');
  // 如有其他远程包依赖并且需要在内部使用静态导入的语法，可使用 preFetchLib 来加载这些包体
  // const { preFetchLib } = await import('hel-micro');
  // await preFetchLib('other-lib');
  // await Promise.all([preFetchLib('lib1'), preFetchLib('lib2')]);

  const libProperties = await import('./entrance/libProperties');
  // 注意此处传递的是 default
  libReady(LIB_NAME, libProperties.default);
}

main().catch(console.error);

// avoid isolatedModules warning
export default 'HEL REMOTE MOD';
