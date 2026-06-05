export type KnownSpellOwnerScope = "character";
export type KnownSpellAcquisitionRoute = "training_event";
export type KnownSpellAvailabilityState = "available" | "blocked";

export interface KnownSpellTrainingEventEvidence {
  trainingEventId: string;
  sourceType: "training_event";
}

export type KnownSpellTrainingEventEvidenceValidationIssueCode =
  | "invalid_training_event_evidence"
  | "missing_training_event_id"
  | "missing_training_event_source"
  | "unsupported_training_event_source"
  | "unsupported_training_event_evidence_field";

export interface KnownSpellTrainingEventEvidenceValidationIssue {
  code: KnownSpellTrainingEventEvidenceValidationIssueCode;
  field: string;
  message: string;
}

export interface KnownSpellTrainingEventEvidenceValidationResult {
  ok: boolean;
  issues: KnownSpellTrainingEventEvidenceValidationIssue[];
  evidence?: KnownSpellTrainingEventEvidence;
}

export interface KnownSpellRecordState {
  knownSpellId: string;
  ownerScope: KnownSpellOwnerScope;
  ownerId: string;
  characterId: string;
  spellId: string;
  acquisitionRoute: KnownSpellAcquisitionRoute;
  acquiredAt: string;
  availability: KnownSpellAvailabilityState;
  blockedReason?: string;
  trainingEventEvidence?: KnownSpellTrainingEventEvidence;
}

export type KnownSpellCatalogEntry = string | { id?: unknown };

export type KnownSpellValidationIssueCode =
  | "invalid_record"
  | "missing_known_spell_id"
  | "missing_owner_scope"
  | "unsupported_owner_scope"
  | "missing_owner_id"
  | "missing_character_id"
  | "owner_character_mismatch"
  | "character_context_mismatch"
  | "missing_spell_id"
  | "unknown_spell_id"
  | "missing_acquisition_route"
  | "unsupported_acquisition_route"
  | "missing_acquired_at"
  | "missing_availability"
  | "unsupported_availability";

export type KnownSpellCollectionValidationIssueCode =
  | "invalid_collection"
  | "record_validation_failed"
  | "duplicate_known_spell_id"
  | "missing_training_event_id"
  | "missing_training_event_source"
  | "unsupported_training_event_evidence";

export interface KnownSpellValidationIssue {
  code: KnownSpellValidationIssueCode;
  field: string;
  message: string;
}

export interface KnownSpellCollectionValidationIssue {
  code: KnownSpellCollectionValidationIssueCode;
  field: string;
  message: string;
  index?: number;
  knownSpellId?: string;
  duplicateIndexes?: number[];
  recordIssues?: KnownSpellValidationIssue[];
}

export interface KnownSpellValidationResult {
  ok: boolean;
  issues: KnownSpellValidationIssue[];
  record?: KnownSpellRecordState;
}

export interface KnownSpellCollectionValidationResult {
  ok: boolean;
  issues: KnownSpellCollectionValidationIssue[];
  records: KnownSpellRecordState[];
}

export interface ValidateKnownSpellRecordParams {
  record: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  characterId?: string | null;
}

export interface ValidateKnownSpellRecordCollectionParams {
  records: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  characterId?: string | null;
}

export interface CreateKnownSpellTrainingEventEvidenceParams {
  trainingEventId: unknown;
  sourceType?: unknown;
}

export interface CreateKnownSpellRecordParams {
  knownSpellId: string;
  ownerId: string;
  characterId: string;
  spellId: string;
  acquiredAt: string;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  availability?: KnownSpellAvailabilityState;
  blockedReason?: string;
  trainingEventEvidence?: KnownSpellTrainingEventEvidence;
}

export type KnownSpellTrainingEventAcquisitionIssueCode =
  | "missing_acquisition_event_id"
  | "missing_character_id"
  | "missing_owner_id"
  | "owner_character_mismatch"
  | "unknown_spell_id"
  | "unsupported_owner_scope"
  | "unsupported_acquisition_route"
  | "missing_training_event_evidence"
  | "unsupported_training_event_evidence"
  | "missing_acquired_at"
  | "duplicate_known_spell_id"
  | "invalid_known_spell_record";

export type KnownSpellTrainingEventAcquisitionValidationStatus =
  | "valid"
  | "invalid";

export interface KnownSpellTrainingEventAcquisitionIssue {
  code: KnownSpellTrainingEventAcquisitionIssueCode;
  field: string;
  message: string;
  knownSpellId?: string;
  duplicateIndexes?: number[];
  recordIssues?: KnownSpellValidationIssue[];
}

export interface KnownSpellTrainingEventAcquisitionProposal {
  eventId: string;
  ownerScope: "character";
  ownerId: string;
  characterId: string;
  spellId: string;
  trainingEventId: string;
  acquiredAt: string;
  acquisitionRoute: "training_event";
  evidenceSource: KnownSpellTrainingEventEvidence;
  validationStatus: KnownSpellTrainingEventAcquisitionValidationStatus;
  notes?: string[];
  blockedReasons?: string[];
}

export interface ValidateKnownSpellTrainingEventAcquisitionParams {
  eventId?: unknown;
  acquisitionEventId?: unknown;
  knownSpellId?: unknown;
  ownerScope?: unknown;
  ownerId?: unknown;
  characterId?: unknown;
  spellId?: unknown;
  acquisitionRoute?: unknown;
  acquiredAt?: unknown;
  availability?: unknown;
  blockedReason?: unknown;
  trainingEventId?: unknown;
  trainingEventEvidence?: unknown;
  existingRecords?: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
}

export type BuildKnownSpellRecordFromTrainingEventParams =
  ValidateKnownSpellTrainingEventAcquisitionParams;

export interface KnownSpellTrainingEventAcquisitionResult {
  ok: boolean;
  issues: KnownSpellTrainingEventAcquisitionIssue[];
  acquisition?: KnownSpellTrainingEventAcquisitionProposal;
  proposedRecord?: KnownSpellRecordState;
}

export interface CharacterKnowsSpellParams {
  records: Iterable<unknown>;
  characterId: string;
  spellId: string;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
}

export interface BuildKnownSpellReadOnlyProjectionParams {
  records: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  characterId: string;
}

export interface KnownSpellReadOnlyProjectionEntry {
  knownSpellId: string;
  spellId: string;
  characterId: string;
  availability: KnownSpellAvailabilityState;
  acquisitionRoute: KnownSpellAcquisitionRoute;
  acquiredAt: string;
  trainingEventId?: string;
  blockedReason?: string;
}

export interface KnownSpellReadOnlyProjection {
  ok: boolean;
  characterId: string;
  knownSpellCount: number;
  availableSpellCount: number;
  blockedSpellCount: number;
  invalidRecordCount: number;
  knownSpells: KnownSpellReadOnlyProjectionEntry[];
  blockedSpells: KnownSpellReadOnlyProjectionEntry[];
  issues: KnownSpellCollectionValidationIssue[];
}

export type MagicCastReadinessBlockerId =
  | "missing_known_spell"
  | "known_spell_blocked"
  | "invalid_known_spell_record"
  | "missing_training_event_evidence"
  | "missing_conduit"
  | "invalid_conduit"
  | "missing_catalyst"
  | "invalid_catalyst"
  | "insufficient_control"
  | "unsupported_spell_hooks"
  | "spell_runtime_deferred"
  | "runtime_casting_not_implemented";

export type MagicCastReadinessHookClassification =
  | "runtime"
  | "classifier"
  | "supported"
  | "deferred"
  | "unsupported"
  | "unknown";

export type MagicHookSupportProjectionSourceField =
  | "resolutionHooks"
  | "itemGenerationHooks";

export type MagicHookSupportClassificationAuthority =
  | "resolutionHooks"
  | "itemGenerationHooks"
  | "runtimeResolutionHooks"
  | "classifierResolutionHooks"
  | "supportedResolutionHooks"
  | "deferredResolutionHooks"
  | "unsupportedResolutionHooks"
  | "runtimeItemGenerationHookIds"
  | "classifierItemGenerationHookIds"
  | "supportedItemGenerationHookIds"
  | "deferredItemGenerationHookIds"
  | "unsupportedItemGenerationHookIds"
  | "unknown_fallback";

export type MagicHookSupportReadinessEffect = "supported" | "blocking";

export type MagicHookSupportBlockerReason =
  | "deferred_hook"
  | "unsupported_hook"
  | "unknown_hook";

export type MagicCastReadinessControlLevel =
  | "control.easy"
  | "control.moderate"
  | "control.hard";

