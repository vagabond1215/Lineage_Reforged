import { useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card.js';
import type { SelectedWorld } from '../worldPresentationState.js';
import { AppShell } from './AppShell.js';

type Props = {
  world: SelectedWorld;
  busy: boolean;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onBack: () => void;
  onSignOut: () => void;
  onCreateCharacter: () => void;
};

const buttonClass = 'launcher-control min-h-11 px-3 py-2 text-sm disabled:opacity-60';

export function WorldCharactersScreen({ world, busy, themeMode, onToggleTheme, onBack, onSignOut,
  onCreateCharacter }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <AppShell brand={<img src="/branding/lineage-reforged-logo-dark-no-icon-framed.png"
    alt="Lineage: Reforged" className="h-12 w-auto max-w-[12rem] object-contain" />}
    subBar={<nav aria-label="Selected World navigation" className="flex flex-wrap gap-2">
      <button type="button" className={buttonClass} disabled={busy} onClick={onBack}>Back to World Library</button>
      <button type="button" className={buttonClass} disabled={busy} onClick={onSignOut}>Sign Out</button>
      <button type="button" className={buttonClass} onClick={onToggleTheme}>
        {themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      </button>
    </nav>}>
    <div className="mx-auto w-full max-w-4xl space-y-4" aria-busy={busy}>
      <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold">World Characters</h1>
      <section aria-label="Selected World">
        <h2 className="break-words text-xl font-semibold">{world.displayName}</h2>
        <p className="break-all text-sm">{world.worldInstanceId}</p>
      </section>
      <Card title="No characters in this World">
        <button type="button" className={buttonClass} disabled={busy} onClick={onCreateCharacter}>Create Character</button>
      </Card>
    </div>
  </AppShell>;
}
