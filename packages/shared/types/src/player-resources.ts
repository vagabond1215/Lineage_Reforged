import type {
  GameEventEnvelope,
  PlayerResourceChangeKind,
  PlayerResourceChangeRecordState,
  PlayerResourceChangeRequestState,
  PlayerResourceGrowthVector,
  PlayerResourceKey,
  PlayerResourceModifierState,
  PlayerResourceRuntimeState,
  PlayerResourceTickBreakdownState,
  PlayerResources,
  PlayerState
} from "./contracts.js";

export const PLAYER_RESOURCE_KEYS: PlayerResourceKey[] = ["hp", "mp", "stamina"];

const MAX_RESOURCE_HISTORY = 48;

function createEmptyResourceVector(): PlayerResourceGrowthVector {
  return {
    hp: 0,
    mp: 0,
    stamina: 0
  };
}

function cloneResources(resources: PlayerResources): PlayerResources {
  return {
    hp: { ...resources.hp },
    mp: { ...resources.mp },
    stamina: { ...resources.stamina },
    xp: { ...resources.xp }
  };
}

function vectorFromPartial(
  value: PlayerResourceModifierState["maxFlat"] | PlayerResourceModifierState["maxPercent"] | PlayerResourceModifierState["tickDeltaFlat"]
): PlayerResourceGrowthVector {
  return {
    hp: value.hp ?? 0,
    mp: value.mp ?? 0,
    stamina: value.stamina ?? 0
  };
}

