import {
  applyAttributeAdjustments,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type EquipmentState,
  type InventoryStack,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerKnowledgeFamiliarityState,
  type PlayerSkillState,
  type PlayerTraitState,
  type SaveSnapshot,
  type WorldLocationType
} from '../../../../packages/shared/types/src/index.js';
import { deserializeSnapshot, serializeSnapshot } from '../../../../packages/shared/persistence/src/index.js';
import {
  hasCompleteCharacterCreationSelections,
  validateCharacterCreationForm,
  type CharacterCreationFormState,
  type CompleteCharacterCreationFormState
} from './characterCreationForm.js';
import { applyCharacterAttributeAllocation } from './characterAttributes.js';
import {
  getAgeBandAttributeAdjustments,
  getAgeBandLabel,
  getBackstoryTemplate,
  getBuildAttributeAdjustments,
  getBuildLabel,
  getHeightBandAttributeAdjustments,
  getHeightBandLabel,
  getIdentityOptionLabel,
  getLineageBaseAttributes,
  getRepresentativeHeightCm,
  getStartingAbilityStates,
  getStartingBundleSelectedStacks,
  getStartingBundleTemplate,
  isKnownBackstoryId,
  isKnownStartingBundleId
} from './characterCreationCatalog.js';
import { resolveWorldSelection } from './worldSelectionCatalog.js';
import { demoSnapshot } from '../runtime/demoSnapshot.js';

function createDefaultPlayerCombatProfile() {
  return { preferredMode: 'normal' as const, memberPreferences: [] };
}

