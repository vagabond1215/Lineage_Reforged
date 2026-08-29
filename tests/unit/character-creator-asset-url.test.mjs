import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CHARACTER_CREATOR_ASSET_BASE_URL,
  CHARACTER_CREATOR_ASSET_SOURCE_COMMIT,
  resolveCharacterCreatorAssetUrl
} from '../../apps/rpg-ui/src/game-shell/characterCreatorAssetUrl.ts';

const lineagePath = '/character-creator/lineages/lineage-human.png';

test('character creator assets remain local outside production builds', () => {
  assert.equal(
    resolveCharacterCreatorAssetUrl(lineagePath, { production: false }),
    lineagePath
  );
});

test('production character creator assets use the immutable public GitHub source', () => {
  assert.equal(CHARACTER_CREATOR_ASSET_SOURCE_COMMIT.length, 40);
  assert.equal(
    resolveCharacterCreatorAssetUrl(lineagePath, { production: true }),
    `${CHARACTER_CREATOR_ASSET_BASE_URL}${lineagePath}`
  );
});

test('a production asset base can be replaced without duplicate separators', () => {
  assert.equal(
    resolveCharacterCreatorAssetUrl(lineagePath, {
      production: true,
      baseUrl: 'https://assets.example.test/game///'
    }),
    `https://assets.example.test/game${lineagePath}`
  );
});

test('the resolver does not rewrite unrelated public assets', () => {
  const launcherPath = '/launcher/character-active.png';

  assert.equal(
    resolveCharacterCreatorAssetUrl(launcherPath, { production: true }),
    launcherPath
  );
});
