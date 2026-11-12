/**
 * Read-only pixel witness for the Starfall reference anchor against supplied PNG
 * rasters. Output raw channels only; no undocumented height-to-meter mapping.
 *
 * Run from repository root: node scripts/audit-starfall-raster.mjs
 * Requires Node built-ins only. Intentionally rejects unsupported PNG formats.
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { resolve } from "node:path";

const IMAGE_PATHS = {
  biome: "packages/content/base/world/map_assets/First World Biome.png",
  elevation: "packages/content/base/world/map_assets/First World Elevation.png"
};
const SAMPLES = [
  ["Starfall Port", 825, 245],
  ["Harbormast Quay", 905, 270],
  ["Foammarket Ferry", 760, 355],
  ["Pearlwake", 735, 315],
  ["Chainlight Bastion", 965, 170],
  ["Starfall west 10px", 815, 245],
  ["Starfall east 10px", 835, 245],
  ["Starfall north 10px", 825, 235],
  ["Starfall south 10px", 825, 255]
];

function decodePng(bytes) {
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a")
    throw new Error("Invalid PNG signature");
  let i = 8, width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idat = [];
  let palette = null, transparency = null;
  while (i + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(i);
    const type = bytes.toString("ascii", i + 4, i + 8);
    const chunkStart = i + 8;
    const chunkEnd = chunkStart + length;
    if (chunkEnd + 4 > bytes.length) throw new Error(`Invalid ${type} chunk length`);
    if (type === "IHDR") {
      width = bytes.readUInt32BE(chunkStart);
      height = bytes.readUInt32BE(chunkStart + 4);
      bitDepth = bytes[chunkStart + 8];
      colorType = bytes[chunkStart + 9];
      interlace = bytes[chunkStart + 12];
    } else if (type === "PLTE") {
      palette = bytes.subarray(chunkStart, chunkEnd);
    } else if (type === "tRNS") {
      transparency = bytes.subarray(chunkStart, chunkEnd);
    } else if (type === "IDAT") {
      idat.push(bytes.subarray(chunkStart, chunkEnd));
    } else if (type === "IEND") break;
    i = chunkEnd + 4;
  }
  const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType];
  if (!channels || ![8, 16].includes(bitDepth) || interlace !== 0)
    throw new Error(`Unsupported PNG: colorType=${colorType} bitDepth=${bitDepth} interlace=${interlace}`);
  if (colorType === 3 && bitDepth !== 8) throw new Error("Only 8-bit indexed PNG supported");
  if (!width || !height || !idat.length) throw new Error("Missing PNG image data");
  const bytesPerPixel = channels * (bitDepth / 8);
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idat));
  if (inflated.length !== height * (stride + 1))
    throw new Error("PNG scanline length mismatch");
  const unfiltered = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = inflated[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const raw = inflated[y * (stride + 1) + x + 1];
      const left = x >= bytesPerPixel ? unfiltered[y * stride + x - bytesPerPixel] : 0;
      const up = y > 0 ? unfiltered[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? unfiltered[(y - 1) * stride + x - bytesPerPixel] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upperLeft;
        const da = Math.abs(p - left), db = Math.abs(p - up), dc = Math.abs(p - upperLeft);
        predictor = da <= db && da <= dc ? left : db <= dc ? up : upperLeft;
      } else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}`);
      unfiltered[y * stride + x] = (raw + predictor) & 255;
    }
  }
  const sample = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) throw new Error("Outside raster");
    const offset = y * stride + x * bytesPerPixel;
    const raw = [];
    for (let c = 0; c < channels; c++) {
      raw.push(bitDepth === 16 ? unfiltered.readUInt16BE(offset + 2 * c) : unfiltered[offset + c]);
    }
    if (colorType === 3) {
      const index = raw[0];
      return { paletteIndex: index,
        rgba: palette
          ? [palette[index * 3], palette[index * 3 + 1], palette[index * 3 + 2],
             transparency?.[index] ?? 255]
          : null };
    }
    return { channels: raw };
  };
  return { width, height, bitDepth, colorType, interlace, sample };
}

for (const [name, path] of Object.entries(IMAGE_PATHS)) {
  const png = decodePng(readFileSync(resolve(path)));
  if (png.width !== 2048 || png.height !== 1152)
    throw new Error(`Unexpected dimensions of ${path}: ${png.width}x${png.height}`);
  const witness = {
    sourcePath: path,
    width: png.width, height: png.height,
    bitDepth: png.bitDepth, colorType: png.colorType,
    note: "Raw PNG channel witness only. Not an elevation in meters, local slope, coastline delineation or actual walkable geometry.",
    samples: SAMPLES.map(([label, x, y]) => ({ label, x, y, ...png.sample(x, y) }))
  };
  process.stdout.write(JSON.stringify({ layer: name, ...witness }, null, 2) + "\n");
}
