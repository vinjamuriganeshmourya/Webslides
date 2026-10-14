// scratch: every console error on every slide at every press, with React's component stack, so a duplicate-key warning names its component.
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const errs = new Map()
p.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); errs.set(t.slice(0, 600), (errs.get(t.slice(0, 600)) ?? '') + ' @' + p.url().split('#')[1]) } })
p.on('pageerror', (e) => errs.set('PAGEERROR ' + String(e).slice(0, 300), p.url()))
const presses = { 3: 6, 4: 7, 7: 3, 8: 3, 9: 4, 11: 4, 12: 4, 13: 4, 14: 3, 15: 6, 16: 24, 19: 8, 20: 5, 21: 9, 22: 2, 23: 5, 24: 7, 25: 3, 26: 15, 27: 7, 28: 30, 29: 4, 30: 2, 31: 7 }
for (let n = 1; n <= 31; n++) {
  await p.goto(`http://localhost:5262/?nav=steps&noauto&k=${n}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(900)
  for (let k = 1; k < (presses[n] ?? 1); k++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(260) }
}
for (const [t, where] of errs) console.log('---', where.slice(0, 120), '\n', t)
console.log(errs.size ? `${errs.size} distinct console error(s)` : 'no console errors')
await b.close()
