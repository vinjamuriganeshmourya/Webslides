/**
 * THE REVIEW APP. Independent of any one session.
 *
 *   node review-app/server.mjs [--port N] [--no-open]
 *
 * Run it once, from anywhere in the repo. It finds every course and every session
 * by looking for `deck.config.json`, asks which one you want (and which version,
 * where a session has more than one cut), then puts that deck in an iframe next to
 * a comment rail. Click any component on any slide, say what is wrong with it, and
 * the comment is written straight to
 *
 *   <course>/workflow/reviews/<session>.review.md
 *
 * which is the file Claude Code is then pointed at. No export step, nothing in
 * localStorage: the failure mode of a review tool is a page of feedback that never
 * reached disk.
 *
 * WHY IT IS OUTSIDE THE SESSIONS. A reviewer picks a course and a session before
 * there is a session folder to be inside of, and comparing v2 against v3 means
 * holding two of them at once. So the app is one server at the repo root, and the
 * only things that live in a session are the two pieces its own toolchain needs to
 * produce a reviewable build: `vite.review.config.ts` and
 * `review/markComponents.mjs`, both kit files, both synced by `sync-kit.mjs`.
 *
 * THE APP NEVER BUILDS A DECK ITSELF. It shells out to `npx vite build -c
 * vite.review.config.ts` with the session as the working directory, so each deck
 * is built by its own React, its own vite and its own `node_modules`. That is not
 * incidental: sessions deliberately do not share a package, precisely so a
 * signed-off deck keeps building unchanged years later. An app that built them
 * all with one shared toolchain would quietly undo that.
 *
 * HOW A COMMENT KNOWS WHAT IT IS ABOUT. Two halves, in the kit:
 *
 *   `review/markComponents.mjs` is a babel plugin, used only by the review build,
 *   that stamps `data-ui="CodeBlock"` and `data-ui-loc="src/ui/CodeBlock.tsx:84"`
 *   onto every DOM element. That is where the component name in a comment comes
 *   from — read off the running slide, not typed by the reviewer.
 *
 *   `Deck.tsx` publishes `window.__DECK__`, the slide ids in order. That is where
 *   slide identity comes from, which is why a comment filed on slide 14 survives a
 *   slide being inserted above it.
 *
 * WHAT IT IS NOT. Not a sign-off record — `workflow/reviews/*.reviews.json` still
 * holds that. Not a QA harness: `qa.mjs` and `align-check.mjs` find what is
 * measurably wrong, and this finds what a person thinks is wrong.
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { discover, findSession } from './lib/discover.mjs'
import { loadReview, saveReview, slideOf, newId, VERDICTS } from './lib/reviewFile.mjs'
import { renderReport } from './lib/report.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
/*
  Courses live under `Outputs/` in this checkout, not at the repo root. The kit
  stays at `ROOT/slide-kit`; only course discovery looks one level down. Falls
  back to the root so a checkout with courses at the top still works.
*/
const COURSES = existsSync(join(ROOT, 'Outputs')) ? join(ROOT, 'Outputs') : ROOT

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? fallback : argv[i + 1]
}

/*
  A PORT OF ITS OWN, not derived from any session's `devPort`. There is one app for
  the whole repo, and it must not collide with whichever deck someone has running
  in `npm run dev` next to it.
*/
const PORT = Number(opt('port', 5199))

/* ── per-session state, held only for the life of the process ─────────── */

/**
 * `course/session` → the slide order the running deck reported via
 * `window.__DECK__`.
 *
 * In memory only, and only so a save can write correct slide NUMBERS. The source
 * of truth for a review is always the file on disk: every mutation re-reads it,
 * applies one change, and writes it back. That is what makes it safe to have the
 * markdown open in an editor at the same time — the worst case is a lost edit to
 * one note, never a clobbered file.
 */
const deckOrders = new Map()

/** Slide ids in the order the file already lists them: the fallback for `order`. */
const orderFromFile = (model) =>
  Object.values(model.slides)
    .sort((a, b) => (a.n ?? 1e9) - (b.n ?? 1e9))
    .map((s) => ({ id: s.id, label: null }))

