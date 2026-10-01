#!/usr/bin/env node
/* Contact sheets for review: one PNG per clip, 12 frames across the clip's
 * length with the time under each, for both skins, every gesture, every
 * expression and one spoken line. A reviewer judging realism needs to see
 * the wind-up, the arc and the settle side by side, which a video does not
 * give at a glance and a single still hides entirely.
 *
 *   node shoot.mjs                       everything
 *   node shoot.mjs --skin riya           one skin
 *   node shoot.mjs --only wave           clips whose name contains "wave"
 *
 * Starts Vite itself, so no dev server needs to be running. Writes
 * review/sheets/<skin>-<kind>-<name>.png and review/sheets/index.html. */
import { createServer } from 'vite'
import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const SHEETS = path.join(ROOT, 'review', 'sheets')
const FRAMES = 12
const SKINS = ['arjun', 'riya']
/* Expressions loop and hold, so there is no natural length; 2.4 s shows the
   build, the hold with its idle life, and one or two blinks. */
const FACE_SECONDS = 2.4

const args = parseArgs(process.argv.slice(2))
const skins = args.skin ? [String(args.skin)] : SKINS
const only = args.only ? String(args.only).toLowerCase() : ''

const { server, url } = await startVite()
const browser = await chromium.launch()
/* 2x so a 400 px actor comes back at 800 px: fingers and lids are the
   details a realism review is about, and they vanish at 1x. */
const context = await browser.newContext({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 2 })
const page = await context.newPage()
page.on('pageerror', (e) => console.error('  page error:', e.message))

try {
  await fs.mkdir(SHEETS, { recursive: true })
  const catalogue = await readCatalogue(page, url)
  const clips = planClips(catalogue, skins, only)
  console.log(`${clips.length} clips (${catalogue.gestures.length} gestures, ${catalogue.expressions.length} expressions, 1 talk line) x ${skins.length} skin(s)`)
  for (const clip of clips) {
    const png = await shootClip(page, url, clip)
    const file = path.join(SHEETS, `${clip.skin}-${clip.kind}-${clip.slug}.png`)
    await fs.writeFile(file, png)
    console.log(`wrote ${path.relative(ROOT, file)}  (${clip.duration.toFixed(2)} s)`)
  }
  const index = await writeIndex()
  console.log(`wrote ${path.relative(ROOT, index)}`)
} finally {
  await browser.close()
  await server.close()
}

/* ---- the clip list ---------------------------------------------------- */

/* The action list lives in src/actions as TypeScript, so we ask the page
   to import it through Vite rather than parse TS in node. */
async function readCatalogue(page, url) {
  await page.goto(`${url}/?skin=arjun&t=0`, { waitUntil: 'load' })
  return page.evaluate(async ({ lines }) => {
    const mod = await import('/src/actions/index.ts')
    const actions = mod.ACTIONS ?? {}
    const gestures = Object.keys(actions).map((name) => {
      const a = actions[name]
      /* a one-shot is only finished once it has blended back out; the
         settle is half of what makes a gesture read as a body */
      const settle = a.loop ? 0 : (a.blendOut ?? 0.25)
      return { name, group: a.group ?? 'other', duration: (a.duration ?? 2) + settle }
    })
    /* keep the registry's own grouping when it has one, so the index reads
       in the same order as the playground */
    const groups = mod.ACTION_GROUPS
    const order = Array.isArray(groups)
      ? groups.flatMap((g) => g.actions ?? g.gestures ?? g.items ?? [])
      : groups && typeof groups === 'object'
        ? Object.values(groups).flat()
        : []
    if (order.length) gestures.sort((a, b) => rank(a.name) - rank(b.name))
    function rank(n) {
      const i = order.indexOf(n)
      return i < 0 ? 1e9 : i
    }
    const expressions = Object.keys(mod.EXPRESSIONS ?? {})
    /* the talk line's length comes from the viseme builder; without it the
       sheet falls back to the expression window */
    let talkDuration = null
    try {
      const talk = await import('/src/actions/talk.ts')
      talkDuration = Object.fromEntries(lines.map(([skin, text]) => [skin, talk.talkAction(text).duration]))
    } catch {}
    return { gestures, expressions, talkDuration }
  }, { lines: SKINS.map((s) => [s, talkLine(s)]) })
}

