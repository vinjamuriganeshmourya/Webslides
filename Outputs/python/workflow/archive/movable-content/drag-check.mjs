/**
 * DRAG CHECK (PF 25, user-movable content, 2026-10-08).
 *
 * Drives the dev server and asserts, on a code-only, a box-only and a
 * code-plus-box movable:
 *   - an unmoved slide has no transform on any movable
 *   - a drag by the handle moves the block by exactly the pointer's delta,
 *     at scale 1 (1280x720) and at scale 1.5 (1920x1080)
 *   - a group drag moves the code and its output together
 *   - the block is raised (z-index 60) while dragging
 *   - a drag far off the slide is clamped inside the stage
 *   - touch (CDP touch events) drags too, and does not change slide
 *   - a press-and-drag on the code's own text moves nothing
 *   - Reset layout appears after a move and restores every block
 *   - the layout persists across slide navigation and reload, per slide
 *   - print media drops every offset
 *
 *   node drag-check.mjs [baseUrl]
 */
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const cfg = JSON.parse(readFileSync('deck.config.json', 'utf8'))
const BASE = process.argv[2] ?? `http://localhost:${cfg.devPort}`
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
let fails = 0
const ok = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`)
  if (!cond) fails++
}
const near = (a, c, tol = 1.5) => Math.abs(a - c) <= tol

async function open(page, slide, step = 0) {
  await page.goto('about:blank')
  await page.goto(`${BASE}/?nav=steps&v=${slide}#/${slide}`, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  const on = await page.$('[data-autoplay-ignore] button[aria-pressed="true"]')
  if (on) await on.click()
  for (let i = 0; i < step; i++) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
  }
  await page.waitForTimeout(1500)
}
const rect = (page, id) => page.$eval(`[data-movable="${id}"]`, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })
const handle = async (page, id) => {
  const h = await page.$(`[data-movable="${id}"] > [data-move-handle]`)
  const r = await h.boundingBox()
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
}
async function mouseDrag(page, id, dx, dy, probe) {
  const h = await handle(page, id)
  await page.mouse.move(h.x, h.y)
  await page.mouse.down()
  await page.mouse.move(h.x + dx / 2, h.y + dy / 2, { steps: 4 })
  if (probe) await probe()
  await page.mouse.move(h.x + dx, h.y + dy, { steps: 4 })
  await page.mouse.up()
  await page.waitForTimeout(200)
}
const scrolled = (page) => page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => e.scrollTop || e.scrollLeft).map((e) => `${e.tagName}.${String(e.className).slice(0, 40)} ${e.scrollTop},${e.scrollLeft}`).join(' | '))
const hash = (page) => page.evaluate(() => location.hash)

