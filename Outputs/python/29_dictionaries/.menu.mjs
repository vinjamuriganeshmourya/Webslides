// the slide menu with its Auto-play option: open it with G on a slide, screenshot at three viewports, measure the two cards
import { chromium } from 'playwright-core'
const [port, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [name, vp, mobile] of [['desktop', { width: 1280, height: 720 }, false], ['portrait', { width: 390, height: 844 }, true], ['landscape', { width: 844, height: 390 }, true]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
  await p.goto(`http://localhost:${port}/?nav=steps&noauto#/${process.argv[4] ?? 4}`, { waitUntil: 'load' })
  await p.waitForTimeout(1800)
  await p.keyboard.press('g')
  await p.waitForTimeout(700)
  const m = await p.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-label="Jump to a slide"]')
    if (!dlg) return 'NO DIALOG'
    const d = dlg.getBoundingClientRect()
    const cards = [...dlg.querySelectorAll('[role="group"][aria-label="Auto-play"] button')]
    const slide = dlg.querySelector('[aria-current="true"]')
    const s = slide?.getBoundingClientRect()
    return cards.map((c) => {
      const r = c.getBoundingClientRect(); const t = c.lastElementChild
      return `${c.textContent.trim().slice(0, 34)} | pressed=${c.getAttribute('aria-pressed')} | x=${r.left.toFixed(0)}..${r.right.toFixed(0)} y=${r.top.toFixed(0)}..${r.bottom.toFixed(0)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)} | inside dialog=${r.left >= d.left && r.right <= d.right && r.top >= d.top && r.bottom <= d.bottom} | text fits=${t.scrollWidth <= t.clientWidth + 1} (${t.scrollWidth}/${t.clientWidth})`
    }).concat([`slide card w=${s?.width.toFixed(0)} h=${s?.height.toFixed(0)}`])
  })
  console.log(`== ${name} ${vp.width}x${vp.height}`); for (const l of [].concat(m)) console.log('  ' + l)
  await p.screenshot({ path: `${out}/menu-${name}.png`, timeout: 20000 })
  await p.close()
}
await b.close()
