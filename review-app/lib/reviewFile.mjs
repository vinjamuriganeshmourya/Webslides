/**
 * THE REVIEW FILE — read, written and re-written by `review.mjs`.
 *
 * One markdown file per session, at
 *
 *   <course>/workflow/reviews/<session>.review.md
 *
 * beside the sign-off JSON that already lives there. Markdown rather than JSON
 * because of who the two readers are: Claude Code is asked to act on this file,
 * and a reviewer is asked to trust it. A blob of nested arrays is worse at both
 * than a list of sentences under a heading.
 *
 * WHAT THE FORMAT HAS TO SURVIVE, and how each part earns its place:
 *
 *   A HAND EDIT. Note text is plain prose on indented lines, so a reviewer can
 *   open the file and reword a comment without the app losing it.
 *
 *   A DECK THAT MOVED. Slides are keyed by their `SlideDef.id`, never by their
 *   number, because the number changes the moment a slide is inserted above. The
 *   number is written into the heading for a human to navigate by, and is
 *   REFRESHED from the live deck on every save. A review written against a
 *   45-slide cut still lands on the right slides at 52.
 *
 *   AN EDIT FROM EITHER SIDE. Each comment carries a short id in an HTML comment,
 *   invisible when the markdown is rendered. That is what lets the app resolve or
 *   delete the comment a reviewer clicked rather than the third one down.
 *
 * The file is rewritten whole on every change. It is a few KB, and the
 * alternative — patching lines in place — is how a review file ends up half in
 * one format and half in another.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/** `[ ]` open, `[x]` done, `[~]` deliberately not doing. */
export const STATUSES = { ' ': 'open', x: 'done', '~': 'wont-fix' }
const MARKS = { open: ' ', done: 'x', 'wont-fix': '~' }

/** Slide-level verdicts. `pending` is the absence of a verdict, so it is not written. */
export const VERDICTS = ['pending', 'approved', 'changes-requested']

const today = () => new Date().toISOString().slice(0, 10)
const stamp = () => new Date().toISOString().slice(0, 16).replace('T', ' ')

/** Short, and collision-resistant enough for a few hundred comments in one file. */
export const newId = () =>
  Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 4)

/* ── parse ────────────────────────────────────────────────────────────── */

const SLIDE_RE = /^## Slide (\d+)(?: · (.+?))?\s*$/
const VERDICT_RE = /^Verdict: (.+?)\s*$/
const COMMENT_RE =
  /^- \[([ x~])\] \*\*(.+?)\*\*(?: · `([^`]+)`)?(?: · @(\d+),(\d+))?(?:\s*<!--c:([a-z0-9]+)(?:@([\d-]+))?-->)?\s*$/
const BODY_RE = /^ {6}(.*)$/
const QUOTE_RE = /^> "(.*)"$/

/**
 * Reads the file into `{ slides: { [slideId]: slide } }`.
 *
 * Anything it does not recognise is DROPPED rather than guessed at, and that is
 * survivable only because this pair of functions is symmetric: the app rewrites
 * the file from this model, so a line the parser cannot read is deleted on the
 * next save. The grammar is therefore kept small, and every part of it is written
 * by `serializeReview` below. Change one, change the other.
 */
export function parseReview(text) {
  const slides = {}
  let slide = null
  let comment = null

  for (const raw of text.split('\n')) {
    const slideM = raw.match(SLIDE_RE)
    if (slideM) {
      const id = slideM[2] ?? `#${slideM[1]}`
      slide = { id, n: Number(slideM[1]), verdict: 'pending', comments: [] }
      slides[id] = slide
      comment = null
      continue
    }

    // A `### id` heading under "Not in the deck any more" — same record, no number.
    const orphanM = raw.match(/^### (.+?)\s*$/)
    if (orphanM) {
      const id = orphanM[1]
      slide = slides[id] ?? { id, n: null, verdict: 'pending', comments: [] }
      slides[id] = slide
      comment = null
      continue
    }

    if (!slide) continue

    const verdictM = raw.match(VERDICT_RE)
    if (verdictM) {
      const v = verdictM[1].trim().replace(/\s+/g, '-')
      if (VERDICTS.includes(v)) slide.verdict = v
      comment = null
      continue
    }

    const commentM = raw.match(COMMENT_RE)
    if (commentM) {
      const [, mark, component, loc, x, y, id, created] = commentM
      comment = {
        id: id ?? newId(),
        status: STATUSES[mark],
        component,
        loc: loc ?? null,
        at: x != null ? { x: Number(x), y: Number(y) } : null,
        created: created ?? today(),
        note: '',
        quote: null,
      }
      slide.comments.push(comment)
      continue
    }

    const bodyM = raw.match(BODY_RE)
    if (bodyM && comment) {
      const line = bodyM[1]
      const quoteM = line.trim().match(QUOTE_RE)
      if (quoteM) comment.quote = quoteM[1]
      else if (line.trim()) comment.note = comment.note ? `${comment.note}\n${line.trim()}` : line.trim()
      continue
    }

    if (!raw.trim()) comment = null
  }

  return { slides }
}

/* ── serialize ────────────────────────────────────────────────────────── */

