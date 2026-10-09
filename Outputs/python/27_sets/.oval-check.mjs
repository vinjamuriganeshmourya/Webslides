// scratch: every chip in a bag sits inside its oval with clear space; every chip outside stays clear of it. Every step.
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
const steps = JSON.parse(readFileSync('src/export/revealSteps.ts', 'utf8').match(/\[([\d,]+)\]/)[0])
const PAD = 4
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
let bad = 0
for (let i = 1; i <= steps.length; i++) {
  await p.goto(`http://localhost:5257/?nav=steps&noauto&v=${i}#/${i}`, { waitUntil: 'load' }); await p.waitForTimeout(1500)
  for (let s = 0; s <= steps[i - 1]; s++) {
    if (s) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(2600) }
    const r = await p.evaluate((PAD) => {
      const out = []
      for (const bag of document.querySelectorAll('[data-bag]')) {
        const o = bag.querySelector('[data-bag-oval]').getBoundingClientRect()
        const cx = o.x + o.width / 2, cy = o.y + o.height / 2, rx = o.width / 2, ry = o.height / 2
        const inside = (x, y, pad) => ((x - cx) / (rx - pad)) ** 2 + ((y - cy) / (ry - pad)) ** 2 <= 1
        const near = (x, y, pad) => ((x - cx) / (rx + pad)) ** 2 + ((y - cy) / (ry + pad)) ** 2 <= 1
        for (const c of bag.querySelectorAll('[data-in-bag] [data-chip]')) {
          const q = c.getBoundingClientRect()
          const pts = [[q.left, q.top], [q.right, q.top], [q.left, q.bottom], [q.right, q.bottom]]
          if (!pts.every(([x, y]) => inside(x, y, PAD))) out.push(`IN  "${c.dataset.chip}" crosses the rim`)
        }
        for (const c of bag.querySelectorAll('[data-out-bag] [data-chip]')) {
          const q = c.getBoundingClientRect()
          const pts = [[q.left, q.top], [q.right, q.top], [q.left, q.bottom], [q.right, q.bottom], [q.right, (q.top + q.bottom) / 2]]
          if (pts.some(([x, y]) => near(x, y, PAD))) out.push(`OUT "${c.dataset.chip}" touches the rim`)
        }
      }
      return out
    }, PAD)
    for (const m of r) { bad++; console.log(`slide ${i} step ${s}: ${m}`) }
  }
}
console.log(bad ? `${bad} problem(s)` : 'OVALS CLEAR: every chip inside with space, every outside chip clear of the rim')
await b.close()
