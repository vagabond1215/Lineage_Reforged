import {
  type AccountProfileState,
  type CivilizationState,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type EquipmentState,
  type GeographicKnowledgeScope,
  type InventoryStack,
  type PlayerAttributeKey,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerSkillState,
  type PlayerTraitState,
  type SaveSnapshot,
  type SimulationClock,
  type WorldState,
  type WorldLocationType
} from '../../../../packages/shared/types/src/index.js';
import {
  createDefaultPlayerBodyState,
  createDefaultPlayerStatGrowthState,
  createRunDifficultyState,
  createPlayerProgressionState,
  syncPlayerRuntimeState
} from '../../../../packages/engines/player-engine/src/index.js';
import {
  createAuthorityId,
  initializeTargetCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/campaign-rules.js';
import {
  createDefaultCharacterAchievementsState
} from '../../../../packages/engines/game-engine/src/account-achievement-state.js';
import {
  DEFAULT_ACCOUNT_ID
} from '../../../../packages/engines/game-engine/src/legacy-account.js';
import {
  resolveLegacyCharacterStartBonuses,
  resolveLegacyStarterSkillPolicy,
  type LegacyStarterSkillPolicyResolution
} from '../../../../packages/engines/game-engine/src/legacy-unlocks.js';
import { createInitialClock } from '../../../../packages/shared/time/src/index.js';
import {
  hasCompleteCharacterCreationSelections,
  validateCharacterCreationForm,
  type CharacterCreationFormState,
  type CompleteCharacterCreationFormState
} from './characterCreationForm.js';
import { CHARACTER_ATTRIBUTE_ORDER } from './characterAttributes.js';
import {
  getBackstoryTemplate,
  getAgeBandAttributeAdjustments,
  getBackstoryAttributeAdjustments,
  formatAgeBandModifierLine,
  formatHeightBandModifierLine,
  getHeightBandAttributeAdjustments,
  getIdentityOptionLabel,
  getFocusLabel,
  getLineageBaseAttributes,
  getNatureLabel,
  getPhysiqueLabel,
  getRepresentativeHeightCm,
  getSexOptionForLineage,
  getSexAttributeAdjustments,
  resolveCanonicalAgeBandId,
  resolveCanonicalFocusId,
  resolveCanonicalNatureId,
  resolveCanonicalPhysiqueId,
  getStartingAbilityStates,
  getStartingBundleSelectedStacks,
  getStartingBundleTemplate,
  isKnownBackstoryId,
  isKnownStartingBundleId
} from './characterCreationCatalog.js';
import { resolveCharacterCreationAttributes } from './characterCreationMath.js';
import {
  applyLegacyPreparationBonuses,
  type LegacyPreparationReviewEntry
} from './legacyPreparationApplication.js';
import { resolveWorldSelection } from './worldSelectionCatalog.js';
import { fillCoreResourcesToMax } from './newGameResourceInitialization.js';

const CURRENT_SNAPSHOT_VERSION = 'lineage.save_snapshot.v2';

function createDefaultPlayerCombatProfile() {
  return { preferredMode: 'normal' as const, memberPreferences: [] };
}

function createDefaultNewGameClock(): SimulationClock {
  return createInitialClock();
}

function createDefaultGameState() {
  return {
    worldVersion: '0.1.0',
    activeScenario: 'bootstrap',
    runDifficulty: createRunDifficultyState(),
    mode: { id: 'normal' as const, combatPauseAllowed: true },
    party: { leaderCombatantId: null, members: [] },
    activeEncounter: null,
    combatHistory: []
  };
}

function createDefaultNewGameWorldState(regionId: string): WorldState {
  return {
    activeRegions: [regionId],
    weatherState: {}
  };
}

function createDefaultNewGameCivilizationState(tick: number): CivilizationState {
  return {
    settlements: [],
    markets: [],
    economy: {
      nodes: [],
      lastSnapshots: [],
      lastLevelTotals: [],
      marketStates: [],
      lastComputedTick: tick
    },
    transport: {
      caravans: [],
      stockAdjustments: [],
      nextCaravanOrdinal: 1,
      assetReservations: [],
      lastEvaluatedOpportunities: [],
      lastProcessedTick: tick
    },
    quests: {
      activeOffers: [],
      lastGeneratedTick: tick
    }
  };
}

function createEmptySessionState() {
  return {
    activeEvents: [],
    flags: [],
    triggers: [],
    completedEvents: [],
    trackedQuestId: null,
    currentActivity: null,
    pinnedRecordIds: [],
    notifications: [],
    knownLocations: [],
    worldRecords: [],
    activityRecords: [],
    operations: [],
    codexEntries: [],
    questJournal: [],
    chronicle: [],
    combatUi: {
      selectedPartyMemberId: null,
      selectedEnemyTargetId: null,
      stagedCommand: null,
      lastIssuedCommand: null
    }
  };
}

type DerivedCharacterCreationState = {
  backstoryLabel: string | null;
  lineageLabel: string;
  startingBundleLabel: string;
  startingContinentLabel: string;
  startingSettlementLabel: string;
  startingRegionLabel: string;
  startingAccessLabel: string;
  startingAccessDetail: string;
  chosenOriginLabel: string;
  reviewNarrative: string;
  attributes: PlayerAttributes;
  generatedProfileMetrics: CharacterCreationPreviewMetric[];
  resources: { hp: number; mp: number; stamina: number };
  loreLabels: string[];
  currency: PlayerCurrencyState;
  gearLabels: string[];
  starterPackLabels: string[];
  legacyPreparations: LegacyPreparationReviewEntry[];
  appliedLegacyPreparationIds: string[];
  appliedLegacyPreparationChoices: Record<string, string>;
  starterSkillPolicyLabels: string[];
  starterSkillLabels: string[];
  starterTraitLabels: string[];
  starterNotes: string[];
  snapshot: SaveSnapshot;
};

export type CharacterCreationPreviewOptions = {
  appliedLegacyPreparationIds?: string[];
  appliedLegacyPreparationChoices?: Record<string, string>;
  accountProfile?: AccountProfileState | null;
  hasSelectableBackstories?: boolean;
  sourceRunId?: string;
  crossLineageStart?: boolean;
};

type CharacterCreationPreviewMetric = { id: string; label: string; value: string | null };

export type CharacterCreationAttributePreviewContribution = {
  id: string;
  label: string;
  value: number;
};

export type CharacterCreationAttributePreviewRow = {
  id: PlayerAttributeKey;
  label: PlayerAttributeKey;
  totalValue: number | null;
  contributions: CharacterCreationAttributePreviewContribution[];
};

export type CharacterCreationPreview = {
  isResolved: boolean;
  characterName: string;
  chosenOrigin: string;
  lineageLabel: string | null;
  backstoryLabel: string | null;
  startingBundleLabel: string | null;
  startingContinent: string | null;
  startingSettlement: string | null;
  startingRegion: string | null;
  startingAccessLabel: string;
  startingAccessDetail: string;
  identityMetrics: CharacterCreationPreviewMetric[];
  generatedProfileMetrics: CharacterCreationPreviewMetric[];
  resourceMetrics: CharacterCreationPreviewMetric[];
  attributeMetrics: CharacterCreationPreviewMetric[];
  attributePreviewRows: CharacterCreationAttributePreviewRow[];
  starterSkills: string[];
  starterLore: string[];
  starterTraits: string[];
  starterGear: string[];
  starterPack: string[];
  starterSkillPolicyLabels: string[];
  legacyPreparations: LegacyPreparationReviewEntry[];
  walletLabel: string | null;
  starterNotes: string[];
  reviewNarrative: string;
};

const EMPTY_EQUIPMENT: EquipmentState = {
  'slot.weapon.left': null,
  'slot.weapon.right': null,
  'slot.armor.head': null,
  'slot.armor.shoulder': null,
  'slot.armor.chest': null,
  'slot.armor.arm': null,
  'slot.armor.hand': null,
  'slot.armor.waist': null,
  'slot.armor.leg': null,
  'slot.armor.foot': null,
  'slot.accessory.ear': null,
  'slot.accessory.eyes': null,
  'slot.accessory.neck': null,
  'slot.accessory.arms': null,
  'slot.accessory.fingers': null,
  'slot.accessory.waist': null,
  'slot.accessory.ankle': null
};

const LINEAGE_TRAIT_IDS: Record<string, string[]> = {
  'lineage.human': ['trait.lineage.human.adaptable', 'trait.lineage.human.resilient', 'trait.lineage.human.socially_versatile'],
  'lineage.elf': ['trait.lineage.elf.arcane_attunement', 'trait.lineage.elf.keen_senses', 'trait.lineage.elf.graceful'],
  'lineage.dark_elf': ['trait.lineage.dark_elf.darkvision', 'trait.lineage.dark_elf.cruel_precision', 'trait.lineage.dark_elf.shadow_adapted'],
  'lineage.dwarf': ['trait.lineage.dwarf.stone_sense', 'trait.lineage.dwarf.stout', 'trait.lineage.dwarf.darkvision'],
  'lineage.gnome': ['trait.lineage.gnome.tinkers_mind', 'trait.lineage.gnome.quick_hands', 'trait.lineage.gnome.small_frame'],
  'lineage.halfling': ['trait.lineage.halfling.quiet_step', 'trait.lineage.halfling.lucky', 'trait.lineage.halfling.nimble'],
  'lineage.half_troll': ['trait.lineage.half_troll.regenerative_constitution', 'trait.lineage.half_troll.massive_build', 'trait.lineage.half_troll.thick_hide'],
  'lineage.half_orc': ['trait.lineage.half_orc.brutal_strength', 'trait.lineage.half_orc.battle_hardened', 'trait.lineage.half_orc.ferocious_recovery'],
  'lineage.half_goblin': ['trait.lineage.half_goblin.scavenger_instinct', 'trait.lineage.half_goblin.cunning', 'trait.lineage.half_goblin.quick_reflexes'],
  'lineage.half_merfolk': ['trait.lineage.half_merfolk.water_adapted', 'trait.lineage.half_merfolk.tidal_sense', 'trait.lineage.half_merfolk.breath_discipline']
};

function humanizeId(value: string | null | undefined): string {
  if (!value) return 'Unknown';
  const tail = value.split('.').pop() ?? value;
  return tail.split('_').filter(Boolean).map((segment) => segment[0]!.toUpperCase() + segment.slice(1)).join(' ');
}

function formatWallet(currency: PlayerCurrencyState): string {
  return `${currency.gold}g ${currency.silver}s ${currency.copper}c`;
}

function formatList(values: string[], fallback: string): string {
  const filtered = values.filter((value) => value.trim().length > 0);
  if (filtered.length === 0) return fallback;
  if (filtered.length === 1) return filtered[0]!;
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}

function buildStarterSkillPolicyLabels(
  policy: LegacyStarterSkillPolicyResolution
): string[] {
  return [
    policy.absoluteStarterSkillCap < 30
      ? 'Starter skills capped below breakthrough'
      : 'Starter skill cap policy active',
    `Max starter skills: ${policy.maxStarterSkillCount}`,
    'Direct skill grants unavailable'
  ];
}

function toMetric(id: string, label: string, value: number | string | null): CharacterCreationPreviewMetric {
  return { id, label, value: value === null ? null : value.toString() };
}

function buildIdentityMetrics(
  form: Pick<
    CharacterCreationFormState,
    'sexId' | 'lineageId' | 'ageBandId' | 'heightBandId' | 'physiqueId' | 'natureId' | 'focusId' | 'hairColorId' | 'eyeColorId' | 'skinToneId'
  >
): CharacterCreationPreviewMetric[] {
  const sexOption = getSexOptionForLineage(form.lineageId, form.sexId);

  return [
    toMetric('sex', 'Sex', `${sexOption.label} — ${sexOption.modifierText}`),
    toMetric('age', 'Age', formatAgeBandModifierLine(form.lineageId, form.sexId, form.ageBandId)),
    toMetric('height', 'Height', formatHeightBandModifierLine(form.heightBandId)),
    toMetric('physique', 'Physique', getPhysiqueLabel(form.physiqueId)),
    toMetric('nature', 'Nature', getNatureLabel(form.natureId)),
    toMetric('focus', 'Focus', getFocusLabel(form.focusId)),
    toMetric('hair', 'Hair', getIdentityOptionLabel(form.lineageId, 'hairColorOptions', form.hairColorId)),
    toMetric('eyes', 'Eyes', getIdentityOptionLabel(form.lineageId, 'eyeColorOptions', form.eyeColorId)),
    toMetric('skin', 'Skin', getIdentityOptionLabel(form.lineageId, 'skinToneOptions', form.skinToneId))
  ];
}

function buildGeneratedProfileMetrics(attributes: PlayerAttributes): CharacterCreationPreviewMetric[] {
  return CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = attributes[attributeKey];
    return value > 0
      ? [toMetric(`profile.${attributeKey.toLowerCase()}`, attributeKey, `+${value}`)]
      : [];
  });
}

