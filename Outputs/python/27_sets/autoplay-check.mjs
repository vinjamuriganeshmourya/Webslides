// The deck's Autoplay switch (2026-10-07), on the BUILT file: its default on
// every slide, that it plays by itself where on, holds still where off, pauses
// on a manual press and resumes from the step on screen. Run: node autoplay-check.mjs
import { chromium } from 'playwright-core'
import { readdirSync } from 'node:fs'
const html = `${process.cwd()}/dist-single/${readdirSync('dist-single').find((f) => f !== 'index.html' && f.endsWith('.html'))}`
const ON = new Set([]) /* 2026-10-09, the view fixes change spec: off on every slide (was 3, 4, 8, 10, 11, 20, 23, 26) */
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.addInitScript(() => { window.__steps = 0; window.addEventListener('deck:navigate', (e) => e.detail.kind === 'step' && window.__steps++) })
let fails = 0
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? '   ok' : '   FAIL'} ${m}`) }
const sw = () => p.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') ?? '').startsWith('Autoplay') || x.textContent.includes('Autoplay'))?.getAttribute('aria-pressed') ?? 'none')
const defaults = []
for (let i = 1; i <= 31; i++) {
  await p.goto(`file://${html}?v=${i}#/${i}`, { waitUntil: 'load' }); await p.waitForTimeout(300)
  const s = await sw()
  defaults.push(`${i}:${s === 'true' ? 'on' : s === 'false' ? 'off' : '-'}`)
  if (s !== 'none') ok((s === 'true') === ON.has(i), `slide ${i}: Autoplay ${s === 'true' ? 'On' : 'Off'} by default`)
  else ok(!ON.has(i), `slide ${i}: no built steps, no switch`)
}
console.log('  ', defaults.join(' '))
/* 2026-10-09, the view fixes change spec: OFF ON EVERY SLIDE. Nothing plays by itself; the switch still works when pressed. */
for (const n of [3, 8, 12, 28]) {
  await p.goto(`file://${html}?v=x${n}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(8000)
  const k = await p.evaluate(() => window.__steps)
  ok(k === 0, `slide ${n}: ${k} step(s) by itself in 8s (autoplay off)`)
}
const clickSwitch = () => p.evaluate(() => [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') ?? '').startsWith('Autoplay') || x.textContent.includes('Autoplay')).click())
await p.goto(`file://${html}?v=m#/15`, { waitUntil: 'load' }); await p.waitForTimeout(400) /* E1: 15 presses, so a resume still has steps left */
await clickSwitch(); await p.waitForTimeout(7000)
const played = await p.evaluate(() => window.__steps)
ok((await sw()) === 'true' && played >= 1, `slide 15 pressed on: ${played} step(s) by itself in 7s`)
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
ok((await sw()) === 'false', 'a manual press pauses it: switch reads Off')
const before = await p.evaluate(() => window.__steps); await p.waitForTimeout(7000)
ok((await p.evaluate(() => window.__steps)) === before, 'paused: no step in 7s')
await clickSwitch(); await p.waitForTimeout(6000)
ok((await sw()) === 'true' && (await p.evaluate(() => window.__steps)) > before, 'switched back on: resumes from the step on screen')
await p.goto(`file://${html}?all#/3`, { waitUntil: 'load' }); await p.waitForTimeout(6000)
ok((await p.evaluate(() => window.__steps)) === 0, '?all (the harnesses): never plays')
console.log(fails ? `\nautoplay: ${fails} failure(s)` : '\nautoplay: all checks passed')
await b.close()
