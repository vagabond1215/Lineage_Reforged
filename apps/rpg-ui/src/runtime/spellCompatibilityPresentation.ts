import spellCatalogData from '../../../../packages/content/base/player/spells.json' with { type: 'json' };
import type { DetailEntry, DetailGroup, ListItem, TagTone } from '../types.js';

export const ARCANE_COMPENDIUM_CATEGORY = 'spells';
export const ARCANE_COMPENDIUM_LABEL = 'Arcane Compendium';

type SpellCompatibilityStatus = 'ready' | 'partial' | 'deferred' | 'placeholder';
type HookClassification = 'runtime' | 'classifier' | 'deferred' | 'unknown';

type RequiredTags = {
  all?: string[];
  any?: string[][];
};

type CompatibilityProfile = {
  requiredTags?: RequiredTags;
  preferredTags?: string[];
  discouragedTags?: string[];
  freecastAllowed?: boolean;
  catalystFamilies?: string[];
  catalystTiers?: string[];
  notes?: string;
};

type SpellItemGenerationHook = {
  generatedItemId?: string;
  generatedItemName?: string;
};

type SpellRecord = {
  id: string;
  compatibilityStatus: SpellCompatibilityStatus;
  primaryFamily: string;
  name: string;
  school?: string;
  tradition?: string;
  discipline?: string;
  element?: string;
  compatibilityProfile?: CompatibilityProfile;
  resolutionHooks?: string[];
  itemGenerationHooks?: SpellItemGenerationHook[];
  description?: string;
};

type SpellCatalog = {
  records: SpellRecord[];
};

type HookSummary = {
  runtime: string[];
  classifier: string[];
  deferred: string[];
  unknown: string[];
  itemGenerationDeferred: string[];
  itemGenerationUnknown: string[];
};

const spellCatalog = spellCatalogData as SpellCatalog;

const RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS = new Set([
  'damage.magic',
  'damage.ranged',
  'heal.hp',
  'interrupt.primary',
  'status.bind',
  'status.stagger',
  'buff.protect',
  'buff.ward',
  'buff.anthem',
  'mobility.shadow_step',
  'support.berry'
]);

const CLASSIFIER_SPELL_RESOLUTION_HOOKS = new Set([
  'school.control',
  'school.elemental',
  'school.enfeebling',
  'school.enhancing',
  'school.healing',
  'school.ranged',
  'school.utility',
  'tradition.druidic',
  'discipline.ninjutsu',
  'discipline.performance',
  'element.air',
  'element.earth',
  'element.fire',
  'element.ice',
  'element.light',
  'element.lightning',
  'element.shadow',
  'element.water'
]);

const DEFERRED_SPELL_RESOLUTION_HOOKS = new Set([
  'buff.bless',
  'buff.charge',
  'buff.ember_spikes',
  'buff.grace',
  'buff.haste',
  'buff.haze',
  'buff.march',
  'buff.preserve',
  'buff.regeneration',
  'buff.thornskin',
  'buff.veil',
  'buff.war_song',
  'buff.warmth',
  'buff.waterbreath',
  'debuff.blind',
  'debuff.curse',
  'debuff.dirge',
  'debuff.discord',
  'debuff.soaked',
  'field.smoke',
  'restore.mp',
  'restore.stamina',
  'status.burn',
  'status.slow',
  'utility.mirror',
  'utility.speak_beast',
  'utility.speak_plant'
]);

const DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS = new Set(['generated_item.druidic.berry']);

export function classifyArcaneCompendiumHook(hook: string): HookClassification {
  if (RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS.has(hook)) {
    return 'runtime';
  }
  if (CLASSIFIER_SPELL_RESOLUTION_HOOKS.has(hook)) {
    return 'classifier';
  }
  if (DEFERRED_SPELL_RESOLUTION_HOOKS.has(hook)) {
    return 'deferred';
  }
  return 'unknown';
}

export function getArcaneCompendiumEntries(): ListItem[] {
  return buildArcaneCompendiumEntries(spellCatalog.records);
}

export function buildArcaneCompendiumEntries(records: SpellRecord[]): ListItem[] {
  return records.map(mapSpellRecordToCompendiumEntry);
}

function mapSpellRecordToCompendiumEntry(record: SpellRecord): ListItem {
  const hookSummary = summarizeHooks(record);
  const warnings = buildWarnings(record, hookSummary);
  const profile = record.compatibilityProfile;
  const tags = buildSearchTags(record);

  return {
    id: record.id,
    title: record.name,
    subtitle: [formatId(record.primaryFamily), formatId(record.school)].filter(Boolean).join(' | '),
    meta: formatCompatibilityStatus(record.compatibilityStatus),
    status: formatCompatibilityStatus(record.compatibilityStatus),
    ...(record.description ? { description: record.description } : {}),
    tags,
    category: ARCANE_COMPENDIUM_CATEGORY,
    detailTitle: `${record.name} - Compatibility`,
    detailSummary:
      'Read-only Arcane Compendium reference. This entry does not create player spell state, loadouts, command buttons, or runtime effects.',
    detailGroups: [
      buildIdentityGroup(record),
      buildCompatibilityGroup(record, profile),
      buildHookGroup(hookSummary),
      buildWarningGroup(warnings)
    ].filter((group) => group.entries.length > 0)
  };
}

