import { useEffect, useMemo, useRef, useState } from 'react';
import { ConsumableEffectPreview } from '../components/body-state/ConsumableEffectPreview';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { Tooltip } from '../components/ui/Tooltip';
import { Icon } from '../components/icons';
import { CHARACTER_ATTRIBUTE_ORDER, getCharacterAttributePresentation } from '../game-shell/characterAttributes';
import { backstoryOptions, getAgeBandLabel, getFocusLabel, getIdentityOptionLabel, getLineageCardArt, getNatureLabel, getPhysiqueLabel } from '../game-shell/characterCreationCatalog';
import { resolveCharacterCreatorAssetUrl } from '../game-shell/characterCreatorAssetUrl';
import { useGameSession } from '../runtime/GameSessionContext';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import {
  buildCharacterSectionItems,
  buildEquipmentEntries,
  buildInventoryEntries,
  buildSkillItems,
  buildTraitEffectItems,
  consumeInventoryItem,
  equipInventoryItem,
  getFavoriteItemKeys,
  getInventoryCategories,
  sortInventoryEntries,
  toggleFavoriteItem,
  unequipItem,
  type CharacterInventoryCategory,
  type CharacterInventorySort,
  type CharacterPanelNotice,
  type EquipmentEntry,
  type InventoryEntry
} from './characterPanelState';
import { matchesQuery, toneClasses } from '../utils';
import type { ListItem } from '../types';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import './character-sheet.css';

type CharacterPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
  initialSection?: string;
  inventoryOnly?: boolean;
  onOpenInventory?: () => void;
};

