import type { SaveSnapshot } from "../../types/src/index.js";

export function serializeSnapshot(snapshot: SaveSnapshot): string {
  return JSON.stringify(snapshot);
}

export function deserializeSnapshot(serialized: string): SaveSnapshot {
  return JSON.parse(serialized) as SaveSnapshot;
}