function buildSearchTags(record: SpellRecord): string[] {
  const profileTags = collectCompatibilityTags(record.compatibilityProfile);
  return uniqueStrings([
    ARCANE_COMPENDIUM_LABEL,
    formatCompatibilityStatus(record.compatibilityStatus),
    record.compatibilityStatus,
    record.primaryFamily,
    record.school,
    record.tradition,
    record.discipline,
    record.element,
    ...profileTags,
    ...(record.resolutionHooks ?? []),
    ...(record.itemGenerationHooks ?? []).map((hook) => hook.generatedItemId)
  ]);
}

function buildIdentityGroup(record: SpellRecord): DetailGroup {
  return {
    title: 'Identity',
    entries: [
      detailEntry('Spell Id', record.id),
      detailEntry('Primary Family', formatId(record.primaryFamily)),
      detailEntry('School', formatId(record.school)),
      detailEntry('Tradition', formatId(record.tradition)),
      detailEntry('Discipline', formatId(record.discipline)),
      detailEntry('Element', formatId(record.element))
    ]
  };
}

function buildCompatibilityGroup(record: SpellRecord, profile: CompatibilityProfile | undefined): DetailGroup {
  const tagGroups = collectCompatibilityTagGroups(profile);
  const entries: DetailEntry[] = [
    detailEntry('Compatibility', formatCompatibilityStatus(record.compatibilityStatus), statusTone(record.compatibilityStatus)),
    detailEntry('Profile Summary', profile ? summarizeProfile(profile) : 'No compatibility profile'),
    detailEntry('Required Tags', summarizeRequiredTags(profile?.requiredTags)),
    detailEntry('Preferred Tags', formatTagList(profile?.preferredTags)),
    detailEntry('Discouraged Tags', formatTagList(profile?.discouragedTags)),
    detailEntry('Range Tags', formatTagList(tagGroups.range)),
    detailEntry('Delivery Tags', formatTagList(tagGroups.delivery)),
    detailEntry('Cast Tags', formatTagList(tagGroups.cast)),
    detailEntry('Control Tags', formatTagList(tagGroups.control)),
    detailEntry('Power Tags', formatTagList(tagGroups.power)),
    detailEntry('Catalyst Families', formatTagList(profile?.catalystFamilies)),
    detailEntry('Catalyst Tiers', formatTagList(profile?.catalystTiers)),
    detailEntry('Profile Notes', profile?.notes ?? 'None')
  ];

  return {
    title: 'Compatibility',
    entries
  };
}

function buildHookGroup(summary: HookSummary): DetailGroup {
  return {
    title: 'Hook Summary',
    entries: [
      detailEntry('Runtime Hooks', formatTagList(summary.runtime), summary.runtime.length > 0 ? 'accent' : 'neutral'),
      detailEntry('Classifier Hooks', formatTagList(summary.classifier)),
      detailEntry('Deferred Hooks', formatTagList(summary.deferred), summary.deferred.length > 0 ? 'warning' : 'neutral'),
      detailEntry('Unknown Hooks', formatTagList(summary.unknown), summary.unknown.length > 0 ? 'danger' : 'neutral'),
      detailEntry(
        'Deferred Item Generation',
        formatTagList(summary.itemGenerationDeferred),
        summary.itemGenerationDeferred.length > 0 ? 'warning' : 'neutral'
      ),
      detailEntry(
        'Unknown Item Generation',
        formatTagList(summary.itemGenerationUnknown),
        summary.itemGenerationUnknown.length > 0 ? 'danger' : 'neutral'
      )
    ]
  };
}

function buildWarningGroup(warnings: string[]): DetailGroup {
  return {
    title: 'Warnings',
    entries: warnings.map((warning) => detailEntry('Warning', warning, warning.startsWith('Runtime blocked') ? 'danger' : 'warning'))
  };
}

