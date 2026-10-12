// sample slide 3's first tile during its flip after one press: rotateX of the turning div, both faces' visibility
import { chromium } from 'playwright-core'
const [url] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2200)
const sample = () => p.evaluate(() => {
  const tile = document.querySelector('[style*="perspective"]')
  const turn = tile.firstElementChild
  const [face, back] = turn.children
  const m = getComputedStyle(turn).transform
  let deg = 'none'
  if (m && m.startsWith('matrix3d')) { const v = m.slice(9, -1).split(',').map(Number); deg = (Math.atan2(v[6], v[5]) * 180 / Math.PI).toFixed(1) }
  else if (m && m.startsWith('matrix')) deg = '2d'
  return `rotX=${deg} face=${getComputedStyle(face).visibility} back=${getComputedStyle(back).visibility}`
})
console.log('before:', await sample())
const t0 = Date.now()
await p.keyboard.press('ArrowRight')
for (let i = 0; i < 18; i++) { console.log(`+${String(Date.now() - t0).padStart(4)}ms`, await sample()); await p.waitForTimeout(40) }
await b.close()
