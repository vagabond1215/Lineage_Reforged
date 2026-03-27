import { useMemo, useState } from 'react';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';
import { Tooltip } from '../components/ui/Tooltip';
import { Icon } from '../components/icons';
import { useGameSession } from '../runtime/GameSessionContext';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import {
  buildCharacterSectionItems,
  buildEquipmentEntries,
  buildInventoryEntries,
  buildSkillItems,
  buildTraitEffectItems,
  equipInventoryItem,
  getFavoriteItemKeys,
  getInventoryCategories,
  getTrackedSkill,
  sortInventoryEntries,
  toggleFavoriteItem,
  toggleTrackedSkill,
  unequipItem,
  type CharacterInventoryCategory,
  type CharacterInventorySort,
  type CharacterPanelNotice
} from './characterPanelState';
import { matchesQuery, toneClasses } from '../utils';
import type { ListItem } from '../types';

type CharacterPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

function ActionButton({
  label,
  onClick,
  disabled = false,
  tone = 'neutral'
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
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
      className={`rounded-full border px-4 py-2 text-sm transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-50`}
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
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`rounded-full border p-2 transition ${
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

export function CharacterPanel({
  accent,
  searchQuery,
  pinnedIds,
  onTogglePin
}: CharacterPanelProps) {
  const { snapshot, updateSnapshot } = useGameSession();
  const characterData = useUiViewModel().character;
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({});
  const [inventoryCategory, setInventoryCategory] = useState<CharacterInventoryCategory>('all');
  const [inventorySort, setInventorySort] = useState<CharacterInventorySort>('default');
  const [panelNotice, setPanelNotice] = useState<CharacterPanelNotice | null>(null);

  const skillItems = useMemo(() => buildSkillItems(snapshot), [snapshot]);
  const equipmentEntries = useMemo(() => buildEquipmentEntries(snapshot), [snapshot]);
  const inventoryEntries = useMemo(() => buildInventoryEntries(snapshot), [snapshot]);
  const traitItems = useMemo(() => buildTraitEffectItems(snapshot), [snapshot]);
  const favoriteItemKeys = useMemo(() => getFavoriteItemKeys(snapshot), [snapshot]);
  const trackedSkillId = getTrackedSkill(snapshot);

  const sectionItems = useMemo(
    () =>
      buildCharacterSectionItems({
        attributes: characterData.lists.attributes.length,
        skills: skillItems.length,
        equipment: equipmentEntries.filter((entry) => entry.item).length,
        inventory: inventoryEntries.length,
        traits: traitItems.length,
        reputation: characterData.lists.reputation.length,
        discoveries: characterData.lists.discoveries.length
      }),
    [characterData.lists.attributes.length, characterData.lists.discoveries.length, characterData.lists.reputation.length, equipmentEntries, inventoryEntries.length, skillItems.length, traitItems.length]
  );

  const attributeItems = characterData.lists.attributes.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const reputationItems = characterData.lists.reputation.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const discoveryItems = characterData.lists.discoveries.filter((item) =>
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

    return sortInventoryEntries(bySearch, inventorySort, favoriteItemKeys);
  }, [favoriteItemKeys, inventoryCategory, inventoryEntries, inventorySort, searchQuery]);

  const selectedAttribute = attributeItems.find((item) => item.id === selectedIds.attributes) ?? attributeItems[0];
  const selectedSkill = filteredSkillItems.find((item) => item.id === selectedIds.skills) ?? filteredSkillItems[0];
  const selectedEquipment = filteredEquipmentEntries.find((entry) => entry.id === selectedIds.equipment) ?? filteredEquipmentEntries[0];
  const selectedInventory = filteredInventoryEntries.find((entry) => entry.id === selectedIds.inventory) ?? filteredInventoryEntries[0];
  const selectedTrait = filteredTraitItems.find((item) => item.id === selectedIds.traits) ?? filteredTraitItems[0];
  const selectedReputation = reputationItems.find((item) => item.id === selectedIds.reputation) ?? reputationItems[0];
  const selectedDiscovery = discoveryItems.find((item) => item.id === selectedIds.discoveries) ?? discoveryItems[0];

  const primaryDetail =
    activeSection === 'overview'
      ? characterData.overviewDetail
      : activeSection === 'attributes'
        ? toDetail(selectedAttribute)
        : activeSection === 'skills'
          ? toDetail(selectedSkill)
          : activeSection === 'equipment'
            ? selectedEquipment?.detail
            : activeSection === 'inventory'
              ? selectedInventory?.detail
              : activeSection === 'traits'
                ? toDetail(selectedTrait)
                : activeSection === 'reputation'
                  ? toDetail(selectedReputation)
                  : toDetail(selectedDiscovery);

  const applyNotice = (nextSnapshot: typeof snapshot, notice: CharacterPanelNotice) => {
    updateSnapshot(nextSnapshot);
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
    <div className={`rounded-[22px] border px-4 py-3 ${toneClasses(panelNotice.tone)}`}>
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
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(sectionKey, id)}
        pinnedIds={pinnedIds}
        onTogglePin={onTogglePin}
        accent={accent}
        emptyMessage={emptyMessage}
      />
    </div>
  );

  const overviewMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <Card title="Progression Snapshot" accent={accent}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {characterData.overviewMetrics.map((metric) => (
            <div key={metric.id} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
              <div className="mt-2 text-2xl text-slate-50">{metric.value}</div>
              <div className="mt-2 text-sm text-slate-400">{metric.detail}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Core Stats" accent={accent}>
        <div className="rounded-[22px] border border-white/8 bg-black/10">
          {characterData.coreStats.map((metric) => (
            <div
              key={metric.id}
              className="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3 last:border-b-0"
            >
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
                <div className="mt-1 text-sm text-slate-400">{metric.detail}</div>
              </div>
              <div className="text-xl font-semibold text-slate-50">{metric.value}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Active Effects" accent={accent}>
          <div className="flex flex-wrap gap-2">
            {characterData.activeEffects.map((effect) => (
              <span key={effect} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                {effect}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Field Shortcuts" accent={accent}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-black/10 p-3 text-sm text-slate-300">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tracked Skill</div>
              <div className="mt-2 text-base text-slate-50">{trackedSkillId ? trackedSkillId.split('.').at(-1)?.replace(/_/g, ' ') : 'None'}</div>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-black/10 p-3 text-sm text-slate-300">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Favorite Items</div>
              <div className="mt-2 text-base text-slate-50">{favoriteItemKeys.size}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const skillsMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <Card title="Skill Actions" accent={accent}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            {selectedSkill ? `${selectedSkill.title} can be tracked for quick focus.` : 'Select a skill to manage it.'}
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label={trackedSkillId === selectedSkill?.id ? 'Clear Tracked Skill' : 'Mark Tracked Skill'}
              onClick={() => {
                if (!selectedSkill) return;
                const nextSnapshot = toggleTrackedSkill(snapshot, selectedSkill.id);
                applyNotice(nextSnapshot, {
                  tone: 'accent',
                  title: getTrackedSkill(nextSnapshot) === selectedSkill.id ? 'Skill Tracked' : 'Tracked Skill Cleared',
                  detail: `${selectedSkill.title} ${getTrackedSkill(nextSnapshot) === selectedSkill.id ? 'is now tracked.' : 'is no longer tracked.'}`
                });
              }}
              disabled={!selectedSkill}
              tone="accent"
            />
            <ActionButton
              label={selectedSkill && pinnedIds.includes(selectedSkill.id) ? 'Unpin Skill' : 'Pin Skill'}
              onClick={() => selectedSkill && onTogglePin(selectedSkill.id)}
              disabled={!selectedSkill}
            />
          </div>
        </div>
      </Card>
      <SelectionList
        title="Skill Ledger"
        items={filteredSkillItems}
        selectedId={selectedSkill?.id}
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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipmentEntries.map((entry) => {
            const isSelected = entry.id === selectedEquipment?.id;
            const isPinned = pinnedIds.includes(entry.id);
            const isFavorite = entry.item ? favoriteItemKeys.has(entry.item.itemKey) : false;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedId('equipment', entry.id)}
                className={`rounded-[22px] border p-4 text-left transition ${
                  isSelected ? 'border-white/20 bg-white/10' : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/6'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{entry.slotLabel}</div>
                    <div className="mt-2 text-base font-semibold text-slate-50">{entry.itemTitle}</div>
                  </div>
                  {entry.item && (
                    <div className="flex items-center gap-2">
                      <ItemStarButton active={isFavorite} onToggle={() => toggleFavorite(entry.item!.itemKey, entry.itemTitle)} />
                      <FavoriteButton active={isPinned} onToggle={() => onTogglePin(entry.id)} />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses(entry.item ? 'accent' : 'neutral')}`}>
                    {entry.item ? 'Equipped' : 'Empty'}
                  </span>
                  {entry.item?.durability !== undefined && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                      {Math.round(entry.item.durability * 100)}% durability
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="Equipment Actions" accent={accent}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            {selectedEquipment?.item ? `${selectedEquipment.itemTitle} is selected.` : 'Select a slot to inspect it.'}
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Unequip Item"
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
          </div>
        </div>
      </Card>
    </div>
  );

  const inventoryCategories = getInventoryCategories(inventoryEntries);
  const inventoryMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      {noticeBlock}
      <Card title="Inventory Controls" accent={accent}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {inventoryCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setInventoryCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  inventoryCategory === category ? 'border-white/20 bg-white/10 text-slate-50' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {category === 'all' ? 'All' : category[0]!.toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['default', 'name', 'quantity', 'category', 'favorites'] as CharacterInventorySort[]).map((sortId) => (
              <button
                key={sortId}
                type="button"
                onClick={() => setInventorySort(sortId)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
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
        <div className="space-y-3">
          {filteredInventoryEntries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
              No carried items match the active filters.
            </div>
          )}
          {filteredInventoryEntries.map((entry) => {
            const isSelected = entry.id === selectedInventory?.id;
            const isPinned = pinnedIds.includes(entry.id);
            const isFavorite = favoriteItemKeys.has(entry.itemKey);

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedId('inventory', entry.id)}
                className={`w-full rounded-[22px] border p-4 text-left transition ${
                  isSelected ? 'border-white/20 bg-white/10' : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/6'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-50">{entry.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{entry.containerLabel}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ItemStarButton active={isFavorite} onToggle={() => toggleFavorite(entry.itemKey, entry.title)} />
                    <FavoriteButton active={isPinned} onToggle={() => onTogglePin(entry.id)} />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">x{entry.quantity}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">{entry.category}</span>
                  {entry.preferredSlotId && <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses('accent')}`}>Equipable</span>}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="Item Actions" accent={accent}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            {selectedInventory ? `${selectedInventory.title} is selected.` : 'Select a stack to manage it.'}
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Equip Item"
              onClick={() => {
                if (!selectedInventory) {
                  return;
                }

                const result = equipInventoryItem(snapshot, selectedInventory);
                applyNotice(result.snapshot, result.notice);
              }}
              disabled={!selectedInventory?.preferredSlotId}
              tone="accent"
            />
            <ActionButton
              label={selectedInventory && favoriteItemKeys.has(selectedInventory.itemKey) ? 'Unfavorite Item' : 'Favorite Item'}
              onClick={() => selectedInventory && toggleFavorite(selectedInventory.itemKey, selectedInventory.title)}
              disabled={!selectedInventory}
            />
            <Tooltip content="Consumable use hooks are not wired into the simulation yet.">
              <span className="inline-flex">
                <ActionButton label="Use Consumable" disabled tone="warning" />
              </span>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  );

  const mainContent =
    activeSection === 'overview'
      ? overviewMain
      : activeSection === 'attributes'
        ? listSection('Attributes', attributeItems, selectedAttribute?.id, 'attributes', 'No attributes match the active search.')
        : activeSection === 'skills'
          ? skillsMain
          : activeSection === 'equipment'
            ? equipmentMain
            : activeSection === 'inventory'
              ? inventoryMain
              : activeSection === 'traits'
                ? listSection('Traits And Effects', filteredTraitItems, selectedTrait?.id, 'traits', 'No traits or effects match the active search.')
                : activeSection === 'reputation'
                  ? listSection('Reputation', reputationItems, selectedReputation?.id, 'reputation', 'No reputation records match the active search.')
                  : listSection('Discoveries', discoveryItems, selectedDiscovery?.id, 'discoveries', 'No discoveries match the active search.');

  return (
    <PanelLayout
      leftSidebar={
        <SidebarMenu
          title="Character"
          items={sectionItems}
          activeId={activeSection}
          onChange={(id) => {
            setActiveSection(id);
            setPanelNotice(null);
          }}
          accent={accent}
        />
      }
      mainContent={mainContent}
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={characterData.windowDetails[activeSection]}
          emptyTitle="Details"
          emptyMessage="Choose a character record to inspect."
        />
      }
    />
  );
}
