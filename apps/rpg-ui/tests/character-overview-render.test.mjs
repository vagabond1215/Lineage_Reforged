import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';

test('Character Overview renders owner-backed identity, nine attributes and section routes', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ CharacterPanel }, { GameSessionProvider }, { useUiViewModel }, { demoSnapshot }, { createDefaultAccountProfileState }] = await Promise.all([
      vite.ssrLoadModule('/src/features/CharacterPanel.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/UiViewModelContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts')
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
    assert.match(html, /Name &amp; appearance/);
    assert.match(html, /lineage illustration, not a personal portrait/);
    assert.match(html, /Traits &amp; Effects/);
    assert.match(html, /<dt>Height<\/dt><dd>170 cm<\/dd>/, 'physical identity comes from the saved character');
    const sheetStyles = readFileSync(new URL('../src/features/character-sheet.css', import.meta.url), 'utf8');
    assert.match(sheetStyles, /grid-template-columns:\s*repeat\(12, minmax\(0, 1fr\)\)/);
    assert.match(sheetStyles, /\.character-sheet-attribute-grid\s*\{[^}]*repeat\(3, minmax\(0, 1fr\)\)/s);
    assert.match(sheetStyles, /@media \(max-width: 600px\)/);
    assert.match(html, /View Skills/);
    assert.match(html, /View Equipment/);
    assert.match(html, new RegExp(demoSnapshot.playerState.coreData.playerName));
    assert.match(html, new RegExp(demoSnapshot.playerState.originProfile.lineageLabel));
    assert.match(html, /Background: Local Champion/, 'show the canonical backstory label');
    assert.match(html, /Origin -1/);
    assert.match(html, /Origin \+1/);
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
      assert.ok(button.includes(getCharacterAttributePresentation(key).fullName), `${key} name`);
      assert.ok(button.includes(`>${demoSnapshot.playerState.attributes[key]}</span>`), `${key} current value`);
    }
    assert.doesNotMatch(html, /Runtime Bridge|Core Stats|Stamina Regen|Recovery Projection|Field Shortcuts/);

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
    assert.match(sparseHtml, /Equipment/);
    assert.doesNotMatch(sparseHtml.match(/<nav aria-label="Character sections"[\s\S]*?<\/nav>/)?.[0] ?? '', /Inventory/);
    assert.doesNotMatch(sparseHtml, /Other Earned Titles|Title:|Background:/);
    assert.match(sparseHtml, /No gear equipped/);
    assert.doesNotMatch(sparseHtml, /<dt>Height<\/dt>|<dt>Hair<\/dt>/);
    const sparseAttributeButtons = [...sparseHtml.matchAll(/<button[^>]*aria-expanded="false"[^>]*>(.*?)<\/button>/gs)];
    assert.equal(sparseAttributeButtons.length, 9);
    for (const [index, key] of CHARACTER_ATTRIBUTE_ORDER.entries()) {
      assert.ok(sparseAttributeButtons[index][1].includes(`>${21 + index}</span>`), `${key} changed owner value`);
    }
  } finally {
    await vite.close();
  }
});
