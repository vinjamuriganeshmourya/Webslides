#!/usr/bin/env node
/*
 * firefox-check: does this built deck open and play in Firefox?   (user, 2026-11-13: the decks "need to work on
 * low end pc and browsers")
 *
 *   node firefox-check.mjs <path/to/deck.html> [--slides=a-b] [--shots=<dir>] [--no-webgl]
 *
 * Every other check in this engine runs in a Chromium browser, and Brave, Chrome and Edge are one engine. Firefox
 * is the other one a classroom PC has, with its own WebGL, its own SVG rasteriser (every Character Lab frame goes
 * through it) and its own font and image loaders. This opens the deck in the Firefox installed on this machine the
 * way a presenter does, presses the right arrow through every slide, and says what did not work:
 *
 *   opens     the deck mounts, and its embedded fonts are the ones text is set in
 *   arrival   every press reaches the next slide
 *   errors    nothing uncaught, no rejected promise, no console.error (FAIL); console.warn is reported (WARN)
 *   images    no image on a slide is empty
 *   3D        every 3D canvas has a picture within ten seconds of its slide arriving
 *
 * It drives Firefox through geckodriver, speaking WebDriver over HTTP with fetch: no dependency (Playwright's own
 * Firefox build does not start on every machine, and it is not the Firefox people have). It does not time
 * anything: Firefox has no CPU throttle to ask for, and `perf-check.mjs` is the speed check.
 *
 * `--no-webgl` turns WebGL off in that Firefox: what a PC whose graphics driver the browser refuses gets. Every 3D
 * line must then FAIL, which is also how this check is known to be able to.
 *
 * SKIP, exit 0, when there is nothing to judge: no geckodriver or no Firefox on this machine, or a Firefox that
 * cannot read the file (the snap reads only the home folder). One line per finding, exit 1 on a FAIL.
 */
