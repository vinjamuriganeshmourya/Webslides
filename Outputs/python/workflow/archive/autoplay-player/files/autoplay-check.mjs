/**
 * autoplay-check.mjs: the three modes of the player, on the BUILT file from
 * file:// with the network blocked (decision 18 in CLAUDE.md).
 *
 *   CHROME_PATH=/usr/bin/brave-browser node autoplay-check.mjs
 *
 * Auto Play is the mode on load and `?all` still opens slide-wise. On slide 4 the
 * build plays itself to its last step and stays on the slide. A PAUSED slide
 * (`autoPlay: false`: 5, 17, 18, 24, 27, 29, 30) shows nothing
 * until the first press, and the first press shows step 1 and starts the rest
 * playing. `A` mid-play leaves Auto Play, restages the slide at step 0 and the
 * clock stops; `A` again restarts it; `S` walks slide-wise → step-wise. Exactly
 * one of the Auto Play button and the mode pill is pressed at any time. The
 * slide's own Replay in Auto Play plays the slide again. Zero page errors.
 */
import { chromium } from 'playwright-core'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const cfg = JSON.parse(fs.readFileSync('deck.config.json', 'utf8'))
const file = pathToFileURL(path.resolve(`dist-single/${cfg.htmlName}.html`)).href
const FIRST = 900
const STEP = 2000
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
await ctx.route(/^https?:\/\//, (r) => r.abort())
const p = await ctx.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(String(e)))
const out = []
const deck = () => p.evaluate(() => ({ ...window.__DECK__, slides: undefined }))
const go = async (n, q = '') => { await p.goto(`${file}?t=${Date.now()}${q}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(600) }
const pressed = async () => p.evaluate(() => {
  const btns = [...document.querySelectorAll('[data-deck-controls] button')]
  const auto = btns.find((x) => /Auto Play/.test(x.getAttribute('aria-label') || ''))
  const pill = btns.find((x) => /arrow keys/.test(x.getAttribute('aria-label') || ''))
  const replay = btns.find((x) => /again from the top/.test(x.getAttribute('aria-label') || ''))
  return { auto: auto?.getAttribute('aria-pressed') === 'true', pill: pill?.getAttribute('aria-pressed') === 'true', pillWord: pill?.textContent.trim(), replayButton: Boolean(replay), count: btns.length }
})

// 1. load: Auto Play on, Replay gone, exactly one of the two buttons pressed
await go(4)
let d = await deck(), s = await pressed()
out.push(['opens in Auto Play', d.mode === 'auto'])
out.push(['no Replay button in the bar, Auto Play pressed, pill not', !s.replayButton && s.auto && !s.pill])
out.push(['the bar still has seven buttons', s.count === 7])

// 2. slide 4 plays itself: step 0 at first, then every step on the clock, and stays on slide 4
out.push(['slide 4 lands at step 0', d.step === 0 && d.current === 4])
await p.waitForTimeout(FIRST + 600)
d = await deck()
out.push(['first step by itself after the entrance', d.step === 1])
await p.waitForTimeout(STEP * 3 + 800)
d = await deck()
out.push(['plays to the last step and stays on slide 4', d.step === d.maxStep && d.maxStep === 4 && d.current === 4])
await p.waitForTimeout(STEP + 400)
d = await deck()
out.push(['does not cross to the next slide', d.current === 4])

// 3. a plain arrow moves a whole slide; slide 5 is an assignment and lands paused
await p.keyboard.press('ArrowRight')
await p.waitForTimeout(400)
d = await deck()
out.push(['plain arrow: next slide, at step 0', d.current === 5 && d.step === 0])
await p.waitForTimeout(FIRST + STEP + 800)
d = await deck()
out.push(['slide 5 (assignment) stays paused on entry', d.step === 0 && d.current === 5])
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400)
d = await deck()
out.push(['slide 5: the first press shows step 1', d.current === 5 && d.step === 1])
await p.waitForTimeout(STEP + 700)
d = await deck()
out.push(['slide 5: the rest plays after the first press', d.step >= 2])

// 4. A mid-play: out of Auto Play, restaged at step 0, the clock stopped; A again: it plays
await go(10)
await p.waitForTimeout(FIRST + 700)
d = await deck()
out.push(['slide 10 is mid-play', d.step === 1])
await p.keyboard.press('a')
await p.waitForTimeout(500)
d = await deck(); s = await pressed()
out.push(['A: slide-wise, restaged at step 0, pill pressed and Auto Play not', d.mode === 'slides' && d.step === 0 && s.pill && !s.auto && s.pillWord === 'slide'])
await p.waitForTimeout(FIRST + STEP + 600)
d = await deck()
out.push(['the clock is stopped in slide-wise', d.step === 0])
await p.keyboard.press('a')
await p.waitForTimeout(FIRST + 700)
d = await deck(); s = await pressed()
out.push(['A again: Auto Play, playing again from the top', d.mode === 'auto' && d.step === 1 && s.auto && !s.pill])

// 5. S: Auto Play → slide-wise → step-wise, one pressed button at every stop
await p.keyboard.press('s'); await p.waitForTimeout(300)
d = await deck(); s = await pressed()
const one1 = (s.auto ? 1 : 0) + (s.pill ? 1 : 0) === 1
await p.keyboard.press('s'); await p.waitForTimeout(300)
const d2 = await deck(), s2 = await pressed()
out.push(['S: slide-wise then step-wise, exactly one button pressed each time', d.mode === 'slides' && d2.mode === 'steps' && one1 && !s2.auto && s2.pill && s2.pillWord === 'step'])
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
d = await deck()
out.push(['step-wise: a plain arrow steps the build', d.current === 10 && d.step === 1])

// 6. a worksheet task under Auto Play waits; the first press starts the rest
await go(17)
d = await deck()
out.push(['task 1 opens in Auto Play at step 0', d.mode === 'auto' && d.step === 0])
await p.waitForTimeout(FIRST + STEP + 800)
d = await deck()
out.push(['task 1 does not play by itself', d.step === 0 && d.current === 17])
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400)
d = await deck()
out.push(['task 1: the first press steps the build, not the slide', d.current === 17 && d.step === 1])
await p.waitForTimeout(STEP * 2 + 800)
d = await deck()
out.push(['task 1: the rest plays after the first press', d.step >= 3 && d.current === 17])
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
const dh = await deck()
await p.waitForTimeout(STEP + 600)
d = await deck()
out.push(['a hand on the key mid-play steps once and stops the clock', d.step === dh.step && d.current === 17])

// 6b. every other paused slide lands paused on load, including the vote games
for (const n of [18, 24, 27, 29, 30]) {
  await go(n)
  await p.waitForTimeout(FIRST + STEP + 500)
  d = await deck()
  out.push([`slide ${n} stays paused on load`, d.mode === 'auto' && d.step === 0 && d.current === n])
}
// slides 3, 13, 14, 15 play on entry (user, 2026-10-06)
for (const n of [3, 13, 14, 15]) {
  await go(n)
  await p.waitForTimeout(FIRST + 700)
  d = await deck()
  out.push([`slide ${n} plays on entry`, d.mode === 'auto' && d.step >= 1 && d.current === n])
}
// the machine: the first press runs round 1, then the rounds play on
await go(24)
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
d = await deck()
await p.waitForTimeout(STEP * 2 + 800)
const dm = await deck()
out.push(['slide 24: first press runs round 1, then the rest plays', d.step === 1 && dm.step >= 3 && dm.current === 24])
// a slide that is not paused still plays on entry from a paused one
await go(29)
for (let i = 0; i < 4; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(250) }
d = await deck()
out.push(['task 3: four presses cross into slide 30', d.current === 30 && d.step === 0])

// 7. the slide's own Replay in Auto Play plays the slide again
await go(4)
await p.waitForTimeout(FIRST + STEP * 4 + 900)
d = await deck()
out.push(['slide 4 fully played', d.step === 4])
await p.getByRole('button', { name: 'Replay', exact: true }).click()
await p.waitForTimeout(300)
const r0 = await deck()
await p.waitForTimeout(FIRST + 700)
d = await deck()
out.push(['Replay restages at 0 and plays again', r0.step === 0 && d.step === 1])

// 8. the harness flag still opens slide-wise, and ?nav=steps still opens step-wise
await go(4, '&all')
d = await deck()
await p.waitForTimeout(FIRST + STEP)
const dAll = await deck()
out.push(['?all opens slide-wise with no clock', d.mode === 'slides' && dAll.step === d.step])
await go(4, '&nav=steps')
d = await deck()
out.push(['?nav=steps opens step-wise', d.mode === 'steps'])

for (const [k, v] of out) console.log(v ? 'ok  ' : 'FAIL', k)
console.log('page errors:', errors.length ? errors : 'none')
await b.close()
process.exit(out.every(([, v]) => v) && !errors.length ? 0 : 1)
