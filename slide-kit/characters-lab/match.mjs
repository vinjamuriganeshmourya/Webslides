#!/usr/bin/env node
/* Reference beside render: the one picture that says whether a restyle
 * round moved the character toward the illustration it is drawn from.
 *
 *   node match.mjs                 both skins
 *   node match.mjs --skin riya     one skin
 *
 * Each skin is opened in the playground's URL mode in the pose its reference
 * strikes, the actor is shot at MATCH_HEIGHT on white, and python3 (PIL)
 * composes review/match/<skin>.png: reference on the left, scaled to the
 * same height, render on the right, a white gap between.
 *
 * Starts Vite itself, like shoot.mjs, so nothing needs to be running. */
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'review', 'match')
const REFERENCE = path.join(ROOT, 'reference')
const MATCH_HEIGHT = 1100
const GAP = 40

/* The pose each reference strikes, in the playground's query grammar. t is
   the manual clock: 1.0 s is past the build of both the expression and the
   gesture, inside the hold. */
const POSES = {
  arjun: 'skin=arjun&expression=laugh&gesture=thumbsUp&t=1.0',
  riya: 'skin=riya&expression=happy&gesture=presentLeft&t=1.0',
}

const args = process.argv.slice(2)
const skinArg = args.indexOf('--skin')
const skins = skinArg >= 0 ? [args[skinArg + 1]] : Object.keys(POSES)
for (const s of skins) if (!POSES[s]) fail(`no pose for skin "${s}"; skins are ${Object.keys(POSES).join(', ')}`)

const { server, url } = await startVite()
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1400, height: 1400 }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.on('pageerror', (e) => console.error('  page error:', e.message))

try {
  await fs.mkdir(OUT, { recursive: true })
  for (const skin of skins) {
    const render = path.join(OUT, `${skin}-render.png`)
    await page.goto(`${url}/?${POSES[skin]}&height=${MATCH_HEIGHT}&bg=%23FFFFFF`, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__actors && window.__actors.main, null, { timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    /* the seek from ?t= commits on the next frame; two rAFs cover commit and paint */
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    await page.locator('#actor').screenshot({ type: 'png', path: render })
    compose(path.join(REFERENCE, `${skin}.png`), render, path.join(OUT, `${skin}.png`))
    await fs.rm(render)
    console.log(`wrote review/match/${skin}.png`)
  }
} finally {
  await browser.close()
  await server.close()
}

/* PIL does the compositing: it is already on the machine and the two
   resizes and one paste are not worth a browser round trip. */
function compose(reference, render, out) {
  const script = `
import sys
from PIL import Image
ref, ren, out, gap = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
b = Image.open(ren).convert('RGBA')
a = Image.open(ref).convert('RGBA')
a = a.resize((round(a.width * b.height / a.height), b.height), Image.LANCZOS)
canvas = Image.new('RGBA', (a.width + gap + b.width, b.height), (255, 255, 255, 255))
canvas.paste(a, (0, 0), a)
canvas.paste(b, (a.width + gap, 0), b)
canvas.convert('RGB').save(out, optimize=True)
`
  const r = spawnSync('python3', ['-c', script, reference, render, out, String(GAP)], { stdio: 'inherit' })
  if (r.status !== 0) fail(`python3 could not compose ${out}`)
}

async function startVite() {
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.ts'),
    logLevel: 'error',
    server: { host: '127.0.0.1', port: 5190, strictPort: false, hmr: false },
  })
  await server.listen()
  const { port } = server.httpServer.address()
  return { server, url: `http://127.0.0.1:${port}` }
}

function fail(msg) {
  console.error(msg)
  process.exit(1)
}
