import type { SaveSnapshot } from '../../../../../packages/shared/types/src/index.js';
import type { CampaignSessionControl } from '../../../../../packages/engines/game-engine/src/campaign-session.js';
import { inspectSpawnEligibility } from '../../../../../packages/engines/world-engine/src/spawn/index.js';

type DevConsoleProps = {
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
};

const sectionClass = 'rounded-md border border-[color:var(--color-border-soft)] px-3 py-2';
const summaryClass = 'cursor-pointer font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)]';

export function DevConsole({ snapshot, control }: DevConsoleProps) {
  const inspection = inspectSpawnEligibility(snapshot.worldState, snapshot.clock.tick, 0);
  const clock = snapshot.clock;
  return (
    <div className="space-y-2 text-sm text-[color:var(--color-text-primary)]">
      <p className="text-xs text-[color:var(--color-text-secondary)]">Developer inspection · current campaign · read-only until a command owner and QA isolation are available</p>
      <details className={sectionClass}>
        <summary className={summaryClass}>Items</summary>
        <p className="mt-2 text-[color:var(--color-text-secondary)]">Item grants unavailable: the native gear instance owner is not connected to live inventory and Save yet. No item was granted.</p>
      </details>
      <details className={sectionClass}>
        <summary className={summaryClass}>Time &amp; Calendar</summary>
        <p className="mt-2">Year {clock.year} · {clock.season} · month {clock.month} · day {clock.day} · watch {clock.subday} · tick {clock.tick}</p>
        <p className="mt-1 text-[color:var(--color-text-secondary)]">Advance 1 watch, N watches and N days are pending a campaign-authoritative idle-time command. Activity and rest actions have different effects; this console will not change the clock alone.</p>
      </details>
      <details className={sectionClass}>
        <summary className={summaryClass}>Weather &amp; Climate</summary>
        <p className="mt-2">Season: {clock.season}. Runtime regional weather: unavailable.</p>
        <p className="mt-1 text-[color:var(--color-text-secondary)]">Scenario overrides are pending a typed regional weather owner. No weather effect is active from this console.</p>
      </details>
      <details className={sectionClass}>
        <summary className={summaryClass}>Spawns &amp; Encounters</summary>
        <p className="mt-2 text-[color:var(--color-text-secondary)]">Read-only deterministic inspection at tick {clock.tick}, seed 0. Time of day, season and weather filters are not implemented.</p>
        <p className="mt-1">{inspection.contextError ?? `Region ${inspection.context?.regionId}; habitat ${inspection.context?.habitatTags.join(', ') || 'none'}; hazard ${inspection.context?.hazardPressure}`}</p>
        <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto" aria-label="Spawn profile eligibility">
          {inspection.profiles.map((profile) => (
            <li key={profile.id}>
              {profile.id}: {profile.passed
                ? `profile conditions pass; spawn rate roll ${profile.spawnRollPassed ? 'passes' : 'misses'}`
                : `blocked by ${profile.failures.join(', ')}`}
            </li>
          ))}
        </ul>
        <p className="mt-2">Selected candidates: {inspection.candidates.length === 0 ? 'none at this tick and seed' : inspection.candidates.map((candidate) => candidate.encounterTemplateId).join(', ')}</p>
      </details>
      <details className={sectionClass}>
        <summary className={summaryClass}>Diagnostics</summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt>Snapshot</dt><dd className="break-all">{snapshot.snapshotVersion}</dd>
          <dt>Session revision</dt><dd>{control.sessionRevision}</dd>
          <dt>Captured tick</dt><dd>{snapshot.capturedAtTick}</dd>
          <dt>Echo</dt><dd>{snapshot.playerState.progression.echo.echoAdjusted.toFixed(3)}</dd>
          <dt>Origin baseline</dt><dd>{snapshot.playerState.progression.originBaseline ? 'recorded' : 'unavailable for this campaign'}</dd>
        </dl>
      </details>
    </div>
  );
}
