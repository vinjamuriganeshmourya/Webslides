import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const exe = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(pathToFileURL(path.join(HERE, 'out', 'hook-preview.html')).href);
const card = p.locator('.cardwrap');
for (let k = 1; k <= 6; k++) {
  await p.evaluate(k => { const s = document.getElementById('stage-hook');
    for (let i = 1; i <= 6; i++) s.classList.toggle('an-' + i, i === k); }, k);
  await p.waitForTimeout(1800);
  await card.screenshot({ path: path.join(HERE, 'out', 'hookshots', `step${k}.png`) });
}
console.log('errors', errs);
await b.close();
