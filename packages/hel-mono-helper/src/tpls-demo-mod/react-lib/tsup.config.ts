import moduleCss from 'esbuild-plugin-module-css';
import { defineConfig } from 'tsup';
import pkgJson from './package.json';

export default defineConfig({
  entry: ['src/index.ts'],
  treeshake: false,
  sourcemap: true,
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ['cjs', 'esm'],
  external: ['react'],
  injectStyle: true,
  esbuildPlugins: [moduleCss({ moduleCssScopePrefix: pkgJson.name })],
});
