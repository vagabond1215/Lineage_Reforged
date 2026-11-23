import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(new URL('../../apps/rpg-ui/package.json', import.meta.url));
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const source = readFileSync(new URL('../../apps/rpg-ui/src/game-shell/components/AppShell.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
}).outputText;
const exports = {};
new Function('require', 'exports', compiled)(require, exports);

for (const [label, props, expected] of [
  ['absent', {}, 'mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6'],
  ['undefined', { contentInnerClassName: undefined }, 'mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6'],
  ['empty', { contentInnerClassName: '' }, ''],
  ['custom', { contentInnerClassName: 'custom-content' }, 'custom-content']
]) {
  test(`AppShell preserves ${label} content-class semantics`, () => {
    const html = renderToStaticMarkup(React.createElement(exports.AppShell, props, 'content'));
    assert.ok(html.includes(`<div class="${expected}">content</div>`), html);
  });
}
