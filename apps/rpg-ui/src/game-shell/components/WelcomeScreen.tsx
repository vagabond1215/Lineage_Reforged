import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { ShellBrandLogo } from './ShellBrandLogo.js';

export function WelcomeScreen({ profile, worlds, busy, onContinue, onBack, onLogout }: {
  profile: AccountProfileState;
  worlds: boolean;
  busy: boolean;
  onContinue: () => void;
  onBack: () => void;
  onLogout: () => void;
}) {
  return <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#34463c55,transparent_65%)] p-4 text-[color:var(--color-text-strong)]">
    <section className="w-full max-w-2xl rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-center shadow-panel sm:p-10">
      <ShellBrandLogo className="mx-auto mb-8 max-h-36 justify-center" />
      {worlds ? <>
        <p className="text-sm uppercase tracking-[0.25em]">WORLDS / THE ATLAS</p>
        <h1 className="mt-4 text-3xl font-semibold">World Library not ready</h1>
        <p className="mt-4 text-[color:var(--color-text-soft)]">This development path is awaiting a world registry.</p>
        <button className="launcher-control mt-8 px-6 py-3" type="button" disabled={busy} onClick={onBack}>Back to Welcome</button>
      </> : <>
        <h1 className="break-words text-3xl font-semibold">Welcome back, {profile.displayName}</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="launcher-control px-8 py-3" type="button" disabled={busy} onClick={onContinue}>Continue</button>
          <button className="launcher-control px-8 py-3" type="button" disabled={busy} onClick={onLogout}>Logout</button>
        </div>
      </>}
    </section>
  </main>;
}
