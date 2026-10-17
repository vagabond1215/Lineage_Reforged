import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
type Archive = { families: Array<{ name: string; count: number; sha256: string; rows: unknown[] }> };
async function digest(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}
document.querySelector<HTMLInputElement>('#archive')!.onchange = () => {
  void (async () => {
    const file = document.querySelector<HTMLInputElement>('#archive')!.files?.[0];
    if (!file) return;
    output.textContent = 'COMPARING';
    const text = await file.text();
    const source = JSON.parse(text) as Archive;
    const owner = await openCleanEpochAccountStore();
    try {
      const targetText = await owner.exportArchive();
      const target = JSON.parse(targetText) as Archive;
      const families = source.families.map((family, index) => ({ name: family.name,
        sourceCount: family.count, targetCount: target.families[index]?.count,
        sourceSha256: family.sha256, targetSha256: target.families[index]?.sha256,
        exact: family.count === target.families[index]?.count &&
          family.sha256 === target.families[index]?.sha256 }));
      const rows = (name: string) => target.families.find(f => f.name === name)?.rows ?? [];
      output.textContent = JSON.stringify({ status: families.length === 14 &&
        families.every(f => f.exact) ? 'PASS_ALL_14_EXACT' : 'FAIL_FAMILY_DRIFT',
        sourceFileBytes: file.size, sourceFileSha256: await digest(text),
        targetExportBytes: new TextEncoder().encode(targetText).byteLength,
        targetExportSha256: await digest(targetText), families,
        accounts: rows('accounts').map(row => { const item = row as { accountId: string; revision: number;
          profile: { history: { runRecords: unknown[] } } }; return { accountId: item.accountId,
            revision: item.revision, runCount: item.profile.history.runRecords.length }; }),
        heads: rows('controls').map(row => { const item = row as { accountId: string; campaignId: string;
          value: { headArtifactId: string; headPublicationId: string; headRevision: number } };
          return { accountId: item.accountId, campaignId: item.campaignId,
            artifactId: item.value.headArtifactId,
            publicationId: item.value.headPublicationId, revision: item.value.headRevision }; }),
        historicalArtifactIds: rows('artifacts').map(row => (row as { artifactId: string }).artifactId)
      }, null, 2);
    } finally { owner.close(); }
  })().catch(error => { output.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
};
