import { openCampaignIndexedDbStore, type CampaignStorePublication, type CampaignStoreFailureCode } from "./src/game-shell/campaignIndexedDbStore.ts";

type Fixture = { raw: string; control: CampaignStorePublication["control"]; witness?: NonNullable<CampaignStorePublication["witness"]> };
const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const key = (suffix: string) => `lineage.campaign-store.qa.${suffix}.${crypto.randomUUID()}`;
const request = (fixture: Fixture): CampaignStorePublication => {
  const envelope = JSON.parse(fixture.raw);
  return {
    accountId: envelope.accountId, campaignId: envelope.campaignId, slotId: envelope.slotId,
    expectedHead: null, artifactRaw: fixture.raw, control: fixture.control,
    ...(fixture.witness ? { witness: fixture.witness } : {})
  };
};
const next = (prior: CampaignStorePublication): CampaignStorePublication => {
  const before = JSON.parse(prior.artifactRaw);
  const envelope = { ...before, artifactId: `${before.artifactId}.descendant`, generationId: `${before.generationId}.descendant`,
    publicationId: `${before.publicationId}.descendant`, headRevision: before.headRevision + 1 };
  return {
    ...prior, artifactRaw: JSON.stringify(envelope), witness: undefined,
    expectedHead: { artifactId: before.artifactId, publicationId: before.publicationId, revision: before.headRevision },
    control: { ...prior.control, headArtifactId: envelope.artifactId, headPublicationId: envelope.publicationId,
      headRevision: envelope.headRevision, previousHeadArtifactId: before.artifactId, previousHeadPublicationId: before.publicationId }
  };
};
async function expectCode(operation: () => Promise<unknown>, code: CampaignStoreFailureCode) {
  try { await operation(); } catch (error) { check((error as { code?: string }).code === code, `expected ${code}, got ${String(error)}`); return; }
  throw new Error(`expected ${code} rejection`);
}
async function test(name: string, run: () => Promise<void>) { await run(); cases.push(name); }
function rawRead<T>(db: IDBDatabase, family: string, identity: IDBValidKey): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(family, "readonly"); const op = tx.objectStore(family).get(identity);
    op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error);
  });
}
function rawChange(db: IDBDatabase, family: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(family, "readwrite"); tx.objectStore(family).put(value);
    tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
  });
}
function rawDelete(db: IDBDatabase, family: string, identity: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(family, "readwrite"); tx.objectStore(family).delete(identity);
    tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
  });
}
async function nativeSuite() {
  const fixtures = await (await fetch("/.campaign-indexeddb-fixtures.json")).json() as { ordinary: Fixture; soundings: Fixture };
  const ordinary = request(fixtures.ordinary);
  const soundings = request(fixtures.soundings);

  await test("native ordinary commit, exact readback, close/reopen and same-source retry", async () => {
    const name = key("ordinary"); let store = await openCampaignIndexedDbStore({ name });
    const first = await store.publish(ordinary);
    check(first.status === "committed" && first.readback.artifactRaw === ordinary.artifactRaw && first.readback.slotRaw === ordinary.artifactRaw, "first publication readback");
    store.close(); store = await openCampaignIndexedDbStore({ name });
    check((await store.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId))?.artifactRaw === ordinary.artifactRaw, "restart readback");
    check((await store.publish(ordinary)).status === "same_source_retry", "same-source retry"); store.close();
  });
  await test("stale head and conflicting same-ID artifact preserve accepted head", async () => {
    const store = await openCampaignIndexedDbStore({ name: key("stale") }); await store.publish(ordinary);
    const stale = next(ordinary);
    stale.expectedHead = { artifactId: "artifact.stale", publicationId: "publication.stale", revision: 1 };
    stale.control = { ...stale.control, previousHeadArtifactId: "artifact.stale", previousHeadPublicationId: "publication.stale" };
    await expectCode(() => store.publish(stale), "stale_head");
    const changed = { ...ordinary, artifactRaw: ordinary.artifactRaw.replace('"terminal":false', '"terminal":true'), control: { ...ordinary.control, closed: true } };
    await expectCode(() => store.publish(changed), "conflict");
    check((await store.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId))?.artifactRaw === ordinary.artifactRaw, "old head changed"); store.close();
  });
  await test("ordinary descendant and exact reopen", async () => {
    const name = key("descendant"); let store = await openCampaignIndexedDbStore({ name });
    await store.publish(ordinary); const descendant = next(ordinary); await store.publish(descendant);
    store.close(); store = await openCampaignIndexedDbStore({ name });
    check((await store.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId))?.artifactRaw === descendant.artifactRaw, "descendant readback"); store.close();
  });
  await test("native abort after each ordinary write leaves no partial state", async () => {
    for (const family of ["artifacts", "controls", "slots"]) {
      const name = key(`abort-${family}`);
      const store = await openCampaignIndexedDbStore({ name, afterWrite: (at, tx) => { if (at === family) tx.abort(); } });
      await expectCode(() => store.publish(ordinary), "aborted"); store.close();
      const reopened = await openCampaignIndexedDbStore({ name });
      check(await reopened.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId) === null, `partial ${family} head`);
      const db = await new Promise<IDBDatabase>((resolve, reject) => { const op = indexedDB.open(name, 1); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
      for (const f of ["artifacts", "controls", "slots", "witnesses"]) {
        const identity = f === "artifacts" ? [ordinary.accountId, JSON.parse(ordinary.artifactRaw).artifactId] : f === "controls" ? [ordinary.accountId, ordinary.campaignId] : f === "slots" ? [ordinary.accountId, ordinary.slotId] : [ordinary.accountId, ordinary.campaignId, "missing"];
        check(await rawRead(db, f, identity) === undefined, `partial ${family} record at ${f}`);
      }
      db.close(); reopened.close();
    }
  });
  await test("injected quota leaves prior accepted publication exact", async () => {
    const name = key("quota"); const initial = await openCampaignIndexedDbStore({ name }); await initial.publish(ordinary); initial.close();
    const failing = await openCampaignIndexedDbStore({ name, beforeWrite: family => { if (family === "controls") throw new DOMException("quota", "QuotaExceededError"); } });
    await expectCode(() => failing.publish(next(ordinary)), "quota"); failing.close();
    const reopened = await openCampaignIndexedDbStore({ name });
    check((await reopened.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId))?.artifactRaw === ordinary.artifactRaw, "quota changed prior head"); reopened.close();
  });
  await test("malformed stored family and malformed input fail closed", async () => {
    const name = key("malformed"); const store = await openCampaignIndexedDbStore({ name }); await store.publish(ordinary);
    await expectCode(() => store.publish({ ...ordinary, artifactRaw: ordinary.artifactRaw.replace('"version":7', '"version":8') }), "invalid_record");
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const op = indexedDB.open(name, 1); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
    await rawChange(db, "controls", { version: 99, accountId: ordinary.accountId, campaignId: ordinary.campaignId, value: ordinary.control }); db.close();
    await expectCode(() => store.publish(next(ordinary)), "invalid_record"); store.close();
  });
  await test("Soundings first publication and descendant retain applied witness", async () => {
    const name = key("soundings"); let store = await openCampaignIndexedDbStore({ name });
    const first = await store.publish(soundings); check(first.readback.witness?.posture === "applied", "first witness absent");
    const descendant = next(soundings); await store.publish(descendant);
    store.close(); store = await openCampaignIndexedDbStore({ name });
    check((await store.read(soundings.accountId, soundings.campaignId, soundings.slotId))?.witness?.witnessId === soundings.witness?.witnessId, "descendant witness lost");
    check((await store.publish(descendant)).status === "same_source_retry", "Soundings retry failed"); store.close();
  });
  await test("Soundings abort at witness write rolls back head and artifact", async () => {
    const name = key("soundings-abort"); const store = await openCampaignIndexedDbStore({ name, afterWrite: (family, tx) => { if (family === "witnesses") tx.abort(); } });
    await expectCode(() => store.publish(soundings), "aborted"); store.close();
    const reopened = await openCampaignIndexedDbStore({ name }); check(await reopened.read(soundings.accountId, soundings.campaignId, soundings.slotId) === null, "Soundings partial head"); reopened.close();
  });
  await test("conflicting witness and missing first provenance reject without promotion", async () => {
    const name = key("soundings-conflict"); const store = await openCampaignIndexedDbStore({ name }); await store.publish(soundings);
    const changedWitness = { ...soundings.witness!, sourceArtifactId: "artifact.conflicting.source" };
    await expectCode(() => store.publish({ ...soundings, witness: changedWitness }), "conflict");
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const op = indexedDB.open(name, 1); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
    const witness = await rawRead<Record<string, unknown>>(db, "witnesses", [soundings.accountId, soundings.campaignId, soundings.witness!.requestId]);
    await rawChange(db, "witnesses", { ...witness, version: 99 }); db.close();
    await expectCode(() => store.publish(next(soundings)), "invalid_record"); store.close();
  });
  await test("missing and pending Soundings witness block descendants", async () => {
    for (const posture of ["missing", "pending"]) {
      const name = key(`soundings-${posture}`); const store = await openCampaignIndexedDbStore({ name }); await store.publish(soundings);
      const db = await new Promise<IDBDatabase>((resolve, reject) => { const op = indexedDB.open(name, 1); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
      const identity = [soundings.accountId, soundings.campaignId, soundings.witness!.requestId];
      if (posture === "missing") await rawDelete(db, "witnesses", identity);
      else {
        const retained = await rawRead<Record<string, unknown>>(db, "witnesses", identity);
        await rawChange(db, "witnesses", { ...retained, value: { ...(retained?.value as object), posture: "pending" } });
      }
      db.close(); await expectCode(() => store.publish(next(soundings)), "invalid_record"); store.close();
    }
  });
  await test("cross-account and cross-slot identity mismatch reject before mutation", async () => {
    const store = await openCampaignIndexedDbStore({ name: key("identity") });
    await expectCode(() => store.publish({ ...ordinary, accountId: "account.other" }), "invalid_record");
    await expectCode(() => store.publish({ ...ordinary, slotId: "slot-2" }), "invalid_record");
    check(await store.read(ordinary.accountId, ordinary.campaignId, ordinary.slotId) === null, "identity mismatch mutated store"); store.close();
  });
  await test("blocked upgrade and unavailable factory report explicit failures", async () => {
    const name = key("blocked"); const created = await openCampaignIndexedDbStore({ name }); created.close();
    const holder = await new Promise<IDBDatabase>((resolve, reject) => { const op = indexedDB.open(name, 1); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
    await expectCode(() => openCampaignIndexedDbStore({ name, factory: { open: () => indexedDB.open(name, 2) } as IDBFactory }), "blocked_upgrade");
    holder.close();
    await expectCode(() => openCampaignIndexedDbStore({ factory: { open: () => { throw new Error("unavailable"); } } as unknown as IDBFactory }), "unavailable");
  });
}

nativeSuite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; output.dataset.done = "true"; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}\n${String(error)}\n${error?.stack ?? ""}`; output.dataset.done = "true"; });
