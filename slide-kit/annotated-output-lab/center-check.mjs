/**
 * Horizontal centring check for this lab's gallery.
 *
 * The reviewer's requirement, in two parts: "the center is missing from many
 * variants ensure the component are center in the content slides", and "in all
 * labs the content is top aligned i want content to be center aligned".
 *
 * So this measures BOTH axes. A candidate that hangs annotation furniture off
 * the side of the panel changes the COMPOSITE bounding box, so the panel alone
 * being centred proves nothing: the figure wrapper and the panel inside it are
 * reported separately. Vertically it prints the top and bottom gap of the
 * composite inside the well, plus the panel's resulting top edge on the stage,
 * which must stay clear of the instructor-video floor at y=220.
 *
 * Over 24px of skew is off-centre on either axis.
 */
import { chromium } from 'playwright'
const slides = [
  [2, 'incumbent'], [3, 'braced'], [4, 'count'], [5, 'two-enclosures'],
  [6, 'gutter'], [7, 'callouts'], [8, 'datum'], [9, 'chrome'],
]
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
let bad = 0
let lastWell = { top: 0, h: 0 }
for (const [n, name] of slides) {
  await p.goto(`http://localhost:5232/?all#/${n}`, { waitUntil: 'load' })
  await p.waitForTimeout(2600)
  const r = await p.evaluate(() => {
    const well = document.querySelector('.min-h-0.flex-1')
    const fig = document.querySelector('[style*="padding-top"]')
    const panel = document.querySelector('div.overflow-hidden.rounded-card.shadow-card')
    const stage = document.getElementById('root').getBoundingClientRect()
    const g = (outer, inner) => {
      const a = outer.getBoundingClientRect(), c = inner.getBoundingClientRect()
      return {
        l: +(c.left - a.left).toFixed(1),
        r: +(a.right - c.right).toFixed(1),
        t: +(c.top - a.top).toFixed(1),
        b: +(a.bottom - c.bottom).toFixed(1),
      }
    }
    const w = well.getBoundingClientRect()
    return {
      fig: g(well, fig),
      panel: g(well, panel),
      wellW: +w.width.toFixed(1),
      wellTop: +(w.top - stage.top).toFixed(1),
      wellH: +w.height.toFixed(1),
      panelTop: +(panel.getBoundingClientRect().top - stage.top).toFixed(1),
      figH: +fig.getBoundingClientRect().height.toFixed(1),
    }
  })
  lastWell = { top: r.wellTop, h: r.wellH }
  const skew = Math.abs(r.fig.l - r.fig.r)
  const pskew = Math.abs(r.panel.l - r.panel.r)
  const vskew = Math.abs(r.fig.t - r.fig.b)
  const notes = []
  if (skew > 24) notes.push('FIGURE OFF CENTRE (x)')
  if (pskew > 24) notes.push('PANEL OFF CENTRE (x)')
  if (vskew > 24) notes.push('OFF CENTRE (y)')
  if (r.panelTop < 224) notes.push('PANEL IN VIDEO RESERVE')
  if (notes.length) bad++
  console.log(
    `${name.padEnd(16)} figH ${String(r.figH).padStart(6)}  T${String(r.fig.t).padStart(6)}/B${String(r.fig.b).padStart(6)}` +
      ` vskew ${vskew.toFixed(1).padStart(5)}  panelTop ${String(r.panelTop).padStart(6)}` +
      `  figure L${r.fig.l}/R${r.fig.r} skew ${skew.toFixed(1)}  panel L${r.panel.l}/R${r.panel.r} skew ${pskew.toFixed(1)}` +
      (notes.length ? '  <-- ' + notes.join(', ') : ''),
  )
}
console.log(`well top ${lastWell.top} height ${lastWell.h}`)
console.log(bad === 0 ? 'CENTRED, both axes, clear of the video reserve' : `${bad} slide(s) with a placement finding`)
await b.close()
