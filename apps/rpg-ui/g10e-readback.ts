import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const target = document.querySelector<HTMLPreElement>('#result')!;
const enc = new TextEncoder();
const digest = async (value: Uint8Array) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', value)))
  .map(byte => byte.toString(16).padStart(2, '0')).join('');
const fields = (row: Record<string, unknown>, names: string[]) => Object.fromEntries(names.map(name => [name, row[name] ?? null]));

document.querySelector<HTMLButtonElement>('#measure')!.onclick = async () => {
  target.textContent = 'MEASURING';
  const owner = await openCleanEpochAccountStore();
  try {
    const raw = await owner.exportArchive();
    const archive = JSON.parse(raw) as { createdAt: string; sha256: string; families: Array<{
      name: string; count: number; sha256: string; rows: Record<string, unknown>[] }> };
    const rows = (name: string) => archive.families.find(family => family.name === name)?.rows ?? [];
    const estimate = await navigator.storage?.estimate?.();
    const persisted = await navigator.storage?.persisted?.();
    target.textContent = JSON.stringify({ createdAt: archive.createdAt, archiveBytes: enc.encode(raw).byteLength,
      fileSha256: await digest(enc.encode(raw)), manifestSha256: archive.sha256,
      families: archive.families.map(family => ({ name: family.name, count: family.count,
        serializedRowsBytes: enc.encode(JSON.stringify(family.rows)).byteLength, sha256: family.sha256 })),
      accounts: rows('accounts').map(row => ({ ...fields(row, ['accountId', 'revision', 'lifecycleGeneration']),
        runCharacterIds: ((row.profile as { history?: { runRecords?: Array<{ characterId: string }> } })?.history?.runRecords ?? [])
          .map(run => run.characterId) })),
      heads: rows('controls').map(row => ({ ...fields(row, ['accountId', 'campaignId']),
        ...fields(row.value as Record<string, unknown>, ['headArtifactId', 'headPublicationId', 'headRevision']) })),
      addresses: rows('slots').map(row => fields(row, ['accountId', 'slotId', 'artifactId', 'publicationId'])),
      generations: rows('currentSlotGenerations').map(row => fields(row,
        ['accountId', 'slotId', 'slotGenerationId', 'campaignId'])),
      artifacts: rows('artifacts').map(row => fields(row, ['accountId', 'campaignId', 'artifactId', 'publicationId'])),
      witnesses: rows('witnesses').map(row => fields(row, ['accountId', 'campaignId', 'requestId'])),
      lifecycle: rows('accountLifecycle').map(row => fields(row,
        ['accountId', 'requestId', 'lifecycleGeneration'])),
      storage: { usage: estimate?.usage ?? null, quota: estimate?.quota ?? null, persisted: persisted ?? null },
      epochHintPresent: localStorage.getItem('cataclysm-rpg-ui.epoch1.session') !== null
    }, null, 2);
  } catch (error) { target.textContent = `MEASUREMENT FAILED: ${error instanceof Error ? error.message : 'unknown'}`; }
  finally { owner.close(); }
};

document.querySelector<HTMLButtonElement>('#persist')!.onclick = async () => {
  try {
    const result = await navigator.storage?.persist?.();
    const persisted = await navigator.storage?.persisted?.();
    target.textContent = JSON.stringify({ persistSupported: Boolean(navigator.storage?.persist),
      persistResult: result ?? null, persisted: persisted ?? null }, null, 2);
  } catch (error) { target.textContent = `PERSISTENCE FAILED: ${error instanceof Error ? error.message : 'unknown'}`; }
};
