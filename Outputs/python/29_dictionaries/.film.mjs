// scratch: node .film.mjs <slide> <pressesBefore> <frames> <everyMs> [clip x,y,w,h] -> OUT/f<slide>-<n>.png
import { chromium } from 'playwright-core'
const [slide, before, frames = '12', every = '100', clip] = process.argv.slice(2)
const out = process.env.OUT
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:5257/?nav=steps&noauto&v=${slide}#/${slide}`, { waitUntil: 'load' })
await p.waitForTimeout(2200)
for (let s = 0; s < +before; s++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1800) }
await p.keyboard.press('ArrowRight')
const c = clip ? (([x, y, width, height]) => ({ x, y, width, height }))(clip.split(',').map(Number)) : undefined
for (let i = 0; i < +frames; i++) {
  await p.screenshot({ path: `${out}/f${slide}-${String(i).padStart(2, '0')}.png`, clip: c })
  await p.waitForTimeout(+every)
}
await b.close()
