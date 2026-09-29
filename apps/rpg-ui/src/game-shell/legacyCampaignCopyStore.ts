import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { AccountProfileState, SaveSnapshot, SoundingsAdmissionWitness } from "../../../../packages/shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { isSoundingsAdmissionWitness, verifySoundingsAdmissionProvenance } from "../../../../packages/engines/game-engine/src/soundings-admission-witness.js";
import { isAccountProfileState } from "./accountProfileManager.js";
import {
  CAMPAIGN_DATABASE_NAME,
  CampaignStoreError,
  LEGACY_COPY_MANIFEST_STORE,
  LEGACY_COPY_RECORD_STORE,
  openCampaignIndexedDbDatabase
} from "./campaignIndexedDbStore.js";
import {
  isLegacyStoredSaveEnvelope,
  isStoredCampaignControl,
  isStoredPublicationRecovery,
  isStoredSaveEnvelope,
  type StoredSaveEnvelope
} from "./saveManager.js";

const V7 = "cataclysm-rpg-ui.saves.v7.account.";
const V6 = "cataclysm-rpg-ui.saves.v6.account.";
const ACCOUNT = "cataclysm-rpg-ui.accounts.v1.";
const ATTEMPT = "cataclysm-rpg-ui.new-campaign-attempts.v1.account.";
const OBSOLETE = ["cataclysm-rpg-ui.saves.v5", "cataclysm-rpg-ui.saves.v4", "cataclysm-rpg-ui.saves.v3", "cataclysm-rpg-ui.saves.v2", "cataclysm-rpg-ui.saves.v1", "cataclysm-rpg-ui.save-slot"];
type SourceEntry = { key: string; raw: string };
type Family = "artifact" | "slot" | "control" | "candidate" | "recovery" | "witness" | "migration" | "migration_source" | "v6_slot" | "obsolete" | "profile" | "active_account" | "attempt" | "unknown";
export type LegacyCopyFinding = { code: string; key: string };
export type LegacyCopyManifest = {
  version: 1;
  copyId: string;
  status: "provisional" | "verified" | "verified_with_blockers" | "stale";
  sourceDigest: string;
  sourceCount: number;
  accountIds: string[];
  findings: LegacyCopyFinding[];
};
export type LegacyCopyRecord = { version: 1; copyId: string; key: string; raw: string; digest: string; family: Family; accountId: string | null };
export type LegacyCopyResult = { status: "committed" | "same_source_retry"; manifest: LegacyCopyManifest; records: LegacyCopyRecord[] };
export type LegacyCopyFailureCode = "unavailable" | "blocked_upgrade" | "quota" | "aborted" | "source_changed" | "conflict" | "readback_failed";

export class LegacyCopyError extends Error {
  constructor(public readonly code: LegacyCopyFailureCode, message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "LegacyCopyError";
  }
}

/** Mandatory injected source. Live App/launcher code does not import this module. */
export type LegacyCopyOptions = {
  storage: Storage;
  name?: string;
  factory?: IDBFactory;
  afterCapture?: (pass: "first" | "second" | "staged") => void;
  beforeWrite?: (family: "record" | "manifest", transaction: IDBTransaction) => void;
  afterWrite?: (family: "record" | "manifest", transaction: IDBTransaction) => void;
};

