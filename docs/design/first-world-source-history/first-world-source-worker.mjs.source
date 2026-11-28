import { relative, resolve } from 'node:path';
import { normalizePath } from 'vite';
import { loaderPath, repository, verifyWorldSourceV2 } from './first-world-source-pack.mjs';
import { transformVerifiedContentLoader } from './first-world-browser-loader.mjs';

const assetsId = 'virtual:first-world-v2-assets';
const readerId = 'virtual:first-world-v2-reader';
const readerPath = 'apps/rpg-ui/src/game-shell/world-source/worker-content.mjs';

/** The standard app uses this only for its build-time isolated World worker graph. */
export function firstWorldSourceWorker() {
  let manifest;
  let assetRefs;
  return {
    name: 'first-world-v2-source-worker',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      const { bytes, pins, ...identity } = verifyWorldSourceV2();
      manifest = { bytes, identity };
      assetRefs = new Map(identity.contentPins.map(({ path, gitBlobSha1 }) => [
        gitBlobSha1,
        this.emitFile({
          type: 'asset',
          fileName: `world-source/${identity.runtimeFingerprint.slice(7)}/${gitBlobSha1}.json`,
          source: bytes.get(path),
        }),
      ]));
    },
    resolveId(id) {
      if (id.startsWith('node:')) this.error(`Node dependency in World source worker: ${id}`);
      if (id === assetsId || id === readerId) return '\0' + id;
    },
    load(id) {
      if (id === '\0' + readerId) {
        return `export * from ${JSON.stringify(normalizePath(resolve(repository, readerPath)))};`;
      }
      if (id !== '\0' + assetsId) return;
      const urls = [...assetRefs].map(([pin, ref]) => `${JSON.stringify(pin)}: import.meta.ROLLUP_FILE_URL_${ref}`);
      return `export default ${JSON.stringify(manifest.identity)};\nexport const assetUrls = {${urls.join(',')}};`;
    },
    transform(code, id) {
      if (id.startsWith('\0') || !/\.[cm]?[jt]sx?$/.test(id)) return;
      const path = normalizePath(relative(repository, id));
      const pinned = manifest.bytes.get(path);
      if (!pinned) this.error(`Unpinned World source worker dependency: ${path}`);
      const canonical = pinned.toString('utf8');
      if (code.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n') !== canonical.replace(/^\uFEFF/, '')) {
        this.error(`World source worker input differs from its verified bytes: ${path}`);
      }
      if (path === loaderPath) return transformVerifiedContentLoader(canonical, readerId);
    },
  };
}