function buildAttributeMetrics(attributes: PlayerAttributes | null): CharacterCreationPreviewMetric[] {
  return CHARACTER_ATTRIBUTE_ORDER.map((label) =>
    toMetric(label.toLowerCase(), label, attributes ? attributes[label as keyof PlayerAttributes] : null)
  );
}

function buildLegacyPreparationAttributeAdjustments(
  form: CharacterCreationFormState,
  options: CharacterCreationPreviewOptions
) {
  if ((options.appliedLegacyPreparationIds ?? []).length === 0) {
    return {};
  }

  if (!isKnownStartingBundleId(form.startingBundleId)) {
    return {};
  }

  try {
    const bundle = getStartingBundleTemplate(form.startingBundleId);
    const bundleStacks = getStartingBundleSelectedStacks(
      form.startingBundleId,
      form.startingBundleChoiceSelections
    );
    const equipment = buildStarterEquipment(bundleStacks);
    const inventory = buildStarterInventory(bundleStacks, equipment);
    const legacyStartBonuses = resolveLegacyCharacterStartBonuses(options.accountProfile);
    const currency = {
      gold: bundle.startingCurrency.gold + legacyStartBonuses.currencyDelta.gold,
      silver: bundle.startingCurrency.silver + legacyStartBonuses.currencyDelta.silver,
      copper: bundle.startingCurrency.copper + legacyStartBonuses.currencyDelta.copper
    };

    return applyLegacyPreparationBonuses({
      preparationIds: options.appliedLegacyPreparationIds ?? [],
      preparationChoices: options.appliedLegacyPreparationChoices ?? {},
      currency,
      equipment,
      inventory
    }).attributeAdjustments;
  } catch {
    return {};
  }
}

