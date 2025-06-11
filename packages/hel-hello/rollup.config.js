import typescriptPlugin from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'typescript';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});
const env = process.env.BUILD_ENV;

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
    file: 'dist/hel-hello.js',
    name: 'TencentHelHello',
  },
  production: {
    format: 'umd',
    file: 'dist/hel-hello.min.js',
    name: 'TencentHelHello',
  },
};

const config = {
  input: 'src/index.ts',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
  },
  plugins: [
    commonjs(),
    typescriptPlugin({
      // exclude: 'node_modules/**',
      typescript,
    }),
    // 如不想压缩，不配置 terser() 即可
    terser(),
  ],
};

export default config;