export interface MagicCastReadinessBlocker {
  id: MagicCastReadinessBlockerId;
  source: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface MagicCastReadinessHookSupport {
  resolutionHooks?: Readonly<Record<string, MagicCastReadinessHookClassification>>;
  itemGenerationHooks?: Readonly<Record<string, MagicCastReadinessHookClassification>>;
  runtimeResolutionHooks?: Iterable<unknown>;
  classifierResolutionHooks?: Iterable<unknown>;
  supportedResolutionHooks?: Iterable<unknown>;
  deferredResolutionHooks?: Iterable<unknown>;
  unsupportedResolutionHooks?: Iterable<unknown>;
  runtimeItemGenerationHookIds?: Iterable<unknown>;
  classifierItemGenerationHookIds?: Iterable<unknown>;
  supportedItemGenerationHookIds?: Iterable<unknown>;
  deferredItemGenerationHookIds?: Iterable<unknown>;
  unsupportedItemGenerationHookIds?: Iterable<unknown>;
}

export interface BuildMagicHookSupportProjectionParams {
  resolutionHookIds?: Iterable<unknown>;
  itemGenerationHookIds?: Iterable<unknown>;
  hookSupport?: MagicCastReadinessHookSupport;
}

export interface MagicHookSupportProjectionEntry {
  hookId: string;
  sourceField: MagicHookSupportProjectionSourceField;
  classification: MagicCastReadinessHookClassification;
  classificationAuthority: MagicHookSupportClassificationAuthority;
  readinessEffect: MagicHookSupportReadinessEffect;
  executable: false;
  blockerReason?: MagicHookSupportBlockerReason;
}

export interface MagicHookSupportProjection {
  allHooksSupported: boolean;
  hooks: MagicHookSupportProjectionEntry[];
  blockingHooks: MagicHookSupportProjectionEntry[];
}

export interface MagicCastReadinessControlContext {
  canCast?: unknown;
  controlScore?: unknown;
  controlTags?: unknown;
}

export interface BuildMagicCastReadinessParams {
  records: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  characterId: string;
  spellId: string;
  spellRecord?: unknown;
  conduitCandidate?: unknown;
  catalystCandidate?: unknown;
  controlContext?: unknown;
  hookSupport?: MagicCastReadinessHookSupport;
  requireConduit?: boolean;
  requireCatalyst?: boolean;
  runtimeCastingImplemented?: boolean;
}

export interface MagicCastReadinessDetails {
  spellId: string;
  characterId: string;
  compatibilityStatus?: string;
  availableKnownSpellId?: string;
  blockedKnownSpellId?: string;
  freecastAllowed: boolean;
  conduitRequired: boolean;
  catalystRequired: boolean;
  requiredControlLevel: MagicCastReadinessControlLevel;
  conduitId?: string;
  catalystId?: string;
  unsupportedResolutionHooks: string[];
  unsupportedItemGenerationHookIds: string[];
}

export interface MagicCastReadinessResult {
  ready: boolean;
  blockers: MagicCastReadinessBlocker[];
  projection: KnownSpellReadOnlyProjection;
  details: MagicCastReadinessDetails;
}

export type MagicCastResolverReadinessIssueCode =
  | "invalid_magic_command"
  | "missing_caster_character_id"
  | "missing_spell_id"
  | "missing_known_spell_reference"
  | "invalid_known_spell_reference"
  | "missing_target_descriptor"
  | "invalid_target_descriptor"
  | "invalid_conduit_source_descriptor"
  | "invalid_catalyst_source_descriptor"
  | "invalid_casting_context"
  | "cast_readiness_blocked"
  | "runtime_casting_not_implemented"
  | "unsupported_spell_hooks"
  | "spell_runtime_deferred"
  | "resource_policy_missing"
  | "catalyst_policy_missing"
  | "failure_policy_missing"
  | "effect_resolution_deferred";

export interface MagicCastResolverReadinessIssue {
  code: MagicCastResolverReadinessIssueCode;
  field: string;
  message: string;
  blockerId?: MagicCastReadinessBlockerId;
  details?: Record<string, unknown>;
}

export interface MagicCastResolverRuntimePolicy {
  runtimeCastingImplemented?: unknown;
  requireResourcePolicy?: unknown;
  resourcePolicyRef?: unknown;
  requireCatalystPolicy?: unknown;
  catalystPolicyRef?: unknown;
  requireFailurePolicy?: unknown;
  failurePolicyRef?: unknown;
  testOnlyResolverLane?: unknown;
}

export interface BuildMagicCastResolverReadinessParams {
  resolverRequestId?: unknown;
  command?: unknown;
  knownSpellRecords?: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  spellRecord?: unknown;
  conduitCandidate?: unknown;
  catalystCandidate?: unknown;
  controlContext?: unknown;
  hookSupport?: MagicCastReadinessHookSupport;
  runtimePolicy?: unknown;
}

export interface MagicCastResolverReadinessResult {
  ok: boolean;
  blocked: boolean;
  resolverRequestId: string;
  commandId?: string;
  readiness?: MagicCastReadinessResult;
  issues: MagicCastResolverReadinessIssue[];
}

export type MagicResolverInertEnvelopeKind = "magic_resolver_inert_envelope";
export type MagicResolverInertEnvelopeMode = "planning_only";

export interface MagicResolverInertEnvelopeSafetyFlags {
  eventsEmitted: false;
  stateMutated: false;
  targetResolved: false;
  effectsApplied: false;
  resourcesPaid: false;
  catalystReserved: false;
  catalystConsumed: false;
  inventoryMutated: false;
  commandDispatched: false;
  uiDispatched: false;
  persisted: false;
}

export interface MagicResolverInertEnvelopeReadinessSummary {
  ready?: boolean;
  spellId?: string;
  characterId?: string;
  compatibilityStatus?: string;
  availableKnownSpellId?: string;
  blockedKnownSpellId?: string;
  blockerIds: MagicCastReadinessBlockerId[];
  unsupportedResolutionHooks: string[];
  unsupportedItemGenerationHookIds: string[];
}

export interface MagicResolverInertEnvelopeBlockerSummary {
  blocked: boolean;
  readinessBlockerIds: MagicCastReadinessBlockerId[];
  resolverIssueCodes: MagicCastResolverReadinessIssueCode[];
  providedBlockerSummary?: unknown;
}

export interface BuildMagicResolverInertEnvelopeParams {
  resolverRequestId?: unknown;
  command?: unknown;
  commandId?: unknown;
  spellId?: unknown;
  casterCharacterId?: unknown;
  knownSpellId?: unknown;
  knownSpellRef?: unknown;
  targetDescriptor?: unknown;
  conduitDescriptor?: unknown;
  catalystDescriptor?: unknown;
  readinessResult?: MagicCastReadinessResult;
  resolverReadiness?: MagicCastResolverReadinessResult;
  resolverIssues?: readonly MagicCastResolverReadinessIssue[];
  blockerSummary?: unknown;
  runtimePolicyRef?: unknown;
  plannedCostSummary?: unknown;
  plannedCatalystSummary?: unknown;
  plannedFailurePolicySummary?: unknown;
  plannedHookSummary?: unknown;
  plannedNarrativeSummary?: unknown;
  deferredEffectFamilies?: unknown;
  diagnostics?: unknown;
}

export interface MagicResolverInertEnvelope {
  envelopeKind: MagicResolverInertEnvelopeKind;
  mode: MagicResolverInertEnvelopeMode;
  resolverRequestId?: string;
  commandId?: string;
  spellId?: string;
  casterCharacterId?: string;
  knownSpellId?: string;
  targetDescriptor?: unknown;
  conduitDescriptor?: unknown;
  catalystDescriptor?: unknown;
  readinessSummary: MagicResolverInertEnvelopeReadinessSummary;
  blockerSummary: MagicResolverInertEnvelopeBlockerSummary;
  runtimePolicyRef?: string;
  plannedCostSummary?: unknown;
  plannedCatalystSummary?: unknown;
  plannedFailurePolicySummary?: unknown;
  plannedHookSummary?: unknown;
  plannedNarrativeSummary?: unknown;
  deferredEffectFamilies: string[];
  diagnostics?: unknown;
  safetyFlags: MagicResolverInertEnvelopeSafetyFlags;
}

export const KNOWN_SPELL_OWNER_SCOPES = ["character"] as const satisfies readonly KnownSpellOwnerScope[];
export const KNOWN_SPELL_ACQUISITION_ROUTES = ["training_event"] as const satisfies readonly KnownSpellAcquisitionRoute[];
export const KNOWN_SPELL_AVAILABILITY_STATES = ["available", "blocked"] as const satisfies readonly KnownSpellAvailabilityState[];
export const MAGIC_CAST_READINESS_BLOCKER_IDS = [
  "missing_known_spell",
  "known_spell_blocked",
  "invalid_known_spell_record",
  "missing_training_event_evidence",
  "missing_conduit",
  "invalid_conduit",
  "missing_catalyst",
  "invalid_catalyst",
  "insufficient_control",
  "unsupported_spell_hooks",
  "spell_runtime_deferred",
  "runtime_casting_not_implemented"
] as const satisfies readonly MagicCastReadinessBlockerId[];
export const MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES = [
  "invalid_magic_command",
  "missing_caster_character_id",
  "missing_spell_id",
  "missing_known_spell_reference",
  "invalid_known_spell_reference",
  "missing_target_descriptor",
  "invalid_target_descriptor",
  "invalid_conduit_source_descriptor",
  "invalid_catalyst_source_descriptor",
  "invalid_casting_context",
  "cast_readiness_blocked",
  "runtime_casting_not_implemented",
  "unsupported_spell_hooks",
  "spell_runtime_deferred",
  "resource_policy_missing",
  "catalyst_policy_missing",
  "failure_policy_missing",
  "effect_resolution_deferred"
] as const satisfies readonly MagicCastResolverReadinessIssueCode[];
export const MAGIC_RESOLVER_INERT_ENVELOPE_SAFETY_FLAGS: MagicResolverInertEnvelopeSafetyFlags = Object.freeze({
  eventsEmitted: false,
  stateMutated: false,
  targetResolved: false,
  effectsApplied: false,
  resourcesPaid: false,
  catalystReserved: false,
  catalystConsumed: false,
  inventoryMutated: false,
  commandDispatched: false,
  uiDispatched: false,
  persisted: false
});

const KNOWN_SPELL_OWNER_SCOPE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_OWNER_SCOPES);
const KNOWN_SPELL_ACQUISITION_ROUTE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_ACQUISITION_ROUTES);
const KNOWN_SPELL_AVAILABILITY_STATE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_AVAILABILITY_STATES);
const TRAINING_EVENT_EVIDENCE_FIELDS: ReadonlySet<string> = new Set(["trainingEventId", "sourceType"]);
const MAGIC_CAST_READINESS_TRAINING_EVIDENCE_ISSUE_CODES: ReadonlySet<KnownSpellCollectionValidationIssueCode> =
  new Set(["missing_training_event_id", "missing_training_event_source", "unsupported_training_event_evidence"]);
