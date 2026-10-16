#!/usr/bin/env node
/* Review evidence: exactly the table in REVIEW.md section 2. A reviewer
 * judging realism needs the wind-up, the arc and the settle side by side,
 * which a video does not give at a glance and a single still hides, so
 * nearly everything here is a contact sheet.
 *
 *   node shoot.mjs                              everything
 *   node shoot.mjs --kinds gesture,hero         a subset of the kinds below
 *   node shoot.mjs --skin riya                  one skin
 *   node shoot.mjs --only wave                  clips whose name contains "wave"
 *
 * Kinds and what they write under review/:
 *   gesture, expression, talk, idle   sheets/<skin>-<kind>-<name>.png
 *   hero        hero/<skin>.png (1080 tall), hero/<skin>-small.png (120 tall)
 *   grids       grids/expressions-<skin>.png, grids/hands.png, grids/configs.png
 *   velocity    grids/velocity-<name>.png, one strip chart per channel
 *   reel        reel/<skin>-intro.mp4 through record.mjs, frames kept in
 *               frames/<skin>/, and reel/<skin>-intro-sheet.png, one per second
 * Every run rewrites sheets/index.html from what is on disk.
 *
 * Starts Vite itself, so no dev server needs to be running. */
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const REVIEW = path.join(ROOT, 'review')
const DIR = {
  sheets: path.join(REVIEW, 'sheets'),
  hero: path.join(REVIEW, 'hero'),
  grids: path.join(REVIEW, 'grids'),
  reel: path.join(REVIEW, 'reel'),
  frames: path.join(REVIEW, 'frames'),
}
/* every preset in src/skins/config.ts; keep in step with PRESET_NAMES there */
const SKINS = ['arjun', 'riya', 'kabir', 'meera', 'dev', 'ananya', 'rohan']
const KINDS = ['gesture', 'expression', 'talk', 'idle', 'hero', 'grids', 'velocity', 'reel']

/* A tile is at most 300 px wide: a 12-frame sheet then reads in one look and
   stays under 600 KB. Sheet frames render at 900 px tall (600 wide) so the
   downscale into the tile is a clean 2:1. */
const TILE_W = 300
const SHEET_HEIGHT = 900
/* Hand crops render the actor at 1800 so a hand is about 120 px across
   before the crop, and the tile shows it at its captured size. */
const HAND_HEIGHT = 1800
const SHEET_FRAMES = 12
const LINE_FRAMES = 16
/* Expressions loop and hold, so there is no natural length; 2.4 s shows the
   build, the hold with its idle life, and one or two blinks. */
const FACE_SECONDS = 2.4
const IDLE_SECONDS = 8
/* the expression grid samples the hold, after the 0.35 s crossfade and the build */
const HOLD_T = 1.2
const HERO_T = 2.0
const VELOCITY_NAMES = ['wave', 'nod', 'shake', 'shrug', 'clap', 'jumpJoy', 'smileBuild', 'talk']
const REEL_SCRIPT = path.join(REVIEW, 'scripts', 'intro.json')
const REEL_FPS = 30

/* Twelve people on the two preset rigs. Together they wear all 11 hair
   styles, all 6 tops, all 5 bottoms, five tones, both glasses and both
   beards, plus a male-read style on the female rig and the reverse. */
