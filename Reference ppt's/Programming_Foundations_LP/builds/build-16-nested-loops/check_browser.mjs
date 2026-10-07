// Drive the student view and the worksheet in a real browser over file://.
import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLAN = path.resolve(HERE, '..', '..', 'Plans', 'Programming Foundations', '16 - Nested Loops');
const exe = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const url = f => pathToFileURL(path.join(PLAN, f)).href;

let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL', what); } };

const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(url('16_nested_loops_student_view.html'));
await p.waitForTimeout(600);

ok(await p.evaluate(() => document.body.classList.contains('present')), 'opens in presenter view');
ok(await p.evaluate(() => document.querySelectorAll('.slide.active,.pcard.active').length) === 1, 'one card active');
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.pbar')).display) === 'none', 'no top bar');
ok(await p.evaluate(() => document.querySelector('.pcard.active').getBoundingClientRect().top) === 0, 'card starts at the top');

await p.keyboard.press('f'); await p.waitForTimeout(200);
ok(await p.evaluate(() => document.body.classList.contains('fs')), 'F turns full screen on');
await p.keyboard.press('f'); await p.waitForTimeout(200);
ok(!(await p.evaluate(() => document.body.classList.contains('fs'))), 'F turns it off');

// nothing before the title card names the topic
const early = await p.evaluate(() => [...document.querySelectorAll('.slide,.pcard')].slice(0, 4)
  .map(c => c.textContent.toLowerCase()).join(' '));
ok(!early.includes('nested'), 'cards 1 to 4 never say nested');
ok(!/inner|outer/.test(early), 'the hook never says inner or outer');

// the explainer: step with arrows, then the slider
const cards = await p.evaluate(() => [...document.querySelectorAll('.slide,.pcard')].map(c => c.dataset.label || 'slide'));
const ix = cards.indexOf('Follow both loops');
ok(ix > 0, 'explainer present');
for (let i = 0; i < ix; i++) { await p.keyboard.press('End'); await p.keyboard.press('ArrowRight'); }
await p.waitForTimeout(300);
ok(await p.evaluate(() => document.querySelector('.pcard.active').dataset.label) === 'Follow both loops', 'reached the explainer');
const OUT = '#stage-expl [data-fl="out"]';
for (let i = 0; i < 4; i++) await p.keyboard.press('ArrowRight');
await p.waitForTimeout(1200);
ok((await p.evaluate(o => document.querySelector(o).innerText, OUT)).includes('inner : 7'), 'the flow prints as it steps');
ok(await p.evaluate(() => document.querySelector('#stage-expl .fl-node.on').dataset.n) === 'p2', 'the dot is on the inner print');
await p.keyboard.press('End'); await p.waitForTimeout(300);
const full = await p.evaluate(o => document.querySelector(o).innerText.trim().split('\n').length, OUT);
ok(full === 10, `the flow prints 10 lines at the end (got ${full})`);
ok(await p.evaluate(() => document.querySelector('#stage-expl .fl-done').classList.contains('on')), 'the count box shows at the end');
const bvals = await p.evaluate(() => document.querySelector('#stage-expl [data-fl="hb"]').textContent + document.querySelector('#stage-expl [data-fl="vb"]').textContent);
ok(bvals === '787878', `b keeps its history 7 8 7 8 7 8 (got ${bvals})`);
// the room sets n to 0: the loop bodies never run and stay grey
await p.evaluate(() => { const i = document.querySelector('#stage-expl input[data-w="n"]'); i.value = 0; i.dispatchEvent(new Event('input')); });
await p.keyboard.press('End'); await p.waitForTimeout(300);
ok((await p.evaluate(o => document.querySelector(o).innerText.trim(), OUT)) === 'End', 'range(0) prints only End');
ok(await p.evaluate(() => document.querySelectorAll('#stage-expl .fl-node.dead').length) === 3, 'three boxes stay grey');
ok(await p.evaluate(() => document.querySelectorAll('#stage-expl .fl-ln.dead').length) === 3, 'lines 2 to 4 stay grey');
ok((await p.evaluate(() => document.querySelector('#stage-expl .fl-code').textContent)).includes('range(0)'), 'the code shows range(0)');
await p.evaluate(() => { const i = document.querySelector('#stage-expl input[data-w="n"]'); i.value = 3; i.dispatchEvent(new Event('input')); });

// One step, clicked, not pressed: both walk cards
for (const id of ['stage-expl', 'stage-task1']) {
  const r = await p.evaluate(id => {
    const st = document.getElementById(id); st.animGo(1);
    const btn = st.querySelector('[data-anim-next]');
    const before = +st.dataset.animAt; btn.click(); btn.click();
    return [before, +st.dataset.animAt, btn.textContent];
  }, id);
  ok(r[1] === r[0] + 2 && r[2] === 'One step', `${id}: One step clicks advance (${r})`);
  const rep = await p.evaluate(id => { const st = document.getElementById(id);
    st.querySelector('[data-anim-replay]').click(); return +st.dataset.animAt; }, id);
  ok(rep === 1, `${id}: Replay goes back to 1`);
}
ok((await p.evaluate(() => { const st = document.getElementById('stage-task1'); st.animGo(4);
  return document.querySelector('#wk-task1 .term').textContent; })) === '1 0', 'task 1 walk prints 1 0 on its first print');
// the shape card runs on press 4 and ends with Block 2 four times
const shape = await p.evaluate(async () => { const st = document.getElementById('stage-shape');
  st.animGo(1); const nx = st.querySelector('[data-anim-next]');
  for (let i = 0; i < 3; i++) nx.click();
  await new Promise(r => setTimeout(r, 1500));
  const still = document.querySelectorAll('#stage-shape .sh-chip.on').length;
  if (still !== 1) return ['press 4 filled ' + still + ' chips, want 1'];
  for (let i = 0; i < 9; i++) nx.click();
  return [+st.dataset.animAt, document.querySelectorAll('#stage-shape .sh-chip.on').length,
          document.querySelector('#stage-shape .sh-tally').classList.contains('on')]; });
ok(shape[0] === 13 && shape[1] === 9 && shape[2], `shape steps one chip per press, then the tally (${shape})`);
const titles = await p.evaluate(() => { const st = document.getElementById('stage-poll3');
  return [1, 3, 5].map(n => { st.animGo(n); return [...st.querySelectorAll('.pt')]
    .filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent).join('+'); }); });
ok(titles.join('|') === 'A while loop inside a for loop|A for loop inside a while loop|A while loop inside a while loop',
   'poll title changes per program: ' + titles.join('|'));
ok(await p.evaluate(() => document.querySelectorAll('#stage-poll3 .mc-lv').length) === 3, 'poll has three programs');
// no em dash anywhere the room reads
ok(!(await p.evaluate(() => document.body.innerText.includes('—'))), 'no em dash in the student view');
ok(errs.length === 0, 'no page errors: ' + errs.join(' | '));

// the worksheet: type, reload, still there
const w = await b.newPage();
await w.goto(url('16_nested_loops_student_handout.html'));
const t = w.locator('textarea').first();
await t.fill('1 \n1 2 \n1 2 3 ');
await w.waitForTimeout(300);
await w.reload(); await w.waitForTimeout(300);
ok(await w.locator('textarea').first().inputValue() === '1 \n1 2 \n1 2 3 ', 'a typed answer survives a reload');
ok(await w.evaluate(() => document.querySelectorAll('.task').length) === 2, 'two tasks');
ok(!(await w.evaluate(() => document.body.innerText.includes('—'))), 'no em dash in the worksheet');

await b.close();
console.log(`check_browser: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
