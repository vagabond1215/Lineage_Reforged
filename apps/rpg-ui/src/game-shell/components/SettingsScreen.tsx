import { useMemo, useState } from 'react';
import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { AppShell, SidebarNav } from './AppShell.js';
import type { LauncherSectionId } from './MainMenuScreen.js';
import type {
  GameShellNotice,
  SaveSlotSummary
} from '../state.js';
import { LauncherSpriteClock } from './LauncherSpriteClock.js';
import { NoticeBanner } from './NoticeBanner.js';
import { ShellBrandLogo } from './ShellBrandLogo.js';

type ThemePreference = 'system' | 'dark' | 'light';
type HourFormatPreference = '12' | '24';
type AccountActionKind = 'reset' | 'delete';
type TimeZoneDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

type AccountActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

type SettingsScreenProps = {
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onOpenLauncherSection: (section: LauncherSectionId) => void;
  onResetAccount: (options: { accountId: string; password: string }) => Promise<AccountActionResult>;
  onDeleteAccount: (options: { accountId: string; password: string }) => Promise<AccountActionResult>;
  onContinue: () => void;
  onExit: () => void;
  onLogout: () => void;
  themeMode: 'dark' | 'light';
  themePreference: ThemePreference;
  onThemePreferenceChange: (preference: ThemePreference) => void;
  timeZone: string;
  onTimeZoneChange: (timeZone: string) => void;
  hourFormat: HourFormatPreference;
  onHourFormatChange: (format: HourFormatPreference) => void;
  clockLabel: string;
  clockTitle: string;
  clockNow: Date;
};

const THEME_OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];
const HOUR_FORMAT_OPTIONS: HourFormatPreference[] = ['12', '24'];
const FALLBACK_TIME_ZONE_IDS = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Warsaw',
  'Europe/Athens',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Perth',
  'Australia/Sydney',
  'Pacific/Auckland'
] as const;

type IntlWithTimeZoneList = typeof Intl & {
  supportedValuesOf?: (key: 'timeZone') => string[];
};

function formatThemeLabel(theme: ThemePreference): string {
  switch (theme) {
    case 'system':
      return 'System';
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    default:
      return theme;
  }
}

function formatPossessiveName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'the next hero\'s';
  }

  return trimmed.endsWith('s') ? `${trimmed}'` : `${trimmed}'s`;
}

function readTimeZoneParts(timeZone: string, date: Date): TimeZoneDateParts | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date);
    const parsed = Object.fromEntries(
      parts
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, Number(part.value)])
    ) as Partial<TimeZoneDateParts>;
    const { year, month, day, hour, minute, second } = parsed;

    if (
      typeof year !== 'number' ||
      typeof month !== 'number' ||
      typeof day !== 'number' ||
      typeof hour !== 'number' ||
      typeof minute !== 'number' ||
      typeof second !== 'number' ||
      !Number.isFinite(year) ||
      !Number.isFinite(month) ||
      !Number.isFinite(day) ||
      !Number.isFinite(hour) ||
      !Number.isFinite(minute) ||
      !Number.isFinite(second)
    ) {
      return null;
    }

    return {
      year,
      month,
      day,
      hour,
      minute,
      second
    };
  } catch {
    return null;
  }
}

function resolveTimeZoneOffsetMinutes(timeZone: string, date: Date): number | null {
  const parts = readTimeZoneParts(timeZone, date);

  if (!parts) {
    return null;
  }

  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return Math.round((asUtc - date.getTime()) / 60000);
}

function formatGmtOffset(offsetMinutes: number | null): string {
  if (offsetMinutes === null) {
    return 'GMT';
  }

  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (absoluteMinutes % 60).toString().padStart(2, '0');

  return `GMT ${sign}${hours}:${minutes}`;
}