function object(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function relevant(key: string): boolean {
  return key.startsWith(V7) || key.startsWith(V6) || key.startsWith(ACCOUNT) || key.startsWith(ATTEMPT) || OBSOLETE.some(prefix => key.startsWith(prefix));
}
function source(storage: Storage): SourceEntry[] {
  const entries: SourceEntry[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key === null || !relevant(key)) continue;
    const raw = storage.getItem(key);
    if (raw === null) throw new LegacyCopyError("source_changed", "Legacy source changed while it was enumerated.");
    entries.push({ key, raw });
  }
  entries.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  if (entries.some((entry, index) => index > 0 && entries[index - 1]!.key === entry.key)) {
    throw new LegacyCopyError("source_changed", "Legacy source enumeration duplicated a key.");
  }
  return entries;
}
function same(a: SourceEntry[], b: SourceEntry[]): boolean {
  return a.length === b.length && a.every((entry, index) => entry.key === b[index]?.key && entry.raw === b[index]?.raw);
}
async function digest(value: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new LegacyCopyError("unavailable", "A browser digest implementation is unavailable.");
  // Explicit UTF-16LE code units preserve even lone surrogates from localStorage.
  const bytes = new Uint8Array(value.length * 2);
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    bytes[index * 2] = unit & 255;
    bytes[index * 2 + 1] = unit >>> 8;
  }
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}
function requestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function completion(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error ?? new Error("aborted")); tx.onerror = () => reject(tx.error); });
}
function failure(error: unknown, fallback: LegacyCopyFailureCode = "aborted"): LegacyCopyError {
  if (error instanceof LegacyCopyError) return error;
  if (error instanceof CampaignStoreError) {
    const code: LegacyCopyFailureCode = error.code === "blocked_upgrade" || error.code === "unavailable" || error.code === "quota" ? error.code : fallback;
    return new LegacyCopyError(code, error.message, error);
  }
  const name = object(error) && typeof error.name === "string" ? error.name : "";
  const code = name === "QuotaExceededError" ? "quota" : name === "VersionError" ? "conflict" : fallback;
  return new LegacyCopyError(code, `Legacy copy ${code}.`, error);
}
function parsed(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return null; }
}
function snapshot(envelope: StoredSaveEnvelope): SaveSnapshot | null {
  try {
    const value = deserializeSnapshot(envelope.snapshot);
    return isTargetCampaignSnapshot(value) && value.accountId === envelope.accountId && envelope.metadata.slotId === envelope.slotId &&
      value.campaignIdentity?.campaignId === envelope.campaignId &&
      value.campaignIdentity?.continuityId === envelope.continuityId &&
      value.playerState.playerId === envelope.characterId ? value : null;
  } catch { return null; }
}