const key = (s) => `${s.course}/${s.session}`

const metaFor = (s, model) => ({
  title: s.title,
  session: s.session,
  deck: s.htmlName,
  course: s.course,
  reviewFile: s.reviewFile,
  // From `deck.config.json`, so the review file states the deck's real length even
  // when the order below is only the handful of slides anyone has commented on.
  total: s.slideCount ?? undefined,
  order: deckOrders.get(key(s)) ?? orderFromFile(model),
})

/** Load, mutate, write, hand back the fresh model. */
function mutate(s, apply) {
  const model = loadReview(s.reviewFile)
  apply(model)
  saveReview(s.reviewFile, model, metaFor(s, model))
  return model
}

/* ── the per-session review build ─────────────────────────────────────── */

const DECK_INDEX = (s) => join(s.dir, 'workflow', 'review', 'deck', 'index.html')

/** Newest mtime under a session's `src/`, so the app can say "this build is old". */
function newestSource(s) {
  const src = join(s.dir, 'src')
  if (!existsSync(src)) return 0
  let newest = 0
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else newest = Math.max(newest, statSync(abs).mtimeMs)
    }
  }
  walk(src)
  return newest
}

const builtAt = (s) => (existsSync(DECK_INDEX(s)) ? statSync(DECK_INDEX(s)).mtimeMs : 0)
const isStale = (s) => builtAt(s) < newestSource(s)

/** What a session needs before it can be reviewed at all. */
function buildReadiness(s) {
  const missing = ['vite.review.config.ts', join('review', 'markComponents.mjs')].filter(
    (rel) => !existsSync(join(s.dir, rel)),
  )
  const noModules = !existsSync(join(s.dir, 'node_modules'))
  return { missing, noModules, ready: !missing.length && !noModules }
}

/**
 * THE TWO FILES A SESSION NEEDS, COPIED IN ON REQUEST.
 *
 * Every session in this repo predates the review app, so none of them has
 * `vite.review.config.ts` or `review/markComponents.mjs` and none of them can be
 * built for review. The documented fix is `sync-kit.mjs --apply`, and that stays
 * the right answer when a session is genuinely behind on the kit.
 *
 * It is the wrong answer for THIS. `--apply` overwrites every kit-owned file in
 * the target — the whole of `src/deck`, `src/ui`, `src/slides` — which is a real
 * change to a signed-off deck, and asking somebody to accept it just to leave a
 * comment is asking them to accept it without reading it. So the app offers the
 * narrow version instead: copy the two files that are purely review tooling, and
 * ONLY when they are absent. Nothing existing is ever overwritten, which is what
 * makes this safe to click on a deck that shipped.
 */
const PREPARE_FILES = ['vite.review.config.ts', join('review', 'markComponents.mjs')]

function prepareSession(s) {
  const kit = join(ROOT, 'slide-kit', 'slide-template')
  const copied = []
  for (const rel of PREPARE_FILES) {
    const from = join(kit, rel)
    const to = join(s.dir, rel)
    if (existsSync(to)) continue
    if (!existsSync(from)) throw new Error(`the kit is missing ${rel} at ${from}`)
    mkdirSync(dirname(to), { recursive: true })
    copyFileSync(from, to)
    copied.push(rel)
  }
  return copied
}

/** One build per session at a time, and the log kept for the UI to show. */
const builds = new Map()