const MAGIC_CAST_CONTROL_LEVEL_WEIGHTS: ReadonlyMap<MagicCastReadinessControlLevel, number> = new Map([
  ["control.easy", 1],
  ["control.moderate", 2],
  ["control.hard", 3]
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function createIssue(
  code: KnownSpellValidationIssueCode,
  field: string,
  message: string
): KnownSpellValidationIssue {
  return { code, field, message };
}

function createCollectionIssue(
  code: KnownSpellCollectionValidationIssueCode,
  field: string,
  message: string,
  details: Omit<KnownSpellCollectionValidationIssue, "code" | "field" | "message"> = {}
): KnownSpellCollectionValidationIssue {
  return { code, field, message, ...details };
}

function createTrainingEventEvidenceIssue(
  code: KnownSpellTrainingEventEvidenceValidationIssueCode,
  field: string,
  message: string
): KnownSpellTrainingEventEvidenceValidationIssue {
  return { code, field, message };
}

function createTrainingEventAcquisitionIssue(
  code: KnownSpellTrainingEventAcquisitionIssueCode,
  field: string,
  message: string,
  details: Omit<KnownSpellTrainingEventAcquisitionIssue, "code" | "field" | "message"> = {}
): KnownSpellTrainingEventAcquisitionIssue {
  return { code, field, message, ...details };
}

function createMagicCastResolverReadinessIssue(
  code: MagicCastResolverReadinessIssueCode,
  field: string,
  message: string,
  details: Omit<MagicCastResolverReadinessIssue, "code" | "field" | "message"> = {}
): MagicCastResolverReadinessIssue {
  return { code, field, message, ...details };
}

export function collectKnownSpellCatalogIds(
  spellCatalog: Iterable<KnownSpellCatalogEntry>
): Set<string> {
  const ids = new Set<string>();
  for (const entry of spellCatalog) {
    const id = normalizeString(typeof entry === "string" ? entry : entry.id);
    if (id) {
      ids.add(id);
    }
  }
  return ids;
}

export function validateKnownSpellTrainingEventEvidence(
  evidence: unknown
): KnownSpellTrainingEventEvidenceValidationResult {
  if (evidence === undefined || evidence === null) {
    return {
      ok: false,
      issues: [
        createTrainingEventEvidenceIssue(
          "missing_training_event_id",
          "trainingEventId",
          "training_event evidence requires a trainingEventId."
        ),
        createTrainingEventEvidenceIssue(
          "missing_training_event_source",
          "sourceType",
          "training_event evidence requires sourceType 'training_event'."
        )
      ]
    };
  }

  if (!isRecord(evidence)) {
    return {
      ok: false,
      issues: [
        createTrainingEventEvidenceIssue(
          "invalid_training_event_evidence",
          "trainingEventEvidence",
          "training_event evidence must be a minimal object."
        )
      ]
    };
  }

  const issues: KnownSpellTrainingEventEvidenceValidationIssue[] = [];

  for (const field of Object.keys(evidence)) {
    if (!TRAINING_EVENT_EVIDENCE_FIELDS.has(field)) {
      issues.push(
        createTrainingEventEvidenceIssue(
          "unsupported_training_event_evidence_field",
          field,
          `training_event evidence field '${field}' is not supported by this helper boundary.`
        )
      );
    }
  }

  const trainingEventId = normalizeString(evidence.trainingEventId);
  const sourceType = normalizeString(evidence.sourceType);

  if (!trainingEventId) {
    issues.push(
      createTrainingEventEvidenceIssue(
        "missing_training_event_id",
        "trainingEventId",
        "training_event evidence requires a trainingEventId."
      )
    );
  }

  if (!sourceType) {
    issues.push(
      createTrainingEventEvidenceIssue(
        "missing_training_event_source",
        "sourceType",
        "training_event evidence requires sourceType 'training_event'."
      )
    );
  } else if (sourceType !== "training_event") {
    issues.push(
      createTrainingEventEvidenceIssue(
        "unsupported_training_event_source",
        "sourceType",
        `training_event evidence sourceType '${sourceType}' is not supported by this helper boundary.`
      )
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    issues: [],
    evidence: {
      trainingEventId: trainingEventId as string,
      sourceType: "training_event"
    }
  };
}

export function normalizeKnownSpellTrainingEventEvidence(
  value: unknown
): KnownSpellTrainingEventEvidence | null {
  return validateKnownSpellTrainingEventEvidence(value).evidence ?? null;
}

export function isKnownSpellTrainingEventEvidence(
  value: unknown
): value is KnownSpellTrainingEventEvidence {
  if (!isRecord(value)) {
    return false;
  }

  const result = validateKnownSpellTrainingEventEvidence(value);
  return (
    result.ok &&
    result.evidence?.trainingEventId === value.trainingEventId &&
    value.sourceType === "training_event"
  );
}

export function createKnownSpellTrainingEventEvidence(
  params: CreateKnownSpellTrainingEventEvidenceParams
): KnownSpellTrainingEventEvidenceValidationResult {
  return validateKnownSpellTrainingEventEvidence({
    trainingEventId: params.trainingEventId,
    sourceType: params.sourceType ?? "training_event"
  });
}

function mapTrainingEventEvidenceIssueToCollectionCode(
  code: KnownSpellTrainingEventEvidenceValidationIssueCode
): KnownSpellCollectionValidationIssueCode {
  switch (code) {
    case "missing_training_event_id":
      return "missing_training_event_id";
    case "missing_training_event_source":
      return "missing_training_event_source";
    case "invalid_training_event_evidence":
    case "unsupported_training_event_source":
    case "unsupported_training_event_evidence_field":
      return "unsupported_training_event_evidence";
  }
}

function getTrainingEventEvidenceCollectionField(
  index: number,
  field: string
): string {
  return field === "trainingEventEvidence"
    ? `records[${index}].trainingEventEvidence`
    : `records[${index}].trainingEventEvidence.${field}`;
}

function getKnownSpellIdForIssue(record: unknown): string | undefined {
  return isRecord(record) ? normalizeString(record.knownSpellId) ?? undefined : undefined;
}

function validateTrainingEventEvidenceForCollection(
  record: Record<string, unknown>,
  index: number,
  knownSpellId: string
): { evidence: KnownSpellTrainingEventEvidence | null; issues: KnownSpellCollectionValidationIssue[] } {
  const result = validateKnownSpellTrainingEventEvidence(record.trainingEventEvidence);

  return result.ok && result.evidence
    ? { evidence: result.evidence, issues: [] }
    : {
        evidence: null,
        issues: result.issues.map((issue) =>
          createCollectionIssue(
            mapTrainingEventEvidenceIssueToCollectionCode(issue.code),
            getTrainingEventEvidenceCollectionField(index, issue.field),
            issue.message,
            { index, knownSpellId }
          )
        )
      };
}

function collectInvalidKnownSpellProjectionRecordIndexes(
  issues: readonly KnownSpellCollectionValidationIssue[]
): Set<number> {
  const indexes = new Set<number>();

  for (const issue of issues) {
    if (typeof issue.index === "number") {
      indexes.add(issue.index);
    }
    for (const duplicateIndex of issue.duplicateIndexes ?? []) {
      indexes.add(duplicateIndex);
    }
  }

  return indexes;
}

function mapKnownSpellReadOnlyProjectionEntry(
  record: KnownSpellRecordState
): KnownSpellReadOnlyProjectionEntry {
  return {
    knownSpellId: record.knownSpellId,
    spellId: record.spellId,
    characterId: record.characterId,
    availability: record.availability,
    acquisitionRoute: record.acquisitionRoute,
    acquiredAt: record.acquiredAt,
    ...(record.trainingEventEvidence?.trainingEventId
      ? { trainingEventId: record.trainingEventEvidence.trainingEventId }
      : {}),
    ...(record.blockedReason ? { blockedReason: record.blockedReason } : {})
  };
}

function buildKnownSpellReadOnlyProjectionEntries(
  records: readonly KnownSpellRecordState[]
): Pick<KnownSpellReadOnlyProjection, "knownSpells" | "blockedSpells"> {
  return {
    knownSpells: records
      .filter((record) => record.availability === "available")
      .map(mapKnownSpellReadOnlyProjectionEntry),
    blockedSpells: records
      .filter((record) => record.availability === "blocked")
      .map(mapKnownSpellReadOnlyProjectionEntry)
  };
}

function collectProjectableKnownSpellRecords(
  records: unknown,
  spellCatalog: Iterable<KnownSpellCatalogEntry>,
  characterId: string,
  invalidIndexes: ReadonlySet<number>
): KnownSpellRecordState[] {
  if (!Array.isArray(records)) {
    return [];
  }

  const validRecords: KnownSpellRecordState[] = [];
  for (const [index, record] of records.entries()) {
    if (invalidIndexes.has(index)) {
      continue;
    }

    const validation = validateKnownSpellRecordCollection({
      records: [record],
      spellCatalog,
      characterId
    });
    if (validation.ok) {
      validRecords.push(...validation.records);
    }
  }

  return validRecords;
}

function validateKnownSpellRecordWithCatalog(
  record: unknown,
  spellCatalogIds: ReadonlySet<string>,
  characterIdContext: string | null
): KnownSpellValidationResult {
  const issues: KnownSpellValidationIssue[] = [];

  if (!isRecord(record)) {
    return {
      ok: false,
      issues: [
        createIssue(
          "invalid_record",
          "record",
          "Known-spell records must be plain objects."
        )
      ]
    };
  }

  const knownSpellId = normalizeString(record.knownSpellId);
  const ownerScope = normalizeString(record.ownerScope);
  const ownerId = normalizeString(record.ownerId);
  const characterId = normalizeString(record.characterId);
  const spellId = normalizeString(record.spellId);
  const acquisitionRoute = normalizeString(record.acquisitionRoute);
  const acquiredAt = normalizeString(record.acquiredAt);
  const availability = normalizeString(record.availability);
  const blockedReason = normalizeString(record.blockedReason);
  const trainingEventEvidence = normalizeKnownSpellTrainingEventEvidence(record.trainingEventEvidence);

  if (!knownSpellId) {
    issues.push(createIssue("missing_known_spell_id", "knownSpellId", "knownSpellId is required."));
  }

  if (!ownerScope) {
    issues.push(createIssue("missing_owner_scope", "ownerScope", "ownerScope is required."));
  } else if (!KNOWN_SPELL_OWNER_SCOPE_SET.has(ownerScope)) {
    issues.push(
      createIssue(
        "unsupported_owner_scope",
        "ownerScope",
        `Known-spell ownerScope '${ownerScope}' is not supported by this helper boundary.`
      )
    );
  }

  if (!ownerId) {
    issues.push(createIssue("missing_owner_id", "ownerId", "ownerId is required."));
  }

  if (!characterId) {
    issues.push(createIssue("missing_character_id", "characterId", "characterId is required."));
  }

  if (ownerId && characterId && ownerId !== characterId) {
    issues.push(
      createIssue(
        "owner_character_mismatch",
        "ownerId",
        "character-scoped known-spell records must use the same ownerId and characterId."
      )
    );
  }

  if (characterIdContext && characterId && characterId !== characterIdContext) {
    issues.push(
      createIssue(
        "character_context_mismatch",
        "characterId",
        `Known-spell record characterId '${characterId}' does not match '${characterIdContext}'.`
      )
    );
  }

  if (characterIdContext && ownerId && ownerId !== characterIdContext) {
    issues.push(
      createIssue(
        "character_context_mismatch",
        "ownerId",
        `Known-spell record ownerId '${ownerId}' does not match '${characterIdContext}'.`
      )
    );
  }

  if (!spellId) {
    issues.push(createIssue("missing_spell_id", "spellId", "spellId is required."));
  } else if (!spellCatalogIds.has(spellId)) {
    issues.push(
      createIssue(
        "unknown_spell_id",
        "spellId",
        `Known-spell record references unknown spellId '${spellId}'.`
      )
    );
  }

  if (!acquisitionRoute) {
    issues.push(
      createIssue("missing_acquisition_route", "acquisitionRoute", "acquisitionRoute is required.")
    );
  } else if (!KNOWN_SPELL_ACQUISITION_ROUTE_SET.has(acquisitionRoute)) {
    issues.push(
      createIssue(
        "unsupported_acquisition_route",
        "acquisitionRoute",
        `Known-spell acquisitionRoute '${acquisitionRoute}' is not supported by this helper boundary.`
      )
    );
  }

  if (!acquiredAt) {
    issues.push(createIssue("missing_acquired_at", "acquiredAt", "acquiredAt is required."));
  }

  if (!availability) {
    issues.push(createIssue("missing_availability", "availability", "availability is required."));
  } else if (!KNOWN_SPELL_AVAILABILITY_STATE_SET.has(availability)) {
    issues.push(
      createIssue(
        "unsupported_availability",
        "availability",
        `Known-spell availability '${availability}' is not supported by this helper boundary.`
      )
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    issues: [],
    record: {
      knownSpellId: knownSpellId as string,
      ownerScope: "character",
      ownerId: ownerId as string,
      characterId: characterId as string,
      spellId: spellId as string,
      acquisitionRoute: "training_event",
      acquiredAt: acquiredAt as string,
      availability: availability as KnownSpellAvailabilityState,
      ...(blockedReason ? { blockedReason } : {}),
      ...(trainingEventEvidence ? { trainingEventEvidence } : {})
    }
  };
}

export function validateKnownSpellRecord(
  params: ValidateKnownSpellRecordParams
): KnownSpellValidationResult {
  return validateKnownSpellRecordWithCatalog(
    params.record,
    collectKnownSpellCatalogIds(params.spellCatalog),
    normalizeString(params.characterId) ?? null
  );
}

export function validateKnownSpellRecordCollection(
  params: ValidateKnownSpellRecordCollectionParams
): KnownSpellCollectionValidationResult {
  if (!Array.isArray(params.records)) {
    return {
      ok: false,
      issues: [
        createCollectionIssue(
          "invalid_collection",
          "records",
          "Known-spell collection validation requires an array of records."
        )
      ],
      records: []
    };
  }

  const spellCatalogIds = collectKnownSpellCatalogIds(params.spellCatalog);
  const characterIdContext = normalizeString(params.characterId) ?? null;
  const issues: KnownSpellCollectionValidationIssue[] = [];
  const duplicateIndexesByKnownSpellId = new Map<string, number[]>();
  const normalizedRecords: KnownSpellRecordState[] = [];

  for (const [index, record] of params.records.entries()) {
    const knownSpellId = getKnownSpellIdForIssue(record);
    if (knownSpellId) {
      duplicateIndexesByKnownSpellId.set(
        knownSpellId,
        [...(duplicateIndexesByKnownSpellId.get(knownSpellId) ?? []), index]
      );
    }

    const recordResult = validateKnownSpellRecordWithCatalog(
      record,
      spellCatalogIds,
      characterIdContext
    );
    if (!recordResult.ok || !recordResult.record) {
      issues.push(
        createCollectionIssue(
          "record_validation_failed",
          `records[${index}]`,
          `Known-spell record at index ${index} failed validation.`,
          {
            index,
            ...(knownSpellId ? { knownSpellId } : {}),
            recordIssues: recordResult.issues
          }
        )
      );
      continue;
    }

    const evidenceResult = validateTrainingEventEvidenceForCollection(
      record as Record<string, unknown>,
      index,
      recordResult.record.knownSpellId
    );
    if (evidenceResult.issues.length > 0 || !evidenceResult.evidence) {
      issues.push(...evidenceResult.issues);
      continue;
    }

    normalizedRecords.push({
      ...recordResult.record,
      trainingEventEvidence: evidenceResult.evidence
    });
  }

  for (const [knownSpellId, duplicateIndexes] of duplicateIndexesByKnownSpellId.entries()) {
    if (duplicateIndexes.length <= 1) {
      continue;
    }
    issues.push(
      createCollectionIssue(
        "duplicate_known_spell_id",
        "knownSpellId",
        `Known-spell collection contains duplicate knownSpellId '${knownSpellId}'.`,
        {
          index: duplicateIndexes[0],
          knownSpellId,
          duplicateIndexes
        }
      )
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues, records: [] };
  }

  return { ok: true, issues: [], records: normalizedRecords };
}

export function buildKnownSpellReadOnlyProjection(
  params: BuildKnownSpellReadOnlyProjectionParams
): KnownSpellReadOnlyProjection {
  const characterId = normalizeString(params.characterId);
  if (!characterId) {
    return {
      ok: false,
      characterId: "",
      knownSpellCount: 0,
      availableSpellCount: 0,
      blockedSpellCount: 0,
      invalidRecordCount: 0,
      knownSpells: [],
      blockedSpells: [],
      issues: [
        createCollectionIssue(
          "invalid_collection",
          "characterId",
          "Known-spell read-only projection requires a characterId."
        )
      ]
    };
  }

  const spellCatalog = Array.from(params.spellCatalog);
  const validation = validateKnownSpellRecordCollection({
    records: params.records,
    spellCatalog,
    characterId
  });

  if (!validation.ok) {
    const invalidIndexes = collectInvalidKnownSpellProjectionRecordIndexes(validation.issues);
    const { knownSpells, blockedSpells } = buildKnownSpellReadOnlyProjectionEntries(
      collectProjectableKnownSpellRecords(
        params.records,
        spellCatalog,
        characterId,
        invalidIndexes
      )
    );

    return {
      ok: false,
      characterId,
      knownSpellCount: knownSpells.length + blockedSpells.length,
      availableSpellCount: knownSpells.length,
      blockedSpellCount: blockedSpells.length,
      invalidRecordCount: invalidIndexes.size,
      knownSpells,
      blockedSpells,
      issues: validation.issues
    };
  }

  const { knownSpells, blockedSpells } = buildKnownSpellReadOnlyProjectionEntries(
    validation.records
  );

  return {
    ok: true,
    characterId,
    knownSpellCount: knownSpells.length + blockedSpells.length,
    availableSpellCount: knownSpells.length,
    blockedSpellCount: blockedSpells.length,
    invalidRecordCount: 0,
    knownSpells,
    blockedSpells,
    issues: []
  };
}

function createMagicCastReadinessBlocker(
  id: MagicCastReadinessBlockerId,
  source: string,
  message: string,
  details?: Record<string, unknown>
): MagicCastReadinessBlocker {
  return {
    id,
    source,
    message,
    ...(details && Object.keys(details).length > 0 ? { details } : {})
  };
}

function normalizeBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized: string[] = [];
  for (const entry of value) {
    const text = normalizeString(entry);
    if (!text) {
      return null;
    }
    normalized.push(text);
  }
  return normalized;
}

function normalizeStringArrayGroups(value: unknown): string[][] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized: string[][] = [];
  for (const group of value) {
    const tags = normalizeStringArray(group);
    if (!tags || tags.length === 0) {
      return null;
    }
    normalized.push(tags);
  }
  return normalized;
}

function collectStrings(values: Iterable<unknown> | undefined): ReadonlySet<string> {
  const strings = new Set<string>();
  if (!values || typeof values === "string") {
    return strings;
  }

  for (const value of values) {
    const text = normalizeString(value);
    if (text) {
      strings.add(text);
    }
  }
  return strings;
}

function normalizeHookClassification(
  value: unknown
): MagicCastReadinessHookClassification | null {
  switch (value) {
    case "runtime":
    case "classifier":
    case "supported":
    case "deferred":
    case "unsupported":
    case "unknown":
      return value;
    default:
      return null;
  }
}

interface MagicCastReadinessHookPolicy {
  map: Readonly<Record<string, MagicCastReadinessHookClassification>> | undefined;
  mapAuthority: MagicHookSupportClassificationAuthority;
  runtimeHooks: ReadonlySet<string>;
  runtimeAuthority: MagicHookSupportClassificationAuthority;
  classifierHooks: ReadonlySet<string>;
  classifierAuthority: MagicHookSupportClassificationAuthority;
  supportedHooks: ReadonlySet<string>;
  supportedAuthority: MagicHookSupportClassificationAuthority;
  deferredHooks: ReadonlySet<string>;
  deferredAuthority: MagicHookSupportClassificationAuthority;
  unsupportedHooks: ReadonlySet<string>;
  unsupportedAuthority: MagicHookSupportClassificationAuthority;
}

function classifyMagicCastReadinessHook(
  hookId: string,
  policy: MagicCastReadinessHookPolicy
): Pick<MagicHookSupportProjectionEntry, "classification" | "classificationAuthority"> {
  const mappedClassification = normalizeHookClassification(policy.map?.[hookId]);
  if (mappedClassification) {
    return {
      classification: mappedClassification,
      classificationAuthority: policy.mapAuthority
    };
  }
  if (policy.runtimeHooks.has(hookId)) {
    return {
      classification: "runtime",
      classificationAuthority: policy.runtimeAuthority
    };
  }
  if (policy.classifierHooks.has(hookId)) {
    return {
      classification: "classifier",
      classificationAuthority: policy.classifierAuthority
    };
  }
  if (policy.supportedHooks.has(hookId)) {
    return {
      classification: "supported",
      classificationAuthority: policy.supportedAuthority
    };
  }
  if (policy.deferredHooks.has(hookId)) {
    return {
      classification: "deferred",
      classificationAuthority: policy.deferredAuthority
    };
  }
  if (policy.unsupportedHooks.has(hookId)) {
    return {
      classification: "unsupported",
      classificationAuthority: policy.unsupportedAuthority
    };
  }
  return {
    classification: "unknown",
    classificationAuthority: "unknown_fallback"
  };
}

function isSupportedMagicCastReadinessHook(
  classification: MagicCastReadinessHookClassification
): boolean {
  return classification === "runtime" || classification === "classifier" || classification === "supported";
}

function createResolutionHookPolicy(
  hookSupport: MagicCastReadinessHookSupport | undefined
): MagicCastReadinessHookPolicy {
  return {
    map: hookSupport?.resolutionHooks,
    mapAuthority: "resolutionHooks",
    runtimeHooks: collectStrings(hookSupport?.runtimeResolutionHooks),
    runtimeAuthority: "runtimeResolutionHooks",
    classifierHooks: collectStrings(hookSupport?.classifierResolutionHooks),
    classifierAuthority: "classifierResolutionHooks",
    supportedHooks: collectStrings(hookSupport?.supportedResolutionHooks),
    supportedAuthority: "supportedResolutionHooks",
    deferredHooks: collectStrings(hookSupport?.deferredResolutionHooks),
    deferredAuthority: "deferredResolutionHooks",
    unsupportedHooks: collectStrings(hookSupport?.unsupportedResolutionHooks),
    unsupportedAuthority: "unsupportedResolutionHooks"
  };
}

function createItemGenerationHookPolicy(
  hookSupport: MagicCastReadinessHookSupport | undefined
): MagicCastReadinessHookPolicy {
  return {
    map: hookSupport?.itemGenerationHooks,
    mapAuthority: "itemGenerationHooks",
    runtimeHooks: collectStrings(hookSupport?.runtimeItemGenerationHookIds),
    runtimeAuthority: "runtimeItemGenerationHookIds",
    classifierHooks: collectStrings(hookSupport?.classifierItemGenerationHookIds),
    classifierAuthority: "classifierItemGenerationHookIds",
    supportedHooks: collectStrings(hookSupport?.supportedItemGenerationHookIds),
    supportedAuthority: "supportedItemGenerationHookIds",
    deferredHooks: collectStrings(hookSupport?.deferredItemGenerationHookIds),
    deferredAuthority: "deferredItemGenerationHookIds",
    unsupportedHooks: collectStrings(hookSupport?.unsupportedItemGenerationHookIds),
    unsupportedAuthority: "unsupportedItemGenerationHookIds"
  };
}

function collectMagicHookProjectionIds(values: Iterable<unknown> | undefined): string[] {
  const hookIds: string[] = [];
  if (!values || typeof values === "string") {
    return hookIds;
  }

  for (const value of values) {
    const hookId = normalizeString(value);
    if (hookId) {
      hookIds.push(hookId);
    }
  }
  return hookIds;
}

function getMagicHookSupportBlockerReason(
  classification: MagicCastReadinessHookClassification
): MagicHookSupportBlockerReason | undefined {
  switch (classification) {
    case "deferred":
      return "deferred_hook";
    case "unsupported":
      return "unsupported_hook";
    case "unknown":
      return "unknown_hook";
    default:
      return undefined;
  }
}

function projectMagicHookSupportEntries(
  hookIds: readonly string[],
  sourceField: MagicHookSupportProjectionSourceField,
  policy: MagicCastReadinessHookPolicy
): MagicHookSupportProjectionEntry[] {
  return hookIds.map((hookId) => {
    const classified = classifyMagicCastReadinessHook(hookId, policy);
    const readinessEffect: MagicHookSupportReadinessEffect =
      isSupportedMagicCastReadinessHook(classified.classification) ? "supported" : "blocking";
    const blockerReason = getMagicHookSupportBlockerReason(classified.classification);

    return {
      hookId,
      sourceField,
      ...classified,
      readinessEffect,
      executable: false,
      ...(blockerReason ? { blockerReason } : {})
    };
  });
}

export function buildMagicHookSupportProjection(
  params: BuildMagicHookSupportProjectionParams
): MagicHookSupportProjection {
  const hooks = [
    ...projectMagicHookSupportEntries(
      collectMagicHookProjectionIds(params.resolutionHookIds),
      "resolutionHooks",
      createResolutionHookPolicy(params.hookSupport)
    ),
    ...projectMagicHookSupportEntries(
      collectMagicHookProjectionIds(params.itemGenerationHookIds),
      "itemGenerationHooks",
      createItemGenerationHookPolicy(params.hookSupport)
    )
  ];
  const blockingHooks = hooks.filter((hook) => hook.readinessEffect === "blocking");

  return {
    allHooksSupported: blockingHooks.length === 0,
    hooks,
    blockingHooks
  };
}

function findMagicCastReadinessSpellRecord(
  spellCatalog: readonly KnownSpellCatalogEntry[],
  spellId: string,
  spellRecord: unknown
): Record<string, unknown> | null {
  if (isRecord(spellRecord)) {
    const explicitId = normalizeString(spellRecord.id);
    if (!explicitId || explicitId === spellId) {
      return spellRecord;
    }
  }

  for (const entry of spellCatalog) {
    if (isRecord(entry) && normalizeString(entry.id) === spellId) {
      return entry;
    }
  }

  return null;
}

function getMagicCastReadinessCompatibilityProfile(
  spellRecord: Record<string, unknown> | null
): Record<string, unknown> | null {
  return isRecord(spellRecord?.compatibilityProfile) ? spellRecord.compatibilityProfile : null;
}

function isMagicCastFreecastAllowed(profile: Record<string, unknown> | null): boolean {
  return normalizeBoolean(profile?.freecastAllowed) === true;
}

function getRequiredMagicCastConduitTagCheck(
  profile: Record<string, unknown> | null,
  conduitTags: readonly string[]
): { ok: boolean; missingTags: string[]; missingAnyGroups: string[][]; invalidProfile: boolean } {
  const requiredTags = isRecord(profile?.requiredTags) ? profile.requiredTags : null;
  if (!requiredTags) {
    return { ok: false, missingTags: [], missingAnyGroups: [], invalidProfile: true };
  }

  const allTags = requiredTags.all === undefined ? [] : normalizeStringArray(requiredTags.all);
  if (!allTags) {
    return { ok: false, missingTags: [], missingAnyGroups: [], invalidProfile: true };
  }

  const conduitTagSet = new Set(conduitTags);
  const missingTags = allTags.filter((tag) => !conduitTagSet.has(tag));

  let missingAnyGroups: string[][] = [];
  if (requiredTags.any !== undefined) {
    const anyGroups = normalizeStringArrayGroups(requiredTags.any);
    if (!anyGroups || anyGroups.length === 0) {
      return { ok: false, missingTags, missingAnyGroups: [], invalidProfile: true };
    }
    missingAnyGroups = anyGroups.filter((group) => !group.some((tag) => conduitTagSet.has(tag)));
  }

  return {
    ok: missingTags.length === 0 && missingAnyGroups.length === 0,
    missingTags,
    missingAnyGroups,
    invalidProfile: false
  };
}

function isConduitCandidateCompatible(
  spellProfile: Record<string, unknown> | null,
  conduitCandidate: unknown
): { ok: boolean; conduitId?: string; details: Record<string, unknown> } {
  if (!isRecord(conduitCandidate) || !isRecord(conduitCandidate.conduitProfile)) {
    return {
      ok: false,
      details: { reason: "missing_conduit_profile" }
    };
  }

  const conduitId = normalizeString(conduitCandidate.id) ?? undefined;
  const conduitProfile = conduitCandidate.conduitProfile;
  const castingTags = normalizeStringArray(conduitProfile.castingTags);
  if (!castingTags || castingTags.length === 0) {
    return {
      ok: false,
      ...(conduitId ? { conduitId } : {}),
      details: { reason: "missing_casting_tags" }
    };
  }

  const tagCheck = getRequiredMagicCastConduitTagCheck(spellProfile, castingTags);
  if (!tagCheck.ok) {
    return {
      ok: false,
      ...(conduitId ? { conduitId } : {}),
      details: {
        reason: tagCheck.invalidProfile ? "invalid_spell_required_tags" : "tag_mismatch",
        ...(tagCheck.missingTags.length > 0 ? { missingTags: tagCheck.missingTags } : {}),
        ...(tagCheck.missingAnyGroups.length > 0 ? { missingAnyGroups: tagCheck.missingAnyGroups } : {})
      }
    };
  }

  return {
    ok: true,
    ...(conduitId ? { conduitId } : {}),
    details: { castingTags }
  };
}

function collectMagicCastCatalystRequirements(profile: Record<string, unknown> | null): {
  families: string[] | null;
  tiers: string[] | null;
  declaresRequirement: boolean;
} {
  const declaresFamilies = profile?.catalystFamilies !== undefined;
  const declaresTiers = profile?.catalystTiers !== undefined;
  return {
    families: declaresFamilies ? normalizeStringArray(profile?.catalystFamilies) : [],
    tiers: declaresTiers ? normalizeStringArray(profile?.catalystTiers) : [],
    declaresRequirement: declaresFamilies || declaresTiers
  };
}

function isCatalystCandidateCompatible(
  spellProfile: Record<string, unknown> | null,
  catalystCandidate: unknown
): { ok: boolean; catalystId?: string; details: Record<string, unknown> } {
  if (!isRecord(catalystCandidate) || !isRecord(catalystCandidate.catalystProfile)) {
    return {
      ok: false,
      details: { reason: "missing_catalyst_profile" }
    };
  }

  const catalystId = normalizeString(catalystCandidate.id) ?? undefined;
  const catalystProfile = catalystCandidate.catalystProfile;
  const catalystTier = normalizeString(catalystProfile.tier);
  const catalystFamilies = catalystProfile.families === undefined ? [] : normalizeStringArray(catalystProfile.families);
  const requirements = collectMagicCastCatalystRequirements(spellProfile);

  if (!catalystTier) {
    return {
      ok: false,
      ...(catalystId ? { catalystId } : {}),
      details: { reason: "missing_catalyst_tier" }
    };
  }
  if (!catalystFamilies || requirements.families === null || requirements.tiers === null) {
    return {
      ok: false,
      ...(catalystId ? { catalystId } : {}),
      details: { reason: "invalid_catalyst_metadata" }
    };
  }

  const familyMismatch =
    requirements.families.length > 0 &&
    !requirements.families.some((family) => catalystFamilies.includes(family));
  const tierMismatch = requirements.tiers.length > 0 && !requirements.tiers.includes(catalystTier);

  if (familyMismatch || tierMismatch) {
    return {
      ok: false,
      ...(catalystId ? { catalystId } : {}),
      details: {
        reason: "catalyst_mismatch",
        ...(familyMismatch ? { requiredFamilies: requirements.families, catalystFamilies } : {}),
        ...(tierMismatch ? { requiredTiers: requirements.tiers, catalystTier } : {})
      }
    };
  }

  return {
    ok: true,
    ...(catalystId ? { catalystId } : {}),
    details: { catalystTier, catalystFamilies }
  };
}

function collectMagicCastControlTagsFromTagRequirements(requiredTags: unknown): string[] {
  if (!isRecord(requiredTags)) {
    return [];
  }

  const tags: string[] = [];
  const allTags = normalizeStringArray(requiredTags.all);
  if (allTags) {
    tags.push(...allTags);
  }
  const anyGroups = normalizeStringArrayGroups(requiredTags.any);
  if (anyGroups) {
    tags.push(...anyGroups.flat());
  }
  return tags.filter((tag): tag is MagicCastReadinessControlLevel =>
    MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.has(tag as MagicCastReadinessControlLevel)
  );
}

function resolveRequiredMagicCastControlLevel(
  profile: Record<string, unknown> | null
): MagicCastReadinessControlLevel {
  const candidateTags = [
    ...collectMagicCastControlTagsFromTagRequirements(profile?.requiredTags),
    ...(normalizeStringArray(profile?.preferredTags) ?? []).filter((tag): tag is MagicCastReadinessControlLevel =>
      MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.has(tag as MagicCastReadinessControlLevel)
    )
  ];

  let selected: MagicCastReadinessControlLevel = "control.easy";
  for (const tag of candidateTags) {
    if ((MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.get(tag) ?? 0) > (MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.get(selected) ?? 0)) {
      selected = tag;
    }
  }
  return selected;
}

function isMagicCastControlContextSufficient(
  controlContext: unknown,
  requiredControlLevel: MagicCastReadinessControlLevel
): boolean {
  if (!isRecord(controlContext)) {
    return false;
  }

  if (controlContext.canCast === true) {
    return true;
  }

  const requiredScore = MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.get(requiredControlLevel) ?? 1;
  const controlScore = normalizeNumber(controlContext.controlScore);
  if (controlScore !== null && controlScore >= requiredScore) {
    return true;
  }

  const controlTags = normalizeStringArray(controlContext.controlTags);
  if (!controlTags) {
    return false;
  }

  return controlTags.some((tag) => {
    const weight = MAGIC_CAST_CONTROL_LEVEL_WEIGHTS.get(tag as MagicCastReadinessControlLevel);
    return weight !== undefined && weight >= requiredScore;
  });
}

function collectUnsupportedMagicCastHooks(
  spellRecord: Record<string, unknown> | null,
  hookSupport: MagicCastReadinessHookSupport | undefined
): Pick<MagicCastReadinessDetails, "unsupportedResolutionHooks" | "unsupportedItemGenerationHookIds"> {
  const resolutionPolicy = createResolutionHookPolicy(hookSupport);
  const itemGenerationPolicy = createItemGenerationHookPolicy(hookSupport);

  const unsupportedResolutionHookIds: string[] = [];
  for (const hook of normalizeStringArray(spellRecord?.resolutionHooks) ?? []) {
    const { classification } = classifyMagicCastReadinessHook(hook, resolutionPolicy);
    if (!isSupportedMagicCastReadinessHook(classification)) {
      unsupportedResolutionHookIds.push(hook);
    }
  }

  const unsupportedGeneratedItemIds: string[] = [];
  const itemGenerationHooks = Array.isArray(spellRecord?.itemGenerationHooks)
    ? spellRecord?.itemGenerationHooks
    : [];
  for (const [index, hook] of itemGenerationHooks.entries()) {
    const hookId = isRecord(hook) ? normalizeString(hook.generatedItemId) : null;
    if (!hookId) {
      unsupportedGeneratedItemIds.push(`itemGenerationHooks[${index}]`);
      continue;
    }
    const { classification } = classifyMagicCastReadinessHook(hookId, itemGenerationPolicy);
    if (!isSupportedMagicCastReadinessHook(classification)) {
      unsupportedGeneratedItemIds.push(hookId);
    }
  }

  return {
    unsupportedResolutionHooks: unsupportedResolutionHookIds,
    unsupportedItemGenerationHookIds: unsupportedGeneratedItemIds
  };
}

function isMagicCastResolverKnownSpellReference(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const refType = normalizeString(value.refType);
  if (refType === "known_spell_id") {
    return Boolean(normalizeString(value.knownSpellId));
  }
  if (refType === "known_spell_record") {
    return isRecord(value.record) && Boolean(normalizeString(value.record.knownSpellId));
  }
  return false;
}

function resolveMagicCastResolverKnownSpellRecords(
  providedRecords: unknown,
  knownSpellRef: unknown
): unknown {
  if (providedRecords !== undefined) {
    return providedRecords;
  }
  if (isRecord(knownSpellRef) && normalizeString(knownSpellRef.refType) === "known_spell_record") {
    return [knownSpellRef.record];
  }
  return [];
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMagicCastResolverAreaOrigin(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  switch (normalizeString(value.originType)) {
    case "self":
      return true;
    case "character":
      return Boolean(normalizeString(value.characterId));
    case "entity":
      return Boolean(normalizeString(value.entityId));
    case "location":
      return Boolean(normalizeString(value.locationId));
    case "point": {
      const point = value.point;
      return isRecord(point) && isFiniteNumber(point.x) && isFiniteNumber(point.y);
    }
    default:
      return false;
  }
}

function isMagicCastResolverTargetDescriptor(value: unknown, casterCharacterId: string): boolean {
  if (!isRecord(value)) {
    return false;
  }

  switch (normalizeString(value.targetType)) {
    case "none":
      return true;
    case "self":
      return normalizeString(value.characterId) === casterCharacterId;
    case "character":
      return Boolean(normalizeString(value.characterId));
    case "entity":
      return Boolean(normalizeString(value.entityId));
    case "location":
      return Boolean(normalizeString(value.locationId));
    case "point": {
      const point = value.point;
      return isRecord(point) && isFiniteNumber(point.x) && isFiniteNumber(point.y);
    }
    case "item":
      return Boolean(normalizeString(value.itemId) ?? normalizeString(value.itemInstanceId));
    case "area":
      return isMagicCastResolverAreaOrigin(value.origin) &&
        (value.radius === undefined || (isFiniteNumber(value.radius) && value.radius >= 0));
    default:
      return false;
  }
}

function isMagicCastResolverItemSourceDescriptor(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  switch (normalizeString(value.sourceType)) {
    case "none":
    case "unavailable":
    case "unknown":
      return true;
    case "equipped_item":
    case "held_item":
    case "inventory_item":
      return Boolean(normalizeString(value.itemInstanceId));
    case "supplied_candidate":
      return value.itemRecord !== undefined ||
        Boolean(normalizeString(value.itemId) ?? normalizeString(value.itemInstanceId));
    default:
      return false;
  }
}

function isMagicCastResolverCastingContext(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) {
    return false;
  }

  const contextType = normalizeString(value.contextType);
  return contextType === "combat" || contextType === "noncombat";
}

function isMagicCastResolverRuntimePolicy(value: unknown): value is MagicCastResolverRuntimePolicy {
  return isRecord(value);
}

function getMagicCastResolverRuntimeFlag(policy: MagicCastResolverRuntimePolicy): boolean {
  return policy.testOnlyResolverLane === true || policy.runtimeCastingImplemented === true;
}

function appendMagicCastReadinessResolverIssues(
  issues: MagicCastResolverReadinessIssue[],
  readiness: MagicCastReadinessResult
): void {
  if (readiness.blockers.length === 0) {
    return;
  }

  issues.push(
    createMagicCastResolverReadinessIssue(
      "cast_readiness_blocked",
      "readiness",
      "Magic cast readiness returned one or more blockers.",
      { details: { blockerIds: readiness.blockers.map((blocker) => blocker.id) } }
    )
  );

  for (const blocker of readiness.blockers) {
    switch (blocker.id) {
      case "runtime_casting_not_implemented":
      case "unsupported_spell_hooks":
      case "spell_runtime_deferred":
        issues.push(
          createMagicCastResolverReadinessIssue(
            blocker.id,
            "readiness",
            blocker.message,
            {
              blockerId: blocker.id,
              details: {
                source: blocker.source,
                ...(blocker.details ? { blockerDetails: blocker.details } : {})
              }
            }
          )
        );
        break;
    }
  }
}

export function buildMagicCastReadiness(
  params: BuildMagicCastReadinessParams
): MagicCastReadinessResult {
  const characterId = normalizeString(params.characterId) ?? "";
  const spellId = normalizeString(params.spellId) ?? "";
  const spellCatalog = Array.from(params.spellCatalog);
  const projection = buildKnownSpellReadOnlyProjection({
    records: params.records,
    spellCatalog,
    characterId
  });
  const spellRecord = spellId
    ? findMagicCastReadinessSpellRecord(spellCatalog, spellId, params.spellRecord)
    : null;
  const spellProfile = getMagicCastReadinessCompatibilityProfile(spellRecord);
  const compatibilityStatus = normalizeString(spellRecord?.compatibilityStatus) ?? undefined;
  const freecastAllowed = isMagicCastFreecastAllowed(spellProfile);
  const conduitRequired = params.requireConduit === true || !freecastAllowed;
  const catalystRequirements = collectMagicCastCatalystRequirements(spellProfile);
  const catalystRequired =
    params.requireCatalyst === true ||
    (params.requireCatalyst !== false && catalystRequirements.declaresRequirement);
  const requiredControlLevel = resolveRequiredMagicCastControlLevel(spellProfile);
  const availableKnownSpell = projection.knownSpells.find((entry) => entry.spellId === spellId);
  const blockedKnownSpell = projection.blockedSpells.find((entry) => entry.spellId === spellId);
  const hookDetails = collectUnsupportedMagicCastHooks(spellRecord, params.hookSupport);
  const blockers: MagicCastReadinessBlocker[] = [];
  let conduitId: string | undefined;
  let catalystId: string | undefined;

  if (!availableKnownSpell && !blockedKnownSpell) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "missing_known_spell",
        "known_spell_projection",
        "No valid available character-scoped known-spell record exists for the requested spell.",
        { spellId, characterId }
      )
    );
  }

  if (blockedKnownSpell) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "known_spell_blocked",
        blockedKnownSpell.knownSpellId,
        "The requested spell is known but currently blocked.",
        {
          spellId,
          blockedReason: blockedKnownSpell.blockedReason ?? null
        }
      )
    );
  }

  if (projection.issues.length > 0) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "invalid_known_spell_record",
        "known_spell_projection",
        "Known-spell projection found invalid records for this character context.",
        { issueCodes: projection.issues.map((issue) => issue.code) }
      )
    );
  }

  if (projection.issues.some((issue) => MAGIC_CAST_READINESS_TRAINING_EVIDENCE_ISSUE_CODES.has(issue.code))) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "missing_training_event_evidence",
        "known_spell_projection",
        "Known-spell records require supported training_event evidence before cast readiness.",
        {
          issueCodes: projection.issues
            .filter((issue) => MAGIC_CAST_READINESS_TRAINING_EVIDENCE_ISSUE_CODES.has(issue.code))
            .map((issue) => issue.code)
        }
      )
    );
  }

  if (params.conduitCandidate === undefined || params.conduitCandidate === null) {
    if (conduitRequired) {
      blockers.push(
        createMagicCastReadinessBlocker(
          "missing_conduit",
          "conduit",
          "A conduit is required for this cast-readiness lane.",
          { spellId, freecastAllowed, requireConduit: params.requireConduit === true }
        )
      );
    }
  } else {
    const conduitCheck = isConduitCandidateCompatible(spellProfile, params.conduitCandidate);
    conduitId = conduitCheck.conduitId;
    if (!conduitCheck.ok) {
      blockers.push(
        createMagicCastReadinessBlocker(
          "invalid_conduit",
          conduitCheck.conduitId ?? "conduit",
          "The supplied conduit does not satisfy spell compatibility metadata.",
          conduitCheck.details
        )
      );
    }
  }

  if (params.catalystCandidate === undefined || params.catalystCandidate === null) {
    if (catalystRequired) {
      blockers.push(
        createMagicCastReadinessBlocker(
          "missing_catalyst",
          "catalyst",
          "A catalyst is required by the selected spell compatibility metadata.",
          {
            spellId,
            ...(catalystRequirements.families && catalystRequirements.families.length > 0
              ? { requiredFamilies: catalystRequirements.families }
              : {}),
            ...(catalystRequirements.tiers && catalystRequirements.tiers.length > 0
              ? { requiredTiers: catalystRequirements.tiers }
              : {})
          }
        )
      );
    }
  } else {
    const catalystCheck = isCatalystCandidateCompatible(spellProfile, params.catalystCandidate);
    catalystId = catalystCheck.catalystId;
    if (!catalystCheck.ok) {
      blockers.push(
        createMagicCastReadinessBlocker(
          "invalid_catalyst",
          catalystCheck.catalystId ?? "catalyst",
          "The supplied catalyst does not satisfy spell compatibility metadata.",
          catalystCheck.details
        )
      );
    }
  }

  if (!isMagicCastControlContextSufficient(params.controlContext, requiredControlLevel)) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "insufficient_control",
        "control",
        "Caller-supplied control context is missing or below the deterministic threshold.",
        { requiredControlLevel }
      )
    );
  }

  if (
    hookDetails.unsupportedResolutionHooks.length > 0 ||
    hookDetails.unsupportedItemGenerationHookIds.length > 0
  ) {
    const unsupportedHookDetails: Record<string, unknown> = {
      unsupportedResolutionHooks: hookDetails.unsupportedResolutionHooks,
      unsupportedItemGenerationHookIds: hookDetails.unsupportedItemGenerationHookIds
    };
    blockers.push(
      createMagicCastReadinessBlocker(
        "unsupported_spell_hooks",
        "spell_hooks",
        "The requested spell uses deferred, unsupported, or unknown hooks.",
        unsupportedHookDetails
      )
    );
  }

  if (compatibilityStatus !== "ready") {
    blockers.push(
      createMagicCastReadinessBlocker(
        "spell_runtime_deferred",
        spellId || "spell",
        "The requested spell is not marked ready for runtime readiness.",
        { compatibilityStatus: compatibilityStatus ?? null }
      )
    );
  }

  if (params.runtimeCastingImplemented !== true) {
    blockers.push(
      createMagicCastReadinessBlocker(
        "runtime_casting_not_implemented",
        "runtime",
        "Effectful runtime casting is not implemented by this read-only helper."
      )
    );
  }

  return {
    ready: blockers.length === 0,
    blockers,
    projection,
    details: {
      spellId,
      characterId,
      ...(compatibilityStatus ? { compatibilityStatus } : {}),
      ...(availableKnownSpell ? { availableKnownSpellId: availableKnownSpell.knownSpellId } : {}),
      ...(blockedKnownSpell ? { blockedKnownSpellId: blockedKnownSpell.knownSpellId } : {}),
      freecastAllowed,
      conduitRequired,
      catalystRequired,
      requiredControlLevel,
      ...(conduitId ? { conduitId } : {}),
      ...(catalystId ? { catalystId } : {}),
      ...hookDetails
    }
  };
}

