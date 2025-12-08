module.exports = {
  /**
   * 1 这些包一定不需要去查询是否有 hel 导出；
   * 2 这些包属于 baseExternals，有独立的 cdn 提供，不会合到 liftableExternals 里；
   */
  PKG_NAME_WHITE_LIST: [
    '@tencent/hel-micro',
    '@tencent/hel-lib-proxy',
    'hel-iso',
    'hel-micro',
    'hel-micro-core',
    'hel-lib-proxy',
    'hel-types',
    'hel-mono-runtime-helper',
    'react',
    'react-dom',
    'vue',
    'react-router',
  ],
  /**
   * 大仓全局使用的基础外部资源
   */
  BASE_EXTERNALS: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-is': 'ReactIs',
    'react-reconciler': 'ReactReconciler',
    'hel-micro': 'HelMicro',
    'hel-lib-proxy': 'HelLibProxy',
    'hel-mono-runtime-helper': 'HelMonoRuntimeHelper',
  },
  DEPLOY_PATH: 'https://unpkg.com',
  HEL_MONO_DOC: 'https://tencent.github.io/hel/docs/hel-mono/basic',
};
