import { useEffect, useReducer, useRef, useState } from 'react';
import { hasPendingNormalDefeat } from '../../../packages/engines/game-engine/src/normal-defeat.js';
import { resolveLegacyPreparationSelection } from '../../../packages/engines/game-engine/src/legacy-unlocks.js';
import type { CampaignSessionControl } from '../../../packages/engines/game-engine/src/campaign-session.js';
import type { SaveSnapshot } from '../../../packages/shared/types/src/index.js';
import { InGameShell } from './game-shell/InGameShell';
import { createDefaultCharacterCreationFormState, validateCharacterCreationForm } from './game-shell/characterCreationForm.js';
import { CharacterCreationScreen } from './game-shell/components/CharacterCreationScreen.js';
import { LoadGameScreen } from './game-shell/components/LoadGameScreen.js';
import { LocalAccountAccessScreen } from './game-shell/components/LocalAccountAccessScreen.js';
import { MainMenuScreen, type LauncherSectionId } from './game-shell/components/MainMenuScreen.js';
import { SettingsScreen } from './game-shell/components/SettingsScreen.js';
import { CleanEpochAccountAdapter, createEpochAccountId } from './game-shell/cleanEpochAccountAdapter.js';
import { CLEAN_EPOCH_SESSION_STORAGE_KEY, openCleanEpochAccountStore,
  type CleanEpochAccountStore, type CleanEpochSlotSummary } from './game-shell/cleanEpochAccountStore.js';
import { CleanEpochDescendantAdapter } from './game-shell/cleanEpochDescendantAdapter.js';
import { CleanEpochNormalDefeatRecoveryAdapter } from './game-shell/cleanEpochNormalDefeatRecoveryAdapter.js';
import { CleanEpochTerminalAdapter } from './game-shell/cleanEpochTerminalAdapter.js';
import { CleanEpochFirstCampaignAdapter } from './game-shell/cleanEpochFirstCampaignAdapter.js';
import { CleanEpochLauncherRead } from './game-shell/cleanEpochLauncherRead.js';
import { CleanEpochLegacyActionAdapter, type EpochLegacyAction } from './game-shell/cleanEpochLegacyActionAdapter.js';
import type { LauncherAccountDeletionResult, LauncherAuthResult, LauncherRuntimeSession } from './game-shell/launcherAuthManager.js';
import { createAccountAccessState, gameShellReducer, getPreferredLoadSlotId, getPreferredSaveSlotId,
  getSaveSlotLabel, SAVE_SLOT_ORDER, type GameShellNotice, type GameShellState, type ManualSaveSlotId,
  type SaveSlotId, type SaveSlotSummary } from './game-shell/state.js';

type Services = { owner: CleanEpochAccountStore; accounts: CleanEpochAccountAdapter;
  launcher: CleanEpochLauncherRead; first: CleanEpochFirstCampaignAdapter; descendant: CleanEpochDescendantAdapter;
  normalDefeat: CleanEpochNormalDefeatRecoveryAdapter; legacy: CleanEpochLegacyActionAdapter;
  terminal: CleanEpochTerminalAdapter };
type Address = { artifactId: string; publicationId: string };
type MenuDeletionSource = { slotGenerationId: string; address: Address };
type Inventory = { account: Awaited<ReturnType<CleanEpochAccountStore['readSelected']>> & {};
  slots: CleanEpochSlotSummary[] };
type ThemePreference = 'system' | 'dark' | 'light';
const THEME_KEY = 'cataclysm-rpg.theme-mode';
const TIME_KEY = 'cataclysm-rpg.launcher-time-settings.v1';

function readTheme(): ThemePreference {
  try { const value = window.localStorage.getItem(THEME_KEY);
    return value === 'dark' || value === 'light' || value === 'system' ? value : 'system'; }
  catch { return 'system'; }
}
function readTime(): { timeZone: string; hourFormat: '12' | '24' } {
  try { const value = JSON.parse(window.localStorage.getItem(TIME_KEY) ?? 'null');
    if (typeof value?.timeZone === 'string' && (value.hourFormat === '12' || value.hourFormat === '24')) return value; }
  catch { /* Optional presentation preference. */ }
  return { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', hourFormat: '12' };
}
function formatClock(now: Date, timeZone: string, hourFormat: '12' | '24'): string {
  try { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit',
    hour12: hourFormat === '12', timeZone }).format(now); }
  catch { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit',
    hour12: hourFormat === '12', timeZone: 'UTC' }).format(now); }
}

const blockedNotice = (detail: string): GameShellNotice => ({ tone: 'warning', title: 'Campaign Data Unavailable', detail });
const heldNotice = (action: string): GameShellNotice => ({ tone: 'warning', title: `${action} Unavailable`,
  detail: 'This account or campaign action awaits the G9 lifecycle owner. Your campaign data was not changed.' });

