import { prepareDurableChronicleWorld } from '../firstWorldDurableRegistry.ts';

const encoder = new TextEncoder();
const jsonBytes = value => encoder.encode(JSON.stringify(value));

async function digestProjection(projection) {
  const bytes = await crypto.subtle.digest('SHA-256', jsonBytes(projection));
  return 'sha256:' + Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Experimental tick-zero envelope. This is never a v8 World row or receipt. */
export async function prepareWorldSourceCandidate(source, template, request) {
  const { retained } = request;
  const input = retained === undefined ? request.input : {
    account: {
      accountId: retained.world.accountId,
      revision: retained.receipt.expectedAccountRevision,
      lifecycleGeneration: retained.world.accountLifecycleGeneration,
    },
    expectedAccountRevision: retained.receipt.expectedAccountRevision,
    expectedAccountGeneration: retained.world.accountLifecycleGeneration,
    creationIntentId: retained.world.creationIntentId,
    proposedWorldInstanceId: retained.world.worldInstanceId,
    displayName: retained.world.displayName,
    createdAt: retained.world.createdAt,
  };
  const { world, receipt } = await prepareDurableChronicleWorld({ ...input, sourceTemplateJson: template });
  const { economyState, ...worldIdentityAndRules } = world;
  const { projection, authoredPosture, warnings, ...initialEconomyIdentity } = economyState;
  const compact = {
    version: source.compactVersion,
    source: {
      format: source.format,
      scenario: source.scenario,
      sourceFingerprint: source.runtimeFingerprint,
      loaderVersion: source.loaderVersion,
    },
    world: worldIdentityAndRules,
    receipt: { ...receipt, state: 'PREPARED_NOT_COMMITTED' },
    economy: { ...initialEconomyIdentity, ledger: projection.economy },
    projectionFingerprint: await digestProjection({ projection, authoredPosture, warnings }),
  };
  if (retained !== undefined && JSON.stringify(retained) !== JSON.stringify(compact)) {
    throw new Error('The compact tick-zero candidate does not match the verified source or retained authority.');
  }
  return {
    status: 'UNCOMMITTED_TICK_ZERO_CANDIDATE',
    compact,
    projectionFingerprint: compact.projectionFingerprint,
    portableProjectionFingerprint: await digestProjection(projection),
    fullBytes: jsonBytes({ world, receipt }).byteLength,
    compactBytes: jsonBytes(compact).byteLength,
  };
}
