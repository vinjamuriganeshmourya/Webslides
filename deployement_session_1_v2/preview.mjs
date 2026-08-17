/**
 * PREVIEW HARNESS for the standalone HTML deck.
 *
 * Runs the built single-file deck from file:// with all network traffic
 * blocked, then captures two things:
 *
 *   1. A full sweep of every slide with ?all (every build step revealed), so
 *      the contact sheet shows finished slides rather than empty step-0 frames.
 *   2. Mid-flight frames of a slide-to-slide transition and of a Ctrl+Arrow
 *      build step, which is the only way to show that the motion survived
 *      bundling — a settled screenshot cannot.
 *
 *   node preview.mjs dist-single/deployment-session-1.html <outDir> [slideCount]
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const FILE = resolve(process.argv[2] ?? 'dist-single/deployment-session-1.html')
const OUT = resolve(process.argv[3] ?? 'workflow/preview')
const TOTAL = Number(process.argv[4] ?? 35)
mkdirSync(`${OUT}/slides`, { recursive: true })
mkdirSync(`${OUT}/motion`, { recursive: true })

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
// Nothing may reach the network. If the deck still needs a CDN, this fails it.
await ctx.route(/^https?:\/\//, (r) => r.abort())
const page = await ctx.newPage()

const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

/* ── 1. every slide, fully built ──────────────────────────────────────── */

const blank = []
for (let i = 1; i <= TOTAL; i++) {
  await page.goto(`file://${FILE}?all#/${i}`, { waitUntil: 'load' })
  await page.waitForTimeout(1100)
  const ink = await page.evaluate(() => {
    const s = document.querySelector('section')
    if (!s) return { text: 0, imgs: 0, broken: 0 }
    const imgs = [...s.querySelectorAll('img')]
    return {
      text: s.innerText.replace(/\s/g, '').length,
      imgs: imgs.length,
      broken: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).length,
    }
  })
  if (ink.text < 12 || ink.broken > 0) blank.push({ slide: i, ...ink })
  await page.screenshot({ path: `${OUT}/slides/${String(i).padStart(2, '0')}.png` })
}

/* ── 2. motion, caught mid-flight ─────────────────────────────────────── */

// A slide-to-slide cross-fade/slide. Frames every 70ms across the transition.
await page.goto(`file://${FILE}#/4`, { waitUntil: 'load' })
await page.waitForTimeout(1200)
await page.keyboard.press('ArrowRight')
for (let f = 0; f < 8; f++) {
  await page.screenshot({ path: `${OUT}/motion/transition-${f}.png` })
  await page.waitForTimeout(70)
}

// A build step: Ctrl+Arrow, sampled while the reveal is still staggering in.
await page.goto(`file://${FILE}#/6`, { waitUntil: 'load' })
await page.waitForTimeout(1200)
const steps = []
for (let s = 0; s < 5; s++) {
  steps.push(await page.evaluate(() => document.querySelectorAll('section *').length))
  await page.screenshot({ path: `${OUT}/motion/build-${s}.png` })
  await page.keyboard.down('Control')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.up('Control')
  await page.waitForTimeout(140) // deliberately mid-animation
  await page.screenshot({ path: `${OUT}/motion/build-${s}-midflight.png` })
  await page.waitForTimeout(500)
}

console.log(
  JSON.stringify(
    { file: FILE, slidesCaptured: TOTAL, suspectSlides: blank, buildStepDomCounts: steps, errors: errors.slice(0, 10) },
    null,
    2,
  ),
)
await browser.close()
