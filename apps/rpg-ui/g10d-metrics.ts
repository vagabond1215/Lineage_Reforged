import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
document.querySelector<HTMLButtonElement>('#persist')!.onclick = async () => {
  const target = document.querySelector<HTMLPreElement>('#persistence')!;
  try {
    target.textContent = JSON.stringify({ supported: Boolean(navigator.storage?.persist),
      granted: navigator.storage?.persist ? await navigator.storage.persist() : null,
      persisted: navigator.storage?.persisted ? await navigator.storage.persisted() : null });
  } catch { target.textContent = 'PERSISTENCE REQUEST FAILED'; }
};
document.querySelector<HTMLButtonElement>('#measure')!.onclick = async () => {
  output.textContent = 'MEASURING';
  try {
    const owner = await openCleanEpochAccountStore();
    const text = await owner.exportArchive();
    const archive = JSON.parse(text) as { sha256: string; families: Array<{
      name: string; count: number; sha256: string; rows: unknown[]
    }> };
    const encoder = new TextEncoder();
    const estimate = navigator.storage?.estimate ? await navigator.storage.estimate() : null;
    const persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : null;
    output.textContent = JSON.stringify({
      archiveBytes: encoder.encode(text).byteLength,
      archiveSha256: archive.sha256,
      accountRevisions: (archive.families.find(family => family.name === 'accounts')?.rows ?? [])
        .map(row => ({ accountId: (row as { accountId: string }).accountId,
          revision: (row as { revision: number }).revision })),
      heads: (archive.families.find(family => family.name === 'controls')?.rows ?? [])
        .map(row => { const control = row as { accountId: string; campaignId: string;
          value: { headArtifactId: string; headPublicationId: string; headRevision: number } };
          return { accountId: control.accountId, campaignId: control.campaignId,
            artifactId: control.value.headArtifactId, publicationId: control.value.headPublicationId,
            revision: control.value.headRevision }; }),
      addresses: (archive.families.find(family => family.name === 'slots')?.rows ?? [])
        .map(row => { const slot = row as { accountId: string; slotId: string;
          artifactId: string; publicationId: string };
          return { accountId: slot.accountId, slotId: slot.slotId,
            artifactId: slot.artifactId, publicationId: slot.publicationId }; }),
      families: archive.families.map(family => ({ name: family.name, count: family.count,
        serializedRowsBytes: encoder.encode(JSON.stringify(family.rows)).byteLength,
        sha256: family.sha256 })),
      browserEstimate: estimate ? { usage: estimate.usage ?? null, quota: estimate.quota ?? null } : null,
      persisted
    }, null, 2);
  } catch {
    output.textContent = 'MEASUREMENT FAILED';
  }
};
