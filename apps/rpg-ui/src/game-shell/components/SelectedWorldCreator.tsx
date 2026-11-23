import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CHARACTER_ATTRIBUTE_PRESENTATIONS } from '../characterAttributes.js';
import {
  generateRandomCharacterName, getLineageCardArt, getLineageIdentityCatalog,
  getSexOptionForLineage, lineageOptions, type IdentityPaletteOption
} from '../characterCreationCatalog.js';
import {
  getContinentCardArt, getRegionCardArt, getSettlementCardArt, getWorldContinentOptions,
  getWorldRegionOptions, getWorldSettlementOptions
} from '../worldSelectionCatalog.js';
import {
  attributeGroups, creatorStages, defaultEntryIdentity, entryProfilePoints, selectedEntryStats,
  type EntryIdentity, type EntryScenario
} from '../selectedWorldEntryReview.js';
import { entryAptitudes, entryBuilds, entryConditions, entryScenarios } from '../selectedWorldEntryReviewCatalog.js';
import type { GameShellNotice } from '../state.js';
import type { SelectedWorld } from '../worldPresentationState.js';
import { ShellSubBar } from './AppShell.js';
import { NoticeBanner } from './NoticeBanner.js';
import './selected-world-creator.css';

type Props = {
  world: SelectedWorld;
  busy: boolean;
  notice: GameShellNotice | null;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onBack: () => void;
  onSignOut: () => void;
};

type Color = { id: string; saturation: number; brightness: number };
type Palette = { key: 'skin' | 'hair' | 'eyes'; label: string; options: IdentityPaletteOption[] };
type Geography = { continent: string; region: string; settlement: string };
type ReviewChoice = 'a' | 'b';
type ConditionGroup = keyof typeof entryConditions;

const dispositions = ['', 'Curious', 'Gentle', 'Resolute', 'Reserved'];
const emptyGeography = { continent: '', region: '', settlement: '' };
const continents = getWorldContinentOptions();
const ordinaryEntries = entryScenarios.filter(entry => entry.pool === 'ordinary');
const wildernessEntries = entryScenarios.filter(entry => entry.pool === 'wilderness');

function freshColor(id = ''): Color {
  return { id, saturation: 100, brightness: 100 };
}

function initialColors() {
  return { skin: freshColor(), hair: freshColor(), eyes: freshColor() };
}

function pick<T>(options: readonly T[]) {
  return options[Math.floor(Math.random() * options.length)]!;
}

function pickDifferent<T extends { id: string }>(options: readonly T[], current?: string): T {
  const alternatives = options.filter(option => option.id !== current);
  return pick(alternatives.length ? alternatives : options);
}

function rollName(lineageId: string, sex: EntryIdentity['sex']) {
  const [firstName = '', ...surname] = generateRandomCharacterName(lineageId, sex).trim().split(/\s+/);
  return { firstName, lastName: surname.join(' ') };
}

function rollIdentity(lineageId: string) {
  const catalog = getLineageIdentityCatalog(lineageId)!;
  const sexes = ['male', 'female'] as const;
  return {
    traits: { sex: pick(sexes), age: pick(catalog.ageBands).id, height: pick(catalog.heightBands).id,
      build: pick(entryBuilds), aptitude: pick(entryAptitudes), disposition: pick(dispositions) },
    colors: { skin: freshColor(pick(catalog.skinToneOptions).id), hair: freshColor(pick(catalog.hairColorOptions).id),
      eyes: freshColor(pick(catalog.eyeColorOptions).id) }
  };
}

let startingLocations: Geography[] | undefined;
function rollStartingLocation(): Geography {
  startingLocations ??= continents.flatMap(({ id: continent }) =>
    getWorldRegionOptions(continent).flatMap(({ id: region }) =>
      getWorldSettlementOptions({ continentId: continent, regionId: region, backstoryId: '' })
        .map(({ id: settlement }) => ({ continent, region, settlement }))));
  return pick(startingLocations);
}

function formatPoints(points: Record<string, number>) {
  return Object.entries(points).filter(([, value]) => value !== 0)
    .map(([key, value]) => `${value > 0 ? '+' : ''}${value} ${key}`).join(' · ') || 'No generated points';
}

