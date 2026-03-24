import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import {
  CHARACTER_CREATION_STEPS,
  getNextCharacterCreationStepId,
  getPreviousCharacterCreationStepId,
  type CharacterCreationStepId,
  type CharacterCreationFormState,
  validateCharacterCreationForm,
  validateCharacterCreationStep
} from '../characterCreationForm.js';
import {
  backgroundOptions,
  classOptions,
  lineageOptions,
  settlementOptions
} from '../starterTemplates.js';
import {
  buildCharacterCreationPreview,
  type CharacterCreationPreview
} from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import { ScreenFrame } from './ScreenFrame.js';

type CharacterCreationScreenProps = {
  form: CharacterCreationFormState;
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  pendingOverwriteSlotId: ManualSaveSlotId | null;
  onDismissNotice: () => void;
  onBack: () => void;
  onChange: (form: Partial<CharacterCreationFormState>) => void;
  onCreateGame: () => void;
  onConfirmOverwrite: () => void;
  onCancelOverwrite: () => void;
};

const selectionButtonClass =
  'rounded-[22px] border px-4 py-4 text-left transition';

function renderMetric(label: string, value: string) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/10 p-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg text-slate-50">{value}</div>
    </div>
  );
}

function renderTagBlock(title: string, values: string[]) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {(values.length > 0 ? values : ['None']).map((value) => (
          <span
            key={`${title}.${value}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderOptionGrid(
  options: Array<{ id: string; label: string; description: string; notes: string[] }>,
  selectedId: string,
  onSelect: (id: string) => void,
  activeClassName: string
) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={`${selectionButtonClass} ${
            selectedId === option.id
              ? activeClassName
              : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
          }`}
        >
          <div className="text-base font-semibold">{option.label}</div>
          <div className="mt-2 text-sm leading-6 text-white/75">{option.description}</div>
          {option.notes[0] && (
            <div className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
              {option.notes[0]}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export function CharacterCreationScreen({
  form,
  slots,
  notice,
  pendingOverwriteSlotId,
  onDismissNotice,
  onBack,
  onChange,
  onCreateGame,
  onConfirmOverwrite,
  onCancelOverwrite
}: CharacterCreationScreenProps) {
  const [currentStepId, setCurrentStepId] = useState<CharacterCreationStepId>('identity');
  const [showValidation, setShowValidation] = useState(false);
  const manualSlots = slots.filter((slot) => slot.kind === 'manual');
  const preview: CharacterCreationPreview = buildCharacterCreationPreview(form);
  const currentStep =
    CHARACTER_CREATION_STEPS.find((step) => step.id === currentStepId) ??
    CHARACTER_CREATION_STEPS[0]!;
  const currentStepValidation = validateCharacterCreationStep(form, currentStepId);
  const fullValidation = validateCharacterCreationForm(form);
  const currentStepIndex = CHARACTER_CREATION_STEPS.findIndex((step) => step.id === currentStepId);
  const nextStepId = getNextCharacterCreationStepId(currentStepId);
  const previousStepId = getPreviousCharacterCreationStepId(currentStepId);
  const selectedSlot = manualSlots.find((slot) => slot.id === form.saveSlotId) ?? manualSlots[0];
  const requiresOverwriteConfirmation =
    selectedSlot?.hasSave === true && pendingOverwriteSlotId === form.saveSlotId;

  const updateForm = (nextForm: Partial<CharacterCreationFormState>) => {
    setShowValidation(false);
    onChange(nextForm);
  };

  const handleContinue = () => {
    if (!currentStepValidation.isValid) {
      setShowValidation(true);
      return;
    }

    if (nextStepId) {
      setCurrentStepId(nextStepId);
      setShowValidation(false);
    }
  };

  const handleFinalize = () => {
    if (!fullValidation.isValid) {
      setShowValidation(true);
      setCurrentStepId('review');
      return;
    }

    onCreateGame();
  };

  let stepContent = (
    <Card title="Identity" accent="var(--color-character)">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Character Name
          </span>
          <input
            type="text"
            value={form.playerName}
            onChange={(event) => updateForm({ playerName: event.target.value })}
            placeholder="Enter a character name"
            className="w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-slate-50 outline-none transition focus:border-amber-300/30"
          />
          {showValidation && currentStepValidation.errors.playerName && (
            <div className="mt-2 text-sm text-rose-300">{currentStepValidation.errors.playerName}</div>
          )}
        </label>

        <div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">Sex Profile</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {(['male', 'female', 'neutral'] as const).map((sexId) => (
              <button
                key={sexId}
                type="button"
                onClick={() => updateForm({ sexId })}
                className={`${selectionButtonClass} ${
                  form.sexId === sexId
                    ? 'border-amber-300/25 bg-amber-200/10 text-amber-50'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="text-base font-semibold">{sexId[0]!.toUpperCase() + sexId.slice(1)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  if (currentStepId === 'lineage') {
    stepContent = (
      <Card title="Lineage" accent="var(--color-world)">
        {renderOptionGrid(
          lineageOptions,
          form.lineageId,
          (lineageId) => updateForm({ lineageId }),
          'border-cyan-300/25 bg-cyan-200/10 text-cyan-50'
        )}
      </Card>
    );
  } else if (currentStepId === 'class') {
    stepContent = (
      <Card title="Starting Path" accent="var(--color-activity)">
        {renderOptionGrid(
          classOptions,
          form.classId,
          (classId) => updateForm({ classId }),
          'border-orange-300/25 bg-orange-200/10 text-orange-50'
        )}
      </Card>
    );
  } else if (currentStepId === 'background') {
    stepContent = (
      <Card title="Background" accent="var(--color-codex)">
        {renderOptionGrid(
          backgroundOptions,
          form.backgroundId,
          (backgroundId) => updateForm({ backgroundId }),
          'border-[color:var(--color-codex)]/35 bg-[color:var(--color-codex)]/10 text-slate-100'
        )}
      </Card>
    );
  } else if (currentStepId === 'homeland') {
    stepContent = (
      <Card title="Starting Ground" accent="var(--color-world)">
        {renderOptionGrid(
          settlementOptions,
          form.startingSettlementId,
          (startingSettlementId) => updateForm({ startingSettlementId }),
          'border-emerald-300/25 bg-emerald-200/10 text-emerald-50'
        )}
      </Card>
    );
  } else if (currentStepId === 'review') {
    stepContent = (
      <div className="space-y-4">
        <Card title="Review The Starter State" accent="var(--color-character)">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Chosen Origin</div>
              <div className="mt-2 text-xl text-slate-50">{preview.chosenOrigin}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                {preview.backgroundLabel} starting from {preview.startingSettlement} in the {preview.startingRegion}.
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Save Slot</div>
              <div className="mt-2 text-xl text-slate-50">{selectedSlot?.label ?? form.saveSlotId}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                {selectedSlot?.hasSave
                  ? `${selectedSlot.playerName} currently occupies this slot and will need confirmation to overwrite.`
                  : selectedSlot?.status === 'corrupt'
                    ? 'Unreadable local data was found in this slot. Finalizing will replace it with the new campaign.'
                  : 'This slot is empty and ready for a new campaign.'}
              </div>
            </div>
          </div>

          {showValidation && !fullValidation.isValid && (
            <div className="mt-4 rounded-[20px] border border-rose-300/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              Complete the remaining required character fields before starting.
            </div>
          )}
        </Card>

        {requiresOverwriteConfirmation && (
          <Card title="Overwrite Confirmation" accent="var(--color-chronicle)">
            <div className="space-y-4">
              <div className="rounded-[20px] border border-rose-300/20 bg-rose-200/10 p-4 text-sm leading-6 text-rose-100">
                {selectedSlot?.label} already contains a saved character. Confirm only if you want to replace that
                local campaign.
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onConfirmOverwrite}
                  className="rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-50 transition hover:bg-rose-200/15"
                >
                  Confirm Overwrite
                </button>
                <button
                  type="button"
                  onClick={onCancelOverwrite}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Keep Existing Save
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <ScreenFrame
      eyebrow="Character Creation"
      title="Forge A New Character"
      description="Build a first-pass campaign state through a deterministic multi-step creator. Each choice updates the right-side summary immediately, and finalize writes a shared save snapshot that the existing in-game UI can render directly."
      accent="var(--color-character)"
      notice={notice}
      onDismissNotice={onDismissNotice}
      headerActions={
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Back
        </button>
      }
      mainContent={
        <div className="space-y-4">
          <Card title="Creation Steps" accent="var(--color-character)">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {CHARACTER_CREATION_STEPS.map((step, index) => {
                const isActive = step.id === currentStepId;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`rounded-[20px] border px-3 py-3 ${
                      isActive
                        ? 'border-amber-300/25 bg-amber-200/10'
                        : isCompleted
                          ? 'border-emerald-300/20 bg-emerald-200/10'
                          : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Step {index + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-50">{step.label}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-[20px] border border-white/10 bg-black/10 p-4 text-sm leading-7 text-slate-300">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{currentStep.label}</div>
              <div className="mt-2">{currentStep.description}</div>
            </div>
          </Card>

          {stepContent}

          <Card title="Navigation" accent="var(--color-character)">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => previousStepId && setCurrentStepId(previousStepId)}
                disabled={!previousStepId}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous Step
              </button>

              {currentStepId !== 'review' ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-full border border-amber-300/25 bg-amber-200/10 px-4 py-2 text-sm text-amber-50 transition hover:bg-amber-200/15"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalize}
                  disabled={requiresOverwriteConfirmation}
                  className="rounded-full border border-amber-300/25 bg-amber-200/10 px-4 py-2 text-sm text-amber-50 transition hover:bg-amber-200/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Finalize And Start Game
                </button>
              )}
            </div>
          </Card>
        </div>
      }
      sideContent={
        <div className="space-y-4">
          <Card title="Live Summary" accent="var(--color-world)">
            <div className="space-y-4">
              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Character Name</div>
                <div className="mt-2 text-xl text-slate-50">{preview.characterName}</div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Chosen Origin</div>
                <div className="mt-2 text-base text-slate-50">{preview.chosenOrigin}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  {preview.startingSettlement} | {preview.startingRegion}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {renderMetric('HP', preview.resourceMaxima.hp.toString())}
                {renderMetric('MP', preview.resourceMaxima.mp.toString())}
                {renderMetric('Stamina', preview.resourceMaxima.stamina.toString())}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {renderMetric('Strength', preview.attributes.STR.toString())}
                {renderMetric('Agility', preview.attributes.AGI.toString())}
                {renderMetric('Spirit', preview.attributes.SPT.toString())}
              </div>

              {renderTagBlock('Starting Skills', preview.starterSkills)}
              {renderTagBlock('Starting Traits', preview.starterTraits)}
              {renderTagBlock('Equipped Gear', preview.starterGear)}

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Wallet</div>
                <div className="mt-2 text-lg text-slate-50">{preview.walletLabel}</div>
              </div>

              {renderTagBlock('Starter Pack', preview.starterPack)}

              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Starter Notes</div>
                {preview.starterNotes.slice(0, 4).map((note) => (
                  <div
                    key={note}
                    className="rounded-[18px] border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 text-slate-300"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Save Slot" accent="var(--color-chronicle)">
            <div className="space-y-3">
              {manualSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => updateForm({ saveSlotId: slot.id })}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    slot.id === form.saveSlotId
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{slot.label}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {slot.hasSave ? 'Occupied' : slot.status === 'corrupt' ? 'Corrupt Data' : 'Empty'}
                      </div>
                    </div>
                    {slot.hasSave && <div className="text-xs text-slate-400">Lvl {slot.level}</div>}
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    {slot.hasSave
                      ? `${slot.playerName} | ${slot.lastSavedLabel}`
                      : slot.status === 'corrupt'
                        ? 'Unreadable local data will be replaced if you start here.'
                      : 'Recommended for a clean new campaign.'}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      }
    />
  );
}