import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:net'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, resolve } from 'node:path'
import { inflateSync } from 'node:zlib'

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
const opt = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`))
  return a ? a.slice(k.length + 3) : d
}
if (!file || !existsSync(file)) {
  console.error('usage: node firefox-check.mjs <deck.html> [--slides=a-b] [--shots=<dir>] [--no-webgl]')
  process.exit(2)
}
const SHOTS = opt('shots', '')
if (SHOTS) mkdirSync(resolve(SHOTS), { recursive: true })
const t0 = Date.now()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const findings = [] // { level: 'FAIL' | 'WARN', what }
const say = (level, what) => findings.push({ level, what })
const skip = (why) => {
  console.log(`SKIP  Firefox not checked: ${why}`)
  process.exit(0)
}

if (spawnSync('geckodriver', ['--version'], { encoding: 'utf8' }).error) skip('geckodriver is not installed on this machine (it comes with the Firefox snap, or `apt install firefox-geckodriver`)')

/* ── a PNG's distinct colours: is there a picture in this rectangle, or one flat card ── */
function colours(png) {
  let p = 8
  let w = 0
  let h = 0
  let type = 6
  const data = []
  while (p < png.length) {
    const len = png.readUInt32BE(p)
    const name = png.toString('latin1', p + 4, p + 8)
    if (name === 'IHDR') {
      w = png.readUInt32BE(p + 8)
      h = png.readUInt32BE(p + 12)
      type = png[p + 17]
    } else if (name === 'IDAT') data.push(png.subarray(p + 8, p + 8 + len))
    p += 12 + len
  }
  const bpp = type === 6 ? 4 : type === 2 ? 3 : 0
  if (!bpp || !w || !h) return -1
  const raw = inflateSync(Buffer.concat(data))
  const line = w * bpp
  const px = Buffer.alloc(line * h)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (line + 1)]
    const src = y * (line + 1) + 1
    const dst = y * line
    for (let x = 0; x < line; x++) {
      const a = x >= bpp ? px[dst + x - bpp] : 0
      const b = y ? px[dst - line + x] : 0
      const c = x >= bpp && y ? px[dst - line + x - bpp] : 0
      let v = raw[src + x]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) {
        const q = a + b - c
        const pa = Math.abs(q - a)
        const pb = Math.abs(q - b)
        const pc = Math.abs(q - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      px[dst + x] = v & 255
    }
  }
  const seen = new Set()
  let edges = 0
  let n = 0
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * line + x * bpp
      seen.add((px[i] << 16) | (px[i + 1] << 8) | px[i + 2])
      if (x >= 3) {
        const j = i - 3 * bpp
        if (Math.abs(px[i] - px[j]) + Math.abs(px[i + 1] - px[j + 1]) + Math.abs(px[i + 2] - px[j + 2]) > EDGE) edges++
        n++
      }
    }
  return { colours: seen.size, edges: n ? edges / n : 0, w, h }
}
/*
  IS THERE A PICTURE IN THIS RECTANGLE. An empty canvas shows the card behind it. A drawn scene has EDGES (a pixel
  unlike the one three to its left) and, when it is large, thousands of colours. Measured in Firefox 158 on Session
  9, the same canvases with WebGL on and with it off (`FIREFOX_CHECK_DEBUG=1` prints these for any deck):

      a 470 x 390 scene       4,574 to 12,079 colours, edges 5.6 to 7.2%      empty: 256 to 296 colours, edges 0.44%
      a 132 x 108 3D icon       495 to  1,277 colours, edges 5.8 to 10.7%     empty:  13 to  23 colours, edges 0%

  Colour count alone does not separate them: a small icon with a picture has barely more colours than a large card
  with none (the first version of this test counted colours only, and failed slide 41's four icons, all drawn).
  So: edges over 2%, or, for a soft scene with few hard edges, over 1,500 colours.
*/
const EDGE = 48
const hasPicture = (m) => m.edges >= 0.02 || m.colours >= 1500

/* ── geckodriver, on a port nothing else has ── */
const port = await new Promise((res) => {
  const s = createServer()
  s.listen(0, '127.0.0.1', () => {
    const p = s.address().port
    s.close(() => res(p))
  })
})
const gd = spawn('geckodriver', ['--port', String(port), '--log', 'fatal'], { stdio: 'ignore' })
const base = `http://127.0.0.1:${port}`
let sid = null
const call = async (method, path, body) => {
  const r = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
  const j = await r.json()
  if (j.value && j.value.error) throw new Error(`${j.value.error}: ${String(j.value.message).slice(0, 240)}`)
  return j.value
}
const quit = async (code) => {
  try {
    if (sid) await call('DELETE', `/session/${sid}`)
  } catch {}
  gd.kill()
  process.exit(code)
}
process.on('SIGINT', () => void quit(130))
process.on('SIGTERM', () => void quit(143))

