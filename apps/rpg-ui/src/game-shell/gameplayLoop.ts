import { deserializeSnapshot, serializeSnapshot } from '../../../../packages/shared/persistence/src/index.js';
import { advanceClock } from '../../../../packages/shared/time/src/index.js';
import {
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type CodexEntryState,
  type ChronicleEventState,
  type CurrentActivityState,
  type InventoryStack,
  type OperationState,
  type PanelRecordState,
  type PlayerReputationState,
  type PlayerSkillState,
  type QuestJournalEntryState,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import type { GameShellNotice } from './state.js';

type GameplayActionResult = {
  snapshot: SaveSnapshot;
  notice: GameShellNotice;
};

type QuestCommandState = {
  canAccept: boolean;
  canTurnIn: boolean;
  canTrack: boolean;
  nextStep: string;
};

type LocationTemplate = {
  id: string;
  name: string;
  regionId: string;
  regionLabel: string;
  settlementId: string;
  siteLabel: string;
  worldMapId: string;
  travelTicks: number;
  staminaCost: number;
  hpCost: number;
  mpCost: number;
  arrivalActivity: CurrentActivityState;
};

const WATCH_LABELS: Record<number, string> = {
  1: 'Dawn Watch',
  2: 'High Sun',
  3: 'Dusk Watch',
  4: 'Night Watch'
};

const FLAG_SURVEY_SECTOR_PREFIX = 'gameplay.quest.ashen_reef_survey.sector.';
const FLAG_SURVEY_RUINS_CONFIRMED = 'gameplay.quest.ashen_reef_survey.ruins_confirmed';
const FLAG_PORTER_CRATES_SECURED = 'gameplay.quest.rivet_shortfall_relief.crates_secured';
const FLAG_DISCOVERY_STORMGLASS_BLOOM = 'gameplay.discovery.stormglass_bloom';
const RIVET_CRATE_ITEM_KEY = 'deepiron_rivet_crate';
const RIVET_CRATE_ITEM_ID = 'item.deepiron_rivet_crate';
const OPERATION_SURVEY_ID = 'operation.quest.ashen_reef_survey';
const OPERATION_PORTER_ID = 'operation.quest.rivet_shortfall_relief';

const LOCATION_TEMPLATES: Record<string, LocationTemplate> = {
  'location.saltmere': {
    id: 'location.saltmere',
    name: 'Aurelis',
    regionId: 'region.verdant_thalos',
    regionLabel: 'Verdant Thalos',
    settlementId: 'settlement.aurelis',
    siteLabel: 'Harbor Quarter',
    worldMapId: 'world_map.first_world',
    travelTicks: 0,
    staminaCost: 0,
    hpCost: 0,
    mpCost: 0,
    arrivalActivity: {
      id: 'activity.arrival.saltmere',
      label: 'Back In Saltmere',
      category: 'Arrival',
      detail: 'Harbor offices, guild clerks, and market rumors are within easy reach.'
    }
  },
  'location.westreach': {
    id: 'location.westreach',
    name: 'Stonevein',
    regionId: 'region.auric_marches',
    regionLabel: 'The Auric Marches',
    settlementId: 'settlement.stonevein',
    siteLabel: 'Market Ward',
    worldMapId: 'world_map.first_world',
    travelTicks: 6,
    staminaCost: 12,
    hpCost: 0,
    mpCost: 0,
    arrivalActivity: {
      id: 'activity.arrival.westreach',
      label: 'Arriving In Westreach',
      category: 'Travel',
      detail: 'Ore yards, assay clerks, and caravan labor brokers crowd the market road.'
    }
  },
  'location.ashen_reef': {
    id: 'location.ashen_reef',
    name: 'Starfall Port',
    regionId: 'region.starfall_isle',
    regionLabel: 'Starfall Isle',
    settlementId: 'settlement.starfall_port',
    siteLabel: 'Survey Anchorage',
    worldMapId: 'world_map.first_world',
    travelTicks: 4,
    staminaCost: 18,
    hpCost: 2,
    mpCost: 3,
    arrivalActivity: {
      id: 'activity.survey.ashen_reef',
      label: 'Surveying Ashen Reef',
      category: 'Exploration',
      detail: 'The crew is ready to chart sectors, mark hazards, and log ruin positions.'
    }
  },
  'location.crown_bastion': {
    id: 'location.crown_bastion',
    name: 'Sunspire Reach',
    regionId: 'region.silver_valleys',
    regionLabel: 'Silver Valleys',
    settlementId: 'settlement.sunspire_reach',
    siteLabel: 'Gate Muster',
    worldMapId: 'world_map.first_world',
    travelTicks: 8,
    staminaCost: 15,
    hpCost: 0,
    mpCost: 0,
    arrivalActivity: {
      id: 'activity.arrival.crown_bastion',
      label: 'Reporting At Crown Bastion',
      category: 'Travel',
      detail: 'Banner captains, quartermasters, and pass clerks are rotating the watch.'
    }
  }
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split(/[_-]/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTickTime(snapshot: SaveSnapshot): string {
  return `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? 'Unknown Watch'}`;
}

function getCurrentLocationId(snapshot: SaveSnapshot): string | null {
  const settlementId = snapshot.playerState.location.settlementId;

  if (settlementId === 'settlement.aurelis') {
    return 'location.saltmere';
  }

  if (settlementId === 'settlement.stonevein') {
    return 'location.westreach';
  }

  if (settlementId === 'settlement.starfall_port') {
    return 'location.ashen_reef';
  }

  if (settlementId === 'settlement.sunspire_reach') {
    return 'location.crown_bastion';
  }

  return null;
}

function getCurrentLocationName(snapshot: SaveSnapshot): string {
  const locationId = getCurrentLocationId(snapshot);

  if (!locationId) {
    return snapshot.playerState.location.siteLabel ?? 'Current location';
  }

  return LOCATION_TEMPLATES[locationId]?.name ?? humanizeId(locationId);
}

function getKnownLocation(snapshot: SaveSnapshot, locationId: string) {
  return snapshot.sessionState.knownLocations.find((entry) => entry.id === locationId);
}

function hasFlag(snapshot: SaveSnapshot, flag: string): boolean {
  return snapshot.sessionState.flags.includes(flag);
}

function ensureFlag(flags: string[], flag: string): string[] {
  return flags.includes(flag) ? flags : [...flags, flag];
}

function removeFlag(flags: string[], flag: string): string[] {
  return flags.filter((entry) => entry !== flag);
}

function getSurveySectorCount(snapshot: SaveSnapshot): number {
  return [1, 2, 3].filter((index) =>
    hasFlag(snapshot, `${FLAG_SURVEY_SECTOR_PREFIX}${index}`)
  ).length;
}

function isSurveyComplete(snapshot: SaveSnapshot): boolean {
  return getSurveySectorCount(snapshot) >= 3 && hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
}

function hasRivetCargo(snapshot: SaveSnapshot): boolean {
  return hasFlag(snapshot, FLAG_PORTER_CRATES_SECURED);
}

function findQuest(snapshot: SaveSnapshot, questId: string): QuestJournalEntryState | undefined {
  return snapshot.sessionState.questJournal.find((entry) => entry.id === questId);
}

function isQuestReadyToTurnIn(snapshot: SaveSnapshot, questId: string): boolean {
  const quest = findQuest(snapshot, questId);

  if (!quest || quest.category !== 'active') {
    return false;
  }

  if (questId === 'quest.ashen_reef_survey') {
    return isSurveyComplete(snapshot) && getCurrentLocationId(snapshot) === 'location.saltmere';
  }

  if (questId === 'quest.rivet_shortfall_relief') {
    return hasRivetCargo(snapshot) && getCurrentLocationId(snapshot) === 'location.saltmere';
  }

  return false;
}

function createNotice(
  tone: GameShellNotice['tone'],
  title: string,
  detail: string
): GameShellNotice {
  return {
    tone,
    title,
    detail
  };
}

function appendNotification(
  snapshot: SaveSnapshot,
  title: string,
  detail: string,
  tone: GameShellNotice['tone']
) {
  snapshot.sessionState.notifications = [
    {
      id: `notification.${snapshot.clock.tick}.${snapshot.sessionState.notifications.length + 1}`,
      title,
      detail,
      timeLabel: formatTickTime(snapshot),
      tone
    },
    ...snapshot.sessionState.notifications
  ].slice(0, 8);
}

function appendChronicle(snapshot: SaveSnapshot, entry: ChronicleEventState) {
  snapshot.sessionState.chronicle = [entry, ...snapshot.sessionState.chronicle].slice(0, 48);
}

function advanceSnapshotClock(snapshot: SaveSnapshot, ticks: number) {
  const nextClock = advanceClock(snapshot.clock, ticks);

  snapshot.clock = nextClock;
  snapshot.capturedAtTick = nextClock.tick;
  snapshot.playerState.saveMeta.totalPlayTicks += ticks;
}

function clampResource(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function applyResourceDelta(
  snapshot: SaveSnapshot,
  delta: Partial<Record<'hp' | 'mp' | 'stamina', number>>
) {
  snapshot.playerState.resources.hp.current = clampResource(
    snapshot.playerState.resources.hp.current + (delta.hp ?? 0),
    0,
    snapshot.playerState.resources.hp.max
  );
  snapshot.playerState.resources.mp.current = clampResource(
    snapshot.playerState.resources.mp.current + (delta.mp ?? 0),
    0,
    snapshot.playerState.resources.mp.max
  );
  snapshot.playerState.resources.stamina.current = clampResource(
    snapshot.playerState.resources.stamina.current + (delta.stamina ?? 0),
    0,
    snapshot.playerState.resources.stamina.max
  );
}

function addCurrency(
  snapshot: SaveSnapshot,
  delta: { gold?: number; silver?: number; copper?: number }
) {
  snapshot.playerState.currency = {
    gold: Math.max(0, snapshot.playerState.currency.gold + (delta.gold ?? 0)),
    silver: Math.max(0, snapshot.playerState.currency.silver + (delta.silver ?? 0)),
    copper: Math.max(0, snapshot.playerState.currency.copper + (delta.copper ?? 0))
  };
}

function spendCurrency(
  snapshot: SaveSnapshot,
  delta: { gold?: number; silver?: number; copper?: number }
): boolean {
  const nextGold = snapshot.playerState.currency.gold - (delta.gold ?? 0);
  const nextSilver = snapshot.playerState.currency.silver - (delta.silver ?? 0);
  const nextCopper = snapshot.playerState.currency.copper - (delta.copper ?? 0);

  if (nextGold < 0 || nextSilver < 0 || nextCopper < 0) {
    return false;
  }

  snapshot.playerState.currency = {
    gold: nextGold,
    silver: nextSilver,
    copper: nextCopper
  };

  return true;
}

function addOrUpdateSkill(
  skills: PlayerSkillState[],
  skillId: string,
  rankDelta: number
): PlayerSkillState[] {
  const existing = skills.find((entry) => entry.id === skillId);

  if (!existing) {
    return [
      ...skills,
      {
        id: skillId,
        rank: rankDelta,
        source: 'trained'
      }
    ].sort((left, right) => left.id.localeCompare(right.id));
  }

  return skills.map((entry) =>
    entry.id === skillId
      ? {
          ...entry,
          rank: entry.rank + rankDelta,
          source: 'trained'
        }
      : entry
  );
}

function getStandingLabel(score: number): string {
  if (score >= 75) {
    return 'Honored';
  }

  if (score >= 50) {
    return 'Trusted';
  }

  if (score >= 25) {
    return 'Known';
  }

  if (score >= 10) {
    return 'Noted';
  }

  return 'Unproven';
}

function addOrUpdateReputation(
  reputation: PlayerReputationState[],
  id: string,
  label: string,
  delta: number,
  effects: string[]
): PlayerReputationState[] {
  const existing = reputation.find((entry) => entry.id === id);

  if (!existing) {
    const score = Math.max(0, delta);

    return [
      ...reputation,
      {
        id,
        label,
        score,
        standingLabel: getStandingLabel(score),
        effects
      }
    ].sort((left, right) => left.label.localeCompare(right.label));
  }

  const score = Math.max(0, existing.score + delta);

  return reputation.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          score,
          standingLabel: getStandingLabel(score),
          effects: entry.effects.length > 0 ? entry.effects : effects
        }
      : entry
  );
}

function addInventoryStack(
  inventory: SaveSnapshot['playerState']['inventory'],
  stack: InventoryStack
) {
  for (const bag of inventory.bags) {
    const existing = bag.stacks.find(
      (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
    );

    if (existing) {
      existing.quantity += stack.quantity;
      return;
    }
  }

  const openBag = inventory.bags.find((bag) => bag.stacks.length < bag.slotCapacity);

  if (openBag) {
    openBag.stacks.push({ ...stack });
    return;
  }

  const overflowExisting = inventory.overflow.find(
    (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
  );

  if (overflowExisting) {
    overflowExisting.quantity += stack.quantity;
    return;
  }

  inventory.overflow.push({ ...stack });
}

function removeInventoryQuantity(
  inventory: SaveSnapshot['playerState']['inventory'],
  itemKey: string,
  quantity: number
): boolean {
  let remaining = quantity;

  for (const bag of inventory.bags) {
    for (let index = bag.stacks.length - 1; index >= 0 && remaining > 0; index -= 1) {
      const stack = bag.stacks[index];

      if (!stack || stack.itemKey !== itemKey) {
        continue;
      }

      const removed = Math.min(stack.quantity, remaining);
      stack.quantity -= removed;
      remaining -= removed;

      if (stack.quantity <= 0) {
        bag.stacks.splice(index, 1);
      }
    }
  }

  for (let index = inventory.overflow.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const stack = inventory.overflow[index];

    if (!stack || stack.itemKey !== itemKey) {
      continue;
    }

    const removed = Math.min(stack.quantity, remaining);
    stack.quantity -= removed;
    remaining -= removed;

    if (stack.quantity <= 0) {
      inventory.overflow.splice(index, 1);
    }
  }

  return remaining === 0;
}

function applyExperience(snapshot: SaveSnapshot, xpDelta: number) {
  let nextCurrent = snapshot.playerState.resources.xp.current + xpDelta;
  let nextTotal = snapshot.playerState.resources.xp.total + xpDelta;
  let nextThreshold = snapshot.playerState.resources.xp.toNextLevel;
  let nextLevel = snapshot.playerState.progression.level;
  let nextClassLevel = snapshot.playerState.progression.classLevel;
  let nextAttributePoints = snapshot.playerState.progression.unspentAttributePoints;
  let nextSkillPoints = snapshot.playerState.progression.unspentSkillPoints;
  let leveledUp = false;

  while (nextCurrent >= nextThreshold) {
    nextCurrent -= nextThreshold;
    nextLevel += 1;
    nextClassLevel += 1;
    nextAttributePoints += 1;
    nextSkillPoints += 1;
    nextThreshold = Math.round(nextThreshold * 1.25);
    leveledUp = true;
  }

  snapshot.playerState.progression = {
    level: nextLevel,
    classLevel: nextClassLevel,
    unspentAttributePoints: nextAttributePoints,
    unspentSkillPoints: nextSkillPoints
  };
  snapshot.playerState.resources.xp = {
    current: nextCurrent,
    total: nextTotal,
    toNextLevel: nextThreshold
  };

  if (!leveledUp) {
    return;
  }

  const nextOriginProfile = resolvePlayerOriginProfile(
    snapshot.playerState.coreData,
    snapshot.playerState.progression
  );
  const resourceResolution = resolvePlayerResources(
    {
      playerId: snapshot.playerState.playerId,
      attributes: snapshot.playerState.attributes,
      resources: snapshot.playerState.resources,
      originProfile: nextOriginProfile,
      equipment: snapshot.playerState.equipment,
      resourceRuntime: snapshot.playerState.resourceRuntime
    },
    [],
    snapshot.clock.tick
  );

  snapshot.playerState.originProfile = nextOriginProfile;
  snapshot.playerState.resources = resourceResolution.resources;
  snapshot.playerState.resourceRuntime = resourceResolution.resourceRuntime;
}

function makeChronicleEntry(
  snapshot: SaveSnapshot,
  category: ChronicleEventState['category'],
  title: string,
  summary: string,
  statusLabel: string | undefined,
  entities: string[],
  results: string[],
  statChanges: string[],
  tags: string[]
): ChronicleEventState {
  return {
    id: `chronicle.${snapshot.clock.tick}.${snapshot.sessionState.chronicle.length + 1}`,
    category,
    title,
    timeLabel: formatTickTime(snapshot),
    summary,
    entities,
    results,
    statChanges,
    tags,
    ...(statusLabel ? { statusLabel } : {})
  };
}

function upsertOperation(operations: OperationState[], nextOperation: OperationState): OperationState[] {
  const existing = operations.find((entry) => entry.id === nextOperation.id);

  if (!existing) {
    return [nextOperation, ...operations];
  }

  return operations.map((entry) => (entry.id === nextOperation.id ? nextOperation : entry));
}

function removeOperation(operations: OperationState[], operationId: string): OperationState[] {
  return operations.filter((entry) => entry.id !== operationId);
}

function buildSurveyOperation(snapshot: SaveSnapshot): OperationState {
  const sectors = getSurveySectorCount(snapshot);
  const ruinsConfirmed = hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
  const progress = ruinsConfirmed ? 100 : sectors * 25;
  const stage = ruinsConfirmed
    ? 'Chart packet ready for harbor turn-in'
    : `Survey sectors logged: ${sectors} / 3`;

  return {
    id: OPERATION_SURVEY_ID,
    title: 'Ashen Reef Survey',
    stage,
    progress,
    etaLabel: ruinsConfirmed ? 'Ready now' : `${Math.max(1, 4 - sectors)} shift(s)`,
    owner: snapshot.playerState.coreData.playerName,
    output: ruinsConfirmed ? 'Verified reef chart packet' : 'Field chart updates',
    priority: 'High'
  };
}

function buildPorterOperation(snapshot: SaveSnapshot): OperationState {
  const secured = hasRivetCargo(snapshot);
  const inSaltmere = getCurrentLocationId(snapshot) === 'location.saltmere';

  return {
    id: OPERATION_PORTER_ID,
    title: 'Rivet Shortfall Relief',
    stage: secured
      ? inSaltmere
        ? 'Cargo delivered to Saltmere drydock'
        : 'Cargo secured in Westreach, return trip underway'
      : 'Procurement trip underway',
    progress: secured ? (inSaltmere ? 100 : 70) : 35,
    etaLabel: secured ? (inSaltmere ? 'Ready now' : '1 route leg') : '1 work shift',
    owner: snapshot.playerState.coreData.playerName,
    output: secured ? 'Six deepiron rivet crates' : 'Procurement charter',
    priority: 'High'
  };
}

function syncQuestJournal(snapshot: SaveSnapshot): QuestJournalEntryState[] {
  return snapshot.sessionState.questJournal.map((entry) => {
    if (entry.id === 'quest.ashen_reef_survey') {
      const sectorCount = getSurveySectorCount(snapshot);
      const ruinsConfirmed = hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
      const readyToTurnIn = isQuestReadyToTurnIn(snapshot, entry.id);
      const tracked = snapshot.sessionState.trackedQuestId === entry.id;

      if (entry.category === 'completed') {
        return {
          ...entry,
          tracked: false,
          statusLabel: 'Turned in',
          objectives: [
            'Survey reef lanes: 3 / 3 sectors complete',
            'Confirm ruin markers: complete',
            'Return chart packet to Saltmere Harbor Office'
          ]
        };
      }

      return {
        ...entry,
        tracked,
        statusLabel: tracked
          ? readyToTurnIn
            ? 'Tracked - Ready to turn in'
            : 'Tracked'
          : readyToTurnIn
            ? 'Ready to turn in'
            : 'In progress',
        objectives: [
          `Survey reef lanes: ${sectorCount} / 3 sectors complete`,
          `Confirm ruin markers: ${ruinsConfirmed ? 'complete' : 'pending'}`,
          readyToTurnIn
            ? 'Return chart packet to Saltmere Harbor Office: ready to turn in'
            : 'Return chart packet to Saltmere Harbor Office'
        ]
      };
    }

    if (entry.id === 'quest.rivet_shortfall_relief') {
      const tracked = snapshot.sessionState.trackedQuestId === entry.id;
      const secured = hasRivetCargo(snapshot);
      const readyToTurnIn = isQuestReadyToTurnIn(snapshot, entry.id);

      if (entry.category === 'completed') {
        return {
          ...entry,
          tracked: false,
          statusLabel: 'Turned in',
          objectives: [
            'Acquire rivets: 6 / 6 crates',
            'Escort shipment for optional bonus',
            'Return cargo to Saltmere Drydock'
          ]
        };
      }

      if (entry.category === 'contracts') {
        return {
          ...entry,
          tracked,
          statusLabel: tracked ? 'Tracked - Open contract' : 'Open contract'
        };
      }

      return {
        ...entry,
        tracked,
        statusLabel: tracked
          ? readyToTurnIn
            ? 'Tracked - Ready to turn in'
            : secured
              ? 'Tracked - Cargo secured'
              : 'Tracked - Procurement active'
          : readyToTurnIn
            ? 'Ready to turn in'
            : secured
              ? 'Cargo secured'
              : 'In progress',
        objectives: [
          `Acquire rivets: ${secured ? '6 / 6 crates' : '0 / 6 crates'}`,
          `Escort shipment for optional bonus: ${secured ? 'cargo loaded' : 'pending'}`,
          readyToTurnIn
            ? 'Return cargo to Saltmere Drydock: ready to turn in'
            : 'Return cargo to Saltmere Drydock'
        ]
      };
    }

    return {
      ...entry,
      tracked: snapshot.sessionState.trackedQuestId === entry.id
    };
  });
}

function syncWorldRecords(snapshot: SaveSnapshot): PanelRecordState[] {
  const surveyComplete = isSurveyComplete(snapshot);
  const rivetSecured = hasRivetCargo(snapshot);
  const rivetCompleted = findQuest(snapshot, 'quest.rivet_shortfall_relief')?.category === 'completed';

  return snapshot.sessionState.worldRecords.map((record) => {
    if (record.id === 'route.aurelis_starfall_port' && surveyComplete) {
      return {
        ...record,
        status: 'Risk: charted',
        summary: 'The lane is still dangerous, but the major reefs and ruin markers are now charted.',
        detailEntries: [
          { label: 'Distance', value: '83 nautical miles' },
          { label: 'Travel Time', value: '13 hours by cutter' },
          { label: 'Risk', value: 'Moderate after verified charting' }
        ]
      };
    }

    if (record.id === 'travel.scout_starfall_port') {
      return {
        ...record,
        status: surveyComplete
          ? 'Survey complete'
          : getCurrentLocationId(snapshot) === 'location.ashen_reef'
            ? 'On site'
            : 'Ready to depart',
        summary: surveyComplete
          ? 'The charter has enough field data to finalize and return for payment.'
          : record.summary
      };
    }

    if (record.id === 'market.iron_rivets') {
      if (rivetCompleted) {
        return {
          ...record,
          status: 'Stabilizing',
          summary: 'Emergency cargo eased the drydock shortage, softening immediate price pressure.',
          detailEntries: [
            { label: 'Price', value: '39 crown / crate' },
            { label: 'Demand', value: 'High' },
            { label: 'Supply', value: 'Recovering' }
          ]
        };
      }

      if (rivetSecured) {
        return {
          ...record,
          status: 'Relief cargo inbound',
          summary: 'Six crates are already moving toward the Saltmere drydock on emergency priority.',
          detailEntries: record.detailEntries
        };
      }
    }

    return record;
  });
}

function syncActivityRecords(snapshot: SaveSnapshot): PanelRecordState[] {
  const surveyQuest = findQuest(snapshot, 'quest.ashen_reef_survey');
  const rivetQuest = findQuest(snapshot, 'quest.rivet_shortfall_relief');
  const surveyReady = isQuestReadyToTurnIn(snapshot, 'quest.ashen_reef_survey');
  const rivetReady = isQuestReadyToTurnIn(snapshot, 'quest.rivet_shortfall_relief');

  return snapshot.sessionState.activityRecords.map((record) => {
    if (record.id === 'contract.ashen_reef') {
      return {
        ...record,
        status:
          surveyQuest?.category === 'completed'
            ? 'Completed'
            : surveyReady
              ? 'Ready to turn in'
              : surveyQuest?.category === 'active'
                ? 'In progress'
                : 'Available'
      };
    }

    if (record.id === 'trade.amber_salt_convoy' && rivetQuest?.category === 'active') {
      return {
        ...record,
        status: rivetReady
          ? 'Cargo returned'
          : hasRivetCargo(snapshot)
            ? 'Return leg active'
            : 'Loading relief cargo',
        summary: hasRivetCargo(snapshot)
          ? 'The convoy charter is now focused on returning rivets to Saltmere as fast as possible.'
          : 'Westreach handlers are staging deepiron rivets for an urgent drydock run.'
      };
    }

    return record;
  });
}

function syncCodexEntries(snapshot: SaveSnapshot): CodexEntryState[] {
  return snapshot.sessionState.codexEntries.map((entry) => {
    if (entry.id !== 'flora.unknown_bloom' || !hasFlag(snapshot, FLAG_DISCOVERY_STORMGLASS_BLOOM)) {
      return entry;
    }

    return {
      ...entry,
      title: 'Stormglass Bloom',
      subtitle: 'Catalogued reef flora',
      status: 'Catalogued',
      summary: 'A reef-edge bloom whose crystalline petals harden under salt spray and dusk light.',
      tags: ['Glasswater', 'Alchemy', 'Flora'],
      habitat: 'Salt-lashed reef shelves with intermittent ruin shade',
      uses: 'Lamp-glass flux, delicate varnish blends, and survey marking dyes',
      valueDescription: 'Moderate value when fresh, high value when preserved for alchemical buyers',
      regionTags: ['Glasswater', 'Sable Coast'],
      locked: false
    };
  });
}

function syncQuestIds(snapshot: SaveSnapshot) {
  snapshot.playerState.activeQuestIds = snapshot.sessionState.questJournal
    .filter((entry) => entry.category === 'active')
    .map((entry) => entry.id);
  snapshot.playerState.completedQuestIds = snapshot.sessionState.questJournal
    .filter((entry) => entry.category === 'completed')
    .map((entry) => entry.id);
}

function syncSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  const nextSnapshot = cloneSnapshot(snapshot);

  nextSnapshot.sessionState.questJournal = syncQuestJournal(nextSnapshot);
  nextSnapshot.sessionState.worldRecords = syncWorldRecords(nextSnapshot);
  nextSnapshot.sessionState.activityRecords = syncActivityRecords(nextSnapshot);
  nextSnapshot.sessionState.codexEntries = syncCodexEntries(nextSnapshot);
  syncQuestIds(nextSnapshot);

  if (
    nextSnapshot.sessionState.trackedQuestId &&
    !nextSnapshot.sessionState.questJournal.some(
      (entry) => entry.id === nextSnapshot.sessionState.trackedQuestId && entry.category !== 'failed'
    )
  ) {
    nextSnapshot.sessionState.trackedQuestId = null;
  }

  return nextSnapshot;
}

function addDiscoveryEntry(snapshot: SaveSnapshot) {
  const exists = snapshot.playerState.discoveryChronicle.entries.some(
    (entry) => entry.id === 'discovery.stormglass_bloom'
  );

  if (exists) {
    return;
  }

  snapshot.playerState.discoveryChronicle.entries = [
    {
      id: 'discovery.stormglass_bloom',
      codexEntryId: 'flora.unknown_bloom',
      category: 'flora',
      title: 'Stormglass Bloom',
      discoveredAtTick: snapshot.clock.tick,
      discoveredAtLabel: formatTickTime(snapshot),
      regionLabel: 'Glasswater',
      sourceType: 'survey',
      sourceId: 'quest.ashen_reef_survey',
      notes: [
        'Logged during the Ashen Reef survey while the crew marked ruin shelves.',
        'The petals refract storm light and dry into brittle crystalline veins.'
      ]
    },
    ...snapshot.playerState.discoveryChronicle.entries
  ];
  snapshot.playerState.discoveryChronicle.lastUpdatedTick = snapshot.clock.tick;
  snapshot.sessionState.flags = ensureFlag(snapshot.sessionState.flags, FLAG_DISCOVERY_STORMGLASS_BLOOM);
}

function makeQuestState(snapshot: SaveSnapshot, questId: string): QuestCommandState {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This quest is not available in the current session.'
    };
  }

  if (quest.category === 'contracts') {
    return {
      canAccept: true,
      canTurnIn: false,
      canTrack: true,
      nextStep: 'Accept this contract to move it into the active quest ledger.'
    };
  }

  if (quest.category === 'completed') {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This contract has already been resolved.'
    };
  }

  if (quest.category === 'failed') {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This contract is no longer actionable.'
    };
  }

  if (questId === 'quest.ashen_reef_survey') {
    const sectorCount = getSurveySectorCount(snapshot);

    if (getCurrentLocationId(snapshot) !== 'location.ashen_reef' && sectorCount === 0) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep: 'Travel from Saltmere to Ashen Reef, then advance a work shift to begin charting.'
      };
    }

    if (!isSurveyComplete(snapshot)) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep:
          getCurrentLocationId(snapshot) === 'location.ashen_reef'
            ? 'Advance work shifts at Ashen Reef until all three sectors and ruin markers are logged.'
            : 'Return to Ashen Reef to finish the survey packet.'
      };
    }

    return {
      canAccept: false,
      canTurnIn: isQuestReadyToTurnIn(snapshot, questId),
      canTrack: true,
      nextStep:
        getCurrentLocationId(snapshot) === 'location.saltmere'
          ? 'Turn the chart packet in at Saltmere Harbor Office for payout and discovery credit.'
          : 'Return to Saltmere to turn in the completed chart packet.'
    };
  }

  if (questId === 'quest.rivet_shortfall_relief') {
    if (!hasRivetCargo(snapshot)) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep:
          getCurrentLocationId(snapshot) === 'location.westreach'
            ? 'Advance a work shift in Westreach to secure the emergency rivet crates.'
            : 'Travel to Westreach to secure the emergency rivet cargo.'
      };
    }

    return {
      canAccept: false,
      canTurnIn: isQuestReadyToTurnIn(snapshot, questId),
      canTrack: true,
      nextStep:
        getCurrentLocationId(snapshot) === 'location.saltmere'
          ? 'Turn the cargo in at Saltmere Drydock for payment and standing.'
          : 'Escort the cargo back to Saltmere for turn-in.'
    };
  }

  return {
    canAccept: false,
    canTurnIn: false,
    canTrack: true,
    nextStep: 'Track this quest and review its objectives from the quest detail panel.'
  };
}

