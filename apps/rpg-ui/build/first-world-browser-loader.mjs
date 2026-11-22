/** Transform only the pinned content file's file-read seam. */
export function transformVerifiedContentLoader(canonical, reader) {
  const fromNode = /import \{ readFileSync \} from "node:fs";[\s\S]*?\n/;
  const readFromDisk = '    const fileUrl = new URL(relativePath, import.meta.url);\n    const raw = readFileSync(fileUrl, "utf8");';
  const parse = 'const parsed = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);';
  if (!fromNode.test(canonical) || !canonical.includes(readFromDisk) || !canonical.includes(parse))
    throw new Error('The pinned civilization content loader no longer matches the browser adapter.');
  return canonical
    .replace(fromNode, `import { readCanonicalText, freezeCanonical } from ${JSON.stringify(reader)};\n`)
    .replace(readFromDisk, '    const raw = readCanonicalText(relativePath);')
    .replace(parse, 'const parsed = freezeCanonical(JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw));');
}
