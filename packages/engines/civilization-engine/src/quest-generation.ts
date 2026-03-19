import type { CivilizationQuestState, EconomyLedgerSnapshot, QuestOfferState } from "../../../shared/types/src/index.js";
import {
  loadGuildContent,
  loadMonsterContent,
  loadQuestTemplates,
  loadSettlementContent,
  resolveEffectiveGuildPresence,
  type GuildPresenceRecord
} from "./content.js";
import { matchesResourceTarget } from "./resource-taxonomy.js";

function matchesSettlementTags(requiredTags: string[], settlementTags: Set<string>): boolean {
  if (requiredTags.length === 0) {
    return true;
  }

  return requiredTags.some((tag) => settlementTags.has(tag));
}

function toFriendlyLabel(value: string | undefined): string {
  if (!value) {
    return "task";
  }

  return value
    .split("_")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSurplusObjective(
  template: { category: QuestOfferState["category"]; targetSettlementTags: string[] },
  itemKey: string,
  quantity: number
): QuestOfferState["objectives"] {
  switch (template.category) {
    case "escort":
      return [
        {
          objectiveType: "escort",
          label: `Escort a surplus convoy carrying ${toFriendlyLabel(itemKey)}`,
          itemKey,
          quantity
        }
      ];
    case "porter":
      return [
        {
          objectiveType: "labor",
          label: `Move outgoing ${toFriendlyLabel(itemKey)} cargo through the local yards`,
          itemKey,
          quantity
        }
      ];
    case "domestic_labor":
      return [
        {
          objectiveType: "labor",
          label: `Sort, secure, and load ${toFriendlyLabel(itemKey)} before it spoils or backs up the yards`,
          itemKey,
          quantity
        }
      ];
    case "salvage":
      return [
        {
          objectiveType: "salvage",
          label: `Recover and sort tradeable ${toFriendlyLabel(itemKey)} from hazardous ground`,
          itemKey,
          quantity
        }
      ];
    default:
      return [
        {
          objectiveType: "deliver_item",
          label: `Deliver ${toFriendlyLabel(itemKey)}`,
          itemKey,
          quantity
        }
      ];
  }
}

function buildShortfallObjective(
  template: { category: QuestOfferState["category"]; targetSettlementTags: string[] },
  itemKey: string,
  quantity: number
): QuestOfferState["objectives"] {
  switch (template.category) {
    case "gathering":
      return [
        {
          objectiveType: "labor",
          label: `Gather and bring in fresh ${toFriendlyLabel(itemKey)} for local stores`,
          itemKey,
          quantity
        }
      ];
    case "hunting":
      return [
        {
          objectiveType: "labor",
          label: `Hunt, dress, and return usable ${toFriendlyLabel(itemKey)} to the guild`,
          itemKey,
          quantity
        }
      ];
    case "domestic_labor":
      return [
        {
          objectiveType: "labor",
          label: `Take a temporary labor contract to stabilize the shortage in ${toFriendlyLabel(itemKey)}`,
          itemKey,
          quantity
        }
      ];
    case "porter":
      return [
        {
          objectiveType: "labor",
          label: `Shift urgent ${toFriendlyLabel(itemKey)} through the local yards before the shortage worsens`,
          itemKey,
          quantity
        }
      ];
    default:
      return [
        {
          objectiveType: "deliver_item",
          label: `Deliver ${toFriendlyLabel(itemKey)}`,
          itemKey,
          quantity
        }
      ];
  }
}

function buildFrontierObjective(template: {
  category: QuestOfferState["category"];
  targetSettlementTags: string[];
}): QuestOfferState["objectives"] {
  const targetTag = template.targetSettlementTags[0];

  return [
    {
      objectiveType: "survey",
      label: "Survey nearby frontier ground and return with a usable report",
      targetTag,
      quantity: 1
    }
  ];
}

function buildSecurityObjective(
  template: {
    category: QuestOfferState["category"];
    monsterIds: string[];
    minimumQuantity: number;
    targetSettlementTags: string[];
  },
  monsterId: string | undefined,
  monsterName: string | undefined
): QuestOfferState["objectives"] {
  if (monsterId) {
    return [
      {
        objectiveType: "defeat_monster",
        label: `Cull ${monsterName ?? toFriendlyLabel(monsterId.replace(/^monster\./, ""))}`,
        monsterId,
        quantity: template.minimumQuantity
      }
    ];
  }

  if (template.category === "escort") {
    return [
      {
        objectiveType: "escort",
        label: "Guard workers and freight through an unsafe route",
        targetTag: template.targetSettlementTags[0],
        quantity: template.minimumQuantity
      }
    ];
  }

  if (template.category === "salvage") {
    return [
      {
        objectiveType: "salvage",
        label: "Recover goods from a dangerous site before rival scavengers or hazards claim them",
        targetTag: template.targetSettlementTags[0],
        quantity: template.minimumQuantity
      }
    ];
  }

  return [
    {
      objectiveType: "labor",
      label: "Carry out hazardous local labor under guild supervision",
      targetTag: template.targetSettlementTags[0],
      quantity: template.minimumQuantity
    }
  ];
}

function hashText(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function chooseMonsterId(monsterIds: string[], settlementId: string, tick: number): string | undefined {
  if (monsterIds.length === 0) {
    return undefined;
  }

  const index = hashText(`${settlementId}:${tick}:${monsterIds.join("|")}`) % monsterIds.length;
  return monsterIds[index];
}

function resolveIssuerGuildType(
  issuingGuildTypes: string[],
  effectiveGuilds: GuildPresenceRecord[],
  allowAdventurersFallback: boolean,
  category: QuestOfferState["category"],
  guildQuestCategories: Map<string, QuestOfferState["category"][]>
): GuildPresenceRecord | null {
  const directMatch = issuingGuildTypes
    .map((guildType) => effectiveGuilds.find((guild) => guild.guildType === guildType) ?? null)
    .find((guild) => guild !== null && (guildQuestCategories.get(guild.guildType) ?? []).includes(category));

  if (directMatch) {
    return directMatch;
  }

  if (!allowAdventurersFallback) {
    return null;
  }

  return (
    effectiveGuilds.find(
      (guild) => guild.guildType === "adventurers_guild" && (guildQuestCategories.get(guild.guildType) ?? []).includes(category)
    ) ?? null
  );
}

export function generateQuestOffers(
  settlementIds: string[],
  snapshots: EconomyLedgerSnapshot[],
  _previousState: CivilizationQuestState,
  tick: number
): { nextState: CivilizationQuestState; warnings: string[] } {
  const warnings: string[] = [];
  const settlements = loadSettlementContent();
  const guilds = loadGuildContent();
  const questTemplates = loadQuestTemplates();
  const monsters = loadMonsterContent();

  const settlementById = new Map(settlements.map((record) => [record.id, record]));
  const guildBySlug = new Map(guilds.map((record) => [record.slug, record]));
  const guildQuestCategories = new Map(guilds.map((record) => [record.slug, record.questBoardProfile?.questCategories ?? []]));
  const monsterById = new Map(monsters.map((record) => [record.id, record]));

  const settlementSnapshots = new Map(
    snapshots.filter((snapshot) => snapshot.level === "settlement" && typeof snapshot.settlementId === "string").map((snapshot) => [
      snapshot.settlementId as string,
      snapshot
    ])
  );
  const buildingSnapshots = new Map(
    snapshots
      .filter(
        (snapshot) =>
          snapshot.level === "building" &&
          typeof snapshot.settlementId === "string" &&
          typeof snapshot.sourceRecordId === "string" &&
          snapshot.sourceRecordId.startsWith("guild.")
      )
      .map((snapshot) => [`${snapshot.settlementId}:${snapshot.sourceRecordId}`, snapshot])
  );

  const offers: QuestOfferState[] = [];

  for (const settlementId of settlementIds) {
    const settlement = settlementById.get(settlementId);
    if (!settlement) {
      warnings.push(`Quest generation skipped missing settlement content ${settlementId}.`);
      continue;
    }

    const snapshot = settlementSnapshots.get(settlementId);
    if (!snapshot) {
      warnings.push(`Quest generation skipped settlement ${settlementId} because no settlement ledger snapshot was produced.`);
      continue;
    }

    const effectiveGuilds = resolveEffectiveGuildPresence(settlement.guildPresence ?? []);
    const settlementTags = new Set([...(settlement.identityTags ?? []), ...(settlement.purposeTags ?? [])]);
    for (const template of questTemplates) {
      const issuer = resolveIssuerGuildType(
        template.issuingGuildTypes,
        effectiveGuilds,
        template.allowAdventurersFallback,
        template.category,
        guildQuestCategories
      );
      if (!issuer) {
        continue;
      }

      const issuerDefinition = guildBySlug.get(issuer.guildType);
      if (!issuerDefinition?.questBoardProfile?.enabled) {
        continue;
      }
      if (!issuerDefinition.questBoardProfile.questCategories.includes(template.category)) {
        continue;
      }
      if (!matchesSettlementTags(template.targetSettlementTags, settlementTags)) {
        continue;
      }

      const issuerSnapshot =
        buildingSnapshots.get(`${settlementId}:guild.${issuer.guildType}`) ??
        settlementSnapshots.get(settlementId) ??
        snapshot;

      let objectives: QuestOfferState["objectives"] = [];
      let notes = [template.summary];

      if (template.generationSource === "shortfall") {
        const match = issuerSnapshot.balances.find(
          (balance) =>
            balance.shortfallPerTick >= template.minimumShortfallPerTick &&
            matchesResourceTarget(template.targetItemKeys, balance.itemKey)
        );
        if (!match) {
          continue;
        }
        objectives = buildShortfallObjective(
          template,
          match.itemKey,
          Math.max(template.minimumQuantity, Math.ceil(match.shortfallPerTick))
        );
        notes = [...notes, `Shortfall pressure is centered on ${match.itemKey}.`];
      } else if (template.generationSource === "surplus") {
        const match = issuerSnapshot.balances.find(
          (balance) =>
            balance.tradeSurplusPerTick >= template.minimumTradeSurplusPerTick &&
            matchesResourceTarget(template.targetItemKeys, balance.itemKey)
        );
        if (!match) {
          continue;
        }
        objectives = buildSurplusObjective(
          template,
          match.itemKey,
          Math.max(template.minimumQuantity, Math.ceil(match.tradeSurplusPerTick))
        );
        notes = [...notes, `Tradeable surplus is currently strongest in ${match.itemKey}.`];
      } else if (template.generationSource === "frontier") {
        objectives = buildFrontierObjective(template);
        notes = [...notes, "The commission is driven by incomplete route and terrain knowledge beyond settled lanes."];
      } else {
        const monsterId = chooseMonsterId(
          template.monsterIds.filter((candidateId) => monsterById.has(candidateId)),
          settlementId,
          tick
        );
        if (template.monsterIds.length > 0 && !monsterId) {
          continue;
        }
        objectives = buildSecurityObjective(template, monsterId, monsterId ? monsterById.get(monsterId)?.name : undefined);
        if (monsterId) {
          notes = [...notes, `Threat target: ${monsterById.get(monsterId)?.name ?? monsterId}.`];
        }
      }

      const quantityTotal = objectives.reduce((sum, objective) => sum + objective.quantity, 0);
      offers.push({
        id: `${template.id}:${settlementId}:${tick}`,
        templateId: template.id,
        settlementId,
        issuerGuildType: issuer.guildType,
        issuerName: issuer.name,
        category: template.category,
        urgency: Math.max(1, Math.min(5, quantityTotal)),
        rewardCoin: template.rewardProfile.coinBase + quantityTotal * 2,
        rewardReputation: template.rewardProfile.reputationBase + Math.min(3, quantityTotal),
        objectives,
        notes
      });
    }
  }

  return {
    nextState: {
      activeOffers: offers,
      lastGeneratedTick: tick
    },
    warnings
  };
}