function addAttributeAdjustments(
  target: PlayerAttributes,
  adjustments: Partial<Record<PlayerAttributeKey, number>>
): PlayerAttributes {
  const next = { ...target };

  for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
    next[attributeKey] += adjustments[attributeKey] ?? 0;
  }

  return next;
}

export function buildCharacterCreationAttributePreviewRows(
  form: CharacterCreationFormState,
  options: CharacterCreationPreviewOptions = {}
): CharacterCreationAttributePreviewRow[] {
  const lineageId = form.lineageId.trim() || "lineage.human";
  const attributeResolution = resolveCharacterCreationAttributes({
    lineageId,
    sexId: form.sexId,
    ageBandId: form.ageBandId,
    heightBandId: form.heightBandId,
    physiqueId: form.physiqueId,
    natureId: form.natureId,
    focusId: form.focusId,
    backstoryId: form.backstoryId
  });
  const baseline = getLineageBaseAttributes(lineageId);
  const sex = getSexAttributeAdjustments(lineageId, form.sexId);
  const age = getAgeBandAttributeAdjustments(form.ageBandId);
  const height = getHeightBandAttributeAdjustments(form.heightBandId);
  const backstory =
    form.backstoryId.trim().length > 0 && isKnownBackstoryId(form.backstoryId)
      ? getBackstoryAttributeAdjustments(form.backstoryId)
      : {};
  const generated = attributeResolution.generatedProfilePoints;
  const legacyPreparation = buildLegacyPreparationAttributeAdjustments(form, options);
  const finalAttributes = addAttributeAdjustments(
    attributeResolution.finalAttributes,
    legacyPreparation
  );

  return CHARACTER_ATTRIBUTE_ORDER.map((attributeKey) => {
    const contributionCandidates: CharacterCreationAttributePreviewContribution[] = [
      {
        id: "racial_baseline",
        label: "Racial Baseline",
        value: baseline[attributeKey]
      },
      {
        id: "sex",
        label: "Sex",
        value: sex[attributeKey] ?? 0
      },
      {
        id: "age",
        label: "Age",
        value: age[attributeKey] ?? 0
      },
      {
        id: "height",
        label: "Height",
        value: height[attributeKey] ?? 0
      },
      {
        id: "backstory",
        label: "Backstory",
        value: backstory[attributeKey] ?? 0
      },
      {
        id: "generated_profile",
        label: "Generated Build/Profile",
        value: generated[attributeKey] ?? 0
      },
      {
        id: "legacy_preparation",
        label: "Legacy Preparation",
        value: legacyPreparation[attributeKey] ?? 0
      }
    ];
    const totalValue = finalAttributes[attributeKey];

    return {
      id: attributeKey,
      label: attributeKey,
      totalValue,
      contributions: [
        ...contributionCandidates.filter((contribution) => contribution.value !== 0),
        {
          id: "total",
          label: "Total",
          value: totalValue
        }
      ]
    };
  });
}

function resolveWorkingCharacterAttributes(
  form: Pick<
    CharacterCreationFormState,
    'sexId' | 'lineageId' | 'ageBandId' | 'heightBandId' | 'physiqueId' | 'natureId' | 'focusId' | 'backstoryId'
  >
): PlayerAttributes {
  const resolution = resolveCharacterCreationAttributes({
    lineageId: form.lineageId.trim() || 'lineage.human',
    sexId: form.sexId,
    ageBandId: form.ageBandId,
    heightBandId: form.heightBandId,
    physiqueId: form.physiqueId,
    natureId: form.natureId,
    focusId: form.focusId,
    backstoryId: form.backstoryId
  });

  return resolution.finalAttributes;
}

