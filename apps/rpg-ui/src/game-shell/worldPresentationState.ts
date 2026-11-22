/** Ephemeral visual review state. Never a World creation request or Save format. */
export type WorldReviewDraft = {
  name: string;
  temperature: string;
  rainfall: string;
  season: string;
};
export type WorldReviewState = {
  view: 'library' | 'configuration';
  draft: WorldReviewDraft;
};
export type WorldReviewAction =
  | { type: 'OPEN_CONFIGURATION' }
  | { type: 'BACK' }
  | { type: 'EDIT'; field: keyof WorldReviewDraft; value: string };

export function createWorldReviewState(): WorldReviewState {
  return { view: 'library', draft: {
    name: '', temperature: 'Normal', rainfall: 'Normal', season: 'Scenario Default'
  } };
}

export function worldReviewReducer(state: WorldReviewState, action: WorldReviewAction): WorldReviewState {
  if (action.type === 'BACK') return createWorldReviewState();
  if (action.type === 'OPEN_CONFIGURATION')
    return { ...createWorldReviewState(), view: 'configuration' };
  if (state.view !== 'configuration') return state;
  return { ...state, draft: { ...state.draft, [action.field]: action.value } };
}
