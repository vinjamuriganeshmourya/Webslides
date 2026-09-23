/**
 * THE REVIEW, RENDERED AS ONE SELF-CONTAINED HTML FILE.
 *
 * Served by `review.mjs` at `/api/review.html` and downloaded by the button in the
 * app's top bar. The markdown file stays the record — this is the thing you send
 * to somebody who is not going to open a repo: a reviewer signing off, an
 * instructor being told what changed, a lead who wants the count.
 *
 * SELF-CONTAINED for the same reason the decks are. No stylesheet, no font
 * request, thumbnails inlined as data URIs. It has to survive being attached to an
 * email and opened by double-click, which is the only way most of the people it is
 * written for will ever open it.
 *
 * THUMBNAILS ARE REUSED, NEVER CAPTURED HERE. `preview.mjs` already writes
 * `workflow/preview/thumbs/NN.jpg` on every verification sweep. If they are there
 * each slide's comments sit beside the slide they are about; if they are not, the
 * report renders without them rather than launching a browser. Rendering a report
 * must never be the thing that takes 90 seconds.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const LABEL = { open: 'open', done: 'done', 'wont-fix': 'wont fix' }

/**
 * @param model  the parsed review, from `reviewFile.mjs`
 * @param meta   `{ title, session, deck, course, order, reviewFile }`
 * @param root   the session directory, for finding `workflow/preview/thumbs`
 */
