import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), '..');
const publicDir = root;
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(publicDir, 'assets/app.js'), 'utf8');
test('both Telegram Mini Apps are linked', () => {
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/sipm_tetris/);
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/isotopes256/);
  assert.equal((html.match(/class="game-card game-card--/g) ?? []).length, 2);
});
test('no images or page assets are missing', () => {
  const files = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(x => x[1].split('?')[0]);
  for (const f of files) assert.ok(fs.existsSync(path.join(publicDir, f)), `${f} missing`);
});
test('Telegram internal navigation and ordinary link fallback exist', () => {
  assert.match(html, /data-telegram-app/);
  assert.match(js, /openTelegramLink/);
});

test('INPHE visual content and footer', () => {
  assert.match(html, /<h1 id="page-title">Научные игры<\/h1>/);
  assert.doesNotMatch(html, /Интерактивные научные эксперименты|header-university|Продолжение следует/);
  assert.match(html, /Физика элементарных частиц/);
  assert.match(html, /Ядерная физика/);
  assert.doesNotMatch(html, /class="game-card__eyebrow">Физика частиц/);
  assert.match(html, /Уже в разработке/);
  assert.match(html, /Атомно-зондовая микроскопия/);
  assert.match(html, /https:\/\/gonuclear\.mephi\.ru\//);
  assert.match(html, /https:\/\/t\.me\/inphemephi/);
  const css = fs.readFileSync(path.join(publicDir, 'assets/styles.css'), 'utf8');
  assert.match(css, /background: #fff/);
  assert.match(css, /--blue: #0055bb/);
  assert.match(html, /Ядерный сайт/);
  assert.match(html, /Портал ядерных абитуриентов/);
  assert.match(html, /class="section-rule"/);
  assert.match(html, /feColorMatrix/);
  assert.match(css, /brand__logo/);
  assert.match(css, /section-rule/);
  assert.match(html, /styles\.css\?v=/);
  assert.match(css, /line-height: 1\.3; color: var\(--blue\)/);
  assert.match(html, /От ядерных реакторов до темной материи - знакомься с физикой через игру/);
});
