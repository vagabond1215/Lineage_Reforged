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
        {option.label}{grid && <small>{delta(option)}</small>}
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

function ArtCard({ label, description, meta, art, selected, landscape, onPick }:
  { label: string; description: string; meta: string; art: { imageUrl: string; backgroundPosition?: string; selectedImageUrl?: string; selectedBackgroundPosition?: string } | null;
    selected: boolean; landscape: boolean; onPick: () => void }) {
  return <button type="button" className={landscape ? 'swc-card swc-landscape' : 'swc-card swc-lineage'}
    aria-label={label} aria-description={selected ? `${meta}. ${description}` : meta}
    aria-pressed={selected} onClick={onPick}>
    <span className="swc-card-art" aria-hidden="true">
      {art ? <img src={(selected && art.selectedImageUrl) || art.imageUrl} alt="" loading="lazy"
        style={{ objectPosition: (selected && art.selectedBackgroundPosition) || art.backgroundPosition }} /> : <span>{label.slice(0, 1)}</span>}
      {selected && <span className="swc-card-check">✓</span>}
    </span>
    <span className="swc-card-copy"><strong>{label}</strong><small>{meta}</small>
      {selected && <span className="swc-card-description">{description}</span>}
    </span>
  </button>;
}

export function SelectedWorldCreator({ world, busy, notice, themeMode, onToggleTheme, onBack, onSignOut }: Props) {
  const [identity, setIdentity] = useState(defaultEntryIdentity);
  const [colors, setColors] = useState(initialColors);
  const [geography, setGeography] = useState<Geography>(emptyGeography);
  const [stage, setStage] = useState(0);
  const [railExpanded, setRailExpanded] = useState(true);
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
  const validationAlert = useRef<HTMLParagraphElement>(null);
  const decisionStatus = useRef<HTMLDivElement>(null);
  const firstChoice = useRef<HTMLButtonElement>(null);
  const restoreChoiceFocus = useRef(false);

  useLayoutEffect(() => { stageHeading.current?.focus(); }, [stage]);
  useLayoutEffect(() => {
    if (!validation) return;
    if (stage === 1) firstNameInput.current?.focus();
    else validationAlert.current?.focus();
  }, [validation, stage]);
  useLayoutEffect(() => {
    if (decision) decisionStatus.current?.focus();
    else if (restoreChoiceFocus.current) firstChoice.current?.focus();
    restoreChoiceFocus.current = false;
  }, [decision]);

  const name = identity.firstName.trim()
    ? [identity.firstName.trim(), identity.lastName.trim()].filter(Boolean).join(' ') : 'Unnamed Wanderer';
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
    identity.firstName.trim() ? '' : 'Enter a first name before continuing.',
    continent ? '' : 'Choose a continent before continuing.',
    region ? '' : 'Choose a region before continuing.',
    settlement ? '' : 'Choose an authored settlement before continuing.',
    scenario?.pool === 'ordinary' && pool === 'ordinary' ? '' : 'Choose an Ordinary Core opening before continuing.',
    summaryReviewed ? '' : 'Review the character summary first.'
  ];
  const canVisit = (target: number) => blockers.slice(0, target).every(message => !message);
  const navigate = (target: number) => {
    if (!canVisit(target)) {
      setValidation(true);
      if (stage === 1) firstNameInput.current?.focus();
      else validationAlert.current?.focus();
      return;
    }
    setValidation(false);
    setStage(target);
    if (target === 6) setSummaryReviewed(true);
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
    const [firstName = '', ...lastName] = generateRandomCharacterName(identity.lineageId, identity.sex).split(' ');
    changeIdentity({ firstName, lastName: lastName.join(' ') });
    setValidation(false);
  };
  const randomizeIdentity = () => {
    changeIdentity({ sex: pick(sexOptions).id, age: pick(catalog.ageBands).id,
      height: pick(catalog.heightBands).id, build: pick(entryBuilds), aptitude: pick(entryAptitudes) });
    setColors({ skin: freshColor(pick(catalog.skinToneOptions).id), hair: freshColor(pick(catalog.hairColorOptions).id),
      eyes: freshColor(pick(catalog.eyeColorOptions).id) });
  };
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
        <ArtCard key={option.id} label={option.label} meta="Playable ancestry" description={option.description}
          art={getLineageCardArt(option.id)} landscape={false} selected={identity.lineageId === option.id}
          onPick={() => {
            if (identity.lineageId === option.id) return;
            changeIdentity({ lineageId: option.id });
            setColors(initialColors());
            clearScenario();
          }} />)}</div>;
      break;
    case 'Identity':
      body = <>
        <section className="swc-panel swc-identity" aria-label="Identity controls">
          <div className="swc-row swc-name-row" role="group" aria-label="Name">
            <span className="swc-row-label" aria-hidden="true">Name</span>
            <div className="swc-name-inputs">
              <input ref={firstNameInput} aria-label="First name" placeholder="First name" maxLength={40} required
                aria-invalid={validation && !!blockers[1]} aria-describedby={validation && blockers[1] ? 'swc-validation' : undefined}
                value={identity.firstName} onChange={event => changeIdentity({ firstName: event.target.value })} />
              <input aria-label="Last name (optional)" placeholder="Last name (optional)" maxLength={40}
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
          <p className="swc-inset">Preview attributes use a 90-point lineage and identity base plus 10 generated points.
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
              {['', 'Curious', 'Gentle', 'Resolute', 'Reserved'].map(value =>
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
          <details className="swc-inset"><summary>Attribute guide</summary><dl className="swc-guide">
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
          ? regions.map(item => ({ ...item, meta: item.difficultyLabel, art: getRegionCardArt(item.id) }))
          : settlements.map(item => ({ ...item, meta: item.settlementType, art: getSettlementCardArt(item.id) }));
      const key = level.toLowerCase() as keyof Geography;
      body = <>
        {level !== 'Continent' && <p className="swc-parent">{level === 'Region' ? continent?.label : region?.label}</p>}
        {cards.length ? <div className="swc-geo-grid" role="group" aria-label={`${level} selections`}>{cards.map(item =>
          <ArtCard key={item.id} label={item.label} description={item.description} meta={item.meta} art={item.art}
            landscape selected={geography[key] === item.id} onPick={() => changeGeography(key, item.id)} />)}</div>
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
              else if (entry.id !== scenario?.id) { setScenario(entry); invalidateOpening(); setValidation(false); }
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
            <Attributes stats={stats} />
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

  return <div className="swc" aria-busy={busy}>
    <header className="swc-header">
      <h1 className="sr-only">Character Creator</h1>
      <div className="swc-header-profile">
        <div className="swc-avatar" aria-hidden="true" style={{
          '--swc-avatar': `url("${getLineageCardArt(identity.lineageId)?.imageUrl ?? ''}")`
        } as CSSProperties} />
        <div><strong>{name}</strong><p>{catalog.lineageLabel} · Fresh Start</p></div>
      </div>
      <div className="swc-header-actions">
        <button type="button" onClick={onToggleTheme}>Switch to {themeMode === 'dark' ? 'light' : 'dark'} mode</button>
        <button type="button" disabled={busy} onClick={onSignOut}>Sign Out</button>
      </div>
    </header>
    <ShellSubBar>
      <div className="swc-context">
        <nav aria-label="Creator context"><span>World Library</span><span aria-hidden="true">›</span>
          <strong>{world.displayName}</strong><span aria-hidden="true">›</span><span>Character Creator</span>
        </nav>
        <div className="swc-step-actions">
          {stage > 0 && <button type="button" disabled={busy}
            onClick={() => navigate(stage - 1)}>{stage === 7 ? 'Back to Summary' : 'Back'}</button>}
          {stage === 1 && <button type="button" onClick={randomizeIdentity}>Randomize Identity</button>}
          {stage < 7 && <button className="swc-primary" type="button" disabled={busy}
            onClick={() => navigate(stage + 1)}>{stage === 6 ? 'Read Opening' : 'Next'}</button>}
        </div>
      </div>
      <div className="swc-context">
        <p className="swc-world-id">{world.worldInstanceId}</p>
        <button type="button" disabled={busy} onClick={onBack}>Back to World Characters</button>
      </div>
    </ShellSubBar>
    <div className="swc-layout">
      <aside className="swc-rail" aria-label="Character summary and stages">
        <button type="button" className="swc-rail-toggle" aria-expanded={railExpanded} aria-controls="swc-rail-details"
          onClick={() => setRailExpanded(!railExpanded)}>Creation steps &amp; attributes</button>
        <div id="swc-rail-details" className={railExpanded ? '' : 'is-collapsed'}>
          <nav className="swc-stage-nav" aria-label="Creator stages">
            {creatorStages.map((label, index) => <button key={label} type="button"
              aria-current={index === stage ? 'step' : undefined} disabled={!canVisit(index) || busy}
              onClick={() => navigate(index)}><span aria-hidden="true">{index + 1}</span>{label}</button>)}
          </nav>
          <div className="swc-rail-stats">
            <dl className="swc-resources" aria-label="Projected resources">
              {Object.entries(stats.resources).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <Attributes stats={stats} />
          </div>
        </div>
      </aside>
      <main className="swc-main" aria-labelledby="swc-stage-title">
        {notice && <NoticeBanner notice={notice} />}
        <h2 className="swc-stage-heading" id="swc-stage-title" tabIndex={-1}
          ref={stageHeading}>{creatorStages[stage]}</h2>
        {validation && blockers[stage] && <p className="swc-hold" id="swc-validation" ref={validationAlert}
          tabIndex={-1} role="alert">{blockers[stage]}</p>}
        {body}
      </main>
    </div>
  </div>;
}
