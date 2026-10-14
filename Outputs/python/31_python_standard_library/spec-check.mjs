// scratch: the spec's build contract on the built file
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
const html = `${process.cwd()}/dist-single/python-session-31-python-standard-library.html`
/* the press counts come from the generated spec.ts; three cards grow on this deck (plan decision 8): C10 is eight
   (press 4's three runs and press 5's vote and its True are one press each), C11 is five (the same way), K1 is seven
   (session 28's view fixes, kept: the seventh press fills the last result) */
const OVERRIDE = { C10: 8, C11: 5, K1: 7 }
const specTs = readFileSync('src/decks/figures/spec.ts', 'utf8')
const SPEC = JSON.parse(specTs.slice(specTs.indexOf('= {') + 2, specTs.indexOf('\nexport const NOTES')))
const want = Object.fromEntries(Object.values(SPEC).map((c) => [c.id, OVERRIDE[c.id] ?? c.press_count]))
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const reqs = [], errs = []
p.on('request', (r) => !r.url().startsWith('file:') && !r.url().startsWith('data:') && reqs.push(r.url()))
p.on('pageerror', (e) => errs.push(String(e)))
let fails = 0
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? '   ok' : '   FAIL'} ${m}`) }
// 1. first open: arrows are one press
await p.goto(`file://${html}?noauto#/3`, { waitUntil: 'load' }); await p.waitForTimeout(1500) /* noauto: slide 3 opens with Autoplay on (2026-10-13) */
ok(p.url().includes('nav=steps'), `first open asks for steps mode (${p.url().split('?')[1] ?? 'no query'})`)
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1200)
ok(p.url().includes('#/3'), `right arrow is one press on a built card (still on 3: ${p.url().split('#')[1]})`)
/* press 1 is the question; press 2 files chip 1 and shows its why line */
const why = await p.evaluate(() => (document.querySelector('[data-spec="S-RECAP"]')?.textContent ?? '').includes('One sheet, two names'))
ok(why, 'that press filed chip 1 and showed its why line (press 2)')
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(700)
ok(p.url().includes('#/3'), 'left arrow is one press back')
await p.waitForTimeout(2500)
ok(!p.url().includes('nav='), 'the address goes back to what was opened')
// 2. End shows the whole card
await p.goto(`file://${html}?nav=steps#/16`, { waitUntil: 'load' }); await p.waitForTimeout(1500)
await p.keyboard.press('End'); await p.waitForTimeout(900)
const nextOff = await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => x.textContent?.trim() === 'Next')?.disabled)
ok(nextOff === true && p.url().includes('#/16'), 'End lands on the last press of G1 (slide 16) (Next greyed, still on 16)')
// 3. keys 1 to 4 mark the vote
await p.goto(`file://${html}?nav=steps#/16`, { waitUntil: 'load' }); await p.waitForTimeout(1500) /* press 1 is round 1's ask */
await p.keyboard.press('2'); await p.waitForTimeout(400)
const pressed = await p.evaluate(() => [...document.querySelectorAll('[data-spec] button[aria-pressed="true"]')].map((x) => x.innerText.trim().slice(0, 1)))
ok(pressed.join() === 'B', `key 2 marks option B on G1 (${pressed})`)
// 4. A shows all the cards
await p.keyboard.press('a'); await p.waitForTimeout(700)
const picker = await p.evaluate(() => document.body.innerText.includes('Fix the import') && document.querySelectorAll('[role="dialog"], [aria-modal="true"]').length)
ok(!!picker, 'A opens the slide picker')
await p.keyboard.press('Escape')
// 5. data-spec and data-presses on every content card
const seen = {}
for (let i = 1; i <= 33; i++) {
  await p.goto(`file://${html}?all&v=${i}#/${i}`, { waitUntil: 'load' }); await p.waitForTimeout(250)
  const d = await p.evaluate(() => [...document.querySelectorAll('[data-spec]')].map((e) => [e.getAttribute('data-spec'), Number(e.getAttribute('data-presses'))]))
  for (const [id, n] of d) seen[id] = n
}
/* S-AGENDA is static on the user's word (content rule 44): no presses, no marker */
const missing = Object.entries(want).filter(([id, n]) => id !== 'S-AGENDA' && n > 0 && seen[id] !== n)
ok(missing.length === 0, `every card with presses carries data-spec and its count (${Object.keys(seen).length} cards)${missing.length ? ' MISSING ' + JSON.stringify(missing.map(([id, n]) => [id, n, seen[id]])) : ''}`)
const off = [...new Set(reqs.map((u) => new URL(u).host))]
console.log('   network hosts:', off.join(', ') || 'none', '| page errors:', errs.length)
console.log(fails ? `\nspec-check: ${fails} failure(s)` : '\nspec-check: all checks passed')
await b.close()
