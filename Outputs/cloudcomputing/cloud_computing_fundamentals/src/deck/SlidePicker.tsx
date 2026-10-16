import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { SlideDef } from './types'
import { setAutoplayPref, useAutoplayPref } from './autoplayPref'
import { InstantContext } from '@/motion/instant'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '@/design/tokens'

/*
  THUMBNAILS (`player.thumbnails`, Cloud Computing Fundamentals, 2026-10-15).

  Each card shows the slide itself: its own element, rendered live at 1280x720
  and scaled into the card, under InstantContext and outside any Stepper, so it
  is the slide's FINAL state with every build shown and no entrance playing. A
  thumbnail is therefore never stale: change a slide and its preview changes.

  Kept fast in three ways. A card mounts its slide only when it scrolls within
  a screen of the viewport (IntersectionObserver), mounting is queued a few per
  frame so opening the panel never renders 60 slides in one task, and a slide
  once mounted stays mounted while the panel is open. The card's ground is the
  slide paper colour while it waits, so there is no flash.
*/
const PER_FRAME = 3
const queue: (() => void)[] = []
let pumping = false
function pump() {
  pumping = true
  requestAnimationFrame(() => {
    for (let k = 0; k < PER_FRAME && queue.length; k++) queue.shift()!()
    if (queue.length) pump()
    else pumping = false
  })
}
function enqueue(fn: () => void) {
  queue.push(fn)
  if (!pumping) pump()
}

const THUMB_CSS = `.deck-thumb *, .deck-thumb *::before, .deck-thumb *::after { animation: none !important; transition: none !important; }`

function Thumb({ slide, scroller }: { slide: SlideDef; scroller: React.RefObject<HTMLDivElement | null> }) {
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width))
    ro.observe(el)
    let cancelled = false
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect()
          enqueue(() => !cancelled && setReady(true))
        }
      },
      { root: scroller.current, rootMargin: '100% 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      ro.disconnect()
      io.disconnect()
    }
  }, [scroller])
  return (
    <div ref={box} className="relative w-full overflow-hidden rounded-[10px] bg-[#f4f6fb]" style={{ aspectRatio: `${SLIDE_WIDTH} / ${SLIDE_HEIGHT}` }}>
      {ready && w > 0 && (
        <div
          aria-hidden
          inert
          className="deck-thumb pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${w / SLIDE_WIDTH})` }}
        >
          <InstantContext.Provider value={true}>{slide.element}</InstantContext.Provider>
        </div>
      )}
    </div>
  )
}

/**
 * JUMP TO A SLIDE, INSTEAD OF WALKING THERE ONE PRESS AT A TIME.
 *
 * WHY IT EXISTS
 *
 * `types.ts` has carried `label` since the first version, described as "for the
 * overview grid / navigation", and there was no overview grid. Meanwhile the decks
 * grew: session 4 is 79 slides. Answering a question about slide 12 while standing
 * on slide 60 meant 48 presses of the left arrow, in front of the room, with every
 * slide in between flashing past. The alternative an instructor actually used was
 * editing the URL hash, which means showing the room a URL bar.
 *
 * WHAT IT IS NOT: A THUMBNAIL GRID
 *
 * Rendering 79 real slides at thumbnail size means mounting 79 slides, and every
 * figure in this kit animates on mount and several register build steps. The
 * honest alternative to a fake thumbnail is the slide's own words, which is what
 * `label`, `section` and `id` already are. So this is a text index, grouped by
 * section, and it is fast because it renders text.
 *
 * WHY IT IS NEVER IN THE DOM UNLESS OPEN
 *
 * `qa.mjs`, `video-safe.mjs` and `align-check.mjs` measure static rectangles. A
 * panel parked at `opacity: 0` would be measured on every run: it covers the whole
 * stage, so it would be reported as covering the instructor-video area and as
 * content that scrolls, on all 79 slides. `Deck` mounts it only while it is open,
 * and the harnesses never open it, so they never see it.
 *
 * KEYBOARD, BECAUSE THE POINT IS TO BE FASTER THAN THE ARROW KEY
 *
 *   type            filter by label, section or id
 *   left / right    move the cursor one slide
 *   up / down       move the cursor one row, which is four slides
 *   Enter           go there
 *   Escape          leave without going anywhere
 *
 * The filter is an `<input>`, and `useKeyboardNav` already declines to act while
 * the target is one, but that is belt and braces: `Deck` disables deck navigation
 * outright while this is open, so the arrow keys mean "move the cursor" and
 * nothing else. Two things listening to the same arrow key is how a picker ends up
 * changing the slide behind itself.
 */

