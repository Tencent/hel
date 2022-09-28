import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

const plugins = [
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
  }),
];
const umdOutput = {
  format: 'umd',
  name: 'hel-lib-proxy',
  file: 'dist/hel-lib-proxy.js',
};

if (process.env.MIN === 'true') {
  plugins.push(terser());
  umdOutput.file = 'dist/hel-lib-proxy.min.js';
}

module.exports = {
  input: 'src/index.ts',
  plugins,
  output: [umdOutput],
};
