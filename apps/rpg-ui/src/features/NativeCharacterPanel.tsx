import { useState } from 'react';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { NativeFreshCampaignSnapshot } from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { GearSlotId } from '../../../../packages/engines/game-engine/src/gear-instance-owner.js';
import { CHARACTER_ATTRIBUTE_ORDER, getCharacterAttributePresentation } from '../game-shell/characterAttributes.js';
import {
  admitNativeSelectedItemCommand,
  readNativeSelectedCharacter,
  type NativeGearPresentation,
  type NativeSelectedItemCommand
} from '../game-shell/nativeSelectedCharacter.js';

type NativeCharacterPanelProps = {
  snapshot: NativeFreshCampaignSnapshot;
  mode: 'character' | 'inventory';
  control?: CampaignSessionControl<NativeFreshCampaignSnapshot>;
  onSnapshotChange?: (snapshot: NativeFreshCampaignSnapshot,
    control: CampaignSessionControl<NativeFreshCampaignSnapshot>) => void;
};

const slotLabel = (slotId: GearSlotId) => slotId.split('.').slice(2)
  .map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
const durabilityLabel = (value: number) => `${Math.round(value * 100)}% durability`;

function CarriedGearRow({ item, disabled, onEquip }: {
  item: NativeGearPresentation;
  disabled: boolean;
  onEquip: (item: NativeGearPresentation, slotId: GearSlotId) => void;
}) {
  const [chosenSlot, setChosenSlot] = useState<GearSlotId | null>(item.eligibleSlots[0] ?? null);
  return <li className="rounded-md border border-[color:var(--color-border-soft)] p-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div><strong>{item.name}</strong> <span className="text-xs text-[color:var(--color-text-secondary)]">{durabilityLabel(item.durability)} · {item.location.kind === 'bag' ? item.location.bagId : 'Overflow'}</span></div>
      {chosenSlot && <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`native-gear-target-${item.itemInstanceId}`}>Equip position for {item.name}</label>
        <select id={`native-gear-target-${item.itemInstanceId}`} value={chosenSlot}
          onChange={event => setChosenSlot(event.target.value as GearSlotId)}
          className="rounded border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-2 py-1 text-sm">
          {item.eligibleSlots.map(slotId => <option value={slotId} key={slotId}>{slotLabel(slotId)}</option>)}
        </select>
        <button type="button" disabled={disabled} onClick={() => onEquip(item, chosenSlot)}
          className="rounded border border-[color:var(--color-border-soft)] px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-50">
          Equip {item.name}
        </button>
      </div>}
    </div>
    <p className="text-xs text-[color:var(--color-text-muted)]">Instance {item.itemInstanceId}</p>
    {!chosenSlot && <p className="text-xs text-[color:var(--color-text-secondary)]">No authored equipment position.</p>}
  </li>;
}

