import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  bootstrapLauncherAuth,
  constantTimeEqualBytes,
  createLocalAccount,
  deleteLocalAccount,
  MALFORMED_AUTH_NOTICE,
  resetLocalAccount,
  signInLocalAccount,
  signOutLauncherSession
} from "../../apps/rpg-ui/src/game-shell/launcherAuthManager.ts";
import {
  loadAccountProfile,
  resolveActiveAccountId,
  saveAccountProfile
} from "../../apps/rpg-ui/src/game-shell/accountProfileManager.ts";
import {
  createDefaultAccountProfileState,
  grantLegacy
} from "../../packages/engines/game-engine/src/legacy-account.ts";

function createMockStorage() {
  const values = new Map();

  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    getItem(key) {
      const normalizedKey = String(key);
      return values.has(normalizedKey) ? values.get(normalizedKey) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
}

function withMockWindow(run) {
  const originalWindow = globalThis.window;
  const mockWindow = {
    localStorage: createMockStorage()
  };

  globalThis.window = mockWindow;

  return Promise.resolve()
    .then(() => run(mockWindow.localStorage))
    .finally(() => {
      if (originalWindow === undefined) {
        delete globalThis.window;
      } else {
        globalThis.window = originalWindow;
      }
    });
}

function listStorageEntries(storage) {
  const entries = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (!key) {
      continue;
    }

    entries.push([key, storage.getItem(key)]);
  }

  return entries;
}

test("bootstrap shows create-first-account when no local accounts exist", () =>
  withMockWindow(() => {
    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.mode, "create_first_account");
    assert.deepEqual(bootstrap.accounts, []);
  }));

test("create-account stores verifier metadata without plaintext password and can restore a persisted session", async () =>
  withMockWindow(async (storage) => {
    const password = "HarborKey42";
    const created = await createLocalAccount({
      displayName: "Wayfarer Ledger",
      password,
      confirmPassword: password,
      stayLoggedIn: true
    });

    assert.equal(created.ok, true);

    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.mode, "signed_in");
    assert.equal(bootstrap.accountProfile.displayName, "Wayfarer Ledger");
    assert.equal(resolveActiveAccountId(), created.accountProfile.accountId);

    const serializedValues = listStorageEntries(storage).map(([, value]) => value ?? "");
    assert.equal(serializedValues.some((value) => value.includes(password)), false);
    assert.ok(
      serializedValues.some((value) => value.includes('"credentialVersion":"pbkdf2_sha256_v1"'))
    );
    assert.ok(
      serializedValues.some((value) => value.includes('"stayLoggedIn":true'))
    );
  }));

test("bootstrap falls back to picker when credential-backed accounts exist without a valid local session", async () =>
  withMockWindow(async () => {
    const password = "LanternRoad";
    const created = await createLocalAccount({
      displayName: "Account One",
      password,
      confirmPassword: password,
      stayLoggedIn: false
    });

    assert.equal(created.ok, true);

    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.mode, "pick_account");
    assert.equal(bootstrap.accounts.length, 1);
  }));

test("authless stored profiles are ignored by the picker and duplicate display names remain allowed", async () =>
  withMockWindow(async () => {
    saveAccountProfile(
      createDefaultAccountProfileState({
        accountId: "account.local.alpha",
        displayName: "Harbor Account"
      })
    );

    const created = await createLocalAccount({
      displayName: "Harbor Account",
      password: "ClaimedRoad",
      confirmPassword: "ClaimedRoad",
      stayLoggedIn: false
    });
    assert.equal(created.ok, true);

    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.mode, "pick_account");
    assert.equal(bootstrap.accounts.length, 1);
    assert.equal(bootstrap.accounts[0]?.displayName, "Harbor Account");
    assert.equal(loadAccountProfile(created.accountProfile.accountId).displayName, "Harbor Account");
  }));

