import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(appRoot, '../..');

export default defineConfig({
  root: appRoot,
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    fs: { allow: [repositoryRoot] },
  },
  preview: { host: '127.0.0.1', port: 4174 },
  build: {
    outDir: resolve(repositoryRoot, '.world-map-review-dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(appRoot, 'world-map-review.html'),
    },
  },
});
