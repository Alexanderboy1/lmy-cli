import React from 'React';
declare module 'rollup-plugin-copy' {
  import { Plugin } from 'rollup';
  interface CopyOptions {
    targets: Array<{
      src: string | string[];
      dest: string;
      rename?: (name: string) => string;
    }>;
  }
  export default function copy(options: CopyOptions): Plugin;
}

declare global {
  const React: typeof React;
}
