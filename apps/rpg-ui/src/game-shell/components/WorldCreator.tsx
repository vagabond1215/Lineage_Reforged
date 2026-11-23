import { useRef, useState, type FormEvent } from 'react';
import calendar from '../../../../../packages/content/base/world/calendar.json';
import { Card } from '../../components/ui/Card.js';
import {
  WORLD_NAME_LIMIT, createWorldIntent, validatedWorldName,
  type WorldCreationIntent, type WorldCreationResult,
} from '../worldPresentationState.js';

const inputClass = 'w-full min-w-0 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-3 py-3';
const environment = [
  { label: 'Temperature', defaultValue: 'Normal', options: ['Cold', 'Normal', 'Hot'] },
  { label: 'Rainfall', defaultValue: 'Normal', options: ['Dry', 'Normal', 'Wet'] },
  { label: 'Starting season', defaultValue: 'Scenario Default', options: ['Scenario Default', ...calendar.seasons] },
];

export function WorldCreator({ busy, onCreate, pendingIntent, onBusyChange, onVerified }: {
  busy: boolean;
  onCreate: ((intent: WorldCreationIntent) => Promise<WorldCreationResult>) | undefined;
  pendingIntent?: WorldCreationIntent | undefined;
  onBusyChange: (busy: boolean) => void;
  onVerified: (worldInstanceId: string) => void;
}) {
  const [rawName, setRawName] = useState(pendingIntent?.displayName ?? '');
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<Exclude<WorldCreationResult, { status: 'verified' }> | null>(null);
  const intent = useRef<WorldCreationIntent | null>(pendingIntent ?? null);
  const pending = useRef(false);
  const name = validatedWorldName(rawName);
  const invalid = touched && name === null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!onCreate || !name || !confirmed || busy || pending.current) return;
    intent.current ??= createWorldIntent(name);
    pending.current = true;
    onBusyChange(true);
    setError(null);
    try {
      const result = await onCreate(intent.current);
      if (result.status === 'verified' && result.worldInstanceId === intent.current.proposedWorldInstanceId) {
        onVerified(result.worldInstanceId);
      } else {
        setError(result.status === 'verified' ? {
          status: 'readback-failed', message: 'The verified World differs from this request. Retry this request or reopen the library.',
        } : result);
      }
    } catch {
      setError({ status: 'readback-failed', message: 'Creation could not be verified. Retry this request or reopen the library.' });
    } finally {
      pending.current = false;
      onBusyChange(false);
    }
  }

  return <Card>
    <form aria-label="Create World" onSubmit={event => void submit(event)} aria-busy={busy} className="space-y-5">
      <label className="block space-y-2">
        <span>World name</span>
        <input className={inputClass} value={rawName} readOnly={busy || intent.current !== null}
          aria-required="true" aria-invalid={invalid} aria-describedby="world-name-help"
          onBlur={() => setTouched(true)} onChange={event => { setRawName(event.target.value); setConfirmed(false); }} />
      </label>
      <p id="world-name-help" className="text-sm" role={invalid ? 'alert' : undefined}>
        {invalid ? 'Enter a World name with 1–80 characters and no control characters.' :
          `Use 1–${WORLD_NAME_LIMIT} characters. Leading and trailing spaces are removed.`}
      </p>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div><dt>Authored geography</dt><dd>First World</dd></div>
        <div><dt>Scenario</dt><dd>First World Chronicle Default v1</dd></div>
        <div><dt>Progression</dt><dd>Chronicle</dd></div>
        <div><dt>Gameplay mode</dt><dd>Individual</dd></div>
        <div><dt>Stakes</dt><dd>Normal</dd></div>
        <div><dt>Hardcore</dt><dd>Off</dd></div>
      </dl>
      <p className="text-sm">Persistent, Living and Hardcore are Coming Soon.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2"><span>Difficulty</span>
          <select defaultValue="Mortal" disabled className={inputClass}>
            <option>Mortal</option><option disabled>Favored — Coming Soon</option><option disabled>Forsaken — Coming Soon</option>
          </select>
        </label>
        {environment.map(({ label, defaultValue, options }) => <label key={label} className="block space-y-2">
          <span>{label}</span>
          <select defaultValue={defaultValue} disabled aria-describedby="world-environment-help" className={inputClass}>
            {options.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>)}
      </div>
      <p id="world-environment-help" className="text-sm">Environment adjustments are Coming Soon. The scenario defaults will apply.</p>
      <fieldset disabled={busy} className="space-y-2 border-t border-[color:var(--color-border)] pt-4">
        <legend className="px-1 font-semibold">Confirm World settings</legend>
        <p className="break-words text-sm">{name ?? 'World name required'} · Chronicle · Individual · Mortal · Normal stakes · Scenario defaults</p>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={confirmed} disabled={!name} className="mt-1"
            onChange={event => setConfirmed(event.target.checked)} />
          <span>Confirm these settings for the one-World pilot.</span>
        </label>
      </fieldset>
      {error && <p role="alert">
        <strong>{error.status === 'readback-failed' ? 'World verification failed.' : 'Creation blocked.'}</strong> {error.message}
      </p>}
      {busy && <p role="status">Verifying World creation…</p>}
      {!onCreate && <p id="world-create-held" className="text-sm">World creation is unavailable in this preview.</p>}
      <button type="submit" disabled={!onCreate || !name || !confirmed || busy}
        aria-describedby={!onCreate ? 'world-create-held' : undefined}
        className="launcher-control min-h-11 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60">
        {error ? 'Retry Create World' : 'Create World'}
      </button>
    </form>
  </Card>;
}
