import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), '..');
const publicDir = root;
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(publicDir, 'assets/app.js'), 'utf8');
test('all three Telegram Mini Apps are linked', () => {
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/sipm_tetris/);
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/isotopes256/);
  assert.match(html, /https:\/\/t\.me\/Nucleargames_bot\/atotom/);
  assert.equal((html.match(/class="game-card game-card--/g) ?? []).length, 3);
  assert.match(html, />3 игры<\/span>/);
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
  assert.match(html, /Физика ядерных реакторов/);
  assert.match(html, /Материаловедение/);
  assert.match(html, /game-card--atotom/);
  assert.match(html, /assets\/atotom\.jpg/);
  assert.match(html, /https:\/\/gonuclear\.mephi\.ru\//);
  assert.match(html, /https:\/\/t\.me\/inphemephi/);
  const css = fs.readFileSync(path.join(publicDir, 'assets/styles.css'), 'utf8');
  assert.match(css, /background: #fff/);
  assert.match(css, /--blue: #0055bb/);
  assert.match(css, /\.game-card--atotom \.game-card__action \{ background: #01a96b; \}/);
  assert.match(css, /game-card--atotom.*background: #00856b/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(html, /Ядерный сайт/);
  assert.match(html, /Портал ядерных абитуриентов/);
  assert.match(html, /class="section-rule"/);
  assert.doesNotMatch(html, /feColorMatrix/);
  assert.match(css, /brand__logo/);
  assert.match(css, /section-rule/);
  assert.match(html, /styles\.css\?v=/);
  assert.match(css, /line-height: 1\.3; color: var\(--blue\)/);
  assert.match(html, /От ядерных реакторов до темной материи — знакомься с физикой через игру/);
});

import vm from 'node:vm';
function runClient(platform, opts = {}) {
  const calls = [], events = {}, css = new Map(), attrs = new Set();
  let click;
  const api = {platform, initData: 'test', ready() {}, expand: () => calls.push('expand'),
    isVersionAtLeast: () => true, requestFullscreen: () => calls.push('fullscreen'),
    openTelegramLink: () => calls.push('link'), onEvent: (n, f) => events[n] = f, ...opts};
  vm.runInNewContext(js, {window:{Telegram:{WebApp:api}}, document:{
    documentElement:{toggleAttribute:(k,on)=>on?attrs.add(k):attrs.delete(k),style:{setProperty:(k,v)=>css.set(k,v),removeProperty:k=>css.delete(k)}},
    querySelectorAll:()=>[{href:'https://t.me/example',addEventListener:(_,f)=>click=f}]}});
  return {api,calls,events,css,attrs,click};
}
test('only mobile clients request fullscreen; older clients use expanded sheet', () => {
  for(const p of ['ios','android','android_x']) assert.deepEqual(runClient(p).calls,['expand','fullscreen']);
  for(const p of ['macos','tdesktop','webk','unknown']) assert.deepEqual(runClient(p).calls,[]);
  assert.deepEqual(runClient('ios',{isVersionAtLeast:()=>false}).calls,['expand']);
  assert.doesNotThrow(()=>runClient('android',{requestFullscreen(){throw Error()}}));
  assert.doesNotThrow(()=>vm.runInNewContext(js,{window:{}}));
});
test('insets follow native controls and clear on leaving fullscreen', () => {
  const r=runClient('ios',{isFullscreen:true,safeAreaInset:{top:54}});
  assert.ok(r.attrs.has('data-mobile-fullscreen'));
  assert.match(r.css.get('--catalog-top'),/112px/);
  r.api.contentSafeAreaInset={top:48};r.events.contentSafeAreaChanged();
  assert.match(r.css.get('--catalog-top'),/54px.*48px/);
  r.api.isFullscreen=false;r.events.fullscreenChanged();assert.equal(r.css.size,0);assert.equal(r.attrs.size,0);
});
test('consume only a successful native link click', () => {
  const r=runClient('ios');let n=0;const e={preventDefault(){n++}};
  r.click(e);r.click({...e,metaKey:true});r.api.openTelegramLink=()=>{throw Error()};r.click(e);
  assert.equal(n,1);assert.equal(r.calls.filter(v=>v==='link').length,1);
});
