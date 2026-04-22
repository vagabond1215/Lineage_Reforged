import { readFileSync } from "node:fs";
export const DEFAULT_ADVENTURERS_PRESENCE = {
    guildType: "adventurers_guild",
    name: "Adventurers Guild Desk",
    presenceLevel: "outpost",
    functions: ["quest_board", "escort_contracts", "hazard_clearance"],
    notes: "A standing adventurers desk appears anywhere organized guild business already exists."
};
const REPUTATION_SCOPES = ["local", "regional", "continental", "world"];
const FAME_BRANCHES_BY_SCOPE = {
    local: ["civic", "folk", "trade", "martial"],
    regional: ["heroic", "martial", "political", "commercial"],
    continental: ["historical", "legendary", "political"],
    world: ["legendary", "mythic"]
};
const NOTORIETY_CATEGORIES = ["theft", "fraud", "violent", "murder", "arson", "banditry", "treason"];
const NOTORIETY_SEVERITIES = ["minor", "standard", "major"];
const NOTORIETY_MODIFIERS = ["mass", "organized", "repeat", "public", "against_nobility", "against_temple", "wartime", "ritual"];
const contentCache = new Map();
function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireStringArray(value, fieldPath) {
    if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
        throw new Error(`${fieldPath} must be a string array`);
    }
    return value;
}
function validateOriginSettlementIds(ownerLabel, scope, originSettlementIds) {
    if (scope === "world" && originSettlementIds === void 0) {
        return;
    }
    const values = requireStringArray(originSettlementIds, `${ownerLabel}.originSettlementIds`);
    if (scope !== "world" && values.length === 0) {
        throw new Error(`${ownerLabel}.originSettlementIds must contain at least one settlement id for ${scope} awards`);
    }
    values.forEach((entry, index) => {
        if (!/^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/.test(entry)) {
            throw new Error(`${ownerLabel}.originSettlementIds[${index}] must be a canonical settlement id`);
        }
    });
}
function validateCommonReputationAwardFields(ownerLabel, award) {
    if (typeof award.directEarnedScope !== "string" || !REPUTATION_SCOPES.includes(award.directEarnedScope)) {
        throw new Error(`${ownerLabel}.directEarnedScope must be one of ${REPUTATION_SCOPES.join(", ")}`);
    }
    if (typeof award.baseValue !== "number" || !Number.isFinite(award.baseValue) || award.baseValue < 0) {
        throw new Error(`${ownerLabel}.baseValue must be a finite non-negative number`);
    }
    const scope = award.directEarnedScope;
    validateOriginSettlementIds(ownerLabel, scope, award.originSettlementIds);
    return scope;
}
export function validateAuthoredReputationAwards(ownerLabel, awards) {
    if (awards === void 0) {
        return awards;
    }
    if (!Array.isArray(awards)) {
        throw new Error(`${ownerLabel}.reputationAwards must be an array`);
    }
    awards.forEach((award, index) => {
        const awardLabel = `${ownerLabel}.reputationAwards[${index}]`;
        if (!isObject(award)) {
            throw new Error(`${awardLabel} must be an object`);
        }
        if (award.axis === "fame") {
            if (typeof award.branchId !== "string") {
                throw new Error(`${awardLabel}.branchId must be provided for fame awards`);
            }
            if ("categoryId" in award || "severity" in award || "modifiers" in award || "allowCredibleLink" in award) {
                throw new Error(`${awardLabel} must not mix fame and notoriety fields`);
            }
            const scope = validateCommonReputationAwardFields(awardLabel, award);
            const allowedBranches = FAME_BRANCHES_BY_SCOPE[scope];
            if (!allowedBranches.includes(award.branchId)) {
                throw new Error(`${awardLabel}.branchId '${award.branchId}' is not valid for ${scope} fame; expected one of ${allowedBranches.join(", ")}`);
            }
            return;
        }
        if (award.axis === "notoriety") {
            if ("branchId" in award) {
                throw new Error(`${awardLabel} must not use branchId on notoriety awards`);
            }
            if (typeof award.categoryId !== "string" || !NOTORIETY_CATEGORIES.includes(award.categoryId)) {
                throw new Error(`${awardLabel}.categoryId must be a supported notoriety category`);
            }
            if (typeof award.severity !== "string" || !NOTORIETY_SEVERITIES.includes(award.severity)) {
                throw new Error(`${awardLabel}.severity must be a supported notoriety severity`);
            }
            if (award.modifiers !== void 0 &&
                (!Array.isArray(award.modifiers) || award.modifiers.some((entry) => typeof entry !== "string" || !NOTORIETY_MODIFIERS.includes(entry)))) {
                throw new Error(`${awardLabel}.modifiers must contain only supported notoriety modifiers`);
            }
            if (typeof award.exposureRequirement !== "string" ||
                !["public", "witnessed_or_reported", "evidenced"].includes(award.exposureRequirement)) {
                throw new Error(`${awardLabel}.exposureRequirement must be a supported notoriety exposure rule`);
            }
            if (typeof award.attributionRequired !== "boolean") {
                throw new Error(`${awardLabel}.attributionRequired must be a boolean`);
            }
            if (typeof award.allowCredibleLink !== "boolean") {
                throw new Error(`${awardLabel}.allowCredibleLink must be a boolean`);
            }
            validateCommonReputationAwardFields(awardLabel, award);
            return;
        }
        throw new Error(`${awardLabel}.axis must be 'fame' or 'notoriety'`);
    });
    return awards;
}
function loadJsonFile(relativePath) {
    if (contentCache.has(relativePath)) {
        return contentCache.get(relativePath);
    }
    const fileUrl = new URL(relativePath, import.meta.url);
    const raw = readFileSync(fileUrl, "utf8");
    const parsed = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
    contentCache.set(relativePath, parsed);
    return parsed;
}
export function loadGuildContent() {
    const parsed = loadJsonFile("../../../content/base/civilization/guilds.json");
    return parsed.records;
}
export function loadSettlementContent() {
    const parsed = loadJsonFile("../../../content/base/world/settlements.json");
    return parsed.records;
}
export function loadBuildingContent() {
    const parsed = loadJsonFile("../../../content/base/civilization/buildings.json");
    return parsed.records;
}
export function loadQuestTemplates() {
    const parsed = loadJsonFile("../../../content/base/civilization/quest_templates.json");
    parsed.records.forEach((record, index) => validateAuthoredReputationAwards(`quest_templates.records[${index}](${record.id})`, record.rewardProfile.reputationAwards));
    return parsed.records;
}
export function loadQuestDefinitions() {
    const parsed = loadJsonFile("../../../content/base/civilization/quest_definitions.json");
    parsed.records.forEach((record, index) => validateAuthoredReputationAwards(`quest_definitions.records[${index}](${record.id})`, record.rewards.reputationAwards));
    return parsed.records;
}
export function loadQuestArchetypes() {
    const parsed = loadJsonFile("../../../content/base/civilization/quest_archetypes.json");
    return parsed.records;
}
export function loadMonsterContent() {
    const parsed = loadJsonFile("../../../content/base/world/monsters.json");
    return parsed.records;
}
export function loadRegionContent() {
    const parsed = loadJsonFile("../../../content/base/world/regions.json");
    return parsed.records;
}
export function loadRegionalEcologyProfiles() {
    const parsed = loadJsonFile("../../../content/base/world/regional_ecology_profiles.json");
    return parsed.records;
}
export function loadRegionLocalityContent() {
    const parsed = loadJsonFile("../../../content/base/world/region_localities.json");
    return parsed.records;
}
export function loadWorldHexContent() {
    const parsed = loadJsonFile("../../../content/base/world/world_hexes.json");
    return parsed.records;
}
export function loadWorldHexEdgeContent() {
    const parsed = loadJsonFile("../../../content/base/world/world_hex_edges.json");
    return parsed.records;
}
export function loadTravelNetworkContent() {
    const parsed = loadJsonFile("../../../content/base/world/travel_networks.json");
    return parsed.records;
}
export function loadTransportProfileContent() {
    const parsed = loadJsonFile("../../../content/base/world/transport_profiles.json");
    return parsed.records;
}
export function loadWorldMapContent() {
    const parsed = loadJsonFile("../../../content/base/world/world_maps.json");
    return parsed.records;
}
export function loadBiomeContent() {
    const parsed = loadJsonFile("../../../content/base/world/biomes.json");
    return parsed.records;
}
export function loadHabitatContent() {
    const parsed = loadJsonFile("../../../content/base/world/habitats.json");
    return parsed.records;
}
export function loadFloraContent() {
    const parsed = loadJsonFile("../../../content/base/world/flora.json");
    return parsed.records;
}
export function loadFaunaContent() {
    const parsed = loadJsonFile("../../../content/base/world/fauna.json");
    return parsed.records;
}
export function loadMineralContent() {
    const parsed = loadJsonFile("../../../content/base/world/minerals.json");
    return parsed.records;
}
export function loadItemContent() {
    const parsed = loadJsonFile("../../../content/base/items/items.json");
    return parsed.records;
}
export function loadConsumableProfileContent() {
    const parsed = loadJsonFile("../../../content/base/items/consumable_profiles.json");
    return parsed.records;
}
export function loadMarketItemValues() {
    const parsed = loadJsonFile("../../../content/base/civilization/market_item_values.json");
    return parsed.records;
}
export function loadProductionChainContent() {
    const parsed = loadJsonFile("../../../content/base/civilization/production_chains.json");
    return parsed.records;
}
export function loadWorkplaceContent() {
    const parsed = loadJsonFile("../../../content/base/civilization/workplaces.json");
    return parsed.records;
}
export function loadPlayerAttributeContent() {
    const parsed = loadJsonFile("../../../content/base/player/attributes.json");
    return parsed.records;
}
export function loadSkillContent() {
    const parsed = loadJsonFile("../../../content/base/player/skills.json");
    return parsed.records;
}
export function loadPlayerAbilityContent() {
    const parsed = loadJsonFile("../../../content/base/player/abilities.json");
    return parsed.records;
}
export function loadPlayerSpellContent() {
    const parsed = loadJsonFile("../../../content/base/player/spells.json");
    return parsed.records;
}
export function loadPlayerTraitContent() {
    const parsed = loadJsonFile("../../../content/base/player/traits.json");
    return parsed.records;
}
export function loadPlayerBackstoryContent() {
    const parsed = loadJsonFile("../../../content/base/player/backstories.json");
    return parsed.records;
}
export function loadPlayerStartingBundleContent() {
    const parsed = loadJsonFile("../../../content/base/player/starting_bundles.json");
    return parsed.records;
}
export function loadProgressionTrackContent() {
    const parsed = loadJsonFile("../../../content/base/player/progression_tracks.json");
    return parsed.records;
}
export function loadKnowledgeDomainContent() {
    const parsed = loadJsonFile("../../../content/base/player/knowledge_domains.json");
    return parsed.records;
}
export function loadSkillEffectContent() {
    const parsed = loadJsonFile("../../../content/base/player/skill_effects.json");
    return parsed.records;
}
export function loadTrialContent() {
    const parsed = loadJsonFile("../../../content/base/player/trials.json");
    return parsed.records;
}
export function loadTitleContent() {
    const parsed = loadJsonFile("../../../content/base/player/titles.json");
    return parsed.records;
}
export function loadGlobalRuleContent() {
    const parsed = loadJsonFile("../../../content/base/game/global_rules.json");
    return parsed.records;
}
export function loadReligionContent() {
    const parsed = loadJsonFile("../../../content/base/world/religions.json");
    return parsed.records;
}
export function loadMagicInfrastructureContent() {
    const parsed = loadJsonFile("../../../content/base/world/magic_infrastructure.json");
    return parsed.records;
}
export function loadCrystalCatalogContent() {
    const parsed = loadJsonFile("../../../content/base/world/crystal_catalog.json");
    return parsed.records;
}
export function resolveEffectiveGuildPresence(guildPresence) {
    if (guildPresence.length === 0) {
        return [];
    }
    if (guildPresence.some((guild) => guild.guildType === "adventurers_guild")) {
        return guildPresence;
    }
    return [...guildPresence, DEFAULT_ADVENTURERS_PRESENCE];
}

