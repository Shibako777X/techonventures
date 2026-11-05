import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve('app'),
  build: { outDir: path.resolve('dist'), emptyOutDir: true },
});
