import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { SaveSnapshot, SoundingsAdmissionWitness } from "../../../../packages/shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { isSoundingsAdmissionWitness, verifySoundingsAdmissionProvenance } from "../../../../packages/engines/game-engine/src/soundings-admission-witness.js";
import {
  isStoredCampaignControl,
  isStoredSaveEnvelope,
  type StoredCampaignControl,
  type StoredSaveEnvelope
} from "./saveManager.js";

/** Isolated foundation. No existing localStorage caller uses this database yet. */
export const CAMPAIGN_DATABASE_VERSION = 3;
export const CAMPAIGN_DATABASE_NAME = "lineage.campaigns";
export const LEGACY_COPY_RECORD_STORE = "legacyCopyRecords";
export const LEGACY_COPY_MANIFEST_STORE = "legacyCopyManifests";
export const CANONICAL_RECORD_STORE = "canonicalRecords";
export const CANONICAL_MANIFEST_STORE = "canonicalManifests";
type Family = "artifacts" | "controls" | "slots" | "witnesses";
const FAMILIES: Family[] = ["artifacts", "controls", "slots", "witnesses"];

/** Shared schema for the isolated foundation and the clean-epoch database. */
export function ensureCampaignPublicationStores(db: IDBDatabase): void {
  for (const family of FAMILIES) {
    if (db.objectStoreNames.contains(family)) continue;
    const keys = family === "artifacts" ? ["accountId", "artifactId"] : family === "controls" ? ["accountId", "campaignId"] :
      family === "slots" ? ["accountId", "slotId"] : ["accountId", "campaignId", "requestId"];
    const store = db.createObjectStore(family, { keyPath: keys });
    store.createIndex("byAccountCampaign", ["accountId", "campaignId"], { unique: false });
  }
}

export function hasCampaignPublicationStores(db: IDBDatabase): boolean {
  return FAMILIES.every(family => db.objectStoreNames.contains(family));
}

type ArtifactRecord = { version: 1; accountId: string; campaignId: string; artifactId: string; generationId: string; publicationId: string; slotId: string; headRevision: number; raw: string };
type ControlRecord = { version: 1; accountId: string; campaignId: string; value: StoredCampaignControl };
type SlotRecord = { version: 1; accountId: string; campaignId: string; slotId: string; artifactId: string; publicationId: string; raw: string };
type WitnessRecord = { version: 1; accountId: string; campaignId: string; requestId: string; value: SoundingsAdmissionWitness };

export type ExpectedCampaignHead = { artifactId: string; publicationId: string; revision: number } | null;
export type CampaignStorePublication = {
  accountId: string;
  campaignId: string;
  slotId: string;
  expectedHead: ExpectedCampaignHead;
  /** Destination address observed by the caller; undefined retains the isolated foundation contract. */
  expectedSlotAddress?: { artifactId: string; publicationId: string } | null;
  artifactRaw: string;
  control: StoredCampaignControl;
  witness?: SoundingsAdmissionWitness;
};
export type CampaignStoreReadback = { artifactRaw: string; control: StoredCampaignControl; slotRaw: string; witness: SoundingsAdmissionWitness | null };
export type CampaignStorePublishResult = { status: "committed" | "same_source_retry"; readback: CampaignStoreReadback };
/** Internal extension point for the inert clean-epoch account/attempt fence. */
export type CampaignPublicationTransactionExtension = {
  storeNames: string[];
  verify: (transaction: IDBTransaction, current: StoredCampaignControl | null) => Promise<void>;
  write: (transaction: IDBTransaction) => Promise<void>;
  /** Independently admitted gameplay evidence; only the epoch descendant owner supplies it. */
  firstSessionWitness?: SoundingsAdmissionWitness;
};
export type CampaignStoreFailureCode = "unavailable" | "blocked_upgrade" | "quota" | "aborted" | "stale_head" | "conflict" | "invalid_record" | "readback_failed";

export class CampaignStoreError extends Error {
  constructor(public readonly code: CampaignStoreFailureCode, message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "CampaignStoreError";
  }
}

