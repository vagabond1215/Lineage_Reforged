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
  getBackstoryOptionsForLineage,
  getBackstoryStartAccessProfileId,
  getLineageIdentityCatalog,
  lineageOptions,
  pathOptions
} from '../characterCreationCatalog.js';
import {
  buildCharacterCreationPreview,
  type CharacterCreationPreview
} from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import {
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions,
  resolveWorldSelection
} from '../worldSelectionCatalog.js';
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

function buildHeightChoices([minHeight, maxHeight]: [number, number]): number[] {
  const spread = maxHeight - minHeight;
  const rawChoices = [
    minHeight,
    Math.round(minHeight + spread * 0.25),
    Math.round(minHeight + spread * 0.5),
    Math.round(minHeight + spread * 0.75),
    maxHeight
  ];

  return Array.from(new Set(rawChoices)).sort((left, right) => left - right);
}

function renderMetricList(
  title: string,
  metrics: Array<{ id: string; label: string; value: string | null }>
) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</div>
      <div className="mt-3 space-y-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="text-sm text-slate-300">{metric.label}</div>
            <div className="text-base font-semibold text-slate-50">{metric.value ?? 'Pending'}</div>
          </div>
        ))}
      </div>
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

function renderIdentityGrid(
  title: string,
  options: Array<{ id: string; label: string; description: string }>,
  selectedId: string,
  onSelect: (id: string) => void,
  activeClassName: string
) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</div>
      <div className="grid gap-3 sm:grid-cols-2">
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
          </button>
        ))}
      </div>
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
  const [currentStepId, setCurrentStepId] = useState<CharacterCreationStepId>('lineage');
  const [showValidation, setShowValidation] = useState(false);
  const manualSlots = slots.filter((slot) => slot.kind === 'manual');
  const preview: CharacterCreationPreview = buildCharacterCreationPreview(form);
  const identityCatalog = getLineageIdentityCatalog(form.lineageId);
  const backstoryOptions = getBackstoryOptionsForLineage(form.lineageId);
  const continentOptions = getWorldContinentOptions().map((option) => ({
    id: option.id,
    label: option.label,
    description: `${option.survivabilityLabel} survivability | ${option.description}`,
    notes: [
      option.climate,
      option.dominantResources.join(', '),
      option.tradeCharacteristics.join(', ')
    ].filter((value) => value.length > 0)
  }));
  const regionOptions = getWorldRegionOptions(form.continentId).map((option) => ({
    id: option.id,
    label: option.label,
    description: `${option.terrainAndBiome} | ${option.description}`,
    notes: [
      option.populationDensity,
      option.resourceAvailability.join(', '),
      option.economicProfile.join(', ')
    ].filter((value) => value.length > 0)
  }));
  const settlementOptions = getWorldSettlementOptions({
    continentId: form.continentId,
    regionId: form.regionId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  }).map((option) => ({
    id: option.id,
    label: option.label,
    description: `${option.settlementType} | Pop ${option.populationSize} | ${option.description}`,
    notes: [
      `${option.tradeRole} | ${option.developmentLevel}`,
      option.dominantIndustries.join(', '),
      option.access.accessStatus === 'allowed' ? option.access.lodgingType : option.access.notes[0] ?? 'Restricted'
    ]
  }));
  const selectedWorld = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  });
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

  const updateLineage = (lineageId: string) => {
    updateForm({
      lineageId,
      heightCm: null,
      buildId: '',
      hairColorId: '',
      hairHighlightColorId: '',
      eyeColorId: '',
      skinToneId: '',
      backgroundId: '',
      startingSettlementId: ''
    });
  };

  const updateContinent = (continentId: string) => {
    updateForm({
      continentId,
      regionId: '',
      startingSettlementId: ''
    });
  };

  const updateRegion = (regionId: string) => {
    updateForm({
      regionId,
      startingSettlementId: ''
    });
  };

  const updatePath = (classId: string) => {
    updateForm({
      classId,
      startingSettlementId: ''
    });
  };

  const updateBackstory = (backgroundId: string) => {
    updateForm({
      backgroundId,
      startingSettlementId: ''
    });
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
    <Card title="Lineage" accent="var(--color-world)">
      {renderOptionGrid(
        lineageOptions,
        form.lineageId,
        (lineageId) => updateLineage(lineageId),
        'border-cyan-300/25 bg-cyan-200/10 text-cyan-50'
      )}
      {showValidation && currentStepValidation.errors.lineageId && (
        <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.lineageId}</div>
      )}
    </Card>
  );

  if (currentStepId === 'lineage') {
    stepContent = (
      <Card title="Lineage" accent="var(--color-world)">
        {renderOptionGrid(
          lineageOptions,
          form.lineageId,
          (lineageId) => updateLineage(lineageId),
          'border-cyan-300/25 bg-cyan-200/10 text-cyan-50'
        )}
        {showValidation && currentStepValidation.errors.lineageId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.lineageId}</div>
        )}
      </Card>
    );
  } else if (currentStepId === 'identity') {
    stepContent = (
      <Card title="Identity" accent="var(--color-character)">
        {identityCatalog ? (
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
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">Sex</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['male', 'female'] as const).map((sexId) => (
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
              {showValidation && currentStepValidation.errors.sexId && (
                <div className="mt-2 text-sm text-rose-300">{currentStepValidation.errors.sexId}</div>
              )}
            </div>

            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Height Range
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {buildHeightChoices(identityCatalog.heightRangeCm).map((heightCm) => (
                  <button
                    key={heightCm}
                    type="button"
                    onClick={() => updateForm({ heightCm })}
                    className={`${selectionButtonClass} ${
                      form.heightCm === heightCm
                        ? 'border-amber-300/25 bg-amber-200/10 text-amber-50'
                        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-base font-semibold">{heightCm} cm</div>
                    <div className="mt-2 text-sm leading-6 text-white/75">
                      {heightCm <= identityCatalog.heightRangeCm[0] + 3
                        ? 'Shortest profile'
                        : heightCm >= identityCatalog.heightRangeCm[1] - 3
                          ? 'Tallest profile'
                          : 'Within lineage norm'}
                    </div>
                  </button>
                ))}
              </div>
              {showValidation && currentStepValidation.errors.heightCm && (
                <div className="mt-2 text-sm text-rose-300">{currentStepValidation.errors.heightCm}</div>
              )}
            </div>

            {renderIdentityGrid(
              'Build',
              identityCatalog.buildOptions,
              form.buildId,
              (buildId) => updateForm({ buildId }),
              'border-amber-300/25 bg-amber-200/10 text-amber-50'
            )}
            {showValidation && currentStepValidation.errors.buildId && (
              <div className="-mt-1 text-sm text-rose-300">{currentStepValidation.errors.buildId}</div>
            )}

            {renderIdentityGrid(
              'Skin Tone',
              identityCatalog.skinToneOptions,
              form.skinToneId,
              (skinToneId) => updateForm({ skinToneId }),
              'border-amber-300/25 bg-amber-200/10 text-amber-50'
            )}
            {showValidation && currentStepValidation.errors.skinToneId && (
              <div className="-mt-1 text-sm text-rose-300">{currentStepValidation.errors.skinToneId}</div>
            )}

            {renderIdentityGrid(
              'Hair Color',
              identityCatalog.hairColorOptions,
              form.hairColorId,
              (hairColorId) => updateForm({ hairColorId }),
              'border-amber-300/25 bg-amber-200/10 text-amber-50'
            )}
            {showValidation && currentStepValidation.errors.hairColorId && (
              <div className="-mt-1 text-sm text-rose-300">{currentStepValidation.errors.hairColorId}</div>
            )}

            <div className="space-y-3">
              {renderIdentityGrid(
                'Hair Highlights',
                identityCatalog.hairHighlightOptions,
                form.hairHighlightColorId,
                (hairHighlightColorId) => updateForm({ hairHighlightColorId }),
                'border-amber-300/25 bg-amber-200/10 text-amber-50'
              )}
              <button
                type="button"
                onClick={() => updateForm({ hairHighlightColorId: '' })}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Clear Highlights
              </button>
              {showValidation && currentStepValidation.errors.hairHighlightColorId && (
                <div className="text-sm text-rose-300">{currentStepValidation.errors.hairHighlightColorId}</div>
              )}
            </div>

            {renderIdentityGrid(
              'Eye Color',
              identityCatalog.eyeColorOptions,
              form.eyeColorId,
              (eyeColorId) => updateForm({ eyeColorId }),
              'border-amber-300/25 bg-amber-200/10 text-amber-50'
            )}
            {showValidation && currentStepValidation.errors.eyeColorId && (
              <div className="-mt-1 text-sm text-rose-300">{currentStepValidation.errors.eyeColorId}</div>
            )}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center text-sm text-slate-400">
            Choose a lineage first to unlock race-valid identity options.
          </div>
        )}
      </Card>
    );
  } else if (currentStepId === 'backstory') {
    stepContent = (
      <Card title="Backstory" accent="var(--color-codex)">
        {renderOptionGrid(
          backstoryOptions,
          form.backgroundId,
          (backgroundId) => updateBackstory(backgroundId),
          'border-[color:var(--color-codex)]/35 bg-[color:var(--color-codex)]/10 text-slate-100'
        )}
        {showValidation && currentStepValidation.errors.backgroundId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.backgroundId}</div>
        )}
      </Card>
    );
  } else if (currentStepId === 'path') {
    stepContent = (
      <Card title="Path" accent="var(--color-activity)">
        {renderOptionGrid(
          pathOptions,
          form.classId,
          (classId) => updatePath(classId),
          'border-orange-300/25 bg-orange-200/10 text-orange-50'
        )}
        {showValidation && currentStepValidation.errors.classId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.classId}</div>
        )}
      </Card>
    );
  } else if (currentStepId === 'continent') {
    stepContent = (
      <Card title="Continent" accent="var(--color-world)">
        {renderOptionGrid(
          continentOptions,
          form.continentId,
          (continentId) => updateContinent(continentId),
          'border-emerald-300/25 bg-emerald-200/10 text-emerald-50'
        )}
        {showValidation && currentStepValidation.errors.continentId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.continentId}</div>
        )}
      </Card>
    );
  } else if (currentStepId === 'region') {
    stepContent = (
      <Card title="Region" accent="var(--color-world)">
        {renderOptionGrid(
          regionOptions,
          form.regionId,
          (regionId) => updateRegion(regionId),
          'border-emerald-300/25 bg-emerald-200/10 text-emerald-50'
        )}
        {showValidation && currentStepValidation.errors.regionId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.regionId}</div>
        )}
      </Card>
    );
  } else if (currentStepId === 'settlement') {
    stepContent = (
      <Card title="Settlement" accent="var(--color-world)">
        {renderOptionGrid(
          settlementOptions,
          form.startingSettlementId,
          (startingSettlementId) => updateForm({ startingSettlementId }),
          'border-emerald-300/25 bg-emerald-200/10 text-emerald-50'
        )}
        {selectedWorld && (
          <div className="mt-4 rounded-[20px] border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Start Access</div>
            <div className="mt-2 text-slate-100">
              {selectedWorld.settlement.access.accessStatus === 'allowed' ? 'Allowed' : 'Restricted'}
            </div>
            <div className="mt-2">{selectedWorld.settlement.access.notes[0] ?? 'Standard rented arrival.'}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              Authority: {selectedWorld.settlement.landAuthorityType.replace(/_/g, ' ')}
            </div>
          </div>
        )}
        {showValidation && currentStepValidation.errors.startingSettlementId && (
          <div className="mt-3 text-sm text-rose-300">{currentStepValidation.errors.startingSettlementId}</div>
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
                {preview.isResolved && preview.backgroundLabel && preview.pathLabel && preview.startingSettlement && preview.startingRegion && preview.startingContinent
                  ? `${preview.backgroundLabel} entering ${preview.startingSettlement} in ${preview.startingRegion}, following the ${preview.pathLabel} path.`
                  : 'Choose the remaining lineage, identity, origin, and world fields to generate the opening state.'}
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
      description="Build a first-pass campaign state through lineage, visual identity, backstory, path, and legal world-start selection. Each choice updates the right-side summary immediately, and finalize writes a shared save snapshot that the existing in-game UI can render directly."
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
            <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
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
                  {preview.isResolved && preview.startingSettlement && preview.startingRegion && preview.startingContinent
                    ? `${preview.startingSettlement} | ${preview.startingRegion} | ${preview.startingContinent}`
                    : 'Lineage, backstory, path, and legal start will appear here once selected.'}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Starting Access</div>
                <div className="mt-2 text-base text-slate-50">{preview.startingAccessLabel}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{preview.startingAccessDetail}</div>
              </div>

              {renderMetricList('Identity', preview.identityMetrics)}
              {renderMetricList('Starter Resources', preview.resourceMetrics)}
              {renderMetricList('Starter Attributes', preview.attributeMetrics)}

              {preview.isResolved && preview.starterSkills.length > 0 && renderTagBlock('Starting Skills', preview.starterSkills)}
              {preview.isResolved && preview.starterTraits.length > 0 && renderTagBlock('Starting Traits', preview.starterTraits)}
              {preview.isResolved && preview.starterGear.length > 0 && renderTagBlock('Equipped Gear', preview.starterGear)}

              {preview.isResolved && preview.walletLabel && (
                <div className="rounded-[20px] border border-white/10 bg-black/10 p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Wallet</div>
                  <div className="mt-2 text-lg text-slate-50">{preview.walletLabel}</div>
                </div>
              )}

              {preview.isResolved && preview.starterPack.length > 0 && renderTagBlock('Starter Pack', preview.starterPack)}

              {preview.isResolved && preview.starterNotes.length > 0 && (
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
              )}
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