export function getQuestCommandState(snapshot: SaveSnapshot, questId: string): QuestCommandState {
  return makeQuestState(snapshot, questId);
}

export function getCurrentLocationLabel(snapshot: SaveSnapshot): string {
  return getCurrentLocationName(snapshot);
}

export function getKnownLocationId(snapshot: SaveSnapshot): string | null {
  return getCurrentLocationId(snapshot);
}

export function acceptQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category !== 'contracts') {
    return {
      snapshot,
      notice: createNotice('warning', 'Contract Already Active', `${quest.title} is already in the active ledger.`)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.questJournal = nextSnapshot.sessionState.questJournal.map((entry) =>
    entry.id === questId
      ? {
          ...entry,
          category: 'active',
          statusLabel: 'Accepted'
        }
      : entry
  );
  nextSnapshot.sessionState.trackedQuestId = questId;
  nextSnapshot.sessionState.currentActivity = {
    id: `activity.prepare.${questId}`,
    label: `Preparing ${quest.title}`,
    category: 'Contract',
    detail: quest.summary
  };
  appendNotification(nextSnapshot, 'Contract accepted', `${quest.title} moved into the active quest ledger.`, 'accent');
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `${nextSnapshot.playerState.coreData.playerName} accepted ${quest.title}`,
      `The contract board cleared ${quest.title} into the active ledger.`,
      'Accepted',
      [nextSnapshot.playerState.coreData.playerName, quest.title],
      ['Quest moved to active'],
      ['Tracked quest updated'],
      ['Contract', quest.regionLabel]
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Contract Accepted', `${quest.title} is now active and tracked.`)
  };
}