function talkLine(skin) {
  return `Hi, I am ${skin[0].toUpperCase()}${skin.slice(1)}. Shall we start?`
}

function planClips(catalogue, skins, only) {
  const clips = []
  for (const skin of skins) {
    for (const g of catalogue.gestures) clips.push({ skin, kind: 'gesture', name: g.name, slug: g.name, param: 'gesture', duration: g.duration, group: g.group })
    for (const name of catalogue.expressions) clips.push({ skin, kind: 'expression', name, slug: name, param: 'expression', duration: FACE_SECONDS, group: 'face' })
    const say = talkLine(skin)
    clips.push({ skin, kind: 'talk', name: say, slug: 'hi', param: 'say', duration: catalogue.talkDuration?.[skin] ?? FACE_SECONDS, group: 'talk' })
  }
  return only ? clips.filter((c) => c.name.toLowerCase().includes(only) || c.kind.includes(only)) : clips
}

/* ---- one clip --------------------------------------------------------- */

async function shootClip(page, url, clip) {
  await page.goto(`${url}/?skin=${clip.skin}&${clip.param}=${encodeURIComponent(clip.name)}&t=0`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__actors && window.__actors.main, null, { timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  /* the runtime may know the clip's length better than the registry does
     (speed options, a talk line it built itself); prefer it when it says */
  const fromControls = await page.evaluate(() => {
    const c = window.__actors.main
    const d = c.duration ?? c.current?.duration
    return typeof d === 'number' && d > 0 ? d : null
  })
  if (fromControls) clip.duration = fromControls
  await page.evaluate(() => window.__actors.main.setClock('manual'))

  const actor = await actorLocator(page)
  const frames = []
  for (let i = 0; i < FRAMES; i++) {
    const t = +((clip.duration * i) / (FRAMES - 1)).toFixed(3)
    await page.evaluate((t) => window.__actors.main.seek(t), t)
    await settle(page)
    const shot = await actor.screenshot({ type: 'png' })
    frames.push({ src: `data:image/png;base64,${shot.toString('base64')}`, label: `${t.toFixed(2)} s` })
  }
  const title = `${clip.skin}  /  ${clip.kind}  /  ${clip.name}`
  const subtitle = `${FRAMES} frames over ${clip.duration.toFixed(2)} s, group ${clip.group}`
  const dataUrl = await page.evaluate(tileInPage, { frames, title, subtitle })
  return Buffer.from(dataUrl.split(',')[1], 'base64')
}

async function actorLocator(page) {
  const byId = page.locator('#actor')
  if ((await byId.count()) > 0) return byId.first()
  /* the playground names the harness actor #actor; until it does, the
     first svg on the page is the character */
  return page.locator('svg').first()
}

/* React commits on the next frame after seek; two rAFs cover the commit
   and the paint, and screenshots then show the pose that was asked for. */
function settle(page) {
  return page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}

/* Runs inside the browser. Draws the frames on a canvas 4 across with the
   time under each and returns a PNG data URL. Cells keep the 2x capture up
   to 640 px wide so the detail that was captured survives the tiling. */
async function tileInPage({ frames, title, subtitle }) {
  const load = (src) =>
    new Promise((res, rej) => {
      const im = new Image()
      im.onload = () => res(im)
      im.onerror = rej
      im.src = src
    })
  const imgs = await Promise.all(frames.map((f) => load(f.src)))
  const cols = 4
  const rows = Math.ceil(imgs.length / cols)
  const cellW = Math.min(imgs[0].naturalWidth, 640)
  const cellH = Math.round((cellW * imgs[0].naturalHeight) / imgs[0].naturalWidth)
  const gap = 24
  const labelH = 40
  const header = 84
  const W = gap + cols * (cellW + gap)
  const H = header + rows * (cellH + labelH + gap)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#EEF1F5'
  g.fillRect(0, 0, W, H)
  g.textBaseline = 'middle'
  g.fillStyle = '#111827'
  g.font = '600 26px Sora, Inter, system-ui, sans-serif'
  g.fillText(title, gap, 30)
  g.fillStyle = '#6B7280'
  g.font = '400 17px Inter, system-ui, sans-serif'
  g.fillText(subtitle, gap, 60)
  imgs.forEach((im, i) => {
    const x = gap + (i % cols) * (cellW + gap)
    const y = header + Math.floor(i / cols) * (cellH + labelH + gap)
    g.fillStyle = '#FFFFFF'
    g.fillRect(x, y, cellW, cellH)
    g.drawImage(im, x, y, cellW, cellH)
    g.fillStyle = '#374151'
    g.font = '500 19px Inter, system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillText(frames[i].label, x + cellW / 2, y + cellH + labelH / 2)
    g.textAlign = 'left'
  })
  return c.toDataURL('image/png')
}

/* ---- the index ---------------------------------------------------------- */

/* Built from what is on disk, not from this run, so a --only run refreshes
   a few sheets without dropping the rest from the index. */
async function writeIndex() {
  const files = (await fs.readdir(SHEETS)).filter((f) => f.endsWith('.png')).sort()
  const rows = files
    .map((f) => {
      const m = /^(\w+)-(gesture|expression|talk)-(.+)\.png$/.exec(f)
      return m && { file: f, skin: m[1], kind: m[2], name: m[3] }
    })
    .filter(Boolean)
  const sections = []
  for (const skin of [...new Set(rows.map((r) => r.skin))]) {
    for (const kind of ['gesture', 'expression', 'talk']) {
      const items = rows.filter((r) => r.skin === skin && r.kind === kind)
      if (!items.length) continue
      sections.push(
        `<h2>${skin} / ${kind} <small>${items.length}</small></h2>\n` +
          items.map((r) => `<figure data-name="${r.skin} ${r.kind} ${r.name}"><figcaption>${r.name}</figcaption><img loading="lazy" src="${r.file}" alt="${r.skin} ${r.kind} ${r.name}"></figure>`).join('\n'),
      )
    }
  }
  const html = `<!doctype html>
<meta charset="utf-8">
<title>Character sheets</title>
<style>
  body { margin: 0; padding: 24px; font: 15px/1.5 Inter, system-ui, sans-serif; background: #F8FAFC; color: #111827 }
  h1 { font: 600 24px Sora, Inter, sans-serif; margin: 0 0 8px }
  h2 { font: 600 18px Sora, Inter, sans-serif; margin: 32px 0 12px } h2 small { color: #6B7280; font-weight: 400 }
  input { font: inherit; padding: 6px 10px; border: 1px solid #CBD5E1; border-radius: 6px; width: 320px }
  figure { margin: 0 0 20px } figcaption { font-weight: 500; margin-bottom: 6px }
  img { display: block; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.12) }
  figure[hidden] { display: none }
</style>
<h1>Character sheets</h1>
<p>${rows.length} sheets. Generated by <code>node shoot.mjs</code> on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}.</p>
<input id="q" placeholder="filter: wave, riya, expression ..." autofocus>
${sections.join('\n')}
<script>
  const q = document.getElementById('q')
  q.oninput = () => {
    const s = q.value.trim().toLowerCase()
    for (const f of document.querySelectorAll('figure')) f.hidden = s && !f.dataset.name.includes(s)
    for (const h of document.querySelectorAll('h2')) {
      let n = h.nextElementSibling, any = false
      while (n && n.tagName === 'FIGURE') { any ||= !n.hidden; n = n.nextElementSibling }
      h.hidden = !any
    }
  }
</script>
`
  const file = path.join(SHEETS, 'index.html')
  await fs.writeFile(file, html)
  return file
}

/* ---- plumbing ----------------------------------------------------------- */

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