function resolveWorkingCharacterResources(
  form: Pick<CharacterCreationFormState, 'sexId' | 'lineageId'>,
  attributes: PlayerAttributes,
  equipment: EquipmentState
) {
  const lineageId = form.lineageId.trim() || 'lineage.human';
  const sexId = form.sexId === 'female' ? 'female' : 'male';
  const clock = createDefaultNewGameClock();
  const originProfile = resolvePlayerOriginProfile(
    { lineageId, classId: null, sexId },
    createPlayerProgressionState({ legacyGrowth: { resourceGrowthLevel: 1, classLevel: 0 } })
  );
  const resolution = resolvePlayerResources(
    {
      playerId: 'player.preview',
      attributes,
      bodyState: createDefaultPlayerBodyState({
        tick: clock.tick,
        day: clock.day,
        lineageId
      }),
      resources: {
        hp: { current: originProfile.resolvedResourceMaxima.hp, max: originProfile.resolvedResourceMaxima.hp },
        mp: { current: originProfile.resolvedResourceMaxima.mp, max: originProfile.resolvedResourceMaxima.mp },
        stamina: { current: originProfile.resolvedResourceMaxima.stamina, max: originProfile.resolvedResourceMaxima.stamina },
        xp: { current: 0, total: 0, toNextLevel: 1000 }
      },
      originProfile,
      equipment,
      resourceRuntime: createEmptyPlayerResourceRuntimeState()
    },
    [],
    clock.tick
  );
  fillCoreResourcesToMax(resolution.resources);
  return {
    hp: resolution.resources.hp.current,
    mp: resolution.resources.mp.current,
    stamina: resolution.resources.stamina.current
  };
}

function buildStarterTraits(lineageId: string): PlayerTraitState[] {
  return (LINEAGE_TRAIT_IDS[lineageId] ?? []).map((id) => ({ id, source: 'lineage' }));
}

function resolveLoreSkillLabels(skills: PlayerSkillState[]): string[] {
  return skills
    .filter((skill) => skill.id.startsWith('skill.knowledge.'))
    .map((skill) => humanizeId(skill.id));
}

function isWeaponItem(itemKey: string): boolean {
  return ['sword', 'spear', 'bow', 'axe', 'knife', 'staff'].some((token) => itemKey.includes(token));
}

function buildStarterEquipment(stacks: InventoryStack[]): EquipmentState {
  const equipment = { ...EMPTY_EQUIPMENT };
  const equipOne = (slot: keyof EquipmentState, stack: InventoryStack) => {
    equipment[slot] = { itemId: stack.itemId, itemKey: stack.itemKey, quantity: 1, durability: 1 };
  };
  for (const stack of stacks) {
    if (stack.itemKey.includes('shield') && !equipment['slot.weapon.left']) equipOne('slot.weapon.left', stack);
    else if ((stack.itemKey.includes('armor') || stack.itemKey.includes('tunic') || stack.itemKey.includes('cloak')) && !equipment['slot.armor.chest']) equipOne('slot.armor.chest', stack);
    else if (stack.itemKey === 'compass' && !equipment['slot.accessory.waist']) equipOne('slot.accessory.waist', stack);
    else if (isWeaponItem(stack.itemKey) && !equipment['slot.weapon.right']) equipOne('slot.weapon.right', stack);
  }
  return equipment;
}

function buildStarterInventory(stacks: InventoryStack[], equipment: EquipmentState) {
  const consumed = new Map<string, number>();
  for (const item of Object.values(equipment)) {
    if (!item) continue;
    const key = `${item.itemId}.${item.itemKey}`;
    consumed.set(key, (consumed.get(key) ?? 0) + 1);
  }
  const bagStacks = stacks.flatMap((stack) => {
    const remaining = stack.quantity - (consumed.get(`${stack.itemId}.${stack.itemKey}`) ?? 0);
    return remaining > 0 ? [{ itemId: stack.itemId, itemKey: stack.itemKey, quantity: remaining }] : [];
  });
  return { bags: [{ id: 'bag.traveler_satchel', label: 'Traveler Satchel', slotCapacity: 20, stacks: bagStacks }], overflow: [] };
}