function getSupportedTimeZoneIds(selectedTimeZone: string): string[] {
  const supportedValuesOf = (Intl as IntlWithTimeZoneList).supportedValuesOf;
  const supported =
    typeof supportedValuesOf === 'function' ? supportedValuesOf.call(Intl, 'timeZone') : [];
  const values = supported.length > 0 ? supported : [...FALLBACK_TIME_ZONE_IDS];
  const uniqueValues = new Set<string>(['UTC', ...values]);

  if (selectedTimeZone.trim()) {
    uniqueValues.add(selectedTimeZone.trim());
  }

  return [...uniqueValues];
}

function formatTimeZoneCurrentTime(
  timeZone: string,
  date: Date,
  hourFormat: HourFormatPreference
): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourFormat === '12'
    }).format(date);
  } catch {
    return '--:--';
  }
}

function formatTimeZoneLabel(
  timeZone: string,
  date: Date,
  hourFormat: HourFormatPreference
): string {
  const normalized = timeZone.trim();
  const offset = formatGmtOffset(resolveTimeZoneOffsetMinutes(normalized, date));
  const currentTime = formatTimeZoneCurrentTime(normalized, date, hourFormat);
  return `${offset} : ${currentTime}`;
}

function buildTimeZoneOptions(
  selectedTimeZone: string,
  hourFormat: HourFormatPreference,
  currentDate: Date
): Array<{ id: string; label: string; offsetMinutes: number | null }> {
  const selectedOffset = resolveTimeZoneOffsetMinutes(selectedTimeZone.trim(), currentDate);
  const offsetOptions = new Map<
    number,
    { id: string; label: string; offsetMinutes: number | null }
  >();

  for (const timeZoneId of getSupportedTimeZoneIds(selectedTimeZone)) {
    const offsetMinutes = resolveTimeZoneOffsetMinutes(timeZoneId, currentDate);

    if (offsetMinutes === null || offsetOptions.has(offsetMinutes)) {
      continue;
    }

    offsetOptions.set(offsetMinutes, {
      id: selectedOffset === offsetMinutes ? selectedTimeZone.trim() : timeZoneId,
      label: formatTimeZoneLabel(timeZoneId, currentDate, hourFormat),
      offsetMinutes
    });
  }

  return [...offsetOptions.values()].sort(
    (left, right) =>
      (left.offsetMinutes ?? Number.POSITIVE_INFINITY) -
      (right.offsetMinutes ?? Number.POSITIVE_INFINITY)
  );
}

function getAccountActionCopy(action: AccountActionKind): {
  title: string;
  warning: string;
  confirmLabel: string;
} {
  if (action === 'reset') {
    return {
      title: 'Reset Account',
      warning:
        'Resetting your account will delete all character data, Prestige, and achievements. Data prior to the reset cannot be recovered.',
      confirmLabel: 'Reset Account'
    };
  }

  return {
    title: 'Delete Account',
    warning:
      'Deleting your account will remove its credentials, character data, Prestige, achievements, and all related local account data. Data prior to deletion cannot be recovered.',
    confirmLabel: 'Delete Account'
  };
}

