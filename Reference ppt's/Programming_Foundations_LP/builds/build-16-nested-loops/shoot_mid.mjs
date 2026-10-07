import { chromium } from 'playwright-core';
import path from 'node:path'; import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const exe = path.join(os.homedir(),'AppData','Local','ms-playwright','chromium-1243','chrome-win64','chrome.exe');
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(pathToFileURL(path.join(HERE,'out','hook-preview.html')).href);
const set = k => p.evaluate(k => { const s=document.getElementById('stage-hook');
  for (let i=1;i<=6;i++) s.classList.toggle('an-'+i,i===k); }, k);
await set(2); await p.waitForTimeout(1500);
await set(3);
const read = () => p.evaluate(() => ['.hkw-over','.hkw-ball'].map(q =>
  new DOMMatrix(getComputedStyle(document.querySelector(q)).transform).f.toFixed(0)));
for (const t of [0, 500, 900, 1400, 2000]) { await p.waitForTimeout(t ? t - (globalThis.last||0) : 0); globalThis.last = t; console.log(t+'ms over,ball', await read()); }
await b.close();