function analyze(entries: SourceEntry[], v1Accounts: Set<string>): { classified: { key: string; family: Family; accountId: string | null }[]; accountIds: string[]; findings: LegacyCopyFinding[] } {
  const findings: LegacyCopyFinding[] = [];
  const add = (code: string, key: string) => findings.push({ code, key });
  const classified: { key: string; family: Family; accountId: string | null }[] = [];
  const artifacts = new Map<string, { key: string; raw: string; envelope: StoredSaveEnvelope; snapshot: SaveSnapshot }>();
  const slots: { key: string; raw: string; envelope: StoredSaveEnvelope }[] = [];
  const controls: { key: string; accountId: string; campaignId: string; headArtifactId: string; headRevision: number; headPublicationId: string }[] = [];
  const recoveries: { key: string; accountId: string; slotId: string; status: string; consumerPlans: unknown[]; completedConsumerKinds: unknown[]; artifactId: string }[] = [];
  const witnesses: { key: string; value: SoundingsAdmissionWitness }[] = [];
  const attempts: { key: string; accountId: string; slotId: string }[] = [];
  const accounts = new Set<string>();
  const profiles = new Map<string, AccountProfileState>();
  const artifactId = (accountId: string, id: string) => `${accountId}\u0000${id}`;
  for (const { key, raw } of entries) {
    const value = parsed(raw);
    let family: Family = "unknown";
    let accountId: string | null = null;
    if (key === `${ACCOUNT}active-account`) {
      family = "active_account";
      if (!raw.trim() || raw !== raw.trim()) add("invalid_active_account", key);
    } else if (key.startsWith(`${ACCOUNT}account.`)) {
      if (isAccountProfileState(value) && key === `${ACCOUNT}account.${value.accountId}`) {
        family = "profile"; accountId = value.accountId; profiles.set(accountId, value);
        if (value.campaignPublicationReceipts?.length) add("account_receipts_require_reconciliation", key);
      } else add("invalid_profile", key);
    } else if (key.startsWith(V7)) {
      if (isStoredSaveEnvelope(value) && snapshot(value)) {
        accountId = value.accountId;
        const suffix = `${V7}${accountId}.`;
        if (key === `${suffix}artifact.${value.artifactId}`) {
          family = "artifact";
          artifacts.set(artifactId(accountId, value.artifactId), { key, raw, envelope: value, snapshot: snapshot(value)! });
        } else if (key === `${suffix}slot.${value.slotId}`) {
          family = "slot"; slots.push({ key, raw, envelope: value });
        } else if (key === `${suffix}candidate.${value.generationId}`) { family = "candidate"; add("candidate_requires_reconciliation", key); }
      } else if (isStoredCampaignControl(value) && key === `${V7}${value.accountId}.campaign.${value.campaignId}.control`) {
        family = "control"; accountId = value.accountId;
        controls.push({ key, accountId, campaignId: value.campaignId, headArtifactId: value.headArtifactId, headRevision: value.headRevision, headPublicationId: value.headPublicationId });
      } else if (isStoredPublicationRecovery(value) && key === `${V7}${value.accountId}.campaign.${value.campaignId}.publication-recovery`) {
        family = "recovery"; accountId = value.accountId;
        recoveries.push({ key, accountId, slotId: value.slotId, status: value.status, consumerPlans: value.consumerPlans, completedConsumerKinds: value.completedConsumerKinds, artifactId: value.artifactId });
        const recovered = parsed(value.envelopeRaw);
        if (!isStoredSaveEnvelope(recovered) || !snapshot(recovered) || recovered.accountId !== accountId || recovered.campaignId !== value.campaignId ||
          recovered.slotId !== value.slotId || recovered.artifactId !== value.artifactId || recovered.publicationId !== value.publicationId ||
          recovered.generationId !== value.generationId || recovered.headRevision !== value.headRevision) add("recovery_envelope_invalid", key);
      } else if (isSoundingsAdmissionWitness(value) && key === `${V7}${value.accountId}.campaign.${value.campaignId}.soundings-witness.${value.requestId}`) {
        family = "witness"; accountId = value.accountId; witnesses.push({ key, value });
      } else if (object(value) && value.version === 1 && typeof value.accountId === "string" && typeof value.legacyCharacterId === "string" && key === `${V7}${value.accountId}.migration.${value.legacyCharacterId}`) {
        family = "migration"; accountId = value.accountId; add("migration_receipt_requires_owner", key);
      } else if (key.includes(".migration-source.")) {
        family = "migration_source"; add("migration_source_requires_owner", key);
      } else add("unknown_or_invalid_v7", key);
    } else if (key.startsWith(V6)) {
      if (isLegacyStoredSaveEnvelope(value) && key === `${V6}${value.accountId}.slot.${value.slotId}`) {
        family = "v6_slot"; accountId = value.accountId; add("v6_group_requires_owner", key);
      } else add("unknown_or_invalid_v6", key);
    } else if (key.startsWith(ATTEMPT)) {
      if (object(value) && value.version === 1 && typeof value.accountId === "string" && typeof value.slotId === "string" &&
        typeof value.attemptId === "string" && typeof value.inputFingerprint === "string" && typeof value.snapshotRaw === "string" &&
        Array.isArray(value.consumerPlans) && key === `${ATTEMPT}${value.accountId}.slot.${value.slotId}`) {
        family = "attempt"; accountId = value.accountId; attempts.push({ key, accountId, slotId: value.slotId });
        add("pending_attempt", key);
        try {
          const prepared = deserializeSnapshot(value.snapshotRaw);
          if (!isTargetCampaignSnapshot(prepared) || prepared.accountId !== accountId) add("attempt_snapshot_invalid", key);
        } catch { add("attempt_snapshot_invalid", key); }
      } else add("unknown_or_invalid_attempt", key);
    } else {
      family = "obsolete"; add("unscoped_legacy_requires_owner", key);
    }
    if (family === "unknown" && !findings.some(finding => finding.key === key)) add("unknown_key", key);
    if (accountId) accounts.add(accountId);
    classified.push({ key, family, accountId });
  }
  const controlsByCampaign = new Map(controls.map(control => [`${control.accountId}\u0000${control.campaignId}`, control]));
  const activeAccount = entries.find(entry => entry.key === `${ACCOUNT}active-account`);
  if (activeAccount && !profiles.has(activeAccount.raw)) add("active_account_profile_missing", activeAccount.key);
  for (const control of controls) {
    const artifact = artifacts.get(artifactId(control.accountId, control.headArtifactId));
    if (!artifact || artifact.envelope.campaignId !== control.campaignId || artifact.envelope.publicationId !== control.headPublicationId || artifact.envelope.headRevision !== control.headRevision) add("head_artifact_missing_or_conflicting", control.key);
    else if (!profiles.get(control.accountId)?.history?.runRecords.some(record => record.characterId === artifact.envelope.characterId)) add("account_history_head_missing", control.key);
  }
  for (const slot of slots) {
    const envelope = slot.envelope;
    const artifact = artifacts.get(artifactId(envelope.accountId, envelope.artifactId));
    if (!artifact || artifact.raw !== slot.raw) add("slot_artifact_missing_or_conflicting", slot.key);
    if (!controlsByCampaign.has(`${envelope.accountId}\u0000${envelope.campaignId}`)) add("slot_control_missing", slot.key);
  }
  const pendingBySlot = new Map<string, number>();
  for (const recovery of recoveries) {
    if (recovery.status !== "artifact_verified") {
      const id = `${recovery.accountId}\u0000${recovery.slotId}`;
      pendingBySlot.set(id, (pendingBySlot.get(id) ?? 0) + 1);
      add("pending_recovery", recovery.key);
    }
    if (recovery.consumerPlans.length !== recovery.completedConsumerKinds.length) add("incomplete_consumers", recovery.key);
    if (!artifacts.has(artifactId(recovery.accountId, recovery.artifactId)) && recovery.status !== "artifact_verified") add("recovery_artifact_missing", recovery.key);
  }
  for (const [id, count] of pendingBySlot) if (count > 1) add("competing_slot_recoveries", `account-slot:${id}`);
  for (const attempt of attempts) if ((pendingBySlot.get(`${attempt.accountId}\u0000${attempt.slotId}`) ?? 0) > 1) add("attempt_recovery_collision", attempt.key);
  for (const witness of witnesses) {
    const value = witness.value;
    if (value.posture !== "applied") { add("pending_witness", witness.key); continue; }
    const first = artifacts.get(artifactId(value.accountId, value.firstDurableArtifactId));
    if (!first || first.envelope.campaignId !== value.campaignId || first.envelope.characterId !== value.characterId ||
      first.envelope.publicationId !== value.firstDurablePublicationId || first.envelope.headRevision !== value.firstDurableHeadRevision ||
      verifySoundingsAdmissionProvenance(first.snapshot, { soundingsAdmissionWitness: value, retainedMutationResults: [] }) !== "verified") {
      add("soundings_first_artifact_invalid", witness.key);
      continue;
    }
    for (const artifact of artifacts.values()) {
      if (artifact.envelope.accountId === value.accountId && artifact.envelope.campaignId === value.campaignId &&
        artifact.snapshot.authorityLedger?.soundingsTurnIn?.version === 2 &&
        verifySoundingsAdmissionProvenance(artifact.snapshot, { soundingsAdmissionWitness: value, retainedMutationResults: [] }) !== "verified") add("soundings_descendant_invalid", artifact.key);
    }
  }
  const witnessCounts = new Map<string, number>();
  for (const witness of witnesses) {
    const id = `${witness.value.accountId}\u0000${witness.value.campaignId}`;
    witnessCounts.set(id, (witnessCounts.get(id) ?? 0) + 1);
  }
  for (const [id, count] of witnessCounts) if (count > 1) add("multiple_soundings_witnesses", `account-campaign:${id}`);
  for (const artifact of artifacts.values()) {
    if (artifact.snapshot.authorityLedger?.soundingsTurnIn?.version !== 2) continue;
    const requestId = artifact.snapshot.authorityLedger.soundingsTurnIn.requests[0]?.requestId;
    if (!witnesses.some(entry => entry.value.accountId === artifact.envelope.accountId && entry.value.campaignId === artifact.envelope.campaignId && entry.value.requestId === requestId && entry.value.posture === "applied")) add("soundings_witness_missing", artifact.key);
  }
  for (const accountId of accounts) if (v1Accounts.has(accountId)) add("existing_v1_authority_requires_reconciliation", `account:${accountId}`);
  for (const accountId of new Set([...artifacts.values()].map(entry => entry.envelope.accountId))) {
    if (!profiles.has(accountId)) add("account_profile_missing", `account:${accountId}`);
  }
  return { classified, accountIds: [...accounts].sort(), findings };
}

