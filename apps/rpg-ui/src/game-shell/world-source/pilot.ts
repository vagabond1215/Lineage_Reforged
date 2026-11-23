import manifest from '../../../../../docs/design/first-world-economy-source-manifest-v3.json';
import { createInitialClock } from '../../../../../packages/shared/time/src/index.js';
import {
  FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID, FIRST_WORLD_MAP_ID, FIRST_WORLD_TEMPLATE_ID,
} from '../firstWorldCreationContract.js';
import {
  FIRST_WORLD_STARFALL_SOURCE_SHA256, assertRetainedWorldGraph,
  type RetainedChronicleWorld, type RetainedWorldCreationReceipt,
} from '../firstWorldDurableRegistry.js';
import type { CompactWorldSourceCandidate, WorldSourceResult } from './client.js';

export type WorldPilotCreateInput = {
  expectedAccountRevision: number;
  creationIntentId: string;
  proposedWorldInstanceId: string;
  displayName: string;
};

const rules = Object.freeze({
  progressionMode: 'chronicle', worldKind: 'individual', difficulty: 'mortal',
  stakes: 'normal', hardcore: false,
} as const);
const emptyLists = ['characterAssociations', 'campaignSaveAssociations', 'materializedAreaInstances',
  'areaMutationRecords', 'spawnedEntityRecords', 'resourceDepletionRecords', 'scheduledActionRecords',
  'pendingPublicationReceipts', 'committedWorldEvents', 'inventoryMutationRecords'] as const;
const validDigest = (value: unknown) => typeof value === 'string' && /^sha256:[0-9a-f]{64}$/.test(value);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

type PilotBinding = ReturnType<typeof pilotBinding>;
export type CompactPilotWorld = Omit<CompactWorldSourceCandidate['world'], 'version'> & {
  version: 2;
  binding: PilotBinding;
  economyState: CompactWorldSourceCandidate['economy'];
  projectionFingerprint: string;
};
export type CompactPilotReceipt = Omit<RetainedWorldCreationReceipt, 'version'> & {
  version: 2;
  binding: PilotBinding;
  projectionFingerprint: string;
};
export type PilotPair = { world: CompactPilotWorld; receipt: CompactPilotReceipt };
export type StoredWorldPair = PilotPair | { world: RetainedChronicleWorld; receipt: RetainedWorldCreationReceipt };

function pilotBinding(seed: string) {
  return {
    format: 'chronicle_individual_compact_genesis_v1' as const,
    sourceFingerprint: manifest.runtimeFingerprint,
    economySourceFingerprint: manifest.parentFingerprint,
    scenario: { id: 'world_scenario.first_world.chronicle_default_v1', version: 1 },
    generatorVersion: 1,
    seedPolicy: 'sha256-world-genesis-v1' as const,
    seed,
    rules,
  };
}

