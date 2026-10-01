#!/usr/bin/env node
/* Frame-exact reel export. The page runs on a manual clock and we ask for
 * one pose per 1/fps, so the same script gives the same file every time and
 * a dropped browser frame can never reach the video.
 *
 *   node record.mjs --skin riya --script review/scripts/intro.json --out out/riya.mp4
 *   options: --fps 30  --size 1080x1920  --duration <s>  --seed <n>  --bg [colour]
 *
 * The script is a JSON array of events, each { at } in seconds plus any of
 * expression (with optional intensity), gesture (with optional
 * gestureOptions), say. Events are applied through window.__actors.main at
 * the first frame on or after their time.
 *
 * Encoding: ffmpeg-static when it is installed (h264 mp4, crf 18). Without
 * it, the ffmpeg Playwright ships decodes only MJPEG and encodes only VP8,
 * so that path screenshots JPEG and writes a webm. With neither, the frame
 * folder is kept and the ffmpeg command to run is printed. */
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
/* --bg with no colour: the navy the deck chrome uses, so a reel drops onto
   a dark slide without a seam */
const NAVY = '#0F172A'
/* after the last event the actor still has to finish it; three seconds
   covers the longest gesture plus its settle */
const TAIL_SECONDS = 3

const args = parseArgs(process.argv.slice(2))
for (const k of ['skin', 'script', 'out']) if (!args[k]) fail(`--${k} is required`)
const skin = String(args.skin)
const fps = Number(args.fps) || 30
const [width, height] = String(args.size ?? '1080x1920').split('x').map(Number)
if (!width || !height) fail('--size must look like 1080x1920')
const seed = args.seed === undefined ? 1 : Number(args.seed)
const bg = args.bg === true ? NAVY : args.bg ? String(args.bg) : null

const script = JSON.parse(fs.readFileSync(path.resolve(args.script), 'utf8'))
if (!Array.isArray(script)) fail('the script must be a JSON array of events')
script.sort((a, b) => a.at - b.at)
const lastAt = script.length ? script[script.length - 1].at : 0
const duration = Number(args.duration) || lastAt + TAIL_SECONDS
const frameCount = Math.round(duration * fps)

const encoder = findEncoder()
const frameType = encoder?.kind === 'vp8' ? 'jpeg' : 'png'
let out = path.resolve(args.out)
if (encoder?.kind === 'vp8' && path.extname(out) !== '.webm') {
  out = out.replace(/\.[^.]*$/, '') + '.webm'
  console.log(`ffmpeg-static is not installed; the Playwright ffmpeg only writes VP8, so the output is ${path.basename(out)}`)
}
const framesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'characters-reel-'))

const { server, url } = await startVite()
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.on('pageerror', (e) => console.error('  page error:', e.message))

