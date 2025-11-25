import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    external: ['electron'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
  },
]);