test("sign-in requires the correct password and non-persistent sign-in does not write a stored session", async () =>
  withMockWindow(async (storage) => {
    const created = await createLocalAccount({
      displayName: "Mossbound Ledger",
      password: "CorrectHorse",
      confirmPassword: "CorrectHorse",
      stayLoggedIn: false
    });
    assert.equal(created.ok, true);

    const wrongPassword = await signInLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "WrongHorse",
      stayLoggedIn: false
    });
    assert.equal(wrongPassword.ok, false);
    assert.match(wrongPassword.message, /did not match/i);

    const signedIn = await signInLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "CorrectHorse",
      stayLoggedIn: false
    });
    assert.equal(signedIn.ok, true);

    const authSession = storage.getItem("cataclysm-rpg-ui.auth.v1.session");
    assert.equal(authSession, null);
  }));

test("stale or malformed auth storage clears only auth records and preserves account data", () =>
  withMockWindow((storage) => {
    saveAccountProfile(
      createDefaultAccountProfileState({
        accountId: "account.local.stored",
        displayName: "Stored Account"
      })
    );

    storage.setItem("cataclysm-rpg-ui.auth.v1.session", "{bad json");
    storage.setItem("cataclysm-rpg-ui.auth.v1.credential.account.local.stored", "{bad json");

    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.notice, MALFORMED_AUTH_NOTICE);
    assert.equal(bootstrap.mode, "create_first_account");
    assert.equal(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);
    assert.equal(
      storage.getItem("cataclysm-rpg-ui.accounts.v1.account.account.local.stored") !== null,
      true
    );
  }));

test("stale persisted session referencing a missing account is cleared and falls back safely", () =>
  withMockWindow((storage) => {
    storage.setItem(
      "cataclysm-rpg-ui.auth.v1.session",
      JSON.stringify({
        accountId: "account.local.missing",
        providerId: "local_password",
        issuedAt: "2026-04-18T12:00:00.000Z",
        lastValidatedAt: "2026-04-18T12:00:00.000Z",
        stayLoggedIn: true
      })
    );

    const bootstrap = bootstrapLauncherAuth();
    assert.equal(bootstrap.mode, "create_first_account");
    assert.equal(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);
  }));

test("logout clears only the launcher session and keeps the account profile intact", async () =>
  withMockWindow(async (storage) => {
    const created = await createLocalAccount({
      displayName: "Ashen Ledger",
      password: "AshenPass",
      confirmPassword: "AshenPass",
      stayLoggedIn: true
    });
    assert.equal(created.ok, true);
    assert.notEqual(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);

    signOutLauncherSession();

    assert.equal(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);
    assert.equal(loadAccountProfile(created.accountProfile.accountId).displayName, "Ashen Ledger");
  }));

test("reset-account requires the password and clears saves, Prestige, achievements, and history", async () =>
  withMockWindow(async (storage) => {
    const created = await createLocalAccount({
      displayName: "Reset Account",
      password: "ResetPass",
      confirmPassword: "ResetPass",
      stayLoggedIn: true
    });
    assert.equal(created.ok, true);

    const granted = grantLegacy(created.accountProfile, {
      amount: 12,
      summary: "Seeded account rewards",
      sourceType: "test",
      sourceId: "reward.reset_test",
      recordedAt: "2026-04-19T12:00:00.000Z"
    });
    assert.equal(granted.ok, true);

    saveAccountProfile({
      ...granted.profile,
      achievements: {
        ...granted.profile.achievements,
        unlocked: [
          {
            achievementId: "achievement.account.first_chronicle",
            unlockedAt: "2026-04-19T12:01:00.000Z",
            sourceCharacterId: "character.reset_test"
          }
        ],
        revealedCharacterAchievementIds: ["achievement.character.reset_test"]
      },
      history: {
        runRecords: [
          {
            characterId: "character.reset_test",
            name: "Reset Hero",
            lineageId: "lineage.human",
            startingContinentId: "continent.test",
            startingRegionId: "region.test",
            startingSettlementId: "settlement.test",
            startedAt: "2026-04-19T12:00:00.000Z",
            lastSeenAt: "2026-04-19T12:01:00.000Z",
            outcome: "active",
            echoLevelReached: 1,
            notableCharacterAchievementIds: [],
            saveSlotIds: ["slot-1"]
          }
        ]
      }
    });
    storage.setItem(
      `cataclysm-rpg-ui.saves.v6.account.${created.accountProfile.accountId}.slot.slot-1`,
      "placeholder-save"
    );

    const failedReset = await resetLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "WrongPass"
    });
    assert.equal(failedReset.ok, false);
    assert.equal(loadAccountProfile(created.accountProfile.accountId).legacy.lifetimeLegacyEarned, 12);

    const reset = await resetLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "ResetPass"
    });
    assert.equal(reset.ok, true);
    assert.equal(reset.accountProfile.accountId, created.accountProfile.accountId);
    assert.equal(reset.accountProfile.displayName, "Reset Account");
    assert.equal(reset.accountProfile.legacy.legacyPoints, 0);
    assert.equal(reset.accountProfile.legacy.lifetimeLegacyEarned, 0);
    assert.deepEqual(reset.accountProfile.achievements.unlocked, []);
    assert.deepEqual(reset.accountProfile.achievements.revealedCharacterAchievementIds, []);
    assert.deepEqual(reset.accountProfile.history.runRecords, []);
    assert.equal(
      storage.getItem(`cataclysm-rpg-ui.saves.v6.account.${created.accountProfile.accountId}.slot.slot-1`),
      null
    );
    assert.notEqual(
      storage.getItem(`cataclysm-rpg-ui.auth.v1.credential.${created.accountProfile.accountId}`),
      null
    );
    assert.notEqual(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);
  }));

