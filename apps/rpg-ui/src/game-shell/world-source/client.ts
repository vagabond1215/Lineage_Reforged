import type { ChronicleWorldCreationInput } from '../firstWorldCreationContract.js';
import type { PreparedDurableWorld, WorldEconomyGenesis } from '../firstWorldDurableRegistry.js';

export type WorldSourceInput = Omit<ChronicleWorldCreationInput, 'sourceTemplateJson'>;
export type CompactWorldSourceCandidate = {
  version: number;
  source: {
    format: string;
    scenario: { id: string; version: number };
    sourceFingerprint: string;
    loaderVersion: number;
  };
  world: Omit<PreparedDurableWorld['world'], 'economyState'>;
  receipt: Omit<PreparedDurableWorld['receipt'], 'state'> & { state: 'PREPARED_NOT_COMMITTED' };
  economy: Omit<WorldEconomyGenesis, 'projection' | 'authoredPosture' | 'warnings'> & {
    ledger: WorldEconomyGenesis['projection']['economy'];
  };
  projectionFingerprint: string;
};
export type WorldSourceResult = {
  status: 'UNCOMMITTED_TICK_ZERO_CANDIDATE';
  compact: CompactWorldSourceCandidate;
  projectionFingerprint: string;
  portableProjectionFingerprint: string;
  fullBytes: number;
  compactBytes: number;
  sourceBytes: number;
};

export type WorldSourceRequest = { input: WorldSourceInput } | { retained: CompactWorldSourceCandidate };

export async function prepareBrowserWorldSource(request: WorldSourceRequest): Promise<WorldSourceResult> {
  const worker = new Worker(new URL('./worker.mjs', import.meta.url), { type: 'module' });
  try {
    return await new Promise<WorldSourceResult>((resolve, reject) => {
      worker.onmessage = ({ data }: MessageEvent<
        { ok: true; value: WorldSourceResult } | { ok: false; message: string }
      >) => data.ok ? resolve(data.value) : reject(new Error(data.message));
      worker.onerror = () => reject(new Error('The verified First World source worker could not run.'));
      worker.onmessageerror = () => reject(new Error('The verified First World source worker returned unreadable data.'));
      worker.postMessage(request);
    });
  } finally {
    worker.terminate();
  }
}
