import { useReducer } from 'react';
import calendar from '../../../../../packages/content/base/world/calendar.json';
import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { createWorldReviewState, worldReviewReducer } from '../worldPresentationState.js';
import { AppShell } from './AppShell.js';
import { Card } from '../../components/ui/Card.js';

type Props = {
  profile: AccountProfileState;
  worlds: boolean;
  busy: boolean;
  clockLabel: string;
  clockTitle: string;
  themeMode: 'dark' | 'light';
  onToggleThemeMode: () => void;
  onContinue: () => void;
  onBack: () => void;
  onLogout: () => void;
};

const control = 'launcher-control min-h-11 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60';
const selectClass = 'w-full min-w-0 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-3 py-3';

/** Presentation only, mounted after the existing authenticated Welcome/gate owner. */
export function WelcomeWorldPresentation({ profile, worlds, busy, clockLabel, clockTitle,
  themeMode, onToggleThemeMode, onContinue, onBack, onLogout }: Props) {
  const [review, dispatch] = useReducer(worldReviewReducer, undefined, createWorldReviewState);
  const configuring = worlds && review.view === 'configuration';
  const back = () => {
    if (!worlds) { onLogout(); return; }
    if (configuring) dispatch({ type: 'BACK' });
    else onBack();
  };

  return <AppShell
    brand={<img src="/branding/lineage-reforged-logo-dark-no-icon-framed.png"
      alt="Lineage: Reforged" className="h-12 w-auto max-w-[12rem] object-contain" />}
    accountControls={<>
      <time title={clockTitle} className="text-sm">Local time {clockLabel}</time>
      <details className="relative min-w-0 max-w-full text-sm">
        <summary className="max-w-[14rem] cursor-pointer break-words px-3 py-2">{profile.displayName}</summary>
        <div className="absolute right-0 z-40 w-48 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2">
          <button type="button" disabled={busy} onClick={onToggleThemeMode} className="w-full px-3 py-2 text-left">
            {themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
          <button type="button" disabled={busy} onClick={onLogout} className="w-full px-3 py-2 text-left">Logout</button>
        </div>
      </details>
    </>}
    subBar={<nav aria-label="World review navigation" className="grid min-h-11 grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div><button type="button" disabled={busy} onClick={back} className={control}
        aria-label={!worlds ? 'Back to account access (sign out)' : configuring ? 'Back to World Library' : 'Back to Welcome'}
        title={!worlds ? 'Sign out and return to account access' : 'Back'}>Back</button></div>
      {worlds && !configuring
        ? <button type="button" disabled={busy} className={control}
            onClick={() => dispatch({ type: 'OPEN_CONFIGURATION' })}>Create World</button>
        : <span />}
      <span />
    </nav>}
  >
    <div data-world-presentation={worlds ? review.view : 'welcome'} className="mx-auto w-full max-w-4xl space-y-5">
      {!worlds ? <>
        <h1 className="break-words text-center text-3xl font-semibold">Welcome back, {profile.displayName}</h1>
        <p className="text-center">Choose your journey</p>
        <div className="grid gap-4 md:grid-cols-2">
          <button type="button" onClick={onContinue} disabled={busy}
            className={`${control} flex min-h-56 flex-col items-start gap-4 p-6 text-left focus-visible:outline focus-visible:outline-2`}>
            <span className="text-2xl font-semibold">Chronicle</span>
            <span>Live many lives, build a legacy, and shape future journeys.</span>
            <span>Explore Worlds (presentation review)</span>
          </button>
          <button type="button" disabled className={`${control} flex min-h-56 flex-col items-start gap-4 p-6 text-left`}>
            <span className="text-2xl font-semibold">Persistent</span><span>Coming Soon</span>
          </button>
        </div>
      </> : <>
        <h1 className="text-3xl font-semibold">{configuring ? 'World configuration review' : 'World Library'}</h1>
        <p id="world-review-boundary" className="rounded-lg border border-[color:var(--color-border)] p-4 text-sm">
          World registry unavailable. Presentation review only. No World is created,
          selected or saved; configuration values are illustrative and are not applied.
        </p>
        {!configuring ? <Card title="No Worlds available">
          <p>The authenticated World registry and economy initialization are awaiting acceptance.</p>
          <p className="mt-3 text-sm">Create World opens a configuration review, not a creation request.</p>
        </Card> : <Card>
          <form aria-describedby="world-review-boundary" onSubmit={event => event.preventDefault()} className="space-y-5">
            <label className="block space-y-2">
              <span>World name (review only)</span>
              <input value={review.draft.name} maxLength={80} className={selectClass}
                onChange={event => dispatch({ type: 'EDIT', field: 'name', value: event.target.value })} />
            </label>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div><dt className="text-sm">Authored geography</dt><dd>First World</dd></div>
              <div><dt className="text-sm">Progression</dt><dd>Chronicle</dd></div>
            </dl>
            <fieldset className="space-y-2">
              <legend>Gameplay Mode</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="rounded-lg border border-[color:var(--color-border-strong)] p-4">
                  <input type="radio" name="review-mode" checked readOnly className="mr-2" />Individual
                </label>
                <label className="rounded-lg border border-[color:var(--color-border)] p-4 opacity-60">
                  <input type="radio" name="review-mode" disabled className="mr-2" />Living — Coming Soon
                </label>
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2"><span>Difficulty</span>
                <select value="Mortal" disabled className={selectClass}>
                  <option>Mortal</option><option disabled>Favored — Coming Soon</option><option disabled>Forsaken — Coming Soon</option>
                </select>
              </label>
              {(['temperature', 'rainfall', 'season'] as const).map(field => <label key={field} className="block space-y-2">
                <span>{field === 'season' ? 'Starting season' : field === 'temperature' ? 'Temperature' : 'Rainfall'} (review only)</span>
                <select className={selectClass} value={review.draft[field]}
                  onChange={event => dispatch({ type: 'EDIT', field, value: event.target.value })}>
                  {(field === 'temperature' ? ['Cold', 'Normal', 'Hot'] : field === 'rainfall'
                    ? ['Dry', 'Normal', 'Wet'] : ['Scenario Default', ...calendar.seasons])
                    .map(value => <option key={value}>{value}</option>)}
                </select>
              </label>)}
            </div>
            <fieldset disabled className="space-y-2 text-sm">
              <legend>Further adjustments — Coming Soon</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {['Hardcore', 'Climate variability', 'Disasters', 'Extreme weather'].map(label =>
                  <label key={label}><input type="checkbox" disabled className="mr-2" />{label}</label>)}
              </div>
            </fieldset>
            <p id="world-create-held" className="text-sm">Creation is held: the World registry and economy initialization are not accepted.</p>
            <button type="submit" disabled aria-describedby="world-create-held" className={control}>Create World (unavailable)</button>
          </form>
        </Card>}
      </>}
    </div>
  </AppShell>;
}
