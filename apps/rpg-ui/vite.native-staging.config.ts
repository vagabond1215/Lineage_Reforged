import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { validateNativeStagingOrigin, validateNativeStagingPreviewOrigin } from './nativeStagingOrigin.js';

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const suppliedOrigin = process.env.LINEAGE_NATIVE_STAGING_ORIGIN ?? '';
  const origin = command === 'serve'
    ? validateNativeStagingPreviewOrigin(suppliedOrigin)
    : validateNativeStagingOrigin(suppliedOrigin);
  return {
    root: resolve(appRoot, 'native-v3-staging'),
    publicDir: resolve(appRoot, 'public'),
    plugins: [react()],
    define: { __LINEAGE_NATIVE_STAGING_ORIGIN__: JSON.stringify(origin) },
    build: { outDir: resolve(appRoot, 'dist-native-v3-staging'), emptyOutDir: true }
  };
});
