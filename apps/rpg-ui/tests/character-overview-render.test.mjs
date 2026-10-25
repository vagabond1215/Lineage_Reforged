import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';

test('Character Overview renders owner-backed identity, nine attributes and section routes', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ CharacterPanel, EquipmentSlotPreview }, { GameSessionProvider }, { useUiViewModel }, { demoSnapshot }, { createDefaultAccountProfileState }, { buildEquipmentEntries }] = await Promise.all([
      vite.ssrLoadModule('/src/features/CharacterPanel.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/UiViewModelContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts')
    ]);
    const { CHARACTER_ATTRIBUTE_ORDER, getCharacterAttributePresentation } = await vite.ssrLoadModule('/src/game-shell/characterAttributes.ts');
    const before = JSON.stringify(demoSnapshot);
    const html = renderToStaticMarkup(
      React.createElement(GameSessionProvider, {
        accountProfile: createDefaultAccountProfileState(),
        snapshot: demoSnapshot,
        campaignSessionControl: {},
        onSnapshotChange: () => {}
      }, React.createElement(CharacterPanel, {
        accent: 'var(--color-character)',
        searchQuery: '',
        pinnedIds: [],
        onTogglePin: () => {}
      }))
    );

    assert.equal(JSON.stringify(demoSnapshot), before, 'render must not mutate the snapshot');
    assert.match(html, /aria-label="Character sections"/);
    assert.match(html, /aria-current="page"[^>]*>Overview/);
    const characterSections = html.match(/<nav aria-label="Character sections"[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert.doesNotMatch(characterSections, />Attributes(?:<|\s)/, 'attribute details live on Overview');
    assert.doesNotMatch(characterSections, /Geographic Knowledge|Atlas/, 'Atlas lives in Codex');
    assert.match(html, /Equipment/);
    assert.doesNotMatch(html.match(/<nav aria-label="Character sections"[\s\S]*?<\/nav>/)?.[0] ?? '', /Inventory/, 'Inventory is a main dock destination');
    assert.match(html, /character-sheet/);
    assert.doesNotMatch(html, /Name &amp; appearance|Equipped Gear/);
    assert.match(html, /lineage illustration, not a personal portrait/);
    assert.match(html, /<summary>Traits/);
    assert.match(html, /<dt>Height<\/dt><dd>170 cm<\/dd>/, 'physical identity comes from the saved character');
    const sheetStyles = readFileSync(new URL('../src/features/character-sheet.css', import.meta.url), 'utf8');
    assert.match(sheetStyles, /\.character-sheet-upper\s*\{[^}]*grid-template-columns:\s*minmax\(8\.5rem, 10\.5rem\) minmax\(0, 1fr\)/s);
    assert.match(sheetStyles, /\.character-sheet-art\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/s);
    assert.match(sheetStyles, /\.character-sheet-attribute-stack\s*\{[^}]*display:\s*grid/s);
    assert.match(sheetStyles, /@media \(max-width: 640px\)/);
    assert.match(html, /View Skills/);
    assert.match(html, /aria-label="Equipped item slots"/);
    assert.match(html, new RegExp(demoSnapshot.playerState.coreData.playerName));
    assert.match(html, new RegExp(demoSnapshot.playerState.originProfile.lineageLabel));
    assert.match(html, /<dt>Background<\/dt><dd>Local Champion<\/dd>/, 'show the canonical backstory label');
    assert.match(html, /origin adjustment -1/);
    assert.match(html, /origin adjustment \+1/);
    let projectedAttributes;
    let projectedNav;
    let viewModelCharacterSections;
    renderToStaticMarkup(React.createElement(GameSessionProvider, {
      accountProfile: createDefaultAccountProfileState(),
      snapshot: demoSnapshot,
      campaignSessionControl: {},
      onSnapshotChange: () => {}
    }, React.createElement(() => {
      const viewModel = useUiViewModel();
      projectedAttributes = viewModel.character.lists.attributes;
      projectedNav = viewModel.navItems;
      viewModelCharacterSections = viewModel.character.sections;
      return null;
    })));
    assert.equal(projectedAttributes.length, 9);
    assert.ok(!viewModelCharacterSections.some((section) => section.id === 'attributes' || section.id === 'geographic-knowledge'));
    assert.deepEqual(projectedNav.map((item) => item.id), ['character', 'inventory', 'world', 'activity', 'codex', 'quests', 'chronicle']);
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      const detail = projectedAttributes[index];
      assert.equal(detail.id, `attr.${key.toLowerCase()}`);
      assert.match(detail.detailSummary, new RegExp(`currently sits at ${demoSnapshot.playerState.attributes[key]}`));
      assert.equal(detail.detailGroups[0].entries[0].value, String(demoSnapshot.playerState.attributes[key]));
    }

    const attributeButtons = [...html.matchAll(/<button[^>]*aria-expanded="false"[^>]*>(.*?)<\/button>/gs)];
    assert.equal(attributeButtons.length, 9);
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      const button = attributeButtons[index][1];
      assert.ok(button.includes(key), `${key} abbreviation`);
      assert.ok(attributeButtons[index][0].includes(getCharacterAttributePresentation(key).fullName), `${key} accessible name`);
      assert.ok(button.includes(`>${demoSnapshot.playerState.attributes[key]}</span>`), `${key} current value`);
    }
    assert.doesNotMatch(html, /Runtime Bridge|Core Stats|Stamina Regen|Recovery Projection|Field Shortcuts/);
    const upper = html.match(/<section class="character-sheet-upper"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.ok(upper.indexOf('character-sheet-art') < upper.indexOf('character-sheet-attribute-stack'));
    assert.ok(upper.indexOf('character-sheet-attribute-stack') < upper.indexOf('character-sheet-profile'), 'narrow reading order');
    assert.doesNotMatch(upper, />Physical<|>Mental<|>Social<|>Identity<|>Appearance</);
    for (const label of ['Lineage', 'Background', 'Sex', 'Age', 'Height', 'Build', 'Nature', 'Focus', 'Hair', 'Eyes', 'Skin']) {
      assert.match(upper, new RegExp(`<dt>${label}<\\/dt>`), `${label} is projected when saved`);
    }
    const entries = buildEquipmentEntries(demoSnapshot);
    assert.equal(entries.length, 17);
    const matrix = upper.match(/<div class="character-sheet-equipment-matrix"[\s\S]*?<\/div>/)?.[0] ?? '';
    assert.equal((matrix.match(/class="character-sheet-slot /g) ?? []).length, 17);
    assert.equal((matrix.match(/class="character-sheet-slot-frame"/g) ?? []).length, 17);
    assert.equal((matrix.match(/class="character-sheet-slot-fallback"/g) ?? []).length, entries.filter((entry) => entry.item).length);
    assert.doesNotMatch(matrix, />Empty(?: Slot)?</);
    for (const entry of entries) assert.ok(matrix.includes(`Inspect ${entry.slotLabel} slot:`), `${entry.slotLabel} is inspectable`);
    assert.ok(upper.indexOf('character-sheet-equipment-matrix') < upper.indexOf('character-sheet-progression'), 'progression fills the right column below equipment');
    const illustratedEntry = { ...entries.find((entry) => entry.item), artworkUrl: '/character-creator/lineages/lineage-human.png' };
    const artHtml = renderToStaticMarkup(React.createElement(EquipmentSlotPreview, { entry: illustratedEntry, onInspect: () => {} }));
    assert.match(artHtml, /<img[^>]*src="\/character-creator\/lineages\/lineage-human.png"/, 'controlled available asset renders');
    assert.doesNotMatch(artHtml, /character-sheet-slot-fallback/);
    assert.match(renderToStaticMarkup(React.createElement(EquipmentSlotPreview, { entry: { ...illustratedEntry, artworkUrl: null }, onInspect: () => {} })), /character-sheet-slot-fallback/);
    assert.equal((html.match(/<details class="character-sheet-expandable"/g) ?? []).length, 5, 'existing earned titles remain independently expandable');
    for (const name of ['Skills', 'Traits', 'Effects', 'Echo &amp; Growth']) assert.match(html, new RegExp(`<summary>${name}`));
    assert.match(sheetStyles, /\.character-sheet-equipment-matrix\s*\{[^}]*repeat\(auto-fill, minmax\(5\.1rem, 1fr\)\)/s);
    assert.match(sheetStyles, /@media \(max-width: 640px\)[\s\S]*?\.character-sheet-upper\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);

    const sparseSnapshot = structuredClone(demoSnapshot);
    sparseSnapshot.playerState.skills = [];
    sparseSnapshot.playerState.titles = [];
    sparseSnapshot.playerState.coreData.backstoryId = 'backstory.not_in_catalog';
    sparseSnapshot.playerState.coreData.identityProfile = null;
    sparseSnapshot.playerState.inventory.bags = [];
    sparseSnapshot.playerState.inventory.overflow = [];
    for (const slot of Object.keys(sparseSnapshot.playerState.equipment)) {
      sparseSnapshot.playerState.equipment[slot] = null;
    }
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      sparseSnapshot.playerState.attributes[key] = 21 + index;
    }
    const sparseHtml = renderToStaticMarkup(
      React.createElement(GameSessionProvider, {
        accountProfile: createDefaultAccountProfileState(),
        snapshot: sparseSnapshot,
        campaignSessionControl: {},
        onSnapshotChange: () => {}
      }, React.createElement(CharacterPanel, {
        accent: 'var(--color-character)',
        searchQuery: '',
        pinnedIds: [],
        onTogglePin: () => {}
      }))
    );
    assert.match(sparseHtml, /No developed skills yet/);
    assert.equal((sparseHtml.match(/class="character-sheet-slot is-unoccupied"/g) ?? []).length, 17);
    assert.doesNotMatch(sparseHtml.match(/<nav aria-label="Character sections"[\s\S]*?<\/nav>/)?.[0] ?? '', /Inventory/);
    assert.doesNotMatch(sparseHtml, /Other Earned Titles|Title:|Background:/);
    assert.doesNotMatch(sparseHtml, />Empty(?: Slot)?</);
    assert.doesNotMatch(sparseHtml, /<dt>Height<\/dt>|<dt>Hair<\/dt>/);
    const sparseMatrix = sparseHtml.match(/<div class="character-sheet-equipment-matrix"[\s\S]*?<\/div>/)?.[0] ?? '';
    assert.doesNotMatch(sparseMatrix, /<img|>Empty(?: Slot)?</);
    const sparseAttributeButtons = [...sparseHtml.matchAll(/<button[^>]*aria-expanded="false"[^>]*>(.*?)<\/button>/gs)];
    assert.equal(sparseAttributeButtons.length, 9);
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      assert.ok(sparseAttributeButtons[index][1].includes(`>${21 + index}</span>`), `${key} changed owner value`);
    }
    const progressed = structuredClone(demoSnapshot);
    progressed.playerState.skills = Array.from({ length: 18 }, (_, index) => ({ id: `skill.test.extra_${index}`, rank: index + 1, source: 'trained' }));
    progressed.playerState.traits = Array.from({ length: 12 }, (_, index) => ({ id: `trait.test.extra_${index}`, source: 'lineage' }));
    progressed.playerState.activeEffects = Array.from({ length: 11 }, (_, index) => `Effect ${index}`);
    const progressedHtml = renderToStaticMarkup(React.createElement(GameSessionProvider, {
      accountProfile: createDefaultAccountProfileState(),
      snapshot: progressed,
      campaignSessionControl: {},
      onSnapshotChange: () => {}
    }, React.createElement(CharacterPanel, {
      accent: 'var(--color-character)', searchQuery: '', pinnedIds: [], onTogglePin: () => {}
    })));
    assert.match(progressedHtml, /Extra 17/);
    assert.match(progressedHtml, /Effect 10/);
    assert.match(progressedHtml, /<summary>Skills <span>18<\/span><\/summary>/);
    assert.match(progressedHtml, /<summary>Traits <span>12<\/span><\/summary>/);
  } finally {
    await vite.close();
  }
});
