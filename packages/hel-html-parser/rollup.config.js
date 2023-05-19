import babel from 'rollup-plugin-babel'; // 支持jsx
import commonjs from 'rollup-plugin-commonjs'; // 支持按commonjs规范来导入外部模块
import resolve from 'rollup-plugin-node-resolve'; // 支持内部的模块路径解析
// import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});
const env = process.env.BUILD_ENV;
const distFileName = 'hel-html-parser';
const globalName = 'HelHtmlParser';

const env2outputConf = {
  commonjs: {
    format: 'cjs',
    dir: 'lib',
  },
  es: {
    format: 'es',
    dir: 'es',
  },
  development: {
    format: 'umd',
    file: `dist/${distFileName}.js`,
    name: globalName,
  },
  production: {
    format: 'umd',
    file: `dist/${distFileName}.min.js`,
    name: globalName,
  },
};

const config = {
  input: 'src/index.js',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
    globals: {},
  },
  plugins: [
    resolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
    }),
    commonjs(),
    // eslint({
    //   include: ['src/**/*.js'] // 需要检查的部分
    // }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}

export default config;