function addResourceVectors(
  left: PlayerResourceGrowthVector,
  right: PlayerResourceGrowthVector
): PlayerResourceGrowthVector {
  return {
    hp: left.hp + right.hp,
    mp: left.mp + right.mp,
    stamina: left.stamina + right.stamina
  };
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isModifierActive(modifier: PlayerResourceModifierState, tick: number): boolean {
  return modifier.expiresAtTick === undefined || modifier.expiresAtTick === null || modifier.expiresAtTick >= tick;
}

function normalizeChangeRequest(
  request: Partial<PlayerResourceChangeRequestState> | undefined,
  fallbackId: string
): PlayerResourceChangeRequestState | null {
  if (!request?.resource || typeof request.amount !== "number") {
    return null;
  }

  return {
    id: request.id ?? fallbackId,
    label: request.label ?? fallbackId,
    resource: request.resource,
    amount: request.amount,
    kind: (request.kind ?? "scripted") as PlayerResourceChangeKind,
    sourceType: request.sourceType ?? "system",
    sourceId: request.sourceId ?? null
  };
}

function applyModifierEvents(
  modifiers: PlayerResourceModifierState[],
  events: ReadonlyArray<GameEventEnvelope>,
  playerId: string
): PlayerResourceModifierState[] {
  let nextModifiers = [...modifiers];

  for (const event of events) {
    const payload = event.payload as {
      playerId?: string;
      modifier?: PlayerResourceModifierState;
      modifierId?: string;
    };

    if (payload.playerId && payload.playerId !== playerId) {
      continue;
    }

    if (event.type === "player.resource.modifier.applied" && payload.modifier) {
      nextModifiers = [
        ...nextModifiers.filter((modifier) => modifier.id !== payload.modifier?.id),
        payload.modifier
      ];
      continue;
    }

    if (event.type === "player.resource.modifier.removed" && payload.modifierId) {
      nextModifiers = nextModifiers.filter((modifier) => modifier.id !== payload.modifierId);
    }
  }

  return nextModifiers;
}

function collectEventChangeRequests(
  events: ReadonlyArray<GameEventEnvelope>,
  playerId: string
): PlayerResourceChangeRequestState[] {
  return events.flatMap((event, index) => {
    if (event.type !== "player.resource.change") {
      return [];
    }

    const payload = event.payload as Partial<PlayerResourceChangeRequestState> & {
      playerId?: string;
      request?: Partial<PlayerResourceChangeRequestState>;
    };

    if (payload.playerId && payload.playerId !== playerId) {
      return [];
    }

    const normalized = normalizeChangeRequest(
      payload.request ?? payload,
      `${event.id}.change.${index}`
    );

    return normalized ? [normalized] : [];
  });
}

function collectActiveModifiers(
  state: Pick<PlayerState, "equipment" | "resourceRuntime">,
  tick: number
): PlayerResourceModifierState[] {
  const runtimeModifiers = state.resourceRuntime.modifiers.filter((modifier) => isModifierActive(modifier, tick));
  const equipmentModifiers = Object.values(state.equipment).flatMap((item) =>
    item?.resourceModifiers?.filter((modifier) => isModifierActive(modifier, tick)) ?? []
  );

  return [...runtimeModifiers, ...equipmentModifiers];
}

function sumModifierField(
  modifiers: PlayerResourceModifierState[],
  field: "maxFlat" | "maxPercent"
): PlayerResourceGrowthVector {
  return modifiers.reduce(
    (result, modifier) => addResourceVectors(result, vectorFromPartial(modifier[field])),
    createEmptyResourceVector()
  );
}

function buildTickDeltaSummary(modifiers: PlayerResourceModifierState[]): {
  assisted: PlayerResourceGrowthVector;
  degeneration: PlayerResourceGrowthVector;
} {
  return modifiers.reduce(
    (result, modifier) => {
      for (const resource of PLAYER_RESOURCE_KEYS) {
        const delta = modifier.tickDeltaFlat[resource] ?? 0;

        if (delta > 0) {
          result.assisted[resource] += delta;
        } else if (delta < 0) {
          result.degeneration[resource] += Math.abs(delta);
        }
      }

      return result;
    },
    {
      assisted: createEmptyResourceVector(),
      degeneration: createEmptyResourceVector()
    }
  );
}

export function createEmptyPlayerResourceRuntimeState(): PlayerResourceRuntimeState {
  return {
    modifiers: [],
    pendingChanges: [],
    lastBreakdown: null,
    history: []
  };
}

export function calculateNaturalResourceRegen(
  state: Pick<PlayerState, "attributes" | "originProfile">
): PlayerResourceGrowthVector {
  return {
    hp: Math.max(
      0,
      1 +
        Math.floor(
          (
            state.attributes.CON +
            state.attributes.VIT +
            state.originProfile.lineageResourceGrowthPerLevel.hp +
            state.originProfile.classResourceGrowthPerClassLevel.hp
          ) / 12
        )
    ),
    mp: Math.max(
      0,
      1 +
        Math.floor(
          (
            state.attributes.INT +
            state.attributes.SPT +
            state.originProfile.lineageResourceGrowthPerLevel.mp +
            state.originProfile.classResourceGrowthPerClassLevel.mp
          ) / 12
        )
    ),
    stamina: Math.max(
      0,
      2 +
        Math.floor(
          (
            state.attributes.AGI +
            state.attributes.CON +
            state.attributes.VIT +
            state.originProfile.lineageResourceGrowthPerLevel.stamina +
            state.originProfile.classResourceGrowthPerClassLevel.stamina
          ) / 14
        )
    )
  };
}

export function resolvePlayerResources(
  state: Pick<PlayerState, "playerId" | "attributes" | "resources" | "originProfile" | "equipment" | "resourceRuntime">,
  events: ReadonlyArray<GameEventEnvelope>,
  tick: number
): {
  resources: PlayerResources;
  resourceRuntime: PlayerResourceRuntimeState;
  activeModifiers: PlayerResourceModifierState[];
  breakdown: PlayerResourceTickBreakdownState;
} {
  const syncedRuntimeModifiers = applyModifierEvents(state.resourceRuntime.modifiers, events, state.playerId);
  const runtimeState: PlayerResourceRuntimeState = {
    ...state.resourceRuntime,
    modifiers: syncedRuntimeModifiers.filter((modifier) => isModifierActive(modifier, tick))
  };
  const activeModifiers = collectActiveModifiers(
    {
      equipment: state.equipment,
      resourceRuntime: runtimeState
    },
    tick
  );
  const maxFlat = sumModifierField(activeModifiers, "maxFlat");
  const maxPercent = sumModifierField(activeModifiers, "maxPercent");
  const naturalRegen = calculateNaturalResourceRegen(state);
  const tickDeltaSummary = buildTickDeltaSummary(activeModifiers);
  const directChanges = [
    ...runtimeState.pendingChanges,
    ...collectEventChangeRequests(events, state.playerId)
  ];
  const nextResources = cloneResources(state.resources);
  const history: PlayerResourceChangeRecordState[] = [...runtimeState.history];
  const breakdown: PlayerResourceTickBreakdownState = {
    appliedTick: tick,
    activeModifierIds: activeModifiers.map((modifier) => modifier.id),
    resources: {
      hp: {
        max: 0,
        before: 0,
        after: 0,
        naturalRegen: naturalRegen.hp,
        assistedRegen: tickDeltaSummary.assisted.hp,
        degeneration: tickDeltaSummary.degeneration.hp,
        directChange: 0,
        clampAdjustment: 0
      },
      mp: {
        max: 0,
        before: 0,
        after: 0,
        naturalRegen: naturalRegen.mp,
        assistedRegen: tickDeltaSummary.assisted.mp,
        degeneration: tickDeltaSummary.degeneration.mp,
        directChange: 0,
        clampAdjustment: 0
      },
      stamina: {
        max: 0,
        before: 0,
        after: 0,
        naturalRegen: naturalRegen.stamina,
        assistedRegen: tickDeltaSummary.assisted.stamina,
        degeneration: tickDeltaSummary.degeneration.stamina,
        directChange: 0,
        clampAdjustment: 0
      }
    }
  };

  const resolvedMaxima: PlayerResourceGrowthVector = createEmptyResourceVector();

  for (const resource of PLAYER_RESOURCE_KEYS) {
    const baseMax = state.originProfile.resolvedResourceMaxima[resource];
    const flatBonus = maxFlat[resource];
    const percentBonus = maxPercent[resource];
    resolvedMaxima[resource] = Math.max(
      1,
      Math.round((baseMax + flatBonus) * (1 + percentBonus / 100))
    );
    nextResources[resource].max = resolvedMaxima[resource];
  }

  for (const resource of PLAYER_RESOURCE_KEYS) {
    const entry = breakdown.resources[resource];
    const initialCurrent = state.resources[resource].current;
    let currentValue = clampValue(initialCurrent, 0, resolvedMaxima[resource]);

    entry.max = resolvedMaxima[resource];
    entry.before = initialCurrent;

    const applyRecordedChange = (
      change: PlayerResourceChangeRequestState,
      amount: number
    ): void => {
      if (amount === 0) {
        return;
      }

      const before = currentValue;
      const after = clampValue(currentValue + amount, 0, resolvedMaxima[resource]);

      if (after === before) {
        return;
      }

      currentValue = after;
      history.push({
        ...change,
        amount,
        appliedTick: tick,
        before,
        after
      });
    };

    applyRecordedChange(
      {
        id: `natural.${tick}.${resource}`,
        label: `Natural ${resource.toUpperCase()} regeneration`,
        resource,
        amount: naturalRegen[resource],
        kind: "natural_regen",
        sourceType: "system",
        sourceId: null
      },
      naturalRegen[resource]
    );

    for (const modifier of activeModifiers) {
      const delta = modifier.tickDeltaFlat[resource] ?? 0;

      if (delta === 0) {
        continue;
      }

      applyRecordedChange(
        {
          id: `${modifier.id}.${tick}.${resource}`,
          label: modifier.label,
          resource,
          amount: delta,
          kind: delta > 0 ? "assisted_regen" : "degeneration",
          sourceType: modifier.sourceType,
          sourceId: modifier.sourceId
        },
        delta
      );
    }

    for (const change of directChanges.filter((entryChange) => entryChange.resource === resource)) {
      entry.directChange += change.amount;
      applyRecordedChange(change, change.amount);
    }

    entry.after = currentValue;
    entry.clampAdjustment =
      currentValue -
      (
        initialCurrent +
        entry.naturalRegen +
        entry.assistedRegen -
        entry.degeneration +
        entry.directChange
      );
    nextResources[resource].current = currentValue;
  }

  const nextRuntime: PlayerResourceRuntimeState = {
    modifiers: runtimeState.modifiers,
    pendingChanges: [],
    lastBreakdown: breakdown,
    history: history.slice(-MAX_RESOURCE_HISTORY)
  };

  return {
    resources: nextResources,
    resourceRuntime: nextRuntime,
    activeModifiers,
    breakdown
  };
}