async function readback(db: IDBDatabase, manifest: LegacyCopyManifest, entries: SourceEntry[], records: LegacyCopyRecord[]): Promise<LegacyCopyRecord[]> {
  const tx = db.transaction([LEGACY_COPY_RECORD_STORE, LEGACY_COPY_MANIFEST_STORE], "readonly");
  const [storedManifest, storedRecords] = await Promise.all([
    requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(manifest.copyId) as IDBRequest<LegacyCopyManifest | undefined>),
    requestValue(tx.objectStore(LEGACY_COPY_RECORD_STORE).index("byCopy").getAll(manifest.copyId) as IDBRequest<LegacyCopyRecord[]>)
  ]);
  if (!storedManifest || storedManifest.version !== 1 || storedManifest.copyId !== manifest.copyId || storedManifest.sourceDigest !== manifest.sourceDigest ||
    storedManifest.sourceCount !== entries.length || storedRecords.length !== entries.length ||
    JSON.stringify(storedManifest.findings) !== JSON.stringify(manifest.findings) ||
    JSON.stringify(storedManifest.accountIds) !== JSON.stringify(manifest.accountIds)) throw new LegacyCopyError("readback_failed", "Legacy copy manifest failed exact readback.");
  const byKey = new Map(storedRecords.map(record => [record.key, record]));
  if (byKey.size !== entries.length) throw new LegacyCopyError("readback_failed", "Legacy copy contains duplicate or missing keys.");
  for (const [index, entry] of entries.entries()) {
    const stored = byKey.get(entry.key);
    const expected = records[index]!;
    if (!stored || stored.version !== 1 || stored.copyId !== manifest.copyId || stored.raw !== entry.raw || stored.digest !== expected.digest || stored.family !== expected.family || stored.accountId !== expected.accountId) {
      throw new LegacyCopyError("readback_failed", "Legacy copy record failed exact readback.");
    }
  }
  return storedRecords.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
}

