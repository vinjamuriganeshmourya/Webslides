import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import type { ArrowMode } from './useKeyboardNav'

interface Props {
  index: number
  total: number
  step: number
  maxStep: number
  isFirst: boolean
  isLast: boolean
  isFullscreen: boolean
  next: () => void
  prev: () => void
  toggleFullscreen: () => void
  /** What the plain arrow keys currently do. */
  arrowMode: ArrowMode
  toggleArrowMode: () => void
  openPicker: () => void
  /** Play the current slide's entrance and build again from the top. */
  replay: () => void
  /** Whether the marker is currently open. */
  markerActive: boolean
  toggleMarker: () => void
  /** Whether THIS slide carries ink, drawn as a dot on the marker button. */
  hasInk: boolean
}

/**
 * ONE CONTROL BAR, BOTTOM LEFT.
 *
 * It was five separate floating chips: a counter, two arrows, a jump button, a
 * mode pill and a fullscreen button, each with its own background, its own ring
 * and its own hover. Five chips is not a design, it is five decisions that never
 * met, and at the width the cluster reached it read as debris along the bottom of
 * the slide rather than as the presenter's instrument.
 *
 * So it is one container now: one background, one ring, one blur, one radius, with
 * hairline dividers grouping what belongs together.
 *
 *   counter | back  forward  replay | jump  mode | marker | fullscreen
 *
 * WHY THE GROUPS ARE THOSE GROUPS
 *
 * The counter is a READOUT and never a control, so it sits alone and is not
 * pressable. Back and forward are the pair used every few seconds, and REPLAY
 * joins them because it is the third thing that moves you around inside the
 * material being taught rather than a setting: it is "show that again", which is
 * what a presenter reaches for in the same breath as "go back". Jump and mode are
 * both "change how I am moving", used occasionally and deliberately. MARKER is a
 * group of its own because it is the only control here that changes what the
 * POINTER does, and it is the only one that opens something. Fullscreen is set once
 * at the start of a session and never touched again, so it is last, furthest from
 * the keys that matter.
 *
 * THE MARKER BUTTON IS THE ONLY ONE WITH A STATE, and it carries it the way the
 * rest of this bar carries everything: a background tint and an ink colour, no
 * ring, no scale, nothing that moves a neighbour. It also shows a dot when the
 * CURRENT slide has ink on it while the marker is closed, because ink is kept per
 * slide and a presenter who left a diagram on slide 12 has no other way to know it
 * is still there before the room sees it.
 *
 * NOTHING CHANGES SIZE, EVER
 *
 * Two rules, and both were broken before:
 *
 *   1. **No hover geometry.** Every button changes only its ink and its own
 *      background tint. No scale, no padding shift, no ring that appears and
 *      pushes its neighbours along. A control that grows under the pointer moves
 *      the control next to it, which is how a presenter mis-clicks in front of a
 *      room. `transition-colors` and not `transition`, so a stray layout property
 *      can never be animated by accident.
 *   2. **Fixed widths for changing text.** The mode label swaps between "slide"
 *      and "step", which are different widths, so it lives in a fixed 40px box.
 *      The counter is `tabular-nums` in a fixed box for the same reason: "1 / 38"
 *      and "11 / 38" must not shuffle the buttons sideways as the deck advances.
 *
 * IT GETS OUT OF THE WAY UNTIL THE CURSOR COMES LOOKING FOR IT
 *
 * The bar is the presenter's instrument and the room has no use for it, so it
 * fades out once the pointer is anywhere but the bottom of the screen, and fades
 * back in when the pointer enters the bottom band. A projector then shows the
 * slide and nothing else for the 99% of a session when nobody is reaching for a
 * control.
 *
 * Three details make that safe rather than merely clever:
 *
 *   1. **It starts VISIBLE and hides on the first pointer move away from the
 *      band.** Hiding on load would make the control undiscoverable, and it also
 *      keeps every harness working unchanged: `qa.mjs`, `align-check.mjs` and
 *      `video-safe.mjs` never move a pointer, so they see the bar exactly where
 *      they always did, and `align-check`'s hardcoded chrome rectangle still means
 *      what it says.
 *   2. **Keyboard focus reveals it too**, through `focus-within`. A control that
 *      only a mouse can summon is not reachable by Tab, and this bar is the only
 *      pointer route to the slide picker.
 *   3. **A device with no fine pointer keeps it on screen.** No hover means no
 *      way to ask for it, and a deck opened on a tablet would have lost its
 *      controls entirely. Same gate `index.css` uses for the hover lift.
 *
 * The fade is a CSS transition, not framer: it is interrupted constantly as the
 * pointer crosses the boundary, and a transition retargets from wherever it is
 * while a keyframe or a JS tween restarts from zero. `opacity` and `transform`
 * only, so it costs no layout.
 *
 * Left, not right: the cluster and the NxtWave mark swapped corners. The mark is
 * the signature and sits bottom-right where the eye finishes; the controls are the
 * presenter's tools and sit out of the reading path.
 *
 * THE MODE LABEL IS A LABEL BEFORE IT IS A BUTTON. The arrow keys can mean either
 * "next slide" or "next build step", and the one thing worse than a fixed binding
 * is a binding the presenter cannot see. It states what the plain arrow does right
 * now, in the words of the thing it does, and pressing it swaps.
 */

