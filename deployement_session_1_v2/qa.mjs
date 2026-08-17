import { chromium } from 'playwright'
import fs from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5175'
const TOTAL = Number(process.argv[3] ?? 44)
const OUT = process.argv[4] ?? '/tmp/claude-1000/-home-nxtwave-Web-Slides/d1ea3893-5898-44ad-868c-ba0c1cdd14b1/scratchpad/shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

const report = []
for (let i = 1; i <= TOTAL; i++) {
  const target = URL.includes('?') ? `${URL}#/${i}` : `${URL}/#/${i}`
  await page.goto(target, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)

  const info = await page.evaluate(() => {
    const sec = document.querySelector('section')
    if (!sec) return { error: 'no section' }
    const sr = sec.getBoundingClientRect()
    // The padded content region inside SlideBase.
    const content = sec.querySelector(':scope > div.relative.z-10')
    const bad = []
    const walk = (el) => {
      for (const c of el.children) {
        const r = c.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const overBottom = r.bottom - (sr.bottom - 8)
        const overRight = r.right - (sr.right - 4)
        const overLeft = sr.left - r.left
        if (overBottom > 1 || overRight > 1 || overLeft > 1) {
          bad.push({
            tag: c.tagName.toLowerCase(),
            cls: (c.className || '').toString().slice(0, 70),
            txt: (c.textContent || '').trim().slice(0, 48),
            overBottom: Math.round(overBottom),
            overRight: Math.round(overRight),
            overLeft: Math.round(overLeft),
          })
          continue // report the outermost offender only
        }
        walk(c)
      }
    }
    if (content) walk(content)
    return {
      contentScroll: content ? content.scrollHeight - content.clientHeight : 0,
      overflow: bad.slice(0, 4),
      title: sec.querySelector('h1,h2')?.textContent?.trim().slice(0, 44) ?? '',
      // The footer carries the NxtWave mark only. The session name used to sit
      // here too, but it collided with the deck's slide counter and duplicated
      // each slide's kicker, so it was removed.
      hasLogo: !!sec.querySelector('footer svg, footer img'),
    }
  })

  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` })
  report.push({ n: i, ...info })
}

await browser.close()

console.log('slide | logo | contentScroll | overflow')
let issues = 0
for (const r of report) {
  const ov = r.overflow?.length ?? 0
  if (!r.hasLogo || r.contentScroll > 1 || ov) {
    issues++
    console.log(
      `${String(r.n).padStart(2)} | ${r.hasLogo ? 'ok' : 'NO LOGO'} | ${r.contentScroll} | ${JSON.stringify(r.overflow)}  <${r.title}>`,
    )
  }
}
console.log(issues === 0 ? 'ALL 44 CLEAN' : `${issues} slide(s) with issues`)
if (errors.length) console.log('CONSOLE ERRORS:', [...new Set(errors)].slice(0, 8))