/**
 * `meta` is the LIVE deck: `{ title, session, deck, order }`, where `order` is the
 * slide ids in their current order. Slides are written in that order with numbers
 * taken from it, which is what keeps the file true after the deck is re-cut.
 *
 * A slide in the review that is no longer in the deck is not thrown away — a
 * comment is often the reason the slide went. It goes to a trailing section,
 * plainly labelled, so nobody hunts for slide 31 in a 28-slide deck.
 */
export function serializeReview(model, meta) {
  const order = (meta.order ?? []).map((e) => (typeof e === 'string' ? { id: e } : e))
  /*
    THE DECK'S LENGTH IS TOLD TO US, not counted from `order`.

    `order` is the full deck only when the running deck published a manifest. On a
    session whose kit predates that, the app can only report the slides the
    reviewer has actually visited, and counting those would print "1 open comment,
    out of 1" under a 52-slide deck. `meta.total` comes from `deck.config.json`,
    which is right in both cases.
  */
  const total = meta.total ?? order.length
  const seen = new Set()
  const out = []

  out.push(`# Review · ${meta.title}`)
  out.push('')
  out.push(`- session: \`${meta.session}\``)
  out.push(`- deck: \`${meta.deck}\``)
  out.push(`- slides: ${total}`)
  out.push(`- updated: ${stamp()}`)
  out.push('')
  out.push('Written by the review app: `node review-app/server.mjs` at the repo root.')
  out.push('Reword a note freely; leave the `<!--c:id-->` markers alone, they are how')
  out.push('the app finds the comment you clicked.')
  out.push('')
  out.push('Status: `[ ]` open · `[x]` done · `[~]` wont fix')
  out.push('')

  const open = countOpen(model)
  out.push(
    open
      ? `**${open} open comment${open === 1 ? '' : 's'}.** ${summary(model, order, total)}`
      : `**No open comments.** ${summary(model, order, total)}`,
  )

  order.forEach((entry, i) => {
    seen.add(entry.id)
    const slide = model.slides[entry.id]
    // A slide nobody has said anything about is not written at all. A file with
    // 52 empty headings buries the eight that carry a comment.
    if (!slide || (!slide.comments.length && slide.verdict === 'pending')) return
    out.push('')
    /*
      The number is the position in the live deck when we have one, and otherwise
      whatever the app last saw for this slide. Writing `i + 1` unconditionally
      numbered a comment on slide 9 as "Slide 1" purely because it was the first
      slide anybody had commented on.
    */
    out.push(`## Slide ${entry.n ?? slide.n ?? i + 1} · ${entry.id}`)
    if (entry.label) out.push(`<!-- ${entry.label} -->`)
    out.push('')
    if (slide.verdict !== 'pending') {
      out.push(`Verdict: ${slide.verdict.replace(/-/g, ' ')}`)
      out.push('')
    }
    for (const c of slide.comments) out.push(...commentLines(c))
  })

  const orphans = Object.values(model.slides).filter(
    (s) => !seen.has(s.id) && (s.comments.length || s.verdict !== 'pending'),
  )
  if (orphans.length) {
    out.push('')
    out.push('## Not in the deck any more')
    out.push('')
    out.push('These slide ids carry comments but are no longer in the deck. Kept')
    out.push('because a comment is often why the slide went.')
    for (const s of orphans) {
      out.push('')
      out.push(`### ${s.id}`)
      out.push('')
      for (const c of s.comments) out.push(...commentLines(c))
    }
  }

  out.push('')
  return out.join('\n')
}

function commentLines(c) {
  const bits = [`- [${MARKS[c.status] ?? ' '}] **${c.component}**`]
  if (c.loc) bits.push(`\`${c.loc}\``)
  if (c.at) bits.push(`@${Math.round(c.at.x)},${Math.round(c.at.y)}`)
  const lines = [`${bits.join(' · ')} <!--c:${c.id}@${c.created}-->`]
  for (const line of String(c.note ?? '').split('\n')) {
    if (line.trim()) lines.push(`      ${line.trim()}`)
  }
  if (c.quote) lines.push(`      > "${String(c.quote).replace(/"/g, "'")}"`)
  return lines
}

const countOpen = (model) =>
  Object.values(model.slides).reduce(
    (n, s) => n + s.comments.filter((c) => c.status === 'open').length,
    0,
  )

function summary(model, order, total) {
  const ids = new Set(order.map((e) => e.id))
  const vals = Object.values(model.slides).filter((s) => ids.has(s.id))
  const approved = vals.filter((s) => s.verdict === 'approved').length
  const changes = vals.filter((s) => s.verdict === 'changes-requested').length
  return `${approved} slide${approved === 1 ? '' : 's'} approved, ${changes} with changes requested, out of ${total}.`
}

/* ── disk ─────────────────────────────────────────────────────────────── */

export function loadReview(path) {
  if (!existsSync(path)) return { slides: {} }
  return parseReview(readFileSync(path, 'utf8'))
}

export function saveReview(path, model, meta) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, serializeReview(model, meta))
  return path
}

/** The slide record, created on first mention. */
export function slideOf(model, id) {
  model.slides[id] ??= { id, verdict: 'pending', comments: [] }
  model.slides[id].comments ??= []
  return model.slides[id]
}
