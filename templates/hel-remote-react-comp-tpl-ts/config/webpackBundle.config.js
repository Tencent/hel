// TODO: 待解决，如何使用 webpack 打包一个 cjs 格式的组件
// 这是一个不重要的事情，用户项目可以使用 jest.mock 对包组件进行打桩处理
// 同时等后续 hel-micro 支持node环境解析js并导出组件后，就不再需要 hel_bundle 的存在了
const helDevUtils = require('hel-dev-utils');
const path = require("path");
const paths = require('./paths');
const pkg = require('../package.json');

const bundleName = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;
// const helBundleName = `__hel_${bundleName}`;
const helBundleName = bundleName;

module.exports = () => ({
  mode: "production",
  entry: paths.appIndexJs,
  output: {
    path: path.resolve(__dirname, `../${helDevUtils.cst.HEL_BUNDLE_DIR}`),
    filename: `${bundleName}.js`,
    library: `${helBundleName}`, // 在全局变量中增加一个library变量
    libraryTarget: "commonjs",
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              cache: true,
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
              resolvePluginsRelativeTo: __dirname,

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
    ],
  },
});
