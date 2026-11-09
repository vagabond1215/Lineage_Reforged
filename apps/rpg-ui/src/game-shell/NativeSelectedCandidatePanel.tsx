import { listLegalPlayerCombatCommands } from '../../../../packages/engines/game-engine/src/combat/index.js';
import { resolveNearbyExplorationPlan } from '../../../../packages/engines/game-engine/src/player-nearby-exploration.js';
import { resolvePlayerQuestAcceptancePlan } from '../../../../packages/engines/game-engine/src/player-quest-acceptance.js';
import { getCurrentPlayerTravelLocationId, getPlayerPassengerTravelDestinationFacts,
  resolvePlayerTravelPlan } from '../../../../packages/engines/game-engine/src/player-travel-rules.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { NativeFreshCampaignSnapshot } from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { resolveNativeSoundingsTurnIn } from '../../../../packages/engines/game-engine/src/native-soundings-turn-in.js';

export type NativeCandidateAction =
  | { kind: 'quest'; id: string }
  | { kind: 'travel'; id: string }
  | { kind: 'survey' }
  | { kind: 'turn_in' }
  | { kind: 'explore' }
  | { kind: 'admit' }
  | { kind: 'combat'; actionType: string; targetId: string | null };

const buttonClass = 'rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-50';

/** Local candidate controls. Every mutation is delegated to the established native selected host. */
export function NativeSelectedCandidatePanel({ snapshot, mode, onAction, hasUnpublishedState }: {
  snapshot: NativeFreshCampaignSnapshot;
  mode: 'world' | 'quests' | 'activity';
  onAction: (action: NativeCandidateAction) => void;
  hasUnpublishedState: boolean;
}) {
  const source = snapshot as unknown as SaveSnapshot;
  if (mode === 'quests') {
    const quests = snapshot.sessionState.questJournal;
    return <section className="space-y-3 p-3" aria-label="Quests">
      <h2 className="text-lg font-semibold">Quests</h2>
      {quests.length === 0 && <p>No quests are recorded.</p>}
      {quests.map(quest => {
        const plan = quest.category === 'contracts'
          ? resolvePlayerQuestAcceptancePlan(source, quest.id) : null;
        return <article key={quest.id} className="rounded border border-[color:var(--color-border-soft)] p-2">
          <h3 className="font-semibold">{quest.title}</h3>
          <p>{quest.summary}</p>
          <p className="text-xs">{quest.category} · {quest.statusLabel}</p>
          {plan?.accepted && <button className={buttonClass} type="button"
            onClick={() => onAction({ kind: 'quest', id: quest.id })}>Accept quest</button>}
        </article>;
      })}
      {snapshot.playerState.activeQuestIds.includes('quest.ashen_reef_survey') &&
        (snapshot.nativeSurvey?.results.length ?? 0) < 4 &&
        <button className={buttonClass} type="button"
          disabled={hasUnpublishedState || getCurrentPlayerTravelLocationId(source) !== 'location.ashen_reef'}
          title={hasUnpublishedState ? 'Save the current campaign stage first.' :
            getCurrentPlayerTravelLocationId(source) !== 'location.ashen_reef' ? 'Travel to Ashen Reef first.' : undefined}
          onClick={() => onAction({ kind: 'survey' })}>
          Advance Ashen Reef survey shift
        </button>}
      {snapshot.nativeSurvey?.results.length === 4 && !snapshot.nativeSoundingsTurnIn &&
        <button className={buttonClass} type="button"
          disabled={hasUnpublishedState || !resolveNativeSoundingsTurnIn(snapshot).accepted}
          title={hasUnpublishedState ? 'Save the current campaign stage first.' :
            resolveNativeSoundingsTurnIn(snapshot).reason}
          onClick={() => onAction({ kind: 'turn_in' })}>
          Submit Soundings — 5 gold
        </button>}
    </section>;
  }
  if (mode === 'world') {
    const currentLocationId = getCurrentPlayerTravelLocationId(source);
    const passenger = getPlayerPassengerTravelDestinationFacts(source);
    const knownDestinations = snapshot.sessionState.knownLocations.filter(location =>
      location.known && location.id !== currentLocationId);
    const destinations = passenger && !knownDestinations.some(location => location.id === passenger.id)
      ? [...knownDestinations, { id: passenger.id, name: passenger.name }]
      : knownDestinations;
    return <section className="space-y-3 p-3" aria-label="World">
      <h2 className="text-lg font-semibold">World</h2>
      <p>Current location: {snapshot.playerState.location.siteLabel ??
        snapshot.playerState.location.settlementId ?? 'Unknown'}</p>
      <div className="flex flex-wrap gap-2">
        {destinations.map(location => {
          const plan = resolvePlayerTravelPlan(source, location.id);
          return <button className={buttonClass} type="button" key={location.id}
            disabled={!plan.accepted} title={plan.accepted ? undefined : plan.reason}
            onClick={() => onAction({ kind: 'travel', id: location.id })}>
            {passenger?.id === location.id ? `Board passenger passage to ${location.name}` :
              `Travel to ${location.name}`}
          </button>;
        })}
      </div>
    </section>;
  }
  const encounter = snapshot.gameState.activeEncounter;
  const legal = encounter ? listLegalPlayerCombatCommands(encounter) : [];
  const exploration = resolveNearbyExplorationPlan(source);
  return <section className="space-y-3 p-3" aria-label="Activity">
    <h2 className="text-lg font-semibold">Activity</h2>
    <p>Tick {snapshot.clock.tick}</p>
    {!encounter && <div className="flex flex-wrap gap-2">
      <button className={buttonClass} type="button" disabled={!exploration.available}
        title={exploration.available ? undefined : exploration.reason}
        onClick={() => onAction({ kind: 'explore' })}>Explore nearby</button>
      {snapshot.worldState.nearbyExplorationCandidate &&
        <button className={buttonClass} type="button" onClick={() => onAction({ kind: 'admit' })}>
          Enter nearby encounter
        </button>}
    </div>}
    {encounter && <div>
      <p>Encounter: {encounter.encounterId} · {encounter.state}</p>
      <div className="flex flex-wrap gap-2">
        {encounter.state === 'active' && <button className={buttonClass} type="button"
          onClick={() => onAction({ kind: 'combat', actionType: 'combat.advance', targetId: null })}>
          Advance combat
        </button>}
        {legal.map(action => <button className={buttonClass} type="button"
          key={`${action.actionType}:${action.targetId}`}
          onClick={() => onAction({ kind: 'combat', actionType: action.actionType, targetId: action.targetId })}>
          {action.actionType} · {action.targetId}
        </button>)}
      </div>
    </div>}
  </section>;
}
