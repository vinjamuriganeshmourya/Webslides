// Post-build step for the single-file bundle: drops the library icons this deck cannot show.
//
// THE PROBLEM (low-end pass, 2026-11-13). `src/decks/figures/net/fx.tsx` holds the 3D icon library as one map,
// name to image, filled by an eager glob, because an icon is asked for BY NAME at run time (`"lib:server-stack"`
// in deck.json, `<CvIcon name="laptop">` in a figure). A bundler cannot tell which names will be asked for, so it
// keeps all 43, and every deck carried the whole library as base64: 2.8 MB of a 9 MB file, read, kept in memory
// and scanned by the browser on every open. Cloud Provider Comparison shows one of them.
//
// WHICH ICONS STAY. The script the first build wrote is the one place that says which names can be asked for. An
// icon stays if its name appears ANYWHERE in that script outside the image data: as a string, as an object key,
// inside a `lib:` reference, in a line of slide copy. It also stays if the script holds a string that ends where
// the name could be finished by code (`"routing-"` keeps every `routing-*`), which is how a name gets assembled at
// run time. Too many kept is the safe direction and the only one this errs in.
//
// HOW THE REST ARE DROPPED: BY BUILDING AGAIN, NEVER BY EDITING THE FILE. The first version of this step found each
// unused icon's data URI in the built file and blanked every copy of it. A session's own picture can be the SAME
// FILE as a library icon under another name (Cloud Provider Comparison's `images/a-boy-laptop.png` is
// `build-boy-laptop.png`, byte for byte), so its data URI is the same string, and the slide that shows it lost its
// picture: an empty box where the boy sat, in a deck another session rebuilt that same hour. Nothing is matched by
// content any more. This step writes the list of names and runs the bundler a second time; in that pass the
// `deck-drop-icons` plugin (vite.singlefile.config.ts) answers the library map's OWN import of each listed icon
// with an empty module. A session image with the same bytes, or an engine file that imports an icon directly
// (`net/overview-school.tsx` does), is a different import and is not touched, by construction. It costs one more
// bundle, about four seconds.
//
// `check-deck.mjs` fails a deck that shows an image with nothing in it. `DECK_KEEP_ICONS=1` keeps the whole library.
//
// Run BEFORE inline-assets.mjs.
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const htmlPath = join(root, 'dist-single', 'index.html')
const dir = join(root, 'src/decks/figures/net/icons')
if (process.env.DECK_KEEP_ICONS === '1' || !existsSync(dir)) {
  console.log('prune-icons: skipped, the whole icon library is kept.')
  process.exit(0)
}
const html = readFileSync(htmlPath, 'utf8')
const names = readdirSync(dir)
  .filter((f) => f.endsWith('.png'))
  .map((f) => f.replace(/\.png$/, ''))

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/* the script as it will run, with every embedded file and the library map's own keys taken out: what is left is
   code and the deck's own strings */
const code = html.replace(/data:[a-z0-9/+.-]+;base64,[A-Za-z0-9+/=]+/gi, '').replace(/\.\/icons\/[\w-]+\.png/g, '')
/* the name standing on its own: not part of a longer word, a longer hyphenated name or a file path */
const named = (name) => new RegExp(`(?<![\\w./-])${esc(name)}(?![\\w-])`).test(code)
/* a string that stops at one of the name's hyphens, so code could finish it: "routing-" or `routing-${who}` */
const assembled = (name) => {
  for (let i = name.indexOf('-'); i >= 0; i = name.indexOf('-', i + 1)) {
    const head = esc(name.slice(0, i + 1))
    if (new RegExp(`(?<![\\w./-])${head}(?:["'\`]|\\$\\{)`).test(code)) return true
  }
  return false
}

const kept = names.filter((n) => named(n) || assembled(n))
const drop = names.filter((n) => !kept.includes(n))
if (!drop.length) {
  console.log(`prune-icons: the script names all ${names.length} library icons, nothing to drop.`)
  process.exit(0)
}

const before = html.length
const extra = (process.env.DECK_VITE_ARGS ?? '').split(' ').filter(Boolean)
const r = spawnSync('npx', ['vite', 'build', '-c', 'vite.singlefile.config.ts', ...extra], { cwd: root, env: { ...process.env, DECK_DROP_ICONS: drop.join(',') }, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' })
if (r.status !== 0) {
  /* the first build stands, whole library and all: a deck that is larger than it need be, never one that is broken */
  console.error(r.stdout.slice(-1500), r.stderr.slice(-1500))
  console.log('prune-icons: the second pass failed, the whole icon library is kept.')
  process.exit(0)
}
const after = readFileSync(htmlPath, 'utf8').length
console.log(`prune-icons: kept ${kept.length} of ${names.length} library icons the script names (${kept.join(', ') || 'none'}); dropped ${drop.length}, ${((before - after) / 1024 / 1024).toFixed(2)} MB.`)
