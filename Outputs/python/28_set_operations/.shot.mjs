// scratch: screenshot slide N at each press. node .shot.mjs <slide> <presses> [outdir]
import { chromium } from 'playwright-core'
const [n, presses, out = '/tmp/claude-1000/-home-nxtwave-Desktop-webslides-Web-Slides/55f4ebf1-cd25-4187-8b07-ba24019588d3/scratchpad/shots'] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(`http://localhost:5258/?nav=steps&noauto#/${n}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(2200)
const P = Number(presses)
for (let k = 1; k <= Math.max(1, P); k++) {
  if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(2900) }
  await p.screenshot({ path: `${out}/s${String(n).padStart(2, '0')}-${String(k).padStart(2, '0')}.png` })
}
console.log('done', n, P, errs.length ? errs : '')
await b.close()
