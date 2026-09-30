import { chromium } from 'playwright'
import fs from 'node:fs'
import { SLIDE_COUNT, DEV_PORT } from './deck.config.mjs'

const URL = process.argv[2] ?? `http://localhost:${DEV_PORT}/?all`
const TOTAL = Number(process.argv[3] ?? SLIDE_COUNT)
const OUT = process.argv[4] ?? 'workflow/qa-shots'
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
  /*
    2600ms, not 700 and not 1800.

    `?all` opens every click-gated step but does not fast-forward entrances that
    play on mount, so this has to outlast the slowest one in the kit.

      AgendaSlide  ~2.38s  items are cued off the curve drawing itself
      DataTable    ~1.5s   rows are timed off the header, not staggered by a parent

    At 700ms every table slide showed a header and one row over an empty panel;
    at 1800ms every agenda showed two items and a third at 30% opacity. Both look
    exactly like content bugs and neither is one. The overflow numbers were right
    the whole time (the rects exist while the content is transparent), but a QA
    screenshot nobody can read is not QA.
  */
  await page.waitForTimeout(2600)

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
console.log(issues === 0 ? `ALL ${TOTAL} CLEAN` : `${issues} slide(s) with issues`)
if (errors.length) console.log('CONSOLE ERRORS:', [...new Set(errors)].slice(0, 8))
