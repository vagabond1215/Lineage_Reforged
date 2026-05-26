import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.ts";
import { buildCalendarClimatePopupViewModel } from "../../apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts";

function createClimateProfile(overrides = {}) {
  return {
    id: "climate.mild_winter",
    name: "Mild Winter",
    seasonLengths: [8, 7, 10, 10, 10, 7],
    temperatureRangeTemplate: {
      unit: "celsius",
      lowLimit: -20,
      highLimit: 40,
      range: 60
    },
    seasonalTemperatureProfiles: {
      Winter: {
        lowOffsetRatio: 0,
        highOffsetRatio: 0.3,
        low: -20,
        high: -2
      },
      Summer: {
        lowOffsetRatio: 0.55,
        highOffsetRatio: 1,
        low: 13,
        high: 40
      }
    },
    ...overrides
  };
}

function findRow(rows, id) {
  return rows.find((row) => row.id === id) ?? null;
}

function allViewModelText(viewModel) {
  const rowText = [
    ...viewModel.currentTimeRows,
    ...viewModel.seasonRows,
    ...viewModel.climateRows,
    ...viewModel.temperatureRows
  ].flatMap((row) => [row.id, row.label, row.valueLabel, row.detailLabel ?? ""]);

  return [
    viewModel.title,
    viewModel.subtitle,
    ...rowText,
    ...viewModel.informationalEffectNotes,
    ...viewModel.warningNotes
  ].join(" ");
}

function assertNoActions(viewModel) {
  assert.deepEqual(viewModel.actionIds, []);
}

test("initial clock renders year, month, day, watch, tick, and Winter from runtime clock", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock()
  });

  assert.equal(viewModel.title, "Calendar and Climate");
  assert.equal(viewModel.subtitle, "Read-only calendar context");
  assert.equal(findRow(viewModel.currentTimeRows, "year")?.valueLabel, "Year 1");
  assert.equal(findRow(viewModel.currentTimeRows, "month")?.valueLabel, "Deepfrost");
  assert.equal(findRow(viewModel.currentTimeRows, "day")?.valueLabel, "Day 1");
  assert.equal(findRow(viewModel.currentTimeRows, "watch")?.valueLabel, "Dawn Watch");
  assert.equal(findRow(viewModel.currentTimeRows, "tick")?.valueLabel, "Tick 0");
  assert.equal(findRow(viewModel.seasonRows, "runtime-season")?.valueLabel, "Winter");
  assertNoActions(viewModel);
});

test("runtime month-to-season language stays informational and does not use profile season lengths as active progression", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: {
      tick: 120,
      subday: 2,
      day: 4,
      month: 6,
      season: "Summer",
      year: 1
    },
    profileSource: {
      climateProfile: createClimateProfile({
        seasonLengths: [52, 0, 0, 0, 0, 0]
      })
    }
  });

  const seasonRow = findRow(viewModel.seasonRows, "runtime-season");
  const profileLengthRow = findRow(viewModel.seasonRows, "profile-season-lengths");

  assert.equal(seasonRow?.valueLabel, "Summer");
  assert.equal(seasonRow?.detailLabel, "Runtime season comes from shared time month mapping.");
  assert.equal(profileLengthRow?.detailLabel, "Authored climate profile season lengths are reference data only.");
  assert.ok(
    viewModel.warningNotes.includes(
      "Climate profile season lengths are authored reference data; they do not drive the current runtime season yet."
    )
  );
  assert.equal(findRow(viewModel.temperatureRows, "expected-seasonal-band")?.valueLabel, "13C to 40C");
});

test("known supplied climate profile renders profile label, source label, and current-season expected temperature band", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock(),
    profileSource: {
      climateProfileId: "climate.mild_winter",
      climateProfile: createClimateProfile(),
      sourceLabel: "Verdant Thalos Climate",
      climateZoneId: "map_climate.first_world.kaelvar_south"
    }
  });

  const climateRow = findRow(viewModel.climateRows, "climate-profile");
  const temperatureRow = findRow(viewModel.temperatureRows, "expected-seasonal-band");

  assert.equal(climateRow?.valueLabel, "Mild Winter");
  assert.equal(climateRow?.detailLabel, "climate.mild_winter via Verdant Thalos Climate");
  assert.equal(temperatureRow?.label, "Expected seasonal band");
  assert.equal(temperatureRow?.valueLabel, "-20C to -2C");
  assert.match(temperatureRow?.detailLabel ?? "", /Winter band from Mild Winter/);
  assertNoActions(viewModel);
});

