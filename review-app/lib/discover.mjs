/**
 * WHAT IS THERE TO REVIEW — found by looking, never listed.
 *
 * The repo's own rule is that "a course is just a directory": nothing in
 * `slide-kit/` names a course, and a second course is a new sibling folder rather
 * than a fork. A review app with a hardcoded list of courses would be the first
 * thing in the repo to break that, and it would break it silently — a new course
 * would simply not be reviewable and nobody would know why.
 *
 * So a session is DEFINED here as "a directory containing `deck.config.json`", and
 * its course is whatever directory contains it. That is the same definition every
 * harness in the kit already relies on.
 *
 * VERSIONS are read off the folder name, because that is where this repo keeps
 * them: `deployement_session_1_v1`, `_v2`, `_v3` are three cuts of one session, and
 * a reviewer comparing v2 against v3 is the reason the app asks for a version at
 * all. A session with no `_vN` suffix is its own only version, reported as `—`
 * rather than being given a fake `v1`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

/** Directories that are never a course, whatever they contain. */
const SKIP = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist-single',
  'versions',
  'testing',
  'WebSlides_',
  'pptx_template',
  'sample_ppts',
  '.claude',
  '.agents',
])

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

const isDir = (p) => {
  try {
    return statSync(p).isDirectory()
  } catch {
    return false
  }
}

/**
 * Splits `deployement_session_1_v2` into `{ base, version }`.
 *
 * The base is what groups two cuts of the same session together in the picker, so
 * it has to survive both separators this repo has used — `_v2` and `-v2`.
 */
export function splitVersion(name) {
  const m = name.match(/^(.*?)[_-]v(\d+[a-z]?)$/i)
  return m ? { base: m[1], version: `v${m[2]}` } : { base: name, version: null }
}

/**
 * One session: where it is, what it is called, and what state its review is in.
 *
 * `built` and `builtAt` are reported rather than acted on. A reviewer opening a
 * session that has never been built should be told that a build is about to
 * happen, not left watching a blank iframe for forty seconds.
 */
function readSession(courseDir, name) {
  const dir = join(courseDir, name)
  const cfg = readJson(join(dir, 'deck.config.json'))
  if (!cfg) return null
  const built = join(dir, 'workflow', 'review', 'deck', 'index.html')
  const { base, version } = splitVersion(name)
  return {
    course: basename(courseDir),
    session: name,
    base,
    version,
    dir,
    name: cfg.name ?? name,
    title: cfg.title ?? name,
    htmlName: cfg.htmlName ?? name,
    slideCount: cfg.slideCount ?? null,
    devPort: cfg.devPort ?? null,
    built: existsSync(built),
    builtAt: existsSync(built) ? statSync(built).mtimeMs : null,
    /*
      The review file is named for the session FOLDER, not for `cfg.name`. Two
      cuts of one session sometimes carry the same `name` in their config — v2 and
      v3 of session 1 both say `deployement-session-1` — and keying the file on
      that would have them writing into each other's review, which is exactly the
      comparison the version picker exists to support.
    */
    reviewFile: join(courseDir, 'workflow', 'reviews', `${name}.review.md`),
  }
}

/** Every course, each with its sessions grouped by base name. */
export function discover(root) {
  const courses = []

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || SKIP.has(entry.name) || entry.name.startsWith('.')) continue
    const courseDir = join(root, entry.name)

    const sessions = readdirSync(courseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !SKIP.has(d.name) && !d.name.startsWith('.'))
      .map((d) => readSession(courseDir, d.name))
      .filter(Boolean)

    if (!sessions.length) continue

    /*
      Grouped, then sorted so the NEWEST cut of a session is first. A reviewer
      almost always wants the latest, and making them read a list to find it is
      how somebody ends up filing twenty comments against v1.
    */
    const groups = new Map()
    for (const s of sessions) {
      if (!groups.has(s.base)) groups.set(s.base, [])
      groups.get(s.base).push(s)
    }
    for (const list of groups.values()) {
      list.sort((a, b) => (b.version ?? '').localeCompare(a.version ?? '', undefined, { numeric: true }))
    }

    courses.push({
      course: entry.name,
      dir: courseDir,
      hasPlans: isDir(join(courseDir, 'session_plans')),
      groups: [...groups.entries()]
        .map(([base, cuts]) => ({ base, cuts }))
        .sort((a, b) => a.base.localeCompare(b.base, undefined, { numeric: true })),
      count: sessions.length,
    })
  }

  return courses.sort((a, b) => b.count - a.count)
}

/** One session by course + folder name, or null. Used to validate every request. */
export function findSession(root, course, session) {
  if (!course || !session) return null
  // Both arrive from the network. A name with a separator in it is a traversal
  // attempt, not a session.
  if (/[\\/]|\.\./.test(course) || /[\\/]|\.\./.test(session)) return null
  const courseDir = join(root, course)
  if (!isDir(courseDir)) return null
  return readSession(courseDir, session)
}
