import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createDefaultAccountProfileState,
  grantLegacy,
  spendLegacy
} from "../../packages/engines/game-engine/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory
} from "../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts";
import { createUiViewModel } from "../../apps/rpg-ui/src/runtime/uiViewModel.ts";
import { buildAccountMetaViewModel } from "../../apps/rpg-ui/src/game-shell/accountMetaPresentation.ts";
import { buildChroniclesSummary } from "../../apps/rpg-ui/src/game-shell/achievementChroniclesPresentation.ts";
import { buildLegacyLedgerSummary } from "../../apps/rpg-ui/src/game-shell/legacyLedgerPresentation.ts";

function buildProfileWithTransactions() {
  let profile = createDefaultAccountProfileState({
    displayName: "Wayfarer Ledger",
    createdAt: "2026-04-17T12:00:00.000Z",
    updatedAt: "2026-04-17T12:00:00.000Z"
  });

  const steps = [
    {
      type: "grant",
      amount: 10,
      summary: "Harbor writ recorded",
      sourceId: "reward.harbor_writ",
      recordedAt: "2026-04-17T12:01:00.000Z"
    },
    {
      type: "spend",
      amount: 3,
      summary: "Claimed Brass Seal",
      sourceId: "unlock.brass_seal",
      unlockId: "legacy.unlock.brass_seal",
      recordedAt: "2026-04-17T12:02:00.000Z"
    },
    {
      type: "grant",
      amount: 7,
      summary: "Survey marks tallied",
      sourceId: "reward.survey_marks",
      recordedAt: "2026-04-17T12:03:00.000Z"
    },
    {
      type: "grant",
      amount: 2,
      summary: "Town relief remembered",
      sourceId: "reward.relief",
      recordedAt: "2026-04-17T12:04:00.000Z"
    },
    {
      type: "grant",
      amount: 1,
      summary: "Court notice entered",
      sourceId: "reward.court_notice",
      recordedAt: "2026-04-17T12:05:00.000Z"
    },
    {
      type: "spend",
      amount: 1,
      summary: "Claimed Wax Mark",
      sourceId: "unlock.wax_mark",
      recordedAt: "2026-04-17T12:06:00.000Z"
    }
  ];

  for (const step of steps) {
    if (step.type === "grant") {
      const granted = grantLegacy(profile, {
        amount: step.amount,
        summary: step.summary,
        sourceType: "test",
        sourceId: step.sourceId,
        recordedAt: step.recordedAt
      });
      assert.equal(granted.ok, true);
      profile = granted.profile;
      continue;
    }

    const spent = spendLegacy(profile, {
      amount: step.amount,
      summary: step.summary,
      sourceType: "test",
      sourceId: step.sourceId,
      recordedAt: step.recordedAt,
      ...(step.unlockId ? { unlockId: step.unlockId } : {})
    });
    assert.equal(spent.ok, true);
    profile = spent.profile;
  }

  return profile;
}

test("legacy ledger summary keeps full history but shows the five most recent transactions newest first", () => {
  const summary = buildLegacyLedgerSummary(buildProfileWithTransactions());

  assert.equal(summary.displayName, "Wayfarer Ledger");
  assert.equal(summary.currentLegacyLabel, "16");
  assert.equal(summary.lifetimeLegacyLabel, "20");
  assert.equal(summary.unlockCountLabel, "1");
  assert.equal(summary.recentTransactions.length, 5);
  assert.equal(summary.recentTransactions[0].summary, "Claimed Wax Mark");
  assert.equal(summary.recentTransactions[4].summary, "Claimed Brass Seal");
  assert.equal(summary.emptyState, null);
});

test("player-facing view models expose Growth Tier and never Legacy Growth", () => {
  const bodyStatePresentation = buildBodyStatePresentation(
    demoSnapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );
  const viewModel = createUiViewModel(
    demoSnapshot,
    bodyStatePresentation,
    createDefaultAccountProfileState()
  );
  const serialized = JSON.stringify(viewModel);

  assert.equal(serialized.includes("Legacy Growth"), false);
  assert.equal(serialized.includes("Growth Tier"), true);
});

