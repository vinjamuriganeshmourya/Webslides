#!/usr/bin/env node
/**
 * deck-engine CLI — the one command for every session.
 *
 *   node deck.mjs new   <folder> "<Session Title>" "<Course>"   scaffold deck.json + images/
 *   node deck.mjs dev   <folder> [port]                         live preview while writing (default port 5290)
 *   node deck.mjs build <folder>                                the single HTML → <folder>/dist-single/<htmlName>.html
 *   node deck.mjs check <folder> [--quick]                      the rule checks on the built HTML
 *   node deck.mjs perf  <folder> [--quick]                      slow PCs and the other browser, on the built HTML
 *                                                               (perf-check.mjs, pristine-check.mjs, firefox-check.mjs)
 *   node deck.mjs validate <folder>                             deck.json against the format (also run by dev/build)
 *
 * <folder> is the session folder (e.g. Outputs/cloudcomputing/load_balancing_and_cdn), relative to where
 * you run it. Nothing is installed or copied per session: the engine is this folder.
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ENGINE = dirname(fileURLToPath(import.meta.url))
const [cmd, folderArg, ...rest] = process.argv.slice(2)
const die = (m) => {
  console.error(`deck: ${m}`)
  process.exit(1)
}
if (!cmd || !folderArg) die('usage: node deck.mjs new|dev|build|check|perf|validate <folder> …')
const DIR = resolve(process.cwd(), folderArg)

/* ── new ── */
if (cmd === 'new') {
  const [title, course = 'Cloud Computing'] = rest
  if (!title) die('new needs a session title')
  if (existsSync(resolve(DIR, 'deck.json'))) die(`${DIR}/deck.json already exists`)
  mkdirSync(resolve(DIR, 'images'), { recursive: true })
  const slug = basename(DIR).replace(/_/g, '-')
  const deck = {
    engine: 1,
    meta: { title, course, htmlName: slug, previous: { title: 'Previous Session', items: [] }, agenda: [], next: 'Next Session' },
    slides: [
      { id: 'S-WELCOME', layout: 'brand' },
      { id: 'S-TITLE', layout: 'title' },
      { id: 'S-RECAP', layout: 'recap' },
      { id: 'S-AGENDA', layout: 'agenda' },
      { id: 'S-QUIZ', layout: 'quiz' },
      { id: 'S-TAKEAWAYS', layout: 'takeaways' },
      { id: 'S-NEXT', layout: 'next', title: 'Next Session' },
      { id: 'S-THANKS', layout: 'thanks', title: 'Thank You' },
      { id: 'S-BEST', layout: 'thanks', title: 'All the Best' },
    ],
  }
  writeFileSync(resolve(DIR, 'deck.json'), JSON.stringify(deck, null, 2) + '\n')
  console.log(`created ${DIR}/deck.json (standard frames only: add the content slides between the agenda and the quiz)`)
  process.exit(0)
}

/* ── validate ── */
const NEED = {
  brand: [], title: [], recap: [], agenda: [], quiz: [], takeaways: [],
  breaker: ['index'], points: ['kicker', 'title', 'points'], lead: ['kicker', 'title', 'figure'], table: ['kicker', 'title', 'table'],
  screenshot: ['kicker', 'title', 'image'], analogy: ['kicker', 'title', 'everyday', 'concept'], steps: ['kicker', 'title', 'steps'],
  next: ['title'], thanks: ['title'], custom: ['component'],
}
async function validate() {
  const file = resolve(DIR, 'deck.json')
  if (!existsSync(file)) die(`no deck.json in ${DIR}`)
  let d
  try {
    d = JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    die(`deck.json is not valid JSON: ${e.message}`)
  }
  const errs = []
  if (d.engine !== 1) errs.push('engine must be 1')
  /* meta.labDeck: a practical session split off into its own deck (Welcome, the lab, Thank You): no agenda, no title frame */
  const lab = d.meta?.labDeck === true
  for (const k of lab ? ['title', 'course', 'htmlName'] : ['title', 'course', 'htmlName', 'agenda']) if (d.meta?.[k] === undefined) errs.push(`meta.${k} is missing`)
  const ids = new Set()
  ;(d.slides ?? []).forEach((s, i) => {
    const at = `slides[${i}] (${s.id ?? '?'})`
    if (!s.id) errs.push(`${at}: id is missing`)
    else if (ids.has(s.id)) errs.push(`${at}: duplicate id`)
    ids.add(s.id)
    const need = NEED[s.layout]
    if (!need) return errs.push(`${at}: unknown layout "${s.layout}"`)
    for (const k of need) if (s[k] === undefined) errs.push(`${at}: ${s.layout} needs "${k}"`)
    const imgs = JSON.stringify(s).match(/"(?:img:)?(?:\.\/)?(images\/[^"]+)"/g) ?? []
    for (const m of imgs) {
      const rel = m.replace(/^"(?:img:)?(?:\.\/)?/, '').replace(/"$/, '')
      if (!existsSync(resolve(DIR, rel))) errs.push(`${at}: missing image ${rel}`)
    }
  })
  /* every icon name resolves (a lucide export, a library render, or a session image) */
  /* lucide's export names, from its per-icon files (kebab-case, aliases included): `circle-check` → CircleCheck */
  const lucide = new Set(
    readdirSync(resolve(ENGINE, 'node_modules/lucide-react/dist/esm/icons'))
      .filter((f) => f.endsWith('.mjs'))
      .map((f) => f.replace(/\.mjs$/, '').split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')),
  )
  const libIcons = new Set(readdirSync(resolve(ENGINE, 'src/decks/figures/net/icons')).map((f) => f.replace(/\.png$/, '')))
  // "i3d:<name>" = the engine's 3D icon set (src/engine/icons3d.tsx, standing correction 17): names from its type union
  const i3dSrc = readFileSync(resolve(ENGINE, 'src/engine/icons3d.tsx'), 'utf8')
  const i3dUnion = i3dSrc.slice(i3dSrc.indexOf('export type Ico3DName ='), i3dSrc.indexOf('export type Badge'))
  const i3dIcons = new Set([...i3dUnion.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]))
  const scan = (v, at) => {
    if (Array.isArray(v)) return v.forEach((x) => scan(x, at))
    if (!v || typeof v !== 'object') return
    for (const [k, x] of Object.entries(v)) {
      const bad = (n) => (n.startsWith('lib:') ? !libIcons.has(n.slice(4)) : n.startsWith('i3d:') ? !i3dIcons.has(n.slice(4)) : !n.startsWith('img:') && !lucide.has(n))
      if (k === 'icon' && typeof x === 'string') {
        if (bad(x)) errs.push(`${at}: unknown icon "${x}"`)
      } else if (k === 'icons' && Array.isArray(x) && x.every((n) => typeof n === 'string')) {
        x.forEach((n) => bad(n) && errs.push(`${at}: unknown icon "${n}"`))
      } else scan(x, at)
    }
  }
  ;(d.slides ?? []).forEach((s, i) => scan(s, `slides[${i}] (${s.id})`))
  /* R9: the title frame right after the welcome frame */
  if (d.slides?.[0]?.layout !== 'brand' || (!lab && d.slides?.[1]?.layout !== 'title')) errs.push('R9: slide 1 must be the brand frame and slide 2 the title frame')
  if (errs.length) {
    console.error(`deck.json has ${errs.length} problem(s):\n  ` + errs.join('\n  '))
    process.exit(1)
  }
  return d
}
const deck = await validate()
if (cmd === 'validate') {
  console.log(`deck.json OK: ${deck.slides.length} slides`)
  process.exit(0)
}

