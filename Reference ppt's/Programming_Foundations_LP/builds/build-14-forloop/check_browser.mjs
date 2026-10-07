/* Drive all three files in a real browser over file://, the way their readers
 * will open them: each one alone, with no siblings beside it.
 *
 *   node check_browser.mjs
 *
 * What it asserts, and why each one is here:
 *   - the guide's pictures actually rendered. A thumbnail that failed to load is
 *     a blank grey box and nothing warns you;
 *   - a typed answer and a tapped bin both survive a reload of the worksheet;
 *   - no answer is readable anywhere in the worksheet;
 *   - presenter view opens with exactly one card active, and one forward key
 *     walks every step of every card before moving on;
 *   - no em-dash reaches innerText in any of the three;
 *   - no page errors anywhere.
 */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const CHROME = path.join(process.env.LOCALAPPDATA || '',
  'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');

const F = n => 'file:///' + path.join(OUT, n).replace(/\\/g, '/');
const PLAN = F('14_for_loop_student_view.html');
const GUIDE = F('14_for_loop_instructor_guide.html');
const SHEET = F('14_for_loop_student_handout.html');

const CARDS = 38;
const GUIDE_ENTRIES = 38;
const WS_TASKS = 3;

let fails = 0, n = 0;
const ok = (cond, what, detail = '') => {
  n++;
  if (!cond) { fails++; console.log('  FAIL', what, detail); }
};

const browser = await chromium.launch({ executablePath: CHROME });

/* ------------------------------------------------------------------ the guide */
{
  const pg = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(GUIDE);
  await pg.waitForTimeout(500);

  const entries = await pg.locator('article.gcard').count();
  ok(entries === GUIDE_ENTRIES, 'guide entry count', `${entries} of ${GUIDE_ENTRIES}`);

  // a thumbnail that did not decode has naturalWidth 0 and looks like a grey box
  const bad = await pg.evaluate(() => [...document.querySelectorAll('.gthumb img')]
    .map((im, i) => [i + 1, im.naturalWidth, im.naturalHeight])
    .filter(([, w, h]) => !w || !h));
  ok(bad.length === 0, 'every guide thumbnail decoded', JSON.stringify(bad));

  const handout = await pg.locator('article.gcard[data-handout]').count();
  ok(handout === 1, 'exactly one hand-out moment named', String(handout));

  const txt = await pg.evaluate(() => document.body.innerText);
  ok(!txt.includes('—'), 'no em-dash in the guide text');
  ok(txt.includes('Every answer, in one place'), 'the guide carries the answer table');
  ok(errs.length === 0, 'guide page errors', errs.join(' | '));
  await pg.close();
}

/* -------------------------------------------------------------- the worksheet */
{
  const pg = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(SHEET);
  await pg.waitForTimeout(300);

  const tasks = await pg.locator('section.task').count();
  ok(tasks === WS_TASKS, 'worksheet task count', String(tasks));

  const txt = await pg.evaluate(() => document.body.innerText);
  ok(!txt.includes('—'), 'no em-dash in the worksheet text');
  for (const leak of ['nothing is printed at all', 'range(1, n + 1):',
                      'ch = H, n = 1']) {
    ok(!txt.includes(leak), 'an answer is readable on the worksheet', leak);
  }
  ok(!/minute \d/.test(txt), 'no session timings on the worksheet');

  // type a multi-line answer, tap an option, reload, and check both came back
  const TYPED = 'first line\nsecond line';
  await pg.locator('textarea').first().fill(TYPED);
  await pg.locator('input[type=text]').nth(2).fill('H');
  await pg.locator('[data-tap="t1n-1"]').click();
  await pg.waitForTimeout(250);
  await pg.reload();
  await pg.waitForTimeout(400);

  const back = await pg.locator('textarea').first().inputValue();
  ok(back === TYPED, 'a multi-line answer survives a reload', JSON.stringify(back));
  const back2 = await pg.locator('input[type=text]').nth(2).inputValue();
  ok(back2 === 'H', 'a typed cell survives a reload', back2);
  const pressed = await pg.getAttribute('[data-tap="t1n-1"]', 'aria-pressed');
  ok(pressed === 'true', 'a tapped option survives a reload', String(pressed));

  // nothing marks itself: tapping an option must not colour it right or wrong
  const cls = await pg.getAttribute('[data-tap="t1n-1"]', 'class');
  ok(!/right|wrong|correct/.test(cls || ''), 'the worksheet never marks an answer', cls);

  ok(errs.length === 0, 'worksheet page errors', errs.join(' | '));
  await pg.close();
}

