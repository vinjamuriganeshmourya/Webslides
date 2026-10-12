// scratch: per press, the gap from the lowest visible content of the card to the step controls (Next, Autoplay).
// node .gap.mjs <port> "slide:presses,..."
import { chromium } from 'playwright-core'
const [port, list] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const probe = () => {
  const spec = document.querySelector('[data-spec]')
  if (!spec) return null
  const ctl = spec.querySelector('[data-autoplay-ignore]')
  const btns = ctl ? [...ctl.querySelectorAll('button')].map((x) => x.getBoundingClientRect()) : []
  const top = Math.min(...btns.map((r) => r.top))
  const vis = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.opacity === '0' || cs.display === 'none' || cs.visibility === 'hidden') return false } return true }
  let low = 0, lowEl = ''
  for (const e of spec.querySelectorAll('*')) {
    if (ctl && ctl.contains(e)) continue
    if (e.closest('svg') && e.tagName !== 'svg') continue
    const r = e.getBoundingClientRect()
    if (r.width < 2 || r.height < 2 || !vis(e)) continue
    if (r.bottom > low) { low = r.bottom; lowEl = (e.className?.baseVal ?? e.className ?? '').toString().slice(0, 30) + ' ' + (e.textContent || '').trim().slice(0, 24) }
  }
  return { gap: Math.round(top - low), lowEl }
}
for (const item of list.split(',')) {
  const [n, presses] = item.split(':').map(Number)
  await p.goto(`http://localhost:${port}/?nav=steps&noauto&g=${n}#/${n}`, { waitUntil: 'load' })
  await p.waitForTimeout(1800)
  let worst = { gap: 9999, k: 0, lowEl: '' }
  for (let k = 1; k <= presses; k++) {
    if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1300) }
    const r = await p.evaluate(probe)
    if (r && r.gap < worst.gap) worst = { ...r, k }
  }
  console.log(`slide ${n}: smallest gap ${worst.gap}px at press ${worst.k} (${worst.lowEl})${worst.gap < 20 ? '   <-- UNDER 20' : ''}`)
}
await b.close()