function summarizeHooks(record: SpellRecord): HookSummary {
  const summary: HookSummary = {
    runtime: [],
    classifier: [],
    deferred: [],
    unknown: [],
    itemGenerationDeferred: [],
    itemGenerationUnknown: []
  };

  for (const hook of record.resolutionHooks ?? []) {
    summary[classifyArcaneCompendiumHook(hook)].push(hook);
  }

  for (const hook of record.itemGenerationHooks ?? []) {
    const hookId = hook.generatedItemId;
    if (!hookId) {
      summary.itemGenerationUnknown.push('missing generatedItemId');
      continue;
    }
    if (DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS.has(hookId)) {
      summary.itemGenerationDeferred.push(hookId);
      continue;
    }
    summary.itemGenerationUnknown.push(hookId);
  }

  return summary;
}

function buildWarnings(record: SpellRecord, summary: HookSummary): string[] {
  const warnings: string[] = [];

  if (record.compatibilityStatus === 'partial') {
    warnings.push('Partial support: compatibility metadata is visible, but at least one behavior remains blocked.');
  }

  if (record.compatibilityStatus === 'deferred' || record.compatibilityStatus === 'placeholder') {
    warnings.push('Deferred behavior: this record is reference-only until compatibility and runtime ownership are defined.');
  }

  if (summary.deferred.length > 0) {
    warnings.push(`Runtime blocked: deferred hooks ${formatTagList(summary.deferred)}.`);
  }

  if (summary.itemGenerationDeferred.length > 0) {
    warnings.push(`Runtime blocked: deferred item generation ${formatTagList(summary.itemGenerationDeferred)}.`);
  }

  if (summary.unknown.length > 0 || summary.itemGenerationUnknown.length > 0) {
    warnings.push(
      `Runtime blocked: unknown hook metadata ${formatTagList([
        ...summary.unknown,
        ...summary.itemGenerationUnknown
      ])}.`
    );
  }

  if (!record.compatibilityProfile) {
    warnings.push('Compatibility: no compatibility profile is present yet.');
  }

  return warnings;
}

function collectCompatibilityTags(profile: CompatibilityProfile | undefined): string[] {
  if (!profile) {
    return [];
  }

  return uniqueStrings([
    ...(profile.requiredTags?.all ?? []),
    ...(profile.requiredTags?.any ?? []).flat(),
    ...(profile.preferredTags ?? []),
    ...(profile.discouragedTags ?? []),
    ...(profile.catalystFamilies ?? []),
    ...(profile.catalystTiers ?? [])
  ]);
}

function collectCompatibilityTagGroups(profile: CompatibilityProfile | undefined): Record<string, string[]> {
  const tags = collectCompatibilityTags(profile);
  return {
    range: tags.filter((tag) => tag.startsWith('range.')),
    delivery: tags.filter((tag) => tag.startsWith('delivery.')),
    cast: tags.filter((tag) => tag.startsWith('cast.')),
    control: tags.filter((tag) => tag.startsWith('control.')),
    power: tags.filter((tag) => tag.startsWith('power.'))
  };
}

function summarizeProfile(profile: CompatibilityProfile): string {
  const parts = [
    profile.freecastAllowed === true ? 'freecast metadata allowed' : 'freecast metadata not marked',
    profile.catalystFamilies?.length ? `catalysts: ${formatTagList(profile.catalystFamilies)}` : 'no catalyst family metadata'
  ];
  return parts.join('; ');
}

function summarizeRequiredTags(requiredTags: RequiredTags | undefined): string {
  const parts: string[] = [];
  if (requiredTags?.all?.length) {
    parts.push(`all: ${formatTagList(requiredTags.all)}`);
  }
  if (requiredTags?.any?.length) {
    parts.push(`any: ${requiredTags.any.map((group) => group.join(' or ')).join('; ')}`);
  }
  return parts.length > 0 ? parts.join(' | ') : 'None';
}

function formatCompatibilityStatus(status: SpellCompatibilityStatus): string {
  switch (status) {
    case 'ready':
      return 'Compatibility ready';
    case 'partial':
      return 'Partial support';
    case 'deferred':
    case 'placeholder':
      return 'Deferred behavior';
    default:
      return 'Deferred behavior';
  }
}

function statusTone(status: SpellCompatibilityStatus): TagTone {
  switch (status) {
    case 'ready':
      return 'success';
    case 'partial':
      return 'warning';
    case 'deferred':
    case 'placeholder':
      return 'danger';
    default:
      return 'neutral';
  }
}

function detailEntry(label: string, value: string | number | boolean | null | undefined, tone?: TagTone): DetailEntry {
  return {
    label,
    value: formatValue(value),
    ...(tone ? { tone } : {})
  };
}

function formatTagList(tags: readonly (string | undefined)[] | undefined): string {
  const cleanTags = uniqueStrings(tags ?? []);
  return cleanTags.length > 0 ? cleanTags.join(', ') : 'None';
}

function formatValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'None';
  }
  return String(value);
}

function formatId(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return value
    .split(/[._]/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function uniqueStrings(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === 'string' && value.length > 0))];
}
