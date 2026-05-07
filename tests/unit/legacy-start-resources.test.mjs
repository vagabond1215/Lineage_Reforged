import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountProfileState,
  grantLegacy,
  purchaseLegacyUnlock
} from "../../packages/engines/game-engine/src/index.ts";
import {
  createDefaultPlayerStatGrowthState
} from "../../packages/engines/player-engine/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getBackstoryOptionsForSelection,
  getBackstoryTemplate,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  buildCharacterCreationPreview,
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { getDefaultWorldSelection } from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";

const STARTING_HP = "legacy.unlock.account.starting_hp";
const STARTING_STAMINA = "legacy.unlock.account.starting_stamina";
const STARTING_COIN = "legacy.unlock.account.starting_coin";
const MERCHANT_PURSE = "legacy.unlock.preparation.merchant_purse";
const VITAL_LEGACY = "legacy.unlock.preparation.vital_legacy";

function grantProfile(amount = 1000) {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.grant",
    recordedAt: "2026-04-20T12:00:00.000Z"
  });

  assert.equal(granted.ok, true);
  return granted.profile;
}

function purchaseRanks(profile, unlockId, ranks, startMinute = 0) {
  let nextProfile = profile;

  for (let rank = 1; rank <= ranks; rank += 1) {
    const purchased = purchaseLegacyUnlock(
      nextProfile,
      unlockId,
      `2026-04-20T20:${(startMinute + rank).toString().padStart(2, "0")}:00.000Z`
    );

    assert.equal(purchased.ok, true);
    assert.equal(purchased.unlock.rank, rank);
    nextProfile = purchased.profile;
  }

  return nextProfile;
}

function createCompleteCharacterForm(backstoryId = "backstory.local_hero") {
  const identity = getLineageIdentityCatalog("lineage.human");
  assert.ok(identity);
  const startingBundleId = "starting_bundle.traveler";
  const world = getDefaultWorldSelection(backstoryId);
  const form = {
    ...createDefaultCharacterCreationFormState("slot-1"),
    playerName: "Legacy Runner",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
  const validation = validateCharacterCreationForm(form);

  assert.deepEqual(validation.errors, {});
  return form;
}

function getMetricValue(preview, id) {
  return preview.resourceMetrics.find((metric) => metric.id === id)?.value ?? null;
}

function formatWallet(currency) {
  return `${currency.gold}g ${currency.silver}s ${currency.copper}c`;
}

function skillSignature(skills) {
  return skills
    .map((skill) => ({ id: skill.id, rank: skill.rank, source: skill.source }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function expectedBackstorySkillSignature(backstoryId) {
  return skillSignature(getBackstoryTemplate(backstoryId).startingSkills);
}

function snapshotSkillSignature(snapshot) {
  return skillSignature(snapshot.playerState.skills);
}

test("createNewGameSnapshot preserves current backstory starter skills exactly", () => {
  const profile = createDefaultAccountProfileState();

  for (const backstory of getBackstoryOptionsForSelection("lineage.human")) {
    const form = createCompleteCharacterForm(backstory.id);
    const snapshot = createNewGameSnapshot(form, profile.accountId, {
      accountProfile: profile
    });

    assert.deepEqual(
      snapshotSkillSignature(snapshot),
      expectedBackstorySkillSignature(backstory.id),
      backstory.id
    );
  }
});

test("createNewGameSnapshot initializes fresh stat growth instead of inheriting demo data", () => {
  const form = createCompleteCharacterForm("backstory.local_hero");
  const profile = createDefaultAccountProfileState();
  const snapshot = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile
  });

  assert.notDeepEqual(snapshot.playerState.statGrowth, demoSnapshot.playerState.statGrowth);
  assert.deepEqual(
    snapshot.playerState.statGrowth,
    createDefaultPlayerStatGrowthState(snapshot.clock.day)
  );
  assert.equal(snapshot.playerState.coreData.playerName, form.playerName);
  assert.equal(snapshot.playerState.coreData.backstoryId, form.backstoryId);
  assert.equal(snapshot.playerState.coreData.startingBundleId, form.startingBundleId);
  assert.deepEqual(snapshotSkillSignature(snapshot), expectedBackstorySkillSignature(form.backstoryId));
  assert.equal(snapshot.playerState.statGrowth.load.AGI, 0);
  assert.equal(snapshot.playerState.statGrowth.load.CON, 0);
  assert.equal(snapshot.playerState.statGrowth.load.WIS, 0);
});

test("account start resources and selected preparations do not change starter skills", () => {
  const form = createCompleteCharacterForm();
  const emptyProfile = createDefaultAccountProfileState();
  const baseline = createNewGameSnapshot(form, emptyProfile.accountId, {
    accountProfile: emptyProfile
  });
  let profile = grantProfile();
  profile = purchaseRanks(profile, STARTING_HP, 2);
  profile = purchaseRanks(profile, STARTING_STAMINA, 2, 10);
  profile = purchaseRanks(profile, STARTING_COIN, 2, 20);

  const withLegacyAndPreparation = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile,
    appliedLegacyPreparationIds: [MERCHANT_PURSE, VITAL_LEGACY],
    appliedLegacyPreparationChoices: {
      [VITAL_LEGACY]: "stamina"
    }
  });

  assert.deepEqual(
    snapshotSkillSignature(withLegacyAndPreparation),
    snapshotSkillSignature(baseline)
  );
  assert.deepEqual(
    snapshotSkillSignature(withLegacyAndPreparation),
    expectedBackstorySkillSignature(form.backstoryId)
  );
});

