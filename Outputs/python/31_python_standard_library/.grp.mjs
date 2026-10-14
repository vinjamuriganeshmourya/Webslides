// scratch: for one slide and press, every [data-group]'s scroll vs client size, and the child that runs past it
import { chromium } from 'playwright-core'
const [port, n, presses] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:${port}/?nav=steps&noauto&g=${n}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(1500)
for (let k = 1; k <= Number(presses); k++) {
  if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1200) }
  const r = await p.evaluate(() => [...document.querySelectorAll('[data-group]')].map((g) => {
    const gr = g.getBoundingClientRect()
    let worst = null
    for (const e of g.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue; const over = Math.max(r.bottom - gr.bottom, r.right - gr.right); if (!worst || over > worst.over) worst = { over: Math.round(over), txt: (e.textContent || '').trim().slice(0, 30), cls: (e.className?.baseVal ?? e.className ?? '').toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) } }
    return { sh: g.scrollHeight - g.clientHeight, sw: g.scrollWidth - g.clientWidth, w: Math.round(gr.width), h: Math.round(gr.height), worst }
  }))
  console.log(`press ${k}:`, JSON.stringify(r))
}
await b.close()
