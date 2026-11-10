import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
const { EpochApp, shouldSelectNativeDevelopmentEntry } = await vite.ssrLoadModule('/src/EpochApp.tsx');

test('ordinary App requests native v3 only through the local development entry gate', () => {
  const element = App();
  assert.equal(element.type, EpochApp);
  assert.equal(element.props.developmentNativeV3, true);
  assert.equal(shouldSelectNativeDevelopmentEntry(true, true, '127.0.0.1', '/'), true);
  assert.equal(shouldSelectNativeDevelopmentEntry(true, true, 'localhost', '/index.html'), true);
  assert.equal(shouldSelectNativeDevelopmentEntry(true, true, '127.0.0.1', '/native-selected-session-qa.html'), false);
  assert.equal(shouldSelectNativeDevelopmentEntry(true, false, '127.0.0.1', '/'), false);
  assert.equal(shouldSelectNativeDevelopmentEntry(true, true, 'example.test', '/'), false);
  assert.equal(shouldSelectNativeDevelopmentEntry(false, true, '127.0.0.1', '/'), false);
});