function buildSessionState(
  playerName: string,
  form: CharacterCreationFormState,
  selectedWorld: NonNullable<ReturnType<typeof resolveWorldSelection>>,
  backstoryLabel: string | null,
  bundleLabel: string
): SaveSnapshot['sessionState'] {
  const settlement = selectedWorld.settlementRecord;
  const backstoryFlags =
    backstoryLabel && form.backstoryId.trim().length > 0
      ? [`character.backstory.${form.backstoryId}`]
      : [];
  const backstoryEntities = backstoryLabel ? [backstoryLabel] : [];
  const notificationDetail = backstoryLabel
    ? `${playerName} begins as ${backstoryLabel} with the ${bundleLabel}.`
    : `${playerName} arrives with the ${bundleLabel}.`;
  const chronicleTitle = backstoryLabel
    ? `${playerName} began as ${backstoryLabel}`
    : `${playerName} began the journey`;
  const chronicleStatChanges = backstoryLabel
    ? ['Save slot created', `Origin set to ${backstoryLabel}`]
    : ['Save slot created', 'No backstory package applied'];
  const locationType: WorldLocationType =
    settlement.settlementType === 'fort' || settlement.settlementType === 'citadel'
      ? 'fort'
      : settlement.settlementType === 'harbor_town' || settlement.settlementType === 'port_city'
        ? 'harbor'
        : 'settlement';
  return {
    ...createEmptySessionState(),
    activeEvents: ['event.campaign.started'],
    flags: ['campaign.new_game', ...backstoryFlags, `character.starting_bundle.${form.startingBundleId}`, `character.start.${settlement.id}`],
    notifications: [{ id: 'note.new_game', title: `${settlement.name} arrival`, detail: notificationDetail, timeLabel: 'Just now', tone: 'accent' }],
    currentActivity: { id: `activity.arrival.${settlement.id}`, label: `Arriving in ${settlement.name}`, category: 'Arrival', detail: `${selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')} into ${settlement.name}.` },
    knownLocations: [{
      id: settlement.id,
      name: settlement.name,
      regionLabel: selectedWorld.region.label,
      settlementId: settlement.id,
      regionId: selectedWorld.region.id,
      type: locationType,
      x: settlement.visualMapRef?.pixelX ?? 0,
      y: settlement.visualMapRef?.pixelY ?? 0,
      note: settlement.summary,
      known: true
    }],
    worldRecords: [
      { id: selectedWorld.continent.id, sectionId: 'world.continent', title: selectedWorld.continent.label, summary: selectedWorld.continent.description, tags: selectedWorld.continent.biomeMix, detailEntries: [{ label: 'Climate', value: selectedWorld.continent.climate }, { label: 'Difficulty', value: selectedWorld.continent.difficultyLabel }] },
      { id: selectedWorld.region.id, sectionId: 'world.region', title: selectedWorld.region.label, subtitle: selectedWorld.continent.label, summary: selectedWorld.region.description, tags: selectedWorld.region.resourceAvailability, detailEntries: [{ label: 'Terrain', value: selectedWorld.region.terrainAndBiome }, { label: 'Density', value: selectedWorld.region.populationDensity }] },
      { id: selectedWorld.settlement.id, sectionId: 'world.settlement', title: selectedWorld.settlement.label, subtitle: selectedWorld.region.label, summary: selectedWorld.settlement.description, tags: selectedWorld.settlement.dominantIndustries, detailEntries: [{ label: 'Population', value: selectedWorld.settlement.populationSize }, { label: 'Trade Role', value: selectedWorld.settlement.tradeRole }, { label: 'Authority', value: selectedWorld.settlement.landAuthorityType.replace(/_/g, ' ') }] }
    ],
    activityRecords: [{ id: `activity.start.${settlement.id}`, sectionId: 'activity.start', title: `Arrival at ${settlement.name}`, summary: selectedWorld.settlement.access.notes[0] ?? settlement.summary, tags: selectedWorld.settlement.dominantIndustries, detailEntries: [{ label: 'Spawn Mode', value: selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ') }, { label: 'Lodging', value: selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ') }, { label: 'Land Authority', value: selectedWorld.settlement.landRestriction.authorityLabel }] }],
    chronicle: [{ id: 'chronicle.campaign_started', category: 'social', title: chronicleTitle, timeLabel: 'Just now', summary: `${playerName} opens the campaign from ${settlement.name} in ${selectedWorld.region.label}.`, statusLabel: 'Campaign started', entities: [playerName, settlement.name, ...backstoryEntities, bundleLabel], results: ['Starter state generated', selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')], statChanges: chronicleStatChanges, tags: [selectedWorld.region.label, selectedWorld.continent.label, 'New Game'] }]
  };
}

function buildReviewNarrative(params: {
  characterName: string;
  backstoryLabel: string | null;
  settlementLabel: string;
  regionLabel: string;
  bundleLabel: string;
  dominantIndustries: string[];
  keyResources: string[];
  gearLabels: string[];
  starterPackLabels: string[];
  walletLabel: string;
}) {
  const opportunity = formatList([...params.dominantIndustries.slice(0, 2), ...params.keyResources.slice(0, 2).map(humanizeId)], 'local trade and hard work').toLowerCase();
  const carried = formatList([...params.gearLabels.slice(0, 2), ...params.starterPackLabels.slice(0, 2)], 'a modest starter kit');
  const backstoryCopy = params.backstoryLabel
    ? `Your backstory is ${params.backstoryLabel}, and you arrive`
    : "You arrive with no formative backstory package applied yet";
  return `${params.characterName}. ${backstoryCopy} at ${params.settlementLabel} in ${params.regionLabel} with the ${params.bundleLabel}. ${params.settlementLabel} is known for ${opportunity}. You carry ${carried}, and ${params.walletLabel} must cover the first hard days.`;
}

function buildPlaceholderPreview(
  form: CharacterCreationFormState,
  options: CharacterCreationPreviewOptions = {}
): CharacterCreationPreview {
  const attributes = resolveWorkingCharacterAttributes(form);
  const backstory = isKnownBackstoryId(form.backstoryId) ? getBackstoryTemplate(form.backstoryId) : null;
  const bundle = isKnownStartingBundleId(form.startingBundleId) ? getStartingBundleTemplate(form.startingBundleId) : null;
  const legacyStartBonuses = resolveLegacyCharacterStartBonuses(options.accountProfile);
  const starterSkillPolicyLabels = buildStarterSkillPolicyLabels(
    resolveLegacyStarterSkillPolicy(options.accountProfile)
  );
  const bundleStacks =
    bundle && form.startingBundleId.trim().length > 0
      ? (() => {
          try {
            return getStartingBundleSelectedStacks(
              bundle.id,
              form.startingBundleChoiceSelections
            );
          } catch {
            return [];
          }
        })()
      : [];
  const equipment = buildStarterEquipment(bundleStacks);
  const inventory = buildStarterInventory(bundleStacks, equipment);
  const resources = (() => {
    try { return resolveWorkingCharacterResources(form, attributes, equipment); } catch { return { hp: null, mp: null, stamina: null }; }
  })();
  const previewResources = {
    hp: resources.hp === null ? null : resources.hp + (legacyStartBonuses.resourceMaxFlat.hp ?? 0),
    mp: resources.mp,
    stamina:
      resources.stamina === null
        ? null
        : resources.stamina + (legacyStartBonuses.resourceMaxFlat.stamina ?? 0)
  };
  const wallet = bundle
    ? {
        gold: bundle.startingCurrency.gold + legacyStartBonuses.currencyDelta.gold,
        silver: bundle.startingCurrency.silver + legacyStartBonuses.currencyDelta.silver,
        copper: bundle.startingCurrency.copper + legacyStartBonuses.currencyDelta.copper
      }
    : null;
  return {
    isResolved: false,
    characterName: form.playerName.trim(),
    chosenOrigin: backstory ? `${humanizeId(form.lineageId)} | ${backstory.label}` : 'An unproven soul with no sworn backstory, bundle, or lawful arrival yet.',
    lineageLabel: form.lineageId.trim() ? humanizeId(form.lineageId) : null,
    backstoryLabel: backstory?.label ?? null,
    startingBundleLabel: bundle?.label ?? null,
    startingContinent: null,
    startingSettlement: null,
    startingRegion: null,
    startingAccessLabel: 'Land restrictions undecided',
    startingAccessDetail: 'Choose a homeland, city, and backstory before the local authorities can judge lawful standing.',
    identityMetrics: buildIdentityMetrics(form),
    generatedProfileMetrics: buildGeneratedProfileMetrics(
      resolveCharacterCreationAttributes({
        lineageId: form.lineageId.trim() || 'lineage.human',
        sexId: form.sexId,
        ageBandId: form.ageBandId,
        heightBandId: form.heightBandId,
        physiqueId: form.physiqueId,
        natureId: form.natureId,
        focusId: form.focusId,
        backstoryId: form.backstoryId
      }).generatedProfilePoints
    ),
    resourceMetrics: [toMetric('hp', 'HP', previewResources.hp), toMetric('mp', 'MP', previewResources.mp), toMetric('stamina', 'Stamina', previewResources.stamina)],
    attributeMetrics: buildAttributeMetrics(attributes),
    attributePreviewRows: buildCharacterCreationAttributePreviewRows(form, options),
    starterSkills: backstory?.startingSkillLabels ?? [],
    starterLore: backstory ? resolveLoreSkillLabels(backstory.startingSkills) : [],
    starterTraits: [],
    starterGear: Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
    starterPack: (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`),
    starterSkillPolicyLabels,
    legacyPreparations: [],
    walletLabel: wallet ? formatWallet(wallet) : null,
    starterNotes: [backstory?.detailText ?? '', bundle?.description ?? '', ...legacyStartBonuses.sourceLabels].filter(Boolean),
    reviewNarrative: 'A life is still being forged. Choose lineage, identity, homeland, settlement, backstory, and a starting bundle to shape the opening of the journey.'
  };
}

function deriveCharacterCreationState(
  form: CompleteCharacterCreationFormState,
  options: CharacterCreationPreviewOptions = {}
): DerivedCharacterCreationState {
  const hasBackstorySelection =
    form.backstoryId.trim().length > 0 && isKnownBackstoryId(form.backstoryId);
  const selectedWorld = resolveWorldSelection({ continentId: form.continentId, regionId: form.regionId, settlementId: form.startingSettlementId, backstoryId: hasBackstorySelection ? form.backstoryId : "" });
  if (!selectedWorld) throw new Error('Cannot create a new game without a valid world selection.');
  if (selectedWorld.settlement.access.accessStatus !== 'allowed') throw new Error(selectedWorld.settlement.access.notes[0] ?? 'Selected settlement start is restricted.');

  const clock = createDefaultNewGameClock();
  const gameState = createDefaultGameState();
  const backstory = hasBackstorySelection
    ? getBackstoryTemplate(form.backstoryId, selectedWorld)
    : null;
  const bundle = getStartingBundleTemplate(form.startingBundleId);
  const bundleStacks = getStartingBundleSelectedStacks(
    form.startingBundleId,
    form.startingBundleChoiceSelections
  );
  const progression = createPlayerProgressionState({
    legacyGrowth: {
      resourceGrowthLevel: 1,
      classLevel: 0,
      unspentAttributePoints: 0,
      unspentSkillPoints: 0
    }
  });
  const playerName = form.playerName.trim();
  const playerId = `player.${playerName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'new_adventurer'}`;
  const originProfile = resolvePlayerOriginProfile({ lineageId: form.lineageId, classId: null, sexId: form.sexId }, progression);
  const attributeResolution = resolveCharacterCreationAttributes({
    lineageId: form.lineageId,
    sexId: form.sexId,
    ageBandId: form.ageBandId,
    heightBandId: form.heightBandId,
    physiqueId: form.physiqueId,
    natureId: form.natureId,
    focusId: form.focusId,
    backstoryId: form.backstoryId
  });

  if (attributeResolution.errors.length > 0) {
    throw new Error(attributeResolution.errors[0]);
  }

  let attributes = attributeResolution.finalAttributes;
  const canonicalAgeBandId = resolveCanonicalAgeBandId(form.ageBandId);
  const canonicalPhysiqueId = resolveCanonicalPhysiqueId(form.physiqueId);
  const canonicalNatureId = resolveCanonicalNatureId(form.natureId);
  const canonicalFocusId = resolveCanonicalFocusId(form.focusId);

  if (!canonicalAgeBandId || !canonicalPhysiqueId || !canonicalNatureId || !canonicalFocusId) {
    throw new Error("Character identity selections could not be resolved to canonical ids.");
  }
  const equipment = buildStarterEquipment(bundleStacks);
  const starterInventory = buildStarterInventory(bundleStacks, equipment);
  const legacyStartBonuses = resolveLegacyCharacterStartBonuses(options.accountProfile);
  const starterSkillPolicyLabels = buildStarterSkillPolicyLabels(
    resolveLegacyStarterSkillPolicy(options.accountProfile)
  );
  const starterCurrency = {
    gold: bundle.startingCurrency.gold + legacyStartBonuses.currencyDelta.gold,
    silver: bundle.startingCurrency.silver + legacyStartBonuses.currencyDelta.silver,
    copper: bundle.startingCurrency.copper + legacyStartBonuses.currencyDelta.copper
  };
  const legacyPreparationApplication = applyLegacyPreparationBonuses({
    preparationIds: options.appliedLegacyPreparationIds ?? [],
    preparationChoices: options.appliedLegacyPreparationChoices ?? {},
    currency: starterCurrency,
    equipment,
    inventory: starterInventory
  });
  if (Object.keys(legacyPreparationApplication.attributeAdjustments).length > 0) {
    const nextAttributes = { ...attributes };

    for (const [attributeKey, amount] of Object.entries(
      legacyPreparationApplication.attributeAdjustments
    ) as Array<[PlayerAttributeKey, number]>) {
      nextAttributes[attributeKey] += amount;
    }

    attributes = nextAttributes;
  }
  const inventory = legacyPreparationApplication.inventory;
  const currency = legacyPreparationApplication.currency;
  const resourceRuntime = {
    ...createEmptyPlayerResourceRuntimeState(),
    modifiers: [
      ...legacyStartBonuses.resourceModifiers,
      ...legacyPreparationApplication.resourceModifiers
    ]
  };
  const bodyState = createDefaultPlayerBodyState({
    tick: clock.tick,
    day: clock.day,
    lineageId: form.lineageId,
    runDifficulty: gameState.runDifficulty
  });
  const resources = resolvePlayerResources(
    {
      playerId,
      attributes,
      bodyState,
      resources: {
        hp: { current: originProfile.resolvedResourceMaxima.hp, max: originProfile.resolvedResourceMaxima.hp },
        mp: { current: originProfile.resolvedResourceMaxima.mp, max: originProfile.resolvedResourceMaxima.mp },
        stamina: { current: originProfile.resolvedResourceMaxima.stamina, max: originProfile.resolvedResourceMaxima.stamina },
        xp: { current: 0, total: 0, toNextLevel: 1000 }
      },
      originProfile,
      equipment,
      resourceRuntime
    },
    [],
    clock.tick
  );
  fillCoreResourcesToMax(resources.resources);
  for (const resourceId of [
    ...legacyStartBonuses.fillResourceIds,
    ...legacyPreparationApplication.fillResourceIds
  ]) {
    resources.resources[resourceId].current = resources.resources[resourceId].max;
  }
  const geographicKnowledge = [
    { scope: 'continent' as GeographicKnowledgeScope, geographyId: selectedWorld.continent.id, level: 1 },
    { scope: 'region' as GeographicKnowledgeScope, geographyId: selectedWorld.region.id, level: 1 },
    { scope: 'settlement' as GeographicKnowledgeScope, geographyId: selectedWorld.settlement.id, level: 1 }
  ];
  const traits = buildStarterTraits(form.lineageId);
  const sessionState = buildSessionState(playerName, form, selectedWorld, backstory?.label ?? null, bundle.label);
  const activeQuestIds = sessionState.questJournal.filter((entry) => entry.category === 'active' || entry.category === 'contracts').map((entry) => entry.id);
  const completedQuestIds = sessionState.questJournal.filter((entry) => entry.category === 'completed').map((entry) => entry.id);
  const snapshot: SaveSnapshot = {
    accountId: DEFAULT_ACCOUNT_ID,
    snapshotVersion: CURRENT_SNAPSHOT_VERSION,
    capturedAtTick: clock.tick,
    clock,
    gameState,
    playerState: {
      playerId,
      regionId: selectedWorld.region.id,
      coreData: {
        playerName,
        lineageId: form.lineageId,
        sexId: form.sexId,
        classId: null,
        jobId: null,
        backstoryId: backstory?.id ?? null,
        startingBundleId: form.startingBundleId,
        identityProfile: {
          heightCm: getRepresentativeHeightCm(form.lineageId, form.heightBandId),
          ageBandId: canonicalAgeBandId,
          physiqueId: canonicalPhysiqueId,
          natureId: canonicalNatureId,
          focusId: canonicalFocusId,
          hairColorId: form.hairColorId,
          hairHighlightColorId: null,
          eyeColorId: form.eyeColorId,
          skinToneId: form.skinToneId
        }
      },
      attributes,
      statGrowth: createDefaultPlayerStatGrowthState(clock.day),
      bodyState,
      resources: resources.resources,
      resourceRuntime: resources.resourceRuntime,
      progression,
      skills: backstory ? [...backstory.startingSkills] : [],
      spells: [],
      abilities: backstory ? getStartingAbilityStates(form.backstoryId) : [],
      traits,
      activeTrials: [],
      equipment,
      inventory,
      activeEffects: [],
      location: {
        settlementId: selectedWorld.settlement.id,
        siteLabel: selectedWorld.settlement.label,
        worldMapId: selectedWorld.settlementRecord.visualMapRef?.mapId ?? null
      },
      currency,
      originProfile,
      standing: [],
      reputation: {
        fame: [],
        notoriety: [],
        notorietyEvents: []
      },
      titles: [],
      geographicKnowledge,
      discoveryChronicle: { entries: [], lastUpdatedTick: null },
      achievements: createDefaultCharacterAchievementsState(),
      activeQuestIds,
      completedQuestIds,
      flags: ['player.new_game', ...(backstory ? [`player.backstory.${backstory.id}`] : []), `player.starting_bundle.${bundle.id}`, `player.start.${selectedWorld.settlement.id}`, `player.start_authority.${selectedWorld.settlement.landAuthorityType}`, `player.start_mode.${selectedWorld.settlement.access.spawnMode}`, ...legacyStartBonuses.appliedUnlockIds.map((unlockId) => `player.legacy_start.${unlockId}`)],
      combatProfile: createDefaultPlayerCombatProfile(),
      saveMeta: {
        totalPlayTicks: 0,
        lastRestAtTick: clock.tick,
        lastSavedAtTick: clock.tick,
        lastReputationDecayDay: clock.day
      }
    },
    worldState: createDefaultNewGameWorldState(selectedWorld.region.id),
    civilizationState: createDefaultNewGameCivilizationState(clock.tick),
    sessionState
  };
  syncPlayerRuntimeState(
    snapshot.playerState,
    snapshot.clock.tick,
    snapshot.clock.day,
    [],
    snapshot.gameState.runDifficulty
  );
  const gearLabels = Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : []));
  const starterPackLabels = (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`);
  return {
    backstoryLabel: backstory?.label ?? null,
    lineageLabel: originProfile.lineageLabel,
    startingBundleLabel: bundle.label,
    startingContinentLabel: selectedWorld.continent.label,
    startingSettlementLabel: selectedWorld.settlement.label,
    startingRegionLabel: selectedWorld.region.label,
    startingAccessLabel: selectedWorld.settlement.access.accessStatus === 'allowed' ? 'Land restrictions satisfied' : 'Land restrictions unmet',
    startingAccessDetail: [selectedWorld.settlement.landRestriction.propertyNarrative, selectedWorld.settlement.landRestriction.currentStanding, selectedWorld.settlement.landRestriction.purchaseRequirements.length > 0 ? `Should you seek to buy land, the usual demands are ${formatList(selectedWorld.settlement.landRestriction.purchaseRequirements, 'no formal requirements are commonly spoken of').toLowerCase()}.` : ''].filter(Boolean).join(' '),
    chosenOriginLabel: `${originProfile.lineageLabel} | ${backstory?.label ?? 'No sworn backstory'}`,
    reviewNarrative: buildReviewNarrative({ characterName: playerName, backstoryLabel: backstory?.label ?? null, settlementLabel: selectedWorld.settlement.label, regionLabel: selectedWorld.region.label, bundleLabel: bundle.label, dominantIndustries: selectedWorld.settlement.dominantIndustries, keyResources: selectedWorld.settlement.keyResources, gearLabels, starterPackLabels, walletLabel: formatWallet(currency) }),
    attributes,
    generatedProfileMetrics: buildGeneratedProfileMetrics(attributeResolution.generatedProfilePoints),
    resources: { hp: resources.resources.hp.current, mp: resources.resources.mp.current, stamina: resources.resources.stamina.current },
    loreLabels: backstory ? resolveLoreSkillLabels(backstory.startingSkills) : [],
    currency,
    gearLabels,
    starterPackLabels,
    legacyPreparations: legacyPreparationApplication.reviewEntries,
    appliedLegacyPreparationIds: legacyPreparationApplication.appliedPreparationIds,
    appliedLegacyPreparationChoices: legacyPreparationApplication.appliedPreparationChoices,
    starterSkillPolicyLabels,
    starterSkillLabels: backstory?.startingSkillLabels ?? [],
    starterTraitLabels: traits.map((trait) => humanizeId(trait.id)),
    starterNotes: [...originProfile.notes.slice(0, 2), backstory?.detailText ?? '', bundle.description, selectedWorld.settlement.landRestriction.currentStanding, ...legacyStartBonuses.sourceLabels].filter(Boolean),
    snapshot
  };
}

export function buildCharacterCreationPreview(
  form: CharacterCreationFormState,
  options: CharacterCreationPreviewOptions = {}
): CharacterCreationPreview {
  if (!hasCompleteCharacterCreationSelections(form, options)) return buildPlaceholderPreview(form, options);
  try {
    const derived = deriveCharacterCreationState(form, options);
    return {
      isResolved: true,
      characterName: form.playerName.trim(),
      chosenOrigin: derived.chosenOriginLabel,
      lineageLabel: derived.lineageLabel,
      backstoryLabel: derived.backstoryLabel,
      startingBundleLabel: derived.startingBundleLabel,
      startingContinent: derived.startingContinentLabel,
      startingSettlement: derived.startingSettlementLabel,
      startingRegion: derived.startingRegionLabel,
      startingAccessLabel: derived.startingAccessLabel,
      startingAccessDetail: derived.startingAccessDetail,
      identityMetrics: buildIdentityMetrics(form),
      generatedProfileMetrics: derived.generatedProfileMetrics,
      resourceMetrics: [toMetric('hp', 'HP', derived.resources.hp), toMetric('mp', 'MP', derived.resources.mp), toMetric('stamina', 'Stamina', derived.resources.stamina)],
      attributeMetrics: buildAttributeMetrics(derived.attributes),
      attributePreviewRows: buildCharacterCreationAttributePreviewRows(form, options),
      starterSkills: derived.starterSkillLabels,
      starterLore: derived.loreLabels,
      starterTraits: derived.starterTraitLabels,
      starterGear: derived.gearLabels,
      starterPack: derived.starterPackLabels,
      starterSkillPolicyLabels: derived.starterSkillPolicyLabels,
      legacyPreparations: derived.legacyPreparations,
      walletLabel: formatWallet(derived.currency),
      starterNotes: derived.starterNotes,
      reviewNarrative: derived.reviewNarrative
    };
  } catch {
    return buildPlaceholderPreview(form, options);
  }
}

export function createNewGameSnapshot(
  form: CharacterCreationFormState,
  accountId = DEFAULT_ACCOUNT_ID,
  options: {
    appliedLegacyPreparationIds?: string[];
    appliedLegacyPreparationChoices?: Record<string, string>;
    accountProfile?: AccountProfileState | null;
    hasSelectableBackstories?: boolean;
    sourceRunId?: string;
    crossLineageStart?: boolean;
  } = {}
): SaveSnapshot {
  const validation = validateCharacterCreationForm(
    form,
    {
      ...(options.accountProfile ? { accountProfile: options.accountProfile } : {}),
      ...(typeof options.hasSelectableBackstories === "boolean"
        ? { hasSelectableBackstories: options.hasSelectableBackstories }
        : {})
    }
  );
  if (!validation.isValid) throw new Error(Object.values(validation.errors)[0] ?? 'Complete character creation before starting the campaign.');
  if (!hasCompleteCharacterCreationSelections(form, options)) throw new Error('Complete character creation before starting the campaign.');
  const derived = deriveCharacterCreationState({
    ...form,
    playerName: form.playerName.trim()
  }, options);
  const snapshot = derived.snapshot;
  const appliedLegacyPreparationIds = derived.appliedLegacyPreparationIds;
  const appliedLegacyPreparationChoices = derived.appliedLegacyPreparationChoices;
  const sourceRunId = options.sourceRunId?.trim();

  const characterId = createAuthorityId('character');
  const targetSnapshot = initializeTargetCampaignSnapshot(
    {
      ...snapshot,
      accountId,
      playerState: {
        ...snapshot.playerState,
        playerId: characterId,
        saveMeta: {
          ...snapshot.playerState.saveMeta,
          ...(appliedLegacyPreparationIds.length > 0 ? { appliedLegacyPreparationIds } : {}),
          ...(Object.keys(appliedLegacyPreparationChoices).length > 0
            ? { appliedLegacyPreparationChoices }
            : {}),
          ...(sourceRunId ? { sourceRunId } : {}),
          ...(sourceRunId && options.crossLineageStart ? { crossLineageStart: true } : {})
        }
      }
    },
    {
      source: 'new_campaign'
    }
  );

  return {
    ...targetSnapshot
  };
}
