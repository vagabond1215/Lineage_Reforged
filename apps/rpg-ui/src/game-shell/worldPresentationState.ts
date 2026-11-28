/** UI projection and intent only. The account and World owners supply authority. */
export type WorldLibraryCard = {
  worldInstanceId: string;
  displayName: string;
  createdAt: string;
  rules: { progressionMode: 'chronicle'; worldKind: 'individual'; difficulty: 'mortal' };
  scenario: { id: string; version: number };
};

export type SelectedWorld = Pick<WorldLibraryCard, 'worldInstanceId' | 'displayName'> & {
  accountId: string;
  generation: number;
  creationIntentId: string;
  projectionFingerprint: string;
};

export type WorldLibraryState =
  | { status: 'preview' | 'loading' | 'empty' }
  | { status: 'ready'; world: WorldLibraryCard }
  | { status: 'blocked' | 'readback-failed'; message: string };

export type WorldCreationIntent = {
  displayName: string;
  creationIntentId: string;
  proposedWorldInstanceId: string;
};
export type WorldCreationResult =
  | { status: 'verified'; worldInstanceId: string }
  | { status: 'blocked' | 'readback-failed'; message: string };

export const WORLD_NAME_LIMIT = 80;
export function validatedWorldName(raw: string): string | null {
  const name = raw.trim();
  return name.length >= 1 && name.length <= WORLD_NAME_LIMIT &&
    !Array.from(raw).some(char => {
      const code = char.charCodeAt(0);
      return code < 32 || code === 127;
    }) ? name : null;
}

export function createWorldIntent(displayName: string): WorldCreationIntent {
  return { displayName,
    creationIntentId: `world.create.${crypto.randomUUID()}`,
    proposedWorldInstanceId: `world.instance.${crypto.randomUUID()}`,
  };
}

export type WorldReviewState = {
  view: 'library' | 'configuration';
  highlightedWorldId?: string;
};
export type WorldReviewAction =
  | { type: 'OPEN_CONFIGURATION' }
  | { type: 'BACK' }
  | { type: 'VERIFIED'; worldInstanceId: string };

export function createWorldReviewState(): WorldReviewState {
  return { view: 'library' };
}

export function worldReviewReducer(state: WorldReviewState, action: WorldReviewAction): WorldReviewState {
  if (action.type === 'BACK') return createWorldReviewState();
  if (action.type === 'OPEN_CONFIGURATION')
    return state.view === 'configuration' ? state : { view: 'configuration' };
  return state.view === 'configuration'
    ? { view: 'library', highlightedWorldId: action.worldInstanceId } : state;
}