try {
  let up = false
  for (let i = 0; i < 100 && !up; i++) {
    try {
      await fetch(base + '/status')
      up = true
    } catch {
      await sleep(100)
    }
  }
  if (!up) skip('geckodriver did not start')
  let session
  try {
    /* reduced motion OFF whatever the desktop says: the deck is checked playing, as a room sees it */
    session = await call('POST', '/session', { capabilities: { alwaysMatch: { browserName: 'firefox', 'moz:firefoxOptions': { args: ['-headless'], prefs: { 'layout.css.devPixelsPerPx': '1.0', 'ui.prefersReducedMotion': 0, ...(args.includes('--no-webgl') ? { 'webgl.disabled': true } : {}) } } } } })
  } catch (e) {
    gd.kill()
    skip(`Firefox did not start (${String(e.message).slice(0, 120)})`)
  }
  sid = session.sessionId
  const W = (m, p, b) => call(m, `/session/${sid}${p}`, b)
  const js = (script, ...a) => W('POST', '/execute/sync', { script, args: a })
  const until = async (script, a, ms) => {
    const t = Date.now()
    while (Date.now() - t < ms) {
      if (await js(script, ...a)) return true
      await sleep(60)
    }
    return false
  }
  /* 1280 x 720 of page, not of window */
  await W('POST', '/window/rect', { width: 1280, height: 720 })
  const [iw, ih] = await js('return [innerWidth, innerHeight]')
  await W('POST', '/window/rect', { width: 1280 + (1280 - iw), height: 720 + (720 - ih) })

  await W('POST', '/url', { url: pathToFileURL(resolve(file)).href + '#/1' })
  if (!(await until('return !!(window.__DECK__ && window.__DECK__.total > 0)', [], 20000))) {
    const where = await js('return document.documentURI + " | " + document.title')
    if (/^about:(neterror|blank)|File not found|Access to the file was denied/i.test(where)) {
      await call('DELETE', `/session/${sid}`).catch(() => {})
      gd.kill()
      skip(`this Firefox cannot read ${resolve(file)} (a snap Firefox reads only the home folder)`)
    }
    say('FAIL', 'opens: the deck did not mount in Firefox within 20 s')
    throw new Error('not mounted')
  }
  await js(`
    const F = (window.__fx = { errs: [], warns: [] })
    addEventListener('error', (e) => F.errs.push(String(e.message || e.error).slice(0, 200)))
    addEventListener('unhandledrejection', (e) => F.errs.push('rejected promise: ' + String(e.reason).slice(0, 200)))
    const ce = console.error; console.error = (...a) => { F.errs.push('console.error: ' + a.map(String).join(' ').slice(0, 200)); ce.apply(console, a) }
    const cw = console.warn; console.warn = (...a) => { F.warns.push(a.map(String).join(' ').slice(0, 200)); cw.apply(console, a) }
  `)
  const total = await js('return window.__DECK__.total')
  const version = `${session.capabilities.browserName} ${session.capabilities.browserVersion}`
  const webgl = await js(`const c = document.createElement('canvas'); const g = c.getContext('webgl2') || c.getContext('webgl'); return g ? 'yes' : 'none'`)

  /* the embedded fonts: every family the deck's own @font-face rules declare is loaded, or loads when asked for */
  const fonts = await js(`
    return document.fonts.ready.then(async () => {
      const fams = [...new Set([...document.fonts].map((f) => f.family.replace(/["']/g, '')))]
      const bad = []
      for (const f of fams) { try { await document.fonts.load('16px "' + f + '"'); if (!document.fonts.check('16px "' + f + '"')) bad.push(f) } catch { bad.push(f) } }
      return { fams, bad, failed: [...document.fonts].filter((f) => f.status === 'error').length }
    })`)
  if (fonts.bad.length || fonts.failed) say('FAIL', `opens: Firefox did not load ${fonts.failed} embedded font file(s)${fonts.bad.length ? ` (${fonts.bad.join(', ')})` : ''}: text is set in a fallback font`)

  let from = 2
  let to = total
  if (opt('slides', '')) {
    const [a, b] = opt('slides', '').split('-').map(Number)
    from = Math.max(2, a)
    to = Math.min(total, b || a)
    await js('location.hash = "#/" + arguments[0]', from - 1)
    await until('return window.__DECK__.current === arguments[0]', [from - 1], 10000)
  }
  await sleep(1200)
  const press = () => W('POST', '/actions', { actions: [{ type: 'key', id: 'kb', actions: [{ type: 'keyDown', value: '' }, { type: 'keyUp', value: '' }] }] })
  const name = async () => js('const d = window.__DECK__; return d.current + " (" + (d.slides[d.current - 1]?.id ?? "?") + ")"')
  let scenes = 0
  let slow = 0
  for (let n = from; n <= to; n++) {
    await press()
    if (!(await until('return window.__DECK__.current === arguments[0]', [n], 15000))) {
      say('FAIL', `arrival: the right arrow did not reach slide ${n} within 15 s (the deck is on ${await name()})`)
      await js('location.hash = "#/" + arguments[0]', n)
      if (!(await until('return window.__DECK__.current === arguments[0]', [n], 10000))) throw new Error(`slide ${n} cannot be reached`)
    }
    /* the leaving slide has gone, this one's pictures have had time to decode */
    await sleep(900)
    const at = await name()
    const empty = await js(`return [...document.querySelectorAll('.slide-stage img')].filter((i) => !i.closest('.deck-thumb') && i.complete && i.naturalWidth === 0 && (i.getAttribute('src') || '') !== '').length`)
    if (empty) say('FAIL', `images: slide ${at} has ${empty} image(s) Firefox could not show`)
    const SEL = '.slide-stage canvas'
    const count = await js(`return [...document.querySelectorAll('${SEL}')].filter((c) => !c.closest('.deck-thumb')).length`)
    if (count) {
      const t1 = Date.now()
      let blank = count
      let unseen = 0
      let last = count
      let shot = null
      while (blank + unseen && Date.now() - t1 < 10000) {
        const els = (await W('POST', '/elements', { using: 'css selector', value: SEL })).map((e) => Object.values(e)[0])
        /* a canvas the slide has not brought in yet (a later build step, a card still at opacity 0) is not an empty one */
        const shown = await js(`
          return [...document.querySelectorAll('${SEL}')].map((c) => {
            let o = 1
            for (let e = c; e && !e.classList.contains('slide-stage'); e = e.parentElement) {
              const cs = getComputedStyle(e)
              if (cs.visibility === 'hidden' || cs.display === 'none') o = 0
              o *= parseFloat(cs.opacity)
            }
            const r = c.getBoundingClientRect()
            return o > 0.5 && r.width > 4 && r.height > 4
          })`)
        blank = 0
        unseen = 0
        last = els.length
        for (let i = 0; i < els.length; i++) {
          if (!shown[i]) {
            unseen++
            continue
          }
          const png = Buffer.from(await W('GET', `/element/${els[i]}/screenshot`), 'base64')
          const m = colours(png)
          if (process.env.FIREFOX_CHECK_DEBUG) console.log(`   debug slide ${n} canvas ${i}: ${m.w}x${m.h}, ${m.colours} colours, edges ${(m.edges * 100).toFixed(2)}%`)
          if (!hasPicture(m)) blank++
        }
        if (blank + unseen) await sleep(400)
      }
      scenes += last
      const took = Date.now() - t1 + 900
      if (blank) say('FAIL', `3D: slide ${at} has ${blank} of ${last} 3D canvas(es) with no picture ten seconds after it arrived`)
      else if (unseen) say('WARN', `3D: slide ${at} had not shown ${unseen} of its ${last} 3D canvas(es) ten seconds after it arrived (a late build step?): not judged`)
      else if (took > 5000) slow++
      if (SHOTS) {
        shot = Buffer.from(await W('GET', '/screenshot'), 'base64')
        writeFileSync(join(resolve(SHOTS), `firefox-${String(n).padStart(2, '0')}.png`), shot)
      }
    }
    process.stderr.write(`\r  firefox: slide ${n}/${to}  `)
  }
  process.stderr.write('\r' + ' '.repeat(40) + '\r')
  const seen = await js('return { errs: [...new Set(window.__fx.errs)], warns: [...new Set(window.__fx.warns)] }')
  for (const e of seen.errs.slice(0, 12)) say('FAIL', `errors: ${e}`)
  for (const w of seen.warns.slice(0, 12)) say('WARN', `errors: console.warn: ${w}`)
  if (webgl === 'none') say('WARN', '3D: this Firefox gave no WebGL context, so no 3D scene could be judged')

  const fails = findings.filter((f) => f.level === 'FAIL')
  const warns = findings.filter((f) => f.level === 'WARN')
  for (const f of [...fails, ...warns]) console.log(`${f.level}  ${f.what}`)
  if (!findings.length) console.log(`PASS  ${version}: the deck mounts, ${to - from + 1} presses reach ${to - from + 1} slides, ${fonts.fams.length} embedded font families load, ${scenes} 3D canvas(es) draw, nothing raised`)
  console.log(`\nSummary (${version}): ${fails.length} FAIL, ${warns.length} WARN, in ${((Date.now() - t0) / 1000).toFixed(0)}s${slow ? `; ${slow} 3D slide(s) took over 5 s to show a picture here` : ''}`)
  await quit(fails.length ? 1 : 0)
} catch (e) {
  for (const f of findings) console.log(`${f.level}  ${f.what}`)
  console.log(`FAIL  firefox-check stopped: ${String(e.message).slice(0, 300)}`)
  await quit(1)
}
