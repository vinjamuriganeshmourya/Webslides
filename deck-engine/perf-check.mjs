#!/usr/bin/env node
/*
 * perf-check: does this built deck run on a slow PC?   (user, 2026-11-13: "the html file needs to be highly
 * optimized ... runs fine on high-end PCs but lags and has rendering issues on low-end ones")
 *
 *   node perf-check.mjs <path/to/deck.html> [--quick] [--throttle=4] [--slides=a-b] [--source=<session folder>]
 *                                           [--json=<file>] [--software]
 *
 * Opens the deck the way a presenter does (no harness flags: auto animation on, every loop running), slows the
 * page's main thread `--throttle` times over the DevTools protocol (4 by default: this desktop becomes roughly a
 * classroom Celeron), and walks the deck with the right arrow. One line per finding, a table, and exit 1 on a FAIL.
 *
 *   file      size; the script is single-byte (one character over U+00FF doubles its memory); files embedded twice;
 *             no font left to be fetched from the network
 *   load      first paint and deck mounted, throttled
 *   arrival   per slide, the 2.5 s after the press: frames drawn, the worst single frame, main-thread seconds
 *   idle      per slide once it has settled, at x1: the share of one core a slide costs by just sitting there, and
 *             the loops on it that cannot run on the compositor (see "LOOPS" in CLAUDE.md)
 *   source    with --source: the session's custom/ does not carry its own copy of the sprite builder
 *
 * BUDGETS. They are set where the engine's own decks sit comfortably and a deck that has gone wrong does not:
 *   arrival   worst frame over 250 ms WARN, over 500 ms FAIL; under 100 of 150 frames WARN, under 50 FAIL
 *   idle      over 6% of a core WARN, over 20% FAIL (a slide with a 3D scene: 25% and 45%)
 *   load      deck mounted after 2 s WARN, after 4 s FAIL (at the throttle)
 * 3D frame rates mean something only with a GPU behind the browser. Without one (`--software`, or a machine where
 * the Vulkan flags give SwiftShader) the 3D slides are reported and not judged: software GL draws two supersampled
 * scenes at three or four frames a second on any CPU, and nothing short of a smaller picture changes that.
 */
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const { chromium } = createRequire(resolve(here, 'package.json'))('playwright-core')

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
const opt = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`))
  return a ? a.slice(k.length + 3) : d
}
if (!file || !existsSync(file)) {
  console.error('usage: node perf-check.mjs <deck.html> [--quick] [--throttle=4] [--slides=a-b] [--source=<folder>] [--json=<file>] [--software]')
  process.exit(2)
}
const QUICK = args.includes('--quick')
const RATE = Number(opt('throttle', '4'))
const WIN = 2500
const B = { frameWarn: 250, frameFail: 500, framesWarn: 100, framesFail: 50, idleWarn: 0.06, idleFail: 0.2, idle3dWarn: 0.25, idle3dFail: 0.45, loadWarn: 2000, loadFail: 4000 }
const t0 = Date.now()
const findings = [] // { level: 'FAIL' | 'WARN' | 'INFO', what }
const say = (level, what) => findings.push({ level, what })

/* ── the file ── */
const text = readFileSync(file, 'utf8')
const script = /<script type="module"[^>]*>([\s\S]*?)<\/script>/.exec(text)?.[1] ?? ''
let wide = 0
for (let i = 0; i < script.length; i++) if (script.charCodeAt(i) > 255) wide++
if (wide) say('FAIL', `file: the script has ${wide} character(s) above U+00FF, so the browser keeps all ${(script.length / 1048576).toFixed(1)} MB of it two bytes a character (vite.singlefile.config.ts sets esbuild charset 'ascii')`)
const uris = text.match(/data:[a-z0-9/+.-]+;base64,[A-Za-z0-9+/=]{20000,}/gi) ?? []
const seen = new Map()
for (const u of uris) seen.set(u, (seen.get(u) ?? 0) + 1)
let twice = 0
for (const [u, n] of seen) if (n > 1 && !u.startsWith('data:font')) twice += u.length * (n - 1)
if (twice > 300000) say('WARN', `file: ${(twice / 1048576).toFixed(2)} MB is embedded files repeated (the same image under two names, or a path the build could not share)`)
/* a deck is opened by double-click in a room that may have no connection: nothing it shows may come from one */
const remoteFonts = (text.match(/url\(\s*["']?https?:\/\/fonts\./g) ?? []).length + (text.match(/<link[^>]+href="https?:\/\/fonts\.googleapis/g) ?? []).length
if (remoteFonts) say('FAIL', `file: ${remoteFonts} font file(s) are loaded from the network, not embedded: without a connection the deck is set in a fallback font (scripts/inline-fonts.mjs; build again)`)

/* ── the browser ── */
const software = args.includes('--software')
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser',
  headless: true,
  args: ['--force-device-scale-factor=1', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', ...(software ? ['--enable-unsafe-swiftshader'] : ['--use-angle=vulkan', '--enable-features=Vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'])],
})
const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 120)))
await page.addInitScript(() => {
  /* a frame counter that can be switched off: a rAF tick forces a main frame every vsync, which is itself a cost */
  const P = (window.__perf = { frames: [], long: [], paints: {}, mounted: 0, on: true })
  const tick = (t) => {
    if (P.on) P.frames.push(t)
    if (!P.mounted && window.__DECK__ && window.__DECK__.total > 0) P.mounted = performance.now()
    if (P.on) requestAnimationFrame(tick)
  }
  P.start = () => {
    if (P.on) return
    P.on = true
    requestAnimationFrame(tick)
  }
  P.stop = () => (P.on = false)
  requestAnimationFrame(tick)
  try {
    new PerformanceObserver((l) => l.getEntries().forEach((e) => P.long.push([e.startTime, e.duration]))).observe({ entryTypes: ['longtask'] })
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (P.paints[e.name] = e.startTime))).observe({ entryTypes: ['paint'] })
  } catch {
    /* an old browser: no long-task figures */
  }
})
await cdp.send('Performance.enable')
const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]))
const throttle = (rate) => cdp.send('Emulation.setCPUThrottlingRate', { rate })

/* ── load ── */
await throttle(RATE)
await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'load', timeout: 180000 })
await page.waitForFunction(() => window.__perf && window.__perf.mounted > 0, null, { timeout: 180000 })
await page.waitForTimeout(1500)
const load = await page.evaluate(() => {
  const P = window.__perf
  const gl = document.createElement('canvas').getContext('webgl2')
  const dbg = gl?.getExtension('WEBGL_debug_renderer_info')
  return { paint: Math.round(P.paints['first-contentful-paint'] ?? 0), mounted: Math.round(P.mounted), long: Math.round(P.long.reduce((a, l) => a + l[1], 0)), total: window.__DECK__.total, gl: gl ? String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : 'none' }
})
const hasGpu = load.gl !== 'none' && !/swiftshader|llvmpipe|software/i.test(load.gl)
if (load.mounted > B.loadFail) say('FAIL', `load: the deck mounted after ${load.mounted} ms at x${RATE} (budget ${B.loadFail})`)
else if (load.mounted > B.loadWarn) say('WARN', `load: the deck mounted after ${load.mounted} ms at x${RATE} (budget ${B.loadWarn})`)

/* ── the walk ── */
let from = 2
let to = load.total
const range = opt('slides', '')
if (range) {
  const [a, b] = range.split('-').map(Number)
  from = Math.max(2, a)
  to = Math.min(load.total, b || a)
}
await page.mouse.move(683, 384)
if (from > 2) {
  await page.evaluate((x) => (location.hash = `#/${x}`), from - 1)
  await page.waitForFunction((x) => window.__DECK__.current === x, from - 1, { timeout: 30000 })
  await page.waitForTimeout(WIN)
}
const rows = []
for (let n = from; n <= to; n++) {
  await throttle(RATE)
  await page.evaluate(() => window.__perf.start())
  const before = await metrics()
  const p0 = await page.evaluate(() => performance.now())
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(WIN)
  const mid = await metrics()
  const p1 = await page.evaluate(() => performance.now())
  const r = await page.evaluate(
    ([a, b]) => {
      const P = window.__perf
      const fr = P.frames.filter((t) => t >= a && t <= b)
      let worst = 0
      for (let i = 1; i < fr.length; i++) worst = Math.max(worst, fr[i] - fr[i - 1])
      return { id: window.__DECK__.slides[window.__DECK__.current - 1]?.id, current: window.__DECK__.current, frames: fr.length, worst: Math.round(worst), canvases: document.querySelectorAll('.slide-stage canvas').length }
    },
    [p0, p1],
  )
  const row = { n, ...r, task: +(mid.TaskDuration - before.TaskDuration).toFixed(2), idle: null, loops: [] }
  if (!QUICK) {
    /* settled, unthrottled, and with the frame counter off: what the slide costs by sitting there */
    await page.evaluate(() => window.__perf.stop())
    await throttle(1)
    await page.waitForTimeout(600)
    /* a 3D slide is still building its people for a while: it has settled when the engine's sprite queue is empty */
    if (r.canvases) await page.waitForFunction(() => !window.__DECK_SPRITES__ || window.__DECK_SPRITES__() === 0, null, { timeout: 30000 }).catch(() => {})
    if (r.canvases) await page.waitForTimeout(400)
    const a = await metrics()
    const w0 = Date.now()
    await page.waitForTimeout(1500)
    const b = await metrics()
    row.idle = +((b.TaskDuration - a.TaskDuration) / ((Date.now() - w0) / 1000)).toFixed(3)
    row.loops = await page.evaluate(() => {
      const OK = new Set(['transform', 'opacity', 'translate', 'rotate', 'scale', 'offset', 'easing', 'composite', 'computedOffset'])
      const out = new Map()
      for (const a of document.getAnimations()) {
        const fx = a.effect
        if (!fx || fx.getComputedTiming().iterations !== Infinity || a.playState !== 'running') continue
        const el = fx.target
        if (!el || !el.closest?.('.slide-stage')) continue
        const props = [...new Set(fx.getKeyframes().flatMap((k) => Object.keys(k)))].filter((k) => !OK.has(k))
        const inSvg = el instanceof SVGElement && !!el.ownerSVGElement
        if (!props.length && !inSvg) continue
        const name = a.animationName ?? 'script'
        const why = inSvg ? `on <${el.tagName.toLowerCase()}> inside an svg` : `animates ${props.join(', ')}`
        const key = `${name} ${why}`
        out.set(key, (out.get(key) ?? 0) + 1)
      }
      return [...out].map(([k, c]) => (c > 1 ? `${k} x${c}` : k))
    })
  }
  rows.push(row)
  process.stderr.write(`\r  slide ${n}/${to}   `)
}
process.stderr.write('\r' + ' '.repeat(30) + '\r')
await browser.close()