function fail(code: CampaignStoreFailureCode, message: string): never { throw new CampaignStoreError(code, message); }
function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
function nonblank(value: unknown): value is string { return typeof value === "string" && value.trim() === value && value.length > 0; }
function equal(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
function requestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function storeError(error: unknown, fallback: CampaignStoreFailureCode = "aborted"): CampaignStoreError {
  if (error instanceof CampaignStoreError) return error;
  const name = record(error) ? error.name : null;
  return new CampaignStoreError(name === "QuotaExceededError" ? "quota" : fallback, `Campaign store ${name === "QuotaExceededError" ? "quota exceeded" : "transaction aborted"}.`, error);
}

function validatedEnvelope(raw: string, accountId: string, campaignId: string, slotId?: string): { envelope: StoredSaveEnvelope; snapshot: SaveSnapshot } {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return fail("invalid_record", "Artifact envelope is malformed JSON."); }
  if (!isStoredSaveEnvelope(parsed) || !nonblank(parsed.artifactId) || !nonblank(parsed.generationId) || !nonblank(parsed.publicationId) ||
      parsed.accountId !== accountId || parsed.campaignId !== campaignId || (slotId !== undefined && parsed.slotId !== slotId) ||
      parsed.metadata.slotId !== parsed.slotId || !Number.isSafeInteger(parsed.headRevision) || parsed.headRevision < 1) {
    return fail("invalid_record", "Artifact envelope version or identity is invalid.");
  }
  try {
    const snapshot = deserializeSnapshot(parsed.snapshot);
    if (!isTargetCampaignSnapshot(snapshot) || snapshot.accountId !== accountId ||
        snapshot.campaignIdentity?.campaignId !== campaignId || snapshot.campaignIdentity?.continuityId !== parsed.continuityId ||
        snapshot.playerState.playerId !== parsed.characterId || snapshot.snapshotVersion !== parsed.snapshotFormatId) {
      return fail("invalid_record", "Artifact snapshot does not match its envelope.");
    }
    return { envelope: parsed, snapshot };
  } catch { return fail("invalid_record", "Artifact snapshot cannot be decoded."); }
}

function artifactRecord(value: unknown, accountId: string, artifactId: string): value is ArtifactRecord {
  return record(value) && value.version === 1 && value.accountId === accountId && value.artifactId === artifactId &&
    nonblank(value.campaignId) && nonblank(value.generationId) && nonblank(value.publicationId) && nonblank(value.slotId) &&
    Number.isSafeInteger(value.headRevision) && typeof value.raw === "string" &&
    (() => { try { const e = validatedEnvelope(value.raw as string, accountId, value.campaignId as string); return e.envelope.artifactId === artifactId && e.envelope.generationId === value.generationId && e.envelope.publicationId === value.publicationId && e.envelope.slotId === value.slotId && e.envelope.headRevision === value.headRevision; } catch { return false; } })();
}
function controlRecord(value: unknown, accountId: string, campaignId: string): value is ControlRecord {
  return record(value) && value.version === 1 && value.accountId === accountId && value.campaignId === campaignId &&
    isStoredCampaignControl(value.value) && value.value.accountId === accountId && value.value.campaignId === campaignId;
}
function slotRecord(value: unknown, accountId: string, slotId: string): value is SlotRecord {
  return record(value) && value.version === 1 && value.accountId === accountId && value.slotId === slotId &&
    nonblank(value.campaignId) && nonblank(value.artifactId) && nonblank(value.publicationId) && typeof value.raw === "string" &&
    (() => { try { const e = validatedEnvelope(value.raw as string, accountId, value.campaignId as string, slotId).envelope; return e.artifactId === value.artifactId && e.publicationId === value.publicationId; } catch { return false; } })();
}
function witnessRecord(value: unknown, accountId: string, campaignId: string, requestId: string): value is WitnessRecord {
  return record(value) && value.version === 1 && value.accountId === accountId && value.campaignId === campaignId && value.requestId === requestId &&
    isSoundingsAdmissionWitness(value.value) && value.value.accountId === accountId && value.value.campaignId === campaignId && value.value.requestId === requestId;
}

function validateWitness(witness: SoundingsAdmissionWitness, snapshot: SaveSnapshot, first: StoredSaveEnvelope): void {
  if (!isSoundingsAdmissionWitness(witness) || witness.posture !== "applied" || witness.accountId !== first.accountId ||
      witness.campaignId !== first.campaignId || witness.characterId !== first.characterId ||
      witness.firstDurableArtifactId !== first.artifactId || witness.firstDurablePublicationId !== first.publicationId ||
      witness.firstDurableHeadRevision !== first.headRevision ||
      verifySoundingsAdmissionProvenance(snapshot, { soundingsAdmissionWitness: witness, retainedMutationResults: [] }) !== "verified") {
    fail("invalid_record", "Soundings first-publication provenance is invalid.");
  }
}

