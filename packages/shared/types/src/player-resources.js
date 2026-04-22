export const PLAYER_RESOURCE_KEYS = ["hp", "mp", "stamina"];
const RESOURCE_MAX_ATTRIBUTE_BASELINE = 10;
const RESOURCE_MAX_ATTRIBUTE_SCALING = {
    hp: {
        attributes: ["CON", "VIT"],
        perPoint: 4
    },
    mp: {
        attributes: ["INT", "SPT"],
        perPoint: 4
    },
    stamina: {
        attributes: ["AGI", "CON", "VIT"],
        perPoint: 3
    }
};
const MAX_RESOURCE_HISTORY = 48;
function createEmptyResourceVector() {
    return {
        hp: 0,
        mp: 0,
        stamina: 0
    };
}
function cloneResources(resources) {
    return {
        hp: { ...resources.hp },
        mp: { ...resources.mp },
        stamina: { ...resources.stamina },
        xp: { ...resources.xp }
    };
}
function vectorFromPartial(value) {
    return {
        hp: value.hp ?? 0,
        mp: value.mp ?? 0,
        stamina: value.stamina ?? 0
    };
}
function addResourceVectors(left, right) {
    return {
        hp: left.hp + right.hp,
        mp: left.mp + right.mp,
        stamina: left.stamina + right.stamina
    };
}
function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function calculateAttributeResourceMaxAdjustments(state) {
    return {
        hp: RESOURCE_MAX_ATTRIBUTE_SCALING.hp.attributes.reduce((total, attributeKey) => total +
            (state.attributes[attributeKey] - RESOURCE_MAX_ATTRIBUTE_BASELINE) *
                RESOURCE_MAX_ATTRIBUTE_SCALING.hp.perPoint, 0),
        mp: RESOURCE_MAX_ATTRIBUTE_SCALING.mp.attributes.reduce((total, attributeKey) => total +
            (state.attributes[attributeKey] - RESOURCE_MAX_ATTRIBUTE_BASELINE) *
                RESOURCE_MAX_ATTRIBUTE_SCALING.mp.perPoint, 0),
        stamina: RESOURCE_MAX_ATTRIBUTE_SCALING.stamina.attributes.reduce((total, attributeKey) => total +
            (state.attributes[attributeKey] - RESOURCE_MAX_ATTRIBUTE_BASELINE) *
                RESOURCE_MAX_ATTRIBUTE_SCALING.stamina.perPoint, 0)
    };
}
function isModifierActive(modifier, tick) {
    return modifier.expiresAtTick === undefined || modifier.expiresAtTick === null || modifier.expiresAtTick >= tick;
}
function normalizeChangeRequest(request, fallbackId) {
    if (!request?.resource || typeof request.amount !== "number") {
        return null;
    }
    return {
        id: request.id ?? fallbackId,
        label: request.label ?? fallbackId,
        resource: request.resource,
        amount: request.amount,
        kind: (request.kind ?? "scripted"),
        sourceType: request.sourceType ?? "system",
        sourceId: request.sourceId ?? null
    };
}
function applyModifierEvents(modifiers, events, playerId) {
    let nextModifiers = [...modifiers];
    for (const event of events) {
        const payload = event.payload;
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
function collectEventChangeRequests(events, playerId) {
    return events.flatMap((event, index) => {
        if (event.type !== "player.resource.change") {
            return [];
        }
        const payload = event.payload;
        if (payload.playerId && payload.playerId !== playerId) {
            return [];
        }
        const normalized = normalizeChangeRequest(payload.request ?? payload, `${event.id}.change.${index}`);
        return normalized ? [normalized] : [];
    });
}
function collectActiveModifiers(state, tick) {
    const runtimeModifiers = state.resourceRuntime.modifiers.filter((modifier) => isModifierActive(modifier, tick));
    const equipmentModifiers = Object.values(state.equipment).flatMap((item) => item?.resourceModifiers?.filter((modifier) => isModifierActive(modifier, tick)) ?? []);
    return [...runtimeModifiers, ...equipmentModifiers];
}
function sumModifierField(modifiers, field) {
    return modifiers.reduce((result, modifier) => addResourceVectors(result, vectorFromPartial(modifier[field])), createEmptyResourceVector());
}
function buildTickDeltaSummary(modifiers) {
    return modifiers.reduce((result, modifier) => {
        for (const resource of PLAYER_RESOURCE_KEYS) {
            const delta = modifier.tickDeltaFlat[resource] ?? 0;
            if (delta > 0) {
                result.assisted[resource] += delta;
            }
            else if (delta < 0) {
                result.degeneration[resource] += Math.abs(delta);
            }
        }
        return result;
    }, {
        assisted: createEmptyResourceVector(),
        degeneration: createEmptyResourceVector()
    });
}
export function createEmptyPlayerResourceRuntimeState() {
    return {
        modifiers: [],
        pendingChanges: [],
        lastBreakdown: null,
        history: []
    };
}
export function calculateNaturalResourceRegen(state) {
    const staminaRegenMultiplier = state.bodyState.resolved.staminaRegenMultiplier;
    return {
        hp: Math.max(0, 1 +
            Math.floor((state.attributes.CON +
                state.attributes.VIT +
                state.originProfile.lineageResourceGrowthPerLevel.hp +
                state.originProfile.classResourceGrowthPerClassLevel.hp) / 12)),
        mp: Math.max(0, 1 +
            Math.floor((state.attributes.INT +
                state.attributes.SPT +
                state.originProfile.lineageResourceGrowthPerLevel.mp +
                state.originProfile.classResourceGrowthPerClassLevel.mp) / 12)),
        stamina: Math.max(0, Math.round((2 +
            Math.floor((state.attributes.AGI +
                state.attributes.CON +
                state.attributes.VIT +
                state.originProfile.lineageResourceGrowthPerLevel.stamina +
                state.originProfile.classResourceGrowthPerClassLevel.stamina) / 14)) * staminaRegenMultiplier))
    };
}
export function resolvePlayerResources(state, events, tick) {
    const syncedRuntimeModifiers = applyModifierEvents(state.resourceRuntime.modifiers, events, state.playerId);
    const runtimeState = {
        ...state.resourceRuntime,
        modifiers: syncedRuntimeModifiers.filter((modifier) => isModifierActive(modifier, tick))
    };
    const activeModifiers = collectActiveModifiers({
        equipment: state.equipment,
        resourceRuntime: runtimeState
    }, tick);
    const maxFlat = sumModifierField(activeModifiers, "maxFlat");
    const maxPercent = sumModifierField(activeModifiers, "maxPercent");
    const naturalRegen = calculateNaturalResourceRegen(state);
    const tickDeltaSummary = buildTickDeltaSummary(activeModifiers);
    const directChanges = [
        ...runtimeState.pendingChanges,
        ...collectEventChangeRequests(events, state.playerId)
    ];
    const nextResources = cloneResources(state.resources);
    const history = [...runtimeState.history];
    const breakdown = {
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
    const resolvedMaxima = createEmptyResourceVector();
    const attributeMaxAdjustments = calculateAttributeResourceMaxAdjustments(state);
    for (const resource of PLAYER_RESOURCE_KEYS) {
        const baseMax = state.originProfile.resolvedResourceMaxima[resource] +
            attributeMaxAdjustments[resource];
        const flatBonus = maxFlat[resource];
        const percentBonus = maxPercent[resource];
        const staminaMaxMultiplier = resource === "stamina" ? state.bodyState.resolved.staminaMaxMultiplier : 1;
        resolvedMaxima[resource] = Math.max(1, Math.round((baseMax + flatBonus) * (1 + percentBonus / 100) * staminaMaxMultiplier));
        nextResources[resource].max = resolvedMaxima[resource];
    }
    for (const resource of PLAYER_RESOURCE_KEYS) {
        const entry = breakdown.resources[resource];
        const initialCurrent = state.resources[resource].current;
        let currentValue = clampValue(initialCurrent, 0, resolvedMaxima[resource]);
        entry.max = resolvedMaxima[resource];
        entry.before = initialCurrent;
        const applyRecordedChange = (change, amount) => {
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
        applyRecordedChange({
            id: `natural.${tick}.${resource}`,
            label: `Natural ${resource.toUpperCase()} regeneration`,
            resource,
            amount: naturalRegen[resource],
            kind: "natural_regen",
            sourceType: "system",
            sourceId: null
        }, naturalRegen[resource]);
        for (const modifier of activeModifiers) {
            const delta = modifier.tickDeltaFlat[resource] ?? 0;
            if (delta === 0) {
                continue;
            }
            applyRecordedChange({
                id: `${modifier.id}.${tick}.${resource}`,
                label: modifier.label,
                resource,
                amount: delta,
                kind: delta > 0 ? "assisted_regen" : "degeneration",
                sourceType: modifier.sourceType,
                sourceId: modifier.sourceId
            }, delta);
        }
        for (const change of directChanges.filter((entryChange) => entryChange.resource === resource)) {
            entry.directChange += change.amount;
            applyRecordedChange(change, change.amount);
        }
        entry.after = currentValue;
        entry.clampAdjustment =
            currentValue -
                (initialCurrent +
                    entry.naturalRegen +
                    entry.assistedRegen -
                    entry.degeneration +
                    entry.directChange);
        nextResources[resource].current = currentValue;
    }
    const nextRuntime = {
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