/* ── judging ── */
for (const r of rows) {
  const three = r.canvases > 0
  const at = `slide ${r.n} (${r.id})`
  if (three && !hasGpu) continue
  if (r.worst > B.frameFail) say('FAIL', `arrival: ${at} held one frame for ${r.worst} ms at x${RATE} (budget ${B.frameFail})`)
  else if (r.worst > B.frameWarn) say('WARN', `arrival: ${at} held one frame for ${r.worst} ms at x${RATE} (budget ${B.frameWarn})`)
  if (r.frames < B.framesFail) say('FAIL', `arrival: ${at} drew ${r.frames} of 150 frames in the 2.5 s after the press at x${RATE}`)
  else if (r.frames < B.framesWarn) say('WARN', `arrival: ${at} drew ${r.frames} of 150 frames in the 2.5 s after the press at x${RATE}`)
  if (r.idle !== null) {
    const [w, f] = three ? [B.idle3dWarn, B.idle3dFail] : [B.idleWarn, B.idleFail]
    const tail = r.loops.length ? `; loops that run on the main thread: ${r.loops.slice(0, 4).join('; ')}${r.loops.length > 4 ? ` (+${r.loops.length - 4})` : ''}` : ''
    if (r.idle > f) say('FAIL', `idle: ${at} uses ${(r.idle * 100).toFixed(0)}% of a core by sitting there (budget ${f * 100}%)${tail}`)
    else if (r.idle > w) say('WARN', `idle: ${at} uses ${(r.idle * 100).toFixed(0)}% of a core by sitting there (budget ${w * 100}%)${tail}`)
  }
}