test("codex sections include Deeds and Chronicles", () => {
  const bodyStatePresentation = buildBodyStatePresentation(
    demoSnapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );
  const viewModel = createUiViewModel(
    demoSnapshot,
    bodyStatePresentation,
    createDefaultAccountProfileState()
  );

  const labels = viewModel.codex.sections.map((section) => section.label);
  assert.ok(labels.includes("Deeds"));
  assert.ok(labels.includes("Chronicles"));
});

test("chronicles summary exposes total account achievements and empty state before unlocks", () => {
  const summary = buildChroniclesSummary(createDefaultAccountProfileState());

  assert.equal(summary.unlockedCountLabel, "0");
  assert.equal(summary.emptyState, "No chronicles have been recorded yet.");
  assert.ok(Number(summary.totalCountLabel) > 0);
});

test("account meta view model exposes real unlock catalog state and chronicle summary counts", () => {
  const profile = buildProfileWithTransactions();
  profile.history.runRecords = [
    {
      characterId: "player.active",
      name: "Aren Vale",
      lineageId: "lineage.human",
      startingContinentId: "continent.vale",
      startingRegionId: "region.riverlands",
      startingSettlementId: "settlement.harth",
      startedAt: "2026-04-17T10:00:00.000Z",
      lastSeenAt: "2026-04-18T10:00:00.000Z",
      outcome: "active",
      echoLevelReached: 7,
      notableCharacterAchievementIds: [],
      saveSlotIds: ["slot.manual.1"]
    },
    {
      characterId: "player.retired",
      name: "Mira Thorn",
      lineageId: "lineage.elf",
      startingContinentId: "continent.shore",
      startingRegionId: "region.lowtide",
      startingSettlementId: "settlement.tidewatch",
      startedAt: "2026-04-16T10:00:00.000Z",
      endedAt: "2026-04-17T18:00:00.000Z",
      lastSeenAt: "2026-04-17T18:00:00.000Z",
      outcome: "archived",
      archiveReason: "retired",
      echoLevelReached: 9,
      notableCharacterAchievementIds: [],
      legacyGranted: 3,
      saveSlotIds: []
    },
    {
      characterId: "player.dead",
      name: "Tern Ash",
      lineageId: "lineage.dwarf",
      startingContinentId: "continent.stone",
      startingRegionId: "region.deepmark",
      startingSettlementId: "settlement.ironrest",
      startedAt: "2026-04-15T10:00:00.000Z",
      endedAt: "2026-04-16T18:00:00.000Z",
      lastSeenAt: "2026-04-16T18:00:00.000Z",
      outcome: "archived",
      archiveReason: "dead",
      echoLevelReached: 5,
      notableCharacterAchievementIds: [],
      saveSlotIds: []
    }
  ];

  const meta = buildAccountMetaViewModel(profile);

  assert.equal(meta.legacy.currentPrestigeLabel, "16");
  assert.equal(meta.legacy.lifetimePrestigeLabel, "20");
  assert.deepEqual(meta.legacy.unlockTypeTabs, [
    "All",
    "Origins",
    "Titles",
    "Perks",
    "Traits",
    "Account",
    "Chronicle",
    "Heir"
  ]);
  assert.equal(meta.legacy.unlockEntries.some((entry) => entry.isPlaceholder), false);
  assert.equal(
    meta.legacy.unlockEntries.some((entry) => entry.id === "legacy.unlock.account.ledger_seal"),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries
      .filter((entry) => entry.isKnownCatalogEntry)
      .every((entry) => entry.costLabel.length > 0 && entry.progressLabel.length > 0),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some((entry) => entry.state === "unlocked" || entry.state === "maxed"),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some(
      (entry) => entry.purchaseStatusLabel === "Purchase wiring pending"
    ),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some(
      (entry) =>
        entry.id === "legacy.unlock.brass_seal" &&
        !entry.isKnownCatalogEntry &&
        entry.purchaseStatusLabel === "Historical record"
    ),
    true
  );
  assert.deepEqual(
    meta.chronicles.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Active", "1"],
      ["Retired", "1"],
      ["Deaths", "1"],
      ["Heirs", "0"],
      ["Total", "3"]
    ]
  );
  assert.equal(meta.chronicles.tiles[0].title, "Aren Vale");
});

