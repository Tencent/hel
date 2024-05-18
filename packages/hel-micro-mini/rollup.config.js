import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies);
const env = process.env.BUILD_ENV;
console.log(`env is ${env}`);
const distFileName = 'hel-micro';
const globalName = 'HelMicro';

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
  input: 'src/index.ts',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
    globals: {
      'hel-micro-core': 'HelMicroCore',
      'hel-html-parser': 'HelHtmlParser',
    },
  },
  plugins: [
    commonjs(),
    typescript({
      // exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    // 如不想压缩，不配置 terser() 即可
    terser(),
  ],
};

export default config;