async function validateFirstDescendantWitnessSource(tx: IDBTransaction, witness: SoundingsAdmissionWitness,
  first: StoredSaveEnvelope): Promise<void> {
  if (first.headRevision === 1) return;
  const retained = await requestValue(tx.objectStore("artifacts").get([first.accountId, witness.sourceArtifactId]) as IDBRequest<unknown>);
  if (!artifactRecord(retained, first.accountId, witness.sourceArtifactId) ||
      retained.campaignId !== first.campaignId || retained.publicationId !== witness.sourcePublicationId ||
      retained.headRevision > witness.sourceRevision || retained.headRevision >= first.headRevision)
    fail("invalid_record", "First Soundings witness lacks its exact retained source artifact.");
  const source = validatedEnvelope(retained.raw, first.accountId, first.campaignId);
  if (source.envelope.characterId !== first.characterId ||
      source.envelope.continuityId !== witness.sourceContinuityId ||
      verifySoundingsAdmissionProvenance(source.snapshot) !== "not_completed")
    fail("invalid_record", "First Soundings witness source authority is invalid.");
}

function validateRequest(input: CampaignStorePublication): { envelope: StoredSaveEnvelope; snapshot: SaveSnapshot; requestId: string | null } {
  if (![input.accountId, input.campaignId, input.slotId].every(nonblank)) fail("invalid_record", "Publication identity is blank.");
  const { envelope, snapshot } = validatedEnvelope(input.artifactRaw, input.accountId, input.campaignId, input.slotId);
  const control = input.control;
  if (!isStoredCampaignControl(control) || control.accountId !== input.accountId || control.campaignId !== input.campaignId ||
      control.headArtifactId !== envelope.artifactId || control.headPublicationId !== envelope.publicationId ||
      control.headRevision !== envelope.headRevision || control.closed !== envelope.terminal ||
      control.previousHeadArtifactId !== (input.expectedHead?.artifactId ?? null) ||
      control.previousHeadPublicationId !== (input.expectedHead?.publicationId ?? null) ||
      envelope.headRevision !== (input.expectedHead?.revision ?? 0) + 1) {
    fail("invalid_record", "Publication control and expected predecessor do not match artifact authority.");
  }
  const requestId = snapshot.authorityLedger?.soundingsTurnIn?.requests[0]?.requestId ?? null;
  if (input.witness && (!isSoundingsAdmissionWitness(input.witness) || input.witness.posture !== "applied" ||
      input.witness.accountId !== input.accountId || input.witness.campaignId !== input.campaignId || input.witness.requestId !== requestId)) {
    fail("invalid_record", "Supplied Soundings witness is invalid.");
  }
  if (snapshot.authorityLedger?.soundingsTurnIn?.version === 2 && !requestId) fail("invalid_record", "Soundings v2 request is missing.");
  if (!requestId && verifySoundingsAdmissionProvenance(snapshot) !== "not_completed") fail("invalid_record", "Artifact Soundings authority is invalid.");
  return { envelope, snapshot, requestId };
}

export type CampaignStoreOptions = {
  name?: string;
  factory?: IDBFactory;
  /** Fault injection for isolated native-browser tests; never used by live callers. */
  beforeWrite?: (family: Family, transaction: IDBTransaction) => void;
  /** Fault injection after a queued write has succeeded; rollback still belongs to IndexedDB. */
  afterWrite?: (family: Family, transaction: IDBTransaction) => void;
};