function createDefaultGameState() {
  return {
    worldVersion: '0.1.0',
    activeScenario: 'bootstrap',
    mode: { id: 'normal' as const, combatPauseAllowed: true },
    party: { leaderCombatantId: null, members: [] },
    activeEncounter: null,
    combatHistory: []
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
  backstoryLabel: string;
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
  resources: { hp: number; mp: number; stamina: number };
  knowledgeLabels: string[];
  currency: PlayerCurrencyState;
  gearLabels: string[];
  starterPackLabels: string[];
  starterSkillLabels: string[];
  starterTraitLabels: string[];
  starterNotes: string[];
  snapshot: SaveSnapshot;
};

type CharacterCreationPreviewMetric = { id: string; label: string; value: string | null };

const DEFAULT_PREVIEW_ATTRIBUTES: PlayerAttributes = {
  STR: 10, DEX: 10, AGI: 10, CON: 10, VIT: 10, WIS: 10, INT: 10, SPT: 10, CHA: 10
};

const PREVIEW_RESOURCE_ATTRIBUTE_SCALING = {
  hp: { keys: ['CON', 'VIT'] as const, perPoint: 4 },
  mp: { keys: ['INT', 'SPT'] as const, perPoint: 4 },
  stamina: { keys: ['AGI', 'CON', 'VIT'] as const, perPoint: 3 }
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
  resourceMetrics: CharacterCreationPreviewMetric[];
  attributeMetrics: CharacterCreationPreviewMetric[];
  starterSkills: string[];
  starterKnowledge: string[];
  starterTraits: string[];
  starterGear: string[];
  starterPack: string[];
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

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

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

function toMetric(id: string, label: string, value: number | string | null): CharacterCreationPreviewMetric {
  return { id, label, value: value === null ? null : value.toString() };
}

function buildIdentityMetrics(
  form: Pick<CharacterCreationFormState, 'sexId' | 'lineageId' | 'ageBandId' | 'heightBandId' | 'buildId' | 'hairColorId' | 'eyeColorId' | 'skinToneId'>
): CharacterCreationPreviewMetric[] {
  return [
    toMetric('sex', 'Sex', form.sexId ? `${form.sexId[0]!.toUpperCase()}${form.sexId.slice(1)}` : null),
    toMetric('age', 'Age', getAgeBandLabel(form.ageBandId)),
    toMetric('height', 'Height', getHeightBandLabel(form.heightBandId)),
    toMetric('build', 'Build', getBuildLabel(form.buildId)),
    toMetric('hair', 'Hair', getIdentityOptionLabel(form.lineageId, 'hairColorOptions', form.hairColorId)),
    toMetric('eyes', 'Eyes', getIdentityOptionLabel(form.lineageId, 'eyeColorOptions', form.eyeColorId)),
    toMetric('skin', 'Skin', getIdentityOptionLabel(form.lineageId, 'skinToneOptions', form.skinToneId))
  ];
}

function buildAttributeMetrics(attributes: PlayerAttributes | null): CharacterCreationPreviewMetric[] {
  return ['STR', 'DEX', 'AGI', 'CON', 'VIT', 'WIS', 'INT', 'SPT', 'CHA'].map((label) =>
    toMetric(label.toLowerCase(), label, attributes ? attributes[label as keyof PlayerAttributes] : null)
  );
}

function resolveWorkingCharacterAttributes(
  form: Pick<CharacterCreationFormState, 'sexId' | 'lineageId' | 'ageBandId' | 'heightBandId' | 'buildId' | 'attributeAllocation'>
): PlayerAttributes {
  const lineageId = form.lineageId.trim() || 'lineage.human';
  const sexId = form.sexId === 'female' ? 'female' : 'male';
  const originProfile = resolvePlayerOriginProfile({ lineageId, classId: null, sexId }, { level: 1, classLevel: 0 });
  let attributes = getLineageBaseAttributes(lineageId);
  attributes = applyAttributeAdjustments(attributes, originProfile.attributeAdjustments);
  attributes = applyAttributeAdjustments(attributes, getAgeBandAttributeAdjustments(form.ageBandId));
  attributes = applyAttributeAdjustments(attributes, getHeightBandAttributeAdjustments(form.heightBandId));
  attributes = applyAttributeAdjustments(attributes, getBuildAttributeAdjustments(form.buildId));
  return applyCharacterAttributeAllocation(attributes, form.attributeAllocation);
}

function resolveWorkingCharacterResources(
  form: Pick<CharacterCreationFormState, 'sexId' | 'lineageId'>,
  attributes: PlayerAttributes,
  equipment: EquipmentState
) {
  const lineageId = form.lineageId.trim() || 'lineage.human';
  const sexId = form.sexId === 'female' ? 'female' : 'male';
  const originProfile = resolvePlayerOriginProfile({ lineageId, classId: null, sexId }, { level: 1, classLevel: 0 });
  const resolution = resolvePlayerResources(
    {
      playerId: 'player.preview',
      attributes,
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
    demoSnapshot.clock.tick
  );
  const scale = (resource: 'hp' | 'mp' | 'stamina', baseValue: number) => {
    const spec = PREVIEW_RESOURCE_ATTRIBUTE_SCALING[resource];
    const delta = spec.keys.reduce((total, key) => total + (attributes[key] - DEFAULT_PREVIEW_ATTRIBUTES[key]), 0);
    return Math.max(1, baseValue + delta * spec.perPoint);
  };
  return {
    hp: scale('hp', resolution.resources.hp.max),
    mp: scale('mp', resolution.resources.mp.max),
    stamina: scale('stamina', resolution.resources.stamina.max)
  };
}

function buildStarterTraits(lineageId: string): PlayerTraitState[] {
  return (LINEAGE_TRAIT_IDS[lineageId] ?? []).map((id) => ({ id, source: 'lineage' }));
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
  backstoryLabel: string,
  bundleLabel: string
): SaveSnapshot['sessionState'] {
  const settlement = selectedWorld.settlementRecord;
  const locationType: WorldLocationType =
    settlement.settlementType === 'fort' || settlement.settlementType === 'citadel'
      ? 'fort'
      : settlement.settlementType === 'harbor_town' || settlement.settlementType === 'port_city'
        ? 'harbor'
        : 'settlement';
  return {
    ...createEmptySessionState(),
    activeEvents: ['event.campaign.started'],
    flags: ['campaign.new_game', `character.backstory.${form.backstoryId}`, `character.starting_bundle.${form.startingBundleId}`, `character.start.${settlement.id}`],
    notifications: [{ id: 'note.new_game', title: `${settlement.name} arrival`, detail: `${playerName} begins as ${backstoryLabel} with the ${bundleLabel}.`, timeLabel: 'Just now', tone: 'accent' }],
    currentActivity: { id: `activity.arrival.${settlement.id}`, label: `Arriving in ${settlement.name}`, category: 'Arrival', detail: `${selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')} into ${settlement.name}.` },
    knownLocations: [{ id: settlement.id, name: settlement.name, regionLabel: selectedWorld.region.label, type: locationType, x: settlement.visualMapRef?.pixelX ?? 0, y: settlement.visualMapRef?.pixelY ?? 0, note: settlement.summary, known: true }],
    worldRecords: [
      { id: selectedWorld.continent.id, sectionId: 'world.continent', title: selectedWorld.continent.label, summary: selectedWorld.continent.description, tags: selectedWorld.continent.biomeMix, detailEntries: [{ label: 'Climate', value: selectedWorld.continent.climate }, { label: 'Difficulty', value: selectedWorld.continent.difficultyLabel }] },
      { id: selectedWorld.region.id, sectionId: 'world.region', title: selectedWorld.region.label, subtitle: selectedWorld.continent.label, summary: selectedWorld.region.description, tags: selectedWorld.region.resourceAvailability, detailEntries: [{ label: 'Terrain', value: selectedWorld.region.terrainAndBiome }, { label: 'Density', value: selectedWorld.region.populationDensity }] },
      { id: selectedWorld.settlement.id, sectionId: 'world.settlement', title: selectedWorld.settlement.label, subtitle: selectedWorld.region.label, summary: selectedWorld.settlement.description, tags: selectedWorld.settlement.dominantIndustries, detailEntries: [{ label: 'Population', value: selectedWorld.settlement.populationSize }, { label: 'Trade Role', value: selectedWorld.settlement.tradeRole }, { label: 'Authority', value: selectedWorld.settlement.landAuthorityType.replace(/_/g, ' ') }] }
    ],
    activityRecords: [{ id: `activity.start.${settlement.id}`, sectionId: 'activity.start', title: `Arrival at ${settlement.name}`, summary: selectedWorld.settlement.access.notes[0] ?? settlement.summary, tags: selectedWorld.settlement.dominantIndustries, detailEntries: [{ label: 'Spawn Mode', value: selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ') }, { label: 'Lodging', value: selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ') }, { label: 'Land Authority', value: selectedWorld.settlement.landRestriction.authorityLabel }] }],
    chronicle: [{ id: 'chronicle.campaign_started', category: 'social', title: `${playerName} began as ${backstoryLabel}`, timeLabel: 'Just now', summary: `${playerName} opens the campaign from ${settlement.name} in ${selectedWorld.region.label}.`, statusLabel: 'Campaign started', entities: [playerName, settlement.name, backstoryLabel, bundleLabel], results: ['Starter state generated', selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')], statChanges: ['Save slot created', `Origin set to ${backstoryLabel}`], tags: [selectedWorld.region.label, selectedWorld.continent.label, 'New Game'] }]
  };
}

function buildReviewNarrative(params: {
  characterName: string;
  backstoryLabel: string;
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
  return `${params.characterName}. Your backstory is ${params.backstoryLabel}, and you arrive at ${params.settlementLabel} in ${params.regionLabel} with the ${params.bundleLabel}. ${params.settlementLabel} is known for ${opportunity}. You carry ${carried}, and ${params.walletLabel} must cover the first hard days.`;
}

function buildPlaceholderPreview(form: CharacterCreationFormState): CharacterCreationPreview {
  const attributes = resolveWorkingCharacterAttributes(form);
  const backstory = isKnownBackstoryId(form.backstoryId) ? getBackstoryTemplate(form.backstoryId) : null;
  const bundle = isKnownStartingBundleId(form.startingBundleId) ? getStartingBundleTemplate(form.startingBundleId) : null;
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
    resourceMetrics: [toMetric('hp', 'HP', resources.hp), toMetric('mp', 'MP', resources.mp), toMetric('stamina', 'Stamina', resources.stamina)],
    attributeMetrics: buildAttributeMetrics(attributes),
    starterSkills: backstory?.startingSkillLabels ?? [],
    starterKnowledge: backstory?.startingKnowledgeLabels ?? [],
    starterTraits: [],
    starterGear: Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
    starterPack: (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`),
    walletLabel: bundle ? formatWallet(bundle.startingCurrency) : null,
    starterNotes: [backstory?.detailText ?? '', bundle?.description ?? ''].filter(Boolean),
    reviewNarrative: 'A life is still being forged. Choose lineage, identity, homeland, settlement, backstory, starting bundle, and final attribute allocation to shape the opening of the journey.'
  };
}

function deriveCharacterCreationState(form: CompleteCharacterCreationFormState): DerivedCharacterCreationState {
  const baseSnapshot = cloneSnapshot(demoSnapshot);
  const selectedWorld = resolveWorldSelection({ continentId: form.continentId, regionId: form.regionId, settlementId: form.startingSettlementId, backstoryId: form.backstoryId });
  if (!selectedWorld) throw new Error('Cannot create a new game without a valid world selection.');
  if (selectedWorld.settlement.access.accessStatus !== 'allowed') throw new Error(selectedWorld.settlement.access.notes[0] ?? 'Selected settlement start is restricted.');

  const backstory = getBackstoryTemplate(form.backstoryId, selectedWorld);
  const bundle = getStartingBundleTemplate(form.startingBundleId);
  const bundleStacks = getStartingBundleSelectedStacks(
    form.startingBundleId,
    form.startingBundleChoiceSelections
  );
  const progression = { level: 1, classLevel: 0, unspentAttributePoints: 0, unspentSkillPoints: 0 };
  const playerName = form.playerName.trim();
  const playerId = `player.${playerName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'new_adventurer'}`;
  const originProfile = resolvePlayerOriginProfile({ lineageId: form.lineageId, classId: null, sexId: form.sexId }, progression);
  const attributes = resolveWorkingCharacterAttributes(form);
  const equipment = buildStarterEquipment(bundleStacks);
  const inventory = buildStarterInventory(bundleStacks, equipment);
  const currency = { ...bundle.startingCurrency };
  const resources = resolvePlayerResources(
    {
      playerId,
      attributes,
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
    baseSnapshot.clock.tick
  );
  const knowledgeFamiliarity: PlayerKnowledgeFamiliarityState[] = backstory.startingKnowledge.map((entry) => ({ trackId: entry.trackId, level: entry.level }));
  const traits = buildStarterTraits(form.lineageId);
  const sessionState = buildSessionState(playerName, form, selectedWorld, backstory.label, bundle.label);
  const activeQuestIds = sessionState.questJournal.filter((entry) => entry.category === 'active' || entry.category === 'contracts').map((entry) => entry.id);
  const completedQuestIds = sessionState.questJournal.filter((entry) => entry.category === 'completed').map((entry) => entry.id);
  const snapshot: SaveSnapshot = {
    ...baseSnapshot,
    gameState: createDefaultGameState(),
    playerState: {
      ...baseSnapshot.playerState,
      playerId,
      regionId: selectedWorld.region.id,
      coreData: {
        playerName,
        lineageId: form.lineageId,
        sexId: form.sexId,
        classId: null,
        jobId: null,
        backstoryId: form.backstoryId,
        startingBundleId: form.startingBundleId,
        identityProfile: {
          heightCm: getRepresentativeHeightCm(form.lineageId, form.heightBandId),
          ageBandId: form.ageBandId,
          buildId: form.buildId,
          hairColorId: form.hairColorId,
          hairHighlightColorId: null,
          eyeColorId: form.eyeColorId,
          skinToneId: form.skinToneId
        }
      },
      attributes,
      resources: resources.resources,
      resourceRuntime: resources.resourceRuntime,
      progression,
      skills: [...backstory.startingSkills],
      spells: [],
      abilities: getStartingAbilityStates(form.backstoryId),
      traits,
      equipment,
      inventory,
      activeEffects: [],
      location: { settlementId: selectedWorld.settlement.id, siteLabel: selectedWorld.settlement.label, worldMapId: selectedWorld.settlementRecord.visualMapRef?.mapId ?? null, knownSettlementIds: [selectedWorld.settlement.id] },
      currency,
      originProfile,
      reputation: [],
      titles: [],
      knowledgeFamiliarity,
      discoveryChronicle: { entries: [], lastUpdatedTick: null },
      discoveredRegions: [selectedWorld.region.id],
      activeQuestIds,
      completedQuestIds,
      flags: ['player.new_game', `player.backstory.${backstory.id}`, `player.starting_bundle.${bundle.id}`, `player.start.${selectedWorld.settlement.id}`, `player.start_authority.${selectedWorld.settlement.landAuthorityType}`, `player.start_mode.${selectedWorld.settlement.access.spawnMode}`],
      combatProfile: createDefaultPlayerCombatProfile(),
      saveMeta: { totalPlayTicks: 0, lastRestAtTick: baseSnapshot.clock.tick, lastSavedAtTick: baseSnapshot.clock.tick }
    },
    worldState: { ...baseSnapshot.worldState, activeRegions: Array.from(new Set([selectedWorld.region.id, ...baseSnapshot.worldState.activeRegions])) },
    sessionState
  };
  const gearLabels = Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : []));
  const starterPackLabels = (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`);
  return {
    backstoryLabel: backstory.label,
    lineageLabel: originProfile.lineageLabel,
    startingBundleLabel: bundle.label,
    startingContinentLabel: selectedWorld.continent.label,
    startingSettlementLabel: selectedWorld.settlement.label,
    startingRegionLabel: selectedWorld.region.label,
    startingAccessLabel: selectedWorld.settlement.access.accessStatus === 'allowed' ? 'Land restrictions satisfied' : 'Land restrictions unmet',
    startingAccessDetail: [selectedWorld.settlement.landRestriction.propertyNarrative, selectedWorld.settlement.landRestriction.currentStanding, selectedWorld.settlement.landRestriction.purchaseRequirements.length > 0 ? `Should you seek to buy land, the usual demands are ${formatList(selectedWorld.settlement.landRestriction.purchaseRequirements, 'no formal requirements are commonly spoken of').toLowerCase()}.` : ''].filter(Boolean).join(' '),
    chosenOriginLabel: `${originProfile.lineageLabel} | ${backstory.label}`,
    reviewNarrative: buildReviewNarrative({ characterName: playerName, backstoryLabel: backstory.label, settlementLabel: selectedWorld.settlement.label, regionLabel: selectedWorld.region.label, bundleLabel: bundle.label, dominantIndustries: selectedWorld.settlement.dominantIndustries, keyResources: selectedWorld.settlement.keyResources, gearLabels, starterPackLabels, walletLabel: formatWallet(currency) }),
    attributes,
    resources: { hp: resources.resources.hp.current, mp: resources.resources.mp.current, stamina: resources.resources.stamina.current },
    knowledgeLabels: backstory.startingKnowledgeLabels,
    currency,
    gearLabels,
    starterPackLabels,
    starterSkillLabels: backstory.startingSkillLabels,
    starterTraitLabels: traits.map((trait) => humanizeId(trait.id)),
    starterNotes: [...originProfile.notes.slice(0, 2), backstory.detailText, bundle.description, selectedWorld.settlement.landRestriction.currentStanding].filter(Boolean),
    snapshot
  };
}

export function buildCharacterCreationPreview(form: CharacterCreationFormState): CharacterCreationPreview {
  if (!hasCompleteCharacterCreationSelections(form)) return buildPlaceholderPreview(form);
  try {
    const derived = deriveCharacterCreationState(form);
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
      resourceMetrics: [toMetric('hp', 'HP', derived.resources.hp), toMetric('mp', 'MP', derived.resources.mp), toMetric('stamina', 'Stamina', derived.resources.stamina)],
      attributeMetrics: buildAttributeMetrics(derived.attributes),
      starterSkills: derived.starterSkillLabels,
      starterKnowledge: derived.knowledgeLabels,
      starterTraits: derived.starterTraitLabels,
      starterGear: derived.gearLabels,
      starterPack: derived.starterPackLabels,
      walletLabel: formatWallet(derived.currency),
      starterNotes: derived.starterNotes,
      reviewNarrative: derived.reviewNarrative
    };
  } catch {
    return buildPlaceholderPreview(form);
  }
}

export function createNewGameSnapshot(form: CharacterCreationFormState): SaveSnapshot {
  const validation = validateCharacterCreationForm(form);
  if (!validation.isValid) throw new Error(Object.values(validation.errors)[0] ?? 'Complete character creation before starting the campaign.');
  if (!hasCompleteCharacterCreationSelections(form)) throw new Error('Complete character creation before starting the campaign.');
  return deriveCharacterCreationState({ ...form, playerName: form.playerName.trim() }).snapshot;
}
