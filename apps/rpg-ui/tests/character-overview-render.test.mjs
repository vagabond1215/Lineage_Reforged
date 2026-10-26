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
    assert.doesNotMatch(html, /aria-label="Character sections"/, 'the sheet has no redundant subsection bar');
    assert.doesNotMatch(html, /Back to Character/, 'the Overview does not need a return control');
    assert.match(html, /Manage Equipment/, 'equipment actions remain reachable from the matrix');
    assert.match(html, /character-sheet/);
    assert.doesNotMatch(html, /Name &amp; appearance|Equipped Gear/);
    assert.match(html, /lineage illustration, not a personal portrait/);
    assert.match(html, /<summary>Traits/);
    assert.match(html, /<dt>Height<\/dt><dd>170 cm<\/dd>/, 'physical identity comes from the saved character');
    const sheetStyles = readFileSync(new URL('../src/features/character-sheet.css', import.meta.url), 'utf8');
    assert.match(sheetStyles, /\.character-sheet-upper\s*\{[^}]*grid-template-columns:\s*minmax\(8\.5rem, 10\.5rem\) minmax\(0, 1fr\)/s);
    assert.match(sheetStyles, /\.character-sheet-art\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/s);
    assert.match(sheetStyles, /\.character-sheet-profile\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s, 'profile grid must stay within the mobile content column');
    assert.match(sheetStyles, /\.character-sheet-attribute-stack\s*\{[^}]*display:\s*grid/s);
    assert.match(sheetStyles, /\.character-sheet-attribute\s*\{[^}]*grid-template-columns:\s*3ch 3ch auto;[^}]*column-gap:\s*2ch/s, 'abbreviation and three-digit value use a two-character gap');
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
    const placedSlots = [...matrix.matchAll(/data-slot-id="([^"]+)" style="grid-area:([^"]+)"/g)].map((match) => [match[1], match[2]]);
    assert.deepEqual(placedSlots, [
      ['slot.accessory.ear', 'ear'], ['slot.armor.head', 'head'], ['slot.accessory.eyes', 'eyes'],
      ['slot.armor.shoulder', 'shoulder'], ['slot.accessory.neck', 'neck'],
      ['slot.armor.arm', 'arm'], ['slot.armor.chest', 'chest'], ['slot.accessory.arms', 'arms'],
      ['slot.weapon.left', 'offhand'], ['slot.armor.hand', 'hands'], ['slot.armor.waist', 'waist'],
      ['slot.accessory.waist', 'belt'], ['slot.weapon.right', 'weapon'],
      ['slot.accessory.fingers', 'fingers'], ['slot.armor.leg', 'legs'],
      ['slot.armor.foot', 'feet'], ['slot.accessory.ankle', 'ankle']
    ], 'all canonical slots appear once in body order for keyboard traversal');
    assert.deepEqual(new Set(placedSlots.map(([id]) => id)), new Set(entries.map((entry) => entry.slotId)));
    assert.equal((matrix.match(/class="character-sheet-slot-fallback"/g) ?? []).length, entries.filter((entry) => entry.item).length);
    assert.doesNotMatch(matrix, />Empty(?: Slot)?</);
    for (const entry of entries) assert.ok(matrix.includes(`Inspect ${entry.slotLabel} slot:`), `${entry.slotLabel} is inspectable`);
    assert.ok(upper.indexOf('character-sheet-equipment-matrix') < upper.indexOf('character-sheet-progression'), 'progression fills the right column below equipment');
    const illustratedEntry = { ...entries.find((entry) => entry.item), artworkUrl: '/character-creator/lineages/lineage-human.png' };
    const artHtml = renderToStaticMarkup(React.createElement(EquipmentSlotPreview, { entry: illustratedEntry, onInspect: () => {} }));
    assert.match(artHtml, /<img[^>]*src="\/character-creator\/lineages\/lineage-human.png"/, 'controlled available asset renders');
    assert.doesNotMatch(artHtml, /character-sheet-slot-fallback/);
    assert.match(renderToStaticMarkup(React.createElement(EquipmentSlotPreview, { entry: { ...illustratedEntry, artworkUrl: null }, onInspect: () => {} })), /character-sheet-slot-fallback/);
    assert.equal((html.match(/<details class="character-sheet-expandable"/g) ?? []).length, 8, 'all records and earned titles remain independently expandable');
    for (const name of ['Skills', 'Traits', 'Effects', 'Echo &amp; Growth', 'Standing', 'Reputation', 'Discoveries']) assert.match(html, new RegExp(`<summary>${name}`));
    for (const name of ['Skills', 'Standing', 'Reputation', 'Discoveries']) assert.match(html, new RegExp(`View ${name}`), `${name} detailed view remains reachable`);
    assert.match(sheetStyles, /\.character-sheet-equipment-matrix\s*\{[^}]*repeat\(5, minmax\(0, 1fr\)\)/s);
    const equipmentRows = ['. ear head eyes .', '. shoulder neck . .', '. arm chest arms .', 'offhand hands waist belt weapon', '. fingers legs . .', '. . feet ankle .'];
    const areaBlock = sheetStyles.match(/grid-template-areas:([\s\S]*?);/)?.[1] ?? '';
    for (const [index, row] of equipmentRows.entries()) {
      assert.ok(areaBlock.includes(`"${row}"`), `body row ${index + 1} remains placed`);
    }
    assert.match(sheetStyles, /\.character-sheet-slot\s*\{[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*background:\s*transparent/s, 'slot button has no outer container box');
    assert.match(sheetStyles, /\.character-sheet-slot-frame\s*\{[^}]*width:\s*3\.525rem;[^}]*height:\s*3\.525rem/s, 'desktop item frame is 50% larger');
    assert.match(sheetStyles, /\.character-sheet-slot:focus-visible\s*\{[^}]*outline:\s*2px/s, 'borderless slots retain a visible keyboard focus ring');
    assert.match(sheetStyles, /@media \(max-width: 390px\)[\s\S]*?\.character-sheet-slot-frame\s*\{[^}]*width: 2\.85rem; height: 2\.85rem/, 'narrow item frame is 50% larger');
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
      sparseSnapshot.playerState.attributes[key] = index === 0 ? 123 : 21 + index;
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
    assert.doesNotMatch(sparseHtml, /aria-label="Character sections"/);
    assert.match(sparseHtml, /<summary>Standing <span>2<\/span><\/summary>/, 'unrelated owner records survive a sparse inventory');
    assert.doesNotMatch(sparseHtml, /Other Earned Titles|Title:|Background:/);
    assert.doesNotMatch(sparseHtml, />Empty(?: Slot)?</);
    assert.doesNotMatch(sparseHtml, /<dt>Height<\/dt>|<dt>Hair<\/dt>/);
    const sparseMatrix = sparseHtml.match(/<div class="character-sheet-equipment-matrix"[\s\S]*?<\/div>/)?.[0] ?? '';
    assert.doesNotMatch(sparseMatrix, /<img|>Empty(?: Slot)?</);
    const sparseAttributeButtons = [...sparseHtml.matchAll(/<button[^>]*aria-expanded="false"[^>]*>(.*?)<\/button>/gs)];
    assert.equal(sparseAttributeButtons.length, 9);
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      assert.ok(sparseAttributeButtons[index][1].includes(`>${index === 0 ? 123 : 21 + index}</span>`), `${key} changed owner value`);
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
    const equipmentHtml = renderToStaticMarkup(React.createElement(GameSessionProvider, {
      accountProfile: createDefaultAccountProfileState(), snapshot: demoSnapshot, campaignSessionControl: {}, onSnapshotChange: () => {}
    }, React.createElement(CharacterPanel, {
      accent: 'var(--color-character)', searchQuery: '', pinnedIds: [], onTogglePin: () => {}, initialSection: 'equipment'
    })));
    assert.match(equipmentHtml, /Back to Character/);
    assert.match(equipmentHtml, /Equipment Loadout/, 'the detailed equipment view remains available');
    assert.doesNotMatch(equipmentHtml, /aria-label="Character sections"/);
  } finally {
    await vite.close();
  }
});