export function buildMagicCastResolverReadiness(
  params: BuildMagicCastResolverReadinessParams
): MagicCastResolverReadinessResult {
  const resolverRequestId = normalizeString(params.resolverRequestId) ?? "magic-cast-resolver-readiness";
  const issues: MagicCastResolverReadinessIssue[] = [];

  if (!isRecord(params.command)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_magic_command",
        "command",
        "Magic cast resolver readiness requires an explicit command-like object."
      )
    );
    return { ok: false, blocked: true, resolverRequestId, issues };
  }

  const command = params.command;
  const commandId = normalizeString(command.commandId) ?? undefined;
  const commandType = normalizeString(command.commandType);
  const casterCharacterId = normalizeString(command.casterCharacterId);
  const spellId = normalizeString(command.spellId);
  const knownSpellRef = command.knownSpellRef;
  const castingContext = command.castingContext;
  const runtimePolicy = params.runtimePolicy;

  if (commandType !== undefined && commandType !== "magic.cast") {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_magic_command",
        "command.commandType",
        `Magic cast resolver readiness supports only commandType 'magic.cast'.`
      )
    );
  }

  if (!casterCharacterId) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "missing_caster_character_id",
        "command.casterCharacterId",
        "Magic cast resolver readiness requires an explicit casterCharacterId."
      )
    );
  }

  if (!spellId) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "missing_spell_id",
        "command.spellId",
        "Magic cast resolver readiness requires an explicit spellId."
      )
    );
  }

  if (knownSpellRef === undefined || knownSpellRef === null) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "missing_known_spell_reference",
        "command.knownSpellRef",
        "Magic cast resolver readiness requires an explicit known-spell reference."
      )
    );
  } else if (!isMagicCastResolverKnownSpellReference(knownSpellRef)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_known_spell_reference",
        "command.knownSpellRef",
        "Magic cast resolver readiness known-spell reference must be a known_spell_id or known_spell_record reference."
      )
    );
  }

  if (command.target === undefined || command.target === null) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "missing_target_descriptor",
        "command.target",
        "Magic cast resolver readiness requires an explicit target descriptor."
      )
    );
  } else if (casterCharacterId && !isMagicCastResolverTargetDescriptor(command.target, casterCharacterId)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_target_descriptor",
        "command.target",
        "Magic cast resolver readiness target descriptor is malformed or unsupported."
      )
    );
  }

  if (!isMagicCastResolverItemSourceDescriptor(command.conduitSource)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_conduit_source_descriptor",
        "command.conduitSource",
        "Magic cast resolver readiness requires an explicit supported conduit source descriptor."
      )
    );
  }

  if (!isMagicCastResolverItemSourceDescriptor(command.catalystSource)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_catalyst_source_descriptor",
        "command.catalystSource",
        "Magic cast resolver readiness requires an explicit supported catalyst source descriptor."
      )
    );
  }

  if (!isMagicCastResolverCastingContext(castingContext)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_casting_context",
        "command.castingContext",
        "Magic cast resolver readiness requires a combat or noncombat casting context."
      )
    );
  }

  if (!isMagicCastResolverRuntimePolicy(runtimePolicy)) {
    issues.push(
      createMagicCastResolverReadinessIssue(
        "invalid_casting_context",
        "runtimePolicy",
        "Magic cast resolver readiness requires an explicit runtime policy object."
      )
    );
  } else {
    if (runtimePolicy.requireResourcePolicy === true && !normalizeString(runtimePolicy.resourcePolicyRef)) {
      issues.push(
        createMagicCastResolverReadinessIssue(
          "resource_policy_missing",
          "runtimePolicy.resourcePolicyRef",
          "Magic cast resolver readiness requires a resource policy reference for this lane."
        )
      );
    }
    if (runtimePolicy.requireCatalystPolicy === true && !normalizeString(runtimePolicy.catalystPolicyRef)) {
      issues.push(
        createMagicCastResolverReadinessIssue(
          "catalyst_policy_missing",
          "runtimePolicy.catalystPolicyRef",
          "Magic cast resolver readiness requires a catalyst policy reference for this lane."
        )
      );
    }
    if (runtimePolicy.requireFailurePolicy === true && !normalizeString(runtimePolicy.failurePolicyRef)) {
      issues.push(
        createMagicCastResolverReadinessIssue(
          "failure_policy_missing",
          "runtimePolicy.failurePolicyRef",
          "Magic cast resolver readiness requires a failure policy reference for this lane."
        )
      );
    }
  }

  if (issues.length > 0 || !casterCharacterId || !spellId || !isRecord(castingContext) || !isMagicCastResolverRuntimePolicy(runtimePolicy)) {
    return {
      ok: false,
      blocked: true,
      resolverRequestId,
      ...(commandId ? { commandId } : {}),
      issues
    };
  }

  const controlContext = params.controlContext ?? castingContext.controlContext;
  const hookSupport = params.hookSupport ?? (castingContext.hookSupport as MagicCastReadinessHookSupport | undefined);
  const requireConduit = normalizeBoolean(castingContext.requireConduit);
  const requireCatalyst = normalizeBoolean(castingContext.requireCatalyst);
  const readiness = buildMagicCastReadiness({
    records: resolveMagicCastResolverKnownSpellRecords(params.knownSpellRecords, knownSpellRef),
    spellCatalog: params.spellCatalog,
    characterId: casterCharacterId,
    spellId,
    ...(params.spellRecord !== undefined ? { spellRecord: params.spellRecord } : {}),
    ...(params.conduitCandidate !== undefined ? { conduitCandidate: params.conduitCandidate } : {}),
    ...(params.catalystCandidate !== undefined ? { catalystCandidate: params.catalystCandidate } : {}),
    ...(controlContext !== undefined ? { controlContext } : {}),
    ...(hookSupport !== undefined ? { hookSupport } : {}),
    ...(requireConduit !== null ? { requireConduit } : {}),
    ...(requireCatalyst !== null ? { requireCatalyst } : {}),
    runtimeCastingImplemented: getMagicCastResolverRuntimeFlag(runtimePolicy)
  });

  appendMagicCastReadinessResolverIssues(issues, readiness);

  return {
    ok: issues.length === 0,
    blocked: issues.length > 0,
    resolverRequestId,
    ...(commandId ? { commandId } : {}),
    readiness,
    issues
  };
}