export function renderReport(model, meta, root) {
  const order = (meta.order ?? []).map((e) => (typeof e === 'string' ? { id: e } : e))
  const thumbDir = join(root, 'workflow', 'preview', 'thumbs')

  const thumb = (n) => {
    const file = join(thumbDir, `${String(n).padStart(2, '0')}.jpg`)
    if (!existsSync(file)) return null
    return `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`
  }

  const all = order
    .map((entry, i) => ({ n: i + 1, entry, rec: model.slides[entry.id] }))
    .filter(({ rec }) => rec && (rec.comments.length || rec.verdict !== 'pending'))

  const counts = { open: 0, done: 0, 'wont-fix': 0 }
  for (const s of Object.values(model.slides)) {
    for (const c of s.comments ?? []) counts[c.status] = (counts[c.status] ?? 0) + 1
  }
  const inDeck = new Set(order.map((e) => e.id))
  const approved = all.filter((s) => s.rec.verdict === 'approved').length
  const changes = all.filter((s) => s.rec.verdict === 'changes-requested').length

  const orphans = Object.values(model.slides).filter(
    (s) => !inDeck.has(s.id) && (s.comments?.length || s.verdict !== 'pending'),
  )

  const commentHtml = (c) => `
        <li class="c ${c.status}">
          <div class="c-head">
            <span class="pill ${c.status}">${LABEL[c.status] ?? c.status}</span>
            <b>${esc(c.component)}</b>
            ${c.loc ? `<code>${esc(c.loc)}</code>` : ''}
            ${c.at ? `<span class="at">@${c.at.x},${c.at.y}</span>` : ''}
            <span class="date">${esc(c.created)}</span>
          </div>
          <p>${esc(c.note).replace(/\n/g, '<br />')}</p>
          ${c.quote ? `<blockquote>"${esc(c.quote)}"</blockquote>` : ''}
        </li>`

  const slideHtml = ({ n, entry, rec }) => {
    const img = thumb(n)
    return `
      <section class="slide">
        <div class="s-head">
          <span class="num">${n}</span>
          <b>${esc(entry.id)}</b>
          ${entry.label ? `<span class="lab">${esc(entry.label)}</span>` : ''}
          ${
            rec.verdict !== 'pending'
              ? `<span class="verdict ${rec.verdict}">${esc(rec.verdict.replace(/-/g, ' '))}</span>`
              : ''
          }
        </div>
        <div class="s-body${img ? '' : ' no-shot'}">
          ${img ? `<img src="${img}" alt="Slide ${n}" />` : ''}
          <ul>${rec.comments.map(commentHtml).join('') || '<li class="none">No comments. Verdict only.</li>'}</ul>
        </div>
      </section>`
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Review · ${esc(meta.title)}</title>
<style>
  :root {
    --ground:#f4f7fd; --card:#fff; --ink:#0b1a2b; --muted:#55677e; --faint:#8496b3;
    --line:#dae4f5; --open:#c77700; --open-bg:#fff4e0; --done:#0f7a5f; --done-bg:#e4f7f0;
    --wont:#6b7a95; --wont-bg:#eef2f8; --changes:#c0392b; --changes-bg:#fdeceb;
    --approved:#0f7a5f; --approved-bg:#e4f7f0;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ground:#080f22; --card:#101a33; --ink:#e8eefc; --muted:#93a4c6; --faint:#6b7d9f;
      --line:#22314f; --open:#ffb020; --open-bg:#2e2306; --done:#2ed3a7; --done-bg:#06281f;
      --wont:#8b9ab5; --wont-bg:#182238; --changes:#ff7b7b; --changes-bg:#2e1010;
      --approved:#2ed3a7; --approved-bg:#06281f;
    }
  }
  * { box-sizing:border-box; }
  body {
    margin:0; padding:34px 22px 70px; background:var(--ground); color:var(--ink);
    font:15px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  }
  .wrap { max-width:1080px; margin:0 auto; }
  h1 { font-size:26px; letter-spacing:-.02em; margin:0 0 4px; }
  .sub { color:var(--muted); font-size:13.5px; margin-bottom:22px; }
  .sub code { background:var(--card); border:1px solid var(--line); border-radius:5px; padding:1px 6px; }
  .totals { display:flex; flex-wrap:wrap; gap:9px; margin-bottom:26px; }
  .tot {
    background:var(--card); border:1px solid var(--line); border-radius:10px;
    padding:9px 14px; min-width:104px;
  }
  .tot b { display:block; font-size:22px; letter-spacing:-.02em; }
  .tot span { color:var(--muted); font-size:12px; }
  section.slide {
    background:var(--card); border:1px solid var(--line); border-radius:12px;
    margin-bottom:14px; overflow:hidden;
  }
  .s-head {
    display:flex; align-items:center; gap:10px; padding:11px 14px;
    border-bottom:1px solid var(--line); flex-wrap:wrap;
  }
  .num {
    background:var(--ground); border:1px solid var(--line); border-radius:6px;
    min-width:30px; text-align:center; font-variant-numeric:tabular-nums;
    font-size:13px; color:var(--muted); padding:1px 5px;
  }
  .lab { color:var(--muted); font-size:13px; }
  .verdict { margin-left:auto; font-size:12px; font-weight:650; padding:2px 10px; border-radius:999px; }
  .verdict.approved { color:var(--approved); background:var(--approved-bg); }
  .verdict.changes-requested { color:var(--changes); background:var(--changes-bg); }
  .s-body { display:grid; grid-template-columns:340px 1fr; gap:16px; padding:14px; align-items:start; }
  .s-body.no-shot { grid-template-columns:1fr; }
  .s-body img { width:100%; border-radius:8px; border:1px solid var(--line); display:block; }
  ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:11px; }
  li.c { border-left:3px solid var(--line); padding-left:11px; }
  li.c.open { border-left-color:var(--open); }
  li.c.done { border-left-color:var(--done); }
  li.c.wont-fix { border-left-color:var(--wont); }
  li.none { color:var(--faint); font-size:13.5px; }
  .c-head { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:13px; }
  .pill { font-size:11px; font-weight:700; padding:1px 8px; border-radius:999px; text-transform:uppercase; letter-spacing:.03em; }
  .pill.open { color:var(--open); background:var(--open-bg); }
  .pill.done { color:var(--done); background:var(--done-bg); }
  .pill.wont-fix { color:var(--wont); background:var(--wont-bg); }
  code { font-family:ui-monospace,"JetBrains Mono",Menlo,monospace; font-size:12px; color:var(--muted); }
  .at, .date { color:var(--faint); font-size:12px; }
  .date { margin-left:auto; }
  li.c p { margin:4px 0 0; }
  blockquote {
    margin:6px 0 0; padding-left:10px; border-left:2px solid var(--line);
    color:var(--muted); font-size:13.5px;
  }
  .none-at-all { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:26px; text-align:center; color:var(--muted); }
  h2 { font-size:15px; margin:30px 0 10px; color:var(--muted); font-weight:650; }
  footer { margin-top:30px; color:var(--faint); font-size:12.5px; }
  @media print { body { background:#fff; padding:0; } section.slide { break-inside:avoid; } }
</style>
</head>
<body>
<div class="wrap">
  <h1>Review · ${esc(meta.title)}</h1>
  <div class="sub">
    <code>${esc(meta.session)}</code> · ${esc(meta.course ?? '')} ·
    ${order.length} slides · rendered ${new Date().toISOString().slice(0, 16).replace('T', ' ')}
    <br />record: <code>${esc(meta.reviewFile ?? '')}</code>
  </div>

  <div class="totals">
    <div class="tot"><b>${counts.open ?? 0}</b><span>open</span></div>
    <div class="tot"><b>${counts.done ?? 0}</b><span>done</span></div>
    <div class="tot"><b>${counts['wont-fix'] ?? 0}</b><span>wont fix</span></div>
    <div class="tot"><b>${approved}</b><span>slides approved</span></div>
    <div class="tot"><b>${changes}</b><span>changes requested</span></div>
    <div class="tot"><b>${all.length}</b><span>slides touched</span></div>
  </div>

  ${
    all.length || orphans.length
      ? all.map(slideHtml).join('')
      : '<div class="none-at-all">Nothing has been reviewed yet.</div>'
  }

  ${
    orphans.length
      ? `<h2>Not in the deck any more</h2>${orphans
          .map(
            (s) => `
      <section class="slide">
        <div class="s-head"><b>${esc(s.id)}</b></div>
        <div class="s-body no-shot"><ul>${(s.comments ?? []).map(commentHtml).join('')}</ul></div>
      </section>`,
          )
          .join('')}`
      : ''
  }

  <footer>
    Rendered by the review app (<code>node review.mjs</code>) from
    <code>${esc(meta.reviewFile ?? '')}</code>. The markdown file is the record;
    this page is a copy of it, frozen at the time above.
  </footer>
</div>
</body>
</html>
`
}