export function SettingsScreen({
  accountProfile,
  slots,
  notice,
  onDismissNotice,
  onOpenLauncherSection,
  onResetAccount,
  onDeleteAccount,
  onContinue,
  onExit,
  onLogout,
  themeMode,
  themePreference,
  onThemePreferenceChange,
  timeZone,
  onTimeZoneChange,
  hourFormat,
  onHourFormatChange,
  clockLabel,
  clockTitle,
  clockNow
}: SettingsScreenProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountAction, setAccountAction] = useState<AccountActionKind | null>(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [accountActionError, setAccountActionError] = useState<string | null>(null);
  const [accountActionPending, setAccountActionPending] = useState(false);
  const savedCharacterCount = slots.filter((slot) => slot.hasSave).length;
  const latestSave = useMemo(
    () =>
      [...slots]
        .filter((slot) => slot.hasSave)
        .sort((left, right) => (right.lastSavedAt ?? '').localeCompare(left.lastSavedAt ?? ''))[0] ??
      null,
    [slots]
  );
  const continueLabel = latestSave?.playerName
    ? `Continue ${formatPossessiveName(latestSave.playerName)} Legacy`
    : 'Start your Legacy';
  const clockMinuteKey = Math.trunc(clockNow.getTime() / 60000);
  const timeZoneOptions = useMemo(
    () => buildTimeZoneOptions(timeZone, hourFormat, clockNow),
    [clockMinuteKey, hourFormat, timeZone]
  );
  const activeOptionClass =
    'launcher-control is-active';
  const inactiveOptionClass =
    'launcher-control text-[color:var(--color-text-secondary)]';
  const neutralButtonClass =
    'launcher-control px-3 py-2 text-sm font-semibold';
  const topButtonClass =
    'launcher-control inline-flex h-10 items-center justify-center';
  const accountMenuButtonClass =
    'w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-selected)]';
  const cautionButtonClass =
    themeMode === 'dark'
      ? 'launcher-control forged-tone-warning px-3 py-2 text-sm font-semibold'
      : 'rounded-md border border-amber-500/45 bg-amber-100/90 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-200/95';
  const dangerButtonClass =
    themeMode === 'dark'
      ? 'launcher-control forged-tone-danger px-3 py-2 text-sm font-semibold'
      : 'rounded-md border border-rose-500/45 bg-rose-100/90 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200/95';
  const selectColorStyle = {
    colorScheme: themeMode,
    backgroundColor: 'var(--color-surface-soft)',
    color: 'var(--color-text-strong)'
  };
  const optionColorStyle = {
    backgroundColor: 'var(--color-panel)',
    color: 'var(--color-text-strong)'
  };
  const activeActionCopy = accountAction ? getAccountActionCopy(accountAction) : null;

  const beginAccountAction = (action: AccountActionKind) => {
    setAccountAction(action);
    setAccountPassword('');
    setAccountActionError(null);
  };

  const submitAccountAction = async () => {
    if (!accountAction || accountActionPending) {
      return;
    }

    if (!accountPassword.trim()) {
      setAccountActionError('Enter your account password to continue.');
      return;
    }

    setAccountActionPending(true);
    setAccountActionError(null);

    const result =
      accountAction === 'reset'
        ? await onResetAccount({
            accountId: accountProfile.accountId,
            password: accountPassword
          })
        : await onDeleteAccount({
            accountId: accountProfile.accountId,
            password: accountPassword
          });

    setAccountActionPending(false);

    if (!result.ok) {
      setAccountActionError(result.message);
      return;
    }

    setAccountAction(null);
    setAccountPassword('');
  };

  return (
    <AppShell
      brand={
        <ShellBrandLogo />
      }
      centerActions={
        <button
          type="button"
          onClick={onContinue}
          className={`${topButtonClass} max-w-[22rem] px-4 text-sm font-semibold`}
          title={continueLabel}
        >
          <span className="truncate">{continueLabel}</span>
        </button>
      }
      accountControls={
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAccountMenuOpen((open) => !open)}
            className="launcher-control launcher-metal-control launcher-account-control inline-flex h-10 max-w-[14rem] items-center justify-center truncate px-3 text-sm font-medium"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            title={accountProfile.displayName}
          >
            <span className="truncate">{accountProfile.displayName}</span>
          </button>
          <LauncherSpriteClock clockLabel={clockLabel} clockTitle={clockTitle} />
          {accountMenuOpen && (
            <div
              className="launcher-menu absolute right-0 top-12 z-50 w-48 p-2"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setAccountMenuOpen(false)}
                className={accountMenuButtonClass}
              >
                Settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onExit();
                }}
                className={accountMenuButtonClass}
              >
                Exit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onLogout();
                }}
                className={`${accountMenuButtonClass} text-rose-600 dark:text-rose-100`}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      }
      sidebar={
        <SidebarNav
          label="Launcher sections"
          items={[
            {
              id: 'characters',
              label: 'Characters',
              onSelect: () => onOpenLauncherSection('characters')
            },
            {
              id: 'legacy',
              label: 'Legacy',
              onSelect: () => onOpenLauncherSection('legacy')
            },
            {
              id: 'chronicles',
              label: 'Chronicles',
              onSelect: () => onOpenLauncherSection('chronicles')
            },
            {
              id: 'settings',
              label: 'Settings',
              active: true
            }
          ]}
        />
      }
      subBar={<div className="h-9" aria-hidden="true" />}
      notice={notice ? <NoticeBanner notice={notice} onDismiss={onDismissNotice} /> : null}
    >
      <div className="forged-card">
        <div className="flex flex-col gap-3 border-b border-[color:var(--color-border-soft)] px-4 py-4 lg:flex-row lg:items-center">
          <div className="w-32 shrink-0 text-sm font-semibold text-[color:var(--color-text-strong)]">
            Timezone:
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <select
                value={timeZone}
                onChange={(event) => onTimeZoneChange(event.target.value)}
                className="creator-forged-input w-full px-3 py-2 text-sm text-[color:var(--color-text-strong)] outline-none transition"
                style={selectColorStyle}
              >
                {timeZoneOptions.map((option) => (
                  <option key={option.id} value={option.id} style={optionColorStyle}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex shrink-0 gap-2">
              {HOUR_FORMAT_OPTIONS.map((option) => {
                const active = hourFormat === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onHourFormatChange(option)}
                    aria-pressed={active}
                    className={`px-3 py-2 text-sm font-semibold ${
                      active ? activeOptionClass : inactiveOptionClass
                    }`}
                  >
                    {option} hr
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-[color:var(--color-border-soft)] px-4 py-4 sm:flex-row sm:items-center">
          <div className="w-32 shrink-0 text-sm font-semibold text-[color:var(--color-text-strong)]">
            Appearance:
          </div>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map((option) => {
              const active = themePreference === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onThemePreferenceChange(option)}
                  aria-pressed={active}
                  className={`px-3 py-2 text-sm font-semibold ${
                    active ? activeOptionClass : inactiveOptionClass
                  }`}
                >
                  {formatThemeLabel(option)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-32 shrink-0 text-sm font-semibold text-[color:var(--color-text-strong)]">
              Account:
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[color:var(--color-text-strong)]">
                {accountProfile.displayName}
              </div>
              <div className="text-xs text-[color:var(--color-muted-strong)]">
                {savedCharacterCount} saved {savedCharacterCount === 1 ? 'character' : 'characters'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onLogout} className={neutralButtonClass}>
                Log Out
              </button>
              <button
                type="button"
                onClick={() => beginAccountAction('reset')}
                className={cautionButtonClass}
              >
                Reset Account
              </button>
              <button
                type="button"
                onClick={() => beginAccountAction('delete')}
                className={dangerButtonClass}
              >
                Delete Account
              </button>
            </div>
          </div>

          {activeActionCopy && (
            <div className="forged-subpanel border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] p-4">
              <div className="text-sm font-semibold text-rose-700 dark:text-rose-100">
                {activeActionCopy.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-rose-700/90 dark:text-rose-100/85">
                {activeActionCopy.warning}
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  type="password"
                  value={accountPassword}
                  onChange={(event) => setAccountPassword(event.target.value)}
                  className="creator-forged-input min-w-0 flex-1 px-3 py-2 text-sm text-[color:var(--color-text-strong)] outline-none transition"
                  placeholder="Account password"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAccountAction(null);
                    setAccountPassword('');
                    setAccountActionError(null);
                  }}
                  className={neutralButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void submitAccountAction();
                  }}
                  disabled={accountActionPending}
                  className={accountAction === 'reset' ? cautionButtonClass : dangerButtonClass}
                >
                  {accountActionPending ? 'Confirming...' : activeActionCopy.confirmLabel}
                </button>
              </div>
              {accountActionError && (
                <div className="mt-3 text-sm text-rose-700 dark:text-rose-100">
                  {accountActionError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