function hasOwnField(value: object, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, field);
}

function getMagicResolverInertEnvelopeValue(
  params: BuildMagicResolverInertEnvelopeParams,
  field: keyof BuildMagicResolverInertEnvelopeParams,
  command: unknown,
  commandField: string
): unknown {
  if (hasOwnField(params, field)) {
    return params[field];
  }
  if (isRecord(command) && hasOwnField(command, commandField)) {
    return command[commandField];
  }
  return undefined;
}

function getMagicResolverInertEnvelopeKnownSpellId(
  params: BuildMagicResolverInertEnvelopeParams,
  command: unknown
): string | undefined {
  const directKnownSpellId = normalizeString(params.knownSpellId);
  if (directKnownSpellId) {
    return directKnownSpellId;
  }

  const knownSpellRef = hasOwnField(params, "knownSpellRef")
    ? params.knownSpellRef
    : isRecord(command)
      ? command.knownSpellRef
      : undefined;

  if (!isRecord(knownSpellRef)) {
    return undefined;
  }

  const refType = normalizeString(knownSpellRef.refType);
  if (refType === "known_spell_id") {
    return normalizeString(knownSpellRef.knownSpellId) ?? undefined;
  }
  if (refType === "known_spell_record" && isRecord(knownSpellRef.record)) {
    return normalizeString(knownSpellRef.record.knownSpellId) ?? undefined;
  }
  return undefined;
}