function buildDeck(s) {
  const k = key(s)
  if (builds.has(k)) return builds.get(k)

  const ready = buildReadiness(s)
  if (ready.missing.length) {
    return Promise.reject(
      new Error(
        `${s.session} is missing ${ready.missing.join(' and ')}. ` +
          `Sync the kit into it first:\n` +
          `  cd slide-kit/slide-template && node sync-kit.mjs --apply ../../${s.course}/${s.session}`,
      ),
    )
  }
  if (ready.noModules) {
    return Promise.reject(
      new Error(`${s.session} has no node_modules. Run \`npm install\` in ${s.course}/${s.session} first.`),
    )
  }

  const job = new Promise((done, fail) => {
    console.log(`  building ${s.course}/${s.session} …`)
    /*
      No `tsc -b` in front of it, unlike `build:html`. This build is never handed
      to anyone, so a type error should not stop a reviewer from looking at the
      slides — and `npm run typecheck` is a separate command they are not being
      asked to pass right now.
    */
    const child = spawn(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['vite', 'build', '-c', 'vite.review.config.ts'],
      { cwd: s.dir, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let log = ''
    const take = (chunk) => {
      log += chunk
      // Keep the tail only. A vite build of a 52-slide deck can print a lot, and
      // the useful part of a failure is always at the end.
      if (log.length > 12000) log = log.slice(-12000)
      process.stdout.write(chunk)
    }
    child.stdout.on('data', take)
    child.stderr.on('data', take)
    child.on('error', fail)
    child.on('exit', (code) =>
      code === 0 ? done({ log }) : fail(new Error(`vite build failed (exit ${code})\n\n${log.slice(-2500)}`)),
    )
  }).finally(() => builds.delete(k))

  builds.set(k, job)
  return job
}

/* ── http plumbing ────────────────────────────────────────────────────── */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
}

const json = (res, body, code = 200) => {
  res.writeHead(code, { 'content-type': MIME['.json'], 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

const html = (res, body) => {
  res.writeHead(200, { 'content-type': MIME['.html'], 'cache-control': 'no-store' })
  res.end(body)
}

const readBody = (req) =>
  new Promise((done) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      try {
        done(raw ? JSON.parse(raw) : {})
      } catch {
        done({})
      }
    })
  })

function serveStatic(res, root, rel) {
  /*
    `normalize` then a prefix check, because `rel` arrives from the network.
    Without it a request for `../../../.ssh/id_rsa` is served, and this process is
    running on somebody's laptop with their whole home directory readable.
  */
  const abs = normalize(join(root, decodeURIComponent(rel)))
  if (!abs.startsWith(root) || !existsSync(abs) || statSync(abs).isDirectory()) {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, {
    'content-type': MIME[extname(abs)] ?? 'application/octet-stream',
    // A deck is rebuilt in place while the app is open. A cached bundle is the
    // difference between reviewing the fix and reviewing what it replaced.
    'cache-control': 'no-store',
  })
  res.end(readFileSync(abs))
}

/**
 * The page shells, with their boot data injected.
 *
 * The data lands in a `<script type="application/json">` block, which the page
 * then parses, rather than being spliced into a `const BOOT = …` expression. Two
 * reasons, and the second is the one that bites:
 *
 * A page whose token has not been replaced still parses, so the file can be
 * opened, linted and read on its own.
 *
 * And `<` is escaped. A review note is arbitrary text typed by a person, and a
 * note containing `</script>` would otherwise close the block early and put the
 * rest of the review into the document as markup. Escaping it here means the
 * payload is data at every step, in a tool whose whole job is to carry somebody
 * else's words.
 */
const shell = (name, boot) =>
  readFileSync(join(HERE, 'ui', name), 'utf8').replace(
    '/*%BOOT%*/',
    JSON.stringify(boot).replace(/</g, '\\u003c'),
  )

/**
 * Every session-scoped route resolves its session the same way and refuses
 * politely if it cannot, rather than throwing a 500 that says nothing.
 */
function sessionFrom(url) {
  const course = url.searchParams.get('c')
  const session = url.searchParams.get('s')
  return findSession(COURSES, course, session)
}

const bootFor = (s, model) => ({
  course: s.course,
  session: s.session,
  base: s.base,
  version: s.version,
  title: s.title,
  slideCount: s.slideCount,
  reviewFile: s.reviewFile,
  reviewFileShort: join(s.course, 'workflow', 'reviews', basename(s.reviewFile)),
  deckBase: `/deck/${encodeURIComponent(s.course)}/${encodeURIComponent(s.session)}`,
  q: `?c=${encodeURIComponent(s.course)}&s=${encodeURIComponent(s.session)}`,
  built: s.built,
  stale: isStale(s),
  readiness: buildReadiness(s),
  model,
})

/* ── routes ───────────────────────────────────────────────────────────── */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname

  try {
    /* the picker */
    if (path === '/' || path === '/index.html') {
      html(res, shell('picker.html', { root: ROOT, courses: withReviewState(discover(COURSES)) }))
      return
    }

    if (path === '/api/courses') {
      json(res, { root: ROOT, courses: withReviewState(discover(COURSES)) })
      return
    }

    /* the review shell: /s/<course>/<session> */
    if (path.startsWith('/s/')) {
      const [, , course, session] = path.split('/')
      const s = findSession(COURSES, decodeURIComponent(course ?? ''), decodeURIComponent(session ?? ''))
      if (!s) {
        res.writeHead(404, { 'content-type': MIME['.html'] })
        res.end('<p>No such session. <a href="/">Back to the picker</a>.</p>')
        return
      }
      html(res, shell('review.html', bootFor(s, loadReview(s.reviewFile))))
      return
    }

    /* a session's built deck: /deck/<course>/<session>/... */
    if (path.startsWith('/deck/')) {
      const parts = path.split('/')
      const s = findSession(COURSES, decodeURIComponent(parts[2] ?? ''), decodeURIComponent(parts[3] ?? ''))
      if (!s) {
        res.writeHead(404).end('no such session')
        return
      }
      const rel = parts.slice(4).join('/') || 'index.html'
      serveStatic(res, join(s.dir, 'workflow', 'review', 'deck'), rel)
      return
    }

    /* ── api, all session-scoped by ?c= and ?s= ── */
    if (path.startsWith('/api/')) {
      const s = sessionFrom(url)
      if (!s) {
        json(res, { error: 'unknown course or session' }, 404)
        return
      }

      if (path === '/api/session') {
        json(res, bootFor(s, loadReview(s.reviewFile)))
        return
      }

      if (path === '/api/deck' && req.method === 'POST') {
        const b = await readBody(req)
        if (Array.isArray(b.slides) && b.slides.length) {
          deckOrders.set(
            key(s),
            b.slides.map((x) => ({ id: x.id, label: x.label ?? null })),
          )
        }
        json(res, { ok: true, slides: deckOrders.get(key(s))?.length ?? 0 })
        return
      }

      if (path === '/api/comment' && req.method === 'POST') {
        const b = await readBody(req)
        if (!b.slideId || !String(b.note ?? '').trim()) {
          json(res, { error: 'slideId and note are required' }, 400)
          return
        }
        const id = newId()
        const model = mutate(s, (m) => {
          const slide = slideOf(m, b.slideId)
          // Kept so the heading can say "Slide 9" on a deck that publishes no
          // manifest, where the app knows the number but the server cannot derive it.
          if (Number.isFinite(b.slideN)) slide.n = b.slideN
          slide.comments.push({
            id,
            status: 'open',
            component: b.component || 'slide',
            loc: b.loc || null,
            at: b.at && Number.isFinite(b.at.x) ? { x: b.at.x, y: b.at.y } : null,
            created: new Date().toISOString().slice(0, 10),
            note: String(b.note).trim(),
            quote: b.quote ? String(b.quote).slice(0, 120) : null,
          })
        })
        json(res, { model, id })
        return
      }

      if (path.startsWith('/api/comment/') && req.method === 'POST') {
        const id = decodeURIComponent(path.slice('/api/comment/'.length))
        const b = await readBody(req)
        const model = mutate(s, (m) => {
          for (const slide of Object.values(m.slides)) {
            const i = slide.comments.findIndex((c) => c.id === id)
            if (i === -1) continue
            if (b.delete) slide.comments.splice(i, 1)
            else {
              if (b.status) slide.comments[i].status = b.status
              if (typeof b.note === 'string') slide.comments[i].note = b.note.trim()
            }
            return
          }
        })
        json(res, { model })
        return
      }

      if (path === '/api/verdict' && req.method === 'POST') {
        const b = await readBody(req)
        if (!VERDICTS.includes(b.verdict)) {
          json(res, { error: `verdict must be one of ${VERDICTS.join(', ')}` }, 400)
          return
        }
        const model = mutate(s, (m) => {
          const slide = slideOf(m, b.slideId)
          if (Number.isFinite(b.slideN)) slide.n = b.slideN
          slide.verdict = b.verdict
        })
        json(res, { model })
        return
      }

      if (path === '/api/prepare' && req.method === 'POST') {
        const copied = prepareSession(s)
        const fresh = findSession(COURSES, s.course, s.session)
        json(res, { ok: true, copied, readiness: buildReadiness(fresh) })
        return
      }

      if (path === '/api/build' && req.method === 'POST') {
        await buildDeck(s)
        json(res, { ok: true, builtAt: builtAt(s), stale: isStale(s) })
        return
      }

      if (path === '/api/file') {
        res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
        res.end(existsSync(s.reviewFile) ? readFileSync(s.reviewFile, 'utf8') : '(no review yet)')
        return
      }

      /*
        THE RENDERED REPORT. `?download=1` only changes the disposition header, so
        the page somebody saves is byte-identical to the page they just looked at.
        The filename carries the session and the date, because a second file called
        `review.html` in a downloads folder is useless.
      */
      if (path === '/api/review.html') {
        const model = loadReview(s.reviewFile)
        const body = renderReport(model, metaFor(s, model), s.dir)
        const headers = { 'content-type': MIME['.html'], 'cache-control': 'no-store' }
        if (url.searchParams.get('download')) {
          const name = `${s.session}.review.${new Date().toISOString().slice(0, 10)}.html`
          headers['content-disposition'] = `attachment; filename="${name}"`
        }
        res.writeHead(200, headers)
        res.end(body)
        return
      }

      json(res, { error: `no such endpoint: ${path}` }, 404)
      return
    }

    res.writeHead(404).end('not found')
  } catch (err) {
    console.error(err)
    json(res, { error: String(err?.message ?? err) }, 500)
  }
})

