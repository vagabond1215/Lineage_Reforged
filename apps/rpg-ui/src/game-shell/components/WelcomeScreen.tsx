import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { ShellBrandLogo } from './ShellBrandLogo.js';

// L1 visual preview only. World mode and Hardcore belong to the future World owner,
// not to local UI state, session hints, campaign Saves, or account preferences.
export function WelcomeScreen({ profile, worlds, busy, onContinue, onBack, onLogout }: {
  profile: AccountProfileState;
  worlds: boolean;
  busy: boolean;
  onContinue: () => void;
  onBack: () => void;
  onLogout: () => void;
}) {
  return <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#34463c55,transparent_65%)] p-4 text-[color:var(--color-text-strong)]">
    <section className={`w-full rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-center shadow-panel sm:p-10 ${worlds ? 'max-w-2xl' : 'max-w-5xl'}`}>
      <ShellBrandLogo className="mx-auto mb-8 max-h-36 justify-center" />
      {worlds ? <>
        <p className="text-sm uppercase tracking-[0.25em]">WORLDS / THE ATLAS</p>
        <h1 className="mt-4 text-3xl font-semibold">World Library not ready</h1>
        <p className="mt-4 text-[color:var(--color-text-soft)]">This development path is awaiting a world registry.</p>
        <button className="launcher-control mt-8 px-6 py-3" type="button" disabled={busy} onClick={onBack}>Back to Welcome</button>
      </> : <>
        <h1 className="break-words text-3xl font-semibold">Welcome back, {profile.displayName}</h1>
        <p className="mt-3 text-base text-[color:var(--color-text-soft)]">Choose your journey</p>
        <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
          <button
            type="button"
            disabled={busy}
            onClick={onContinue}
            className="group flex min-h-[15rem] w-full flex-col items-start rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6 text-left transition-colors hover:border-[color:var(--color-text-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-soft)]">Repeat-run adventure</span>
            <span className="mt-3 text-3xl font-semibold">Chronicle</span>
            <span className="mt-3 flex-1 text-sm leading-6 text-[color:var(--color-text-soft)]">
              Live many lives, build a legacy, and earn rewards that shape future journeys.
            </span>
            <span className="mt-6 text-sm font-semibold">Explore Chronicle Worlds (preview)</span>
          </button>
          <button
            type="button"
            disabled
            className="flex min-h-[15rem] w-full cursor-not-allowed flex-col items-start rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6 text-left opacity-60"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-soft)]">Long-term progression</span>
            <span className="mt-3 text-3xl font-semibold">Persistent</span>
            <span className="mt-3 flex-1 text-sm leading-6 text-[color:var(--color-text-soft)]">
              Build one enduring life through skills, work, relationships, and lasting achievements.
            </span>
            <span className="mt-6 text-sm font-semibold">Coming Soon</span>
          </button>
        </div>
        <div className="mt-8">
          <button className="launcher-control px-8 py-3" type="button" disabled={busy} onClick={onLogout}>Logout</button>
        </div>
      </>}
    </section>
  </main>;
}
