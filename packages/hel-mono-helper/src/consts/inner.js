module.exports = {
  /**
   * 这些包一定不需要去查询是否有 hel 导出
   * TODO: add include exclude to hel-mono.json
   */
  PKG_NAME_WHITE_LIST: [
    '@tencent/hel-micro',
    '@tencent/hel-lib-proxy',
    'hel-iso',
    'hel-micro',
    'hel-micro-core',
    'hel-lib-proxy',
    'hel-types',
    'react',
    'react-dom',
    'vue',
    'react-router',
  ],
  APP_EXTERNALS: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-is': 'ReactIs',
    'react-reconciler': 'ReactReconciler',
    'hel-micro': 'HelMicro',
    'hel-lib-proxy': 'HelLibProxy',
  },
};