function summarizeMagicResolverInertEnvelopeReadiness(
  readiness: MagicCastReadinessResult | undefined
): MagicResolverInertEnvelopeReadinessSummary {
  const details = readiness?.details;

  return {
    ...(readiness ? { ready: readiness.ready } : {}),
    ...(details?.spellId ? { spellId: details.spellId } : {}),
    ...(details?.characterId ? { characterId: details.characterId } : {}),
    ...(details?.compatibilityStatus ? { compatibilityStatus: details.compatibilityStatus } : {}),
    ...(details?.availableKnownSpellId ? { availableKnownSpellId: details.availableKnownSpellId } : {}),
    ...(details?.blockedKnownSpellId ? { blockedKnownSpellId: details.blockedKnownSpellId } : {}),
    blockerIds: readiness?.blockers.map((blocker) => blocker.id) ?? [],
    unsupportedResolutionHooks: [...(details?.unsupportedResolutionHooks ?? [])],
    unsupportedItemGenerationHookIds: [...(details?.unsupportedItemGenerationHookIds ?? [])]
  };
}

export function buildMagicResolverInertEnvelope(
  params: BuildMagicResolverInertEnvelopeParams
): MagicResolverInertEnvelope {
  const command = params.command;
  const resolverReadiness = params.resolverReadiness;
  const readiness = params.readinessResult ?? resolverReadiness?.readiness;
  const resolverIssues = resolverReadiness?.issues ?? (Array.isArray(params.resolverIssues) ? params.resolverIssues : []);
  const resolverRequestId =
    normalizeString(params.resolverRequestId) ?? normalizeString(resolverReadiness?.resolverRequestId) ?? undefined;
  const commandId =
    normalizeString(getMagicResolverInertEnvelopeValue(params, "commandId", command, "commandId")) ??
    normalizeString(resolverReadiness?.commandId) ??
    undefined;
  const spellId = normalizeString(getMagicResolverInertEnvelopeValue(params, "spellId", command, "spellId")) ?? undefined;
  const casterCharacterId =
    normalizeString(getMagicResolverInertEnvelopeValue(params, "casterCharacterId", command, "casterCharacterId")) ??
    undefined;
  const knownSpellId = getMagicResolverInertEnvelopeKnownSpellId(params, command);
  const targetDescriptor = getMagicResolverInertEnvelopeValue(params, "targetDescriptor", command, "target");
  const conduitDescriptor = getMagicResolverInertEnvelopeValue(params, "conduitDescriptor", command, "conduitSource");
  const catalystDescriptor = getMagicResolverInertEnvelopeValue(params, "catalystDescriptor", command, "catalystSource");
  const runtimePolicyRef = normalizeString(params.runtimePolicyRef) ?? undefined;
  const readinessSummary = summarizeMagicResolverInertEnvelopeReadiness(readiness);
  const blockerSummary: MagicResolverInertEnvelopeBlockerSummary = {
    blocked: Boolean(resolverReadiness?.blocked) || readinessSummary.blockerIds.length > 0 || resolverIssues.length > 0,
    readinessBlockerIds: [...readinessSummary.blockerIds],
    resolverIssueCodes: resolverIssues.map((issue) => issue.code),
    ...(params.blockerSummary !== undefined ? { providedBlockerSummary: params.blockerSummary } : {})
  };

  return {
    envelopeKind: "magic_resolver_inert_envelope",
    mode: "planning_only",
    ...(resolverRequestId ? { resolverRequestId } : {}),
    ...(commandId ? { commandId } : {}),
    ...(spellId ? { spellId } : {}),
    ...(casterCharacterId ? { casterCharacterId } : {}),
    ...(knownSpellId ? { knownSpellId } : {}),
    ...(targetDescriptor !== undefined ? { targetDescriptor } : {}),
    ...(conduitDescriptor !== undefined ? { conduitDescriptor } : {}),
    ...(catalystDescriptor !== undefined ? { catalystDescriptor } : {}),
    readinessSummary,
    blockerSummary,
    ...(runtimePolicyRef ? { runtimePolicyRef } : {}),
    ...(params.plannedCostSummary !== undefined ? { plannedCostSummary: params.plannedCostSummary } : {}),
    ...(params.plannedCatalystSummary !== undefined ? { plannedCatalystSummary: params.plannedCatalystSummary } : {}),
    ...(params.plannedFailurePolicySummary !== undefined
      ? { plannedFailurePolicySummary: params.plannedFailurePolicySummary }
      : {}),
    ...(params.plannedHookSummary !== undefined ? { plannedHookSummary: params.plannedHookSummary } : {}),
    ...(params.plannedNarrativeSummary !== undefined ? { plannedNarrativeSummary: params.plannedNarrativeSummary } : {}),
    deferredEffectFamilies: normalizeStringArray(params.deferredEffectFamilies) ?? [],
    ...(params.diagnostics !== undefined ? { diagnostics: params.diagnostics } : {}),
    safetyFlags: { ...MAGIC_RESOLVER_INERT_ENVELOPE_SAFETY_FLAGS }
  };
}