export function toggleTrackedQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category === 'completed' || quest.category === 'failed') {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Cannot Be Tracked', `${quest.title} is no longer an active objective.`)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.trackedQuestId =
    nextSnapshot.sessionState.trackedQuestId === questId ? null : questId;

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice:
      nextSnapshot.sessionState.trackedQuestId === questId
        ? createNotice('accent', 'Quest Tracked', `${quest.title} now anchors the top-bar objective display.`)
        : createNotice('neutral', 'Quest Untracked', `${quest.title} was removed from the tracked objective slot.`)
  };
}

export function setCurrentActivityFromRecord(
  snapshot: SaveSnapshot,
  recordId: string
): GameplayActionResult {
  const record = snapshot.sessionState.activityRecords.find((entry) => entry.id === recordId);

  if (!record) {
    return {
      snapshot,
      notice: createNotice('warning', 'Activity Missing', 'That activity record is not available in the current session.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.currentActivity = {
    id: record.id,
    label: record.title,
    category: humanizeId(record.sectionId),
    detail: record.summary
  };
  appendNotification(nextSnapshot, 'Current activity set', `${record.title} is now the focus of the current shift.`, 'accent');

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('accent', 'Current Activity Updated', `${record.title} is now set as the active process.`)
  };
}

export function travelToKnownLocation(
  snapshot: SaveSnapshot,
  locationId: string
): GameplayActionResult {
  const target = LOCATION_TEMPLATES[locationId];
  const knownLocation = getKnownLocation(snapshot, locationId);

  if (!target) {
    return {
      snapshot,
      notice: createNotice('warning', 'Travel Target Unknown', 'That destination does not yet have travel rules wired into the current vertical slice.')
    };
  }

  if (!knownLocation?.known) {
    return {
      snapshot,
      notice: createNotice('warning', 'Destination Unknown', 'That location is not yet discovered in the current session.')
    };
  }

  const currentLocationId = getCurrentLocationId(snapshot);

  if (currentLocationId === locationId) {
    return {
      snapshot,
      notice: createNotice('warning', 'Already There', `${target.name} is already the current destination.`)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  advanceSnapshotClock(nextSnapshot, target.travelTicks);
  applyResourceDelta(nextSnapshot, {
    hp: -target.hpCost,
    mp: -target.mpCost,
    stamina: -target.staminaCost
  });
  nextSnapshot.playerState.regionId = target.regionId;
  nextSnapshot.playerState.location = {
    settlementId: target.settlementId,
    siteLabel: target.siteLabel,
    worldMapId: target.worldMapId,
    knownSettlementIds: Array.from(
      new Set([...nextSnapshot.playerState.location.knownSettlementIds, target.settlementId])
    )
  };
  nextSnapshot.playerState.discoveredRegions = Array.from(
    new Set([...nextSnapshot.playerState.discoveredRegions, target.regionId])
  );
  nextSnapshot.sessionState.currentActivity = target.arrivalActivity;
  nextSnapshot.sessionState.knownLocations = nextSnapshot.sessionState.knownLocations.map((entry) =>
    entry.id === locationId ? { ...entry, known: true } : entry
  );

  if (
    nextSnapshot.sessionState.trackedQuestId === 'quest.ashen_reef_survey' &&
    locationId === 'location.ashen_reef'
  ) {
    nextSnapshot.sessionState.operations = upsertOperation(
      nextSnapshot.sessionState.operations,
      buildSurveyOperation(nextSnapshot)
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.survey.ashen_reef',
      label: 'Surveying Ashen Reef',
      category: 'Exploration',
      detail: 'The charter vessel is in position to begin charting reef sectors.'
    };
  }

  if (
    nextSnapshot.sessionState.trackedQuestId === 'quest.rivet_shortfall_relief' &&
    locationId === 'location.westreach'
  ) {
    nextSnapshot.sessionState.operations = upsertOperation(
      nextSnapshot.sessionState.operations,
      buildPorterOperation(nextSnapshot)
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.procure.rivets',
      label: 'Securing Rivet Crates',
      category: 'Trade',
      detail: 'Westreach brokers are preparing deepiron stock for the emergency Saltmere order.'
    };
  }

  appendNotification(
    nextSnapshot,
    'Travel complete',
    `${nextSnapshot.playerState.coreData.playerName} reached ${target.name}.`,
    'accent'
  );
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'travel',
      `${nextSnapshot.playerState.coreData.playerName} reached ${target.name}`,
      `${target.name} is now the active location after ${target.travelTicks} tick(s) of travel.`,
      target.travelTicks > 0 ? `${target.travelTicks} ticks` : undefined,
      [nextSnapshot.playerState.coreData.playerName, target.name],
      ['Travel leg completed'],
      [
        target.staminaCost > 0 ? `Stamina ${-target.staminaCost}` : 'No stamina cost',
        target.hpCost > 0 ? `HP ${-target.hpCost}` : 'No HP loss'
      ],
      ['Travel', target.regionLabel]
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Travel Complete', `${target.name} is now the active location.`)
  };
}

export function advanceCurrentActivity(snapshot: SaveSnapshot): GameplayActionResult {
  const trackedQuestId = snapshot.sessionState.trackedQuestId;

  if (trackedQuestId === 'quest.ashen_reef_survey' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.ashen_reef') {
      return {
        snapshot,
        notice: createNotice('warning', 'Wrong Location', 'Travel to Ashen Reef before advancing the survey work.')
      };
    }

    const nextSnapshot = cloneSnapshot(snapshot);
    advanceSnapshotClock(nextSnapshot, 2);
    applyResourceDelta(nextSnapshot, { stamina: -10, mp: -3 });

    const sectorsComplete = getSurveySectorCount(nextSnapshot);

    if (sectorsComplete < 3) {
      nextSnapshot.sessionState.flags = ensureFlag(
        nextSnapshot.sessionState.flags,
        `${FLAG_SURVEY_SECTOR_PREFIX}${sectorsComplete + 1}`
      );
      nextSnapshot.playerState.skills = addOrUpdateSkill(
        nextSnapshot.playerState.skills,
        'skill.knowledge.universal',
        1
      );
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildSurveyOperation(nextSnapshot)
      );
      appendNotification(
        nextSnapshot,
        'Survey sector logged',
        `Ashen Reef sector ${sectorsComplete + 1} is now charted and filed into the packet.`,
        'success'
      );
      appendChronicle(
        nextSnapshot,
        makeChronicleEntry(
          nextSnapshot,
          'discovery',
          `Survey sector ${sectorsComplete + 1} logged at Ashen Reef`,
          'The crew marked channels, breakers, and draft-safe approaches for the charter packet.',
          `Sector ${sectorsComplete + 1} / 3`,
          [nextSnapshot.playerState.coreData.playerName, 'Ashen Reef'],
          ['Survey packet expanded'],
          ['Navigation +1', 'Stamina -10', 'MP -3'],
          ['Exploration', 'Survey']
        )
      );

      return {
        snapshot: syncSnapshot(nextSnapshot),
        notice: createNotice('success', 'Survey Progress', `Ashen Reef sector ${sectorsComplete + 1} is now charted.`)
      };
    }

    if (!hasFlag(nextSnapshot, FLAG_SURVEY_RUINS_CONFIRMED)) {
      nextSnapshot.sessionState.flags = ensureFlag(
        nextSnapshot.sessionState.flags,
        FLAG_SURVEY_RUINS_CONFIRMED
      );
      nextSnapshot.playerState.skills = addOrUpdateSkill(
        nextSnapshot.playerState.skills,
        'skill.resource.identify.flora',
        1
      );
      addDiscoveryEntry(nextSnapshot);
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildSurveyOperation(nextSnapshot)
      );
      nextSnapshot.sessionState.currentActivity = {
        id: 'activity.return.survey_packet',
        label: 'Returning Chart Packet',
        category: 'Contract',
        detail: 'The field chart is complete and ready to be taken back to Saltmere Harbor Office.'
      };
      appendNotification(
        nextSnapshot,
        'Survey packet complete',
        'All sectors and ruin markers are logged. Return to Saltmere for payment and codex credit.',
        'accent'
      );
      appendChronicle(
        nextSnapshot,
        makeChronicleEntry(
          nextSnapshot,
          'discovery',
          'Ashen Reef survey packet completed',
          'The crew verified the ruin markers and logged a new flora sample for the reef archive.',
          'Packet complete',
          [nextSnapshot.playerState.coreData.playerName, 'Ashen Reef', 'Stormglass Bloom'],
          ['Chart packet finalized', 'New discovery recorded'],
          ['Survival +1', 'Stamina -10', 'MP -3'],
          ['Exploration', 'Discovery', 'Survey']
        )
      );

      return {
        snapshot: syncSnapshot(nextSnapshot),
        notice: createNotice('accent', 'Survey Packet Ready', 'Return to Saltmere Harbor Office to turn in the completed chart packet.')
      };
    }
  }

  if (trackedQuestId === 'quest.rivet_shortfall_relief' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.westreach') {
      return {
        snapshot,
        notice: createNotice('warning', 'Wrong Location', 'Travel to Westreach before securing the rivet shipment.')
      };
    }

    if (hasRivetCargo(snapshot)) {
      return {
        snapshot,
        notice: createNotice('warning', 'Cargo Already Secured', 'The deepiron crates are already loaded. Return to Saltmere to turn them in.')
      };
    }

    const nextSnapshot = cloneSnapshot(snapshot);
    advanceSnapshotClock(nextSnapshot, 2);
    applyResourceDelta(nextSnapshot, { stamina: -7 });
    nextSnapshot.sessionState.flags = ensureFlag(
      nextSnapshot.sessionState.flags,
      FLAG_PORTER_CRATES_SECURED
    );
    addInventoryStack(nextSnapshot.playerState.inventory, {
      itemId: RIVET_CRATE_ITEM_ID,
      itemKey: RIVET_CRATE_ITEM_KEY,
      quantity: 6
    });
    nextSnapshot.playerState.skills = addOrUpdateSkill(
      nextSnapshot.playerState.skills,
      'skill.resource.identify.minerals',
      1
    );
    nextSnapshot.sessionState.operations = upsertOperation(
      nextSnapshot.sessionState.operations,
      buildPorterOperation(nextSnapshot)
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.return.rivets',
      label: 'Escorting Rivet Cargo',
      category: 'Trade',
      detail: 'The crates are loaded and need to be returned to Saltmere Drydock.'
    };
    appendNotification(
      nextSnapshot,
      'Rivet cargo secured',
      'Six deepiron crates are loaded for the emergency Saltmere drydock run.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'trade',
        'Deepiron rivet cargo secured in Westreach',
        'The emergency order is packed and ready for immediate return to Saltmere.',
        'Cargo loaded',
        [nextSnapshot.playerState.coreData.playerName, 'Westreach', 'Saltmere Drydock'],
        ['Cargo secured', 'Return leg prepared'],
        ['Mercantile +1', 'Stamina -7'],
        ['Trade', 'Contract']
      )
    );

    return {
      snapshot: syncSnapshot(nextSnapshot),
      notice: createNotice('success', 'Cargo Secured', 'The rivet shipment is loaded. Return to Saltmere to turn it in.')
    };
  }

  if (!snapshot.sessionState.currentActivity) {
    return {
      snapshot,
      notice: createNotice('warning', 'No Active Process', 'Set a current activity or track a quest before advancing a work shift.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  advanceSnapshotClock(nextSnapshot, 2);
  applyResourceDelta(nextSnapshot, { stamina: -6 });
  appendNotification(
    nextSnapshot,
    'Shift advanced',
    `${nextSnapshot.sessionState.currentActivity.label} moved forward through another work shift.`,
    'neutral'
  );
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `Shift advanced for ${nextSnapshot.sessionState.currentActivity.label}`,
      'Time passed on the current assignment without a major milestone event.',
      'Routine progress',
      [nextSnapshot.playerState.coreData.playerName, nextSnapshot.sessionState.currentActivity.label],
      ['Routine progress'],
      ['Stamina -6', 'Time +2 ticks'],
      ['Activity']
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('neutral', 'Shift Advanced', `${nextSnapshot.sessionState.currentActivity.label} advanced through another work shift.`)
  };
}

export function restAtCurrentSettlement(snapshot: SaveSnapshot): GameplayActionResult {
  const locationId = getCurrentLocationId(snapshot);

  if (!locationId) {
    return {
      snapshot,
      notice: createNotice('warning', 'Rest Unavailable', 'A proper rest stop is only available inside a settlement for this first playable loop.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);

  if (!spendCurrency(nextSnapshot, { silver: 4 })) {
    return {
      snapshot,
      notice: createNotice('warning', 'Not Enough Coin', 'Resting requires 4 silver for board, food, and a secure bunk.')
    };
  }

  advanceSnapshotClock(nextSnapshot, 4);
  nextSnapshot.playerState.resources.hp.current = nextSnapshot.playerState.resources.hp.max;
  nextSnapshot.playerState.resources.mp.current = nextSnapshot.playerState.resources.mp.max;
  nextSnapshot.playerState.resources.stamina.current = nextSnapshot.playerState.resources.stamina.max;
  nextSnapshot.playerState.resourceRuntime.pendingChanges = [];
  nextSnapshot.playerState.saveMeta.lastRestAtTick = nextSnapshot.clock.tick;
  nextSnapshot.sessionState.currentActivity = {
    id: 'activity.rest',
    label: `Resting In ${LOCATION_TEMPLATES[locationId]!.name}`,
    category: 'Recovery',
    detail: 'Resources, nerves, and field notes are being restored before the next contract.'
  };
  appendNotification(
    nextSnapshot,
    'Rest complete',
    `A settled rest in ${LOCATION_TEMPLATES[locationId]!.name} restored current resources.`,
    'success'
  );
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `${nextSnapshot.playerState.coreData.playerName} rested in ${LOCATION_TEMPLATES[locationId]!.name}`,
      'A proper bunk, meal, and dry roof restored the current reserves.',
      '-4 silver',
      [nextSnapshot.playerState.coreData.playerName, LOCATION_TEMPLATES[locationId]!.name],
      ['All resources restored'],
      ['Silver -4', 'HP to full', 'MP to full', 'Stamina to full'],
      ['Recovery', LOCATION_TEMPLATES[locationId]!.regionLabel]
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Recovered', `Resources were restored after resting in ${LOCATION_TEMPLATES[locationId]!.name}.`)
  };
}

export function turnInQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category !== 'active') {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Not Active', `${quest.title} must be active before it can be turned in.`)
    };
  }

  if (!isQuestReadyToTurnIn(snapshot, questId)) {
    return {
      snapshot,
      notice: createNotice('warning', 'Turn-In Not Ready', makeQuestState(snapshot, questId).nextStep)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.questJournal = nextSnapshot.sessionState.questJournal.map((entry) =>
    entry.id === questId
      ? {
          ...entry,
          category: 'completed',
          statusLabel: 'Turned in'
        }
      : entry
  );

  if (questId === 'quest.ashen_reef_survey') {
    addCurrency(nextSnapshot, { gold: 5, silver: 8 });
    applyExperience(nextSnapshot, 120);
    nextSnapshot.playerState.skills = addOrUpdateSkill(nextSnapshot.playerState.skills, 'skill.knowledge.universal', 1);
    nextSnapshot.playerState.reputation = addOrUpdateReputation(
      nextSnapshot.playerState.reputation,
      'rep.harbor_office',
      'Saltmere Harbor Office',
      8,
      ['survey_priority', 'harbor_access']
    );
    nextSnapshot.sessionState.operations = removeOperation(
      nextSnapshot.sessionState.operations,
      OPERATION_SURVEY_ID
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.harbor.turn_in',
      label: 'Filing Survey Packet',
      category: 'Contract',
      detail: 'Harbor clerks are stamping the packet, payout order, and codex notes.'
    };
    appendNotification(
      nextSnapshot,
      'Survey payout received',
      'Saltmere Harbor Office paid out the Ashen Reef charter and logged the new flora record.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'reputation',
        'Ashen Reef survey turned in at Saltmere Harbor Office',
        'The harbor office paid the charter, updated the route file, and credited the discovery record.',
        '+5g 8s',
        [nextSnapshot.playerState.coreData.playerName, 'Saltmere Harbor Office', 'Ashen Reef'],
        ['Payout secured', 'Harbor standing improved', 'Codex entry unlocked'],
        ['XP +120', 'Navigation +1', 'Harbor Office +8'],
        ['Contract', 'Discovery', 'Harbor Office']
      )
    );
  } else if (questId === 'quest.rivet_shortfall_relief') {
    removeInventoryQuantity(nextSnapshot.playerState.inventory, RIVET_CRATE_ITEM_KEY, 6);
    addCurrency(nextSnapshot, { gold: 4, silver: 1 });
    applyExperience(nextSnapshot, 90);
    nextSnapshot.playerState.skills = addOrUpdateSkill(nextSnapshot.playerState.skills, 'skill.knowledge.minerals', 1);
    nextSnapshot.playerState.reputation = addOrUpdateReputation(
      nextSnapshot.playerState.reputation,
      'rep.guild_consortium',
      'Guild Consortium',
      6,
      ['priority_bids', 'drydock_discount']
    );
    nextSnapshot.sessionState.operations = removeOperation(
      nextSnapshot.sessionState.operations,
      OPERATION_PORTER_ID
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.drydock.turn_in',
      label: 'Handing Off Rivet Cargo',
      category: 'Contract',
      detail: 'The drydock has the emergency crates and yard schedules are stabilizing.'
    };
    nextSnapshot.sessionState.flags = removeFlag(
      nextSnapshot.sessionState.flags,
      FLAG_PORTER_CRATES_SECURED
    );
    appendNotification(
      nextSnapshot,
      'Rivet contract paid',
      'Saltmere Drydock accepted the emergency shipment and eased the active shortage.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'trade',
        'Rivet shortfall relief turned in at Saltmere Drydock',
        'The emergency cargo was accepted and yard crews can resume delayed fittings.',
        '+4g 1s',
        [nextSnapshot.playerState.coreData.playerName, 'Saltmere Drydock', 'Westreach'],
        ['Drydock shortage eased', 'Payout secured'],
        ['XP +90', 'Mercantile +1', 'Guild Consortium +6'],
        ['Contract', 'Trade', 'Drydock']
      )
    );
  }

  const nextTrackedQuest = nextSnapshot.sessionState.questJournal.find(
    (entry) => entry.category === 'active' && entry.id !== questId
  );
  nextSnapshot.sessionState.trackedQuestId = nextTrackedQuest?.id ?? null;

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Quest Turned In', `${quest.title} was completed and rewards were applied.`)
  };
}
