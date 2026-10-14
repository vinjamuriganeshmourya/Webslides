// scratch: per press, the rect and computed height rules of every group box on a card, and the inner element whose height changes.
// node .boxes.mjs <port> "slide:presses,..."
import { chromium } from 'playwright-core'
const [port, list] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const probe = () => {
  const spec = document.querySelector('[data-spec]')
  const groups = [...spec.querySelectorAll('.rounded-\\[20px\\]')].filter((g) => !g.parentElement.closest('.rounded-\\[20px\\]'))
  return groups.map((g) => {
    const r = g.getBoundingClientRect(); const cs = getComputedStyle(g)
    const kids = [...g.children].map((c) => { const q = c.getBoundingClientRect(); return `${Math.round(q.height)}:${(c.className || '').toString().slice(0, 18)}|${(c.textContent || '').trim().slice(0, 14)}` })
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), style: `h=${g.style.height || 'auto'} minH=${g.style.minHeight || '-'} flex=${cs.alignSelf}/${getComputedStyle(g.parentElement).alignItems}`, kids }
  })
}
for (const item of list.split(',')) {
  const [n, presses] = item.split(':').map(Number)
  await p.goto(`http://localhost:${port}/?nav=steps&noauto&b=${n}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(1800)
  const rows = []
  for (let k = 1; k <= presses; k++) {
    if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1200) }
    rows.push(await p.evaluate(probe))
  }
  console.log(`\n== slide ${n}`)
  const n0 = Math.max(...rows.map((r) => r.length))
  for (let gi = 0; gi < n0; gi++) {
    const hs = rows.map((r) => r[gi]?.h ?? '-')
    const g = rows.find((r) => r[gi])[gi]
    const pos = g.x < 300 && g.w > 900 ? 'full-width' : g.y > 400 ? 'bottom' : g.x < 400 ? 'left' : 'right'
    console.log(` group ${gi} (${pos}) at x${g.x} y${g.y} w${g.w}: heights per press [${hs.join(',')}] ${g.style}`)
    if (new Set(hs).size > 1) {
      /* which child changes */
      const kidsPer = rows.map((r) => r[gi]?.kids ?? [])
      const kn = Math.max(...kidsPer.map((k) => k.length))
      for (let ki = 0; ki < kn; ki++) {
        const khs = kidsPer.map((k) => k[ki] ?? '-')
        const heights = khs.map((s) => s.split(':')[0])
        if (new Set(heights).size > 1) console.log(`    child ${ki} heights [${heights.join(',')}] ${khs.find((s) => s !== '-').split(':')[1]}`)
      }
    }
  }
}
await b.close()
