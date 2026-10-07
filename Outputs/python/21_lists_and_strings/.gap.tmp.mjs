import { chromium } from 'playwright-core'
import { readdirSync } from 'node:fs'
const html = `${process.cwd()}/dist-single/${readdirSync('dist-single').find((f) => f !== 'index.html' && f.endsWith('.html'))}`
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.addInitScript(() => { window.__nav = []; const t0 = performance.now(); window.addEventListener('deck:navigate', (e) => window.__nav.push(performance.now() - t0)) })
const all = []
for (const s of [3, 4, 14, 18, 20, 21, 22, 23, 24, 26, 29]) {
  await p.goto(`file://${html}?v=${s}#/${s}`, { waitUntil: 'load' })
  await p.waitForTimeout(45000)
  const nav = await p.evaluate(() => window.__nav)
  const gaps = nav.map((x, i) => (x - (i ? nav[i - 1] : 0)) / 1000)
  all.push(...gaps)
  console.log(s, gaps.map((g) => g.toFixed(1)).join(' '))
}
console.log('average per step:', (all.reduce((a, c) => a + c, 0) / all.length).toFixed(2), 's over', all.length, 'steps')
await b.close()
