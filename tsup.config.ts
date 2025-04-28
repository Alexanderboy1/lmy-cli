import { defineConfig } from 'tsup';
import copy from 'rollup-plugin-copy';
import path from 'path';
export default defineConfig({
  // 主入口配置
  entry: {
    'bin/index': 'bin/index.ts', // CLI 入口
    'lib/index': 'lib/index.ts', // 主库入口
  },

  // 关键配置
  outDir: 'dist',
  format: ['esm', 'cjs'], // 分离生成两种格式
  splitting: false, // 禁用代码分割
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  target: 'node16', // 明确 Node.js 目标版本
  // publicDir: 'templates', // 公共资源目录
  loader: {
    '.tsx': 'copy',
    '.less': 'copy',
    '.css': 'copy',
  },
  plugins: [
    copy({
      targets: [
        {
          src: 'templates/*',
          dest: 'dist/templates',
          rename: (name) => name.replace('templates/', ''),
        },
      ],
      // copyOnce: true,
      hook: 'buildEnd',
      verbose: true,
      // 同名文件夹或文件直接覆盖
      overwrite: true,
    }) as any,
  ],
  // 目录结构保留
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.cjs',
  }),

  // 仅对 CLI 入口添加 shebang
  banner: {
    js: '#!/usr/bin/env node',
  },
  onSuccess: 'tsc --emitDeclarationOnly --outDir dist/types',
});
