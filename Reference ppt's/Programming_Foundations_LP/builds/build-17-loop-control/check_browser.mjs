// Drive all three files over file://, each on its own, the way their readers open them.
import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const DIR = path.resolve('..', '..', 'Plans', 'Programming Foundations', '17 - Loop Control Statements');
const f = n => pathToFileURL(path.join(DIR, `17_loop_control_statements_${n}.html`)).href;
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
  ok(cards === 32, `32 cards, found ${cards}`);

  // go to a card by the grid index
  const go = async n => p.evaluate(n => {
    const cs = [...document.querySelectorAll('.slide, .pcard')];
    cs.forEach(c => c.classList.remove('active'));
    // use the keyboard path: press Home then Right n-1 times is slow; use the grid
    document.querySelectorAll('.p-grid-in .p-cell')[n - 1].click();
  }, n);

  // the hook steps through 5 presses
  await go(4);
  for (let k = 0; k < 4; k++) await p.keyboard.press('ArrowRight');
  ok(await p.evaluate(() => document.getElementById('stage-hook').classList.contains('an-5')), 'hook reaches press 5');

  // the explainer walks, and the slider changes the walk
  await go(11);
  const exSteps = await p.evaluate(() => +document.getElementById('stage-expl').dataset.anim);
  for (let k = 0; k < exSteps; k++) await p.keyboard.press('ArrowRight');
  const out2 = await p.locator('#wk-expl .term').innerText();
  ok(out2.trim() === '0\n1\nEnd', `explainer at 2 prints 0 1 End, got ${JSON.stringify(out2)}`);
  ok(await p.locator('#wk-expl .bx.never').count() === 7, 'seven boxes stay never');
  await p.evaluate(() => { const i = document.querySelector('#wk-expl input[data-w="n"]');
    i.value = '10'; i.dispatchEvent(new Event('input', { bubbles: true })); });
  const s10 = await p.evaluate(() => +document.getElementById('stage-expl').dataset.anim);
  await p.evaluate(n => document.getElementById('stage-expl').animGo(n), s10);
  const out10 = await p.locator('#wk-expl .term').innerText();
  ok(out10.trim().split('\n').length === 11, 'at 10 the walk prints 0 to 9 and End');
  ok(await p.locator('#wk-expl .wk-slot').first().innerText() === '10', 'the code shows the slider value');

  // slide 14 redrawn: four presses, one program each
  await go(7);
  ok(await p.evaluate(() => +document.getElementById('stage-ic').dataset.anim) === 4, 'intro has 4 presses');
  // slides 31 and 32 walked: only End prints, lines 4 and 5 go grey
  await go(12);
  const f1 = await p.evaluate(() => +document.getElementById('stage-first').dataset.anim);
  await p.evaluate(n => document.getElementById('stage-first').animGo(n), f1);
  ok((await p.locator('#wk-first .term').innerText()).trim() === 'End', 'break first prints only End');
  ok(await p.locator('#wk-first .ln.dead').count() === 2, 'two lines never ran');
  // break outside a loop: the error shows on press 3
  await go(13);
  await p.evaluate(() => document.getElementById('stage-os').animGo(3));
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.os-o1 .os-v')).opacity) === '1', 'the break error shows on press 3');
  // the agenda has no example chips
  ok(await p.locator('.ag-chip').count() === 0, 'agenda carries no example lines');
  // the one-word slides are in
  const labels = await p.evaluate(() => [...document.querySelectorAll('.slide .slide-title')].map(e => e.textContent));
  ok(['Break', 'Continue', 'Pass'].every(w => labels.includes(w)), 'one-word slides 15, 57, 75');
  // task 1 walks to the right output
  await go(15);
  const t1 = await p.evaluate(() => +document.getElementById('stage-task1').dataset.anim);
  await p.evaluate(n => document.getElementById('stage-task1').animGo(n), t1);
  const o1 = (await p.locator('#wk-task1 .term').innerText()).trim().split('\n').map(s => s.trim());
  ok(o1.join('|') === 'outer : 0|inner : 0|outer : 1|inner : 0', `task 1 walk output ${o1}`);

  // the machine has 12 presses, and End shows the last level
  await go(22);
  ok(await p.evaluate(() => +document.getElementById('stage-mc').dataset.anim) === 12, 'machine has 12 presses');
  const who = await p.evaluate(() => [document.activeElement.tagName, document.querySelector('.pcard.active, .slide.active').dataset.label]);
  console.log('before End', who);
  await p.evaluate(() => document.activeElement.blur && document.activeElement.blur());
  await p.keyboard.press('End');
  ok(await p.evaluate(() => document.getElementById('stage-mc').classList.contains('an-12')), 'End jumps to the last press');
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
  ok(n > 20, `worksheet has fields (${n})`);
  const ta = p.locator('textarea').first();
  await ta.fill('outer : 0\n inner : 0\nouter : 1');
  await p.locator('input[type=text]').nth(3).fill('yes');
  await p.waitForTimeout(200);
  await p.reload();
  ok(await p.locator('textarea').first().inputValue() === 'outer : 0\n inner : 0\nouter : 1', 'multi-line answer survives a reload');
  ok(await p.locator('input[type=text]').nth(3).inputValue() === 'yes', 'a field survives a reload');
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
