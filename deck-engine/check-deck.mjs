#!/usr/bin/env node
/*
 * check-deck: run the course rules against ONE built deck HTML.
 *
 *   node check-deck.mjs <path/to/deck.html> [--quick] [--verbose] [--slides=1-20]
 *
 * Opens the file over file:// with `?still&nav=steps` (every animation at its final state), walks slide N
 * with the hash `#/N`, and runs the page functions in checks/*.mjs on the live slide. Prints one line per
 * check (PASS / WARN / FAIL), a summary, and exits 1 on any FAIL. WARN never fails the run.
 *
 *   R9    title slide          slide 2 is the session title frame, right after the Welcome brand slide
 *   R8.4  capitals             every visible text block starts with a capital (FAIL) / chips+titles Title Case (WARN)
 *   R8.3  table highlight      orange rows are listed; a highlighted LAST row FAILs
 *   R7    line limit           points beside a figure take <= 2 lines
 *   R8.5  logo aspect          <img> rendered ratio within 3% of natural
 *   video-safe                 nothing in the instructor video box (port of video-safe.mjs)
 *   mixed-align                no left + centred blocks on one slide (port of mixed-align-check.mjs)
 *   overflow                   no text outside its box, final state (port of box-overflow-check.mjs)
 *   chip inside its card       no chip or tag runs past the card it sits in (Session 6, 2026-11-06)
 * Full run only (slow, presses every build step, ~1s each):
 *   overflow-steps             the overflow check at every build step
 *   controls-clear             nothing touches the slide's buttons or the player bar, at every step
 */
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { capitals, titleCase, chipInParent } from './checks/text.mjs'
import { tables } from './checks/tables.mjs'
import { points } from './checks/points.mjs'
import { logos } from './checks/logos.mjs'
import { videoSafe } from './checks/video-safe.mjs'
import { overflow } from './checks/overflow.mjs'
import { mixedAlign } from './checks/mixed-align.mjs'
import { controls } from './checks/controls.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const { chromium } = createRequire(resolve(here, 'package.json'))('playwright-core')

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
const QUICK = args.includes('--quick')
const VERBOSE = args.includes('--verbose')
const range = (args.find((a) => a.startsWith('--slides=')) || '').slice(9)
if (!file || !existsSync(file)) { console.error('usage: node check-deck.mjs <deck.html> [--quick] [--verbose] [--slides=a-b]'); process.exit(2) }
const URL0 = pathToFileURL(resolve(file)).href
const t0 = Date.now()

const res = {} // check -> { fail: [{n,msg}], warn: [...], info: [...], note }
const R = (k) => (res[k] ??= { fail: [], warn: [], info: [] })
for (const k of ['R9 title slide','R8.4 capitals','R8.4 title-case (chips/labels/titles)','R8.3 table highlight','R7 line limit (<=2 lines)','R8.5 logo aspect','video-safe','mixed-align','overflow (final state)','chip inside its card']) R(k)
const add = (k, lvl, n, msg) => R(k)[lvl].push({ n, msg })

const browser = await chromium.launch({ executablePath: '/usr/bin/brave-browser' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 80)))
const open = (n, flags = '?still&nav=steps') => page.goto(`${URL0}${flags}#/${n}`, { waitUntil: 'load' })
await open(1)
await page.waitForFunction(() => window.__DECK__ && window.__DECK__.total > 0, null, { timeout: 20000 }).catch(() => {})
const deck = await page.evaluate(() => window.__DECK__ ? { total: window.__DECK__.total, all: window.__DECK__.all || window.__DECK__.slides || [] } : null)
if (!deck) { console.error('FAIL: window.__DECK__ missing, is this a built deck?'); await browser.close(); process.exit(2) }
let from = 1, to = deck.total
if (range) { const [a, b] = range.split('-').map(Number); from = a; to = b || a }

