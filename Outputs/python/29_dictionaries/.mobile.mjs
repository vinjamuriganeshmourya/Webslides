// screenshots of given slides at a press, at phone portrait and landscape viewports
import { chromium } from 'playwright-core'
const [port, list, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [name, vp] of [['portrait', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  for (const item of list.split(',')) {
    const [n, press] = item.split(':').map(Number)
    await p.goto(`http://localhost:${port}/?nav=steps&noauto#/${n}`, { waitUntil: 'load' })
    await p.waitForTimeout(2200)
    for (let k = 1; k < press; k++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1500) }
    await p.screenshot({ path: `${out}/m-${name}-s${String(n).padStart(2, '0')}-p${press}.png`, timeout: 20000 })
  }
  await p.close()
}
await b.close()
