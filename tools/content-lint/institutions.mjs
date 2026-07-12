const INSTITUTION_ID_PATTERN = /^institution\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

const REQUIRED_FIELDS = [
  "id",
  "slug",
  "name",
  "status",
  "category",
  "publicPosture",
  "summary",
  "sourceAuthorityNotes",
  "notes"
];

const ALLOWED_FIELDS = new Set(REQUIRED_FIELDS);
const STATUSES = new Set(["planned", "active", "retired"]);
const CATEGORIES = new Set([
  "civic",
  "administrative",
  "judicial",
  "scholarly",
  "charitable",
  "educational",
  "archival",
  "medical",
  "other"
]);
const PUBLIC_POSTURES = new Set(["public", "semi_public", "secret", "unknown"]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateTrimmedString(value, valuePath, issues) {
  if (typeof value !== "string") {
    issues.push(`${valuePath} must be a string`);
    return;
  }
  if (value.trim().length === 0) {
    issues.push(`${valuePath} must be non-empty`);
  } else if (value !== value.trim()) {
    issues.push(`${valuePath} must not contain leading or trailing whitespace`);
  }
}

function validateStringList(value, valuePath, { minItems = 0 } = {}, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${valuePath} must be an array`);
    return;
  }
  if (value.length < minItems) {
    issues.push(`${valuePath} must contain at least ${minItems} item${minItems === 1 ? "" : "s"}`);
  }

  const seen = new Set();
  value.forEach((entry, index) => {
    const entryPath = `${valuePath}[${index}]`;
    validateTrimmedString(entry, entryPath, issues);
    if (typeof entry === "string") {
      const key = entry.trim();
      if (seen.has(key)) {
        issues.push(`${valuePath} must contain unique items`);
      }
      seen.add(key);
    }
  });
}

function validateRecord(record, index, issues) {
  const recordPath = `records[${index}]`;
  if (!isObject(record)) {
    issues.push(`${recordPath} must be an object`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!Object.hasOwn(record, field)) {
      issues.push(`${recordPath} is missing required field '${field}'`);
    }
  }
  for (const field of Object.keys(record)) {
    if (!ALLOWED_FIELDS.has(field)) {
      issues.push(`${recordPath} has unknown field '${field}'`);
    }
  }

  if (Object.hasOwn(record, "id")) {
    if (typeof record.id !== "string" || !INSTITUTION_ID_PATTERN.test(record.id)) {
      issues.push(`${recordPath}.id must match ^institution\\.[a-z0-9]+(?:_[a-z0-9]+)*$`);
    }
  }
  if (Object.hasOwn(record, "slug")) {
    if (typeof record.slug !== "string" || !SLUG_PATTERN.test(record.slug)) {
      issues.push(`${recordPath}.slug must match ^[a-z0-9]+(?:_[a-z0-9]+)*$`);
    }
  }
  if (
    typeof record.id === "string" &&
    typeof record.slug === "string" &&
    INSTITUTION_ID_PATTERN.test(record.id) &&
    SLUG_PATTERN.test(record.slug) &&
    record.id !== `institution.${record.slug}`
  ) {
    issues.push(`${recordPath}.id must equal institution.${record.slug}`);
  }

  if (Object.hasOwn(record, "name")) {
    validateTrimmedString(record.name, `${recordPath}.name`, issues);
  }
  if (Object.hasOwn(record, "summary")) {
    validateTrimmedString(record.summary, `${recordPath}.summary`, issues);
  }
  if (Object.hasOwn(record, "status") && !STATUSES.has(record.status)) {
    issues.push(`${recordPath}.status must be one of planned, active, retired`);
  }
  if (Object.hasOwn(record, "category") && !CATEGORIES.has(record.category)) {
    issues.push(`${recordPath}.category must be a supported institution category`);
  }
  if (Object.hasOwn(record, "publicPosture") && !PUBLIC_POSTURES.has(record.publicPosture)) {
    issues.push(`${recordPath}.publicPosture must be one of public, semi_public, secret, unknown`);
  }
  if (Object.hasOwn(record, "sourceAuthorityNotes")) {
    validateStringList(record.sourceAuthorityNotes, `${recordPath}.sourceAuthorityNotes`, { minItems: 1 }, issues);
  }
  if (Object.hasOwn(record, "notes")) {
    validateStringList(record.notes, `${recordPath}.notes`, {}, issues);
  }
}

export function validateInstitutions(wrapper, options = {}) {
  const relativePath = options.relativePath ?? "packages/content/base/civilization/institutions.json";
  const issues = [];

  if (!isObject(wrapper)) {
    return [`${relativePath} wrapper must be an object`];
  }

  if (!Object.hasOwn(wrapper, "records")) {
    issues.push(`${relativePath} wrapper is missing required field 'records'`);
  }
  for (const field of Object.keys(wrapper)) {
    if (field !== "records") {
      issues.push(`${relativePath} wrapper has unknown field '${field}'`);
    }
  }
  if (!Object.hasOwn(wrapper, "records")) {
    return issues;
  }
  if (!Array.isArray(wrapper.records)) {
    issues.push(`${relativePath} records must be an array`);
    return issues;
  }

  wrapper.records.forEach((record, index) => validateRecord(record, index, issues));

  const ids = new Map();
  const slugs = new Map();
  wrapper.records.forEach((record, index) => {
    if (!isObject(record)) {
      return;
    }
    if (typeof record.id === "string") {
      if (ids.has(record.id)) {
        issues.push(`records[${index}].id duplicates '${record.id}' from records[${ids.get(record.id)}]`);
      } else {
        ids.set(record.id, index);
      }
    }
    if (typeof record.slug === "string") {
      if (slugs.has(record.slug)) {
        issues.push(`records[${index}].slug duplicates '${record.slug}' from records[${slugs.get(record.slug)}]`);
      } else {
        slugs.set(record.slug, index);
      }
    }
  });

  return issues;
}