function OptionRow<T extends { id: string; label: string }>({ label, options, value, detail, delta, onPick, grid }:
  { label: string; options: readonly T[]; value: T; detail: string; delta: (option: T) => string;
    onPick: (option: T) => void; grid?: boolean }) {
  return <div className="swc-row" role="group" aria-label={label}>
    <span className="swc-row-label" aria-hidden="true">{label}</span>
    <div className={grid ? 'swc-options swc-options-grid' : 'swc-options'}>
      {options.map(option => <button key={option.id} type="button" aria-label={option.label} aria-pressed={value.id === option.id}
        onClick={() => onPick(option)}>
        {option.label}{grid && <small className="swc-option-delta">{delta(option)}</small>}
      </button>)}
    </div>
    <div className="swc-detail"><p>{detail}</p><strong>{delta(value)}</strong></div>
  </div>;
}

function Attributes({ stats }: { stats: ReturnType<typeof selectedEntryStats> }) {
  return <div className="swc-attributes" aria-label="Preview attributes">
    {Object.entries(attributeGroups).map(([group, keys]) => <div key={group}>
      <h3>{group}</h3>
      <dl>{keys.map(key => <div key={key}>
        <dt><abbr title={CHARACTER_ATTRIBUTE_PRESENTATIONS[key].fullName}>{key}</abbr></dt>
        <dd>{stats.attributes[key]}</dd>
      </div>)}</dl>
    </div>)}
  </div>;
}

function ArtCard({ label, description, meta, art, selected, landscape, showDetail, disabled, onPick, onAdvance, onClear }:
  { label: string; description: string; meta?: string; landscape: boolean; selected: boolean;
    art: { imageUrl: string; backgroundPosition?: string; selectedImageUrl?: string; selectedBackgroundPosition?: string } | null;
    showDetail: boolean; disabled: boolean; onPick: () => void; onAdvance: () => void; onClear?: () => void }) {
  const summary = selected && showDetail ? [meta, description].filter(Boolean).join('. ') : meta;
  return <article className={landscape ? 'swc-card swc-landscape' : 'swc-card swc-lineage'} data-selected={selected}
    onDoubleClick={event => { if (!(event.target as HTMLElement).closest('.swc-card-next, .swc-card-clear')) onAdvance(); }}>
    <button type="button" className="swc-card-target" aria-label={label} aria-description={summary}
      aria-pressed={selected} disabled={disabled}
      onClick={event => { if (event.detail < 2) onPick(); }} />
    <div className="swc-card-art">
      <span aria-hidden="true">{label.slice(0, 1)}</span>
      {art && <img src={(selected && art.selectedImageUrl) || art.imageUrl} alt="" loading="lazy"
        style={{ objectPosition: (selected && art.selectedBackgroundPosition) || art.backgroundPosition }} />}
      {selected && (onClear
        ? <button type="button" className="swc-card-check swc-card-clear"
            aria-label={`Clear ${label} selection`} title={`Clear ${label} selection`}
            disabled={disabled} onClick={onClear}>✓</button>
        : <span className="swc-card-check" aria-hidden="true">✓</span>)}
      {selected && showDetail && description && <div className="swc-card-description"
        tabIndex={0} role="region" aria-label={`${label} description`}>
        {description}
      </div>}
    </div>
    <div className="swc-card-copy">
      <div className="swc-card-name"><strong>{label}</strong>{meta && <small>{meta}</small>}</div>
      {selected && <button type="button" className="swc-card-next" aria-label={`Next from ${label}`}
        disabled={disabled} onClick={onAdvance}>Next</button>}
    </div>
  </article>;
}

