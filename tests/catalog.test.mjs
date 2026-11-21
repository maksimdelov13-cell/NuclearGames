import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), '..');
const publicDir = path.join(root, 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(publicDir, 'assets/app.js'), 'utf8');
test('both Telegram Mini Apps are linked', () => {
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/sipm_tetris/);
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/isotopes256/);
  assert.equal((html.match(/class="game-card game-card--/g) ?? []).length, 2);
});
test('no images or page assets are missing', () => {
  const files = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(x => x[1]);
  for (const f of files) assert.ok(fs.existsSync(path.join(publicDir, f)), `${f} missing`);
});
test('Telegram internal navigation and ordinary link fallback exist', () => {
  assert.match(html, /data-telegram-app/);
  assert.match(js, /openTelegramLink/);
});