for (const [vw, vh] of [[1280, 720], [1920, 1080]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, hasTouch: true })
  const page = await ctx.newPage()
  const S = vw / 1280
  console.log(`\n== viewport ${vw}x${vh} (slide scale ${S})`)

  /* C2, slide 8, after the run: code, output, cells and shape are all on screen */
  await open(page, 8, 3)
  const none = await page.$$eval('[data-movable]', (els) => els.every((e) => getComputedStyle(e).transform === 'none'))
  ok(none, 'unmoved slide: no transform on any movable')
  ok((await page.$$('[data-move-reset]')).length === 0, 'unmoved slide: no Reset layout button')

  /* box only (first: a moved block sits above its neighbours, by design, so it would cover this one's handle) */
  const k0 = await rect(page, 'cells')
  await mouseDrag(page, 'cells', -60 * S, 90 * S)
  const k1 = await rect(page, 'cells')
  ok(near(k1.x - k0.x, -60 * S) && near(k1.y - k0.y, 90 * S), `box only (cells): moved (${(k1.x - k0.x).toFixed(1)}, ${(k1.y - k0.y).toFixed(1)})`)

  if (process.env.DBG) console.log('code only */', await scrolled(page))
  /* code only */
  const c0 = await rect(page, 'run-code')
  const o0 = await rect(page, 'run-out')
  let z = null
  await mouseDrag(page, 'run-code', 120 * S, 40 * S, async () => {
    z = await page.$eval('[data-movable="run-code"]', (e) => getComputedStyle(e).zIndex)
  })
  const c1 = await rect(page, 'run-code')
  ok(near(c1.x - c0.x, 120 * S) && near(c1.y - c0.y, 40 * S), `code only: follows the pointer exactly (${(c1.x - c0.x).toFixed(1)}, ${(c1.y - c0.y).toFixed(1)}) for (${120 * S}, ${40 * S})`)
  ok(z === '60', `code only: raised while dragging (z-index ${z})`)
  const o1 = await rect(page, 'run-out')
  ok(near(o1.x, o0.x) && near(o1.y, o0.y), 'code only: its output box did not move')

  if (process.env.DBG) console.log('code + box togeth', await scrolled(page))
  /* code + box together */
  const g0 = await rect(page, 'run')
  const oo0 = await rect(page, 'run-out')
  const cc0 = await rect(page, 'run-code')
  await mouseDrag(page, 'run', 30 * S, 60 * S)
  const oo1 = await rect(page, 'run-out')
  const cc1 = await rect(page, 'run-code')
  ok(near(oo1.x - oo0.x, 30 * S) && near(oo1.y - oo0.y, 60 * S) && near(cc1.x - cc0.x, 30 * S) && near(cc1.y - cc0.y, 60 * S), 'code + box: the group handle moves both by the same delta')
  void g0

  if (process.env.DBG) console.log('clamp */', await scrolled(page))
  /* clamp */
  const stage = await page.$eval('[data-slide-stage], .slide-stage', (e) => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom } })
  await mouseDrag(page, 'shape', 3000, 3000)
  const sh = await rect(page, 'shape')
  ok(sh.x + sh.w <= stage.r + 1 && sh.y + sh.h <= stage.b + 1, 'clamp: dragged far right and down, still inside the slide')
  await mouseDrag(page, 'shape', -5000, -5000)
  const sh2 = await rect(page, 'shape')
  ok(sh2.x >= stage.l - 1 && sh2.y >= stage.t - 1, 'clamp: dragged far left and up, still inside the slide')

  if (process.env.DBG) console.log('selecting code te', await scrolled(page))
  /* selecting code text does not drag */
  const before = await rect(page, 'run-code')
  /* press on the second code line, drag along it: that is a text selection, not a move */
  const cr = await rect(page, 'run-code')
  await page.mouse.move(cr.x + 60 * S, cr.y + 70 * S)
  await page.mouse.down()
  await page.mouse.move(cr.x + 260 * S, cr.y + 72 * S, { steps: 5 })
  await page.mouse.up()
  const after = await rect(page, 'run-code')
  ok(near(after.x, before.x) && near(after.y, before.y) && (await hash(page)).startsWith('#/8'), `press-and-drag on the code text (a selection) moves nothing`)
  await page.evaluate(() => getSelection().removeAllRanges())

  if (process.env.DBG) console.log('persistence', await scrolled(page))
  /* persistence across navigation and reload */
  const kept = await rect(page, 'cells')
  await page.keyboard.press('Control+ArrowRight')
  await page.waitForTimeout(800)
  await page.keyboard.press('Control+ArrowLeft')
  await page.waitForTimeout(1500)
  ok((await page.$$eval('[data-movable="cells"]', (e) => getComputedStyle(e[0]).transform)) !== 'none', 'persists: back on the slide, the cells are still moved')
  await page.reload({ waitUntil: 'load' })
  await page.waitForTimeout(1800)
  const kept2 = await rect(page, 'cells')
  ok(near(kept2.x, kept.x, 3) && near(kept2.y, kept.y, 3), 'persists: after a reload, same place')
  /* other slides untouched */
  await open(page, 9, 2)
  ok(await page.$$eval('[data-movable]', (els) => els.every((e) => getComputedStyle(e).transform === 'none')), 'per slide: the next card is not moved')
  await open(page, 8, 3)

  if (process.env.DBG) console.log('print */', await scrolled(page))
  /* print */
  await page.emulateMedia({ media: 'print' })
  ok(await page.$$eval('[data-movable]', (els) => els.every((e) => getComputedStyle(e).transform === 'none')), 'print media: every movable at its default place')
  await page.emulateMedia({ media: 'screen' })

  if (process.env.DBG) console.log('reset */', await scrolled(page))
  /* reset */
  const btn = await page.$('[data-move-reset]')
  if (process.env.DBG && btn) console.log('reset at', JSON.stringify(await btn.boundingBox()))
  ok(!!btn, 'Reset layout shows once something moved')
  await btn.click()
  await page.waitForTimeout(400)
  ok(await page.$$eval('[data-movable]', (els) => els.every((e) => getComputedStyle(e).transform === 'none')), 'Reset layout: every block back, no transform')
  ok((await page.$$('[data-move-reset]')).length === 0, 'Reset layout: the button goes away')
  if (process.env.DBG) console.log('after reset', await scrolled(page), await page.$eval('[data-move-reset]', (e) => 1).catch(() => 'gone'))
  const c2 = await rect(page, 'run-code')
  ok(near(c2.x, c0.x) && near(c2.y, c0.y), `Reset layout: code exactly at its first place (${c2.x},${c2.y} vs ${c0.x},${c0.y})`)

  /* touch, via CDP touch events (pointerType "touch") */
  const cdp = await ctx.newCDPSession(page)
  const t0 = await rect(page, 'run')
  const hh = await handle(page, 'run')
  console.log('touch target:', await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.outerHTML.slice(0, 90), [hh.x, hh.y]))
  const pt = (x, y) => [{ x, y, id: 1 }]
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(hh.x, hh.y) })
  for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(hh.x - (40 * S * i) / 6, hh.y + (30 * S * i) / 6) })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(600)
  const t1 = await rect(page, 'run')
  ok(near(t1.x - t0.x, -40 * S, 2.5) && near(t1.y - t0.y, 30 * S, 2.5), `touch: the group follows the finger (${(t1.x - t0.x).toFixed(1)}, ${(t1.y - t0.y).toFixed(1)})`)
  ok((await hash(page)).startsWith('#/8'), 'touch: a sideways drag on a handle does not change slide')
  await (await page.$('[data-move-reset]'))?.click()

  /* every content card has a code-only, a box and (where it has code and output) a group */
  await ctx.close()
}

/* inventory: which movables each content card carries */
const page = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage()
const STEPS = JSON.parse(readFileSync('src/export/revealSteps.ts', 'utf8').match(/PAGE_REVEAL_MAX_STEPS: number\[\] = (\[[^\]]*\])/)[1])
console.log('\n== movables per card (fully revealed)')
for (let i = 1; i <= STEPS.length; i++) {
  if (!STEPS[i - 1]) continue
  await page.goto('about:blank')
  await page.goto(`${BASE}/?nav=steps&v=${i}#/${i}`, { waitUntil: 'load' })
  await page.waitForTimeout(900)
  const ids = await page.$$eval('[data-movable]', (els) => els.map((e) => e.getAttribute('data-movable')))
  console.log(`slide ${String(i).padStart(2)}: ${ids.join(', ')}`)
}
await b.close()
console.log(fails ? `\n${fails} FAILED` : '\nALL PASS')
process.exit(fails ? 1 : 0)
