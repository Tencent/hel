import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // 用这些入口去打包，不存在的入口 tsup 会自动忽略掉
    entry: ['src/index.ts', 'src/.hel/entrance/libTypes.ts'],
    // format: ['esm', 'cjs', 'iife'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
  },
]);
