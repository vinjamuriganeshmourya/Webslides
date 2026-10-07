/**
 * feedback-check.mjs: the four slides of the 2026-10-06 feedback, driven on the
 * BUILT file from file:// with the network blocked (decision 17 in CLAUDE.md).
 *
 *   CHROME_PATH=/usr/bin/brave-browser node feedback-check.mjs
 *
 * Slide 4 pays twice and the ledger reads ₹80; slide 5's 2:00 timer waits for
 * its press and the slide ends on the plan; slide 10 pays once and try 3 is
 * never asked; slide 27's 0:05 timer waits, a right pick fires confetti, a
 * wrong pick or no pick does not, twelve beats stay on the slide and the
 * twelfth press leaves it, and a swipe that starts on a vote button changes no
 * slide. Zero page errors. The player's arrows move whole slides by default,
 * so the file is loaded with `?nav=steps`.
 */
import { chromium } from 'playwright-core'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
const cfg = JSON.parse(fs.readFileSync('deck.config.json', 'utf8'))
const file = pathToFileURL(path.resolve(`dist-single/${cfg.htmlName}.html`)).href
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
await ctx.route(/^https?:\/\//, (r) => r.abort())        // no network: the file must stand alone
const p = await ctx.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(String(e)))
const out = []
const go = async (n) => { await p.goto(`${file}?nav=steps&t=${Date.now()}#/${n}`, { waitUntil: 'load' }); await p.waitForTimeout(1400) }
const step = async (ms = 1900) => { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(ms) }
const hash = async () => p.evaluate(() => location.hash)
const on = async (n) => (await hash()).startsWith(`#/${n}-`)
const pane = async () => p.evaluate(() => [...document.querySelectorAll('pre')].filter((e) => e.closest('.border-line')).map((e) => e.textContent).join('|'))

// slide 4: five beats, the output ends with two Payment successful lines, the ledger reads ₹80
await go(4)
for (let i = 0; i < 4; i++) await step()
let txt = await p.evaluate(() => document.body.innerText)
out.push(['slide 4 prints twice', ((await pane()).match(/Payment successful/g) || []).length === 2 && /₹80/.test(txt) && /paid again/.test(txt) && (await on(4))])

// slide 5: the 2:00 timer has not started on its own after 2.5 s; beat 4 shows the plan
await go(5)
await p.waitForTimeout(2500)
txt = await p.evaluate(() => document.body.innerText)
out.push(['slide 5 timer still 2:00 untouched', /2:00/.test(txt)])
for (let i = 0; i < 3; i++) await step()
txt = await p.evaluate(() => document.body.innerText)
out.push(['slide 5 ends on the plan', /leave straight away/.test(txt) && /One line that says leave now/.test(txt) && (await on(5))])

// slide 10: four beats, try 3 never asked, one Payment successful
await go(10)
for (let i = 0; i < 3; i++) await step()
txt = await p.evaluate(() => document.body.innerText)
out.push(['slide 10 pays once, try 3 never asked', ((await pane()).match(/Payment successful/g) || []).length === 1 && /never asked/.test(txt) && (await on(10))])

// slide 27: the vote buttons are clickable, a right pick fires confetti, a wrong pick does not, Next is not gated, the 0:05 timer waits
await go(27)
await p.waitForTimeout(2500)
txt = await p.evaluate(() => document.body.innerText)
out.push(['slide 27 timer still 0:05 untouched', /0:05/.test(txt)])
await p.getByRole('button', { name: 'Crashes', exact: true }).click()
await step(2200)
let confetti = await p.evaluate(() => document.querySelectorAll('.sm-confetti').length)
out.push(['round 1 right pick fires confetti', confetti > 0 && (await on(27))])
await step()                                   // round 2 vote, no pick
await step(2200)                               // round 2 run without a pick: Next not gated
confetti = await p.evaluate(() => document.querySelectorAll('.sm-confetti').length)
txt = await p.evaluate(() => document.body.innerText)
out.push(['round 2 runs without a pick, no confetti', confetti === 0 && /pass fills the block/.test(txt)])
await step()                                   // round 3 vote
await p.getByRole('button', { name: 'Runs', exact: true }).click()
await step(2200)                               // wrong pick
confetti = await p.evaluate(() => document.querySelectorAll('.sm-confetti').length)
txt = await p.evaluate(() => document.body.innerText)
out.push(['round 3 wrong pick: no confetti, error shown', confetti === 0 && /statement on line 2/.test(txt)])
for (let i = 0; i < 6; i++) await step(900)
out.push(['12 beats stay on slide 27', await on(27)])
await step(900)
out.push(['the 12th press reaches slide 28', await on(28)])

// a swipe starting on a vote button does not change slide
await go(27)
const btn = await p.getByRole('button', { name: 'Runs', exact: true }).boundingBox()
const cdp = await ctx.newCDPSession(p)
const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] })
await touch('touchStart', btn.x + 20, btn.y + 20)
for (let i = 1; i <= 6; i++) { await touch('touchMove', btn.x + 20 - i * 30, btn.y + 20); await p.waitForTimeout(30) }
await touch('touchEnd', 0, 0)
await p.waitForTimeout(600)
out.push(['swipe starting on a vote button changes no slide', await on(27)])

for (const [k, v] of out) console.log(v ? 'ok  ' : 'FAIL', k)
console.log('page errors:', errors.length ? errors : 'none')
await b.close()
process.exit(out.every(([, v]) => v) && !errors.length ? 0 : 1)