function deriveKnownSpellIdFromTrainingEvent(
  characterId: string,
  spellId: string,
  trainingEventId: string
): string {
  return `known-spell.${characterId}.${spellId}.${trainingEventId}`;
}

function collectDuplicateKnownSpellIdIndexes(
  records: unknown,
  knownSpellId: string
): number[] {
  if (!Array.isArray(records)) {
    return [];
  }

  const indexes: number[] = [];
  for (const [index, record] of records.entries()) {
    if (getKnownSpellIdForIssue(record) === knownSpellId) {
      indexes.push(index);
    }
  }
  return indexes;
}

function mapTrainingEventEvidenceIssueToAcquisitionIssue(
  issue: KnownSpellTrainingEventEvidenceValidationIssue
): KnownSpellTrainingEventAcquisitionIssue {
  const code: KnownSpellTrainingEventAcquisitionIssueCode =
    issue.code === "missing_training_event_id" || issue.code === "missing_training_event_source"
      ? "missing_training_event_evidence"
      : "unsupported_training_event_evidence";

  return createTrainingEventAcquisitionIssue(
    code,
    issue.field === "trainingEventEvidence" ? "trainingEventEvidence" : `trainingEventEvidence.${issue.field}`,
    issue.message
  );
}

function validateTrainingEventAcquisitionEvidence(
  params: ValidateKnownSpellTrainingEventAcquisitionParams
): {
  evidence: KnownSpellTrainingEventEvidence | null;
  issues: KnownSpellTrainingEventAcquisitionIssue[];
} {
  const evidenceInput =
    params.trainingEventEvidence === undefined || params.trainingEventEvidence === null
      ? normalizeString(params.trainingEventId)
        ? {
            trainingEventId: params.trainingEventId,
            sourceType: "training_event"
          }
        : undefined
      : params.trainingEventEvidence;

  const result = validateKnownSpellTrainingEventEvidence(evidenceInput);
  if (result.ok && result.evidence) {
    return { evidence: result.evidence, issues: [] };
  }

  const hasMissingEvidence = result.issues.some(
    (issue) => issue.code === "missing_training_event_id" || issue.code === "missing_training_event_source"
  );
  const issues = result.issues
    .filter(
      (issue) => issue.code !== "missing_training_event_id" && issue.code !== "missing_training_event_source"
    )
    .map(mapTrainingEventEvidenceIssueToAcquisitionIssue);

  return {
    evidence: null,
    issues: [
      ...(hasMissingEvidence
        ? [
            createTrainingEventAcquisitionIssue(
              "missing_training_event_evidence",
              "trainingEventEvidence",
              "training_event acquisition requires evidence with trainingEventId and sourceType 'training_event'."
            )
          ]
        : []),
      ...issues
    ]
  };
}