test("missing climate profile renders unknown or unavailable rows and no inferred settlement climate", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock(),
    location: {
      settlementId: "settlement.vinecross",
      settlementName: "Vinecross",
      regionId: "region.verdant_thalos"
    }
  });

  assert.equal(viewModel.subtitle, "Vinecross - read-only calendar context");
  assert.equal(findRow(viewModel.climateRows, "climate-profile")?.valueLabel, "Unknown");
  assert.equal(findRow(viewModel.temperatureRows, "expected-seasonal-band")?.valueLabel, "Unavailable");
  assert.ok(viewModel.warningNotes.includes("No authoritative climate profile was supplied."));

  const climateText = [
    ...viewModel.climateRows,
    ...viewModel.temperatureRows
  ].flatMap((row) => [row.valueLabel, row.detailLabel ?? ""]).join(" ");
  assert.doesNotMatch(climateText, /mild_winter|kaelvar_south|Verdant Thalos Climate/i);
});

test("supplied profile id without matching profile data warns and omits temperature band", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock(),
    profileSource: {
      climateProfileId: "climate.unknown"
    }
  });

  assert.equal(findRow(viewModel.climateRows, "climate-profile")?.valueLabel, "Unavailable");
  assert.equal(findRow(viewModel.temperatureRows, "expected-seasonal-band")?.valueLabel, "Unavailable");
  assert.ok(viewModel.warningNotes.includes("Climate profile data was not supplied for climate.unknown."));
  assertNoActions(viewModel);
});

test("profile missing current-season temperature band warns and keeps the temperature row unavailable", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock(),
    profileSource: {
      climateProfile: createClimateProfile({
        seasonalTemperatureProfiles: {
          Summer: {
            low: 13,
            high: 40
          }
        }
      })
    }
  });

  assert.equal(findRow(viewModel.temperatureRows, "expected-seasonal-band")?.valueLabel, "Unavailable");
  assert.equal(
    findRow(viewModel.temperatureRows, "expected-seasonal-band")?.detailLabel,
    "No expected temperature band is authored for Winter."
  );
  assert.ok(viewModel.warningNotes.includes("No expected temperature band is authored for Winter."));
});

test("view model always emits actionIds as an empty array", () => {
  const viewModels = [
    buildCalendarClimatePopupViewModel({}),
    buildCalendarClimatePopupViewModel({ clock: createInitialClock() }),
    buildCalendarClimatePopupViewModel({
      clock: createInitialClock(),
      profileSource: {
        climateProfile: createClimateProfile()
      }
    })
  ];

  for (const viewModel of viewModels) {
    assertNoActions(viewModel);
  }
});

test("projection does not mutate clock, location, or profile input objects", () => {
  const clock = createInitialClock();
  const location = {
    settlementId: "settlement.vinecross",
    settlementName: "Vinecross",
    regionId: "region.verdant_thalos",
    regionName: "Verdant Thalos"
  };
  const profile = createClimateProfile();
  const before = JSON.stringify({ clock, location, profile });

  buildCalendarClimatePopupViewModel({
    clock,
    location,
    profileSource: {
      climateProfile: profile,
      sourceLabel: "Verdant Thalos Climate"
    }
  });

  assert.equal(JSON.stringify({ clock, location, profile }), before);
});

test("informational notes avoid active-effect claims", () => {
  const viewModel = buildCalendarClimatePopupViewModel({
    clock: createInitialClock(),
    profileSource: {
      climateProfile: createClimateProfile()
    }
  });
  const text = allViewModelText(viewModel).toLowerCase();
  const bannedPhrases = [
    "slowdown",
    "freezing risk",
    "crop failure",
    "road closure",
    "survival penalty",
    "combat penalty"
  ];

  assert.ok(
    viewModel.informationalEffectNotes.includes("Climate and weather are informational only in this popup.")
  );
  assert.ok(
    viewModel.informationalEffectNotes.includes(
      "No travel, crop, body-state, combat, or economy effects are applied from this view model."
    )
  );
  assert.ok(
    viewModel.informationalEffectNotes.includes(
      "Runtime season currently follows shared clock mapping, not climate profile season progression."
    )
  );

  for (const phrase of bannedPhrases) {
    assert.doesNotMatch(text, new RegExp(phrase));
  }
});