test("empty account meta chronicles do not fabricate placeholder records", () => {
  const meta = buildAccountMetaViewModel(createDefaultAccountProfileState());

  assert.deepEqual(
    meta.chronicles.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Active", "0"],
      ["Retired", "0"],
      ["Deaths", "0"],
      ["Heirs", "0"],
      ["Total", "0"]
    ]
  );
  assert.deepEqual(meta.chronicles.tiles, []);
});

test("launcher shell owns account meta navigation and exposes compact legacy and chronicle copy", () => {
  const appShellSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/AppShell.tsx", import.meta.url),
    "utf8"
  );
  const mainMenuSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx", import.meta.url),
    "utf8"
  );
  const accountMetaSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx", import.meta.url),
    "utf8"
  );
  const settingsSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx", import.meta.url),
    "utf8"
  );
  const indexHtmlSource = readFileSync(
    new URL("../../apps/rpg-ui/index.html", import.meta.url),
    "utf8"
  );
  const legacyBrandPattern = new RegExp("Cata" + "clysm");

  assert.match(appShellSource, /export function AppShell/);
  assert.match(appShellSource, /export function TopBar/);
  assert.match(appShellSource, /export function SidebarNav/);
  assert.match(appShellSource, /export function ShellSubBar/);
  assert.match(appShellSource, /export function ShellContent/);
  assert.match(appShellSource, /relative z-30/);
  assert.match(appShellSource, /relative z-10/);
  assert.match(mainMenuSource, /AppShell/);
  assert.match(mainMenuSource, /SidebarNav/);
  assert.match(mainMenuSource, /LauncherSectionId = 'characters' \| AccountMetaSectionId/);
  assert.match(mainMenuSource, /activeSection === 'characters'/);
  assert.match(mainMenuSource, /Characters/);
  assert.match(mainMenuSource, /label: 'Settings'/);
  assert.match(mainMenuSource, /AccountMetaPanel/);
  assert.match(mainMenuSource, /centerActions=\{/);
  assert.match(mainMenuSource, /continueLabel/);
  assert.match(mainMenuSource, /formatPossessiveName/);
  assert.match(mainMenuSource, /Start your Legacy/);
  assert.match(mainMenuSource, /slot\.kind === 'manual' && slot\.hasSave/);
  assert.doesNotMatch(mainMenuSource, /disabled=\{!hasContinueSave\}/);
  assert.doesNotMatch(mainMenuSource, />\\s*Empty\\s*</);
  assert.doesNotMatch(mainMenuSource, /\{slot\.label\}/);
  assert.match(mainMenuSource, /accountProfile\.displayName/);
  assert.match(mainMenuSource, /accountMenuOpen/);
  assert.doesNotMatch(mainMenuSource, /primaryActions=\{/);
  assert.match(mainMenuSource, /Log Out/);
  assert.doesNotMatch(mainMenuSource, /onToggleThemeMode/);
  assert.doesNotMatch(mainMenuSource, /Open settings/);
  assert.doesNotMatch(mainMenuSource, /Signed In/);
  assert.match(mainMenuSource, /activeSection=\{activeSection\}/);
  assert.match(mainMenuSource, /showSectionNav=\{false\}/);
  assert.match(mainMenuSource, /frameless/);
  assert.doesNotMatch(mainMenuSource, /rounded-\[30px\]/);
  assert.doesNotMatch(mainMenuSource, /<Card accent="var\(--color-world\)">/);
  assert.match(settingsSource, /AppShell/);
  assert.match(settingsSource, /SidebarNav/);
  assert.match(settingsSource, /centerActions=\{/);
  assert.match(settingsSource, /accountControls=\{/);
  assert.match(settingsSource, /onContinue/);
  assert.match(settingsSource, /onExit/);
  assert.match(settingsSource, /Start your Legacy/);
  assert.doesNotMatch(settingsSource, /ScreenFrame/);
  assert.match(settingsSource, /Appearance/);
  assert.match(settingsSource, /Timezone/);
  assert.match(settingsSource, /FALLBACK_TIME_ZONE_IDS/);
  assert.match(settingsSource, /supportedValuesOf/);
  assert.match(settingsSource, /buildTimeZoneOptions/);
  assert.match(settingsSource, /clockNow: Date/);
  assert.match(settingsSource, /formatTimeZoneCurrentTime\(normalized, date, hourFormat\)/);
  assert.match(settingsSource, /offsetOptions/);
  assert.match(settingsSource, /formatGmtOffset/);
  assert.doesNotMatch(settingsSource, /replace\(\/_\/g/);
  assert.match(settingsSource, /<select/);
  assert.doesNotMatch(settingsSource, /datalist/);
  assert.match(settingsSource, /HOUR_FORMAT_OPTIONS/);
  assert.match(settingsSource, /\{option\} hr/);
  assert.match(settingsSource, /Log Out/);
  assert.match(settingsSource, /Reset Account/);
  assert.match(settingsSource, /Delete Account/);
  assert.match(settingsSource, /onResetAccount/);
  assert.match(settingsSource, /onDeleteAccount/);
  assert.match(settingsSource, /Resetting your account will delete all character data, Prestige, and achievements/);
  assert.match(settingsSource, /onOpenLauncherSection\('characters'\)/);
  assert.match(settingsSource, /onOpenLauncherSection\('legacy'\)/);
  assert.match(settingsSource, /onOpenLauncherSection\('chronicles'\)/);
  assert.doesNotMatch(settingsSource, /LegacyLedgerCard/);
  assert.doesNotMatch(settingsSource, /ChroniclesCard/);
  assert.doesNotMatch(settingsSource, /Launcher Notes/);
  assert.doesNotMatch(settingsSource, /Legacy ledger/);
  assert.doesNotMatch(settingsSource, /Save Reset/);
  assert.doesNotMatch(settingsSource, /Reset Save Data/);
  assert.doesNotMatch(settingsSource, /<Card/);
  assert.match(mainMenuSource, /Echoes of Legacy/);
  assert.match(settingsSource, /Echoes of Legacy/);
  assert.doesNotMatch(mainMenuSource, /title="Launcher"/);
  assert.doesNotMatch(mainMenuSource, /Campaign slots, account records, and launcher controls/);
  assert.doesNotMatch(mainMenuSource, legacyBrandPattern);
  assert.doesNotMatch(settingsSource, legacyBrandPattern);
  assert.match(indexHtmlSource, /Echoes of Legacy RPG UI/);
  assert.doesNotMatch(indexHtmlSource, legacyBrandPattern);
  assert.match(accountMetaSource, /activeSection\?: AccountMetaSectionId/);
  assert.match(accountMetaSource, /showSectionNav\?: boolean/);
  assert.match(accountMetaSource, /frameless\?: boolean/);
  assert.match(accountMetaSource, /showSectionNav = true/);
  assert.match(accountMetaSource, /frameless = false/);
  assert.match(accountMetaSource, /Legacy/);
  assert.match(accountMetaSource, /Chronicles/);
  assert.match(accountMetaSource, /Current Prestige/);
  assert.match(accountMetaSource, /Lifetime Prestige/);
  assert.match(accountMetaSource, /purchaseStatusLabel/);
  assert.match(accountMetaSource, /Cost:/);
  assert.match(accountMetaSource, /Progress:/);
  assert.match(accountMetaSource, /Future Hook/);
  assert.doesNotMatch(accountMetaSource, /onPurchase/);
});