/** Stores only an inert source snapshot; no live reader or activation marker is created. */
export async function stageLegacyCampaignCopy(options: LegacyCopyOptions): Promise<LegacyCopyResult> {
  const first = source(options.storage);
  options.afterCapture?.("first");
  const second = source(options.storage);
  options.afterCapture?.("second");
  if (!same(first, second)) throw new LegacyCopyError("source_changed", "Legacy source changed before staging.");
  const sourceDigest = await digest(JSON.stringify(first));
  const copyId = sourceDigest;
  const name = options.name ?? CAMPAIGN_DATABASE_NAME;
  const recordDigests = await Promise.all(first.map(entry => digest(JSON.stringify(entry))));
  const openOptions = { name, ...(options.factory ? { factory: options.factory } : {}) };
  let db: IDBDatabase | null = null;
  try {
    db = await openCampaignIndexedDbDatabase(openOptions);
    const existingTx = db.transaction(LEGACY_COPY_MANIFEST_STORE, "readonly");
    const existing = await requestValue(existingTx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(copyId) as IDBRequest<LegacyCopyManifest | undefined>);
    const v1Tx = db.transaction(["artifacts", "controls", "slots", "witnesses"], "readonly");
    const v1Rows = (await Promise.all(["artifacts", "controls", "slots", "witnesses"].map(family => requestValue(v1Tx.objectStore(family).getAll() as IDBRequest<{ accountId?: string }[]>)))).flat();
    const v1Accounts = new Set(v1Rows.map(row => row.accountId).filter((id): id is string => typeof id === "string"));
    const analysis = analyze(first, v1Accounts);
    const manifest: LegacyCopyManifest = { version: 1, copyId, status: "provisional", sourceDigest, sourceCount: first.length, accountIds: analysis.accountIds, findings: analysis.findings };
    const records: LegacyCopyRecord[] = first.map((entry, index) => ({ version: 1, copyId, key: entry.key, raw: entry.raw, digest: recordDigests[index]!, family: analysis.classified[index]!.family, accountId: analysis.classified[index]!.accountId }));
    if (existing?.status === "stale") throw new LegacyCopyError("conflict", "A stale generation with these source bytes is retained for review.");
    if (existing && (JSON.stringify(existing.findings) !== JSON.stringify(manifest.findings) || JSON.stringify(existing.accountIds) !== JSON.stringify(manifest.accountIds))) {
      throw new LegacyCopyError("conflict", "Existing copy generation conflicts with current authority analysis.");
    }
    if (!existing) {
      const tx = db.transaction([LEGACY_COPY_RECORD_STORE, LEGACY_COPY_MANIFEST_STORE, "artifacts", "controls", "slots", "witnesses"], "readwrite");
      const done = completion(tx);
      try {
        const lockedV1Rows = (await Promise.all(["artifacts", "controls", "slots", "witnesses"].map(family => requestValue(tx.objectStore(family).getAll() as IDBRequest<{ accountId?: string }[]>)))).flat();
        const lockedAccounts = new Set(lockedV1Rows.map(row => row.accountId).filter((id): id is string => typeof id === "string"));
        if (JSON.stringify([...lockedAccounts].sort()) !== JSON.stringify([...v1Accounts].sort())) {
          throw new LegacyCopyError("conflict", "Version-1 authority changed during copy preparation.");
        }
        for (const record of records) {
          options.beforeWrite?.("record", tx);
          await requestValue(tx.objectStore(LEGACY_COPY_RECORD_STORE).add(record));
          options.afterWrite?.("record", tx);
        }
        options.beforeWrite?.("manifest", tx);
        await requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).add(manifest));
        options.afterWrite?.("manifest", tx);
        await done;
      } catch (error) {
        try { tx.abort(); } catch { /* transaction already settled */ }
        try { await done; } catch { /* preserve original error */ }
        throw error;
      }
    }
    db.close(); db = null;
    options.afterCapture?.("staged");
    const third = source(options.storage);
    db = await openCampaignIndexedDbDatabase(openOptions);
    await readback(db, manifest, first, records);
    if (!same(first, third)) {
      if (!existing) {
        const tx = db.transaction(LEGACY_COPY_MANIFEST_STORE, "readwrite");
        const done = completion(tx);
        await requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).put({ ...manifest, status: "stale" }));
        await done;
      }
      throw new LegacyCopyError("source_changed", "Legacy source changed during staging.");
    }
    const status: LegacyCopyManifest["status"] = manifest.findings.length ? "verified_with_blockers" : "verified";
    if (existing?.status !== status) {
      const tx = db.transaction(LEGACY_COPY_MANIFEST_STORE, "readwrite");
      const done = completion(tx);
      await requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).put({ ...manifest, status }));
      await done;
    }
    db.close(); db = null;
    db = await openCampaignIndexedDbDatabase(openOptions);
    const exactRecords = await readback(db, manifest, first, records);
    const finalTx = db.transaction(LEGACY_COPY_MANIFEST_STORE, "readonly");
    const final = await requestValue(finalTx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(copyId) as IDBRequest<LegacyCopyManifest | undefined>);
    if (!final || final.status !== status) throw new LegacyCopyError("readback_failed", "Final copy status failed readback.");
    if (!same(first, source(options.storage))) {
      const tx = db.transaction(LEGACY_COPY_MANIFEST_STORE, "readwrite");
      const done = completion(tx);
      await requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).put({ ...final, status: "stale" }));
      await done;
      throw new LegacyCopyError("source_changed", "Legacy source changed before final copy verification.");
    }
    return { status: existing ? "same_source_retry" : "committed", manifest: final, records: exactRecords };
  } catch (error) { throw failure(error); }
  finally { db?.close(); }
}