/* the harnesses and the inline scripts read deck.config.json in the engine root: write it for this deck */
const port = Number(rest.find((r) => /^\d+$/.test(r)) ?? 5290)
writeFileSync(
  resolve(ENGINE, 'deck.config.json'),
  JSON.stringify({ name: basename(DIR), title: deck.meta.title, htmlName: deck.meta.htmlName, slideCount: deck.slides.length, devPort: port, deckDir: DIR }, null, 2) + '\n',
)
const env = { ...process.env, DECK: DIR }
const run = (c, a) => {
  const r = spawnSync(c, a, { cwd: ENGINE, env, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

if (cmd === 'dev') {
  if (!existsSync(resolve(DIR, 'slide-edits.ts'))) writeFileSync(resolve(DIR, 'slide-edits.ts'), `/** The presenter's text edits for this deck, written by the engine's dev server. */\nexport const SLIDE_EDITS: Record<string, Record<string, string>> = {}\n`)
  console.log(`deck: ${deck.meta.title} on http://localhost:${port}/  (slide N: #/N, final frames: ?still)`)
  run('npx', ['vite', '--port', String(port), '--strictPort'])
} else if (cmd === 'build') {
  run('npm', ['run', 'build:html'])
  const out = resolve(DIR, 'dist-single', `${deck.meta.htmlName}.html`)
  mkdirSync(dirname(out), { recursive: true })
  copyFileSync(resolve(ENGINE, 'dist-single', `${deck.meta.htmlName}.html`), out)
  /* the engine's own dist-single is scratch: the deliverable lives in the session folder only */
  rmSync(resolve(ENGINE, 'dist-single'), { recursive: true, force: true })
  console.log(`\n  built: ${out}`)
} else if (cmd === 'check') {
  const html = resolve(DIR, 'dist-single', `${deck.meta.htmlName}.html`)
  if (!existsSync(html)) die(`build first: ${html} is missing`)
  if (!existsSync(resolve(ENGINE, 'check-deck.mjs'))) die('check-deck.mjs is not in the engine yet')
  run('node', ['check-deck.mjs', html, ...rest.filter((r) => r.startsWith('--'))])
} else if (cmd === 'perf') {
  /* does it run on a slow PC, and in the other browser: load, every arrival and every idle slide under a throttled
     CPU, and the session's own code; the page the save buttons write; then the same file opened and walked in
     Firefox. All three run whatever the first one says: a slow slide must not hide a slide Firefox cannot show. */
  const html = resolve(DIR, 'dist-single', `${deck.meta.htmlName}.html`)
  if (!existsSync(html)) die(`build first: ${html} is missing`)
  const flags = rest.filter((r) => r.startsWith('--'))
  const went = [
    ['perf-check.mjs', html, `--source=${DIR}`, ...flags],
    ['pristine-check.mjs', html],
    ['firefox-check.mjs', html, ...flags.filter((f) => f.startsWith('--slides='))],
  ].map((a) => {
    console.log(`\n── ${a[0]} ──`)
    return spawnSync('node', a, { cwd: ENGINE, env, stdio: 'inherit' }).status
  })
  if (went.some((st) => st !== 0)) process.exit(1)
} else die(`unknown command ${cmd}`)