/* ── the session's own code ── */
const source = opt('source', '')
if (source) {
  const dir = resolve(source, 'custom')
  if (existsSync(dir))
    for (const f of readdirSync(dir).filter((x) => /\.tsx?$/.test(x))) {
      const s = readFileSync(resolve(dir, f), 'utf8')
      if (/renderToStaticMarkup\s*\(/.test(s) && !/three-stage\.tsx$/.test(f))
        say('FAIL', `source: custom/${f} renders Character Lab frames itself (renderToStaticMarkup): use castSprite from @/engine/three-stage, which builds them without stalling the slide and frees them`)
      if (/new THREE\.WebGLRenderer|new WebGLRenderer/.test(s)) say('FAIL', `source: custom/${f} creates its own WebGL renderer: draw through ThreeStage`)
    }
}

/* ── report ── */
const mb = (text.length / 1048576).toFixed(2)
console.log(`\nperf-check  ${file}`)
console.log(`${mb} MB, ${load.total} slides, x${RATE} CPU, ${hasGpu ? 'GPU' : 'software GL'} (${load.gl.slice(0, 70)})${QUICK ? ', quick' : ''}\n`)
console.log(`load     first paint ${load.paint} ms, deck mounted ${load.mounted} ms, long tasks ${load.long} ms`)
const three = rows.filter((r) => r.canvases > 0)
const flat = rows.filter((r) => r.canvases === 0)
const avg = (list, k) => (list.length ? list.reduce((a, r) => a + r[k], 0) / list.length : 0)
const line = (name, list) => (list.length ? `${name} ${String(list.length).padStart(3)} slides: ${avg(list, 'frames').toFixed(0).padStart(3)} of 150 frames on average, worst frame ${Math.max(...list.map((r) => r.worst))} ms${QUICK ? '' : `, idle ${(avg(list, 'idle') * 100).toFixed(1)}% of a core (max ${(Math.max(...list.map((r) => r.idle)) * 100).toFixed(0)}%)`}` : '')
console.log(line('arrival  ordinary', flat))
if (three.length) console.log(line('arrival  3D      ', three) + (hasGpu ? '' : '   [not judged: no GPU]'))
if (args.includes('--table')) {
  console.log('\n  n  id            frames worst  task   idle  loops')
  for (const r of rows) console.log(`${String(r.n).padStart(3)}  ${String(r.id).padEnd(13).slice(0, 13)} ${String(r.frames).padStart(5)} ${String(r.worst).padStart(5)} ${r.task.toFixed(2).padStart(5)} ${r.idle === null ? '     -' : (r.idle * 100).toFixed(1).padStart(5) + '%'}  ${r.canvases ? `[3D x${r.canvases}] ` : ''}${r.loops.join('; ').slice(0, 90)}`)
}
console.log('')
const fails = findings.filter((f) => f.level === 'FAIL')
const warns = findings.filter((f) => f.level === 'WARN')
for (const f of [...fails, ...warns]) console.log(`${f.level}  ${f.what}`)
if (!findings.length) console.log('PASS  nothing over budget')
if (pageErrors.length) console.log(`\n(page errors seen: ${[...new Set(pageErrors)].slice(0, 3).join(' | ')})`)
console.log(`\nSummary: ${fails.length} FAIL, ${warns.length} WARN, in ${((Date.now() - t0) / 1000).toFixed(0)}s`)
const json = opt('json', '')
if (json) writeFileSync(json, JSON.stringify({ file, mb: Number(mb), rate: RATE, gpu: hasGpu, load, rows, findings }, null, 1))
process.exit(fails.length ? 1 : 0)
