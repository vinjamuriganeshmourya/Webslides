// every [data-group] on a slide at each press: its box, how far its content runs past it, and the children of an overflowing one
import { chromium } from 'playwright-core'
const [port, slide, presses] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:${port}/?nav=steps&noauto#/${slide}`, { waitUntil: 'load' })
await p.waitForTimeout(2200)
for (let k = 1; k <= Number(presses); k++) {
  if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(2200) }
  const rows = await p.evaluate(() => {
    const out = []
    for (const g of document.querySelectorAll('[data-spec] [data-group]')) {
      const r = g.getBoundingClientRect()
      const oy = g.scrollHeight - g.clientHeight, ox = g.scrollWidth - g.clientWidth
      const line = `group x=${r.left.toFixed(0)}..${r.right.toFixed(0)} y=${r.top.toFixed(0)}..${r.bottom.toFixed(0)} overX=${ox} overY=${oy} "${g.textContent.trim().slice(0, 24)}"`
      if (ox > 1 || oy > 1) {
        const kids = [...g.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > r.right + 1 || b.bottom > r.bottom + 1) }).slice(0, 4)
        out.push(line + ' <<< OVER'); for (const e of kids) { const b = e.getBoundingClientRect(); out.push(`     ${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 3).join('.')} x=${b.left.toFixed(0)}..${b.right.toFixed(0)} y=${b.top.toFixed(0)}..${b.bottom.toFixed(0)} "${(e.textContent || '').trim().slice(0, 20)}"`) }
      } else out.push(line)
    }
    return out
  })
  console.log(`press ${k}`); for (const r of rows) console.log('  ' + r)
}
await b.close()