const CONFIGS = [
  ['Dev: short, tshirt, jeans, fair, rect glasses', 'arjun', { name: 'Dev', skinTone: 'fair', hair: { style: 'short', color: 'black' }, outfit: { top: 'tshirt', topColor: '#1F7A5A', bottom: 'jeans', bottomColor: '#3B4A6B', shoeColor: '#2B2B2B' }, accessories: { glasses: 'rect' } }],
  ['Kabir: quiff, hoodie, shorts, dusky, short beard', 'arjun', { name: 'Kabir', skinTone: 'dusky', hair: { style: 'quiff', color: 'darkBrown' }, outfit: { top: 'hoodie', topColor: '#6B7280', bottom: 'shorts', bottomColor: '#C2410C', shoeColor: '#F3F4F6' }, accessories: { beard: 'short' } }],
  ['Sam: curly, polo, trousers, deep, round glasses, stubble', 'arjun', { name: 'Sam', skinTone: 'deep', hair: { style: 'curly', color: 'black' }, outfit: { top: 'polo', topColor: '#B91C1C', bottom: 'trousers', bottomColor: '#1F2937', shoeColor: '#4A3326' }, accessories: { glasses: 'round', beard: 'stubble' } }],
  ['Ravi: buzz, kurta, trousers, medium, short beard, watch', 'arjun', { name: 'Ravi', skinTone: 'medium', hair: { style: 'buzz', color: 'black' }, outfit: { top: 'kurta', topColor: '#F5E6C8', bottom: 'trousers', bottomColor: '#5B4636', shoeColor: '#4A3326' }, accessories: { beard: 'short', watch: true } }],
  ['Arun: sidePart, shirt, jeans, wheatish, round glasses', 'arjun', { name: 'Arun', skinTone: 'wheatish', hair: { style: 'sidePart', color: 'brown' }, outfit: { top: 'shirt', topColor: '#7C3AED', bottom: 'jeans', bottomColor: '#1E3A5F', shoeColor: '#2B2B2B' }, accessories: { glasses: 'round' } }],
  ['Jay: long hair on the male rig, tshirt, salwar, deep, stubble', 'arjun', { name: 'Jay', skinTone: 'deep', hair: { style: 'long', color: 'black' }, outfit: { top: 'tshirt', topColor: '#0F766E', bottom: 'salwar', bottomColor: '#E5E7EB', shoeColor: '#8A5A3C' }, accessories: { beard: 'stubble' } }],
  ['Meera: braid, blouse, skirt, fair, rect glasses, earrings', 'riya', { name: 'Meera', skinTone: 'fair', hair: { style: 'braid', color: 'black' }, outfit: { top: 'blouse', topColor: '#DB2777', bottom: 'skirt', bottomColor: '#1F2937', shoeColor: '#2B2B2B' }, accessories: { glasses: 'rect', earrings: true } }],
  ['Anu: ponytail, tshirt, jeans, medium', 'riya', { name: 'Anu', skinTone: 'medium', hair: { style: 'ponytail', color: 'darkBrown' }, outfit: { top: 'tshirt', topColor: '#F59E0B', bottom: 'jeans', bottomColor: '#3B4A6B', shoeColor: '#F3F4F6' }, accessories: {} }],
  ['Tara: bob, hoodie, shorts, dusky, round glasses', 'riya', { name: 'Tara', skinTone: 'dusky', hair: { style: 'bob', color: 'auburn' }, outfit: { top: 'hoodie', topColor: '#1D4ED8', bottom: 'shorts', bottomColor: '#374151', shoeColor: '#F3F4F6' }, accessories: { glasses: 'round' } }],
  ['Priya: long, kurta, salwar, deep, bindi, earrings, necklace', 'riya', { name: 'Priya', skinTone: 'deep', hair: { style: 'long', color: 'black' }, outfit: { top: 'kurta', topColor: '#DC2626', bottom: 'salwar', bottomColor: '#FDE68A', shoeColor: '#8A5A3C' }, accessories: { bindi: true, earrings: true, necklace: true } }],
  ['Lata: bun, blouse, trousers, wheatish, grey hair, rect glasses', 'riya', { name: 'Lata', skinTone: 'wheatish', hair: { style: 'bun', color: 'grey' }, outfit: { top: 'blouse', topColor: '#0891B2', bottom: 'trousers', bottomColor: '#111827', shoeColor: '#2B2B2B' }, accessories: { glasses: 'rect', necklace: true } }],
  ['Nisha: wavy, polo, skirt, fair, earrings, flower', 'riya', { name: 'Nisha', skinTone: 'fair', hair: { style: 'wavy', color: 'brown' }, outfit: { top: 'polo', topColor: '#16A34A', bottom: 'skirt', bottomColor: '#7C2D12', shoeColor: '#4A3326' }, accessories: { earrings: true, flower: true } }],
]

const args = parseArgs(process.argv.slice(2))
const skins = args.skin ? [String(args.skin)] : SKINS
const only = args.only ? String(args.only).toLowerCase() : ''
const kinds = args.kinds ? String(args.kinds).split(',').map((k) => k.trim()) : KINDS
for (const k of kinds) if (!KINDS.includes(k)) fail(`unknown kind "${k}"; kinds are ${KINDS.join(', ')}`)
const wants = (k) => kinds.includes(k)

const { server, url } = await startVite()
const browser = await chromium.launch()
/* 1x: every capture is at its rendered size, and the viewport is tall enough
   for the largest actor (the 1800 px hand shots) to sit inside it uncropped */
