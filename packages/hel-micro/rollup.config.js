import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies);
const env = process.env.BUILD_ENV;
console.log(`env is ${env}`);
const bundleName = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;

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
    file: `dist/${bundleName}.js`,
    name: bundleName,
  },
  production: {
    format: 'umd',
    file: `dist/${bundleName}.min.js`,
    name: bundleName,
  },
};

const config = {
  input: 'src/index.ts',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
    globals: {
    }
  },
  plugins: [
    commonjs(),
    typescript({
      // exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    // 如不想压缩，不配置 terser() 即可
    // terser(),
  ]
};


export default config;