/**
 * The picker shows how much review each session already carries, so a reviewer
 * can see at a glance which cut has been gone over and which has not. Counting
 * means parsing every review file, which is cheap — they are a few KB each and
 * there are a few dozen at most.
 */
function withReviewState(courses) {
  for (const course of courses) {
    for (const group of course.groups) {
      for (const cut of group.cuts) {
        const model = loadReview(cut.reviewFile)
        const slides = Object.values(model.slides)
        cut.review = {
          exists: existsSync(cut.reviewFile),
          open: slides.reduce((n, s) => n + s.comments.filter((c) => c.status === 'open').length, 0),
          done: slides.reduce((n, s) => n + s.comments.filter((c) => c.status !== 'open').length, 0),
          approved: slides.filter((s) => s.verdict === 'approved').length,
          changes: slides.filter((s) => s.verdict === 'changes-requested').length,
          touched: slides.length,
        }
        cut.readiness = buildReadiness(cut)
        cut.stale = cut.built ? isStale(cut) : false
      }
    }
  }
  return courses
}

/* ── start ────────────────────────────────────────────────────────────── */

const courses = discover(COURSES)
const sessionTotal = courses.reduce((n, c) => n + c.count, 0)

console.log('\n  Deck review')
console.log(`  repo    ${ROOT}`)
console.log(`  courses ${COURSES}`)
console.log(`  found   ${sessionTotal} sessions across ${courses.length} courses`)
for (const c of courses) console.log(`            ${c.course} (${c.count})`)

server.listen(PORT, () => {
  const at = `http://localhost:${PORT}`
  console.log(`\n  open ${at}\n`)
  if (!flag('no-open')) {
    const open =
      process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
    spawn(open, [at], { stdio: 'ignore', detached: true })
      .on('error', () => {})
      .unref()
  }
})