const context = await browser.newContext({ viewport: { width: 1400, height: 2000 }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.on('pageerror', (e) => console.error('  page error:', e.message))

const written = []
try {
  for (const d of Object.values(DIR)) await fs.mkdir(d, { recursive: true })
  const catalogue = await readCatalogue()
  if (kinds.some((k) => ['gesture', 'expression', 'talk', 'idle'].includes(k))) await shootSheets(catalogue)
  if (wants('hero')) await shootHero()
  if (wants('grids')) await shootGrids(catalogue)
  if (wants('velocity')) await shootVelocity()
  if (wants('reel')) await shootReel()
  await save(path.join(DIR.sheets, 'index.html'), await buildIndex())
} finally {
  await browser.close()
  await server.close()
}
console.log(`${written.length} files written`)

/* ---- the catalogue ---------------------------------------------------- */

/* The action list lives in src/actions as TypeScript, so we ask the page
   to import it through Vite rather than parse TS in node. */
async function readCatalogue() {
  await page.goto(`${url}/?skin=arjun&t=0`, { waitUntil: 'load' })
  return page.evaluate(async ({ lines }) => {
    const mod = await import('/src/actions/index.ts')
    const keysOf = (a) => Object.values(a.tracks).reduce((n, k) => n + k.length, 0)
    /* the registry's own grouping, so sheets come out in the playground's order */
    const order = Object.values(mod.ACTION_GROUPS ?? {}).flat()
    const rank = (n) => (order.indexOf(n) < 0 ? 1e9 : order.indexOf(n))
    const gestures = Object.keys(mod.ACTIONS)
      .sort((a, b) => rank(a) - rank(b))
      .map((name) => {
        const a = mod.ACTIONS[name]
        /* a one-shot is only finished once it has blended back out; the
           settle is half of what makes a gesture read as a body */
        const settle = a.loop ? 0 : (a.blendOut ?? 0.25)
        return { name, group: a.group ?? 'other', duration: (a.duration ?? 2) + settle, keys: keysOf(a) }
      })
    const expressions = Object.keys(mod.EXPRESSIONS).map((name) => ({ name, keys: keysOf(mod.EXPRESSIONS[name]) }))
    const talk = await import('/src/actions/talk.ts')
    const talkLines = Object.fromEntries(
      lines.map(([skin, text]) => {
        const a = talk.talkAction(text)
        return [skin, { text, duration: a.duration, keys: keysOf(a) }]
      }),
    )
    return { gestures, expressions, talkLines, handPoses: Object.keys(mod.HAND_POSES) }
  }, { lines: SKINS.map((s) => [s, talkLine(s)]) })
}

function talkLine(skin) {
  return `Hi, I am ${skin[0].toUpperCase()}${skin.slice(1)}. Shall we start?`
}

/* ---- sheets: gesture, expression, talk, idle --------------------------- */

function planClips(catalogue) {
  const clips = []
  for (const skin of skins) {
    if (wants('gesture'))
      for (const g of catalogue.gestures)
        clips.push({ skin, kind: 'gesture', name: g.name, file: `${skin}-gesture-${g.name}.png`, query: `gesture=${g.name}`, frames: SHEET_FRAMES, duration: g.duration, note: `group ${g.group}, ${g.keys} keys` })
    if (wants('expression'))
      for (const e of catalogue.expressions)
        clips.push({ skin, kind: 'expression', name: e.name, file: `${skin}-expression-${e.name}.png`, query: `expression=${e.name}`, frames: SHEET_FRAMES, duration: FACE_SECONDS, note: `from neutral, ${e.keys} keys` })
    if (wants('talk')) {
      const line = catalogue.talkLines[skin]
      clips.push({ skin, kind: 'talk', name: line.text, file: `${skin}-talk.png`, query: `say=${encodeURIComponent(line.text)}`, frames: LINE_FRAMES, duration: line.duration, note: `${line.keys} keys` })
    }
    if (wants('idle')) clips.push({ skin, kind: 'idle', name: 'idle', file: `${skin}-idle.png`, query: '', frames: LINE_FRAMES, duration: IDLE_SECONDS, note: 'no gesture, neutral, seed 1: the idle layer alone' })
  }
  return only ? clips.filter((c) => c.name.toLowerCase().includes(only) || c.kind.includes(only)) : clips
}

async function shootSheets(catalogue) {
  const clips = planClips(catalogue)
  console.log(`${clips.length} sheets`)
  for (const clip of clips) {
    await load(`skin=${clip.skin}&height=${SHEET_HEIGHT}&${clip.query}`)
    const cells = []
    for (let i = 0; i < clip.frames; i++) {
      const t = +((clip.duration * i) / (clip.frames - 1)).toFixed(3)
      cells.push({ src: await shotAt(t), label: `${t.toFixed(2)} s` })
    }
    const png = await tile({
      cells,
      cols: 4,
      title: `${clip.skin}  /  ${clip.kind}  /  ${clip.name}`,
      subtitle: `${clip.frames} frames over ${clip.duration.toFixed(2)} s, ${clip.note}`,
    })
    await save(path.join(DIR.sheets, clip.file), png)
  }
}

/* ---- hero stills --------------------------------------------------------- */

/* The 120 px still is rendered at 120 px, not scaled down from the big one:
   the question it answers is what the renderer draws at slide size. */
async function shootHero() {
  for (const skin of skins) {
    for (const [height, suffix] of [[1080, ''], [120, '-small']]) {
      await load(`skin=${skin}&height=${height}`)
      await seek(HERO_T)
      await save(path.join(DIR.hero, `${skin}${suffix}.png`), await actor().screenshot({ type: 'png' }))
    }
  }
}

/* ---- grids ---------------------------------------------------------------- */

async function shootGrids(catalogue) {
  for (const skin of skins) {
    const cells = []
    for (const e of catalogue.expressions) {
      await load(`skin=${skin}&height=${SHEET_HEIGHT}&expression=${e.name}`)
      cells.push({ src: await shotAt(HOLD_T, headAndShoulders), label: e.name })
    }
    const png = await tile({ cells, cols: 6, title: `expressions  /  ${skin}`, subtitle: `one frame per expression at t = ${HOLD_T} s, the hold` })
    await save(path.join(DIR.grids, `expressions-${skin}.png`), png)
  }

  /* six poses per row, the left hand's row above the right hand's */
  const cells = []
  const poses = catalogue.handPoses
  for (let i = 0; i < poses.length; i += 6) {
    for (const side of ['L', 'R']) {
      for (const name of poses.slice(i, i + 6)) {
        await load(`skin=arjun&height=${HAND_HEIGHT}&handPose=${name}&side=${side}`)
        cells.push({ src: await shotAt(1.0, handRegion, side), label: `${name}  ${side}` })
      }
    }
  }
  await save(path.join(DIR.grids, 'hands.png'), await tile({ cells, cols: 6, title: 'hands', subtitle: `${poses.length} HAND_POSES on both hands, held palm out at the chest` }))

  const configCells = []
  for (const [label, base, config] of CONFIGS) {
    await load(`skin=${base}&height=${SHEET_HEIGHT}&config=${encodeURIComponent(JSON.stringify(config))}`)
    configCells.push({ src: await shotAt(HERO_T), label })
  }
  await save(path.join(DIR.grids, 'configs.png'), await tile({ cells: configCells, cols: 4, title: 'configs', subtitle: `${CONFIGS.length} configs: all 11 hair styles, every top and bottom, five tones, glasses, beards` }))
}

/* Crop in viewBox units (400 x 600, shoulders at y = 262): from just above
   the hair to the top of the chest, 230 wide about the centre line. */
function headAndShoulders() {
  const svg = document.querySelector('#actor svg').getBoundingClientRect()
  const head = document.querySelector('[data-part="head"]').getBoundingClientRect()
  const k = svg.width / 400
  const top = Math.max(svg.top, head.top - 10 * k)
  return { x: svg.left + 85 * k, y: top, width: 230 * k, height: svg.top + 330 * k - top }
}

/* Runs inside the browser, given the side. The wrist group is the last
   child of the elbow group: arm > shoulder g > elbow g > wrist g. Padded so
   the cuff and a little forearm show which way the hand is turned. */
function handRegion(side) {
  const hand = document.querySelector(`[data-part="arm-${side}"] > g > g > g:last-child`).getBoundingClientRect()
  const pad = Math.max(hand.width, hand.height) * 0.35
  return { x: hand.left - pad, y: hand.top - pad, width: hand.width + 2 * pad, height: hand.height + 2 * pad }
}

/* ---- velocity strips ------------------------------------------------------ */

async function shootVelocity() {
  await load('skin=arjun')
  const names = only ? VELOCITY_NAMES.filter((n) => n.toLowerCase().includes(only)) : VELOCITY_NAMES
  for (const name of names) {
    const png = await renderCanvas(velocityInPage, { name, line: talkLine('arjun') })
    if (!png) {
      console.error(`  no action named ${name}`)
      continue
    }
    await save(path.join(DIR.grids, `velocity-${name}.png`), png)
  }
}

/* Runs inside the browser. One strip per channel the action touches: the
   value curve over its own range, under it a heat band of the per-frame
   change at 60 fps against the continuity test's cap (blue up to the cap,
   red past it), and a tick at every key. A pop is a red bar; a dead hold
   is a flat line with no heat under it. */
async function velocityInPage({ name, line }) {
  const { ACTIONS } = await import('/src/actions/index.ts')
  const { sampleAction } = await import('/src/rig/track.ts')
  const action = name === 'talk' ? (await import('/src/actions/talk.ts')).talkAction(line) : ACTIONS[name]
  if (!action) return false

  /* the same numbers as tests/continuity.test.ts, so the chart and the test agree */
  const ANGLES = ['shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'wristL', 'wristR', 'headTilt', 'lean']
  const cap = (ch) => {
    if (ch === 'blinkL' || ch === 'blinkR') return 0.5
    if (ANGLES.includes(ch)) return 13
    if (ch === 'bodyY') return 14
    if (ch === 'bodyX') return 6
    if (ch === 'headY' || ch === 'twist') return 3
    if (ch === 'headTurn' || ch === 'headNod') return 0.16
    if (ch === 'lookX' || ch === 'lookY') return 0.3
    if (ch === 'kneeL' || ch === 'kneeR') return 0.25
    if (ch === 'breathe') return 0.2
    if (ch.startsWith('mouth') || ch === 'pucker' || ch === 'smile') return 0.2
    if (/^(f|t|spread|palm)/.test(ch)) return 0.15
    return 0.12
  }

  const HZ = 240
  const STEP = HZ / 60
  const blendOut = action.blendOut ?? 0.25
  const end = action.loop ? action.duration * 2 : action.duration + blendOut
  const n = Math.floor(end * HZ) + 1
  const rows = Array.from({ length: n }, (_, i) => sampleAction(action, i / HZ))
  const channels = Object.keys(action.tracks)
  const keys = channels.reduce((s, ch) => s + action.tracks[ch].length, 0)

  const left = 150
  const right = 170
  const plotW = 1000
  const stripH = 56
  const gapY = 10
  const header = 76
  const footer = 36
  const W = left + plotW + right
  const H = header + channels.length * (stripH + gapY) + footer
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#EEF1F5'
  g.fillRect(0, 0, W, H)
  g.textBaseline = 'middle'
  g.fillStyle = '#111827'
  g.font = '600 24px Sora, Inter, system-ui, sans-serif'
  g.fillText(`velocity  /  ${name}`, 24, 28)
  g.fillStyle = '#6B7280'
  g.font = '400 15px Inter, system-ui, sans-serif'
  const what = name === 'talk' ? `"${line}"` : `${action.duration} s${action.loop ? ', loops, two passes shown' : ` + ${blendOut} s blend out`}`
  g.fillText(`${channels.length} channels, ${keys} keys, ${what}. Curve: value over its own range. Band: change per 60 fps frame against the cap, red past it. Ticks: keys.`, 24, 56)

  const x = (t) => left + (t / end) * plotW
  channels.forEach((ch, row) => {
    const y0 = header + row * (stripH + gapY)
    const v = rows.map((r) => r[ch])
    const lo = Math.min(...v)
    const hi = Math.max(...v)
    const span = hi - lo
    g.fillStyle = '#FFFFFF'
    g.fillRect(left, y0, plotW, stripH)

    let peak = 0
    for (let i = 0; i + STEP < n; i += STEP) {
      const d = Math.abs(v[i + STEP] - v[i])
      peak = Math.max(peak, d)
      const r = d / cap(ch)
      if (r < 0.02) continue
      g.fillStyle = r > 1 ? 'rgba(220, 38, 38, 0.85)' : `rgba(37, 99, 235, ${0.12 + 0.6 * r})`
      g.fillRect(x(i / HZ), y0 + stripH - 12, Math.max(1, x((i + STEP) / HZ) - x(i / HZ)), 12)
    }

    g.strokeStyle = '#111827'
    g.lineWidth = 1.5
    g.beginPath()
    v.forEach((val, i) => {
      const yy = span < 1e-6 ? y0 + stripH / 2 : y0 + 6 + (1 - (val - lo) / span) * (stripH - 24)
      i ? g.lineTo(x(i / HZ), yy) : g.moveTo(x(i / HZ), yy)
    })
    g.stroke()

    g.fillStyle = '#9CA3AF'
    for (const [t] of action.tracks[ch]) g.fillRect(x(t) - 0.5, y0, 1, 6)

    g.fillStyle = '#111827'
    g.font = '500 14px Inter, system-ui, sans-serif'
    g.textAlign = 'right'
    g.fillText(ch, left - 10, y0 + stripH / 2)
    g.fillStyle = '#6B7280'
    g.font = '400 12px Inter, system-ui, sans-serif'
    g.textAlign = 'left'
    g.fillText(`${fmt(lo)} .. ${fmt(hi)}`, left + plotW + 10, y0 + stripH / 2 - 9)
    g.fillText(`peak ${fmt(peak * 60)} /s, cap ${fmt(cap(ch) * 60)} /s`, left + plotW + 10, y0 + stripH / 2 + 9)
  })

  /* time axis, with the clip's own end marked where the blend out begins */
  const axisY = header + channels.length * (stripH + gapY) + 4
  g.fillStyle = '#6B7280'
  g.font = '400 12px Inter, system-ui, sans-serif'
  g.textAlign = 'center'
  for (let t = 0; t <= end + 1e-9; t += 0.5) {
    g.fillRect(x(t) - 0.5, axisY, 1, 6)
    g.fillText(`${t.toFixed(1)} s`, x(t), axisY + 16)
  }
  if (!action.loop) {
    g.strokeStyle = '#9CA3AF'
    g.setLineDash([4, 4])
    g.beginPath()
    g.moveTo(x(action.duration), header)
    g.lineTo(x(action.duration), axisY)
    g.stroke()
  }
  c.id = 'review-canvas'
  document.body.appendChild(c)
  return true

  function fmt(v) {
    return Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(2)
  }
}

/* ---- the reel ------------------------------------------------------------- */

/* record.mjs starts its own Vite and browser; it keeps every frame in
   frames/<skin>/, and the sheet takes one per second from there. */
async function shootReel() {
  for (const skin of skins) {
    const out = path.join(DIR.reel, `${skin}-intro.mp4`)
    const ok = await run(process.execPath, ['record.mjs', '--skin', skin, '--script', REEL_SCRIPT, '--out', out, '--fps', String(REEL_FPS)])
    if (!ok) {
      console.error(`  record.mjs failed for ${skin}`)
      continue
    }
    written.push(out)
    const dir = path.join(DIR.frames, skin)
    const frames = (await fs.readdir(dir)).filter((f) => /^frame-\d+\.(png|jpg)$/.test(f)).sort()
    const cells = []
    for (let i = 0; i < frames.length; i += REEL_FPS) {
      const buf = await fs.readFile(path.join(dir, frames[i]))
      const mime = frames[i].endsWith('.jpg') ? 'image/jpeg' : 'image/png'
      cells.push({ src: `data:${mime};base64,${buf.toString('base64')}`, label: `${i / REEL_FPS} s` })
    }
    const png = await tile({ cells, cols: 4, title: `reel  /  ${skin}  /  intro`, subtitle: `one frame per second of ${frames.length} at ${REEL_FPS} fps, from ${path.relative(ROOT, dir)}` })
    await save(path.join(DIR.reel, `${skin}-intro-sheet.png`), png)
  }
}

/* ---- the index -------------------------------------------------------------- */

/* Built from what is on disk, not from this run, so a --kinds or --only run
   refreshes a few files without dropping the rest from the index. */
async function buildIndex() {
  const pngs = async (dir) => (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.png')).sort()
  const sheets = await pngs(DIR.sheets)
  const hero = await pngs(DIR.hero)
  const grids = await pngs(DIR.grids)
  const reel = await pngs(DIR.reel)
  const fig = (src, name, extra = '') => `<figure data-name="${name}"><figcaption>${name}</figcaption>${extra}<img loading="lazy" src="${src}" alt="${name}"></figure>`
  const section = (title, figs) => (figs.length ? `<h2>${title} <small>${figs.length}</small></h2>\n${figs.join('\n')}` : '')

  const sections = [
    section('hero', hero.map((f) => fig(`../hero/${f}`, `hero ${f.replace('.png', '')}`))),
    section('grids', grids.filter((f) => !f.startsWith('velocity-')).map((f) => fig(`../grids/${f}`, `grid ${f.replace('.png', '')}`))),
    section('velocity', grids.filter((f) => f.startsWith('velocity-')).map((f) => fig(`../grids/${f}`, f.replace('.png', '')))),
    section('reel', reel.map((f) => {
      const mp4 = f.replace('-sheet.png', '.mp4')
      return fig(`../reel/${f}`, `reel ${f.replace('-sheet.png', '')}`, `<video controls preload="metadata" src="../reel/${mp4}"></video>`)
    })),
  ]
  const rows = sheets.map((f) => /^(\w+)-(gesture|expression|talk|idle)(?:-(.+))?\.png$/.exec(f)).filter(Boolean)
  for (const skin of [...new Set(rows.map((m) => m[1]))]) {
    for (const kind of ['idle', 'gesture', 'expression', 'talk']) {
      const items = rows.filter((m) => m[1] === skin && m[2] === kind)
      sections.push(section(`${skin} / ${kind}`, items.map((m) => fig(m[0], `${skin} ${kind} ${m[3] ?? ''}`.trim()))))
    }
  }
  const total = sheets.length + hero.length + grids.length + reel.length
  return `<!doctype html>
<meta charset="utf-8">
<title>Character review evidence</title>
<style>
  body { margin: 0; padding: 24px; font: 15px/1.5 Inter, system-ui, sans-serif; background: #F8FAFC; color: #111827 }
  h1 { font: 600 24px Sora, Inter, sans-serif; margin: 0 0 8px }
  h2 { font: 600 18px Sora, Inter, sans-serif; margin: 32px 0 12px } h2 small { color: #6B7280; font-weight: 400 }
  input { font: inherit; padding: 6px 10px; border: 1px solid #CBD5E1; border-radius: 6px; width: 320px }
  figure { margin: 0 0 20px } figcaption { font-weight: 500; margin-bottom: 6px }
  img, video { display: block; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.12) }
  video { width: 270px; margin-bottom: 8px }
  figure[hidden] { display: none }
</style>
<h1>Character review evidence</h1>
<p>${total} files. Generated by <code>node shoot.mjs</code> on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}.</p>
<input id="q" placeholder="filter: wave, riya, expression, velocity ..." autofocus>
${sections.filter(Boolean).join('\n')}
<script>
  const q = document.getElementById('q')
  q.oninput = () => {
    const s = q.value.trim().toLowerCase()
    for (const f of document.querySelectorAll('figure')) f.hidden = s && !f.dataset.name.toLowerCase().includes(s)
    for (const h of document.querySelectorAll('h2')) {
      let n = h.nextElementSibling, any = false
      while (n && n.tagName === 'FIGURE') { any ||= !n.hidden; n = n.nextElementSibling }
      h.hidden = !any
    }
  }
</script>
`
}

/* ---- shooting one page ------------------------------------------------------ */

/* Open the single-actor page on a manual clock at t=0, fonts loaded. */
async function load(query) {
  await page.goto(`${url}/?${query}&t=0`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__actors && window.__actors.main, null, { timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
}

/* React commits on the next frame after seek; two rAFs cover the commit
   and the paint, and screenshots then show the pose that was asked for. */
async function seek(t) {
  await page.evaluate((t) => window.__actors.main.seek(t), t)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}

function actor() {
  return page.locator('#actor')
}

/* A frame at t as a data URL: the whole actor, or the rect a crop function
   computes inside the page (it gets `arg`; nothing else crosses over). */
async function shotAt(t, crop, arg) {
  await seek(t)
  const png = crop ? await page.screenshot({ type: 'png', clip: await page.evaluate(crop, arg) }) : await actor().screenshot({ type: 'png' })
  return `data:image/png;base64,${png.toString('base64')}`
}

function tile(spec) {
  return renderCanvas(tileInPage, { ...spec, tileW: TILE_W })
}

/* `draw` runs in the page and leaves its canvas in the document as
   #review-canvas; Chromium's screenshot encoder then writes the PNG, which
   comes out about a third smaller than canvas.toDataURL for this art. */
async function renderCanvas(draw, arg) {
  if (!(await page.evaluate(draw, arg))) return null
  const png = await page.locator('#review-canvas').screenshot({ type: 'png' })
  await page.evaluate(() => document.getElementById('review-canvas').remove())
  return png
}

/* Runs inside the browser. Draws the cells on a canvas `cols` across with a
   label under each; a cell is at most tileW wide and never upscaled. */
async function tileInPage({ cells, cols, title, subtitle, tileW }) {
  const load = (src) =>
    new Promise((res, rej) => {
      const im = new Image()
      im.onload = () => res(im)
      im.onerror = rej
      im.src = src
    })
  const imgs = await Promise.all(cells.map((f) => load(f.src)))
  const fit = imgs.map((im) => {
    const w = Math.min(im.naturalWidth, tileW)
    return { w, h: Math.round((w * im.naturalHeight) / im.naturalWidth) }
  })
  const cellW = Math.max(...fit.map((f) => f.w))
  const cellH = Math.max(...fit.map((f) => f.h))
  const rows = Math.ceil(imgs.length / cols)
  const gap = 24
  const labelH = 40
  const header = 84
  const W = gap + cols * (cellW + gap)
  const H = header + rows * (cellH + labelH + gap)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.imageSmoothingQuality = 'high'
  g.fillStyle = '#EEF1F5'
  g.fillRect(0, 0, W, H)
  g.textBaseline = 'middle'
  g.fillStyle = '#111827'
  g.font = '600 22px Sora, Inter, system-ui, sans-serif'
  g.fillText(title, gap, 30)
  g.fillStyle = '#6B7280'
  g.font = '400 14px Inter, system-ui, sans-serif'
  g.fillText(subtitle, gap, 58)
  imgs.forEach((im, i) => {
    const x = gap + (i % cols) * (cellW + gap)
    const y = header + Math.floor(i / cols) * (cellH + labelH + gap)
    g.fillStyle = '#FFFFFF'
    g.fillRect(x, y, cellW, cellH)
    const { w, h } = fit[i]
    g.drawImage(im, x + (cellW - w) / 2, y + (cellH - h) / 2, w, h)
    g.fillStyle = '#374151'
    g.font = '500 13px Inter, system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillText(clip(cells[i].label, cellW - 8), x + cellW / 2, y + cellH + labelH / 2)
    g.textAlign = 'left'
  })
  c.id = 'review-canvas'
  document.body.appendChild(c)
  return true

  function clip(text, width) {
    if (g.measureText(text).width <= width) return text
    while (text.length > 1 && g.measureText(text + '...').width > width) text = text.slice(0, -1)
    return text + '...'
  }
}

/* ---- plumbing ------------------------------------------------------------------ */

async function save(file, data) {
  await fs.writeFile(file, file.endsWith('.png') ? recompress(data) : data)
  written.push(file)
  console.log(`wrote ${path.relative(ROOT, file)}`)
}

/* Re-deflate a PNG's image data at zlib's top level. Chromium's encoder
   already chose the row filters; this only squeezes the stream, which is
   the few percent that keeps a 12-frame sheet under 600 KB. */
function recompress(png) {
  const chunks = []
  const idat = []
  for (let p = 8; p < png.length; ) {
    const len = png.readUInt32BE(p)
    const type = png.toString('ascii', p + 4, p + 8)
    const body = png.subarray(p + 8, p + 8 + len)
    if (type === 'IDAT') idat.push(body)
    else chunks.push({ type, body })
    p += 12 + len
  }
  const packed = zlib.deflateSync(zlib.inflateSync(Buffer.concat(idat)), { level: 9, memLevel: 9 })
  const out = [png.subarray(0, 8)]
  for (const { type, body } of chunks) {
    if (type === 'IEND') out.push(chunk('IDAT', packed))
    out.push(chunk(type, body))
  }
  return Buffer.concat(out)

  function chunk(type, body) {
    const head = Buffer.alloc(4)
    head.writeUInt32BE(body.length)
    const typed = Buffer.concat([Buffer.from(type, 'ascii'), body])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(zlib.crc32(typed))
    return Buffer.concat([head, typed, crc])
  }
}

function run(bin, argv) {
  return new Promise((resolve) => {
    const p = spawn(bin, argv, { cwd: ROOT, stdio: 'inherit' })
    p.on('close', (code) => resolve(code === 0))
  })
}

async function startVite() {
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.ts'),
    logLevel: 'error',
    /* 5190 when free; strictPort off lets Vite take the next one instead
       of failing because the playground happens to be open. No HMR: a file
       saved mid-run must not reload the page under a screenshot. */
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
  process.exit(1)
}
