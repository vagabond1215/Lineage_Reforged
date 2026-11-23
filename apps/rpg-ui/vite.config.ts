import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { firstWorldSourceWorker } from './build/first-world-source-worker.mjs';
import { verifyWorldSourceV4 } from './build/first-world-source-v4.mjs';

export default defineConfig(async ({ command, mode }) => {
  const plugins = [react(), sites()];

  if (command === 'build') {
    verifyWorldSourceV4();
    process.env.WRANGLER_WRITE_LOGS ??= 'false';
    process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
    process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

    const { cloudflare } = await import('@cloudflare/vite-plugin');
    plugins.push(cloudflare({ viteEnvironment: { name: 'server' } }));
  }

  return {
    plugins,
    define: {
      __LINEAGE_VERIFIED_WORLD_SOURCE_BUILD__: JSON.stringify(command === 'build'),
      __LINEAGE_WORLD_OWNER_REVIEW_BUILD__: JSON.stringify(command === 'build' && mode === 'world-owner-review'),
    },
    worker: { format: 'es' as const, plugins: () => [firstWorldSourceWorker(() => verifyWorldSourceV4().workerSource)] },
  };
});
