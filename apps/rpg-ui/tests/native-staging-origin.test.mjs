import assert from 'node:assert/strict';
import test from 'node:test';
import { validateNativeStagingOrigin, validateNativeStagingPreviewOrigin } from '../nativeStagingOrigin.ts';

const staging = 'https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site';
const production = 'https://lineage-reforged-preview.vagabond1215.chatgpt.site';

test('staging build requires one distinct HTTPS origin', () => {
  assert.equal(validateNativeStagingOrigin(staging), staging);
  for (const invalid of ['', production, 'http://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site',
    'https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site/path',
    'https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site?candidate']) {
    assert.throws(() => validateNativeStagingOrigin(invalid));
  }
});
test('local preview accepts only an exact loopback origin', () => {
  assert.equal(validateNativeStagingPreviewOrigin('http://127.0.0.1:5298'), 'http://127.0.0.1:5298');
  for (const invalid of [staging, production, 'http://example.test:5298',
    'http://127.0.0.1:5298/path', 'http://127.0.0.1']) {
    assert.throws(() => validateNativeStagingPreviewOrigin(invalid));
  }
});
