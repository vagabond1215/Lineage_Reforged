import { useEffect, useReducer, useRef, useState } from 'react';
import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { createWorldReviewState, worldReviewReducer, type WorldCreationIntent, type WorldCreationResult,
  type WorldLibraryState } from '../worldPresentationState.js';
import { AppShell } from './AppShell.js';
import { WorldCreator } from './WorldCreator.js';
import { WorldLibrary } from './WorldLibrary.js';

type Props = {
  profile: AccountProfileState;
  worlds: boolean;
  busy: boolean;
  clockLabel: string;
  clockTitle: string;
  themeMode: 'dark' | 'light';
  onToggleThemeMode: () => void;
  onContinue: () => void;
  onOpenExistingLauncher: () => void;
  onBack: () => void;
  onLogout: () => void;
  inventory?: WorldLibraryState;
  onCreateWorld?: (intent: WorldCreationIntent) => Promise<WorldCreationResult>;
  pendingIntent?: WorldCreationIntent;
  onSignInAgain?: () => void;
  onReopenLibrary?: () => void;
};

const control = 'launcher-control min-h-11 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60';

/** Presentation only, mounted after the existing authenticated Welcome/gate owner. */
export function WelcomeWorldPresentation({ profile, worlds, busy, clockLabel, clockTitle,
  themeMode, onToggleThemeMode, onContinue, onOpenExistingLauncher, onBack, onLogout,
  inventory = { status: 'preview' }, onCreateWorld, pendingIntent, onSignInAgain, onReopenLibrary }: Props) {
  const [review, dispatch] = useReducer(worldReviewReducer, undefined, createWorldReviewState);
  const [creating, setCreating] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = busy || creating;
  const configuring = worlds && review.view === 'configuration';
  const canOpenCreator = inventory.status === 'preview' || (inventory.status === 'empty' && !!onCreateWorld);
  const inventoryFailed = inventory.status === 'blocked' || inventory.status === 'readback-failed';
  useEffect(() => { if (worlds) heading.current?.focus(); }, [worlds, configuring]);
  const back = () => {
    if (configuring) {
      dispatch({ type: 'BACK' });
      if (pendingIntent) onReopenLibrary?.();
    } else onBack();
  };

  return <AppShell
    brand={<img src="/branding/lineage-reforged-logo-dark-no-icon-framed.png"
      alt="Lineage: Reforged" className="h-12 w-auto max-w-[12rem] object-contain" />}
    accountControls={<>
      <time title={clockTitle} className="text-sm">Local time {clockLabel}</time>
      <details className="relative min-w-0 max-w-full text-sm">
        <summary className="max-w-[14rem] cursor-pointer break-words px-3 py-2">{profile.displayName}</summary>
        <div className="absolute right-0 z-40 w-48 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2">
          <button type="button" disabled={pending} onClick={onToggleThemeMode} className="w-full px-3 py-2 text-left">
            {themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
          <button type="button" disabled={pending} onClick={onLogout} className="w-full px-3 py-2 text-left">Logout</button>
        </div>
      </details>
    </>}
    subBar={<nav aria-label={worlds ? 'World navigation' : 'Welcome navigation'}
      className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
      <div>{worlds
        ? <button type="button" disabled={pending} onClick={back} className={control}
            aria-label={configuring ? 'Back to World Library' : 'Back to Welcome'} title="Back">Back</button>
        : <button type="button" disabled={busy} onClick={onLogout} className={control}
            title="Sign out and return to account access">Sign Out</button>}</div>
      {worlds ? <button type="button" disabled={pending} onClick={onBack} className={control}>Home</button> : <span />}
      {worlds
        ? (!configuring && <button type="button" disabled={pending || !canOpenCreator}
            aria-describedby="world-pilot-capacity" className={`${control} justify-self-end`}
            onClick={() => dispatch({ type: 'OPEN_CONFIGURATION' })}>Create New World</button>)
        : <button type="button" onClick={onOpenExistingLauncher} disabled={busy}
            className={`${control} justify-self-end whitespace-nowrap`}>Open existing launcher</button>}
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
            <span>{onReopenLibrary ? 'Explore Worlds' : 'Explore Worlds (presentation review)'}</span>
          </button>
          <button type="button" disabled className={`${control} flex min-h-56 flex-col items-start gap-4 p-6 text-left`}>
            <span className="text-2xl font-semibold">Persistent</span><span>Coming Soon</span>
          </button>
        </div>
      </> : <>
        <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold">
          {configuring ? 'World Creator' : 'Your Worlds'}
        </h1>
        <p id="world-pilot-capacity" className="text-sm">
          {inventory.status === 'ready' ? 'Pilot capacity reached. Each account can create one World.' :
            'Pilot capacity is one World per account.'}
        </p>
        {configuring && !inventoryFailed
          ? <WorldCreator busy={pending} onBusyChange={setCreating}
              onCreate={inventory.status === 'empty' ? onCreateWorld : undefined}
              pendingIntent={pendingIntent}
              onVerified={worldInstanceId => dispatch({ type: 'VERIFIED', worldInstanceId })} />
          : <WorldLibrary inventory={inventory} highlightedWorldId={review.highlightedWorldId} />}
        {!configuring && inventory.status === 'empty' && onSignInAgain && <button type="button"
          className={control} disabled={pending} onClick={onSignInAgain}>Sign in again to create a World</button>}
      </>}
    </div>
  </AppShell>;
}