try {
  /* the page paints the backdrop itself from ?bg, on the body and the reel
     frame, so the colour goes in through the URL */
  const query = `reel=1&skin=${skin}&seed=${seed}&t=0` + (bg ? `&bg=${encodeURIComponent(bg)}` : '')
  await page.goto(`${url}/?${query}`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__actors && window.__actors.main, null, { timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.__actors.main.setClock('manual'))

  console.log(`${skin}: ${frameCount} frames at ${fps} fps (${duration.toFixed(2)} s), ${width}x${height}`)
  let next = 0
  for (let i = 0; i < frameCount; i++) {
    const t = i / fps
    const due = []
    while (next < script.length && script[next].at <= t + 1e-9) due.push(script[next++])
    await page.evaluate(stepInPage, { t, events: due })
    await settle(page)
    await page.screenshot({ type: frameType, quality: frameType === 'jpeg' ? 92 : undefined, path: framePath(i) })
    if (i % fps === 0) process.stdout.write(`  ${t.toFixed(1)} s\r`)
  }
  process.stdout.write('\n')
} finally {
  await browser.close()
  await server.close()
}

fs.mkdirSync(path.dirname(out), { recursive: true })
if (!encoder) {
  console.log(`no ffmpeg found. Frames are in ${framesDir}. Encode them with:`)
  console.log(`  ffmpeg -framerate ${fps} -i ${path.join(framesDir, 'frame-%05d.png')} -c:v libx264 -pix_fmt yuv420p -crf 18 ${out}`)
} else {
  const ok = encoder.kind === 'h264' ? await encodeH264(encoder.bin) : await encodeVp8(encoder.bin)
  if (ok) {
    fs.rmSync(framesDir, { recursive: true, force: true })
    console.log(`wrote ${path.relative(process.cwd(), out)}  (${frameCount} frames, ${duration.toFixed(2)} s)`)
  } else {
    console.log(`ffmpeg failed. Frames are kept in ${framesDir}`)
    process.exitCode = 1
  }
}

/* ---- one frame ---------------------------------------------------------- */

/* Runs inside the browser. Seek first so a gesture started at this frame
   begins at this time, then seek again so the pose includes what the
   events just changed. */
function stepInPage({ t, events }) {
  const c = window.__actors.main
  c.seek(t)
  for (const e of events) {
    if (e.expression) c.setExpression(e.expression, e.intensity)
    if (e.gesture) c.play(e.gesture, e.gestureOptions)
    if (e.say) c.say(e.say)
  }
  if (events.length) c.seek(t)
}

function settle(page) {
  return page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}

function framePath(i) {
  return path.join(framesDir, `frame-${String(i).padStart(5, '0')}.${frameType === 'jpeg' ? 'jpg' : 'png'}`)
}

/* ---- encoding ----------------------------------------------------------- */

function findEncoder() {
  try {
    const bin = createRequire(import.meta.url)('ffmpeg-static')
    if (bin && fs.existsSync(bin)) return { kind: 'h264', bin }
  } catch {}
  const cache = path.join(os.homedir(), '.cache', 'ms-playwright')
  if (!fs.existsSync(cache)) return null
  const builds = fs.readdirSync(cache).filter((n) => n.startsWith('ffmpeg-')).sort().reverse()
  for (const n of builds) {
    const bin = path.join(cache, n, 'ffmpeg-linux')
    if (fs.existsSync(bin)) return { kind: 'vp8', bin }
  }
  return null
}

function encodeH264(bin) {
  const input = path.join(framesDir, 'frame-%05d.png')
  return run(bin, ['-y', '-framerate', String(fps), '-i', input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out])
}

/* The Playwright build has no file-pattern demuxer, only image2pipe, so the
   JPEGs are streamed in on stdin one after another. */
function encodeVp8(bin) {
  const argv = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
    '-an', '-c:v', 'libvpx', '-b:v', '12M', '-qmin', '0', '-qmax', '20', '-crf', '6', '-deadline', 'good', '-cpu-used', '1', out]
  return run(bin, argv, async (stdin) => {
    for (let i = 0; i < frameCount; i++) {
      if (!stdin.write(fs.readFileSync(framePath(i)))) await new Promise((r) => stdin.once('drain', r))
    }
    stdin.end()
  })
}

function run(bin, argv, feed) {
  return new Promise((resolve) => {
    const p = spawn(bin, argv, { stdio: [feed ? 'pipe' : 'ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      if (code !== 0) console.error(err.split('\n').slice(-12).join('\n'))
      resolve(code === 0)
    })
    if (feed) feed(p.stdin).catch((e) => console.error(e.message))
  })
}

/* ---- plumbing ----------------------------------------------------------- */

async function startVite() {
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.ts'),
    logLevel: 'error',
    /* no HMR: a file saved mid-run must not reload the page under a frame */
    server: { host: '127.0.0.1', port: 5190, strictPort: false, hmr: false },
  })
  await server.listen()
  const { port } = server.httpServer.address()
  return { server, url: `http://127.0.0.1:${port}` }
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue
    const key = argv[i].slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else out[key] = argv[++i]
  }
  return out
}

function fail(msg) {
  console.error(msg)
  console.error('usage: node record.mjs --skin <arjun|riya> --script <events.json> --out <file.mp4> [--fps 30] [--size 1080x1920] [--duration s] [--seed n] [--bg [colour]]')
  process.exit(1)
}
