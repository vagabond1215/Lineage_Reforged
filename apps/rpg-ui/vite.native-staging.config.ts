import { cpSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { validateNativeStagingOrigin, validateNativeStagingPreviewOrigin } from './nativeStagingOrigin.js';

const appRoot = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(appRoot, 'public');
const outputDir = resolve(appRoot, 'dist-native-v3-staging');

const copyStagingPublicAssets = {
  name: 'copy-native-staging-public-assets',
  apply: 'build' as const,
  transformIndexHtml: {
    order: 'pre' as const,
    handler(html: string) {
      return html.replaceAll('\r\n', '\n');
    }
  },
  closeBundle() {
    for (const entry of readdirSync(publicDir, { withFileTypes: true })) {
      // Production creator artwork already resolves to the pinned GitHub source.
      if (entry.name === 'character-creator') continue;
      cpSync(resolve(publicDir, entry.name), resolve(outputDir, entry.name), { recursive: true });
    }
  }
};

export default defineConfig(({ command }) => {
  const suppliedOrigin = process.env.LINEAGE_NATIVE_STAGING_ORIGIN ?? '';
  const origin = command === 'serve'
    ? validateNativeStagingPreviewOrigin(suppliedOrigin)
    : validateNativeStagingOrigin(suppliedOrigin);
  return {
    root: resolve(appRoot, 'native-v3-staging'),
    publicDir,
    plugins: [react(), copyStagingPublicAssets],
    define: { __LINEAGE_NATIVE_STAGING_ORIGIN__: JSON.stringify(origin) },
    build: { outDir: outputDir, emptyOutDir: true, copyPublicDir: false }
  };
});
