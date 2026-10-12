// The deck's Autoplay (2026-10-07) and the slide menu's Auto-play setting (2026-10-12), on the BUILT file:
// the per-slide default, that listed slides play by themselves and the rest hold still, the per-slide
// switch (plays, pauses on a manual press, resumes), and the menu's option (immediate, kept across a
// reload, Off holds every slide, On plays again). Run: node autoplay-check.mjs
import { chromium } from 'playwright-core'
import { readdirSync } from 'node:fs'
const html = `${process.cwd()}/dist-single/${readdirSync('dist-single').find((f) => f !== 'index.html' && f.endsWith('.html'))}`
const ON = new Set([3, 4, 7, 8, 9, 10, 11, 12, 19, 20, 27, 28, 30, 31, 34]) /* PF 29: the pedagogy team's list of 2026-10-12 */
const TOTAL = 34 /* the feedback iframe never goes network-idle; 35 and 36 have no steps */
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.addInitScript(() => { window.__steps = 0; window.addEventListener('deck:navigate', (e) => e.detail.kind === 'step' && window.__steps++) })
let fails = 0
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? '   ok' : '   FAIL'} ${m}`) }
const sw = () => p.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') ?? '').startsWith('Autoplay') || x.textContent.includes('Autoplay'))?.getAttribute('aria-pressed') ?? 'none')
const steps = () => p.evaluate(() => window.__steps)
const defaults = []
for (let i = 1; i <= TOTAL; i++) {
  await p.goto(`file://${html}?v=${i}#/${i}`, { waitUntil: 'load' }); await p.waitForTimeout(300)
  const s = await sw()
  defaults.push(`${i}:${s === 'true' ? 'on' : s === 'false' ? 'off' : '-'}`)
  if (s !== 'none') ok((s === 'true') === ON.has(i), `slide ${i}: Autoplay ${s === 'true' ? 'On' : 'Off'} by default`)
  else ok(!ON.has(i), `slide ${i}: no built steps, no switch`)
}
console.log('  ', defaults.join(' '))
/* a listed slide plays by itself; an unlisted one holds still */
for (const n of [3, 14, 22]) {
  await p.goto(`file://${html}?v=x${n}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(8000)
  const k = await steps()
  ok(ON.has(n) ? k >= 1 : k === 0, `slide ${n}: ${k} step(s) by itself in 8s (${ON.has(n) ? 'listed' : 'not listed'})`)
}
/* the per-slide switch, on a slide that opens off (T1, 6 presses, so a resume still has steps left) */
const clickSwitch = () => p.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') ?? '').startsWith('Autoplay') || x.textContent.includes('Autoplay')).click())
await p.goto(`file://${html}?v=m#/21`, { waitUntil: 'load' }); await p.waitForTimeout(400)
await clickSwitch(); await p.waitForTimeout(7000)
const played = await steps()
ok((await sw()) === 'true' && played >= 1, `slide 21 pressed on: ${played} step(s) by itself in 7s`)
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
ok((await sw()) === 'false', 'a manual press pauses it: switch reads Off')
const before = await steps(); await p.waitForTimeout(7000)
ok((await steps()) === before, 'paused: no step in 7s')
await clickSwitch(); await p.waitForTimeout(6000)
ok((await sw()) === 'true' && (await steps()) > before, 'switched back on: resumes from the step on screen')
/* the slide menu's Auto-play option */
const menuCard = (which) => p.evaluate((w) => {
  const c = [...document.querySelectorAll('[role="dialog"][aria-label="Jump to a slide"] [role="group"][aria-label="Auto-play"] button')].find((x) => x.textContent.trim().startsWith(w))
  if (!c) return 'none'
  return c.getAttribute('aria-pressed')
}, which)
const clickCard = (which) => p.evaluate((w) => [...document.querySelectorAll('[role="dialog"][aria-label="Jump to a slide"] [role="group"][aria-label="Auto-play"] button')].find((x) => x.textContent.trim().startsWith(w)).click(), which)
await p.goto(`file://${html}?v=menu#/3`, { waitUntil: 'load' }); await p.waitForTimeout(400)
ok((await sw()) === 'true', 'slide 3 opens with Autoplay On (the menu setting is On when the deck first loads)')
await p.keyboard.press('g'); await p.waitForTimeout(500)
ok((await menuCard('ON')) === 'true' && (await menuCard('OFF')) === 'false', 'the menu shows Auto-play: the ON card pressed')
await clickCard('OFF'); await p.waitForTimeout(300)
ok((await menuCard('OFF')) === 'true' && (await sw()) === 'false', 'Off in the menu: the slide switch reads Off at once')
await p.keyboard.press('Escape'); await p.waitForTimeout(300)
const k0 = await steps(); await p.waitForTimeout(7000)
ok((await steps()) === k0, 'Off: no step by itself in 7s on a listed slide')
await p.goto(`file://${html}?v=menu2#/4`, { waitUntil: 'load' }); await p.waitForTimeout(400)
ok((await sw()) === 'false', 'after a reload, slide 4 opens Off: the choice is kept')
await p.keyboard.press('g'); await p.waitForTimeout(500)
ok((await menuCard('OFF')) === 'true', 'the menu still shows OFF pressed')
await clickCard('ON'); await p.waitForTimeout(300)
ok((await sw()) === 'true', 'On in the menu: the slide switch reads On at once')
await p.keyboard.press('Escape'); await p.waitForTimeout(7000)
ok((await steps()) >= 1, `On again: ${await steps()} step(s) by itself in 7s`)
await p.goto(`file://${html}?v=menu3#/14`, { waitUntil: 'load' }); await p.waitForTimeout(8000)
ok((await steps()) === 0 && (await sw()) === 'false', 'slide 14 (not listed) still holds still with the setting On')
await p.goto(`file://${html}?all#/3`, { waitUntil: 'load' }); await p.waitForTimeout(6000)
ok((await steps()) === 0, '?all (the harnesses): never plays')
console.log(fails ? `\nautoplay: ${fails} failure(s)` : '\nautoplay: all checks passed')
await b.close()
