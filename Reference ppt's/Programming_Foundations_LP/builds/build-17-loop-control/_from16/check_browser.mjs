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
for (let i = 0; i < 4; i++) await p.keyboard.press('ArrowRight');
ok((await p.evaluate(() => document.querySelector('#wk-expl .term').textContent)).includes('inner : 7'), 'explainer prints as it steps');
await p.keyboard.press('End'); await p.waitForTimeout(200);
const full = await p.evaluate(() => document.querySelector('#wk-expl .term').textContent.split('\n').length);
ok(full === 10, `explainer prints 10 lines at the end (got ${full})`);
const bvals = await p.evaluate(() => [...document.querySelectorAll('#wk-expl .varbox[data-v="b"] .vl span')].map(s => s.textContent).join(''));
ok(bvals === '787878', `b keeps its history 7 8 7 8 7 8 (got ${bvals})`);
// the room sets n to 0: the body never runs and stays grey
await p.evaluate(() => { const i = document.querySelector('#wk-expl input[data-w="n"]'); i.value = 0; i.dispatchEvent(new Event('input')); });
await p.keyboard.press('End'); await p.waitForTimeout(200);
ok(await p.evaluate(() => document.querySelector('#wk-expl .term').textContent) === 'End', 'range(0) prints only End');
ok(await p.evaluate(() => document.querySelectorAll('#wk-expl .cx .ln.dead').length) === 3, 'lines 2 to 4 stay grey');
ok((await p.evaluate(() => document.querySelector('#wk-expl .cx').textContent)).includes('range(0)'), 'the code shows range(0)');

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
ok(await w.evaluate(() => document.querySelectorAll('.task').length) === 3, 'three tasks');
ok(!(await w.evaluate(() => document.body.innerText.includes('—'))), 'no em dash in the worksheet');

await b.close();
console.log(`check_browser: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
