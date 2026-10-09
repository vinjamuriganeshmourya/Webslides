import { chromium } from 'playwright-core'
const [,, base, out, ...specs] = process.argv
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
for (const s of specs) {
  const [slide, steps] = s.split(':').map(Number)
  await p.goto(`${base}/?nav=steps&noauto&v=${slide}#/${slide}`, { waitUntil: 'load' }); await p.waitForTimeout(1500)
  for (let k = 0; k <= steps; k++) {
    if (k) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1600) }
    await p.screenshot({ path: `${out}/s${slide}-${k}.png` })
  }
}
console.log('errors:', errs.slice(0, 5))
await b.close()
