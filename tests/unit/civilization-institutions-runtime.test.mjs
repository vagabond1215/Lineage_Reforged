import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.js";
import { buildSettlementInstitutionProfiles, buildSettlementMarketStates } from "../../packages/engines/civilization-engine/src/index.js";
import { deriveLandAuthorityType, deriveSettlementStartAccess } from "../../packages/shared/types/src/index.js";

const TEST_SETTLEMENTS = [
  "settlement.aurelis",
  "settlement.vinecross",
  "settlement.stonevein",
  "settlement.brineharbor"
];

async function loadSettlementRecords() {
  const raw = await readFile("packages/content/base/world/settlements.json", "utf8");
  return JSON.parse(raw).records;
}

function createProfiles() {
  const clock = createInitialClock();
  const { economy } = buildEconomyStateFromContent(TEST_SETTLEMENTS, clock);
  const { snapshots } = aggregateEconomyHierarchy(economy);
  const marketStates = buildSettlementMarketStates({
    settlementIds: TEST_SETTLEMENTS,
    snapshots,
    clock
  });

  return buildSettlementInstitutionProfiles({
    settlementIds: TEST_SETTLEMENTS,
    marketStates
  });
}

function getProfile(profiles, settlementId) {
  const profile = profiles.find((entry) => entry.settlementId === settlementId);
  assert.ok(profile, `missing institution profile for ${settlementId}`);
  return profile;
}

test("institution profiles derive ownership, guilds, religion, magic, and crystal state from settlement simulation", () => {
  const profiles = createProfiles();
  const aurelis = getProfile(profiles, "settlement.aurelis");
  const vinecross = getProfile(profiles, "settlement.vinecross");
  const brineharbor = getProfile(profiles, "settlement.brineharbor");

  assert.ok(["noble_direct", "civil_authority"].includes(aurelis.landAuthorityType));
  assert.ok(aurelis.propertyRecords.length > 0, "aurelis should derive property ownership records");
  assert.ok(aurelis.propertyRecords.some((record) => record.propertyType === "building"));
  assert.ok(
    aurelis.propertyRecords.every(
      (record) =>
        typeof record.ownerType === "string" &&
        typeof record.ownerId === "string" &&
        typeof record.operatorType === "string" &&
        typeof record.operatorId === "string"
    ),
    "property records should keep separate legal owner and operator identities"
  );
  assert.ok(aurelis.guilds.some((guild) => guild.guildClass === "merchant_guild"));
  assert.ok(aurelis.religion.organizationIds.length >= 1, "aurelis should derive religious organizations");
  assert.ok(aurelis.magic.some((service) => service.available), "aurelis should derive at least one available magic service");
  assert.ok(aurelis.crystalReserves.length >= 1, "aurelis should derive crystal reserves");
  assert.ok(
    aurelis.crystalReserves.every((reserve) => reserve.currentCharge <= reserve.capacity),
    "crystal reserves should remain bounded by capacity"
  );

  assert.ok(vinecross.propertyRecords.some((record) => record.ownerType === "noble" || record.ownerType === "npc_household"));
  assert.ok(vinecross.startAccess.accessStatus === "allowed");

  assert.ok(brineharbor.guilds.some((guild) => guild.guildClass === "maritime_guild"));
  assert.ok(brineharbor.religion.sites.some((site) => site.siteType === "temple" || site.siteType === "shrine"));
});

test("start access rules enforce restrictions for controlled settlements without granting free property", async () => {
  const settlements = await loadSettlementRecords();
  const majorCity = settlements.find((settlement) => settlement.populationBand === "major");
  const militarySettlement = settlements.find((settlement) => settlement.settlementType === "fort" || settlement.settlementType === "citadel");

  assert.ok(majorCity, "expected at least one major settlement");
  assert.ok(militarySettlement, "expected at least one military settlement");

  const majorCityAuthority = deriveLandAuthorityType(majorCity);
  const militaryAuthority = deriveLandAuthorityType(militarySettlement);

  const restrictedCityStart = deriveSettlementStartAccess({
    settlement: majorCity,
    landAuthorityType: majorCityAuthority,
    backstoryId: "backstory.local"
  });
  const authorizedCityStart = deriveSettlementStartAccess({
    settlement: majorCity,
    landAuthorityType: majorCityAuthority,
    backstoryId: "backstory.merchants_child"
  });
  const authorizedMilitaryStart = deriveSettlementStartAccess({
    settlement: militarySettlement,
    landAuthorityType: militaryAuthority,
    backstoryId: "backstory.local_hero"
  });
  const restrictedMilitaryStart = deriveSettlementStartAccess({
    settlement: militarySettlement,
    landAuthorityType: militaryAuthority,
    backstoryId: "backstory.merchants_child"
  });

  assert.equal(restrictedCityStart.accessStatus, "restricted");
  assert.equal(authorizedCityStart.accessStatus, "allowed");
  assert.equal(authorizedCityStart.authorityTier, "chartered");
  assert.equal(authorizedCityStart.lawfulStanding, "chartered");
  assert.equal(authorizedCityStart.sponsorCategory, "merchant_house");
  assert.equal(restrictedMilitaryStart.accessStatus, "restricted");
  assert.equal(restrictedMilitaryStart.authorityTier, "military");
  assert.equal(restrictedMilitaryStart.lawfulStanding, "unrecognized");
  assert.equal(restrictedMilitaryStart.sponsorCategory, "none");
  assert.equal(authorizedMilitaryStart.accessStatus, "allowed");
  assert.equal(authorizedMilitaryStart.authorityTier, "military");
  assert.equal(authorizedMilitaryStart.lawfulStanding, "military_clearance");
  assert.equal(authorizedMilitaryStart.sponsorCategory, "local_recognition");
  assert.ok(restrictedCityStart.notes.some((note) => /free property|licensed|chartered/i.test(note)));
});
