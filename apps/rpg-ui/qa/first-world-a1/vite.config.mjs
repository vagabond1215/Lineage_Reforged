import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import { defineConfig, normalizePath } from 'vite';
import { loaderPath, repository, verifySourcePack } from './source-pack.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const assetsId = '\0virtual:first-world-a1-assets';
const readerId = '\0virtual:first-world-a1-reader';
let sourcePack;

export default defineConfig({
  root,
  base: './',
  publicDir: false,
  build: { target: 'es2022', modulePreload: false, emptyOutDir: false },
  plugins: [{
    name: 'first-world-a1-verified-source',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      sourcePack = verifySourcePack();
      const { runtimeFingerprint, contentPins, bytes } = sourcePack;
      const prefix = `content/${runtimeFingerprint.slice('sha256:'.length)}`;
      for (const pin of contentPins) {
        this.emitFile({ type: 'asset', fileName: `${prefix}/${pin.gitBlobSha1}.json`, source: bytes.get(pin.path) });
      }
    },
    resolveId(id) {
      if (id.startsWith('node:')) this.error(`Node dependency in First World browser graph: ${id}`);
      if (id === assetsId.slice(1)) return assetsId;
      if (id === readerId.slice(1)) return readerId;
    },
    load(id) {
      if (id === readerId) return `export * from ${JSON.stringify(normalizePath(root + 'canonical-content.mjs'))};`;
      if (id !== assetsId) return;
      const { contentPins, historicalFingerprint, runtimeFingerprint, templatePath } = sourcePack;
      return `export default ${JSON.stringify({ contentPins, historicalFingerprint, runtimeFingerprint, templatePath })};`;
    },
    transform(code, id) {
      if (id.startsWith('\0')) return;
      const path = normalizePath(relative(repository, id));
      if (!/\.[cm]?[jt]sx?$/.test(path) || path.startsWith('apps/rpg-ui/qa/first-world-a1/')) return;
      const pinned = sourcePack.bytes.get(path);
      if (!pinned) this.error(`Unpinned First World browser dependency: ${path}`);
      const canonical = pinned.toString('utf8');
      // Vite may strip a BOM before transform. Other than that and verified
      // checkout line endings, compile only the source bytes admitted above.
      if (code.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n') !== canonical.replace(/^\uFEFF/, '')) {
        this.error(`First World build input differs from the verified source: ${path}`);
      }
      if (path !== loaderPath) return;
      const fromNode = /import \{ readFileSync \} from "node:fs";[\s\S]*?\n/;
      const readFromDisk = '    const fileUrl = new URL(relativePath, import.meta.url);\n    const raw = readFileSync(fileUrl, "utf8");';
      const parse = 'const parsed = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);';
      if (!fromNode.test(canonical) || !canonical.includes(readFromDisk) || !canonical.includes(parse))
        this.error('The pinned civilization content loader no longer matches the browser adapter.');
      return canonical
        .replace(fromNode, 'import { readCanonicalText, freezeCanonical } from "virtual:first-world-a1-reader";\n')
        .replace(readFromDisk, '    const raw = readCanonicalText(relativePath);')
        .replace(parse, 'const parsed = freezeCanonical(JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw));');
    },
  }],
});
