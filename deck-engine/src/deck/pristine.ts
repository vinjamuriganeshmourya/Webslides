/**
 * THE PAGE AS IT WAS BUILT, kept for the Download button (presenter view,
 * Cloud Computing Fundamentals, 2026-10-22; session-local kit change).
 *
 * The student file is this same page with one `<script>` injected, so the
 * player needs the page's own source. A `file://` page cannot fetch itself,
 * and shipping a second copy inside the build would double a 5 MB deck, so
 * the page is put back together from its own DOM.
 *
 * This module has no imports and `main.tsx` imports it FIRST: module
 * evaluation runs in import order, and the deck file's module appends the
 * figure CSS and the clay filter defs to the document while it evaluates.
 * Taken any later, those would ride along into every student file and be
 * mounted twice when it opens. `outerHTML` drops the doctype, and without it
 * the student file would open in quirks mode, so it is put back.
 *
 * WHAT IS TAKEN HERE IS THE LIST OF NODES, NOT THE TEXT (low-end pass, 2026-11-13).
 * This used to read `document.documentElement.outerHTML` on every load: the
 * whole 10 MB page serialised into a string before the first slide could
 * mount (117 ms on a classroom PC, measured at a 6x slowdown), and that string
 * then held for as long as the deck was open, on the chance that somebody
 * pressed Download. Now the page's nodes are noted when it opens and the
 * string is made when it is asked for:
 *
 *   - the three big ones (the script, the font sheet, the stylesheet) are kept
 *     BY REFERENCE. Nothing in the player writes to them, and they are 99% of
 *     the page, so they cost nothing to keep and are read out on demand.
 *   - everything else (the title, the metas, the empty `#root`, the `<html>`
 *     and `<body>` tags with the attributes they had) is COPIED now, because
 *     the player does change those: it fills `#root`, adds a class to `<html>`
 *     on a harness URL, appends its own styles to the head.
 *
 * `window.__DECK_HTML__` is still a string to whoever reads it, and the same
 * string `outerHTML` gave: `pristine-check.mjs` parses the built file afresh
 * and compares the two character for character.
 */
declare global {
  interface Window {
    __DECK_HTML__?: string
  }
}

/** a node this heavy is kept by reference and read when asked for; lighter ones are copied at once */
const HEAVY = 20000

function note(n: Node): () => Node {
  if (n.nodeType === 1 && (n.textContent?.length ?? 0) > HEAVY && !(n as Element).firstElementChild) return () => n.cloneNode(true)
  const copy = n.cloneNode(true)
  return () => copy.cloneNode(true)
}

if (typeof document !== 'undefined' && !Object.getOwnPropertyDescriptor(window, '__DECK_HTML__')) {
  const html = document.documentElement
  const shell = html.cloneNode(false) as HTMLElement
  /* <html>'s own children are the head, the body and whatever the parser put between them */
  const parts = [...html.childNodes].map((child) => {
    if (child !== document.head && child !== document.body) return note(child)
    const tag = child.cloneNode(false)
    const kids = [...child.childNodes].map(note)
    return () => {
      const el = tag.cloneNode(false)
      for (const k of kids) el.appendChild(k())
      return el
    }
  })
  Object.defineProperty(window, '__DECK_HTML__', {
    configurable: true,
    get() {
      const out = shell.cloneNode(false) as HTMLElement
      for (const p of parts) out.appendChild(p())
      return '<!doctype html>\n' + out.outerHTML
    },
  })
}

export {}
