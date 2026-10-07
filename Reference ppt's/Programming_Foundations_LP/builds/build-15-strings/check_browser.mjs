/* Drive all three files in real Chrome, over file://, the way their readers
 * will open them: each one alone, with no siblings beside it.
 *
 *     node check_browser.mjs
 *
 * Everything in here is something no static check can see: a thumbnail that
 * did not decode, an answer on screen before it was asked for, a typed answer
 * that does not survive a reload, a gate that does not gate, a map label that
 * runs out of its box.
 */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
const CHROME = path.join(process.env.LOCALAPPDATA || '',
  'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');

const F = n => 'file:///' + path.join(OUT, n).replace(/\\/g, '/');
const PLAN = F('15_string_methods_student_view.html');
const GUIDE = F('15_string_methods_instructor_guide.html');
const SHEET = F('15_string_methods_student_handout.html');

const CARDS = 31;
const GUIDE_ENTRIES = 31;
const WS_TASKS = 4;

let n = 0, fails = 0;
const ok = (cond, what, detail = '') => {
  n++;
  if (!cond) { fails++; console.log(`  FAIL ${what}  ${detail}`); }
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

  const bad = await pg.evaluate(() => [...document.querySelectorAll('.gthumb img')]
    .map((im, i) => [i + 1, im.naturalWidth, im.naturalHeight])
    .filter(([, w, h]) => !w || !h));
  ok(bad.length === 0, 'every guide thumbnail decoded', JSON.stringify(bad));

  const handout = await pg.locator('article.gcard[data-handout]').count();
  ok(handout === 1, 'exactly one hand-out moment named', String(handout));

  const txt = await pg.evaluate(() => document.body.innerText);
  ok(!txt.includes('—'), 'no em-dash in the guide text');
  ok(txt.includes('Every answer, in one place'), 'the guide carries the answer table');
  ok(txt.includes('Slide 56 does not belong to this deck'),
     'the guide reports the stray deck slide');
  ok(txt.includes('The shape of the second half'),
     'the guide states the method rhythm');
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
  for (const leak of ['abcd', '1234', 'endswith', 'Valid', 'never']) {
    ok(!txt.includes(leak), 'an answer is readable on the worksheet', leak);
  }
  ok(!/minute \d/.test(txt), 'no session timings on the worksheet');
  ok(!/rows should be empty|two of your/.test(txt),
     'no self-check printed on the worksheet');

  const TYPED = 'first line\nsecond line';
  await pg.locator('textarea').first().fill(TYPED);
  await pg.locator('table.grid input').first().fill('  0912  ');
  await pg.locator('[data-tap="t2s2"]').click();
  await pg.waitForTimeout(250);
  await pg.reload();
  await pg.waitForTimeout(400);

  const back = await pg.locator('textarea').first().inputValue();
  ok(back === TYPED, 'a multi-line answer survives a reload', JSON.stringify(back));
  const back2 = await pg.locator('table.grid input').first().inputValue();
  ok(back2 === '  0912  ', 'a typed trace cell survives a reload', JSON.stringify(back2));
  const pressed = await pg.getAttribute('[data-tap="t2s2"]', 'aria-pressed');
  ok(pressed === 'true', 'a ticked step survives a reload', String(pressed));
  const cls = await pg.getAttribute('[data-tap="t2s2"]', 'class');
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
  ok(!/instructor_guide|student_handout/.test(await pg.content()),
     'the student file links to no sibling file');

  const shown = await pg.locator('.ans.shown').count();
  ok(shown === 0, 'no answer starts revealed', String(shown));

  await pg.keyboard.press('p');
  await pg.waitForTimeout(300);
  const active = await pg.locator('.slide.active, .pcard.active').count();
  ok(active === 1, 'presenter opens with exactly one card active', String(active));

  let presses = 0;
  for (let i = 0; i < 400; i++) {
    const at = await pg.evaluate(() => {
      const c = document.querySelector('.slide.active, .pcard.active');
      return [...document.querySelectorAll('.slide, .pcard')].indexOf(c);
    });
    if (at === CARDS - 1) break;
    await pg.keyboard.press('ArrowRight');
    presses++;
    await pg.waitForTimeout(35);
  }
  ok(presses > CARDS, 'one forward key walks the steps too, not just the cards',
     `${presses} presses for ${CARDS} cards`);
  ok(presses < 400, 'the deck reaches its last card', String(presses));

  const spine = await pg.evaluate(() => {
    const all = [...document.querySelectorAll('.slide, .pcard')];
    const at = s => all.findIndex(c => c.querySelector(s));
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

  const early = await pg.evaluate(k => [...document.querySelectorAll('.slide, .pcard')]
    .slice(0, k).map(c => c.innerText).join(' ').toLowerCase(), 4);
  ok(!early.includes('string method'), 'cards 1 to 4 never print the topic name');
  ok(!/\bslice\b|\bstep\b|\bmethod\b/.test(early),
     'the hook names none of the constructs');

  const recapFmt = await pg.evaluate(() =>
    (document.querySelector('[data-recap]') || {}).dataset?.recap);
  ok(recapFmt === 'sort', 'the recap rotates off bug and match', String(recapFmt));

  // the quiz is the join: slicing before it, methods after it
  const quizAt = spine.quiz;
  // the agenda names what is coming, which is its job, so the check starts
  // after it and looks only at the teaching cards
  const before = await pg.evaluate(k => [...document.querySelectorAll('.slide, .pcard')]
    .slice(6, k).map(c => c.innerText).join(' '), quizAt);
  const after = await pg.evaluate(k => [...document.querySelectorAll('.slide, .pcard')]
    .slice(k).map(c => c.innerText).join(' '), quizAt);
  for (const m of ['isdigit', 'strip', 'replace', 'startswith', 'upper'])
    ok(!before.includes(m), `${m} is taught before the quiz`);
  for (const m of ['isdigit', 'strip', 'replace', 'startswith', 'upper'])
    ok(after.includes(m), `${m} is missing after the quiz`);

  const go = async (i) => {
    await pg.keyboard.press('a');
    await pg.waitForTimeout(160);
    await pg.click(`#p-grid-in .p-cell:nth-child(${i})`);
    await pg.waitForTimeout(340);
  };
  const step = async (sel, k) => {
    await pg.evaluate(([s, kk]) => document.querySelector(s).animGo(kk), [sel, k]);
    await pg.waitForTimeout(900);
  };

  /* the hook: one group moves, and only on the last press */
  await go(4);
  const hookBefore = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('.hkcomb')).transform);
  await step('#stage-hook', 6);
  await pg.waitForTimeout(500);
  const hookAfter = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('.hkcomb')).transform);
  ok(hookBefore !== hookAfter, 'the hook moves its one group on the turn',
     `${hookBefore} -> ${hookAfter}`);
  ok(/matrix\(2,/.test(hookAfter), 'the turn is the jump doubling', hookAfter);
  const lit = await pg.evaluate(() => [...document.querySelectorAll('.hkcell.hkd')]
    .filter(c => getComputedStyle(c.querySelector('.hkbox')).strokeWidth === '3px').length);
  ok(lit === 5, 'the five letters light up at the end of the hook', String(lit));
  const spaces = await pg.locator('.hkcell.hksp').count();
  ok(spaces === 4, 'the four spaces are drawn as characters', String(spaces));

  /* the pull-out card: the window, the ghost box, and the copy */
  await go(7);
  // press 1 is the string. Indexing has not happened yet, so neither the
  // slice nor the box it never reaches may be on screen.
  const pull1 = await pg.evaluate(() => ({
    ix: getComputedStyle(document.querySelector('#stage-pull .slex1')).opacity,
    sl: getComputedStyle(document.querySelector('#stage-pull .slex2')).opacity,
    gh: getComputedStyle(
      document.querySelector('#stage-pull .slghost')).opacity,
  }));
  ok(pull1.ix === '0' && pull1.sl === '0',
     'the pull-out card starts with no expression on it',
     JSON.stringify(pull1));
  ok(pull1.gh === '0',
     'the never reached box is not drawn before anything asks for a stop',
     pull1.gh);
  await step('#stage-pull', 2);
  const pull2 = await pg.evaluate(() => ({
    ix: getComputedStyle(document.querySelector('#stage-pull .slex1')).opacity,
    sl: getComputedStyle(document.querySelector('#stage-pull .slex2')).opacity,
    lit: getComputedStyle(document.querySelector(
      '#stage-pull .slzero .slbox')).strokeWidth,
  }));
  ok(pull2.ix === '1' && pull2.sl === '0',
     'press 2 is indexing, and the slice is still not on the card',
     JSON.stringify(pull2));
  ok(pull2.lit === '3px', 'box 0 lights up for message[0]', pull2.lit);
  await step('#stage-pull', 3);
  const win = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-pull .slwin')).opacity);
  ok(win === '1', 'the window lands on press 3', win);
  const noline = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-pull .slex2')).opacity);
  ok(noline === '0', 'the room is asked for the line before it is shown',
     noline);
  await step('#stage-pull', 4);
  const pull4 = await pg.evaluate(() => ({
    sl: getComputedStyle(document.querySelector('#stage-pull .slex2')).opacity,
    stop: getComputedStyle(
      document.querySelector('#stage-pull .slstop')).opacity,
    gh: getComputedStyle(
      document.querySelector('#stage-pull .slghost')).opacity,
  }));
  ok(pull4.sl === '1', 'the slice is written on press 4', pull4.sl);
  ok(pull4.stop === '1' && pull4.gh === '1',
     'the end index arrives with the line that asks for it',
     JSON.stringify(pull4));
  await step('#stage-pull', 5);
  const lifted = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-pull .sllift')]
      .map(t => getComputedStyle(t).transform).filter(t => t !== 'none').length);
  ok(lifted === 4, 'four characters travel into the result', String(lifted));
  const stillThere = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-pull .slcell .slch')]
      .filter(t => +getComputedStyle(t).opacity > 0.5).length);
  ok(stillThere === 8, 'the string still has every character in it',
     String(stillThere));
  // the one line the card teaches is the biggest text on it, and it is at the
  // top. It used to be 30px at the bottom edge, smaller than the captions.
  const exprGeom = await pg.evaluate(() => {
    const ex = document.querySelector('#stage-pull .slex2');
    const box = document.querySelector('#stage-pull .slcell .slbox');
    const cap = document.querySelector('#stage-pull .slcap text');
    return [parseFloat(getComputedStyle(ex).fontSize),
            parseFloat(getComputedStyle(cap).fontSize),
            ex.getBBox().y, box.getBBox().y];
  });
  ok(exprGeom[0] > exprGeom[1],
     'the expression is set larger than the card caption',
     JSON.stringify(exprGeom));
  ok(exprGeom[2] < exprGeom[3],
     'the expression sits above the row of boxes, not under it',
     JSON.stringify(exprGeom));

  /* the jump: one landing per press, and the untouched boxes stay dashed */
  await go(10);
  const jline = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-jump .slex0')).opacity);
  ok(jline === '1', 'the jump card shows its line from press 1', jline);
  await step('#stage-jump', 6);
  const clipped = await pg.evaluate(() => {
    const svg = document.querySelector('#stage-jump .slfig');
    const h = svg.viewBox.baseVal.height;
    const w = svg.viewBox.baseVal.width;
    const out = [];
    svg.querySelectorAll('.slcap text').forEach(t => {
      const b = t.getBBox();
      if (b.y + b.height > h || b.x + b.width > w)
        out.push([t.textContent.slice(0, 40),
                  Math.round(b.y + b.height), Math.round(b.x + b.width)]);
    });
    return [out, w, h];
  });
  ok(clipped[0].length === 0,
     'every caption line is inside the jump card viewBox',
     JSON.stringify(clipped));
  const dashed = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-jump .slskip .slbox')]
      .filter(r => getComputedStyle(r).strokeDasharray !== 'none').length);
  ok(dashed === 5, 'every box it never landed on goes dashed', String(dashed));
  const jumped = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-jump .sllift')]
      .filter(t => +getComputedStyle(t).opacity > 0.5).length);
  ok(jumped === 4, 'four characters came out of the jump', String(jumped));

  const pullClipped = await pg.evaluate(() => {
    const svg = document.querySelector('#stage-pull .slfig');
    const h = svg.viewBox.baseVal.height, w = svg.viewBox.baseVal.width;
    const out = [];
    svg.querySelectorAll('.slcap text, .slexpr').forEach(t => {
      const b = t.getBBox();
      if (b.y + b.height > h || b.x + b.width > w)
        out.push([t.textContent.slice(0, 40), Math.round(b.y + b.height)]);
    });
    return out;
  });
  ok(pullClipped.length === 0,
     'every caption line is inside the pull-out card viewBox',
     JSON.stringify(pullClipped));

  /* the machine: Run is locked until an option is picked */
  await go(11);
  const lockedBefore = await pg.getAttribute('#m-run', 'disabled');
  ok(lockedBefore !== null, 'the machine locks Run until an option is picked');
  await pg.click('.mopt:nth-child(2)');
  await pg.waitForTimeout(150);
  ok(await pg.getAttribute('#m-run', 'disabled') === null,
     'picking an option unlocks Run');
  await pg.click('#m-run');
  await pg.waitForTimeout(2600);
  ok(await pg.locator('#m-rail .mcell.hit').count() === 4,
     'level 1 lands on four boxes');
  ok(/abcd/.test(await pg.textContent('#m-cap')), 'the verdict names the answer');
  ok(await pg.locator('.mopt.right').count() === 1,
     'exactly one option is marked right');

  /* the why card: the reason a method exists, before any method is taught */
  await go(14);
  const why1 = await pg.evaluate(() => ({
    pin: getComputedStyle(document.querySelector('#stage-why .wypc')).opacity,
    err: getComputedStyle(document.querySelector('#stage-why .wyerr')).opacity,
    steps: [...document.querySelectorAll('#stage-why .wystep')]
      .filter(d => getComputedStyle(d).display !== 'none').length,
  }));
  ok(why1.pin === '0' && why1.err === '0',
     'the PIN screen starts empty and unrefused', JSON.stringify(why1));
  ok(why1.steps === 1, 'exactly one block of the why card is on screen',
     String(why1.steps));
  const noname1 = await pg.evaluate(() =>
    document.querySelector('#stage-why').innerText.toLowerCase());
  ok(!noname1.includes('isdigit'),
     'the why card does not name the method on press 1');
  await step('#stage-why', 2);
  const why2 = await pg.evaluate(() => ({
    pin: getComputedStyle(document.querySelector('#stage-why .wypc')).opacity,
    err: getComputedStyle(document.querySelector('#stage-why .wyerr')).opacity,
    bad: getComputedStyle(
      document.querySelector('#stage-why .wybad .wypb')).stroke,
  }));
  ok(why2.pin === '1' && why2.err === '1',
     'the typed PIN and the refusal arrive together', JSON.stringify(why2));
  ok(/199|201|199, 69, 78|rgb\(199, 69, 78\)/.test(why2.bad),
     'the character that is not a digit wears the red', why2.bad);
  await step('#stage-why', 3);
  const longLines = await pg.evaluate(() => {
    const d = [...document.querySelectorAll('#stage-why .wystep')]
      .find(x => getComputedStyle(x).display !== 'none');
    return d.querySelectorAll('.edcard .cx .ln').length;
  });
  ok(longLines === 9, 'the long way is nine lines of real program',
     String(longLines));
  await step('#stage-why', 5);
  const shortLines = await pg.evaluate(() => {
    const d = [...document.querySelectorAll('#stage-why .wystep')]
      .find(x => getComputedStyle(x).display !== 'none');
    return [d.querySelectorAll('.edcard .cx .ln').length,
            !!d.querySelector('.wyname')];
  });
  ok(shortLines[0] === 2 && shortLines[1],
     'the short way is two lines, and it is named', JSON.stringify(shortLines));
  const tabs = await pg.evaluate(() =>
    [...document.querySelectorAll('.edcard')].every(c => {
      const t = c.querySelector('.edtab');
      const bg = getComputedStyle(c.querySelector('.cx')).backgroundColor;
      return t && t.textContent.trim().endsWith('.py')
             && bg !== 'rgb(0, 0, 0)';
    }));
  ok(tabs, 'every editor card has a file tab and is not a black slab');

  /* the method cards: the line first, the answer second, the words third */
  await go(15);
  const out1 = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('#stage-isdigit .term')]
      .filter(x => getComputedStyle(x).display !== 'none')[0];
    return t ? t.textContent.trim() : null;
  });
  ok(out1 === '', 'the isdigit card starts with an empty output box',
     JSON.stringify(out1));
  const def1 = await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-isdigit .mthdef')).display);
  ok(def1 === 'none', 'the definition is not on screen before the answer', def1);
  await step('#stage-isdigit', 2);
  const out2 = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('#stage-isdigit .term')]
      .filter(x => getComputedStyle(x).display !== 'none')[0];
    return t.textContent.trim();
  });
  ok(out2 === 'True', 'the isdigit card prints what Python prints', out2);
  const ticks = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-isdigit .mstep')]
      .filter(s => getComputedStyle(s).display !== 'none'
                   && s.querySelector('.mthrow'))
      .reduce((k, s) => k + s.querySelectorAll('.ch.yes').length, 0));
  ok(ticks === 4, 'every character is ticked', String(ticks));
  await step('#stage-isdigit', 3);
  ok(await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-isdigit .mthdef')).display)
    !== 'none', 'the definition arrives on press 3');
  await step('#stage-isdigit', 4);
  const out4 = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('#stage-isdigit .term')]
      .filter(x => getComputedStyle(x).display !== 'none')[0];
    return t.textContent.trim();
  });
  ok(out4 === 'False', 'the False case prints False', out4);

  await go(17);
  await step('#stage-strip', 2);
  const sOut = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('#stage-strip .term')]
      .filter(x => getComputedStyle(x).display !== 'none')[0];
    return t.textContent.trim();
  });
  ok(sOut === '9876543210', 'the strip card prints what Python prints', sOut);
  const fell = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-strip .ch.off')]
      .filter(c => +getComputedStyle(c).opacity < 0.1).length);
  ok(fell === 4, 'the four spaces at the ends fall away', String(fell));

  /* the explainer: it steps, and the never-reached state persists */
  await go(18);
  await pg.click('#s-step');
  await pg.click('#s-step');
  await pg.waitForTimeout(300);
  ok(/^2 \//.test((await pg.textContent('#s-st') || '').trim()),
     'the explainer advances one step at a time');
  await pg.evaluate(() => {
    document.querySelectorAll('#sw [data-w]')[1].click();
    for (let i = 0; i < 20; i++) document.getElementById('s-step').click();
  });
  await pg.waitForTimeout(500);
  ok(await pg.locator('#s-seq .bx.never').count() === 1,
     'a character in the set is left never reached');
  ok(await pg.locator('#s-seq .bx.gone').count() === 4,
     'the characters strip took have vanished');
  ok((await pg.textContent('#s-out') || '').trim() === 'Ra-vi',
     'the walker prints what Python prints');
  await pg.waitForTimeout(600);
  ok(await pg.locator('#s-seq .bx.never').count() === 1,
     'the never-reached mark persists after the run ends');
  ok(await pg.evaluate(() =>
    getComputedStyle(document.querySelector('.wkey')).opacity) === '1',
     'the legend is not dimmed by the walk');
  const rows = await pg.evaluate(() => new Set(
    [...document.querySelectorAll('#s-seq .bx:not(.gone)')]
      .map(b => Math.round(b.getBoundingClientRect().top))).size);
  ok(rows === 1, 'the walker boxes stay on one line', String(rows));

  /* worksheet task 3: the reveal walks, and the history is struck through */
  await go(21);
  await step('#stage-t3', 7);
  ok(await pg.evaluate(() => [...document.querySelectorAll('#stage-t3 .cx .ln')]
    .filter(l => +getComputedStyle(l).opacity < 0.5).length) === 2,
     'the two lines that never ran stay faded');
  ok(await pg.evaluate(() => {
    let k = 0;
    document.querySelectorAll('#stage-t3 .varbox .vl').forEach(v => {
      if (getComputedStyle(v).display !== 'none') k += v.querySelectorAll('.ov').length;
    });
    return k;
  }) === 2, 'replaced values stay on screen, struck through');
  ok(await pg.evaluate(() => {
    const t = [...document.querySelectorAll('#stage-t3 .term')]
      .filter(x => getComputedStyle(x).display !== 'none')[0];
    return t ? t.textContent.trim() : '';
  }) === '92', 'the reveal prints what Python prints');

  /* the classroom quiz card carries no questions */
  await go(13);
  ok(await pg.locator('.pcard.active .vopts li').count() === 0,
     'the classroom quiz card carries no questions');
  ok(await pg.locator('.pcard.active .tmr').count() === 0,
     'the classroom quiz card carries no timer');

  /* the three method cards that used to be deck definition slides */
  for (const [card, id, want] of [[23, '#stage-replace', 'the cat and the dog'],
                                  [24, '#stage-starts', 'True'],
                                  [26, '#stage-upper', 'RAVI']]) {
    await go(card);
    const before = await pg.evaluate(sel => {
      const t = [...document.querySelectorAll(sel + ' .term')]
        .filter(x => getComputedStyle(x).display !== 'none')[0];
      return [t ? t.textContent.trim() : null,
              getComputedStyle(document.querySelector(sel + ' .mthdef'))
                .display];
    }, id);
    ok(before[0] === '', `${id} starts with an empty output box`,
       JSON.stringify(before));
    ok(before[1] === 'none', `${id} holds its definition back`, before[1]);
    await step(id, 2);
    const got = await pg.evaluate(sel => {
      const t = [...document.querySelectorAll(sel + ' .term')]
        .filter(x => getComputedStyle(x).display !== 'none')[0];
      return t.textContent.trim();
    }, id);
    ok(got === want, `${id} prints what Python prints`, `${got} vs ${want}`);
    await step(id, 3);
    ok(await pg.evaluate(sel =>
      getComputedStyle(document.querySelector(sel + ' .mthdef')).display,
      id) !== 'none', `${id} names the shape on press 3`);
  }
  // replace touches two words and leaves three alone
  await go(23);
  await step('#stage-replace', 2);
  const wds = await pg.evaluate(() => [
    document.querySelectorAll('#stage-replace .wd').length,
    document.querySelectorAll('#stage-replace .wd.hit').length]);
  ok(wds[0] === 5 && wds[1] === 2,
     'replace rewrites two words out of five', JSON.stringify(wds));
  // upper shows one glyph per box, never two at once
  await go(26);
  await step('#stage-upper', 2);
  const glyphs = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-upper .ch.flip')].map(c =>
      [...c.children].filter(g => +getComputedStyle(g).opacity > 0.5)
        .map(g => g.textContent).join('')));
  ok(glyphs.join('') === 'RAVI', 'upper swaps the glyph in place',
     JSON.stringify(glyphs));
  await step('#stage-upper', 4);
  const glyphs4 = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-upper .ch.flip')].map(c =>
      [...c.children].filter(g => +getComputedStyle(g).opacity > 0.5)
        .map(g => g.textContent).join('')));
  ok(glyphs4.join('') === 'ravi', 'press 4 is lower, in the same boxes',
     JSON.stringify(glyphs4));

  /* the exit */
  await go(27);
  ok(+(await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-exit .ans')).opacity)) < 0.2,
     'the exit answer starts hidden');
  await pg.click('#stage-exit [data-reveal]');
  await pg.waitForTimeout(500);
  ok(await pg.evaluate(() =>
    getComputedStyle(document.querySelector('#stage-exit .ans')).opacity) === '1',
     'the exit answer reveals');
  ok(await pg.locator('#stage-exit .vopts li.right').count() === 1,
     'exactly one exit option is the answer');

  /* the two takeaway boards: real examples, one per press, and nothing
   * overflowing. These replaced two maps that carried no examples at all. */
  await go(28);
  const board1 = await pg.evaluate(() => [
    document.querySelectorAll('#stage-tk1 .trow').length,
    // the row is its own dashed slot from press 1, so what counts as
    // "up" is its contents, not the row
    [...document.querySelectorAll('#stage-tk1 .trow .tin')]
      .filter(r => +getComputedStyle(r).opacity > 0.5).length,
    document.querySelectorAll('#stage-tk1 .tstr .tbx').length,
  ]);
  ok(board1[0] === 4, 'the slice board has four example rows',
     JSON.stringify(board1));
  ok(board1[1] === 1, 'only the first row is filled in on press 1',
     JSON.stringify(board1));
  const slots = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-tk1 .trow')]
      .map(r => getComputedStyle(r).borderTopStyle));
  ok(slots.filter(b => b === 'dashed').length === 3,
     'the three rows still to come are drawn as empty slots',
     JSON.stringify(slots));
  ok(board1[2] === 8, 'the string every row points at is drawn with its index',
     JSON.stringify(board1));
  await step('#stage-tk1', 5);
  const shown1 = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-tk1 .trow')]
      .filter(r => +getComputedStyle(r.querySelector('.tin')).opacity > 0.5)
      .map(r => [r.querySelector('.tex').textContent,
                 r.querySelector('.tout').textContent]));
  ok(shown1.length === 4, 'every row is up by the last press',
     JSON.stringify(shown1));
  ok(JSON.stringify(shown1) === JSON.stringify([
      ['code[0:4]', 'a1b2'], ['code[0:8:2]', 'abcd'],
      ['code[1:6:3]', '1c'], ['code[6:2:2]', 'nothing at all']]),
     'the slice board prints what Python prints', JSON.stringify(shown1));
  ok(await pg.evaluate(() =>
    +getComputedStyle(document.querySelector('#stage-tk1 .trules')).opacity)
    === 1, 'the two rules arrive on the last press');

  await go(29);
  await step('#stage-tk2', 6);
  const board2 = await pg.evaluate(() =>
    [...document.querySelectorAll('#stage-tk2 .tcell')].map(c => [
      (c.querySelector('.tchip') || {}).textContent || 'summary',
      (c.querySelector('.tout') || {}).textContent || '']));
  ok(board2.length === 6, 'the method board has five methods and a summary',
     JSON.stringify(board2));
  ok(board2.slice(0, 5).map(r => r[0]).join(',')
     === 'isdigit,strip,replace,startswith,upper',
     'all five methods are on the board', JSON.stringify(board2));
  ok(board2.slice(0, 5).every(r => r[1].length > 0),
     'every method on the board carries its own output',
     JSON.stringify(board2));

  // the longest line on the board is split into two pieces on purpose, so
  // nothing wraps inside a token. This is the check that catches it coming
  // back: every code element's own lines must each start at its left edge.
  const broken = await pg.evaluate(() => {
    const out = [];
    document.querySelectorAll('#stage-tk2 .tex > span').forEach(sp => {
      const rects = [...sp.getClientRects()];
      if (rects.length > 1) out.push([sp.textContent, rects.length]);
    });
    return out;
  });
  ok(broken.length === 0, 'no line on the method board wraps inside a token',
     JSON.stringify(broken));

  // no label may run out of its own box on either board. The maps needed a
  // measured SVG check for this; HTML boxes grow, so this is the whole check.
  for (const id of ['#stage-tk1', '#stage-tk2']) {
    const over = await pg.evaluate(sel => {
      const out = [];
      document.querySelectorAll(sel + ' .trow, ' + sel + ' .tcell')
        .forEach(b => {
          if (b.scrollWidth > b.clientWidth + 1
              || b.scrollHeight > b.clientHeight + 1)
            out.push([b.textContent.slice(0, 30), b.scrollWidth,
                      b.clientWidth, b.scrollHeight, b.clientHeight]);
        });
      return out;
    }, id);
    ok(over.length === 0, `nothing overflows its box on ${id}`,
       JSON.stringify(over));
    const words = await pg.evaluate(sel =>
      [...document.querySelectorAll(sel + ' .tchip')].map(t => t.textContent),
      id);
    ok(!words.includes('today'), `${id} has no heading pretending to be a node`,
       JSON.stringify(words));
  }

  // the card the room photographs has to carry examples on it
  for (const [id, n] of [['#stage-tk1', 4], ['#stage-tk2', 5]]) {
    const exs = await pg.evaluate(sel =>
      document.querySelectorAll(sel + ' .tex').length, id);
    ok(exs === n, `${id} carries ${n} real lines of code`, String(exs));
  }

  ok(errs.length === 0, 'presenter page errors', errs.join(' | '));
  await pg.close();
}

await browser.close();
console.log(`\n${n - fails} of ${n} browser checks passed`);
process.exit(fails ? 1 : 0);