/** Native physical item UI. Mutations require an admitted session callback. */
export function NativeCharacterPanel({ snapshot, mode, control, onSnapshotChange }: NativeCharacterPanelProps) {
  const view = readNativeSelectedCharacter(snapshot);
  const [inspection, setInspection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'status' | 'alert'; text: string } | null>(null);
  const canMutate = !!control && !!onSnapshotChange;
  const submit = (command: NativeSelectedItemCommand, label: string) => {
    if (!control || !onSnapshotChange) return;
    const result = admitNativeSelectedItemCommand(snapshot, control, command,
      `native.selected.ui.${globalThis.crypto.randomUUID()}`);
    if (result.status === 'accepted') {
      onSnapshotChange(result.snapshot, result.control);
      setFeedback({ tone: 'status', text: `${label} completed.` });
    } else {
      setFeedback({ tone: 'alert', text: `${label} was not applied: ${result.reason ?? result.status}.` });
    }
  };
  const selectedItem = view.slots.find(slot => slot.item?.itemInstanceId === inspection)?.item ??
    view.carriedGear.find(item => item.itemInstanceId === inspection);

  return <main className="panel-scroll h-full overflow-auto p-3 text-[color:var(--color-text-primary)]" aria-label={mode === 'character' ? 'Native Character' : 'Native Inventory'}>
    {feedback && <p role={feedback.tone} className="mb-3 rounded border border-[color:var(--color-border-soft)] p-2 text-sm">{feedback.text}</p>}
    {mode === 'character' ? <>
      <h2 className="mb-3 text-xl font-bold">{view.playerName}</h2>
      <div className="grid gap-3 lg:grid-cols-[minmax(9rem,12rem)_minmax(0,1fr)]">
        <section aria-label="Character attributes">
          <h3 className="mb-2 text-sm font-semibold">Attributes</h3>
          <dl className="grid gap-1">{CHARACTER_ATTRIBUTE_ORDER.map(key => <div key={key}
            className="flex justify-between rounded border border-[color:var(--color-border-soft)] px-2 py-1 text-sm"
            aria-label={`${getCharacterAttributePresentation(key).fullName} ${view.attributes[key]}`}>
            <dt title={getCharacterAttributePresentation(key).fullName}>{key}</dt><dd>{view.attributes[key]}</dd>
          </div>)}</dl>
        </section>
        <section aria-label="Native equipment positions">
          <h3 className="mb-2 text-sm font-semibold">Worn Equipment</h3>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-5">
            {view.slots.map(({ slotId, item }) => <div key={slotId} data-slot-id={slotId}
              className="min-w-0 rounded border border-[color:var(--color-border-soft)] p-2 text-xs">
              <div className="text-[color:var(--color-text-secondary)]">{slotLabel(slotId)}</div>
              {item ? <>
                <button type="button" onClick={() => setInspection(item.itemInstanceId)}
                  aria-label={`Inspect ${item.name} in ${slotLabel(slotId)}`}
                  className="block max-w-full truncate text-left font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">
                  {item.name}
                </button>
                <span>{durabilityLabel(item.durability)}</span>
                <button type="button" disabled={!canMutate} title={!canMutate ? 'Native Save and gameplay activation pending' : undefined}
                  onClick={() => submit({ kind: 'gear', expectedRevision: view.gearRevision,
                    itemInstanceId: item.itemInstanceId, destination: { kind: 'carried' } }, `Unequip ${item.name}`)}
                  className="mt-1 block rounded border border-[color:var(--color-border-soft)] px-2 py-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-50">
                  Unequip
                </button>
              </> : <span className="sr-only">Unoccupied</span>}
            </div>)}
          </div>
        </section>
      </div>
      {selectedItem && <aside role="region" aria-label="Selected gear details" className="mt-3 rounded border border-[color:var(--color-border-soft)] p-2 text-sm">
        <strong>{selectedItem.name}</strong><p>Instance {selectedItem.itemInstanceId}</p><p>{durabilityLabel(selectedItem.durability)}</p>
      </aside>}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <details className="rounded border border-[color:var(--color-border-soft)] p-2"><summary>Skills ({snapshot.playerState.skills.length})</summary>
          <ul>{snapshot.playerState.skills.map(skill => <li key={skill.id}>{skill.id} · Rank {skill.rank}</li>)}</ul></details>
        <details className="rounded border border-[color:var(--color-border-soft)] p-2"><summary>Traits and Effects</summary>
          <ul>{snapshot.playerState.traits.map(trait => <li key={trait.id}>{trait.id}</li>)}
            {snapshot.playerState.activeEffects.map(effect => <li key={effect}>{effect}</li>)}</ul></details>
      </div>
    </> : <>
      <h2 className="mb-3 text-xl font-bold">Inventory</h2>
      <section aria-label="Carried gear"><h3 className="mb-2 text-sm font-semibold">Carried Gear</h3>
        {view.carriedGear.length ? <ul className="space-y-2">{view.carriedGear.map(item =>
          <CarriedGearRow key={item.itemInstanceId} item={item}
            disabled={!canMutate} onEquip={(selected, slotId) => submit({ kind: 'gear', expectedRevision: view.gearRevision,
              itemInstanceId: selected.itemInstanceId, destination: { kind: 'worn', slotId } }, `Equip ${selected.name}`)} />
        )}</ul> : <p className="text-sm text-[color:var(--color-text-secondary)]">No carried gear.</p>}</section>
      <section aria-label="Stack inventory" className="mt-4"><h3 className="mb-2 text-sm font-semibold">Stack Inventory</h3>
        <ul className="space-y-2">{view.fungibleStacks.map(stack => <li key={`${stack.location.kind}.${stack.location.kind === 'bag' ? stack.location.bagId : 'overflow'}.${stack.location.stackIndex}`}
          className="flex flex-wrap items-center justify-between gap-2 rounded border border-[color:var(--color-border-soft)] p-2 text-sm">
          <span>{stack.name} × {stack.quantity} · {stack.location.kind === 'bag' ? stack.location.bagId : 'Overflow'}</span>
          <button type="button" disabled={!canMutate || !stack.canUse}
            title={!stack.canUse ? stack.useUnavailableReason : !canMutate ? 'Native Save and gameplay activation pending' : undefined}
            onClick={() => submit({ kind: 'use', target: stack }, `Use ${stack.name}`)}
            className="rounded border border-[color:var(--color-border-soft)] px-3 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 disabled:opacity-50">
            Use {stack.name}
          </button>
          {!stack.canUse && <span className="text-xs text-[color:var(--color-text-secondary)]">{stack.useUnavailableReason}</span>}
        </li>)}</ul>
      </section>
    </>}
  </main>;
}