/** Four across. `up` and `down` move by this, so the two agree by construction. */
const COLS = 4

export function SlidePicker({
  slides,
  index,
  onPick,
  onClose,
  thumbnails = false,
}: {
  slides: SlideDef[]
  index: number
  onPick: (i: number) => void
  onClose: () => void
  thumbnails?: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const auto = useAutoplayPref()
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(index)
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  /* The slides that match, keeping their real deck index: a picker that renumbered
     its results would be a list of the wrong slide numbers. */
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const all = slides.map((s, i) => ({ s, i }))
    if (!needle) return all
    return all.filter(({ s, i }) =>
      `${i + 1} ${s.label ?? ''} ${s.section ?? ''} ${s.id}`.toLowerCase().includes(needle),
    )
  }, [slides, q])

  /* The cursor lives on a DECK index, so it has to be pulled back onto the filtered
     set whenever that set changes, or Enter jumps somewhere the list is not showing. */
  useEffect(() => {
    if (hits.length === 0) return
    if (!hits.some((h) => h.i === cursor)) setCursor(hits[0].i)
  }, [hits, cursor])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  useEffect(() => {
    const move = (by: number) => {
      const at = hits.findIndex((h) => h.i === cursor)
      if (at < 0) return
      const to = Math.min(Math.max(at + by, 0), hits.length - 1)
      setCursor(hits[to].i)
    }
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'Enter':
          e.preventDefault()
          onPick(cursor)
          break
        case 'ArrowRight':
          e.preventDefault()
          move(1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          move(-1)
          break
        case 'ArrowDown':
          e.preventDefault()
          move(COLS)
          break
        case 'ArrowUp':
          e.preventDefault()
          move(-COLS)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hits, cursor, onPick, onClose])

  /* Section headings, computed from the hits so a filtered view does not print the
     heading of a section it is no longer showing. */
  const groups: { section: string; items: { s: SlideDef; i: number }[] }[] = []
  for (const h of hits) {
    const section = h.s.section ?? ''
    const last = groups[groups.length - 1]
    if (last && last.section === section) last.items.push(h)
    else groups.push({ section, items: [h] })
  }

  return (
    <motion.div
      role="dialog"
      aria-label="Jump to a slide"
      className="absolute inset-0 z-50 flex flex-col bg-night/[0.975] backdrop-blur-sm"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex shrink-0 items-center gap-4 border-b border-white/10 px-8 py-5">
        <span className="font-heading text-[19px] font-bold text-white">Jump to a slide</span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by title, section or number"
          className="ml-2 w-[360px] rounded-pill border border-white/15 bg-white/10 px-4 py-2 font-body text-[14px] text-white placeholder:text-white/40 focus:border-white/35 focus:outline-none"
        />
        <span className="font-mono text-[12px] text-white/45">
          {hits.length} of {slides.length}
        </span>
        <span className="ml-auto font-mono text-[11.5px] text-white/40">
          arrows to move · enter to go · esc to close
        </span>
      </div>

      {thumbnails && <style>{THUMB_CSS}</style>}
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        {/*
          THE DECK'S AUTO-PLAY SETTING (pedagogy team, 2026-10-12): the one
          place it is set, as two cards drawn like the slide cards below. On,
          the slides the deck lists as auto-play play their steps when they
          open; Off, every slide waits for Next. It is kept per deck and takes
          effect on the slide on screen at once (`autoplayPref.ts`). A key
          press on a card stays on the card: Enter must not also jump to the
          cursor's slide. The block is sticky, so the option is in view
          however far down the list has scrolled to the cursor; on a phone
          held upright the cards are 74px wide, so the second line is dropped
          there (the slide cards truncate theirs) and ON / OFF say it alone.
        */}
        {/* a deck with no builds has nothing to auto-play: the setting goes with the thumbnails */}
        {!thumbnails && (
        <div role="group" aria-label="Auto-play" className="sticky top-0 z-10 -mx-8 -mt-6 mb-4 bg-night px-8 pb-4 pt-6">
          <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">Auto-play</p>
          <div className="grid grid-cols-4 gap-2.5">
            {([true, false] as const).map((v) => {
              const chosen = auto === v
              return (
                <button
                  key={v ? 'on' : 'off'}
                  type="button"
                  onClick={() => setAutoplayPref(v)}
                  onKeyDown={(e) => e.stopPropagation()}
                  aria-pressed={chosen}
                  className={`rounded-card border px-3.5 py-3 text-left transition-colors ${
                    chosen ? 'border-white/60 bg-white/15' : 'border-white/[0.12] bg-white/[0.055] hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[12px] font-bold text-white/50">{v ? 'ON' : 'OFF'}</span>
                    {chosen && (
                      <span className="rounded-pill bg-white/20 px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-white">
                        now
                      </span>
                    )}
                  </span>
                  <span className="mt-1 hidden whitespace-nowrap font-heading text-[13.5px] font-semibold text-white/90 sm:block">
                    {v ? 'Plays on opening' : 'Waits for Next'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        )}

        {hits.length === 0 && (
          <p className="font-body text-[15px] text-white/50">Nothing matches that.</p>
        )}

        {groups.map((g, gi) => (
          <div key={`${g.section}-${gi}`} className={gi ? 'mt-6' : ''}>
            {g.section && (
              <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                {g.section}
              </p>
            )}
            <div className="grid grid-cols-4 gap-2.5">
              {g.items.map(({ s, i }) => {
                const here = i === index
                const on = i === cursor
                return (
                  <div
                    /* a div, not a button: a thumbnail holds the slide's own buttons,
                       and a button may not contain a button */
                    role="button"
                    tabIndex={0}
                    key={s.id}
                    ref={on ? cursorRef : undefined}
                    onClick={() => onPick(i)}
                    onPointerEnter={() => setCursor(i)}
                    aria-current={here ? 'true' : undefined}
                    /*
                      THE CURRENT SLIDE AND THE CURSOR ARE DIFFERENT THINGS AND LOOK
                      DIFFERENT. One is where the deck is, the other is where the
                      keyboard is pointing, and a picker that conflates them leaves
                      the presenter unable to tell whether Enter will move anything.
                    */
                    className={`cursor-pointer rounded-card border px-3.5 py-3 text-left transition-colors ${
                      thumbnails && here ? 'ring-[3px] ring-[#2D63FB] ' : ''
                    }${
                      on
                        ? 'border-white/60 bg-white/15'
                        /* `/[0.12]` and NOT `/12`: 12 is off Tailwind's opacity
                           scale, so `border-white/12` emitted no rule at all and the
                           unselected card fell back to `currentColor` for its
                           border. Silent, and pre-dates the marker work. The sibling
                           `bg-white/[0.055]` was already written the correct way,
                           which is what made the inconsistency easy to miss. */
                        : 'border-white/[0.12] bg-white/[0.055] hover:bg-white/10'
                    }`}
                  >
                    {thumbnails && (
                      <span className="mb-2.5 block">
                        <Thumb slide={s} scroller={scroller} />
                      </span>
                    )}
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-[12px] font-bold text-white/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {here && (
                        <span className="rounded-pill bg-white/20 px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-white">
                          here
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block truncate font-heading text-[13.5px] font-semibold text-white/90">
                      {s.label ?? s.id}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
