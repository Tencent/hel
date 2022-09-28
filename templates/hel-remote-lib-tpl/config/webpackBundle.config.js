const path = require('path');
const paths = require('./paths');
const pkg = require('../package.json');

let bundleName = '';
if (pkg.appGroupName) {
  bundleName = pkg.appGroupName;
} else {
  bundleName = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;
}

module.exports = () => ({
  mode: 'production',
  entry: paths.appIndexJs,
  output: {
    path: path.resolve(__dirname, '../hel_bundle'),
    filename: `entry.js`,
    library: `${bundleName}`,
    libraryTarget: 'commonjs',
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