test("createNewGameSnapshot applies owned account HP and stamina as source-labeled modifiers", () => {
  const form = createCompleteCharacterForm();
  const emptyProfile = createDefaultAccountProfileState();
  const baseline = createNewGameSnapshot(form, emptyProfile.accountId, {
    accountProfile: emptyProfile
  });
  let profile = grantProfile();
  profile = purchaseRanks(profile, STARTING_HP, 3);
  profile = purchaseRanks(profile, STARTING_STAMINA, 2, 10);

  const snapshot = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile
  });
  const stackedSnapshot = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile,
    appliedLegacyPreparationIds: [VITAL_LEGACY],
    appliedLegacyPreparationChoices: {
      [VITAL_LEGACY]: "hp"
    }
  });
  const preview = buildCharacterCreationPreview(form, {
    accountProfile: profile
  });

  assert.equal(snapshot.playerState.resources.hp.max, baseline.playerState.resources.hp.max + 3);
  assert.equal(snapshot.playerState.resources.hp.current, snapshot.playerState.resources.hp.max);
  assert.equal(
    snapshot.playerState.resources.stamina.max,
    baseline.playerState.resources.stamina.max + 2
  );
  assert.equal(
    snapshot.playerState.resources.stamina.current,
    snapshot.playerState.resources.stamina.max
  );
  assert.equal(getMetricValue(preview, "hp"), String(snapshot.playerState.resources.hp.max));
  assert.equal(
    getMetricValue(preview, "stamina"),
    String(snapshot.playerState.resources.stamina.max)
  );
  assert.equal(
    stackedSnapshot.playerState.resources.hp.max,
    baseline.playerState.resources.hp.max + 8
  );
  assert.equal(
    stackedSnapshot.playerState.resources.hp.current,
    stackedSnapshot.playerState.resources.hp.max
  );

  const hpModifier = snapshot.playerState.resourceRuntime.modifiers.find(
    (modifier) => modifier.sourceId === STARTING_HP
  );
  const staminaModifier = snapshot.playerState.resourceRuntime.modifiers.find(
    (modifier) => modifier.sourceId === STARTING_STAMINA
  );

  assert.equal(hpModifier?.label, "Starting HP");
  assert.deepEqual(hpModifier?.maxFlat, { hp: 3 });
  assert.equal(staminaModifier?.label, "Starting Stamina");
  assert.deepEqual(staminaModifier?.maxFlat, { stamina: 2 });
  assert.deepEqual(
    stackedSnapshot.playerState.resourceRuntime.modifiers.map((modifier) => modifier.sourceId),
    [STARTING_HP, STARTING_STAMINA, VITAL_LEGACY]
  );
  assert.equal(snapshot.playerState.flags.includes(`player.legacy_start.${STARTING_HP}`), true);
  assert.equal(
    snapshot.playerState.flags.includes(`player.legacy_start.${STARTING_STAMINA}`),
    true
  );
});

test("starting coin stacks on the bundle purse before selected preparation currency", () => {
  const form = createCompleteCharacterForm();
  const emptyProfile = createDefaultAccountProfileState();
  const baseline = createNewGameSnapshot(form, emptyProfile.accountId, {
    accountProfile: emptyProfile
  });
  let profile = grantProfile();
  profile = purchaseRanks(profile, STARTING_COIN, 4);

  const withLegacyCoin = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile
  });
  const withLegacyCoinAndPreparation = createNewGameSnapshot(form, profile.accountId, {
    accountProfile: profile,
    appliedLegacyPreparationIds: [MERCHANT_PURSE]
  });
  const preview = buildCharacterCreationPreview(form, {
    accountProfile: profile
  });

  assert.deepEqual(withLegacyCoin.playerState.currency, {
    ...baseline.playerState.currency,
    silver: baseline.playerState.currency.silver + 4
  });
  assert.deepEqual(withLegacyCoinAndPreparation.playerState.currency, {
    ...baseline.playerState.currency,
    silver: baseline.playerState.currency.silver + 6
  });
  assert.deepEqual(withLegacyCoinAndPreparation.playerState.saveMeta.appliedLegacyPreparationIds, [
    MERCHANT_PURSE
  ]);
  assert.equal(
    preview.walletLabel,
    `${baseline.playerState.currency.gold}g ${baseline.playerState.currency.silver + 4}s ${baseline.playerState.currency.copper}c`
  );
  assert.equal(
    withLegacyCoin.playerState.flags.includes(`player.legacy_start.${STARTING_COIN}`),
    true
  );
});

test("character creation preview matches created snapshot for Legacy start resources and preparations", () => {
  const form = createCompleteCharacterForm();
  let profile = grantProfile();
  profile = purchaseRanks(profile, STARTING_HP, 3);
  profile = purchaseRanks(profile, STARTING_STAMINA, 2, 10);
  profile = purchaseRanks(profile, STARTING_COIN, 4, 20);
  const options = {
    accountProfile: profile,
    appliedLegacyPreparationIds: [MERCHANT_PURSE, VITAL_LEGACY],
    appliedLegacyPreparationChoices: {
      [VITAL_LEGACY]: "hp"
    }
  };
  const preview = buildCharacterCreationPreview(form, options);
  const snapshot = createNewGameSnapshot(form, profile.accountId, options);

  assert.equal(preview.isResolved, true);
  assert.equal(getMetricValue(preview, "hp"), String(snapshot.playerState.resources.hp.current));
  assert.equal(
    getMetricValue(preview, "stamina"),
    String(snapshot.playerState.resources.stamina.current)
  );
  assert.equal(preview.walletLabel, formatWallet(snapshot.playerState.currency));
  assert.deepEqual(
    preview.starterSkills,
    getBackstoryTemplate(form.backstoryId).startingSkillLabels
  );
  assert.deepEqual(snapshotSkillSignature(snapshot), expectedBackstorySkillSignature(form.backstoryId));
});
