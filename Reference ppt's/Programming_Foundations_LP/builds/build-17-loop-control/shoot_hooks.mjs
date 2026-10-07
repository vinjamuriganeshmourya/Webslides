import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const exe = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(pathToFileURL(path.join(HERE, 'out', 'hooks-preview.html')).href);
fs.mkdirSync(path.join(HERE, 'out', 'hookshots'), { recursive: true });
for (const sid of ['stage-hook', 'stage-why']) {
  const n = await p.evaluate(s => +document.getElementById(s).dataset.anim, sid);
  const card = p.locator(`#${sid}`);
  for (let k = 1; k <= n; k++) {
    await p.evaluate(([s, k, n]) => { const st = document.getElementById(s);
      for (let i = 1; i <= n; i++) st.classList.toggle('an-' + i, i === k); }, [sid, k, n]);
    await p.waitForTimeout(1700);
    await card.screenshot({ path: path.join(HERE, 'out', 'hookshots', `${sid}-${k}.png`) });
  }
}
console.log('errors', errs);
await b.close();