export function validateKnownSpellTrainingEventAcquisition(
  params: ValidateKnownSpellTrainingEventAcquisitionParams
): KnownSpellTrainingEventAcquisitionResult {
  const eventId = normalizeString(params.acquisitionEventId) ?? normalizeString(params.eventId);
  const ownerScope = normalizeString(params.ownerScope) ?? "character";
  const ownerId = normalizeString(params.ownerId);
  const characterId = normalizeString(params.characterId);
  const spellId = normalizeString(params.spellId);
  const acquisitionRoute = normalizeString(params.acquisitionRoute) ?? "training_event";
  const acquiredAt = normalizeString(params.acquiredAt);
  const availability = normalizeString(params.availability) ?? "available";
  const blockedReason = normalizeString(params.blockedReason);
  const spellCatalog = Array.from(params.spellCatalog);
  const spellCatalogIds = collectKnownSpellCatalogIds(spellCatalog);
  const evidenceResult = validateTrainingEventAcquisitionEvidence(params);
  const issues: KnownSpellTrainingEventAcquisitionIssue[] = [];

  if (!eventId) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "missing_acquisition_event_id",
        "eventId",
        "training_event acquisition requires an eventId or acquisitionEventId."
      )
    );
  }

  if (ownerScope !== "character") {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "unsupported_owner_scope",
        "ownerScope",
        `Known-spell training_event acquisition ownerScope '${ownerScope}' is not supported.`
      )
    );
  }

  if (!characterId) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "missing_character_id",
        "characterId",
        "training_event acquisition requires a characterId."
      )
    );
  }

  if (!ownerId) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "missing_owner_id",
        "ownerId",
        "training_event acquisition requires an ownerId."
      )
    );
  }

  if (ownerId && characterId && ownerId !== characterId) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "owner_character_mismatch",
        "ownerId",
        "character-scoped training_event acquisition requires ownerId to match characterId."
      )
    );
  }

  if (!spellId || !spellCatalogIds.has(spellId)) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "unknown_spell_id",
        "spellId",
        spellId
          ? `training_event acquisition references unknown spellId '${spellId}'.`
          : "training_event acquisition requires a spellId from the current spell catalog."
      )
    );
  }

  if (acquisitionRoute !== "training_event") {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "unsupported_acquisition_route",
        "acquisitionRoute",
        `Known-spell acquisitionRoute '${acquisitionRoute}' is not supported by this helper boundary.`
      )
    );
  }

  issues.push(...evidenceResult.issues);

  if (!acquiredAt) {
    issues.push(
      createTrainingEventAcquisitionIssue(
        "missing_acquired_at",
        "acquiredAt",
        "training_event acquisition requires caller-supplied acquiredAt."
      )
    );
  }

  const knownSpellId =
    normalizeString(params.knownSpellId) ??
    (characterId && spellId && evidenceResult.evidence
      ? deriveKnownSpellIdFromTrainingEvent(characterId, spellId, evidenceResult.evidence.trainingEventId)
      : null);

  if (knownSpellId) {
    const duplicateIndexes = collectDuplicateKnownSpellIdIndexes(params.existingRecords, knownSpellId);
    if (duplicateIndexes.length > 0) {
      issues.push(
        createTrainingEventAcquisitionIssue(
          "duplicate_known_spell_id",
          "knownSpellId",
          `Known-spell training_event acquisition would duplicate knownSpellId '${knownSpellId}'.`,
          { knownSpellId, duplicateIndexes }
        )
      );
    }
  }

  let proposedRecord: KnownSpellRecordState | undefined;
  if (
    issues.length === 0 &&
    knownSpellId &&
    ownerId &&
    characterId &&
    spellId &&
    acquiredAt &&
    evidenceResult.evidence
  ) {
    const record: KnownSpellRecordState = {
      knownSpellId,
      ownerScope: "character",
      ownerId,
      characterId,
      spellId,
      acquisitionRoute: "training_event",
      acquiredAt,
      availability: availability as KnownSpellAvailabilityState,
      ...(blockedReason ? { blockedReason } : {}),
      trainingEventEvidence: evidenceResult.evidence
    };
    const recordValidation = validateKnownSpellRecordCollection({
      records: [record],
      spellCatalog,
      characterId
    });

    if (recordValidation.ok && recordValidation.records[0]) {
      proposedRecord = recordValidation.records[0];
    } else {
      issues.push(
        createTrainingEventAcquisitionIssue(
          "invalid_known_spell_record",
          "proposedRecord",
          "The normalized training_event acquisition record failed known-spell validation.",
          {
            knownSpellId,
            recordIssues: recordValidation.issues.flatMap((issue) => issue.recordIssues ?? [])
          }
        )
      );
    }
  }

  if (issues.length > 0 || !proposedRecord || !eventId || !evidenceResult.evidence) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    issues: [],
    acquisition: {
      eventId,
      ownerScope: "character",
      ownerId: proposedRecord.ownerId,
      characterId: proposedRecord.characterId,
      spellId: proposedRecord.spellId,
      trainingEventId: evidenceResult.evidence.trainingEventId,
      acquiredAt: proposedRecord.acquiredAt,
      acquisitionRoute: "training_event",
      evidenceSource: evidenceResult.evidence,
      validationStatus: "valid"
    },
    proposedRecord
  };
}

export function buildKnownSpellRecordFromTrainingEvent(
  params: BuildKnownSpellRecordFromTrainingEventParams
): KnownSpellTrainingEventAcquisitionResult {
  return validateKnownSpellTrainingEventAcquisition(params);
}

export function createKnownSpellRecord(
  params: CreateKnownSpellRecordParams
): KnownSpellValidationResult {
  const record: KnownSpellRecordState = {
    knownSpellId: params.knownSpellId,
    ownerScope: "character",
    ownerId: params.ownerId,
    characterId: params.characterId,
    spellId: params.spellId,
    acquisitionRoute: "training_event",
    acquiredAt: params.acquiredAt,
    availability: params.availability ?? "available",
    ...(params.blockedReason ? { blockedReason: params.blockedReason } : {}),
    ...(params.trainingEventEvidence ? { trainingEventEvidence: params.trainingEventEvidence } : {})
  };

  return validateKnownSpellRecord({
    record,
    spellCatalog: params.spellCatalog,
    characterId: params.characterId
  });
}

export function characterKnowsSpell(params: CharacterKnowsSpellParams): boolean {
  const characterId = normalizeString(params.characterId);
  const spellId = normalizeString(params.spellId);
  if (!characterId || !spellId) {
    return false;
  }

  const spellCatalogIds = collectKnownSpellCatalogIds(params.spellCatalog);
  if (!spellCatalogIds.has(spellId)) {
    return false;
  }

  for (const record of params.records) {
    const result = validateKnownSpellRecordWithCatalog(record, spellCatalogIds, characterId);
    if (
      result.ok &&
      result.record?.characterId === characterId &&
      result.record.spellId === spellId &&
      result.record.availability === "available"
    ) {
      return true;
    }
  }

  return false;
}