/**
 * How far up from the bottom edge counts as reaching for the controls.
 *
 * 132px, which is a little under a fifth of the 720px stage: deep enough that the
 * bar is already there by the time the pointer arrives, shallow enough that
 * pointing at the bottom of a figure does not summon it. The bar itself is 40px
 * tall and sits 16px off the bottom, so the band clears it by 76px and the pointer
 * never crosses back out of the zone while travelling to a button.
 */
const REVEAL_BAND = 132

/**
 * Whether the pointer is in the bottom band.
 *
 * Starts TRUE, so the bar is on screen before anything has moved: a control nobody
 * knows about is worse than a control that is briefly in the way, and the
 * harnesses, which never move a pointer, keep measuring the deck they always
 * measured.
 */
function usePointerNearBottom(): boolean {
  const [near, setNear] = useState(true)
  useEffect(() => {
    /* No hover, no way to ask for the bar, so it simply stays. */
    if (typeof window.matchMedia === 'function') {
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
      if (!fine.matches) return
    }
    const onMove = (e: PointerEvent) => setNear(e.clientY >= window.innerHeight - REVEAL_BAND)
    /* `pointerleave` on the document: the pointer can leave the window from the
       top without a final move event inside the band, which would otherwise strand
       the bar on screen. */
    const onLeave = () => setNear(false)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return near
}

/** One hairline between groups. Never a full-height rule: that reads as a seam. */
function Divide() {
  return <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-muted/25" />
}

function Btn({
  label,
  onClick,
  disabled,
  wide = false,
  on = false,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  /** For the mode control, which carries a word rather than a glyph. */
  wide?: boolean
  /**
   * Latched on, for the marker. COLOUR ONLY, and that is a rule rather than a
   * style: a selected state drawn with a ring or a heavier border changes the
   * button's painted size, and every neighbour in a flex row then sits a pixel or
   * two off where the presenter last saw it.
   *
   * THE TINT IS `/10` AND NOT `/12`, AND THAT COST A DEBUGGING SESSION. Tailwind
   * generates an opacity modifier only for values on its opacity SCALE (0, 5, 10,
   * 20, 25, and up in fives). `bg-brand/12` is off the scale, so no rule is emitted
   * for it and the class silently does nothing: the marker button looked identical
   * whether the marker was open or closed, with no error anywhere. Off-scale values
   * have to be written as an arbitrary value, `bg-brand/[0.12]`. Reach for a scale
   * step unless the exact number matters.
   */
  on?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={on || undefined}
      onClick={onClick}
      disabled={disabled}
      /* FLEX AND NOT GRID. `place-items-center` on a grid puts two children in two
         ROWS, so the mode control came out with its arrow stacked above its word
         like a road sign. Flex is what "an icon beside a label" means. */
      className={`relative inline-flex h-8 shrink-0 items-center justify-center rounded-pill transition-colors disabled:pointer-events-none disabled:opacity-25 ${
        on
          ? 'bg-brand/10 text-brand hover:bg-brand/20'
          : 'text-muted hover:bg-muted/10 hover:text-ink'
      } ${wide ? 'gap-1.5 px-2.5' : 'w-8'}`}
    >
      {children}
    </button>
  )
}

export function DeckControls({
  index,
  total,
  step,
  maxStep,
  isFirst,
  isLast,
  isFullscreen,
  next,
  prev,
  toggleFullscreen,
  arrowMode,
  toggleArrowMode,
  openPicker,
  replay,
  markerActive,
  toggleMarker,
  hasInk,
}: Props) {
  const near = usePointerNearBottom()

  return (
    <div
      /* `focus-within:` twice over, so tabbing to a button brings the bar back even
         when the pointer is elsewhere. */
      className={`absolute bottom-4 left-5 z-30 flex items-center gap-0.5 rounded-pill bg-white/85 px-1.5 py-1 ring-1 ring-muted/20 backdrop-blur transition-[opacity,transform] duration-200 ease-out focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 ${
        near ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0'
      }`}
      /* The whole bar is one surface, so the shadow belongs to the bar and not to
         each thing inside it. */
      style={{ boxShadow: '0 6px 24px -12px rgba(0, 37, 75, 0.28)' }}
    >
      {/*
        THE READOUT. Not a button: the slide number is information, and making it
        pressable would put a fourth navigation gesture beside three that already
        work. `tabular-nums` so the digits do not shuffle the bar.

        11.5px, THE SAME SIZE AS EVERYTHING ELSE IN THE BAR, and it was 13.

        It was 13 because the counter used to be its own floating chip at
        `text-sm`, and when the chips became one bar its size was trimmed rather
        than re-decided. On a bar it was then the largest and heaviest thing in the
        control, which is a claim about importance that is exactly backwards: the
        ROOM never reads the slide number, and the presenter glances at it from a
        laptop between sentences. The things worth aiming for are the buttons.

        So the bar has one type size and the hierarchy comes from weight and
        colour: the current number in body ink at semibold, the total muted behind
        a slash. Nothing is emphasised by being bigger than its neighbours.
      */}
      <span className="select-none px-1.5 font-mono text-[11.5px] tabular-nums leading-none">
        {/*
          `style={{ color }}` AND NOT `text-body`, WHICH IS THE REAL ANSWER TO WHY
          THIS NUMBER WAS TOO BIG.

          `tailwind.config.ts` defines `body` in BOTH `colors` (#4A5B6B) and
          `fontSize` (19px). When a key exists in both, the fontSize utility wins
          and the colour one is shadowed, so `text-body` is a 19px TYPE STEP, not a
          colour. This span declared 11.5px on its parent and rendered at 19px,
          measured: `12 / 38 @ 11.5px` on the parent, `12 @ 19px` on this child.

          It is also what made the mode control expand on hover. `IconBtn` carried
          `hover:text-body`, so pointing at it set the label to 19px and the pill
          grew. The buttons now use `hover:text-ink`, and `ink` has no `fontSize`
          entry, so it is a colour and only a colour.

          The lesson generalises: in this repo `text-body`, `text-body-sm`,
          `text-code` and `text-kicker` are SIZES. For that grey, reach for the
          token.
        */}
        <span className="font-medium" style={{ color: colors.body }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-muted/70"> / {String(total).padStart(2, '0')}</span>
      </span>

      <Divide />

      <Btn label="Back" onClick={prev} disabled={isFirst && step === 0}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>

      <Btn label="Forward" onClick={next} disabled={isLast && step >= maxStep}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>

      {/* REPLAY. A circular arrow, which is the one glyph every product on a
          projector has already trained an instructor to read as "again". It is
          never disabled: replaying a slide with no build steps still replays its
          entrance, which is exactly what it says it does. */}
      <Btn label="Play this slide again from the top (R)" onClick={replay}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M20 11a8 8 0 10-2.3 5.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M20 4v7h-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Btn>

      <Divide />

      <Btn label="Jump to a slide (G)" onClick={openPicker}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M4 5h6v6H4zM14 5h6v6h-6zM4 13h6v6H4zM14 13h6v6h-6z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Btn>

      <Btn
        label={`Plain arrow keys currently move by ${
          arrowMode === 'slides' ? 'whole slides' : 'build steps'
        }. Press to swap. (S)`}
        onClick={toggleArrowMode}
        wide
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M5 12h13M13 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* FIXED BOX. "slide" and "step" are different widths and this label
            changes while the deck is up, so without it every button to its right
            steps sideways on the press. */}
        <span className="w-[40px] text-left font-mono text-[11.5px] font-semibold leading-none">
          {arrowMode === 'slides' ? 'slide' : 'step'}
        </span>
      </Btn>

      <Divide />

      <Btn
        label={`${markerActive ? 'Close' : 'Open'} the marker and draw on this slide (M)`}
        onClick={toggleMarker}
        on={markerActive}
      >
        {/* A pen nib pointing down-left, angled the way a hand holds one. */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1.5L5.5 15.5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14.5 5.5l3 3" strokeLinecap="round" />
        </svg>
        {/*
          THIS SLIDE HAS INK ON IT. Shown only while the marker is CLOSED: with the
          palette up the ink is on screen and the dot would be noise. Absolutely
          positioned, so it cannot change the button's size and shift the bar.
        */}
        {hasInk && !markerActive && (
          <span
            aria-hidden
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
            style={{ background: colors.danger }}
          />
        )}
      </Btn>

      <Divide />

      <Btn label="Toggle fullscreen" onClick={toggleFullscreen}>
        {isFullscreen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3v6H3M21 9h-6V3M15 21v-6h6M3 15h6v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Btn>
    </div>
  )
}