function slotSummaries(raw: CleanEpochSlotSummary[]): SaveSlotSummary[] {
  const byId = new Map(raw.map(slot => [slot.slotId, slot]));
  if (byId.size !== SAVE_SLOT_ORDER.length) throw new Error('Epoch slot inventory is incomplete.');
  return SAVE_SLOT_ORDER.map(slot => {
    const read = byId.get(slot.id);
    if (!read) throw new Error(`Epoch slot ${slot.id} is missing.`);
    const metadata = read.metadata;
    const ready = read.status === 'ready' && metadata !== null;
    if (read.status === 'ready' && !metadata) throw new Error(`Ready slot ${slot.id} lacks metadata.`);
    return { ...slot, status: read.status,
      hasSave: ready, metadata, playerName: metadata?.characterName ?? null,
      lineageLabel: metadata?.lineageLabel ?? null, sexLabel: metadata?.sexLabel ?? null,
      classLabel: metadata?.classLabel ?? null, backstoryLabel: metadata?.backstoryLabel ?? null,
      startingBundleLabel: metadata?.startingBundleLabel ?? null, level: metadata?.level ?? null,
      regionLabel: metadata?.regionLabel ?? null, settlementLabel: metadata?.settlementLabel ?? null,
      startingSettlementLabel: metadata?.startingSettlementLabel ?? null,
      currentLocationLabel: metadata?.currentLocationLabel ?? null, gold: metadata?.gold ?? null,
      fundsLabel: metadata?.fundsLabel ?? null, inGameDate: metadata?.inGameDate ?? null,
      lastSavedAt: metadata?.lastSavedAt ?? null, lastSavedLabel: metadata?.lastSavedAt ?? null,
      playtimeLabel: metadata ? `${metadata.totalPlayTicks} ticks` : null,
      capturedAtTick: metadata?.capturedAtTick ?? null, snapshotVersion: metadata?.snapshotVersion ?? null };
  });
}

function address(read: Awaited<ReturnType<CleanEpochAccountStore['readSlot']>>): Address | null {
  if (read.status === 'empty') return null;
  if (read.status !== 'ready') throw new Error(`Slot ${read.slotId} is ${read.status}; resolve retained authority first.`);
  return { artifactId: read.loaded.sessionControl.loadedArtifactId,
    publicationId: read.loaded.sessionControl.loadedPublicationId };
}

