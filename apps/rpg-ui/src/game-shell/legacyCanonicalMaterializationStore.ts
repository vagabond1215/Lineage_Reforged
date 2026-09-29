import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { AccountProfileState, SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { isAccountProfileState } from "./accountProfileManager.js";
import {
  CAMPAIGN_DATABASE_NAME,
  CANONICAL_MANIFEST_STORE,
  CANONICAL_RECORD_STORE,
  CampaignStoreError,
  LEGACY_COPY_MANIFEST_STORE,
  LEGACY_COPY_RECORD_STORE,
  openCampaignIndexedDbDatabase
} from "./campaignIndexedDbStore.js";
import { stageLegacyCampaignCopy, type LegacyCopyFinding, type LegacyCopyManifest, type LegacyCopyRecord } from "./legacyCampaignCopyStore.js";
import { isLegacyStoredSaveEnvelope, isStoredCampaignControl, isStoredPublicationRecovery, isStoredSaveEnvelope } from "./saveManager.js";

type ScopeKind = "account" | "origin_unscoped";
type CanonicalFamily = "artifact" | "slot" | "control" | "candidate" | "recovery" | "witness" | "migration_receipt" | "migration_source" | "v6_slot" | "profile" | "attempt" | "active_account" | "quarantine";
export type CanonicalRecord = {
  version: 1;
  copyId: string;
  scopeKind: ScopeKind;
  scopeId: string;
  family: CanonicalFamily;
  identity: string;
  identityFields: Record<string, string>;
  originalKey: string;
  raw: string;
  digest: string;
  parsedVersion: number | null;
  posture: "validated" | "blocked" | "quarantined";
  findings: string[];
};
export type CanonicalManifest = {
  version: 1;
  validatorVersion: 1;
  copyId: string;
  scopeKind: ScopeKind;
  scopeId: string;
  status: "provisional" | "verified" | "blocked";
  sourceDigest: string;
  sourceKeyDigests: { key: string; digest: string }[];
  recordCount: number;
  recordDigest: string;
  familyCounts: Record<string, number>;
  findings: LegacyCopyFinding[];
  existingV1Overlap: boolean;
};
export type CanonicalMaterializationResult = { status: "committed" | "same_source_retry"; copyId: string; manifests: CanonicalManifest[]; records: CanonicalRecord[] };
export type CanonicalMaterializationFailureCode = "unavailable" | "blocked_upgrade" | "quota" | "aborted" | "source_changed" | "conflict" | "invalid_copy" | "readback_failed";
export class CanonicalMaterializationError extends Error {
  constructor(public readonly code: CanonicalMaterializationFailureCode, message: string, public readonly cause?: unknown) {
    super(message); this.name = "CanonicalMaterializationError";
  }
}
export type CanonicalMaterializationOptions = {
  storage: Storage;
  name?: string;
  factory?: IDBFactory;
  beforeWrite?: (family: "record" | "manifest", transaction: IDBTransaction) => void;
  afterWrite?: (family: "record" | "manifest", transaction: IDBTransaction) => void;
  afterCommit?: () => void;
};

const V7 = "cataclysm-rpg-ui.saves.v7.account.";
const V6 = "cataclysm-rpg-ui.saves.v6.account.";
const ACCOUNT = "cataclysm-rpg-ui.accounts.v1.account.";
const ATTEMPT = "cataclysm-rpg-ui.new-campaign-attempts.v1.account.";
const LOCKED_STORES = [CANONICAL_RECORD_STORE, CANONICAL_MANIFEST_STORE, LEGACY_COPY_RECORD_STORE, LEGACY_COPY_MANIFEST_STORE, "artifacts", "controls", "slots", "witnesses"];
function object(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function parse(raw: string): unknown { try { return JSON.parse(raw); } catch { return null; } }
function requestValue<T>(request: IDBRequest<T>): Promise<T> { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
function completed(tx: IDBTransaction): Promise<void> { return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error ?? new Error("aborted")); tx.onerror = () => reject(tx.error); }); }
function fail(code: CanonicalMaterializationFailureCode, message: string): never { throw new CanonicalMaterializationError(code, message); }
function failure(error: unknown): CanonicalMaterializationError {
  if (error instanceof CanonicalMaterializationError) return error;
  if (error instanceof CampaignStoreError) return new CanonicalMaterializationError(error.code === "blocked_upgrade" || error.code === "unavailable" || error.code === "quota" ? error.code : "aborted", error.message, error);
  const code: CanonicalMaterializationFailureCode = object(error) && error.name === "QuotaExceededError" ? "quota" :
    object(error) && (error.code === "source_changed" || error.code === "conflict" || error.code === "blocked_upgrade" || error.code === "unavailable" || error.code === "quota" || error.code === "readback_failed") ? error.code : "aborted";
  return new CanonicalMaterializationError(code, `Canonical materialization ${code}.`, error);
}
async function digest(value: string): Promise<string> {
  if (!globalThis.crypto?.subtle) fail("unavailable", "Browser digest is unavailable.");
  const bytes = new Uint8Array(value.length * 2);
  for (let index = 0; index < value.length; index += 1) { const unit = value.charCodeAt(index); bytes[index * 2] = unit & 255; bytes[index * 2 + 1] = unit >>> 8; }
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}
function snapshot(raw: string): SaveSnapshot | null {
  try { const value = deserializeSnapshot(raw); return isTargetCampaignSnapshot(value) ? value : null; } catch { return null; }
}
function identity(record: LegacyCopyRecord): { family: CanonicalFamily; scopeId: string; fields: Record<string, string>; id: string; extra: string[] } {
  const value = parse(record.raw);
  const accountId = record.accountId;
  const quarantined = (reason: string) => ({ family: "quarantine" as const, scopeId: accountId ?? "", fields: { originalKey: record.key }, id: record.key, extra: [reason] });
  if (record.family === "profile" && accountId && isAccountProfileState(value) && value.accountId === accountId && record.key === `${ACCOUNT}${accountId}`) return { family: "profile", scopeId: accountId, fields: { accountId }, id: accountId, extra: [] };
  if (record.family === "active_account") return { family: "active_account", scopeId: "", fields: { pointer: "active-account" }, id: "active-account", extra: [] };
  if (record.family === "migration_source" && isLegacyStoredSaveEnvelope(value)) {
    const prefix = `${V7}${value.accountId}.migration-source.`;
    const suffix = `.${value.slotId}`;
    if (record.key.startsWith(prefix) && record.key.endsWith(suffix)) {
      const legacyCharacterId = record.key.slice(prefix.length, -suffix.length);
      if (legacyCharacterId) return { family: "migration_source", scopeId: value.accountId, fields: { accountId: value.accountId, legacyCharacterId, slotId: value.slotId }, id: JSON.stringify([legacyCharacterId, value.slotId]), extra: ["migration_source_requires_owner"] };
    }
    return quarantined("migration_source_identity_invalid");
  }
  if (record.family === "v6_slot" && accountId && isLegacyStoredSaveEnvelope(value) && value.accountId === accountId && record.key === `${V6}${accountId}.slot.${value.slotId}`) return { family: "v6_slot", scopeId: accountId, fields: { accountId, slotId: value.slotId }, id: value.slotId, extra: ["v6_group_requires_owner"] };
  if (!accountId) return quarantined("unscoped_or_unknown_identity");
  if ((record.family === "artifact" || record.family === "slot" || record.family === "candidate") && isStoredSaveEnvelope(value) && value.accountId === accountId) {
    const family = record.family;
    const id = family === "artifact" ? value.artifactId : family === "slot" ? value.slotId : value.generationId;
    if (record.key !== `${V7}${accountId}.${family}.${id}`) return quarantined("key_identity_mismatch");
    const state = snapshot(value.snapshot);
    if (!state || state.accountId !== accountId || state.campaignIdentity?.campaignId !== value.campaignId || state.playerState.playerId !== value.characterId) return quarantined("snapshot_identity_invalid");
    return { family, scopeId: accountId, fields: { accountId, campaignId: value.campaignId, artifactId: value.artifactId, publicationId: value.publicationId, slotId: value.slotId, generationId: value.generationId }, id, extra: family === "candidate" ? ["candidate_requires_reconciliation"] : [] };
  }
  if (record.family === "control" && isStoredCampaignControl(value) && value.accountId === accountId && record.key === `${V7}${accountId}.campaign.${value.campaignId}.control`) return { family: "control", scopeId: accountId, fields: { accountId, campaignId: value.campaignId, headArtifactId: value.headArtifactId }, id: value.campaignId, extra: [] };
  if (record.family === "recovery" && isStoredPublicationRecovery(value) && value.accountId === accountId && record.key === `${V7}${accountId}.campaign.${value.campaignId}.publication-recovery`) return { family: "recovery", scopeId: accountId, fields: { accountId, campaignId: value.campaignId, artifactId: value.artifactId, slotId: value.slotId }, id: value.campaignId, extra: ["recovery_requires_owner"] };
  if (record.family === "witness" && object(value) && typeof value.campaignId === "string" && typeof value.requestId === "string" && value.accountId === accountId && record.key === `${V7}${accountId}.campaign.${value.campaignId}.soundings-witness.${value.requestId}`) return { family: "witness", scopeId: accountId, fields: { accountId, campaignId: value.campaignId, requestId: value.requestId }, id: JSON.stringify([value.campaignId, value.requestId]), extra: value.posture === "applied" ? [] : ["pending_witness"] };
  if (record.family === "migration" && object(value) && value.version === 1 && value.accountId === accountId && typeof value.legacyCharacterId === "string" && record.key === `${V7}${accountId}.migration.${value.legacyCharacterId}`) return { family: "migration_receipt", scopeId: accountId, fields: { accountId, legacyCharacterId: value.legacyCharacterId }, id: value.legacyCharacterId, extra: ["migration_receipt_requires_owner"] };
  if (record.family === "attempt" && object(value) && value.version === 1 && value.accountId === accountId && typeof value.slotId === "string" && record.key === `${ATTEMPT}${accountId}.slot.${value.slotId}`) return { family: "attempt", scopeId: accountId, fields: { accountId, slotId: value.slotId }, id: value.slotId, extra: ["pending_attempt"] };
  return quarantined("unvalidated_identity");
}
function sorted<T extends { originalKey: string }>(rows: T[]): T[] { return rows.sort((a, b) => a.originalKey < b.originalKey ? -1 : a.originalKey > b.originalKey ? 1 : 0); }
function same(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }

/** Inert version-3 materialization; the application has no import of this owner. */
export async function materializeLegacyCanonical(options: CanonicalMaterializationOptions): Promise<CanonicalMaterializationResult> {
  let db: IDBDatabase | null = null;
  try {
    const staged = await stageLegacyCampaignCopy({ storage: options.storage, ...(options.name ? { name: options.name } : {}), ...(options.factory ? { factory: options.factory } : {}) });
    const source = staged.manifest;
    if (source.status !== "verified" && source.status !== "verified_with_blockers") fail("invalid_copy", "Only byte-verified source generations may be materialized.");
    const keys = new Set<string>();
    for (const entry of staged.records) {
      if (entry.copyId !== source.copyId || keys.has(entry.key) || entry.digest !== await digest(JSON.stringify({ key: entry.key, raw: entry.raw }))) fail("invalid_copy", "Staged record digest or identity differs.");
      keys.add(entry.key);
    }
    if (keys.size !== source.sourceCount || source.sourceDigest !== await digest(JSON.stringify(staged.records.map(entry => ({ key: entry.key, raw: entry.raw }))))) fail("invalid_copy", "Staged source manifest differs.");
    const openOptions = { name: options.name ?? CAMPAIGN_DATABASE_NAME, ...(options.factory ? { factory: options.factory } : {}) };
    db = await openCampaignIndexedDbDatabase(openOptions);
    const readTx = db.transaction(LOCKED_STORES, "readonly");
    const [storedSource, storedRecords, ...v1Rows] = await Promise.all([
      requestValue(readTx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(source.copyId) as IDBRequest<LegacyCopyManifest | undefined>),
      requestValue(readTx.objectStore(LEGACY_COPY_RECORD_STORE).index("byCopy").getAll(source.copyId) as IDBRequest<LegacyCopyRecord[]>),
      ...["artifacts", "controls", "slots", "witnesses"].map(family => requestValue(readTx.objectStore(family).getAll() as IDBRequest<unknown[]>))
    ]);
    if (!storedSource || !same(storedSource, source) || !same(storedRecords.sort((a, b) => a.key.localeCompare(b.key)), [...staged.records].sort((a, b) => a.key.localeCompare(b.key)))) fail("invalid_copy", "Version-2 source changed after readback.");
    const v1Snapshot = JSON.stringify(v1Rows);
    const v1Accounts = new Set(v1Rows.flat().filter(object).map(row => row.accountId).filter((id): id is string => typeof id === "string"));
    const records: CanonicalRecord[] = staged.records.map(entry => {
      const mapped = identity(entry);
      const family = mapped.family;
      const findings = [...new Set([...source.findings.filter(finding => finding.key === entry.key).map(finding => finding.code), ...mapped.extra])].sort();
      const parsed = parse(entry.raw);
      return { version: 1, copyId: source.copyId, scopeKind: mapped.scopeId ? "account" : "origin_unscoped", scopeId: mapped.scopeId, family, identity: mapped.id, identityFields: mapped.fields, originalKey: entry.key, raw: entry.raw, digest: entry.digest, parsedVersion: object(parsed) && typeof parsed.version === "number" ? parsed.version : null, posture: family === "quarantine" ? "quarantined" : findings.length ? "blocked" : "validated", findings };
    });
    const byKey = new Map(records.map(record => [record.originalKey, record]));
    const globalFindings = source.findings.filter(finding => !byKey.has(finding.key) || byKey.get(finding.key)?.scopeKind === "origin_unscoped");
    const scopes = new Map<string, CanonicalRecord[]>();
    for (const record of records) { const id = JSON.stringify([record.scopeKind, record.scopeId]); const scope = scopes.get(id) ?? []; scope.push(record); scopes.set(id, scope); }
    for (const accountId of source.accountIds) if (!scopes.has(JSON.stringify(["account", accountId]))) scopes.set(JSON.stringify(["account", accountId]), []);
    if (!scopes.has(JSON.stringify(["origin_unscoped", ""]))) scopes.set(JSON.stringify(["origin_unscoped", ""]), []);
    const sourceKeyDigests = staged.records.map(entry => ({ key: entry.key, digest: entry.digest }));
    const manifests: CanonicalManifest[] = [];
    for (const [scopeKey, scopeRecords] of scopes) {
      const [scopeKind, scopeId] = JSON.parse(scopeKey) as [ScopeKind, string];
      sorted(scopeRecords);
      const findings = [...globalFindings, ...source.findings.filter(finding => byKey.get(finding.key)?.scopeKind === scopeKind && byKey.get(finding.key)?.scopeId === scopeId),
        ...scopeRecords.flatMap(record => record.findings.map(code => ({ code, key: record.originalKey })))];
      const familyCounts: Record<string, number> = {};
      for (const record of scopeRecords) familyCounts[record.family] = (familyCounts[record.family] ?? 0) + 1;
      const existingV1Overlap = scopeKind === "account" && v1Accounts.has(scopeId);
      if (existingV1Overlap) findings.push({ code: "existing_v1_authority_requires_reconciliation", key: `account:${scopeId}` });
      const artifacts = scopeRecords.filter(record => record.family === "artifact");
      const artifactIds = new Set(artifacts.map(record => record.identity));
      const publicationIds = new Set(artifacts.map(record => record.identityFields.publicationId));
      const profile = scopeRecords.find(record => record.family === "profile");
      const profileValue = profile ? parse(profile.raw) as AccountProfileState : null;
      for (const artifact of artifacts) {
        const value = parse(artifact.raw);
        if (isStoredSaveEnvelope(value) && !profileValue?.history?.runRecords.some(run => run.characterId === value.characterId)) findings.push({ code: "account_history_artifact_missing", key: artifact.originalKey });
      }
      for (const control of scopeRecords.filter(record => record.family === "control")) {
        const value = parse(control.raw);
        if (isStoredCampaignControl(value) && value.previousHeadArtifactId && !artifactIds.has(value.previousHeadArtifactId)) findings.push({ code: "previous_head_artifact_missing", key: control.originalKey });
      }
      for (const receipt of profileValue?.campaignPublicationReceipts ?? []) if (!publicationIds.has(receipt.publicationId)) findings.push({ code: "account_receipt_publication_missing", key: profile!.originalKey });
      if (scopeKind === "account" && scopeRecords.some(record => record.family !== "quarantine" && record.family !== "profile") && !profile) findings.push({ code: "account_profile_missing", key: `account:${scopeId}` });
      const manifest: CanonicalManifest = { version: 1, validatorVersion: 1, copyId: source.copyId, scopeKind, scopeId, status: "provisional", sourceDigest: source.sourceDigest, sourceKeyDigests, recordCount: scopeRecords.length, recordDigest: await digest(JSON.stringify(scopeRecords)), familyCounts, findings: [...new Map(findings.map(finding => [JSON.stringify(finding), finding])).values()].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))), existingV1Overlap };
      manifests.push(manifest);
    }
    for (const manifest of manifests) {
      const scopeRecords = records.filter(record => record.scopeKind === manifest.scopeKind && record.scopeId === manifest.scopeId);
      const tx = db.transaction(LOCKED_STORES, "readwrite"); const done = completed(tx);
      try {
        const [lockedSource, ...lockedV1] = await Promise.all([
          requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(source.copyId) as IDBRequest<LegacyCopyManifest | undefined>),
          ...["artifacts", "controls", "slots", "witnesses"].map(family => requestValue(tx.objectStore(family).getAll() as IDBRequest<unknown[]>))
        ]);
        if (!same(lockedSource, source) || JSON.stringify(lockedV1) !== v1Snapshot) fail("conflict", "Source or version-1 authority changed during materialization.");
        const existing = await requestValue(tx.objectStore(CANONICAL_MANIFEST_STORE).get([manifest.copyId, manifest.scopeKind, manifest.scopeId]) as IDBRequest<CanonicalManifest | undefined>);
        if (existing) {
          if (!same({ ...existing, status: "provisional" }, manifest)) fail("conflict", "Existing canonical generation differs.");
          const stored = await requestValue(tx.objectStore(CANONICAL_RECORD_STORE).index("byGenerationScope").getAll([manifest.copyId, manifest.scopeKind, manifest.scopeId]) as IDBRequest<CanonicalRecord[]>);
          if (!same(sorted(stored), sorted([...scopeRecords]))) fail("conflict", "Existing canonical records differ.");
        } else {
          for (const record of scopeRecords) { options.beforeWrite?.("record", tx); await requestValue(tx.objectStore(CANONICAL_RECORD_STORE).add(record)); options.afterWrite?.("record", tx); }
          options.beforeWrite?.("manifest", tx); await requestValue(tx.objectStore(CANONICAL_MANIFEST_STORE).add(manifest)); options.afterWrite?.("manifest", tx);
        }
        await done;
      } catch (error) { try { tx.abort(); } catch { /* already settled */ } try { await done; } catch { /* retain original failure */ } throw error; }
    }
    db.close(); db = null;
    options.afterCommit?.();
    db = await openCampaignIndexedDbDatabase(openOptions);
    await exactReadback(db, source, manifests, records);
    db.close(); db = null;
    const finalSource = await stageLegacyCampaignCopy({ storage: options.storage, ...(options.name ? { name: options.name } : {}), ...(options.factory ? { factory: options.factory } : {}) });
    if (finalSource.manifest.copyId !== source.copyId || !same(finalSource.manifest, source)) fail("source_changed", "Legacy source changed after canonical materialization.");
    db = await openCampaignIndexedDbDatabase(openOptions);
    for (const manifest of manifests) {
      const status: CanonicalManifest["status"] = manifest.findings.length ? "blocked" : "verified";
      const tx = db.transaction([CANONICAL_MANIFEST_STORE, LEGACY_COPY_MANIFEST_STORE], "readwrite"); const done = completed(tx);
      try {
        const locked = await requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(source.copyId) as IDBRequest<LegacyCopyManifest | undefined>);
        if (!same(locked, source)) fail("conflict", "Source manifest changed before final readback status.");
        await requestValue(tx.objectStore(CANONICAL_MANIFEST_STORE).put({ ...manifest, status })); await done;
      } catch (error) { try { tx.abort(); } catch { /* settled */ } try { await done; } catch { /* retain original failure */ } throw error; }
      manifest.status = status;
    }
    db.close(); db = null;
    db = await openCampaignIndexedDbDatabase(openOptions);
    await exactReadback(db, source, manifests, records);
    return { status: staged.status, copyId: source.copyId, manifests, records };
  } catch (error) { throw failure(error); }
  finally { db?.close(); }
}

