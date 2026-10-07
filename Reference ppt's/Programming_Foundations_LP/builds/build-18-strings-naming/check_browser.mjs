// Drive all three files over file://, each on its own, the way their readers open them.
import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const DIR = path.resolve('..', '..', 'Plans', 'Programming Foundations', '18 - Comparing Strings & Naming Variables');
const f = n => pathToFileURL(path.join(DIR, `18_comparing_strings_naming_variables_${n}.html`)).href;
const exe = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const b = await chromium.launch({ executablePath: exe });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const DASH = /[—–]/;

// ---------------------------------------------------------------- student view
{
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(f('student_view'));
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => document.body.classList.contains('present')), 'opens in presenter view');
  ok(await p.locator('.slide.active, .pcard.active').count() === 1, 'exactly one active card');
  ok(!DASH.test(await p.evaluate(() => document.body.innerText)), 'no em or en dash in the view');
  const html = await p.content();
  ok(!/instructor_guide|student_handout|Instructor guide/.test(html), 'no link to the other files');
  ok((await p.locator('aside.sidepanel').count()) === 0, 'no sidebar');
  const cards = await p.locator('.slide, .pcard').count();
  ok(cards === 28, `28 cards, found ${cards}`);

  const go = async n => p.evaluate(n => {
    document.querySelectorAll('.p-grid-in .p-cell')[n - 1].click();
  }, n);
  const opac = sel => p.evaluate(s => getComputedStyle(document.querySelector(s)).opacity, sel);
  const settle = () => p.waitForTimeout(450);
  const slider = v => p.evaluate(v => { const i = document.querySelector('#stage-expl input[type=range]');
    i.value = String(v); i.dispatchEvent(new Event('input', { bubbles: true })); }, v);

  // the hook steps through 5 presses, and the numbers show on the last
  await go(4);
  for (let k = 0; k < 4; k++) await p.keyboard.press('ArrowRight');
  ok(await p.evaluate(() => document.getElementById('stage-hook').classList.contains('an-5')), 'hook reaches press 5');
  await settle();
  ok(await opac('#stage-hook .hkt-n') === '1', 'hook shows the numbers on press 5');
  ok((await p.locator('#stage-hook .hkdiff').count()) === 10 && (await p.locator('#stage-hook .hksame').count()) === 8,
     'hook: five letters differ in each row, four characters match');

  // the hook's last point comes forward on press 5
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#stage-hook .hkr5')).transform) !== 'none', 'hook point 5 zooms in');

  // the recap: line 3 takes one word at a time, and its output waits a press
  await go(3);
  const RN = await p.evaluate(() => +document.getElementById('stage-recap').dataset.anim);
  ok(RN === 7, `recap has 7 presses, found ${RN}`);
  await p.evaluate(() => document.getElementById('stage-recap').animGo(2));
  await settle();
  ok(await opac('#stage-recap .rc-w1') === '1' && await opac('#stage-recap .rc-o1 .rc-v span') === '0', 'break is in, its output waits');
  await p.evaluate(() => document.getElementById('stage-recap').animGo(3));
  await settle();
  ok(await opac('#stage-recap .rc-o1 .rc-v span') === '1', 'break output shows on the next press');
  ok((await p.locator('#stage-recap .rc-o2 .rc-v span').allInnerTexts()).join(' ') === '0 1 3 4', 'continue prints 0 1 3 4');
  await p.evaluate(() => document.getElementById('stage-recap').animGo(4));
  await settle();
  ok(await opac('#stage-recap .rc-w1') === '0' && await opac('#stage-recap .rc-w2') === '1', 'one word in line 3 at a time');

  // every concept slide is a story scene with Anu and the computer
  const scenes = await p.evaluate(() => [...document.querySelectorAll('.syfig')].length);
  ok(scenes === 10, `ten story scenes, found ${scenes}`);
  ok(await p.evaluate(() => [...document.querySelectorAll('.syfig')].every(f => f.querySelector('.anu') && f.querySelector('.pc'))), 'each scene has both characters');

  // the agenda has two stops and no example chips
  ok(await p.evaluate(() => +document.getElementById('stage-agenda').dataset.anim) === 2, 'agenda has 2 stops');
  ok(await p.locator('.ag-chip').count() === 0, 'agenda carries no example lines');

  // the explainer walks BAD >= BAT, then the slider moves to CAT and BA
  await go(14);
  const N = await p.evaluate(() => +document.getElementById('stage-expl').dataset.anim);
  ok(N === 4, `explainer has 4 presses, found ${N}`);
  for (let k = 1; k < N; k++) await p.keyboard.press('ArrowRight');
  await settle();
  ok((await p.locator('#cw-e0 .cw-ans').innerText()).trim() === 'False', 'BAD >= BAT is False');
  ok(await opac('#cw-e0 .cw-ans') === '1', 'the answer shows on the deciding press');
  await slider(1);
  ok(await p.evaluate(() => document.getElementById('stage-expl').classList.contains('an-1')), 'the slider starts the walk again');
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#stage-expl .cx-v1')).display) !== 'none', 'CAT is the word on screen');
  await p.evaluate(n => document.getElementById('stage-expl').animGo(n), N);
  await settle();
  ok(await opac('#cw-e1 .cw-a .cw-p1') === '0.28' && await opac('#cw-e1 .cw-b .cw-p2') === '0.28', 'letters after B and C stay grey');
  ok(await opac('#cw-e1 .cw-dead') === '1', 'the never-looked-at note shows for CAT');
  await slider(3);
  await p.evaluate(n => document.getElementById('stage-expl').animGo(n), N);
  await settle();
  ok((await p.locator('#cw-e3 .cw-ans').innerText()).trim() === 'True', 'BAD >= BA is True');
  ok(await p.locator('#cw-e3 .cw-b .cw-none').count() === 1, 'BA shows an empty tile where it ran out');
  await slider(0);

  // the machine: 16 presses, the last level decides True
  await go(15);
  ok(await p.evaluate(() => +document.getElementById('stage-mc').dataset.anim) === 16, 'machine has 16 presses');
  await p.evaluate(() => document.activeElement.blur && document.activeElement.blur());
  await p.keyboard.press('End');
  await settle();
  ok(await p.evaluate(() => document.getElementById('stage-mc').classList.contains('an-16')), 'End jumps to the last press');
  ok(await opac('#stage-mc .mc-lv6') === '1', 'level 6 is up on the last press');
  ok((await p.locator('#stage-mc .mc-lv6 .mc-o.ok').innerText()).trim() === 'True', 'level 6 answer is True');
  await p.evaluate(() => document.getElementById('stage-mc').animGo(3));
  await settle();
  ok(await opac('#cw-mc2 .cw-t i') === '0', 'a vote press shows no numbers');

  // tap to classify: 9 presses, the tray empties
  await go(21);
  ok(await p.evaluate(() => +document.getElementById('stage-cl').dataset.anim) === 9, 'classify has 9 presses');
  await p.evaluate(() => document.getElementById('stage-cl').animGo(9));
  await settle();
  ok(await p.evaluate(() => [...document.querySelectorAll('.cl-tray .cl-chip')].every(c => getComputedStyle(c).opacity === '0')), 'every name has left the tray');
  ok(await p.locator('.cl-yes .cl-in').count() === 4 && await p.locator('.cl-no .cl-in').count() === 4, 'four accepted, four refused');

  // a built slide steps its own builds: rules has 8
  ok(await p.evaluate(() => +document.getElementById('stage-rules').dataset.anim) === 8, 'rules card has 8 builds');
  const labels = await p.evaluate(() => [...document.querySelectorAll('.slide .slide-title')].map(e => e.textContent));
  ok(labels.includes('Naming Variables'), 'divider slide 25 is in');
  ok(errs.length === 0, 'no page errors: ' + errs.join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------------- worksheet
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(f('student_handout'));
  const n = await p.locator('input[type=text], textarea').count();
  ok(n === 14, `worksheet has fields (${n})`);
  await p.locator('textarea').first().fill('first_price = 40\nsecond_price = 60');
  await p.locator('input[type=text]').nth(3).fill('a b c');
  await p.locator('[data-tap="t2q1T"]').click();
  await p.locator('[data-tap="t2q1F"]').click();
  await p.locator('[data-tap="t3q7A"]').click();
  await p.waitForTimeout(200);
  await p.reload();
  ok(await p.locator('textarea').first().inputValue() === 'first_price = 40\nsecond_price = 60', 'multi-line answer survives a reload');
  ok(await p.locator('input[type=text]').nth(3).inputValue() === 'a b c', 'a field survives a reload');
  ok(await p.locator('[data-tap="t2q1F"]').getAttribute('aria-pressed') === 'true' &&
     await p.locator('[data-tap="t2q1T"]').getAttribute('aria-pressed') === 'false', 'one tap per row, and it survives a reload');
  ok(await p.locator('[data-tap="t3q7A"]').getAttribute('aria-pressed') === 'true', 'task 3 tap survives a reload');
  ok(await p.locator('.binrow').count() === 14, '6 comparisons and 8 names to tap');
  const p2 = await ctx.newPage();
  await p2.goto(f('student_handout'));
  ok(await p2.locator('textarea').first().inputValue() === '', 'a new tab opens clean');
  ok(!DASH.test(await p.evaluate(() => document.body.innerText)), 'no dash on the worksheet');
  ok(!/instructor_guide|student_view/.test(await p.content()), 'worksheet links nothing');
  ok(errs.length === 0, 'worksheet has no page errors');
  await ctx.close();
}

// ----------------------------------------------------------------------- guide
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(f('instructor_guide'));
  const t = await p.evaluate(() => document.body.innerText);
  ok(!DASH.test(t), 'no dash in the guide');
  ok(/Safe point 1/.test(t) && /Safe point 4/.test(t), 'four safe points');
  ok(!/student_view|student_handout/.test(await p.content()), 'guide links nothing');
  await p.pdf({ path: 'out/guide.pdf', format: 'A4' });
  ok(errs.length === 0, 'guide has no page errors');
  await ctx.close();
}
console.log(`${pass} passed, ${fail} failed`);
await b.close();
process.exit(fail ? 1 : 0);