async function seedFor(world: CompactWorldSourceCandidate['world'] | CompactPilotWorld) {
  const bytes = new TextEncoder().encode(JSON.stringify(['lineage.world.hidden-seed.v1',
    manifest.runtimeFingerprint, world.accountId, world.accountLifecycleGeneration,
    world.creationIntentId, world.worldInstanceId, rules]));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return 'sha256:' + Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

export function samePilotIntent(pair: PilotPair, input: WorldPilotCreateInput): boolean {
  return pair.world.creationIntentId === input.creationIntentId &&
    pair.world.worldInstanceId === input.proposedWorldInstanceId &&
    pair.world.displayName === input.displayName &&
    pair.receipt.expectedAccountRevision === input.expectedAccountRevision;
}

export async function preparePilotPair(result: WorldSourceResult): Promise<PilotPair> {
  const { compact } = result;
  if (result.status !== 'UNCOMMITTED_TICK_ZERO_CANDIDATE' || compact.version !== 1 ||
      !same(compact.source, expectedEconomySource()) || compact.receipt.state !== 'PREPARED_NOT_COMMITTED' ||
      result.projectionFingerprint !== compact.projectionFingerprint)
    throw new Error('World pilot preparation returned an incompatible source or receipt.');
  const binding = pilotBinding(await seedFor(compact.world));
  const projectionFingerprint = compact.projectionFingerprint;
  return {
    world: { ...compact.world, version: 2, binding, economyState: compact.economy, projectionFingerprint },
    receipt: { ...compact.receipt, version: 2, state: 'COMMITTED', binding, projectionFingerprint },
  };
}

function expectedEconomySource() {
  return { format: 'lineage.first-world-economy-source.v2', scenario: pilotBinding('').scenario,
    sourceFingerprint: manifest.parentFingerprint, loaderVersion: 2 };
}

export async function pilotRebuildInput(pair: PilotPair): Promise<CompactWorldSourceCandidate> {
  const { binding, economyState, projectionFingerprint, ...world } = pair.world;
  const { binding: _binding, projectionFingerprint: _projection, ...receipt } = pair.receipt;
  if (binding.seed !== await seedFor(pair.world)) throw new Error('The retained World seed differs from its genesis intent.');
  return {
    version: 1, source: expectedEconomySource(), world: { ...world, version: 1 },
    receipt: { ...receipt, version: 1, state: 'PREPARED_NOT_COMMITTED' },
    economy: economyState, projectionFingerprint,
  };
}

/** Structural admission for indexed transactions. Rebuild exact content after closing the transaction. */
export function checkedWorldPair(accountId: string, generation: number, revision: number,
  worlds: unknown[], receipts: unknown[]): StoredWorldPair | undefined {
  const world = worlds[0], receipt = receipts[0];
  if (!(object(world) && world.version === 2) && !(object(receipt) && receipt.version === 2)) {
    assertRetainedWorldGraph(accountId, generation, worlds, receipts, revision);
    if (!world) return undefined;
    return { world: world as RetainedChronicleWorld, receipt: receipt as RetainedWorldCreationReceipt };
  }
  if (worlds.length !== 1 || receipts.length !== 1 || !object(world) || !object(receipt) ||
      world.version !== 2 || receipt.version !== 2 || world.status !== 'CREATED_EMPTY' || receipt.state !== 'COMMITTED' ||
      world.accountId !== accountId || receipt.accountId !== accountId ||
      world.accountLifecycleGeneration !== generation || receipt.accountLifecycleGeneration !== generation ||
      !Number.isSafeInteger(receipt.expectedAccountRevision) || Number(receipt.expectedAccountRevision) < 1 ||
      Number(receipt.expectedAccountRevision) > revision || world.worldRevision !== 0 || receipt.completedWorldRevision !== 0 ||
      typeof world.worldInstanceId !== 'string' || !world.worldInstanceId.startsWith('world.instance.') ||
      typeof world.creationIntentId !== 'string' || !world.creationIntentId.startsWith('world.create.') ||
      receipt.worldInstanceId !== world.worldInstanceId || receipt.creationIntentId !== world.creationIntentId ||
      typeof world.displayName !== 'string' || !world.displayName.trim() || world.displayName !== world.displayName.trim() ||
      world.displayName.length > 80 || /[\u0000-\u001f\u007f]/.test(world.displayName) ||
      receipt.initialDisplayName !== world.displayName || typeof world.createdAt !== 'string' ||
      !Number.isFinite(Date.parse(world.createdAt)) || new Date(world.createdAt).toISOString() !== world.createdAt ||
      receipt.createdAt !== world.createdAt || world.sourceTemplateId !== FIRST_WORLD_TEMPLATE_ID ||
      world.sourceTemplateVersion !== 1 || world.worldMapId !== FIRST_WORLD_MAP_ID ||
      world.localAreaTemplateId !== FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID ||
      world.sourceManifestFingerprint !== FIRST_WORLD_STARFALL_SOURCE_SHA256 ||
      receipt.sourceManifestFingerprint !== world.sourceManifestFingerprint ||
      !object(world.binding) || typeof world.binding.seed !== 'string' || !validDigest(world.binding.seed) ||
      !same(world.binding, pilotBinding(world.binding.seed)) || !same(world.binding, receipt.binding) ||
      !validDigest(world.projectionFingerprint) || world.projectionFingerprint !== receipt.projectionFingerprint ||
      !same(world.rules, { progressionMode: 'chronicle', worldKind: 'individual', hardcore: false,
        difficultyPreset: null, worldRules: null, stakesRules: null, pausePolicy: 'allow',
        timePolicy: { speedMultiplier: 1, worldTimeEpoch: null, allowsPlayerTimeSkip: false, policyVersion: null } }) ||
      !same(world.clock, { elapsedWorldSeconds: 0, paused: false, lastAuthoritativeUpdateAt: null }) ||
      !emptyLists.every(key => Array.isArray(world[key]) && world[key].length === 0))
    throw new Error('The retained compact World and creation receipt have inconsistent authority.');
  const economy = world.economyState;
  if (!object(economy) || economy.version !== 1 || economy.owner !== 'civilization-engine' ||
      economy.worldInstanceId !== world.worldInstanceId || economy.sourceManifestFingerprint !== world.sourceManifestFingerprint ||
      economy.economyTick !== 0 || !same(economy.clock, createInitialClock()) ||
      economy.servicesEnabled !== false || economy.inventoryItemsMinted !== false ||
      !object(economy.ledger) || !Array.isArray(economy.ledger.nodes) ||
      'projection' in economy || 'warnings' in economy || 'authoredPosture' in economy)
    throw new Error('The retained compact World has an invalid initial ledger.');
  return { world: world as unknown as CompactPilotWorld, receipt: receipt as unknown as CompactPilotReceipt };
}

export function isPilotPair(pair: StoredWorldPair): pair is PilotPair {
  return pair.world.version === 2;
}