async function exactReadback(db: IDBDatabase, source: LegacyCopyManifest, manifests: CanonicalManifest[], records: CanonicalRecord[]): Promise<void> {
  const tx = db.transaction([LEGACY_COPY_MANIFEST_STORE, LEGACY_COPY_RECORD_STORE, CANONICAL_MANIFEST_STORE, CANONICAL_RECORD_STORE], "readonly");
  const [storedSource, storedCopyRecords, storedManifests, storedRecords] = await Promise.all([
    requestValue(tx.objectStore(LEGACY_COPY_MANIFEST_STORE).get(source.copyId) as IDBRequest<LegacyCopyManifest | undefined>),
    requestValue(tx.objectStore(LEGACY_COPY_RECORD_STORE).index("byCopy").getAll(source.copyId) as IDBRequest<LegacyCopyRecord[]>),
    requestValue(tx.objectStore(CANONICAL_MANIFEST_STORE).getAll() as IDBRequest<CanonicalManifest[]>),
    requestValue(tx.objectStore(CANONICAL_RECORD_STORE).getAll() as IDBRequest<CanonicalRecord[]>)
  ]);
  if (!same(storedSource, source) || storedCopyRecords.length !== source.sourceCount || storedRecords.filter(record => record.copyId === source.copyId).length !== records.length) fail("readback_failed", "Source or canonical record count changed.");
  for (const manifest of manifests) {
    const actual = storedManifests.find(row => row.copyId === manifest.copyId && row.scopeKind === manifest.scopeKind && row.scopeId === manifest.scopeId);
    if (!actual || !same({ ...actual, status: manifest.status }, manifest) ||
      (manifest.status === "provisional" && actual.status !== "provisional" && actual.status !== (manifest.findings.length ? "blocked" : "verified"))) {
      fail("readback_failed", "Canonical manifest differs after reopen.");
    }
    const expected = sorted(records.filter(record => record.scopeKind === manifest.scopeKind && record.scopeId === manifest.scopeId));
    const found = sorted(storedRecords.filter(record => record.copyId === manifest.copyId && record.scopeKind === manifest.scopeKind && record.scopeId === manifest.scopeId));
    if (!same(found, expected) || manifest.recordDigest !== await digest(JSON.stringify(expected))) fail("readback_failed", "Canonical raw records differ after reopen.");
  }
  const byKey = new Map(storedCopyRecords.map(record => [record.key, record]));
  if (byKey.size !== source.sourceCount) fail("readback_failed", "Staged copy lost a key.");
  for (const record of records) {
    const staged = byKey.get(record.originalKey);
    if (!staged || staged.raw !== record.raw || staged.digest !== record.digest || record.digest !== await digest(JSON.stringify({ key: record.originalKey, raw: record.raw }))) fail("readback_failed", "Canonical raw value differs from staged source.");
  }
  if (source.sourceDigest !== await digest(JSON.stringify([...byKey.values()].sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0).map(record => ({ key: record.key, raw: record.raw }))))) fail("readback_failed", "Staged source digest differs.");
}
