import { measureWorldEconomy } from './probe.mjs';
import { verifySourcePack } from './source-pack.mjs';

const pack = verifySourcePack();
const source = {
  historicalFingerprint: pack.historicalFingerprint,
  runtimeFingerprint: pack.runtimeFingerprint,
  files: pack.contentPins.length,
  bytes: pack.contentPins.reduce((total, pin) => total + pack.bytes.get(pin.path).byteLength, 0),
};
const result = await measureWorldEconomy(pack.bytes.get(pack.templatePath).toString('utf8'));
console.log(JSON.stringify({ source, result }));
