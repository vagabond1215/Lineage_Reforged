import { prepareDurableChronicleWorld } from '../../src/game-shell/firstWorldDurableRegistry.ts';

const encoder = new TextEncoder();

async function describe(value) {
  const bytes = encoder.encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return {
    bytes: bytes.byteLength,
    sha256: Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join(''),
  };
}

/** Measure the existing draft row shape in memory without opening a store. */
export async function measureWorldEconomy(sourceTemplateJson, identity = 'alpha') {
  const prepared = await prepareDurableChronicleWorld({
    account: { accountId: `world.a1.account.${identity}`, revision: 1, lifecycleGeneration: 1 },
    expectedAccountRevision: 1,
    expectedAccountGeneration: 1,
    creationIntentId: `world.create.a1.${identity}`,
    proposedWorldInstanceId: `world.instance.a1.${identity}`,
    displayName: 'First World A1',
    createdAt: '2026-11-22T00:00:00.000Z',
    sourceTemplateJson,
  });
  const { world, receipt } = prepared;
  const economy = world.economyState;
  return {
    clock: economy.clock,
    local: economy.localSettlementIds,
    context: economy.externalTradeContextSettlementIds,
    warnings: economy.warnings,
    servicesEnabled: economy.servicesEnabled,
    inventoryItemsMinted: economy.inventoryItemsMinted,
    templateFingerprint: economy.sourceManifestFingerprint,
    worldInstanceId: world.worldInstanceId,
    projection: await describe(economy.projection),
    projectionParts: Object.fromEntries(await Promise.all(Object.entries(economy.projection)
      .map(async ([key, value]) => [key, await describe(value)]))),
    warningBytes: await describe(economy.warnings),
    authoredPosture: await describe(economy.authoredPosture),
    economy: await describe(economy),
    world: await describe(world),
    receipt: await describe(receipt),
    pair: await describe(prepared),
  };
}