/** Schema access for the isolated legacy copy owner. Never exposes a live caller. */
export async function openCampaignIndexedDbDatabase(options: Pick<CampaignStoreOptions, "name" | "factory"> = {}): Promise<IDBDatabase> {
  let factory: IDBFactory | undefined;
  try { factory = options.factory ?? globalThis.indexedDB; }
  catch (error) { throw new CampaignStoreError("unavailable", "IndexedDB is unavailable in this browser.", error); }
  if (!factory) fail("unavailable", "IndexedDB is unavailable in this browser.");
  const name = options.name ?? CAMPAIGN_DATABASE_NAME;
  return new Promise((resolve, reject) => {
    let blocked = false;
    let request: IDBOpenDBRequest;
    try { request = factory.open(name, CAMPAIGN_DATABASE_VERSION); }
    catch (error) { reject(storeError(error, "unavailable")); return; }
    request.onblocked = () => { blocked = true; reject(new CampaignStoreError("blocked_upgrade", "IndexedDB upgrade is blocked by another connection.")); };
    request.onupgradeneeded = () => {
      const db = request.result;
      ensureCampaignPublicationStores(db);
      if (!db.objectStoreNames.contains(LEGACY_COPY_RECORD_STORE)) {
        const store = db.createObjectStore(LEGACY_COPY_RECORD_STORE, { keyPath: ["copyId", "key"] });
        store.createIndex("byCopy", "copyId", { unique: false });
      }
      if (!db.objectStoreNames.contains(LEGACY_COPY_MANIFEST_STORE)) {
        db.createObjectStore(LEGACY_COPY_MANIFEST_STORE, { keyPath: "copyId" });
      }
      if (!db.objectStoreNames.contains(CANONICAL_RECORD_STORE)) {
        const store = db.createObjectStore(CANONICAL_RECORD_STORE, { keyPath: ["copyId", "scopeKind", "scopeId", "family", "identity"] });
        store.createIndex("byGenerationScope", ["copyId", "scopeKind", "scopeId"], { unique: false });
        store.createIndex("byGenerationScopeFamily", ["copyId", "scopeKind", "scopeId", "family"], { unique: false });
        store.createIndex("byGenerationKey", ["copyId", "originalKey"], { unique: true });
      }
      if (!db.objectStoreNames.contains(CANONICAL_MANIFEST_STORE)) {
        db.createObjectStore(CANONICAL_MANIFEST_STORE, { keyPath: ["copyId", "scopeKind", "scopeId"] });
      }
    };
    request.onerror = () => reject(storeError(request.error, "unavailable"));
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      const db = request.result;
      if (!hasCampaignPublicationStores(db) || !db.objectStoreNames.contains(LEGACY_COPY_RECORD_STORE) || !db.objectStoreNames.contains(LEGACY_COPY_MANIFEST_STORE) || !db.objectStoreNames.contains(CANONICAL_RECORD_STORE) || !db.objectStoreNames.contains(CANONICAL_MANIFEST_STORE)) { db.close(); reject(new CampaignStoreError("invalid_record", "Campaign database schema is incomplete.")); return; }
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

export async function openCampaignIndexedDbStore(options: CampaignStoreOptions = {}): Promise<CampaignIndexedDbStore> {
  const db = await openCampaignIndexedDbDatabase(options);
  return new CampaignIndexedDbStore(db, options.beforeWrite, options.afterWrite);
}

export class CampaignIndexedDbStore {
  constructor(private readonly db: IDBDatabase, private readonly beforeWrite?: CampaignStoreOptions["beforeWrite"], private readonly afterWrite?: CampaignStoreOptions["afterWrite"]) {}
  close(): void { this.db.close(); }

  /** A supplied transaction lets the clean-epoch owner verify provenance before its account write. */
  async read(accountId: string, campaignId: string, slotId: string, transaction?: IDBTransaction): Promise<CampaignStoreReadback | null> {
    const tx = transaction ?? this.db.transaction(FAMILIES, "readonly");
    try {
      const control = await requestValue(tx.objectStore("controls").get([accountId, campaignId]) as IDBRequest<unknown>);
      if (control === undefined) return null;
      if (!controlRecord(control, accountId, campaignId)) fail("invalid_record", "Stored campaign control is malformed.");
      const artifact = await requestValue(tx.objectStore("artifacts").get([accountId, control.value.headArtifactId]) as IDBRequest<unknown>);
      const slot = await requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>);
      const addressed = slotRecord(slot, accountId, slotId)
        ? await requestValue(tx.objectStore("artifacts").get([accountId, slot.artifactId]) as IDBRequest<unknown>) : undefined;
      if (!artifactRecord(artifact, accountId, control.value.headArtifactId) || !slotRecord(slot, accountId, slotId) ||
          !artifactRecord(addressed, accountId, slot.artifactId) || slot.campaignId !== campaignId ||
          addressed.campaignId !== campaignId || slot.raw !== addressed.raw ||
          slot.publicationId !== addressed.publicationId || addressed.headRevision > control.value.headRevision ||
          artifact.campaignId !== campaignId || artifact.publicationId !== control.value.headPublicationId ||
          artifact.headRevision !== control.value.headRevision) {
        fail("invalid_record", "Stored head, artifact and slot disagree.");
      }
      const { snapshot } = validatedEnvelope(artifact.raw, accountId, campaignId);
      const requestId = snapshot.authorityLedger?.soundingsTurnIn?.requests[0]?.requestId;
      let witness: SoundingsAdmissionWitness | null = null;
      const retainedWitnesses = await requestValue(tx.objectStore("witnesses").index("byAccountCampaign").getAll([accountId, campaignId]) as IDBRequest<unknown[]>);
      if (retainedWitnesses.length > (requestId ? 1 : 0)) fail("invalid_record", "Campaign has conflicting retained Soundings witnesses.");
      if (!requestId && retainedWitnesses.length) fail("invalid_record", "Campaign discarded retained Soundings provenance.");
      if (requestId) {
        const stored = await requestValue(tx.objectStore("witnesses").get([accountId, campaignId, requestId]) as IDBRequest<unknown>);
        if (stored !== undefined) {
          if (!witnessRecord(stored, accountId, campaignId, requestId)) fail("invalid_record", "Stored Soundings witness is malformed.");
          witness = stored.value;
        }
        if (witness && snapshot.authorityLedger?.soundingsTurnIn?.version !== 2) fail("invalid_record", "Campaign downgraded retained Soundings provenance.");
        if (snapshot.authorityLedger?.soundingsTurnIn?.version === 2) {
          if (!witness || witness.posture !== "applied") fail("invalid_record", "Soundings first-publication witness is missing.");
          const first = await requestValue(tx.objectStore("artifacts").get([accountId, witness.firstDurableArtifactId]) as IDBRequest<unknown>);
          if (!artifactRecord(first, accountId, witness.firstDurableArtifactId)) fail("invalid_record", "Soundings first artifact is missing.");
          validateWitness(witness, validatedEnvelope(first.raw, accountId, campaignId).snapshot, validatedEnvelope(first.raw, accountId, campaignId).envelope);
          await validateFirstDescendantWitnessSource(tx, witness, validatedEnvelope(first.raw, accountId, campaignId).envelope);
          if (verifySoundingsAdmissionProvenance(snapshot, { soundingsAdmissionWitness: witness, retainedMutationResults: [] }) !== "verified") fail("invalid_record", "Current Soundings provenance conflicts with retained witness.");
        }
      }
      return { artifactRaw: artifact.raw, control: control.value, slotRaw: slot.raw, witness };
    } catch (error) { throw storeError(error, "invalid_record"); }
  }

  async publish(input: CampaignStorePublication, extension?: CampaignPublicationTransactionExtension): Promise<CampaignStorePublishResult> {
    const { envelope, snapshot, requestId } = validateRequest(input);
    const sessionWitness = extension?.firstSessionWitness;
    if (sessionWitness && (input.witness || !input.expectedHead || !isSoundingsAdmissionWitness(sessionWitness) ||
        sessionWitness.posture !== "session" || sessionWitness.accountId !== input.accountId ||
        sessionWitness.campaignId !== input.campaignId || sessionWitness.requestId !== requestId))
      fail("invalid_record", "First descendant session witness is invalid.");
    const appliedWitness: SoundingsAdmissionWitness | undefined = sessionWitness && sessionWitness.posture === "session"
      ? { ...sessionWitness, posture: "applied", firstDurableArtifactId: envelope.artifactId,
          firstDurablePublicationId: envelope.publicationId, firstDurableHeadRevision: envelope.headRevision }
      : input.witness;
    const acceptedInput = appliedWitness ? { ...input, witness: appliedWitness } : input;
    let tx: IDBTransaction;
    try { tx = this.db.transaction([...FAMILIES, ...(extension?.storeNames ?? [])], "readwrite"); }
    catch (error) { throw storeError(error); }
    let transactionError: unknown;
    const completion = new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(transactionError ?? tx.error ?? new CampaignStoreError("aborted", "Campaign publication aborted."));
      tx.onerror = () => { transactionError ??= tx.error; };
    });
    // Keep all IndexedDB work inside this transaction. Await only request events.
    try {
      const [current, existingArtifact, address, existingWitness, retainedWitnesses] = await Promise.all([
        requestValue(tx.objectStore("controls").get([input.accountId, input.campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts").get([input.accountId, envelope.artifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots").get([input.accountId, input.slotId]) as IDBRequest<unknown>),
        requestId ? requestValue(tx.objectStore("witnesses").get([input.accountId, input.campaignId, requestId]) as IDBRequest<unknown>) : Promise.resolve(undefined),
        requestValue(tx.objectStore("witnesses").index("byAccountCampaign").getAll([input.accountId, input.campaignId]) as IDBRequest<unknown[]>)
      ]);
      if (current !== undefined && !controlRecord(current, input.accountId, input.campaignId)) fail("invalid_record", "Stored campaign head is malformed.");
      await extension?.verify(tx, current?.value ?? null);
      if (existingArtifact !== undefined && !artifactRecord(existingArtifact, input.accountId, envelope.artifactId)) fail("invalid_record", "Stored immutable artifact is malformed.");
      if (address !== undefined && !slotRecord(address, input.accountId, input.slotId)) fail("invalid_record", "Stored slot address is malformed.");
      if (address) {
        const addressedPrior = await requestValue(tx.objectStore("artifacts")
          .get([input.accountId, address.artifactId]) as IDBRequest<unknown>);
        if (!artifactRecord(addressedPrior, input.accountId, address.artifactId) ||
            addressedPrior.campaignId !== address.campaignId ||
            addressedPrior.publicationId !== address.publicationId || addressedPrior.raw !== address.raw)
          fail("invalid_record", "Destination address lacks its retained immutable artifact.");
      }
      if (requestId && existingWitness !== undefined && !witnessRecord(existingWitness, input.accountId, input.campaignId, requestId)) fail("invalid_record", "Stored witness is malformed.");
      if (retainedWitnesses.length > (requestId ? 1 : 0) || (!requestId && retainedWitnesses.length)) fail("invalid_record", "Campaign cannot discard or multiply retained Soundings provenance.");
      if (current) {
        const prior = await requestValue(tx.objectStore("artifacts").get([input.accountId, current.value.headArtifactId]) as IDBRequest<unknown>);
        if (!artifactRecord(prior, input.accountId, current.value.headArtifactId) || prior.campaignId !== input.campaignId ||
            prior.publicationId !== current.value.headPublicationId || prior.headRevision !== current.value.headRevision) {
          fail("invalid_record", "Stored predecessor head has no verified immutable artifact.");
        }
      }
      if (existingArtifact && existingArtifact.raw !== input.artifactRaw) fail("conflict", "Immutable artifact ID has conflicting bytes.");
      if (existingWitness && appliedWitness && !equal((existingWitness as WitnessRecord).value, appliedWitness)) fail("conflict", "Immutable Soundings witness conflicts.");
      if (current && equal(current.value, input.control)) {
        if (!existingArtifact || !address || address.raw !== input.artifactRaw || address.campaignId !== input.campaignId) fail("conflict", "Same-head retry has incomplete or conflicting records.");
        await this.verifySoundingsInTransaction(tx, acceptedInput, envelope, snapshot, requestId, existingWitness, !!sessionWitness);
        await completion;
        const readback = await this.exactReadback(acceptedInput);
        return { status: "same_source_retry", readback };
      }
      const expected = input.expectedHead;
      if ((current?.value.headArtifactId ?? null) !== (expected?.artifactId ?? null) ||
          (current?.value.headPublicationId ?? null) !== (expected?.publicationId ?? null) ||
          (current?.value.headRevision ?? 0) !== (expected?.revision ?? 0)) fail("stale_head", "Campaign head changed after publication source was captured.");
      if (current?.value.closed) fail("conflict", "Closed campaign cannot advance.");
      if (input.expectedSlotAddress !== undefined) {
        const wanted = input.expectedSlotAddress;
        if (wanted !== null && (!nonblank(wanted.artifactId) || !nonblank(wanted.publicationId)))
          fail("invalid_record", "Expected destination address is malformed.");
        if ((address?.artifactId ?? null) !== (wanted?.artifactId ?? null) ||
            (address?.publicationId ?? null) !== (wanted?.publicationId ?? null))
          fail("conflict", "Destination address changed after it was captured.");
        if (address && address.campaignId !== input.campaignId)
          fail("conflict", "Destination belongs to another campaign.");
      } else if (address && (address.campaignId !== input.campaignId || (expected && address.artifactId !== expected.artifactId)))
        fail("conflict", "Slot points to another verified publication.");
      await this.verifySoundingsInTransaction(tx, acceptedInput, envelope, snapshot, requestId, existingWitness, !!sessionWitness);
      const writes: { family: Family; value: ArtifactRecord | ControlRecord | SlotRecord | WitnessRecord }[] = [
        { family: "artifacts", value: { version: 1, accountId: input.accountId, campaignId: input.campaignId, artifactId: envelope.artifactId, generationId: envelope.generationId, publicationId: envelope.publicationId, slotId: input.slotId, headRevision: envelope.headRevision, raw: input.artifactRaw } },
        { family: "controls", value: { version: 1, accountId: input.accountId, campaignId: input.campaignId, value: input.control } },
        { family: "slots", value: { version: 1, accountId: input.accountId, campaignId: input.campaignId, slotId: input.slotId, artifactId: envelope.artifactId, publicationId: envelope.publicationId, raw: input.artifactRaw } }
      ];
      if (appliedWitness && !existingWitness) writes.push({ family: "witnesses", value: { version: 1, accountId: input.accountId, campaignId: input.campaignId, requestId: appliedWitness.requestId, value: appliedWitness } });
      for (const { family, value } of writes) {
        this.beforeWrite?.(family, tx);
        await requestValue(tx.objectStore(family).put(value));
        this.afterWrite?.(family, tx);
      }
      await extension?.write(tx);
      await completion;
    } catch (error) {
      transactionError = error;
      try { tx.abort(); } catch { /* already aborted or committed */ }
      try { await completion; } catch { /* original error is more specific */ }
      throw storeError(error, error instanceof CampaignStoreError ? error.code : "aborted");
    }
    return { status: "committed", readback: await this.exactReadback(acceptedInput) };
  }

  private async verifySoundingsInTransaction(tx: IDBTransaction, input: CampaignStorePublication, envelope: StoredSaveEnvelope, snapshot: SaveSnapshot, requestId: string | null, existing: unknown, sessionIntroduced: boolean): Promise<void> {
    if (!requestId) return;
    const version = snapshot.authorityLedger?.soundingsTurnIn?.version;
    if (version !== 2) {
      if (existing || input.witness || verifySoundingsAdmissionProvenance(snapshot) !== "legacy_unverified") fail("invalid_record", "Soundings authority cannot downgrade retained provenance.");
      return;
    }
    const witness = input.witness ?? (witnessRecord(existing, input.accountId, input.campaignId, requestId) ? existing.value : null);
    if (!witness) fail("invalid_record", "Soundings v2 publication requires an applied witness.");
    if (witness.posture !== "applied") fail("invalid_record", "Soundings witness must be applied.");
    let first: { envelope: StoredSaveEnvelope; snapshot: SaveSnapshot };
    if (witness.firstDurableArtifactId === envelope.artifactId) first = { envelope, snapshot };
    else {
      const retained = await requestValue(tx.objectStore("artifacts").get([input.accountId, witness.firstDurableArtifactId]) as IDBRequest<unknown>);
      if (!artifactRecord(retained, input.accountId, witness.firstDurableArtifactId)) fail("invalid_record", "Retained Soundings first artifact is missing or malformed.");
      first = validatedEnvelope(retained.raw, input.accountId, input.campaignId);
    }
    validateWitness(witness, first.snapshot, first.envelope);
    await validateFirstDescendantWitnessSource(tx, witness, first.envelope);
    if (verifySoundingsAdmissionProvenance(snapshot, { soundingsAdmissionWitness: witness, retainedMutationResults: [] }) !== "verified") fail("invalid_record", "Soundings descendant conflicts with retained provenance.");
    if (input.witness && witness.firstDurableArtifactId !== envelope.artifactId && !existing) fail("invalid_record", "Publication cannot introduce unrelated first provenance.");
    if (input.expectedHead && !existing && !sessionIntroduced) fail("invalid_record", "First descendant provenance requires session evidence.");
  }

  private async exactReadback(input: CampaignStorePublication): Promise<CampaignStoreReadback> {
    let result: CampaignStoreReadback | null;
    try { result = await this.read(input.accountId, input.campaignId, input.slotId); }
    catch (error) { throw storeError(error, "readback_failed"); }
    if (!result || result.artifactRaw !== input.artifactRaw || result.slotRaw !== input.artifactRaw || !equal(result.control, input.control) ||
        (input.witness && !equal(result.witness, input.witness))) fail("readback_failed", "Committed publication failed exact readback.");
    return result;
  }
}
