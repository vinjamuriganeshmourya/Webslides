// Shoot the cards changed in round 2, at chosen presses.
import { chromium } from 'playwright-core';
import path from 'node:path'; import os from 'node:os'; import { pathToFileURL } from 'node:url';
const DIR = path.resolve('..', '..', 'Plans', 'Programming Foundations', '17 - Loop Control Statements');
const url = pathToFileURL(path.join(DIR, '17_loop_control_statements_student_view.html')).href;
const exe = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const b = await chromium.launch({ executablePath: exe });
const p = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(url); await p.waitForTimeout(500);
const shots = JSON.parse(process.argv[2]);   // [[card, press], ...]
for (const [c, k] of shots) {
  await p.evaluate(n => document.querySelectorAll('.p-grid-in .p-cell')[n - 1].click(), c);
  await p.waitForTimeout(150);
  await p.evaluate(k => { const s = document.querySelector('.pcard.active .stage, .slide.active .stage');
    if (s && s.animGo) s.animGo(k); }, k);
  await p.waitForTimeout(1900);
  await p.screenshot({ path: `out/r2_${c}_${k}.png` });
}
console.log('errors', errs);
await b.close();
