import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import tsMod from 'typescript';
// 如需要一起打包引用的模块，使用此插件，解决 Unresolved dependencies
// 因本项目不需要打包 hel-micro-core 依赖，所以不需要此插件
// import resolve from 'rollup-plugin-node-resolve';

const globalName = 'HelLibProxy';

const plugins = [
  // resolve(),
  typescript({
    exclude: 'node_modules/**',
    typescript: tsMod,
  }),
];
const umdOutput = {
  format: 'umd',
  name: globalName,
  file: 'dist/hel-lib-proxy.js',
  globals: {
    'hel-micro-core': 'HelMicroCore',
  },
};

// eslint-disable-next-line
if (process.env.MIN === 'true') {
  plugins.push(terser());
  umdOutput.file = 'dist/hel-lib-proxy.min.js';
}

export default {
  input: 'src/index.ts',
  plugins,
  output: umdOutput,
};