const go = async (n) => {
  await page.evaluate((x) => { location.hash = `#/${x}` }, n)
  await page.waitForFunction((x) => window.__DECK__ && window.__DECK__.current === x, n, { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(450)
}
const texts = {}

for (let n = from; n <= to; n++) {
  await go(n)
  if (n <= 2) texts[n] = await page.evaluate(() => [...document.querySelectorAll('section')].pop()?.innerText ?? '')
  const cap = await page.evaluate(capitals)
  for (const s of cap.fails) add('R8.4 capitals', 'fail', n, `"${s}"`)
  for (const s of cap.warns) add('R8.4 capitals', 'warn', n, `single word "${s}"`)
  const tc = await page.evaluate(titleCase)
  R('R8.4 title-case (chips/labels/titles)').checked = (R('R8.4 title-case (chips/labels/titles)').checked ?? 0) + tc.chips
  for (const s of tc.warns) add('R8.4 title-case (chips/labels/titles)', 'warn', n, s)
  const cp = await page.evaluate(chipInParent)
  R('chip inside its card').checked = (R('chip inside its card').checked ?? 0) + cp.checked
  for (const s of cp.fails) add('chip inside its card', 'fail', n, s)
  const tb = await page.evaluate(tables)
  tb.tables.forEach((t, i) => {
    R('R8.3 table highlight').checked = (R('R8.3 table highlight').checked ?? 0) + 1
    if (t.last) add('R8.3 table highlight', 'fail', n, `table ${i + 1}: LAST row (${t.rows}/${t.rows}) is orange`)
    else if (t.highlighted.length) add('R8.3 table highlight', 'info', n, `table ${i + 1}: row ${t.highlighted.join(',')} of ${t.rows} highlighted (confirm it carries meaning)`)
  })
  const pt = await page.evaluate(points)
  R('R7 line limit (<=2 lines)').checked = (R('R7 line limit (<=2 lines)').checked ?? 0) + pt.n
  for (const s of pt.over) add('R7 line limit (<=2 lines)', 'fail', n, s)
  const lg = await page.evaluate(logos)
  R('R8.5 logo aspect').checked = (R('R8.5 logo aspect').checked ?? 0) + lg.n
  for (const s of lg.bad) add('R8.5 logo aspect', 'fail', n, s)
  for (const s of await page.evaluate(videoSafe)) add('video-safe', 'fail', n, s)
  const ma = await page.evaluate(mixedAlign)
  if (ma.mixed) add('mixed-align', 'fail', n, `left ${ma.left.join(' | ')} + centre ${ma.centre.join(' | ')}`)
  for (const s of await page.evaluate(overflow)) add('overflow (final state)', 'fail', n, s)
  process.stderr.write(`\r  slide ${n}/${to}   `)
}
process.stderr.write('\r' + ' '.repeat(30) + '\r')

/* R9 */
{
  const k = 'R9 title slide'; R(k)
  const t2 = texts[2] ?? '', t1 = texts[1] ?? ''
  const id2 = deck.all[1]?.id
  if (from > 2) R(k).skipped = true
  else if (/welcome to today/i.test(t2) || id2 === 'S-TITLE') {
    const title = t2.replace(/welcome to today.s session/i, '').split('\n').map((s) => s.trim()).filter((s) => s && !/^\d+$/.test(s) && !/^\/ ?\d+$/.test(s))[0]
    R(k).note = `slide 2 (${id2}) shows "${title ?? '?'}", slide 1 is ${/welcome/i.test(t1) ? '"Welcome"' : 'NOT a Welcome slide'}`
    if (!title) add(k, 'fail', 2, 'title frame has no session title text')
    if (!/welcome/i.test(t1)) add(k, 'warn', 1, 'slide 1 does not read Welcome')
  } else add(k, 'fail', 2, `slide 2 (${id2}) is not the session title frame; text: "${t2.replace(/\s+/g, ' ').slice(0, 50)}"`)
}

/* slow, per-step pass */
if (!QUICK) {
  for (let n = from; n <= to; n++) {
    await open(n); await page.reload({ waitUntil: 'load' }).catch(() => {})
    await page.waitForFunction((x) => window.__DECK__ && window.__DECK__.current === x, n, { timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(500)
    for (let s = 1; s <= (n === deck.total ? 3 : 25); s++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(650)
      const cur = await page.evaluate(() => window.__DECK__.current)
      if (cur !== n) break
      for (const m of await page.evaluate(overflow)) add('overflow-steps', 'fail', n, `step ${s}: ${m}`)
      for (const m of await page.evaluate(controls)) add('controls-clear', 'fail', n, `step ${s}: ${m}`)
    }
    process.stderr.write(`\r  steps, slide ${n}/${to}   `)
  }
  process.stderr.write('\r' + ' '.repeat(30) + '\r')
  R('overflow-steps'); R('controls-clear')
}
await browser.close()

/* report */
const group = (list) => {
  const by = new Map()
  for (const x of list) { if (!by.has(x.n)) by.set(x.n, []); by.get(x.n).push(x.msg) }
  return [...by].map(([n, m]) => ({ n, m }))
}
const show = (list, tag) => {
  const g = group(list), cap = VERBOSE ? 1e9 : 6
  for (const { n, m } of g.slice(0, cap)) console.log(`        ${tag} slide ${n}: ${m.slice(0, VERBOSE ? 99 : 3).join(' ; ')}${!VERBOSE && m.length > 3 ? ` (+${m.length - 3})` : ''}`)
  if (g.length > cap) console.log(`        ... +${g.length - cap} more slides (--verbose)`)
}
let fails = 0, warns = 0
const order = ['R9 title slide', 'R8.4 capitals', 'R8.4 title-case (chips/labels/titles)', 'R8.3 table highlight', 'R7 line limit (<=2 lines)', 'R8.5 logo aspect', 'video-safe', 'mixed-align', 'overflow (final state)', 'chip inside its card', 'overflow-steps', 'controls-clear']
console.log(`\ncheck-deck  ${file}\n${to - from + 1} slide(s)${QUICK ? ', quick' : ''}\n`)
for (const k of order) {
  const r = res[k]; if (!r) continue
  const nf = new Set(r.fail.map((x) => x.n)).size, nw = new Set(r.warn.map((x) => x.n)).size
  const status = r.fail.length ? 'FAIL' : r.warn.length ? 'WARN' : 'PASS'
  if (r.fail.length) fails++; else if (r.warn.length) warns++
  const parts = []
  if (r.fail.length) parts.push(`${r.fail.length} finding(s) on ${nf} slide(s)`)
  if (r.warn.length) parts.push(`${r.warn.length} warning(s) on ${nw} slide(s)`)
  if (r.info.length) parts.push(`${r.info.length} highlighted row group(s) to confirm`)
  if (r.checked != null) parts.push(`${r.checked} checked`)
  if (k.startsWith('R8.3') && !r.checked) parts.push('no tables in this deck')
  if (r.note) parts.push(r.note)
  console.log(`${status}  ${k}${parts.length ? '  ' + parts.join(', ') : ''}`)
  show(r.fail, 'x'); show(r.warn, '~'); show(r.info, 'i')
}
if (pageErrors.length) console.log(`\n(page errors seen: ${[...new Set(pageErrors)].slice(0, 3).join(' | ')})`)
console.log(`\nSummary: ${fails} FAIL, ${warns} WARN, in ${((Date.now() - t0) / 1000).toFixed(0)}s`)
process.exit(fails ? 1 : 0)