export function SelectedWorldCreator({ world, busy, notice, themeMode, onToggleTheme, onBack, onSignOut }: Props) {
  const [identity, setIdentity] = useState(defaultEntryIdentity);
  const [colors, setColors] = useState(initialColors);
  const [geography, setGeography] = useState<Geography>(emptyGeography);
  const [stage, setStage] = useState(0);
  const [railExpanded, setRailExpanded] = useState(true);
  const [showDetail, setShowDetail] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [validation, setValidation] = useState(false);
  const [pool, setPool] = useState<'ordinary' | 'wilderness'>('ordinary');
  const [scenario, setScenario] = useState<EntryScenario | null>(null);
  const [wildernessDraft, setWildernessDraft] = useState<EntryScenario | null>(null);
  const [summaryReviewed, setSummaryReviewed] = useState(false);
  const [decision, setDecision] = useState<ReviewChoice | null>(null);
  const [condition, setCondition] = useState({ negative: '', positive: '' });
  const [portraitPrompt, setPortraitPrompt] = useState(false);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const firstNameInput = useRef<HTMLInputElement>(null);
  const lastNameInput = useRef<HTMLInputElement>(null);
  const mainPane = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuFirstAction = useRef<HTMLButtonElement>(null);
  const validationAlert = useRef<HTMLParagraphElement>(null);
  const decisionStatus = useRef<HTMLDivElement>(null);
  const firstChoice = useRef<HTMLButtonElement>(null);
  const restoreChoiceFocus = useRef(false);

  const missingFirstName = !identity.firstName.trim();
  const missingLastName = !identity.lastName.trim();

  useLayoutEffect(() => {
    if (mainPane.current) mainPane.current.scrollTop = 0;
    stageHeading.current?.focus({ preventScroll: true });
  }, [stage]);
  useLayoutEffect(() => {
    if (!menuOpen) return;
    menuFirstAction.current?.focus();
    const dismissOutside = (event: PointerEvent) => {
      if (menu.current?.contains(event.target as Node)) return;
      if (menu.current?.contains(document.activeElement)) menuTrigger.current?.focus();
      setMenuOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setMenuOpen(false);
      menuTrigger.current?.focus();
    };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [menuOpen]);
  useLayoutEffect(() => {
    if (decision) decisionStatus.current?.focus();
    else if (restoreChoiceFocus.current) firstChoice.current?.focus();
    restoreChoiceFocus.current = false;
  }, [decision]);

  const name = [identity.firstName.trim(), identity.lastName.trim()].filter(Boolean).join(' ') || 'Unnamed Wanderer';
  const catalog = useMemo(() => getLineageIdentityCatalog(identity.lineageId)!, [identity.lineageId]);
  const palettes: Palette[] = [
    { key: 'skin', label: 'Skin', options: catalog.skinToneOptions },
    { key: 'hair', label: 'Hair', options: catalog.hairColorOptions },
    { key: 'eyes', label: 'Eyes', options: catalog.eyeColorOptions }
  ];
  const selectedColor = (palette: Palette) =>
    palette.options.find(option => option.id === colors[palette.key].id) ?? palette.options[0]!;
  const colorSummary = palettes.map(palette => `${selectedColor(palette).label} ${palette.label.toLowerCase()}`).join(' · ');
  const sexOptions = [getSexOptionForLineage(identity.lineageId, 'male'),
    getSexOptionForLineage(identity.lineageId, 'female')];
  const sex = sexOptions.find(item => item.id === identity.sex)!;
  const age = catalog.ageBands.find(item => item.id === identity.age)!;
  const height = catalog.heightBands.find(item => item.id === identity.height)!;
  const stats = selectedEntryStats(identity);
  const regions = useMemo(() => getWorldRegionOptions(geography.continent), [geography.continent]);
  const settlements = useMemo(() => getWorldSettlementOptions({
    continentId: geography.continent, regionId: geography.region, backstoryId: ''
  }), [geography.continent, geography.region]);
  const continent = continents.find(item => item.id === geography.continent);
  const region = regions.find(item => item.id === geography.region);
  const settlement = settlements.find(item => item.id === geography.settlement);

  const blockers = [
    '',
    missingFirstName && missingLastName ? 'Enter a first and last name before continuing.'
      : missingFirstName ? 'Enter a first name before continuing.'
      : missingLastName ? 'Enter a last name before continuing.' : '',
    continent ? '' : 'Choose a continent before continuing.',
    region ? '' : 'Choose a region before continuing.',
    settlement ? '' : 'Choose an authored settlement before continuing.',
    scenario?.pool === 'ordinary' && pool === 'ordinary' ? '' : 'Choose an Ordinary Core opening before continuing.',
    summaryReviewed ? '' : 'Review the character summary first.'
  ];
  const canVisit = (target: number) => blockers.slice(0, target).every(message => !message);
  const showValidation = () => {
    setValidation(true);
    if (stage === 1) (missingFirstName ? firstNameInput : lastNameInput).current?.focus();
    else validationAlert.current?.focus();
  };
  useLayoutEffect(() => {
    if (validation && stage !== 1) validationAlert.current?.focus();
  }, [validation, stage]);
  const enterStage = (target: number) => {
    setValidation(false);
    setStage(target);
    if (target === 6) setSummaryReviewed(true);
  };
  const navigate = (target: number) => {
    if (canVisit(target)) enterStage(target);
    else showValidation();
  };
  // A source-backed tile supplies the current stage selection in the same event as navigation.
  const advanceFromCard = (select: () => void) => {
    if (busy || !canVisit(stage)) return;
    select();
    enterStage(stage + 1);
  };
  const invalidateOpening = () => {
    setSummaryReviewed(false);
    setDecision(null);
  };
  const clearScenario = () => {
    setScenario(null);
    setWildernessDraft(null);
    invalidateOpening();
  };
  const changeIdentity = (patch: Partial<EntryIdentity>) => {
    setIdentity(previous => ({ ...previous, ...patch }));
    setPortraitPrompt(false);
    invalidateOpening();
  };
  const changeLineage = (id: string) => {
    if (identity.lineageId === id) return;
    changeIdentity({ lineageId: id });
    setColors(initialColors());
  };
  const selectOrdinaryScenario = (entry: EntryScenario) => {
    setPool('ordinary');
    setWildernessDraft(null);
    setScenario(entry);
    invalidateOpening();
    setValidation(false);
  };
  const changeGeography = (key: keyof Geography, id: string) => {
    if (geography[key] === id) return;
    if (key === 'continent') setGeography({ ...emptyGeography, continent: id });
    else if (key === 'region') setGeography({ ...geography, region: id, settlement: '' });
    else setGeography({ ...geography, settlement: id });
    clearScenario();
    setPool('ordinary');
    setValidation(false);
  };
  const randomizeName = () => {
    changeIdentity(rollName(identity.lineageId, identity.sex));
    setValidation(false);
  };
  const randomizeIdentity = () => {
    const rolled = rollIdentity(identity.lineageId);
    changeIdentity(rolled.traits);
    setColors(rolled.colors);
  };
  const randomizeAll = () => {
    const lineageId = pickDifferent(lineageOptions, identity.lineageId).id;
    const rolled = rollIdentity(lineageId);
    const location = rollStartingLocation();
    setIdentity({ ...defaultEntryIdentity, lineageId, ...rolled.traits, ...rollName(lineageId, rolled.traits.sex) });
    setColors(rolled.colors);
    setGeography(location);
    setCondition({ negative: '', positive: '' });
    setPortraitPrompt(false);
    selectOrdinaryScenario(pick(ordinaryEntries));
    // A changed draft must pass through Summary again before making an Opening decision.
    if (stage === 7) enterStage(6);
  };
  const randomizers = [
    () => changeLineage(pickDifferent(lineageOptions, identity.lineageId).id),
    randomizeIdentity,
    () => changeGeography('continent', pickDifferent(continents, geography.continent).id),
    regions.length ? () => changeGeography('region', pickDifferent(regions, geography.region).id) : null,
    settlements.length ? () => changeGeography('settlement', pickDifferent(settlements, geography.settlement).id) : null,
    () => selectOrdinaryScenario(pickDifferent(ordinaryEntries, scenario?.id))
  ];
  const contextualRandomizer = randomizers[stage];
  const updateColor = (key: Palette['key'], patch: Partial<Color>) => {
    setColors(previous => ({ ...previous, [key]: { ...previous[key], ...patch } }));
    setPortraitPrompt(false);
    invalidateOpening();
  };

  const portrait = (inline: boolean) => <section className={`swc-panel swc-portrait ${inline ? 'is-inline' : ''}`}
    aria-label="Character portrait preview">
    <div className="swc-portrait-art" role="img" aria-label="Illustrative character silhouette" />
    <div><h2>{name}</h2><p>{catalog.lineageLabel} · {age.label} · {identity.build.label}</p>
      {inline && <>
        <button type="button" aria-expanded={portraitPrompt} onClick={() => setPortraitPrompt(!portraitPrompt)}>
          {portraitPrompt ? 'Hide portrait prompt' : 'Generate portrait prompt'}
        </button>
        {portraitPrompt && <label className="swc-prompt">Portrait prompt
          <textarea readOnly value={`Grounded medieval fantasy portrait of ${name}, a ${height.label.toLowerCase()}, ${identity.build.label.toLowerCase()} adult ${catalog.lineageLabel} ${sex.label.toLowerCase()}, ${age.label.toLowerCase()}, ${colorSummary}.${identity.disposition ? ` Expression: ${identity.disposition.toLowerCase()}.` : ''} Head and shoulders, natural lighting.`} />
        </label>}
      </>}
    </div>
  </section>;

  let body: ReactNode;
  switch (creatorStages[stage]) {
    case 'Lineage':
      body = <div className="swc-lineage-grid" role="group" aria-label="Playable lineages">{lineageOptions.map(option =>
        <ArtCard key={option.id} label={option.label} description={option.description} showDetail={showDetail}
          art={getLineageCardArt(option.id)} landscape={false} selected={identity.lineageId === option.id}
          disabled={busy || !canVisit(stage)} onPick={() => changeLineage(option.id)}
          onAdvance={() => advanceFromCard(() => changeLineage(option.id))} />)}</div>;
      break;
    case 'Identity':
      body = <>
        <section className="swc-panel swc-identity" aria-label="Identity controls">
          <div className="swc-row swc-name-row" role="group" aria-label="Name">
            <span className="swc-row-label" aria-hidden="true">Name</span>
            <div className="swc-name-inputs">
              <input ref={firstNameInput} aria-label="First name" placeholder="First name" maxLength={40} required
                aria-invalid={validation && missingFirstName}
                aria-describedby={validation && missingFirstName ? 'swc-validation' : undefined}
                value={identity.firstName} onChange={event => changeIdentity({ firstName: event.target.value })} />
              <input ref={lastNameInput} aria-label="Last name" placeholder="Last name" maxLength={40} required
                aria-invalid={validation && missingLastName}
                aria-describedby={validation && missingLastName ? 'swc-validation' : undefined}
                value={identity.lastName} onChange={event => changeIdentity({ lastName: event.target.value })} />
              <button type="button" aria-label="Randomize first and last name only" onClick={randomizeName}>⚄</button>
            </div>
          </div>
          <OptionRow label="Sex" options={sexOptions} value={sex} detail={sex.description}
            delta={item => item.modifierText} onPick={item => changeIdentity({ sex: item.id })} />
          <OptionRow label="Age" options={catalog.ageBands} value={age} detail={age.description}
            delta={item => item.modifierText} onPick={item => changeIdentity({ age: item.id })} />
          <OptionRow label="Height" options={catalog.heightBands} value={height} detail={height.description}
            delta={item => item.modifierText} onPick={item => changeIdentity({ height: item.id })} />
          <OptionRow label="Build" options={entryBuilds} value={identity.build} detail={identity.build.desc} grid
            delta={item => formatPoints(entryProfilePoints(item, identity.aptitude).physical)}
            onPick={item => changeIdentity({ build: item })} />
          <OptionRow label="Aptitude" options={entryAptitudes} value={identity.aptitude} detail={identity.aptitude.desc} grid
            delta={item => `${item.physical} Physical / ${item.mind} Mind · ${formatPoints(entryProfilePoints(identity.build, item).mind)}`}
            onPick={item => changeIdentity({ aptitude: item })} />
          <p className="swc-inset" data-swc-detail>Preview attributes use a 90-point lineage and identity base plus 10 generated points.
            Power {stats.generated.power} · Prowess {stats.generated.prowess} · Mind {identity.aptitude.mind}</p>
          <section aria-label="Conditions">
            <h2>Conditions</h2>
            <p>Inspect proposed effects. Condition eligibility and gameplay effects are pending.</p>
            {(['negative', 'positive'] as const).map((group: ConditionGroup) => {
              const inspected = entryConditions[group].find(item => item.id === condition[group]);
              return <div className="swc-row" key={group} role="group"
                aria-label={group === 'negative' ? 'Negative conditions' : 'Positive conditions'}>
                <span className="swc-row-label" aria-hidden="true">{group}</span>
                <div className="swc-options">{entryConditions[group].map(item =>
                  <button type="button" key={item.id} aria-pressed={inspected?.id === item.id}
                    onClick={() => setCondition(previous => ({ ...previous, [group]: inspected?.id === item.id ? '' : item.id }))}>
                    {item.name}</button>)}</div>
                <div className="swc-detail" aria-live="polite">{inspected ? <>
                  <strong>{inspected.name}</strong><p>{inspected.text}</p><p>{inspected.line}</p>
                  <p>{inspected.stats}</p><small>{inspected.dependency} · {inspected.conflicts}</small>
                </> : <p>Choose a condition to inspect.</p>}</div>
              </div>;
            })}
          </section>
          <details className="swc-inset"><summary>Disposition</summary>
            <label>Portrayal <select value={identity.disposition}
              onChange={event => changeIdentity({ disposition: event.target.value })}>
              {dispositions.map(value =>
                <option key={value} value={value}>{value || 'Not set'}</option>)}
            </select></label>
          </details>
          {palettes.map(palette => {
            const tone = colors[palette.key];
            return <div className="swc-row swc-palette" key={palette.key} role="group" aria-label={`${palette.label} color options`}>
              <span className="swc-row-label" aria-hidden="true">{palette.label}</span>
              <div><strong>{selectedColor(palette).label}</strong>
                <div className="swc-swatches">{palette.options.map(option => <button key={option.id} type="button"
                  className="swc-swatch" aria-label={`${palette.label} ${option.label}`} title={option.label}
                  aria-pressed={selectedColor(palette).id === option.id}
                  onClick={() => updateColor(palette.key, { id: option.id })}>
                  <span style={{ background: option.swatch?.background,
                    filter: `saturate(${tone.saturation}%) brightness(${tone.brightness}%)` }} />
                </button>)}</div>
                <div className="swc-tone">
                  <label>Saturation <input type="range" aria-label={`${palette.label} saturation`} min={45} max={145}
                    value={tone.saturation} onChange={event => updateColor(palette.key, { saturation: event.target.valueAsNumber })} /></label>
                  <label>Brightness <input type="range" aria-label={`${palette.label} brightness`} min={55} max={145}
                    value={tone.brightness} onChange={event => updateColor(palette.key, { brightness: event.target.valueAsNumber })} /></label>
                  <button type="button" onClick={() => updateColor(palette.key, freshColor(tone.id))}>Reset {palette.label.toLowerCase()} tone</button>
                </div>
              </div>
            </div>;
          })}
          <details className="swc-inset" data-swc-detail><summary>Attribute guide</summary><dl className="swc-guide">
            {Object.values(attributeGroups).flat().map(key => <div key={key}>
              <dt>{CHARACTER_ATTRIBUTE_PRESENTATIONS[key].fullName} · {stats.attributes[key]}</dt>
              <dd>{CHARACTER_ATTRIBUTE_PRESENTATIONS[key].compactMeaning}</dd>
            </div>)}</dl>
          </details>
        </section>
        {portrait(true)}
      </>;
      break;
    case 'Continent':
    case 'Region':
    case 'Settlement': {
      const level = creatorStages[stage];
      const cards = level === 'Continent'
        ? continents.map(item => ({ ...item, meta: item.climate.replace(/_/g, ' '), art: getContinentCardArt(item.id) }))
        : level === 'Region'
          ? regions.map(item => ({ ...item, meta: item.terrainAndBiome.replace(/_/g, ' '), art: getRegionCardArt(item.id) }))
          : settlements.map(item => ({ ...item, meta: item.settlementType, art: getSettlementCardArt(item.id) }));
      const key = level.toLowerCase() as keyof Geography;
      body = <>
        {level !== 'Continent' && <p className="swc-parent">{level === 'Region' ? continent?.label : region?.label}</p>}
        {cards.length ? <div className="swc-geo-grid" role="group" aria-label={`${level} selections`}>{cards.map(item =>
          <ArtCard key={item.id} label={item.label} description={item.description} meta={item.meta} art={item.art}
            landscape selected={geography[key] === item.id} showDetail={showDetail} disabled={busy || !canVisit(stage)}
            onPick={() => changeGeography(key, item.id)} onClear={() => changeGeography(key, '')}
            onAdvance={() => advanceFromCard(() => changeGeography(key, item.id))} />)}</div>
          : <p className="swc-panel">No authored {level.toLowerCase()} choices are available here. Go back to choose another location.</p>}
      </>;
      break;
    }
    case 'World Entry':
      body = <section className="swc-panel" aria-label="World Entry selection">
        <div className="swc-options swc-entry-tabs" role="group" aria-label="Opening pools">
          <button type="button" aria-pressed={pool === 'ordinary'} onClick={() => {
            if (pool !== 'ordinary') { setPool('ordinary'); clearScenario(); }
          }}>Ordinary Core · 4</button>
          <button type="button" aria-pressed={pool === 'wilderness'} onClick={() => {
            if (pool !== 'wilderness') { setPool('wilderness'); clearScenario(); }
          }}>Hardcore Wilderness · Read only</button>
          <button type="button" disabled>World-Stray · Prestige locked</button>
        </div>
        <p className="swc-parent">Choose a personal opening to review. {pool === 'wilderness'
          ? 'Hardcore openings are unavailable in this World.' : 'Your first decision follows the Summary.'}</p>
        <div className="swc-story-grid">{(pool === 'ordinary' ? ordinaryEntries : wildernessEntries).map(entry =>
          <button type="button" className="swc-story" key={entry.id}
            aria-pressed={pool === 'ordinary' ? scenario?.id === entry.id : wildernessDraft?.id === entry.id}
            onClick={() => {
              if (entry.pool === 'wilderness') setWildernessDraft(entry);
              else if (entry.id !== scenario?.id) selectOrdinaryScenario(entry);
            }}>
            <small>{entry.pool === 'wilderness' ? 'Read editorial draft' :
              scenario?.id === entry.id ? 'Opening selected' : 'Select opening'}</small>
            <strong>{entry.name}</strong><span>{entry.blurb}</span>
          </button>)}</div>
        {wildernessDraft && <section className="swc-inset" aria-live="polite">
          <h2>{wildernessDraft.name}</h2><p>{wildernessDraft.intro}</p>
        </section>}
      </section>;
      break;
    case 'Summary':
      body = <div className="swc-summary">
        <section className="swc-panel">
          <h2>{name} · {catalog.lineageLabel}</h2>
          <div className="swc-inset">
            <h3>Character</h3>
            <p>{name} is {identity.height === 'normal' ? 'of average height' : height.label.toLowerCase()},
              {' '}with a {identity.build.label.toLowerCase()} build and {identity.aptitude.label.toLowerCase()} aptitude.</p>
            <dl className="swc-facts">
              <div><dt>Identity</dt><dd>{sex.label} · {age.label} · {catalog.lineageLabel}{identity.disposition && ` · ${identity.disposition}`}</dd></div>
              <div><dt>Appearance</dt><dd>{colorSummary}</dd></div>
              <div><dt>Attributes</dt><dd>{stats.total} total · 90 base + 10 generated</dd></div>
              <div><dt>Conditions</dt><dd>Eligibility pending</dd></div>
              <div><dt>Starting geography</dt><dd>{continent?.label} / {region?.label} / {settlement?.label}</dd></div>
              <div><dt>World Entry</dt><dd>{scenario?.name}</dd></div>
            </dl>
            <div data-swc-detail><Attributes stats={stats} /></div>
          </div>
          <div className="swc-inset"><h3>Legacy &amp; succession</h3><p>Fresh Start. Legacy preparations and benefits are unavailable.</p></div>
          <div className="swc-inset"><h3>Starting state</h3>
            <dl className="swc-facts">
              <div><dt>Skills &amp; traits</dt><dd>Pending gameplay authority</dd></div>
              <div><dt>Equipment &amp; currency</dt><dd>Pending grant authority</dd></div>
              <div><dt>Save slot</dt><dd>Pending World–Character–Save owner</dd></div>
            </dl>
          </div>
        </section>
        <div>{portrait(false)}<section className="swc-panel swc-summary-opening">
          <h2>Your opening</h2><p>{scenario?.blurb}</p>
          <button type="button" onClick={() => navigate(5)}>Change World Entry</button>
        </section></div>
      </div>;
      break;
    case 'Opening':
      body = scenario && <article className="swc-panel swc-opening">
        <p className="swc-kicker">The beginning · Ordinary Core</p>
        <h2>{scenario.name}</h2>
        <p className="swc-parent">{name} · {settlement?.label} · Editorial narrative</p>
        <p className="swc-prose">{scenario.intro}</p>
        {decision ? <div className="swc-inset" ref={decisionStatus} tabIndex={-1} role="status">
          <h3>Draft decision recorded</h3><p>{scenario[decision]}</p>
          <button type="button" onClick={() => { restoreChoiceFocus.current = true; setDecision(null); }}>
            Revisit the first decision
          </button>
        </div> : <section className="swc-inset" aria-label="First World Entry decision">
          <h3>Your first decision</h3>
          <div className="swc-story-grid">
            <button type="button" ref={firstChoice} onClick={() => setDecision('a')}>{scenario.a}</button>
            <button type="button" onClick={() => setDecision('b')}>{scenario.b}</button>
          </div>
        </section>}
        <p className="swc-hold" id="swc-finalization-hold">
          Character creation is held pending an approved World–Character–Save owner. Your opening decision is a reversible draft.
        </p>
        <button type="button" disabled aria-describedby="swc-finalization-hold">Create Character</button>
      </article>;
      break;
  }

  const missingPrerequisite = blockers.slice(0, stage).findIndex(Boolean);
  return <div className="swc" aria-busy={busy} data-detail={showDetail}>
    <header className="swc-header">
      <h1 className="sr-only">Character Creator</h1>
      <div className="swc-header-profile">
        <div className="swc-avatar" aria-hidden="true" style={{
          '--swc-avatar': `url("${getLineageCardArt(identity.lineageId)?.imageUrl ?? ''}")`
        } as CSSProperties} />
        <div className="swc-profile-copy"><strong title={name}>{name}</strong><p>{catalog.lineageLabel} · Fresh Start</p></div>
      </div>
      <div className="swc-header-actions">
        <button type="button" disabled={busy} onClick={onBack}>Cancel</button>
        <button type="button" disabled={busy} onClick={randomizeAll}>Randomize All</button>
      </div>
      <div className="swc-menu" ref={menu}>
        <button type="button" className="swc-icon-button swc-menu-trigger" ref={menuTrigger}
          aria-label="Creator options" title="Creator options" aria-expanded={menuOpen}
          aria-controls="swc-menu-panel" disabled={busy} onClick={() => setMenuOpen(!menuOpen)}>
          <span aria-hidden="true">⋮</span>
        </button>
        <div className="swc-menu-panel" id="swc-menu-panel" role="group" aria-label="Creator options" hidden={!menuOpen}>
          <button type="button" ref={menuFirstAction} onClick={onToggleTheme}>
            Switch to {themeMode === 'dark' ? 'light' : 'dark'} mode
          </button>
          <label className="swc-menu-world"><strong>{world.displayName}</strong>
            World instance ID
            <textarea readOnly rows={2} aria-label="World instance ID" value={world.worldInstanceId}
              onFocus={event => event.currentTarget.select()} />
          </label>
          <button type="button" disabled={busy} onClick={() => { setMenuOpen(false); onSignOut(); }}>Sign Out</button>
        </div>
      </div>
    </header>
    <ShellSubBar>
      <nav className="swc-context" aria-label="Creator controls">
        <button type="button" aria-pressed={showDetail} onClick={() => setShowDetail(!showDetail)}>
          Detail {showDetail ? 'Hide' : 'Show'}
        </button>
        <div className="swc-context-randomize">
          {contextualRandomizer && <button type="button" aria-label={`Randomize current ${creatorStages[stage]}`}
            disabled={busy || !canVisit(stage)} onClick={contextualRandomizer}>Randomize</button>}
        </div>
        <div className="swc-step-actions">
          <button type="button" disabled={busy} onClick={stage === 0 ? onBack : () => enterStage(stage - 1)}>Back</button>
          {stage < 7 && <button className="swc-primary" type="button" disabled={busy || missingPrerequisite >= 0}
            onClick={() => navigate(stage + 1)}>{stage === 6 ? 'Read Opening' : 'Next'}</button>}
        </div>
      </nav>
    </ShellSubBar>
    <div className="swc-layout">
      <aside className="swc-rail" tabIndex={0} aria-label="Character summary and stages">
        <button type="button" className="swc-rail-toggle" aria-expanded={railExpanded} aria-controls="swc-rail-details"
          onClick={() => setRailExpanded(!railExpanded)}>Creation steps &amp; attributes</button>
        <div id="swc-rail-details" className={railExpanded ? '' : 'is-collapsed'}>
          <div className="swc-rail-stats">
            <dl className="swc-resources" aria-label="Projected starting resources">
              {Object.entries(stats.resources).map(([label, capacity]) => <div key={label} data-resource={label}>
                <dt>{label}</dt>
                <dd>{capacity}</dd>
                <dd className="swc-resource-track"><progress aria-label={`Starting ${label}`}
                  value={capacity} max={capacity} /></dd>
              </div>)}
            </dl>
            <Attributes stats={stats} />
          </div>
          <nav className="swc-stage-nav" aria-label="Creator stages">
            {creatorStages.map((label, index) => {
              const randomize = randomizers[index];
              return <div className="swc-stage-item" key={label}>
                <button type="button" className="swc-stage-link" aria-current={index === stage ? 'step' : undefined}
                  disabled={!canVisit(index) || busy} onClick={() => navigate(index)}>
                  <span aria-hidden="true">{index + 1}</span>{label}
                </button>
                {index < randomizers.length && <button type="button" className="swc-icon-button swc-stage-dice"
                  aria-label={`Randomize ${label}`} title={`Randomize ${label}`}
                  disabled={!randomize || !canVisit(index) || busy} onClick={randomize ?? undefined}>
                  <span aria-hidden="true">⚄</span>
                </button>}
              </div>;
            })}
          </nav>
        </div>
      </aside>
      <main className="swc-main" ref={mainPane} tabIndex={0} aria-labelledby="swc-stage-title">
        {notice && <NoticeBanner notice={notice} />}
        <h2 className="swc-stage-heading" id="swc-stage-title" tabIndex={-1}
          ref={stageHeading}>{creatorStages[stage]}</h2>
        {validation && blockers[stage] && <p className="swc-hold" id="swc-validation" ref={validationAlert}
          tabIndex={-1} role="alert">{blockers[stage]}</p>}
        {missingPrerequisite >= 0 ? <div className="swc-hold" role="status">
          <p>{blockers[missingPrerequisite]}</p>
          <button type="button" disabled={busy} onClick={() => navigate(missingPrerequisite)}>
            Return to {creatorStages[missingPrerequisite]}
          </button>
        </div> : body}
      </main>
    </div>
  </div>;
}
