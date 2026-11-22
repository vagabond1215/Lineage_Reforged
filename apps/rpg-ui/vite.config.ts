import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { firstWorldSourceWorker } from './build/first-world-source-worker.mjs';

export default defineConfig(async ({ command }) => {
  const plugins = [react(), sites()];

  if (command === 'build') {
    process.env.WRANGLER_WRITE_LOGS ??= 'false';
    process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
    process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

    const { cloudflare } = await import('@cloudflare/vite-plugin');
    plugins.push(cloudflare({ viteEnvironment: { name: 'server' } }));
  }

  return {
    plugins,
    define: { __LINEAGE_VERIFIED_WORLD_SOURCE_BUILD__: JSON.stringify(command === 'build') },
    worker: { format: 'es' as const, plugins: () => [firstWorldSourceWorker()] },
  };
});
