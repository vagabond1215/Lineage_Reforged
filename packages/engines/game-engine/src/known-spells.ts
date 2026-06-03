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

function classifyMagicCastReadinessHook(
  hookId: string,
  map: Readonly<Record<string, MagicCastReadinessHookClassification>> | undefined,
  runtimeHooks: ReadonlySet<string>,
  classifierHooks: ReadonlySet<string>,
  supportedHooks: ReadonlySet<string>,
  deferredHooks: ReadonlySet<string>,
  unsupportedHooks: ReadonlySet<string>
): MagicCastReadinessHookClassification {
  const mappedClassification = normalizeHookClassification(map?.[hookId]);
  if (mappedClassification) {
    return mappedClassification;
  }
  if (runtimeHooks.has(hookId)) {
    return "runtime";
  }
  if (classifierHooks.has(hookId)) {
    return "classifier";
  }
  if (supportedHooks.has(hookId)) {
    return "supported";
  }
  if (deferredHooks.has(hookId)) {
    return "deferred";
  }
  if (unsupportedHooks.has(hookId)) {
    return "unsupported";
  }
  return "unknown";
}

function isSupportedMagicCastReadinessHook(
  classification: MagicCastReadinessHookClassification
): boolean {
  return classification === "runtime" || classification === "classifier" || classification === "supported";
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
  const runtimeResolutionHooks = collectStrings(hookSupport?.runtimeResolutionHooks);
  const classifierResolutionHooks = collectStrings(hookSupport?.classifierResolutionHooks);
  const supportedResolutionHooks = collectStrings(hookSupport?.supportedResolutionHooks);
  const deferredResolutionHooks = collectStrings(hookSupport?.deferredResolutionHooks);
  const unsupportedResolutionHooks = collectStrings(hookSupport?.unsupportedResolutionHooks);
  const runtimeItemGenerationHookIds = collectStrings(hookSupport?.runtimeItemGenerationHookIds);
  const classifierItemGenerationHookIds = collectStrings(hookSupport?.classifierItemGenerationHookIds);
  const supportedItemGenerationHookIds = collectStrings(hookSupport?.supportedItemGenerationHookIds);
  const deferredItemGenerationHookIds = collectStrings(hookSupport?.deferredItemGenerationHookIds);
  const unsupportedItemGenerationHookIds = collectStrings(hookSupport?.unsupportedItemGenerationHookIds);

  const unsupportedResolutionHookIds: string[] = [];
  for (const hook of normalizeStringArray(spellRecord?.resolutionHooks) ?? []) {
    const classification = classifyMagicCastReadinessHook(
      hook,
      hookSupport?.resolutionHooks,
      runtimeResolutionHooks,
      classifierResolutionHooks,
      supportedResolutionHooks,
      deferredResolutionHooks,
      unsupportedResolutionHooks
    );
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
    const classification = classifyMagicCastReadinessHook(
      hookId,
      hookSupport?.itemGenerationHooks,
      runtimeItemGenerationHookIds,
      classifierItemGenerationHookIds,
      supportedItemGenerationHookIds,
      deferredItemGenerationHookIds,
      unsupportedItemGenerationHookIds
    );
    if (!isSupportedMagicCastReadinessHook(classification)) {
      unsupportedGeneratedItemIds.push(hookId);
    }
  }

  return {
    unsupportedResolutionHooks: unsupportedResolutionHookIds,
    unsupportedItemGenerationHookIds: unsupportedGeneratedItemIds
  };
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
