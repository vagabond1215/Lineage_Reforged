import {
  createCharacterPortraitIdentityFingerprint,
  type CharacterPortraitPromptSpec,
  type CharacterPortraitRenderProfile
} from "./characterPortraitSpec.js";

export type CharacterPortraitProviderErrorCode =
  | "unavailable"
  | "timeout"
  | "quota"
  | "invalid_response"
  | "rejected"
  | "cancelled"
  | "unknown";

export interface CharacterPortraitGenerationSuccess {
  ok: true;
  assetRef: string;
  generationId: string;
  providerKey: string;
}

export interface CharacterPortraitGenerationFailure {
  ok: false;
  code: CharacterPortraitProviderErrorCode;
  message: string;
  providerKey: string;
}

export type CharacterPortraitGenerationResult =
  | CharacterPortraitGenerationSuccess
  | CharacterPortraitGenerationFailure;

export interface CharacterPortraitProvider {
  key: string;
  generateCharacterPortrait(input: {
    promptSpec: CharacterPortraitPromptSpec;
    renderProfile: CharacterPortraitRenderProfile;
    signal?: AbortSignal;
  }): Promise<CharacterPortraitGenerationResult>;
}

export type CharacterPortraitUiStatus =
  | "empty"
  | "generating"
  | "ready"
  | "stale"
  | "regenerating"
  | "failed_first"
  | "failed_regeneration";

export interface CharacterPortraitUiState {
  status: CharacterPortraitUiStatus;
  assetRef: string | null;
  sourceIdentityFingerprint: string | null;
  providerKey: string | null;
  generationId: string | null;
  activeRequestId: number | null;
  activeRequestFingerprint: string | null;
  nextRequestId: number;
  errorMessage: string | null;
}

export interface CharacterPortraitRequestStart {
  state: CharacterPortraitUiState;
  requestId: number;
  requestFingerprint: string;
}

export const EMPTY_CHARACTER_PORTRAIT_UI_STATE: CharacterPortraitUiState = {
  status: "empty",
  assetRef: null,
  sourceIdentityFingerprint: null,
  providerKey: null,
  generationId: null,
  activeRequestId: null,
  activeRequestFingerprint: null,
  nextRequestId: 1,
  errorMessage: null
};

export function markCharacterPortraitIdentityChanged(
  state: CharacterPortraitUiState,
  currentIdentityFingerprint: string | null
): CharacterPortraitUiState {
  if (!state.assetRef || !state.sourceIdentityFingerprint) return state;
  const stale = state.sourceIdentityFingerprint !== currentIdentityFingerprint;
  if (!stale && state.status === "stale") return { ...state, status: "ready" };
  if (stale && (state.status === "ready" || state.status === "failed_regeneration")) {
    return { ...state, status: "stale" };
  }
  return state;
}

export function beginCharacterPortraitGeneration(
  state: CharacterPortraitUiState,
  promptSpec: CharacterPortraitPromptSpec
): CharacterPortraitRequestStart {
  const requestId = state.nextRequestId;
  const requestFingerprint = createCharacterPortraitIdentityFingerprint(promptSpec);
  return {
    requestId,
    requestFingerprint,
    state: {
      ...state,
      status: state.assetRef ? "regenerating" : "generating",
      activeRequestId: requestId,
      activeRequestFingerprint: requestFingerprint,
      nextRequestId: requestId + 1,
      errorMessage: null
    }
  };
}

export function completeCharacterPortraitGeneration(input: {
  state: CharacterPortraitUiState;
  requestId: number;
  requestFingerprint: string;
  currentIdentityFingerprint: string | null;
  result: CharacterPortraitGenerationResult;
}): CharacterPortraitUiState {
  const { state, requestId, requestFingerprint, currentIdentityFingerprint, result } = input;
  if (state.activeRequestId !== requestId || state.activeRequestFingerprint !== requestFingerprint) {
    return state;
  }

  if (!result.ok) {
    return {
      ...state,
      status: state.assetRef ? "failed_regeneration" : "failed_first",
      activeRequestId: null,
      activeRequestFingerprint: null,
      errorMessage: result.message
    };
  }

  const stale = requestFingerprint !== currentIdentityFingerprint;
  return {
    ...state,
    status: stale ? "stale" : "ready",
    assetRef: result.assetRef,
    sourceIdentityFingerprint: requestFingerprint,
    providerKey: result.providerKey,
    generationId: result.generationId,
    activeRequestId: null,
    activeRequestFingerprint: null,
    errorMessage: null
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createFakeSvgDataUrl(promptSpec: CharacterPortraitPromptSpec): string {
  const fingerprint = createCharacterPortraitIdentityFingerprint(promptSpec);
  const lineageSegments = promptSpec.lineageId.split(".");
  const lineage = (lineageSegments[lineageSegments.length - 1] ?? "character").replace(/_/g, " ");
  const label = `${promptSpec.sexId} ${lineage}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#1b1f24"/><ellipse cx="400" cy="330" rx="145" ry="175" fill="#6e7781"/><path d="M170 980 C200 650 280 545 400 545 C520 545 600 650 630 980 Z" fill="#4b5563"/><text x="400" y="80" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" fill="#e5e7eb">LOCAL PORTRAIT PROOF</text><text x="400" y="875" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" fill="#e5e7eb">${escapeXml(label)}</text><text x="400" y="920" text-anchor="middle" font-family="monospace" font-size="18" fill="#cbd5e1">${escapeXml(fingerprint)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createDeterministicLocalCharacterPortraitProvider(): CharacterPortraitProvider {
  return {
    key: "local.creator-proof.v1",
    async generateCharacterPortrait({ promptSpec, signal }) {
      if (signal?.aborted) {
        return { ok: false, code: "cancelled", message: "Portrait generation was cancelled.", providerKey: this.key };
      }
      const fingerprint = createCharacterPortraitIdentityFingerprint(promptSpec);
      await Promise.resolve();
      if (signal?.aborted) {
        return { ok: false, code: "cancelled", message: "Portrait generation was cancelled.", providerKey: this.key };
      }
      return {
        ok: true,
        assetRef: createFakeSvgDataUrl(promptSpec),
        generationId: `local.${fingerprint}`,
        providerKey: this.key
      };
    }
  };
}