/* --------------------------------------------------------------- the presenter */
{
  const pg = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(PLAN);
  await pg.waitForTimeout(600);

  const cards = await pg.locator('.slide, .pcard').count();
  ok(cards === CARDS, 'card count', String(cards));

  const txt = await pg.evaluate(() => document.body.innerText);
  ok(!txt.includes('—'), 'no em-dash in the presenter text');

  // no answer is on screen before it is revealed
  const shown = await pg.locator('.ans.shown').count();
  ok(shown === 0, 'no answer starts revealed', String(shown));

  await pg.keyboard.press('p');
  await pg.waitForTimeout(300);
  const active = await pg.locator('.slide.active, .pcard.active').count();
  ok(active === 1, 'presenter opens with exactly one card active', String(active));

  // one forward key walks every step of every card, then the whole deck
  let presses = 0;
  for (let i = 0; i < 400; i++) {
    const at = await pg.evaluate(() => {
      const c = document.querySelector('.slide.active, .pcard.active');
      return [...document.querySelectorAll('.slide, .pcard')].indexOf(c);
    });
    if (at === CARDS - 1) {
      const s = await pg.evaluate(() => {
        const c = document.querySelector('.pcard.active, .slide.active');
        const st = c && c.querySelector('.stage');
        if (!st) return true;
        if (st.dataset.anim) return +st.dataset.animAt >= +st.dataset.anim;
        const steps = st.querySelectorAll('.stage-step');
        return !steps.length || steps[steps.length - 1].classList.contains('on');
      });
      if (s) break;
    }
    await pg.keyboard.press('ArrowRight');
    presses++;
    await pg.waitForTimeout(35);
  }
  ok(presses > CARDS, 'one forward key walks the steps too, not just the cards',
     `${presses} presses for ${CARDS} cards`);
  ok(presses < 400, 'the deck reaches its last card', String(presses));

  // the fixed spine: the same seven cards, in the same order, in every plan
  const spine = await pg.evaluate(() => {
    const all = [...document.querySelectorAll('.slide, .pcard')];
    const at = n => all.findIndex(c => c.querySelector(n));
    return {
      welcome: at('[data-spine="welcome"]'),
      recap: at('.spine-recap'),
      retrieval: at('[data-recap]'),
      title: at('.spine-title'),
      quiz: at('[data-spine="quiz"]'),
      feedback: at('[data-spine="feedback"]'),
      thankyou: at('[data-spine="thankyou"]'),
    };
  });
  ok(Object.values(spine).every(i => i >= 0), 'every spine card is in the plan',
     JSON.stringify(spine));
  const order = ['welcome', 'recap', 'retrieval', 'title', 'quiz', 'feedback', 'thankyou']
    .map(k => spine[k]);
  ok(order.every((v, i) => i === 0 || v > order[i - 1]),
     'the spine cards are in the fixed order', JSON.stringify(spine));
  ok(spine.welcome === 0 && spine.thankyou === CARDS - 1,
     'welcome opens the plan and thank you closes it', JSON.stringify(spine));

  // nothing before the title card names the topic: the room guesses it first
  const early = await pg.evaluate(n => [...document.querySelectorAll('.slide, .pcard')]
    .slice(0, n).map(c => c.innerText).join(' ').toLowerCase(), 4);
  ok(!early.includes('for loop'), 'cards 1 to 4 never print the topic name');

  // the recap is the match format, and it is not the one session 12 used
  const recapFmt = await pg.evaluate(() =>
    (document.querySelector('[data-recap]') || {}).dataset?.recap);
  ok(recapFmt === 'match', 'the recap rotates off the format session 12 used',
     String(recapFmt));

  // the hook: six beats, the whole song story, and the room's turn last
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(4)');
  await pg.waitForTimeout(300);
  // a card reopens where it was left (2026-09-25), and the walk above left the
  // hook on its last beat, so start it again from press 1
  await pg.evaluate(() => document.getElementById('stage-hook').animGo(1));
  for (let i = 0; i < 5; i++) { await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(90); }
  const hookAt = await pg.getAttribute('#stage-hook', 'data-anim-at');
  ok(hookAt === '6', 'the hook steps to its last beat', String(hookAt));

  // every line of the story is on the card from press 1, so the first one never
  // rides up under the card heading
  const lines = await pg.locator('#stage-hook .hkline').count();
  ok(lines === 6, 'the hook carries all six story lines from press one', String(lines));
  const topGap = await pg.evaluate(() => {
    const h = document.querySelector('#stage-hook .sl-title').getBoundingClientRect();
    const l = document.querySelector('#stage-hook .hkline').getBoundingClientRect();
    return Math.round(l.top - h.bottom);
  });
  ok(topGap > 12, 'the first story line clears the card heading', String(topGap));

  // the phone is the app the room actually has
  const phoneTxt = await pg.evaluate(() =>
    document.querySelector('#stage-hook .hksvg').textContent);
  ok(phoneTxt.includes('Spotify'), 'the hook names the app it is drawing', phoneTxt.slice(0, 40));
  // "nowhere on the phone does it say five" is the line the hook turns on, so
  // the screen must not carry a count anywhere. Song durations are not counts,
  // so this looks for the word and for the shapes a count would take.
  ok(!/\bfive\b/i.test(phoneTxt) && !/\d+\s*songs?\b/i.test(phoneTxt)
     && !/\bsongs?\b/i.test(phoneTxt),
     'the phone never states how many songs are in the list', phoneTxt);

  // the equaliser is gone on the beat where the player stopped
  await pg.evaluate(() => document.querySelector('#stage-hook').animGo(4));
  await pg.waitForTimeout(500);
  const eq = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-hook .hk-eq')).opacity);
  ok(eq === '0', 'a stopped player shows no equaliser', String(eq));

  // ---- the card after it: their examples, ours, then the shape --------------
  // Reading straight after animGo returns the state the transition starts from,
  // not the one it lands on, so each beat is stepped and then waited for.
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(5)');
  await pg.waitForTimeout(300);
  const readBeat = async n => {
    await pg.evaluate(k => document.querySelector('#stage-ex').animGo(k), n);
    await pg.waitForTimeout(500);
    return pg.evaluate(() => {
      const st = document.querySelector('#stage-ex');
      const vis = el => el && getComputedStyle(el).display !== 'none';
      return {
        ex: vis(st.querySelector('.hkex')),
        shape: vis(st.querySelector('.hkshape')),
        yours: getComputedStyle(st.querySelector('.hkex-yours')).opacity,
        label: getComputedStyle(st.querySelector('.hkex-lbl')).opacity,
        never: getComputedStyle(st.querySelector('.hk-never')).opacity,
      };
    });
  };
  const beats = {1: await readBeat(1), 2: await readBeat(2),
                 3: await readBeat(3), 4: await readBeat(4)};
  ok(beats[1].ex && !beats[1].shape && beats[1].yours === '1' && beats[1].label === '0',
     'press 1 asks the room with the slots still empty', JSON.stringify(beats[1]));
  ok(beats[2].ex && beats[2].label === '1',
     'press 2 fills the slots with our three', JSON.stringify(beats[2]));
  ok(!beats[3].ex && beats[3].shape && beats[3].never === '0',
     'press 3 is the construct, with its last line still held back',
     JSON.stringify(beats[3]));
  ok(beats[4].shape && beats[4].never === '1',
     'press 4 is the line that says nobody counted', JSON.stringify(beats[4]));
  const machines = await pg.locator('#stage-ex .hkm').count();
  ok(machines === 3, 'three everyday machines, each its own loop', String(machines));

  // ---- the agenda arrives one stop at a time --------------------------------
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(7)');
  await pg.waitForTimeout(300);
  const agendaAt = async () => pg.evaluate(() => {
    const st = document.querySelector('#stage-agenda');
    const on = el => getComputedStyle(el).opacity === '1';
    return [...st.querySelectorAll('.ag-s')].filter(on).length
         + (on(st.querySelector('.ag-last')) ? 1 : 0);
  });
  await pg.evaluate(() => document.querySelector('#stage-agenda').animGo(1));
  await pg.waitForTimeout(600);
  ok(await agendaAt() === 1, 'the agenda opens on one stop, not all of them');
  await pg.evaluate(() => document.querySelector('#stage-agenda').animGo(4));
  await pg.waitForTimeout(700);
  ok(await agendaAt() === 4, 'the fourth press adds the mistake the deck leaves off');

  // ---- the explainer: the string is whole until a press splits it -----------
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(14)');
  await pg.waitForTimeout(300);
  const boxesBefore = await pg.evaluate(() =>
    [...document.querySelectorAll('#x-seq .bx')]
      .filter(b => getComputedStyle(b).opacity !== '0').length);
  ok(boxesBefore === 0, 'the string starts whole, not already split',
     String(boxesBefore));
  const whole = await pg.textContent('#x-str');
  ok(whole.trim() === '"Python"', 'the card opens on the deck\'s own word', whole);
  await pg.click('#x-split');
  await pg.waitForTimeout(900);
  const boxesAfter = await pg.evaluate(() =>
    [...document.querySelectorAll('#x-seq .bx')]
      .filter(b => getComputedStyle(b).opacity !== '0').length);
  ok(boxesAfter === 6, 'one press splits it into its six characters',
     String(boxesAfter));

  await pg.click('#x-step');
  await pg.click('#x-step');
  await pg.waitForTimeout(300);
  const stepped = await pg.textContent('#x-st');
  ok(/2 \/ /.test(stepped || ''), 'the explainer advances one step at a time', String(stepped));
  const seqGone = await pg.locator('#x-seq .bx.gone').count();
  ok(seqGone === 1, 'the item the loop took has left the sequence', String(seqGone));

  // the range dial: the stop value is crossed and the numbers are hidden again
  // the moment either number changes
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(24)');
  await pg.waitForTimeout(300);
  await pg.click('#rd-show');
  await pg.waitForTimeout(1400);
  const inCells = await pg.locator('#rd-line .rdcell.in').count();
  ok(inCells === 4, 'the dial shows stop minus start numbers', String(inCells));
  const stopCell = await pg.locator('#rd-line .rdcell.stop .chip').textContent();
  ok(stopCell.trim() === '5', 'the crossed cell is the stop value', stopCell);
  await pg.click('[data-d="b1"]');
  await pg.waitForTimeout(250);
  const afterChange = await pg.locator('#rd-line .rdcell.in').count();
  ok(afterChange === 0, 'changing a number hides the numbers again', String(afterChange));

  // the poll: the left program is always exactly one row short, and nothing
  // says which one is right until Run has been pressed
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(31)');
  await pg.waitForTimeout(300);
  const toldBefore = await pg.locator('#mr.told').count();
  ok(toldBefore === 0, 'the poll does not mark an option before the run',
     String(toldBefore));
  await pg.click('#mr-run');
  await pg.waitForTimeout(2600);
  const toldAfter = await pg.locator('#mr.told').count();
  ok(toldAfter === 1, 'the poll marks B only once both have run', String(toldAfter));
  const left = await pg.locator('#mr [data-side="a"] .mrrow.out:not(.ghost)').count();
  const right = await pg.locator('#mr [data-side="b"] .mrrow.out').count();
  ok(right - left === 1, 'the left program is one row short', `${left} vs ${right}`);
  const ghost = await pg.locator('#mr .ghost.out').count();
  ok(ghost === 1, 'the missing row is drawn as an empty outline', String(ghost));

  // the classroom quiz card carries no questions: they are on the portal
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(19)');
  await pg.waitForTimeout(300);
  const quizOpts = await pg.locator('#stage-quiz .vopts li').count();
  ok(quizOpts === 0, 'the classroom quiz card carries no questions', String(quizOpts));

  // the value boxes keep their history, struck through
  await pg.keyboard.press('a');
  await pg.waitForTimeout(200);
  await pg.click('#p-grid-in .p-cell:nth-child(15)');
  await pg.waitForTimeout(300);
  // press 1 is the task, and the answer side is not on the card yet
  await pg.evaluate(() => document.querySelector('#stage-t1').animGo(1));
  await pg.waitForTimeout(400);
  const askUp = await pg.evaluate(() => {
    const st = document.querySelector('#stage-t1');
    const vis = el => getComputedStyle(el).display !== 'none';
    return [vis(st.querySelector('.t1ask')), vis(st.querySelector('.t1chk'))];
  });
  ok(askUp[0] && !askUp[1], 'press 1 is the task, not the answer',
     JSON.stringify(askUp));
  // a STRING passed to evaluate is an expression, so "()=>..." builds a function
  // and never calls it. Python's binding auto-calls; this one does not.
  await pg.evaluate(() => document.querySelector('#stage-t1').animGo(11));
  await pg.waitForTimeout(600);
  // count the struck-through values that are actually on screen. A :visible
  // locator mid-selector does not mean what it looks like it means, so this
  // reads the computed display of each value row instead.
  const struck = await pg.evaluate(() => {
    let k = 0;
    document.querySelectorAll('#stage-t1 .varbox .vl').forEach(v => {
      if (getComputedStyle(v).display !== 'none') k += v.querySelectorAll('.ov').length;
    });
    return k;
  });
  ok(struck === 3, 'replaced values stay on screen, struck through', String(struck));
  const line = await pg.evaluate(() => {
    const v = [...document.querySelectorAll('#stage-t1 .varbox')]
      .map(b => [...b.querySelectorAll('.vl')]
        .filter(x => getComputedStyle(x).display !== 'none')[0]);
    return v.map(x => x ? x.textContent.replace(/\s+/g, '') : '').join(' | ');
  });
  ok(line === 'H->i | 0->1->2', 'the value history reads as it should', line);

  ok(errs.length === 0, 'presenter page errors', errs.join(' | '));
  await pg.close();
}

await browser.close();
console.log(`\n${n - fails} of ${n} browser checks passed`);
process.exit(fails ? 1 : 0);
