/**
 * Export slide types from the running deck as editable SVG.
 *
 *   CHROME_PATH=/opt/google/chrome/chrome node workflow/slide-types/export-svg.mjs 1 4 8 …
 *
 * Uses `dom-to-svg` to walk the live DOM, so text stays <text> with its real
 * font family and shapes stay <rect>/<path>. Figma imports the result as an
 * editable vector tree rather than a flat picture.
 *
 * THREE THINGS THE CONVERTER CANNOT DO, AND WHAT WE DO ABOUT THEM
 *
 * 1. Remote resources. `inlineResources` leaves <image> pointing at the dev
 *    server, which is dead the moment the file leaves this machine. Every image
 *    is re-fetched and embedded as a data URI. Note the attribute is written
 *    under the LITERAL name "xlink:href" with no namespace binding, so
 *    getAttributeNS(XLINK, 'href') misses it entirely.
 *
 * 2. CSS filters. The footer mark is reversed to white on dark slides with
 *    `filter: brightness(0) invert(1)`, which has no SVG equivalent here, so the
 *    navy artwork would show through on a navy slide. Dark slides get a
 *    pre-inverted copy of the mark instead.
 *
 * 3. Radial gradients on the converted root. Linear gradients survive; a
 *    radial-gradient background on the <section> itself is dropped, which turns
 *    the night-variant slides white. The computed value is parsed and re-emitted
 *    as an SVG <radialGradient> behind everything else.
 *
 * Still lost, and not worth faking: `filter: blur()` on the decorative aurora
 * blobs. They convert to hard-edged circles. Only BrandSlide leans on them.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, 'svg')
const TMP = '/home/nxtwave/.claude/jobs/d0d1a407/tmp'
const LIB = path.join(TMP, 'dom-to-svg.js')
const URL_BASE = process.env.DECK_URL ?? 'http://localhost:5199'

/* The mark is a 2048px PNG rendered ~75px wide, so embedding the original put
   208KB of logo into every file. Both variants are the same art at 360px. */
const LOGO_DARK = fs.readFileSync(path.join(TMP, 'logo_small_b64.txt'), 'utf8')
const LOGO_WHITE = fs.readFileSync(path.join(TMP, 'logo_white_b64.txt'), 'utf8')

const SLIDES = process.argv.slice(2).map(Number)
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

for (const n of SLIDES) {
  await page.goto(`${URL_BASE}/?all#/${n}`, { waitUntil: 'networkidle' })
  // the progress rail, slide counter and nav buttons are the player, not the slide
  await page.addStyleTag({ content: '.z-30{display:none !important}' })
  await page.waitForTimeout(3200)
  await page.addScriptTag({ path: LIB })

  const { svg, images, backfilled } = await page.evaluate(
    async ({ logoDark, logoWhite }) => {
      const sections = [...document.querySelectorAll('section')]
      const sec =
        sections.find((s) => {
          const r = s.getBoundingClientRect()
          return r.width > 100 && r.height > 100 && getComputedStyle(s).opacity !== '0'
        }) ?? sections[0]

      // Is the footer mark being reversed to white on this slide?
      const markEl = sec.querySelector('img[alt="NxtWave"]')
      const marksAreWhite = Boolean(markEl && getComputedStyle(markEl).filter !== 'none')

      const doc = window.DomToSvg.elementToSVG(sec)
      await window.DomToSvg.inlineResources(doc.documentElement)
      const root = doc.documentElement
      const SVGNS = 'http://www.w3.org/2000/svg'

      /* 3. re-emit a dropped radial-gradient background */
      let backfilled = false
      const bg = getComputedStyle(sec).backgroundImage
      if (bg.startsWith('radial-gradient')) {
        const at = bg.match(/at\s+([\d.]+)%\s+([\d.]+)%/)
        const stops = [...bg.matchAll(/(rgba?\([^)]*\))\s+([\d.]+)%/g)]
        if (at && stops.length) {
          const grad = doc.createElementNS(SVGNS, 'radialGradient')
          grad.setAttribute('id', 'slide-bg')
          grad.setAttribute('cx', `${at[1]}%`)
          grad.setAttribute('cy', `${at[2]}%`)
          grad.setAttribute('r', '120%')
          for (const [, color, pos] of stops) {
            const s = doc.createElementNS(SVGNS, 'stop')
            s.setAttribute('offset', `${pos}%`)
            s.setAttribute('stop-color', color)
            grad.appendChild(s)
          }
          const defs = doc.createElementNS(SVGNS, 'defs')
          defs.appendChild(grad)
          const rect = doc.createElementNS(SVGNS, 'rect')
          rect.setAttribute('x', '0')
          rect.setAttribute('y', '0')
          rect.setAttribute('width', '1280')
          rect.setAttribute('height', '720')
          rect.setAttribute('fill', 'url(#slide-bg)')
          root.insertBefore(rect, root.firstChild)
          root.insertBefore(defs, root.firstChild)
          backfilled = true
        }
      }

      /* 1 + 2. embed every image, swapping the mark for the right variant */
      let images = 0
      for (const img of root.querySelectorAll('image')) {
        const href = img.getAttribute('xlink:href') || img.getAttribute('href')
        if (!href || href.startsWith('data:')) continue
        if (href.includes('logo-nxtwave.png')) {
          img.setAttribute('xlink:href', marksAreWhite ? logoWhite : logoDark)
          images++
          continue
        }
        const blob = await (await fetch(href)).blob()
        const dataUri = await new Promise((resolve) => {
          const fr = new FileReader()
          fr.onload = () => resolve(fr.result)
          fr.readAsDataURL(blob)
        })
        img.setAttribute('xlink:href', dataUri)
        images++
      }

      return { svg: new XMLSerializer().serializeToString(doc), images, backfilled }
    },
    { logoDark: LOGO_DARK, logoWhite: LOGO_WHITE },
  )

  const file = path.join(OUT, `slide-${String(n).padStart(2, '0')}.svg`)
  fs.writeFileSync(file, svg)
  process.stdout.write(`${n}:${Math.round(svg.length / 1024)}kb/${images}img${backfilled ? '/bg' : ''} `)
}

await browser.close()
console.log('\nwrote', SLIDES.length, 'files to', OUT)
