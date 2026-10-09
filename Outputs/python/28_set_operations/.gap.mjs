// scratch: per step, the gap from the lowest content to the controls, container sizes, and text overlaps.
// node .gap.mjs <slide> <presses>
import { chromium } from 'playwright-core'
const [n, presses] = process.argv.slice(2).map(Number)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:5258/?nav=steps&noauto&g=${n}#/${n}`, { waitUntil: 'load' })
await p.waitForTimeout(2200)
const probe = () => {
  const spec = document.querySelector('[data-spec]')
  const ctl = spec.querySelector('[data-autoplay-ignore]')
  const btns = ctl ? [...ctl.querySelectorAll('button')].map((x) => x.getBoundingClientRect()) : []
  const top = Math.min(...btns.map((r) => r.top))
  const vis = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.opacity === '0' || cs.display === 'none' || cs.visibility === 'hidden') return false } return true }
  let low = 0, lowEl = ''
  for (const e of spec.querySelectorAll('*')) {
    if (ctl && (ctl.contains(e))) continue
    if (e.closest('svg') && e.tagName !== 'svg') continue
    const r = e.getBoundingClientRect()
    if (r.width < 2 || r.height < 2 || !vis(e)) continue
    if (r.bottom > low) { low = r.bottom; lowEl = (e.className?.baseVal ?? e.className ?? '').toString().slice(0, 40) + ' ' + (e.textContent || '').trim().slice(0, 20) }
  }
  const groups = [...spec.querySelectorAll('.rounded-\\[20px\\]')].map((g) => { const r = g.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` })
  /* text overlaps: leaf text elements whose boxes intersect */
  const leaves = [...spec.querySelectorAll('span, div, p')].filter((e) => !(ctl && ctl.contains(e)) && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && vis(e))
  const ov = []
  for (let i = 0; i < leaves.length; i++) for (let j = i + 1; j < leaves.length; j++) {
    const a = leaves[i], c = leaves[j]
    if (a.contains(c) || c.contains(a)) continue
    const r = a.getBoundingClientRect(), q = c.getBoundingClientRect()
    const ox = Math.min(r.right, q.right) - Math.max(r.left, q.left), oy = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top)
    if (ox > 1 && oy > 1) ov.push(`"${a.textContent.trim().slice(0, 14)}"x"${c.textContent.trim().slice(0, 14)}"`)
  }
  return { gap: Math.round(top - low), lowEl, groups: groups.join(' '), ov: ov.slice(0, 6) }
}
for (let k = 1; k <= presses; k++) {
  if (k > 1) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(3300) }
  const r = await p.evaluate(probe)
  console.log(`s${n} step ${k}: gap ${r.gap}px (lowest: ${r.lowEl}) | groups ${r.groups}${r.ov.length ? ' | OVERLAP ' + r.ov.join(', ') : ''}`)
}
await b.close()