export function EpochApp() {
  const [state, dispatch] = useReducer(gameShellReducer, createAccountAccessState('create_first_account', [], null));
  const [boot, setBoot] = useState<'loading' | 'ready' | 'blocked'>('loading');
  const [blockDetail, setBlockDetail] = useState('');
  const [services, setServices] = useState<Services | null>(null);
  const [busy, setBusy] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(readTheme);
  const [timeSettings, setTimeSettings] = useState(readTime);
  const [launcherSection, setLauncherSection] = useState<LauncherSectionId>('characters');
  const [clockNow, setClockNow] = useState(() => new Date());
  const themeMode = themePreference === 'system' && window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light' : themePreference === 'light' ? 'light' : 'dark';
  const clockLabel = formatClock(clockNow, timeSettings.timeZone, timeSettings.hourFormat);
  const actionPending = useRef(false);
  const accountIdForRegistration = useRef<string | null>(null);
  const sourceSlot = useRef<SaveSlotId | null>(null);
  const observedAccountRevision = useRef<number | null>(null);
  const menuAccountRevision = useRef<number | null>(null);
  const observedAddresses = useRef<Partial<Record<SaveSlotId, Address | null>>>({});
  const menuDeletionSources = useRef<Partial<Record<SaveSlotId, MenuDeletionSource>>>({});
  const submittedAccountDeletion = useRef<{ key: string; requestId: string } | null>(null);
  const initializationGeneration = useRef(0);
  const activeOwner = useRef<CleanEpochAccountStore | null>(null);

  const block = (detail: string) => { setBlockDetail(detail); setBoot('blocked'); };
  const notice = (value: GameShellNotice) => dispatch({ type: 'SET_NOTICE', notice: value });
  const unsupported = (action: string) => notice(heldNotice(action));
  const failed = (title: string, detail: string) => notice({ tone: 'warning', title, detail });
  const deletionRequestId = (accountId: string, revision: number, generation: number,
    password: string): string => {
    const key = JSON.stringify([accountId, revision, generation, password]);
    if (submittedAccountDeletion.current?.key !== key)
      submittedAccountDeletion.current = { key, requestId: crypto.randomUUID() };
    return submittedAccountDeletion.current.requestId;
  };
  const guarded = async <T,>(work: () => Promise<T>, fallback: T,
    validateSession = true): Promise<T> => {
    if (actionPending.current) return fallback;
    actionPending.current = true;
    setBusy(true);
    try {
      if (validateSession && state.screen !== 'ACCOUNT_ACCESS' && services)
        await services.accounts.validateSession(state.launcherSession);
      return await work();
    }
    catch (error) { block(error instanceof Error ? error.message : String(error)); return fallback; }
    finally { actionPending.current = false; setBusy(false); }
  };
  const captureMenuDeletionSources = async (next: Services, accountId: string,
    slots: CleanEpochSlotSummary[]) => {
    const captured: Partial<Record<SaveSlotId, MenuDeletionSource>> = {};
    for (const slot of slots) {
      if (slot.status !== 'ready') continue;
      const [read, pointer] = await Promise.all([
        next.owner.readSlot(accountId, slot.slotId),
        next.owner.readSlotGeneration(accountId, slot.slotId)
      ]);
      if (read.status !== 'ready' || !pointer || pointer.status !== 'published')
        throw new Error(`Ready slot ${slot.slotId} lost its deletion source.`);
      captured[slot.slotId] = { slotGenerationId: pointer.slotGenerationId,
        address: { artifactId: read.loaded.sessionControl.loadedArtifactId,
          publicationId: read.loaded.sessionControl.loadedPublicationId } };
    }
    menuDeletionSources.current = captured;
  };

  const completePending = async (next: Services, accountId: string, slots: CleanEpochSlotSummary[]) => {
    for (const slot of slots) {
      if (slot.status !== 'pending_consumers') continue;
      const attempt = await next.owner.readAttempt(accountId, slot.slotId);
      const firstRecovery = attempt ? await next.owner.readRecovery(accountId, slot.slotId) : null;
      if (firstRecovery?.status === 'accepted_pending_consumers') {
        const resumed = await next.first.resume(accountId, slot.slotId as ManualSaveSlotId);
        if (resumed.status === 'blocked') throw new Error(resumed.message);
      } else {
        // A single pending campaign head can make older source addresses appear pending too.
        // Only the destination address owns the retained descendant recovery.
        const recovery = await next.owner.readCurrentDescendantRecovery(accountId, slot.slotId);
        if (!recovery) continue;
        const resumed = await next.descendant.resumeCurrent(accountId, slot.slotId);
        if (resumed.status === 'blocked') throw new Error(resumed.message);
      }
    }
  };

  const inventory = async (next: Services, accountId: string): Promise<Inventory> => {
    let result = await next.launcher.inventory(accountId);
    if (result.status === 'blocked') throw new Error(result.message);
    await completePending(next, accountId, result.value.slots);
    const terminal = await next.terminal.resumePending(accountId);
    if (terminal?.status === 'blocked') throw new Error(terminal.message);
    await next.owner.closePendingTerminalAddressesForAccount(accountId);
    result = await next.launcher.inventory(accountId);
    if (result.status === 'blocked') throw new Error(result.message);
    if (result.value.slots.some(slot => slot.status === 'pending_consumers'))
      throw new Error('Retained campaign publication remains pending after recovery.');
    return result.value;
  };

  const initialize = async () => {
    const generation = ++initializationGeneration.current;
    activeOwner.current?.close();
    activeOwner.current = null;
    setServices(null);
    setBoot('loading');
    let owner: CleanEpochAccountStore | null = null;
    try {
      owner = await openCleanEpochAccountStore();
      if (generation !== initializationGeneration.current) { owner.close(); return; }
      const accounts = new CleanEpochAccountAdapter(owner);
      const next: Services = { owner, accounts, launcher: new CleanEpochLauncherRead(owner, accounts),
        first: new CleanEpochFirstCampaignAdapter(owner), descendant: new CleanEpochDescendantAdapter(owner),
        normalDefeat: new CleanEpochNormalDefeatRecoveryAdapter(owner),
        legacy: new CleanEpochLegacyActionAdapter(owner),
        terminal: new CleanEpochTerminalAdapter(owner) };
      const selected = await next.launcher.bootstrap();
      if (selected.status === 'blocked') throw new Error(selected.message);
      if (selected.value.mode === 'pick_account') {
        dispatch({ type: 'SHOW_ACCOUNT_ACCESS', accessMode: selected.value.accounts.length ? 'pick_account' : 'create_first_account',
          accounts: selected.value.accounts, notice: null });
      } else {
        const found = await inventory(next, selected.value.inventory.account.accountId);
        menuAccountRevision.current = found.account.revision;
        await captureMenuDeletionSources(next, found.account.accountId, found.slots);
        dispatch({ type: 'SHOW_MAIN_MENU', launcherSession: selected.value.session,
          accountProfile: found.account.profile, slots: slotSummaries(found.slots), notice: null });
      }
      if (generation !== initializationGeneration.current) { owner.close(); return; }
      activeOwner.current = owner;
      setServices(next);
      setBoot('ready');
    } catch (error) {
      owner?.close();
      if (generation === initializationGeneration.current)
        block(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    void initialize();
    return () => { ++initializationGeneration.current; activeOwner.current?.close(); activeOwner.current = null; };
  }, []);
  useEffect(() => { const timer = window.setInterval(() => setClockNow(new Date()), 1000);
    return () => window.clearInterval(timer); }, []);
  useEffect(() => { document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode; }, [themeMode]);
  useEffect(() => { try { window.localStorage.setItem(THEME_KEY, themePreference); } catch { /* Optional preference. */ } }, [themePreference]);
  useEffect(() => { try { window.localStorage.setItem(TIME_KEY, JSON.stringify(timeSettings)); } catch { /* Optional preference. */ } }, [timeSettings]);

  const showMenu = async (session: LauncherRuntimeSession, accountId: string,
    message: GameShellNotice | ((found: Inventory) => GameShellNotice) | null = null,
    section?: LauncherSectionId) => {
    if (!services) throw new Error('Epoch owner is unavailable.');
    const found = await inventory(services, accountId);
    menuAccountRevision.current = found.account.revision;
    await captureMenuDeletionSources(services, accountId, found.slots);
    if (section) setLauncherSection(section);
    dispatch({ type: 'SHOW_MAIN_MENU', launcherSession: session, accountProfile: found.account.profile,
      slots: slotSummaries(found.slots), notice: typeof message === 'function' ? message(found) : message });
  };

  const signIn = (options: { accountId: string; password: string; stayLoggedIn: boolean }): Promise<LauncherAuthResult> =>
    guarded(async () => {
      if (!services) throw new Error('Epoch owner is unavailable.');
      const result = await services.accounts.signIn(options);
      if (result.status === 'blocked') {
        if (result.code === 'invalid_credentials' || result.code === 'invalid_input') {
          failed('Could Not Sign In', result.message); return { ok: false, message: result.message };
        }
        throw new Error(result.message);
      }
      await showMenu(result.value.session, result.value.account.accountId,
        { tone: 'success', title: 'Signed In', detail: `${result.value.account.profile.displayName} is signed in.` });
      return { ok: true, session: result.value.session, accountProfile: result.value.account.profile };
    }, { ok: false, message: 'Account operation is already pending or blocked.' });

  const createAccount = (options: { displayName: string; password: string; confirmPassword: string;
    stayLoggedIn: boolean }): Promise<LauncherAuthResult> => guarded(async () => {
      if (!services) throw new Error('Epoch owner is unavailable.');
      const accountId = accountIdForRegistration.current ?? createEpochAccountId();
      accountIdForRegistration.current = accountId;
      const result = await services.accounts.register({ ...options, accountId });
      if (result.status === 'blocked') {
        if (result.code === 'invalid_input') { failed('Could Not Create Account', result.message);
          return { ok: false, message: result.message }; }
        throw new Error(result.message);
      }
      accountIdForRegistration.current = null;
      await showMenu(result.value.session, accountId,
        { tone: 'success', title: 'Account Created', detail: `${result.value.account.profile.displayName} is ready.` });
      return { ok: true, session: result.value.session, accountProfile: result.value.account.profile };
    }, { ok: false, message: 'Account operation is already pending or blocked.' });

  const captureAddresses = async (next: Services, accountId: string, activeSlotId: SaveSlotId) => {
    const ids = new Set<SaveSlotId>([activeSlotId, 'quick-save']);
    const captured: Partial<Record<SaveSlotId, Address | null>> = {};
    for (const id of ids) captured[id] = address(await next.owner.readSlot(accountId, id));
    observedAddresses.current = captured;
  };

  const enter = async (session: LauncherRuntimeSession, accountId: string, slotId: SaveSlotId,
    loaded?: { snapshot: SaveSnapshot; sessionControl: CampaignSessionControl }) => {
    if (!services) throw new Error('Epoch owner is unavailable.');
    const found = await inventory(services, accountId);
    const selected = loaded ?? (() => { throw new Error('Exact slot readback is required.'); })();
    await captureAddresses(services, accountId, slotId);
    observedAccountRevision.current = found.account.revision;
    sourceSlot.current = slotId;
    dispatch({ type: 'ENTER_GAME', launcherSession: session, accountProfile: found.account.profile,
      slots: slotSummaries(found.slots), slotId, snapshot: selected.snapshot,
      campaignSessionControl: selected.sessionControl,
      notice: { tone: 'accent', title: 'Campaign Ready', detail: `${getSaveSlotLabel(slotId)} read back from the campaign store.` } });
  };

  const recoverLoaded = async (accountId: string, slotId: SaveSlotId, expectedAccountRevision: number,
    loaded: { snapshot: SaveSnapshot; sessionControl: CampaignSessionControl }) => {
    if (!services || !hasPendingNormalDefeat(loaded.snapshot)) return loaded;
    const recovered = await services.normalDefeat.recover({ accountId, sourceSlotId: slotId,
      destinationSlotId: slotId, expectedDestinationAddress: {
        artifactId: loaded.sessionControl.loadedArtifactId,
        publicationId: loaded.sessionControl.loadedPublicationId },
      expectedAccountRevision, snapshot: loaded.snapshot, control: loaded.sessionControl,
      receiptId: loaded.snapshot.normalDefeatReceipts?.find(receipt => receipt.posture === 'recovery_pending')?.receiptId ?? '' });
    if (recovered.status === 'blocked') throw new Error(recovered.message);
    return recovered.value.loaded;
  };

  const load = (session: LauncherRuntimeSession, accountId: string, slotId: SaveSlotId) =>
    guarded(async () => {
      if (!services) throw new Error('Epoch owner is unavailable.');
      const found = await inventory(services, accountId);
      const result = await services.launcher.load(accountId, found.account.revision, slotId);
      if (result.status === 'blocked') throw new Error(result.message);
      await enter(session, accountId, slotId,
        await recoverLoaded(accountId, slotId, result.value.account.revision, result.value.slot.loaded));
    }, undefined);

  const activateSlot = (slotId: ManualSaveSlotId) => guarded(async () => {
    if (state.screen !== 'MAIN_MENU' || !services) return;
    const found = await inventory(services, state.accountProfile.accountId);
    const slot = found.slots.find(entry => entry.slotId === slotId);
    if (!slot) throw new Error('Selected slot is missing.');
    if (slot.status === 'ready') {
      const result = await services.launcher.load(found.account.accountId, found.account.revision, slotId);
      if (result.status === 'blocked') throw new Error(result.message);
      await enter(state.launcherSession, found.account.accountId, slotId,
        await recoverLoaded(found.account.accountId, slotId, result.value.account.revision, result.value.slot.loaded));
    } else if (slot.status === 'prepared') {
      const resumed = await services.first.resume(found.account.accountId, slotId);
      if (resumed.status === 'blocked') throw new Error(resumed.message);
      await enter(state.launcherSession, found.account.accountId, slotId, resumed.value.loaded);
    } else if (slot.status === 'empty') {
      dispatch({ type: 'OPEN_CHARACTER_CREATION', launcherSession: state.launcherSession,
        accountProfile: found.account.profile, slots: slotSummaries(found.slots),
        form: createDefaultCharacterCreationFormState(slotId), notice: null });
    } else throw new Error(`Slot is ${slot.status}; resolve retained authority before continuing.`);
  }, undefined);

  const createCampaign = (forceOverwrite: boolean, options?: { hasSelectableBackstories: boolean }) =>
    guarded(async () => {
      if (state.screen !== 'CHARACTER_CREATION' || !services) return;
      if (forceOverwrite) { unsupported('Overwrite'); return; }
      const validation = validateCharacterCreationForm(state.form, { accountProfile: state.accountProfile,
        ...(options ? { hasSelectableBackstories: options.hasSelectableBackstories } : {}) });
      if (!validation.isValid) { failed('Character Creation Incomplete', 'Complete the required fields first.'); return; }
      const found = await inventory(services, state.accountProfile.accountId);
      const slot = found.slots.find(entry => entry.slotId === state.form.saveSlotId);
      if (slot?.status !== 'empty' && slot?.status !== 'prepared') throw new Error('Creator slot is no longer empty or prepared.');
      const started = await services.first.start(state.accountProfile.accountId, state.form,
        options?.hasSelectableBackstories);
      if (started.status === 'blocked') throw new Error(started.message);
      await enter(state.launcherSession, state.accountProfile.accountId, state.form.saveSlotId, started.value.loaded);
    }, undefined);

  const save = (destinationSlotId: SaveSlotId) => guarded(async () => {
    if (state.screen !== 'IN_GAME' || !services) return;
    const defeatPending = hasPendingNormalDefeat(state.snapshot);
    const sourceSlotId = sourceSlot.current;
    const expectedDestinationAddress = observedAddresses.current[destinationSlotId];
    if (!sourceSlotId || expectedDestinationAddress === undefined)
      throw new Error('Destination address was not captured when this session was loaded.');
    const accountId = state.accountProfile.accountId;
    const expectedAccountRevision = observedAccountRevision.current;
    if (expectedAccountRevision === null) throw new Error('Session account revision was not captured.');
    const result = defeatPending ? await services.normalDefeat.recover({ accountId, sourceSlotId,
      destinationSlotId, expectedDestinationAddress, expectedAccountRevision,
      snapshot: state.snapshot, control: state.campaignSessionControl,
      receiptId: state.snapshot.normalDefeatReceipts?.find(receipt => receipt.posture === 'recovery_pending')?.receiptId ?? '' })
      : await services.descendant.save({ accountId, sourceSlotId, destinationSlotId,
        expectedDestinationAddress, expectedAccountRevision,
        snapshot: state.snapshot, control: state.campaignSessionControl });
    if (result.status === 'blocked') throw new Error(result.message);
    const found = await inventory(services, accountId);
    await captureAddresses(services, accountId, state.activeSlotId);
    observedAccountRevision.current = found.account.revision;
    sourceSlot.current = destinationSlotId;
    dispatch({ type: 'COMPLETE_IN_GAME_SAVE', launcherSession: state.launcherSession,
      accountProfile: found.account.profile, slots: slotSummaries(found.slots), activeSlotId: state.activeSlotId,
      snapshot: result.value.loaded.snapshot, campaignSessionControl: result.value.loaded.sessionControl,
      notice: { tone: 'success', title: defeatPending ? 'Defeat Recovery Saved' : 'Game Data Saved',
        detail: `Saved to ${getSaveSlotLabel(destinationSlotId)} and verified its exact ready address.` } });
  }, undefined);

  const retire = () => {
    if (state.screen !== 'IN_GAME' || !services) return;
    if (!window.confirm(`Retire ${state.snapshot.playerState.coreData.playerName}? This closes the campaign, records its final history and empties its save slots after settlement.`)) return;
    void guarded(async () => {
      if (state.screen !== 'IN_GAME' || !services) return;
      const sourceSlotId = sourceSlot.current;
      const expectedAccountRevision = observedAccountRevision.current;
      const expectedSourceAddress = sourceSlotId ? observedAddresses.current[sourceSlotId] : undefined;
      if (!sourceSlotId || expectedAccountRevision === null || !expectedSourceAddress)
        throw new Error('Retirement source address or account revision was not captured.');
      const result = await services.terminal.retire({ accountId: state.accountProfile.accountId,
        sourceSlotId, expectedAccountRevision, expectedSourceAddress,
        snapshot: state.snapshot, control: state.campaignSessionControl });
      if (result.status === 'blocked') throw new Error(result.message);
      sourceSlot.current = null; observedAccountRevision.current = null;
      observedAddresses.current = {};
      await showMenu(state.launcherSession, state.accountProfile.accountId,
        { tone: 'success', title: 'Character Retired',
          detail: `${state.snapshot.playerState.coreData.playerName}'s retirement was recorded and verified. The closed campaign remains in history.` });
    }, undefined);
  };

  const refreshMenu = (message: GameShellNotice | null = null, section?: LauncherSectionId) =>
    guarded(async () => { if (state.screen === 'ACCOUNT_ACCESS') return;
      await showMenu(state.launcherSession, state.accountProfile.accountId, message, section); }, undefined);

  const deleteSlot = (slotId: SaveSlotId) => {
    if ((state.screen !== 'MAIN_MENU' && state.screen !== 'LOAD_GAME') || !services) return;
    const source = menuDeletionSources.current[slotId];
    const expectedAccountRevision = menuAccountRevision.current;
    if (!source || expectedAccountRevision === null) {
      failed('Could Not Delete Save', 'The verified slot address was not captured. Refresh the account menu.');
      return;
    }
    void guarded(async () => {
      if (!services || (state.screen !== 'MAIN_MENU' && state.screen !== 'LOAD_GAME')) return;
      try {
        await services.owner.deleteSlotAddress({ accountId: state.accountProfile.accountId,
          slotId, expectedAccountRevision, expectedSlotGenerationId: source.slotGenerationId,
          expectedAddress: source.address, deletedAt: new Date().toISOString() });
        await showMenu(state.launcherSession, state.accountProfile.accountId,
          found => ({ tone: 'success', title: 'Save Address Removed',
            detail: found.slots.find(slot => slot.slotId === slotId)?.status === 'empty'
              ? `${getSaveSlotLabel(slotId)} is empty. Campaign history remains retained.`
              : `The earlier ${getSaveSlotLabel(slotId)} address was removed. The slot is currently occupied; campaign history remains retained.` }));
      } catch (error) {
        await showMenu(state.launcherSession, state.accountProfile.accountId,
          blockedNotice(error instanceof Error ? error.message : String(error)));
      }
    }, undefined);
  };

  const loadLatest = () => { if (state.screen === 'ACCOUNT_ACCESS') return;
    const slotId = getPreferredLoadSlotId(state.slots);
    if (slotId) void load(state.launcherSession, state.accountProfile.accountId, slotId);
    else void refreshMenu(blockedNotice('No ready campaign slot is available. Open an empty slot to create one.')); };

  const logout = () => void guarded(async () => {
    window.localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
    if (window.localStorage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY) !== null)
      throw new Error('Epoch session hint could not be cleared.');
    sourceSlot.current = null; observedAccountRevision.current = null;
    menuAccountRevision.current = null; observedAddresses.current = {};
    await initialize();
  }, undefined);

  const applyLegacy = (action: EpochLegacyAction) => void guarded(async () => {
    if (state.screen !== 'MAIN_MENU' || !services) return;
    const expectedRevision = menuAccountRevision.current;
    if (expectedRevision === null) throw new Error('Menu account revision was not captured.');
    const result = await services.legacy.apply({ accountId: state.accountProfile.accountId,
      expectedRevision, expectedProfile: state.accountProfile, action });
    if (result.status === 'rejected') { failed('Legacy Action Unavailable', result.message); return; }
    if (result.status === 'blocked') throw new Error(result.message);
    await showMenu(state.launcherSession, state.accountProfile.accountId,
      { tone: 'success', title: result.title, detail: result.detail }, 'legacy');
  }, undefined);

  if (boot !== 'ready' || !services) return <div data-theme={themeMode} className="min-h-screen p-8 text-[color:var(--color-text-strong)]">
    <h1 className="text-2xl font-semibold">Lineage: Reforged</h1>
    {boot === 'blocked' ? <><p role="alert" className="mt-5 max-w-2xl">Campaign data is unavailable: {blockDetail}</p>
      <button type="button" className="launcher-control mt-5 px-4 py-2" onClick={() => void initialize()}>Retry campaign data</button></>
      : <p className="mt-5">Opening the campaign store…</p>}
  </div>;

  const current = state;
  const common = { notice: current.notice, onDismissNotice: () => dispatch({ type: 'SET_NOTICE', notice: null }) };
  let content;
  if (current.screen === 'ACCOUNT_ACCESS') content = <LocalAccountAccessScreen {...common}
    allowAccountDeletion
    mode={current.accessMode} accounts={current.accounts} onSignIn={signIn} onCreateAccount={createAccount}
    onDeleteAccount={options => guarded(async (): Promise<LauncherAccountDeletionResult> => {
      if (!services) throw new Error('Epoch owner is unavailable.');
      if (!Number.isSafeInteger(options.observedRevision) ||
          !Number.isSafeInteger(options.observedGeneration))
        return { ok: false, message: 'Picker account source is unavailable.' };
      const result = await services.accounts.deleteAccount({ ...options,
        expectedRevision: options.observedRevision!, expectedGeneration: options.observedGeneration!,
        requestId: deletionRequestId(options.accountId, options.observedRevision!,
          options.observedGeneration!, options.password) });
      if (result.status === 'blocked') return { ok: false, message: result.message };
      await initialize();
      submittedAccountDeletion.current = null;
      return { ok: true, accountId: result.value.accountId, displayName: result.value.displayName };
    }, { ok: false, message: 'Account operation is already pending or blocked.' })}
    themeMode={themeMode} onToggleThemeMode={() => setThemePreference(themeMode === 'dark' ? 'light' : 'dark')} />;
  else if (current.screen === 'MAIN_MENU') content = <MainMenuScreen {...common}
    accountProfile={current.accountProfile} slots={current.slots} activeSection={launcherSection}
    allowDeleteSlot addressOnlyDeletion
    onActiveSectionChange={setLauncherSection} onActivateSlot={slotId => void activateSlot(slotId)}
    onDeleteSlot={deleteSlot} onContinue={loadLatest}
    onOpenLoadGame={() => dispatch({ type: 'OPEN_LOAD_GAME', launcherSession: current.launcherSession,
      accountProfile: current.accountProfile, slots: current.slots,
      selectedSlotId: getPreferredLoadSlotId(current.slots), notice: null })}
    onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS', launcherSession: current.launcherSession,
      accountProfile: current.accountProfile, slots: current.slots, notice: null })}
    onPurchaseLegacyUnlock={unlockId => applyLegacy({ kind: 'purchase', unlockId, recordedAt: new Date().toISOString() })}
    onSelectLegacyPreparation={unlockId => applyLegacy({ kind: 'select', unlockId })}
    onSetLegacyPreparationChoice={(unlockId, choiceId) => applyLegacy({ kind: 'choice', unlockId, choiceId })}
    onRemoveLegacyPreparation={unlockId => applyLegacy({ kind: 'remove', unlockId })}
    onLogout={logout} onExit={() => window.close()}
    clockLabel={clockLabel} clockTitle={clockNow.toString()} />;
  else if (current.screen === 'CHARACTER_CREATION') {
    const preparation = resolveLegacyPreparationSelection(current.accountProfile);
    content = <CharacterCreationScreen {...common} form={current.form} accountProfile={current.accountProfile}
      appliedLegacyPreparationIds={preparation.selectedUnlockIds}
      appliedLegacyPreparationChoices={preparation.selectedChoicePayloads}
      eligibleHeirSources={[]} slots={current.slots} pendingOverwriteSlotId={current.pendingOverwriteSlotId}
      onReturnToMainMenu={() => void refreshMenu()}
      onChange={form => dispatch({ type: 'UPDATE_CHARACTER_CREATION_FORM', form })}
      onCreateGame={options => void createCampaign(false, options)}
      onConfirmOverwrite={options => void createCampaign(true, options)}
      onCancelOverwrite={() => dispatch({ type: 'SET_CHARACTER_OVERWRITE', slotId: null })}
      themeMode={themeMode} onToggleThemeMode={() => setThemePreference(themeMode === 'dark' ? 'light' : 'dark')} />;
  } else if (current.screen === 'LOAD_GAME') content = <LoadGameScreen {...common} slots={current.slots}
    epochMode allowDeleteSlot
    selectedSlotId={current.selectedSlotId} onBack={() => void refreshMenu()}
    onSelectSlot={slotId => dispatch({ type: 'SELECT_LOAD_SLOT', slotId })}
    onLoadSelected={() => { if (current.selectedSlotId) void load(current.launcherSession,
      current.accountProfile.accountId, current.selectedSlotId); }}
    onDeleteSlot={deleteSlot} />;
  else if (current.screen === 'SETTINGS') content = <SettingsScreen {...common} accountProfile={current.accountProfile}
    allowAccountLifecycle
    slots={current.slots} onOpenLauncherSection={section => void refreshMenu(null, section)}
    onResetAccount={options => guarded(async () => {
      if (!services || state.screen !== 'SETTINGS' || menuAccountRevision.current === null)
        return { ok: false, message: 'Account reset source is unavailable.' };
      const result = await services.accounts.resetAccount({ ...options,
        expectedRevision: menuAccountRevision.current,
        expectedGeneration: Number(state.launcherSession.metadata?.epochGeneration),
        stayLoggedIn: state.launcherSession.stayLoggedIn });
      if (result.status === 'blocked') return { ok: false, message: result.message };
      await showMenu(result.value.session, result.value.account.accountId,
        { tone: 'success', title: 'Account Reset', detail: 'Account data was erased and read back.' });
      return { ok: true };
    }, { ok: false, message: 'Account operation is already pending or blocked.' })}
    onDeleteAccount={options => guarded(async () => {
      if (!services || state.screen !== 'SETTINGS' || menuAccountRevision.current === null)
        return { ok: false, message: 'Account deletion source is unavailable.' };
      const generation = Number(state.launcherSession.metadata?.epochGeneration);
      const result = await services.accounts.deleteAccount({ ...options,
        expectedRevision: menuAccountRevision.current, expectedGeneration: generation,
        requestId: deletionRequestId(options.accountId, menuAccountRevision.current,
          generation, options.password) });
      if (result.status === 'blocked') return { ok: false, message: result.message };
      await initialize();
      submittedAccountDeletion.current = null;
      return { ok: true };
    }, { ok: false, message: 'Account operation is already pending or blocked.' }, false)}
    onContinue={loadLatest} onExit={() => window.close()} onLogout={logout} themeMode={themeMode}
    themePreference={themePreference} onThemePreferenceChange={setThemePreference}
    timeZone={timeSettings.timeZone} onTimeZoneChange={timeZone => setTimeSettings(current => ({ ...current, timeZone }))}
    hourFormat={timeSettings.hourFormat} onHourFormatChange={hourFormat => setTimeSettings(current => ({ ...current, hourFormat }))} clockLabel={clockLabel}
    clockTitle={clockNow.toString()} clockNow={clockNow} />;
  else content = <InGameShell {...common} accountProfile={current.accountProfile} snapshot={current.snapshot}
    campaignSessionControl={current.campaignSessionControl} slots={current.slots}
    activeSlotId={current.activeSlotId} hasUnsavedChanges={current.hasUnsavedChanges}
    onSnapshotChange={(snapshot, campaignSessionControl) => dispatch({ type: 'UPDATE_IN_GAME_SNAPSHOT',
      launcherSession: current.launcherSession, accountProfile: current.accountProfile, slots: current.slots,
      snapshot, campaignSessionControl })}
    onSave={() => void save(current.activeSlotId)} onQuickSave={() => void save('quick-save')}
    onRetireCharacter={retire}
    onReturnToMainMenu={() => {
      if (current.hasUnsavedChanges && !window.confirm('Discard unsaved in-memory changes and return to the menu?')) return;
      void refreshMenu();
    }} />;
  return <div data-theme={themeMode} className={`min-h-screen ${busy ? 'pointer-events-none opacity-75' : ''}`}>
    {content}
    {busy && <div role="status" className="fixed bottom-4 right-4 rounded bg-black px-4 py-2 text-white">Saving campaign data…</div>}
  </div>;
}