function ActionButton({
  label,
  onClick,
  disabled = false,
  descriptionId,
  tone = 'neutral'
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  descriptionId?: string;
  tone?: 'neutral' | 'accent' | 'warning';
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-amber-300/25 bg-amber-200/10 text-amber-50 hover:bg-amber-200/15'
      : tone === 'warning'
        ? 'border-rose-300/20 bg-rose-200/10 text-rose-50 hover:bg-rose-200/15'
        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-describedby={descriptionId}
      className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${toneClass} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function ItemStarButton({
  active,
  onToggle
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <Tooltip content={active ? 'Remove favorite' : 'Favorite item'}>
      <button
        type="button"
          aria-label={active ? 'Remove favorite' : 'Favorite item'}
          aria-pressed={active}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
          className={`rounded-full border p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${
          active
            ? 'border-amber-300/30 bg-amber-300/14 text-amber-200'
            : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
        }`}
      >
        <Icon name="star" className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}

function toDetail(item: ListItem | undefined) {
  if (!item) {
    return undefined;
  }

  return {
    title: item.detailTitle ?? item.title,
    summary: item.detailSummary ?? 'No detail available.',
    groups: item.detailGroups ?? []
  };
}

function savedIdentityLabel(lineageId: string, collection: 'hairColorOptions' | 'eyeColorOptions' | 'skinToneOptions', optionId: string): string {
  return getIdentityOptionLabel(lineageId, collection, optionId)
    ?? optionId.split('.').pop()!.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function selectVisibleItem<T extends { id: string }>(entries: T[], requestedId?: string): T | undefined {
  return requestedId ? entries.find((entry) => entry.id === requestedId) : entries[0];
}

type InventorySelection = { key: string; inventory: SaveSnapshot['playerState']['inventory'] };

export function inventoryPresentationId(entry: Pick<InventoryEntry, 'id' | 'itemId' | 'itemKey' | 'location' | 'containerIndex' | 'stackIndex'>): string {
  return JSON.stringify([entry.location, entry.containerIndex, entry.stackIndex, entry.itemId, entry.itemKey, entry.id]);
}

export function inventorySelectionFor(entry: InventoryEntry, inventory: SaveSnapshot['playerState']['inventory']): InventorySelection {
  return { key: inventoryPresentationId(entry), inventory };
}

export function selectVisibleInventoryItem<T extends InventoryEntry>(
  entries: T[],
  selection: InventorySelection | null,
  inventory: SaveSnapshot['playerState']['inventory']
): T | undefined {
  return selection?.inventory === inventory ? entries.find((entry) => inventoryPresentationId(entry) === selection.key) : undefined;
}

// Insertion order follows the visible rows, so Tab follows the diagram rather than the save shape.
const EQUIPMENT_SHEET_AREAS: Record<EquipmentEntry['slotId'], string> = {
  'slot.accessory.ear': 'ear',
  'slot.armor.head': 'head',
  'slot.accessory.eyes': 'eyes',
  'slot.armor.shoulder': 'shoulder',
  'slot.accessory.neck': 'neck',
  'slot.armor.arm': 'arm',
  'slot.armor.chest': 'chest',
  'slot.accessory.arms': 'arms',
  'slot.weapon.left': 'offhand',
  'slot.armor.hand': 'hands',
  'slot.armor.waist': 'waist',
  'slot.accessory.waist': 'belt',
  'slot.weapon.right': 'weapon',
  'slot.accessory.fingers': 'fingers',
  'slot.armor.leg': 'legs',
  'slot.armor.foot': 'feet',
  'slot.accessory.ankle': 'ankle'
};
const EQUIPMENT_SHEET_ORDER = Object.keys(EQUIPMENT_SHEET_AREAS) as EquipmentEntry['slotId'][];

export function EquipmentSlotPreview({
  entry,
  onInspect
}: {
  entry: EquipmentEntry;
  onInspect: () => void;
}) {
  const artworkUrl = entry.item && entry.artworkUrl
    ? resolveCharacterCreatorAssetUrl(entry.artworkUrl)
    : null;
  const [failedArtwork, setFailedArtwork] = useState<string | null>(null);
  const showArtwork = artworkUrl !== null && artworkUrl !== failedArtwork;

  return (
    <button
      type="button"
      className={`character-sheet-slot ${entry.item ? 'is-occupied' : 'is-unoccupied'}`}
      data-slot-id={entry.slotId}
      style={{ gridArea: EQUIPMENT_SHEET_AREAS[entry.slotId] }}
      aria-label={`Inspect ${entry.slotLabel} slot: ${entry.item ? entry.itemTitle : 'unoccupied'}`}
      onClick={onInspect}
    >
      <span className="character-sheet-slot-frame" aria-hidden="true">
        {entry.item && (showArtwork
          ? <img src={artworkUrl} alt="" loading="lazy" onError={() => setFailedArtwork(artworkUrl)} />
          : <span className="character-sheet-slot-fallback">◆</span>)}
      </span>
      <span className="character-sheet-slot-label">{entry.slotLabel}</span>
      {entry.item && <span className="character-sheet-slot-item">{entry.itemTitle}</span>}
    </button>
  );
}

export function CharacterPanel({
  accent,
  searchQuery,
  pinnedIds,
  onTogglePin,
  initialSection = 'overview',
  inventoryOnly = false,
  onOpenInventory
}: CharacterPanelProps) {
  const { snapshot, updateSnapshot } = useGameSession();
  const characterData = useUiViewModel().character;
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({});
  const [inventorySelection, setInventorySelection] = useState<InventorySelection | null>(() => {
    const first = buildInventoryEntries(snapshot)[0];
    return first ? inventorySelectionFor(first, snapshot.playerState.inventory) : null;
  });
  const [inventoryCategory, setInventoryCategory] = useState<CharacterInventoryCategory>('all');
  const [inventorySort, setInventorySort] = useState<CharacterInventorySort>('default');
  const [panelNotice, setPanelNotice] = useState<CharacterPanelNotice | null>(null);
  const [overviewAttributeId, setOverviewAttributeId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(true);
  const overviewHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousSectionRef = useRef(initialSection);
  const noticeRef = useRef<HTMLDivElement | null>(null);
  const inventoryHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (inventoryOnly) inventoryHeadingRef.current?.focus();
  }, [inventoryOnly]);

  const skillItems = useMemo(() => buildSkillItems(snapshot), [snapshot]);
  const equipmentEntries = useMemo(() => buildEquipmentEntries(snapshot), [snapshot]);
  const inventoryEntries = useMemo(() => buildInventoryEntries(snapshot), [snapshot]);
  const traitItems = useMemo(() => buildTraitEffectItems(snapshot), [snapshot]);
  const favoriteItemKeys = useMemo(() => getFavoriteItemKeys(snapshot), [snapshot]);
  const standing = characterData.lists.standing ?? [];
  const reputation = characterData.lists.reputation ?? [];
  const discoveries = characterData.lists.discoveries ?? [];


  const sectionItems = useMemo(
    () =>
      buildCharacterSectionItems({
        skills: skillItems.length,
        equipment: equipmentEntries.filter((entry) => entry.item).length,
        inventory: inventoryEntries.length,
        traits: traitItems.length,
        standing: standing.length,
        reputation: reputation.length,
        discoveries: discoveries.length
      }),
    [
      discoveries.length,
      reputation.length,
      standing.length,
      equipmentEntries,
      inventoryEntries.length,
      skillItems.length,
      traitItems.length
    ]
  );

  useEffect(() => {
    if (inventoryOnly || previousSectionRef.current === activeSection) return;
    previousSectionRef.current = activeSection;
    if (activeSection === 'overview') overviewHeadingRef.current?.focus();
    else backButtonRef.current?.focus();
  }, [activeSection, inventoryOnly]);

  useEffect(() => {
    if (panelNotice) noticeRef.current?.focus();
  }, [panelNotice]);

  const changeSection = (id: string) => {
    setActiveSection(id);
    setPanelNotice(null);
  };

  const standingItems = standing.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const reputationItems = reputation.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const discoveryItems = discoveries.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const filteredSkillItems = skillItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const filteredTraitItems = traitItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const filteredEquipmentEntries = equipmentEntries.filter((entry) =>
    matchesQuery(searchQuery, entry.itemTitle, entry.slotLabel, [entry.category, entry.item?.itemKey ?? 'empty'], entry.detail.summary)
  );
  const filteredInventoryEntries = useMemo(() => {
    const byCategory =
      inventoryCategory === 'all'
        ? inventoryEntries
        : inventoryEntries.filter((entry) => entry.category === inventoryCategory);

    const bySearch = byCategory.filter((entry) =>
      matchesQuery(searchQuery, entry.title, entry.containerLabel, [entry.category, entry.itemKey], entry.detail.summary)
    );

    return sortInventoryEntries(bySearch, inventorySort, favoriteItemKeys, inventoryCategory);
  }, [favoriteItemKeys, inventoryCategory, inventoryEntries, inventorySort, searchQuery]);

  const selectedSkill = filteredSkillItems.find((item) => item.id === selectedIds.skills) ?? filteredSkillItems[0];
  const selectedEquipment = selectVisibleItem(filteredEquipmentEntries, selectedIds.equipment);
  const selectedInventory = selectVisibleInventoryItem(filteredInventoryEntries, inventorySelection, snapshot.playerState.inventory);
  const selectedTrait = filteredTraitItems.find((item) => item.id === selectedIds.traits) ?? filteredTraitItems[0];
  const selectedStanding = standingItems.find((item) => item.id === selectedIds.standing) ?? standingItems[0];
  const selectedReputation = reputationItems.find((item) => item.id === selectedIds.reputation) ?? reputationItems[0];
  const selectedDiscovery = discoveryItems.find((item) => item.id === selectedIds.discoveries) ?? discoveryItems[0];

  const primaryDetail =
    activeSection === 'overview'
      ? undefined
      : activeSection === 'skills'
          ? toDetail(selectedSkill)
          : activeSection === 'equipment'
            ? selectedEquipment?.detail
            : activeSection === 'inventory'
            ? selectedInventory?.detail
            : activeSection === 'traits'
              ? toDetail(selectedTrait)
              : activeSection === 'standing'
                  ? toDetail(selectedStanding)
                : activeSection === 'reputation'
                  ? toDetail(selectedReputation)
                  : toDetail(selectedDiscovery);

  const applyNotice = (nextSnapshot: typeof snapshot, notice: CharacterPanelNotice) => {
    if (nextSnapshot !== snapshot) updateSnapshot(nextSnapshot);
    setPanelNotice(notice);
  };

  const setSelectedId = (sectionId: string, id: string) =>
    setSelectedIds((current) => ({ ...current, [sectionId]: id }));

  const toggleFavorite = (itemKey: string, label: string) => {
    const nextSnapshot = toggleFavoriteItem(snapshot, itemKey);
    const nextFavorites = getFavoriteItemKeys(nextSnapshot);
    applyNotice(nextSnapshot, {
      tone: 'accent',
      title: nextFavorites.has(itemKey) ? 'Item Favorited' : 'Favorite Removed',
      detail: `${label} ${nextFavorites.has(itemKey) ? 'was added to' : 'was removed from'} favorites.`
    });
  };

  const noticeBlock = panelNotice ? (
    <div ref={noticeRef} tabIndex={-1} role={panelNotice.tone === 'warning' ? 'alert' : 'status'} className={`rounded-[22px] border px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${toneClasses(panelNotice.tone)}`}>
      <div className="text-sm font-semibold">{panelNotice.title}</div>
      <div className="mt-1 text-sm text-white/80">{panelNotice.detail}</div>
    </div>
  ) : null;

  const listSection = (title: string, items: ListItem[], selectedId: string | undefined, sectionKey: string, emptyMessage: string) => (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <SelectionList
        title={title}
        items={items}
        {...(selectedId !== undefined ? { selectedId } : {})}
        onSelect={(id) => setSelectedId(sectionKey, id)}
        pinnedIds={pinnedIds}
        onTogglePin={onTogglePin}
        accent={accent}
        emptyMessage={emptyMessage}
      />
    </div>
  );

  const backstoryId = snapshot.playerState.coreData.backstoryId;
  const background = backstoryOptions.find((option) => option.id === backstoryId)?.label;
  const equippedTitle = snapshot.playerState.titles.find((title) => title.equipped);
  const otherTitles = snapshot.playerState.titles.filter((title) => !title.equipped);
  const overviewTraits = traitItems.filter((item) => item.subtitle === 'Trait');
  const overviewEffects = traitItems.filter((item) => item.subtitle !== 'Trait');
  const allAttributeItems = characterData.lists.attributes ?? [];
  const overviewAttribute = allAttributeItems.find((item) => item.id === overviewAttributeId);
  const core = snapshot.playerState.coreData;
  const identity = core.identityProfile;
  const lineageArt = getLineageCardArt(core.lineageId);
  const baseDetails = [
    ['Lineage', snapshot.playerState.originProfile.lineageLabel],
    ['Background', background ?? null],
    ['Sex', core.sexId === 'female' ? 'Female' : core.sexId === 'male' ? 'Male' : null],
    ['Age', identity?.ageBandId ? getAgeBandLabel(identity.ageBandId) : null],
    ['Height', identity?.heightCm ? `${identity.heightCm} cm` : null],
    ['Build', identity?.physiqueId ? getPhysiqueLabel(identity.physiqueId) : null],
    ['Nature', identity?.natureId ? getNatureLabel(identity.natureId) : null],
    ['Focus', identity?.focusId ? getFocusLabel(identity.focusId) : null],
    ['Hair', identity?.hairColorId ? savedIdentityLabel(core.lineageId, 'hairColorOptions', identity.hairColorId) : null],
    ['Eyes', identity?.eyeColorId ? savedIdentityLabel(core.lineageId, 'eyeColorOptions', identity.eyeColorId) : null],
    ['Skin', identity?.skinToneId ? savedIdentityLabel(core.lineageId, 'skinToneOptions', identity.skinToneId) : null]
  ].filter((entry): entry is string[] => Boolean(entry[1]));

  const overviewMain = (
    <div className="character-sheet panel-scroll h-full overflow-auto">
      {noticeBlock}
      <section className="character-sheet-upper" aria-labelledby="character-sheet-name">
        <div className="character-sheet-rail">
          <div className="character-sheet-art">
            {lineageArt
              ? <img src={resolveCharacterCreatorAssetUrl(lineageArt.imageUrl)} alt={`${snapshot.playerState.originProfile.lineageLabel} lineage illustration, not a personal portrait`} loading="lazy" />
              : <Icon name="character" className="h-12 w-12" />}
            <span>Lineage illustration</span>
          </div>
          <div className="character-sheet-attribute-stack" role="group" aria-label="Character attributes">
            {CHARACTER_ATTRIBUTE_ORDER.map((key) => {
            const presentation = getCharacterAttributePresentation(key);
            const item = allAttributeItems.find((entry) => entry.id === `attr.${key.toLowerCase()}`);
            const adjustment = snapshot.playerState.originProfile.attributeAdjustments[key] ?? 0;
            return (
              <button
                key={key}
                type="button"
                aria-expanded={overviewAttributeId === item?.id}
                aria-controls={overviewAttributeId === item?.id ? 'character-attribute-detail' : undefined}
                aria-label={`${presentation.fullName}, ${snapshot.playerState.attributes[key]}${adjustment ? `, origin adjustment ${adjustment > 0 ? '+' : ''}${adjustment}` : ''}`}
                onClick={() => setOverviewAttributeId(overviewAttributeId === item?.id ? null : item?.id ?? null)}
                className="character-sheet-attribute focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
              >
                <span className="character-sheet-attribute-abbr" aria-hidden="true">{key}</span>
                <span className="character-sheet-attribute-value" aria-hidden="true">{snapshot.playerState.attributes[key]}</span>
                {adjustment !== 0 && <span className="character-sheet-attribute-adjustment" aria-hidden="true">{adjustment > 0 ? '+' : ''}{adjustment}</span>}
              </button>
            );
            })}
          </div>
        </div>
        <div className="character-sheet-profile">
          <h2 id="character-sheet-name" ref={overviewHeadingRef} tabIndex={-1}>{core.playerName}</h2>
          {equippedTitle && <p className="character-sheet-title">{equippedTitle.name}</p>}
          <dl className="character-sheet-base-data">
            {baseDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <div className="character-sheet-equipment-matrix" role="group" aria-label="Equipped item slots">
            {[...equipmentEntries].sort((a, b) => EQUIPMENT_SHEET_ORDER.indexOf(a.slotId) - EQUIPMENT_SHEET_ORDER.indexOf(b.slotId)).map((entry) => (
              <EquipmentSlotPreview
                key={entry.id}
                entry={entry}
                onInspect={() => {
                  setSelectedId('equipment', entry.id);
                  changeSection('equipment');
                }}
              />
            ))}
          </div>
          <button type="button" onClick={() => changeSection('equipment')} className="character-sheet-link mt-1 justify-self-start">Manage Equipment</button>
          {overviewAttribute && (
            <div id="character-attribute-detail" role="region" aria-label={`${overviewAttribute.title} detail`} className="character-sheet-attribute-detail">
              <strong>{overviewAttribute.detailTitle}</strong>
              <p>{overviewAttribute.detailSummary}</p>
              {overviewAttribute.detailGroups?.map((group) => (
                <dl key={group.title}>
                  {group.entries.map((entry) => (
                    <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>
                  ))}
                </dl>
              ))}
            </div>
          )}
          <div className="character-sheet-progression">
        <details className="character-sheet-expandable">
          <summary>Skills <span>{skillItems.length}</span></summary>
          {skillItems.length ? <ul>{skillItems.map((item) => <li key={item.id}><span>{item.title}</span><span>{item.meta}</span></li>)}</ul> : <p>No developed skills yet.</p>}
          <button type="button" onClick={() => changeSection('skills')} className="character-sheet-link">View Skills</button>
        </details>
        <details className="character-sheet-expandable">
          <summary>Traits <span>{overviewTraits.length}</span></summary>
          {overviewTraits.length ? <ul>{overviewTraits.map((item) => <li key={item.id}>{item.title}</li>)}</ul> : <p>No recorded traits.</p>}
          <button type="button" onClick={() => changeSection('traits')} className="character-sheet-link">View Traits &amp; Effects</button>
        </details>
        <details className="character-sheet-expandable">
          <summary>Effects <span>{overviewEffects.length}</span></summary>
          {overviewEffects.length ? <ul>{overviewEffects.map((item) => <li key={item.id}>{item.title}</li>)}</ul> : <p>No active effects.</p>}
          <button type="button" onClick={() => changeSection('traits')} className="character-sheet-link">View Traits &amp; Effects</button>
        </details>
        <details className="character-sheet-expandable">
          <summary>Echo &amp; Growth</summary>
          <dl>
            <div><dt>Echo Level</dt><dd>{snapshot.playerState.progression.level}</dd></div>
            <div><dt>Resource Growth</dt><dd>{snapshot.playerState.progression.legacyGrowth.resourceGrowthLevel}</dd></div>
            <div><dt>Echo adjusted</dt><dd>{snapshot.playerState.progression.echo.echoAdjusted.toFixed(2)}</dd></div>
          </dl>
        </details>
        {([
          ['Standing', standing, 'standing', 'No faction standing recorded.'],
          ['Reputation', reputation, 'reputation', 'No reputation recorded.'],
          ['Discoveries', discoveries, 'discoveries', 'No discoveries recorded.']
        ] as const).map(([label, items, section, emptyMessage]) => (
          <details className="character-sheet-expandable" key={section}>
            <summary>{label} <span>{items.length}</span></summary>
            {items.length ? <ul>{items.map((item) => <li key={item.id}><span>{item.title}</span>{item.subtitle && <span>{item.subtitle}</span>}</li>)}</ul> : <p>{emptyMessage}</p>}
            <button type="button" onClick={() => changeSection(section)} className="character-sheet-link">View {label}</button>
          </details>
        ))}
        {otherTitles.length > 0 && <details className="character-sheet-expandable">
          <summary>Earned Titles <span>{otherTitles.length}</span></summary>
          <ul>{otherTitles.map((title, index) => <li key={`${title.name}.${index}`}>{title.name}</li>)}</ul>
        </details>}
          </div>
        </div>
      </section>
    </div>
  );

  const skillsMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <SelectionList
        title="Skill Ledger"
        items={filteredSkillItems}
        {...(selectedSkill?.id !== undefined ? { selectedId: selectedSkill.id } : {})}
        onSelect={(id) => setSelectedId('skills', id)}
        pinnedIds={pinnedIds}
        onTogglePin={onTogglePin}
        accent={accent}
        emptyMessage="No skills match the active search."
      />
    </div>
  );

  const equipmentMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <Card title="Equipment Loadout" accent={accent}>
        <p className="mb-4 text-sm text-slate-300">
          {equipmentEntries.filter((entry) => entry.item).length} occupied of {equipmentEntries.length} slots. Select a slot to inspect its current item.
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipmentEntries.map((entry) => {
            const isSelected = entry.id === selectedEquipment?.id;
            const isPinned = pinnedIds.includes(entry.id);
            const isFavorite = entry.item ? favoriteItemKeys.has(entry.item.itemKey) : false;

            return (
              <div
                key={entry.id}
                className={`rounded-[18px] border p-3 transition ${
                  isSelected ? 'border-amber-200/40 bg-amber-200/10' : 'border-white/10 bg-black/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Inspect ${entry.slotLabel}: ${entry.itemTitle}`}
                    onClick={() => setSelectedId('equipment', entry.id)}
                    className="min-w-0 flex-1 text-left focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
                  >
                    <span className="block text-[11px] uppercase tracking-[0.16em] text-slate-400">{entry.slotLabel}</span>
                    <span className="mt-1 block break-words text-base font-semibold text-slate-50">{entry.itemTitle}</span>
                    <span className="mt-2 block text-xs text-slate-300">{entry.item ? 'Occupied' : 'Empty'}</span>
                  </button>
                  {entry.item && (
                    <div className="flex items-center gap-2">
                      <ItemStarButton active={isFavorite} onToggle={() => toggleFavorite(entry.item!.itemKey, entry.itemTitle)} />
                      <FavoriteButton active={isPinned} onToggle={() => onTogglePin(entry.id)} />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.item && <span className="text-xs text-slate-300">Quantity {entry.item.quantity}</span>}
                  {entry.item?.durability !== undefined && (
                    <span className="text-xs text-slate-300">
                      {Math.round(entry.item.durability * 100)}% durability
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card title="Selected Slot" accent={accent}>
        <div className="space-y-3">
          <div className="text-sm text-slate-200">
            {selectedEquipment
              ? <><strong>{selectedEquipment.slotLabel}</strong>: {selectedEquipment.item ? selectedEquipment.itemTitle : 'Empty'}</>
              : 'The selected slot is no longer shown. Choose a visible slot.'}
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Unequip Item"
              descriptionId="equipment-unequip-reason"
              onClick={() => {
                if (!selectedEquipment) {
                  return;
                }

                const result = unequipItem(snapshot, selectedEquipment);
                applyNotice(result.snapshot, result.notice);
              }}
              disabled={!selectedEquipment?.item}
              tone="accent"
            />
            <ActionButton
              label={selectedEquipment?.item && favoriteItemKeys.has(selectedEquipment.item.itemKey) ? 'Unfavorite Item' : 'Favorite Item'}
              onClick={() => selectedEquipment?.item && toggleFavorite(selectedEquipment.item.itemKey, selectedEquipment.itemTitle)}
              disabled={!selectedEquipment?.item}
            />
            <ActionButton label="Browse carried items" onClick={() => onOpenInventory?.()} disabled={!onOpenInventory} />
          </div>
          <p id="equipment-unequip-reason" className="text-xs text-slate-400">
            {selectedEquipment?.item
              ? 'Unequip moves the selected item into carried inventory.'
              : selectedEquipment
                ? 'This slot is empty; there is no item to unequip or favorite.'
                : 'Choose a visible slot before using equipment actions.'}
          </p>
          <p className="text-xs text-slate-400">Choose a carried item in Inventory to see its current Equip availability.</p>
        </div>
      </Card>
    </div>
  );

  const inventoryCategories = getInventoryCategories(inventoryEntries);
  const inventoryStackReady = Boolean(selectedInventory && Number.isSafeInteger(selectedInventory.quantity) && selectedInventory.quantity > 0);
  const canEquipSelected = inventoryStackReady && Boolean(selectedInventory?.preferredSlotId);
  const canUseSelected = inventoryStackReady && Boolean(selectedInventory?.consumePreview);
  const inventorySelectionReason = inventorySelection
    ? 'Inventory changed or the selected stack is hidden. Choose a current stack.'
    : 'Select a carried stack to manage it.';
  const equipReason = !selectedInventory
    ? inventorySelectionReason
    : !inventoryStackReady
      ? 'This stack has no items available to equip.'
      : selectedInventory.preferredSlotId
        ? 'Equip moves one item to its currently supported slot; an occupied item returns to inventory.'
        : 'No supported equipment slot for this item.';
  const useReason = !selectedInventory
    ? inventorySelectionReason
    : !inventoryStackReady
      ? 'This stack has no items available to use.'
      : selectedInventory.consumePreview
        ? 'Use consumes one item with its authored consume profile.'
        : 'No authored consume profile for this item.';
  const inventoryMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <Card title="Inventory Controls" accent={accent}>
        <div className="space-y-4">
          <div role="group" aria-label="Filter inventory by category" className="flex flex-wrap gap-2">
            {inventoryCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setInventoryCategory(category)}
                aria-pressed={inventoryCategory === category}
                className={`rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${
                  inventoryCategory === category ? 'border-white/20 bg-white/10 text-slate-50' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {category === 'all' ? 'All' : category[0]!.toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Sort inventory" className="flex flex-wrap gap-2">
            {(['default', 'name', 'quantity', 'category', 'favorites'] as CharacterInventorySort[]).map((sortId) => (
              <button
                key={sortId}
                type="button"
                onClick={() => setInventorySort(sortId)}
                aria-pressed={inventorySort === sortId}
                className={`rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 ${
                  inventorySort === sortId ? 'border-white/20 bg-white/10 text-slate-50' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {sortId === 'default' ? 'Default' : sortId[0]!.toUpperCase() + sortId.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Inventory Stacks" accent={accent}>
        <p className="mb-4 text-sm text-slate-300">Showing {filteredInventoryEntries.length} of {inventoryEntries.length} carried stacks across bags and overflow.</p>
        <div className="space-y-3">
          {filteredInventoryEntries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
              No carried items match the active filters.
            </div>
          )}
          {filteredInventoryEntries.map((entry) => {
            const presentationId = inventoryPresentationId(entry);
            const isSelected = presentationId === inventorySelection?.key && inventorySelection.inventory === snapshot.playerState.inventory;
            const pinIdIsAmbiguous = inventoryEntries.some((other) => other !== entry && other.id === entry.id);
            const isPinned = !pinIdIsAmbiguous && pinnedIds.includes(entry.id);
            const isFavorite = favoriteItemKeys.has(entry.itemKey);
            const hasItems = Number.isSafeInteger(entry.quantity) && entry.quantity > 0;
            const sourceLabel = entry.location === 'bag' ? `${entry.containerLabel}, bag ${entry.containerIndex + 1}` : entry.containerLabel;

            return (
              <div
                key={presentationId}
                className={`w-full rounded-[18px] border p-3 transition ${
                  isSelected ? 'border-amber-200/40 bg-amber-200/10' : 'border-white/10 bg-black/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Inspect ${entry.title}, quantity ${entry.quantity}, ${sourceLabel}`}
                    onClick={() => setInventorySelection(inventorySelectionFor(entry, snapshot.playerState.inventory))}
                    className="min-w-0 flex-1 text-left focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
                  >
                    <span className="block break-words text-base font-semibold text-slate-50">{entry.title}</span>
                    <span className="mt-1 block text-sm text-slate-300">{sourceLabel} · Quantity {entry.quantity}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <ItemStarButton active={isFavorite} onToggle={() => toggleFavorite(entry.itemKey, entry.title)} />
                    {pinIdIsAmbiguous
                      ? <button type="button" disabled aria-label={`Pin unavailable for ${sourceLabel}: shared bag ID`} title="Pin unavailable: these bags share a stored ID" className="rounded-full border border-white/10 p-2 text-slate-500">Pin</button>
                      : <FavoriteButton active={isPinned} onToggle={() => onTogglePin(entry.id)} />}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">{entry.category}</span>
                  {hasItems && entry.preferredSlotId && <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses('accent')}`}>Supported equip slot</span>}
                  {hasItems && entry.consumePreview && <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses('success')}`}>Use available</span>}
                  {entry.consumePreview?.highlightLabel && (
                    <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses('success')}`}>
                      {entry.consumePreview.highlightLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {selectedInventory?.consumePreview && (
        <ConsumableEffectPreview preview={selectedInventory.consumePreview} />
      )}
      <Card title="Item Actions" accent={accent}>
        <div className="space-y-3">
          <div className="text-sm text-slate-200">
            {selectedInventory
              ? <><strong>{selectedInventory.title}</strong> · {selectedInventory.containerLabel}{selectedInventory.location === 'bag' ? `, bag ${selectedInventory.containerIndex + 1}` : ''} · Quantity {selectedInventory.quantity}</>
              : inventorySelectionReason}
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Equip Item"
              descriptionId="inventory-equip-reason"
              onClick={() => {
                if (!selectedInventory) {
                  return;
                }

                const result = equipInventoryItem(snapshot, selectedInventory);
                applyNotice(result.snapshot, result.notice);
              }}
              disabled={!canEquipSelected}
              tone="accent"
            />
            <ActionButton
              label={selectedInventory && favoriteItemKeys.has(selectedInventory.itemKey) ? 'Unfavorite Item' : 'Favorite Item'}
              onClick={() => selectedInventory && toggleFavorite(selectedInventory.itemKey, selectedInventory.title)}
              disabled={!selectedInventory}
            />
            <ActionButton
              label="Use Item"
              descriptionId="inventory-use-reason"
              onClick={() => {
                if (!selectedInventory) {
                  return;
                }

                const result = consumeInventoryItem(snapshot, selectedInventory);
                applyNotice(result.snapshot, result.notice);
              }}
              disabled={!canUseSelected}
              tone="warning"
            />
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <p id="inventory-equip-reason">Equip: {equipReason}</p>
            <p id="inventory-use-reason">Use: {useReason}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const mainContent =
    activeSection === 'overview'
      ? overviewMain
      : activeSection === 'skills'
          ? skillsMain
          : activeSection === 'equipment'
            ? equipmentMain
            : activeSection === 'inventory'
              ? inventoryMain
              : activeSection === 'traits'
                ? listSection('Traits And Effects', filteredTraitItems, selectedTrait?.id, 'traits', 'No traits or effects match the active search.')
                : activeSection === 'standing'
                  ? listSection('Standing', standingItems, selectedStanding?.id, 'standing', 'No faction standing records match the active search.')
                : activeSection === 'reputation'
                  ? listSection('Reputation', reputationItems, selectedReputation?.id, 'reputation', 'No reputation records match the active search.')
                  : listSection('Discoveries', discoveryItems, selectedDiscovery?.id, 'discoveries', 'No discoveries match the active search.');

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {inventoryOnly && <h2 ref={inventoryHeadingRef} tabIndex={-1} className="shrink-0 text-lg font-semibold text-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Inventory</h2>}
      {!inventoryOnly && activeSection !== 'overview' && <button ref={backButtonRef} type="button" onClick={() => changeSection('overview')} className="w-fit shrink-0 text-sm font-semibold text-amber-100 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200">Back to Character</button>}
      <div className="panel-scroll relative min-h-0 flex-1 overflow-y-auto pr-7 xl:overflow-visible">
        <div className={`grid min-h-full min-w-0 gap-4 xl:h-full ${activeSection !== 'overview' && detailOpen ? 'xl:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
          <section id="character-section-content" aria-label={`${inventoryOnly ? 'Inventory' : sectionItems.find((item) => item.id === activeSection)?.label ?? 'Character'} section`} className={`min-w-0 ${activeSection === 'overview' ? 'min-h-[20rem] xl:min-h-0' : 'h-[min(60vh,36rem)] xl:h-full'}`}>{mainContent}</section>
          {activeSection !== 'overview' && detailOpen && (
            <div className="h-[min(35vh,20rem)] min-w-0 xl:h-full">
              <PanelDetailStack
                accent={accent}
                {...(primaryDetail ? { primary: primaryDetail } : {})}
                {...(characterData.windowDetails[activeSection] ? { sectionDetail: characterData.windowDetails[activeSection] } : {})}
                emptyTitle="Details"
                emptyMessage="Choose a character record to inspect."
              />
            </div>
          )}
        </div>
        {activeSection !== 'overview' && (
          <button
            type="button"
            onClick={() => setDetailOpen((current) => !current)}
            className="forged-icon-button absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"
            aria-label={detailOpen ? 'Hide information pane' : 'Show information pane'}
          >
            <Icon name="info" className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