test("delete-account requires the correct password and removes auth, profile, and saves", async () =>
  withMockWindow(async (storage) => {
    const created = await createLocalAccount({
      displayName: "Ashen Account",
      password: "AshenPass",
      confirmPassword: "AshenPass",
      stayLoggedIn: true
    });
    assert.equal(created.ok, true);

    const failedDelete = await deleteLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "WrongPass"
    });
    assert.equal(failedDelete.ok, false);
    assert.equal(loadAccountProfile(created.accountProfile.accountId).displayName, "Ashen Account");

    const deleted = await deleteLocalAccount({
      accountId: created.accountProfile.accountId,
      password: "AshenPass"
    });
    assert.equal(deleted.ok, true);
    assert.equal(
      storage.getItem(`cataclysm-rpg-ui.accounts.v1.account.${created.accountProfile.accountId}`),
      null
    );
    assert.equal(
      storage.getItem(`cataclysm-rpg-ui.auth.v1.credential.${created.accountProfile.accountId}`),
      null
    );
    assert.equal(storage.getItem("cataclysm-rpg-ui.auth.v1.session"), null);
    assert.equal(storage.getItem("cataclysm-rpg-ui.accounts.v1.active-account"), null);
  }));

test("constant-time byte comparison distinguishes equal and non-equal verifiers", () => {
  assert.equal(
    constantTimeEqualBytes(
      new Uint8Array([1, 2, 3, 4]),
      new Uint8Array([1, 2, 3, 4])
    ),
    true
  );
  assert.equal(
    constantTimeEqualBytes(
      new Uint8Array([1, 2, 3, 4]),
      new Uint8Array([1, 2, 3, 5])
    ),
    false
  );
  assert.equal(
    constantTimeEqualBytes(
      new Uint8Array([1, 2, 3]),
      new Uint8Array([1, 2, 3, 4])
    ),
    false
  );
});

test("launcher auth UI surfaces expose account login, create, delete, and logout copy", () => {
  const accessSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/LocalAccountAccessScreen.tsx", import.meta.url),
    "utf8"
  );
  const mainMenuSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx", import.meta.url),
    "utf8"
  );

  assert.match(accessSource, /Account Login/);
  assert.match(accessSource, /Log In/);
  assert.match(accessSource, /Create Account/);
  assert.match(accessSource, /Stay signed in/);
  assert.match(accessSource, /Delete Account/);
  assert.match(accessSource, /sm:grid-cols-2 xl:grid-cols-3/);
  assert.doesNotMatch(accessSource, /Ledger Notes/);
  assert.doesNotMatch(accessSource, /Claim Ledger/);
  assert.doesNotMatch(accessSource, /Choose an account to sign in/);
  assert.doesNotMatch(accessSource, /title="Accounts"/);
  assert.match(mainMenuSource, /accountProfile\.displayName/);
  assert.match(mainMenuSource, /Log Out/);
  assert.doesNotMatch(mainMenuSource, /Signed In/);
});
