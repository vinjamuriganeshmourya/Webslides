import { useId, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { BeatFade } from './common'

/**
 * ANU AND THE COMPUTER, the two voices of PF 18.
 *
 * The reference deck teaches Unicode and the naming rules as a conversation:
 * Anu asks, the Computer answers, on eleven frames. Course rule R5b: a
 * character who states the constraint says it in a speech bubble, so the room
 * hears a person with a question rather than the deck narrating.
 *
 * Both are the reference's own drawings, rebuilt here with the kit's colours
 * (decision 4 of the plan): Anu's dress is the accent orange, her lanyard and
 * badge the brand's dark blue; the Computer's body is ink, its screen the
 * second surface, its face the brand's dark blue, its cheeks the info blue.
 * Anu's skin and hair keep natural colours, which no token carries.
 *
 * The Computer has three faces: `smile` (the default), `o` (surprised, while
 * it works something out) and `no` (it refuses a name: flat mouth, angry
 * brows, in the danger red).
 *
 * THE COMPUTER IN DEPTH (user, 2026-10-05: "turn the computer into a 3D
 * version of the same object", slide 10 onward). `look="3d"` keeps every
 * shape, colour and proportion of the flat drawing and adds only light: the
 * body lit from the top left and falling into shade at the bottom right, a
 * thin rim light along the bezel, a 6px slab under the body for thickness,
 * the screen set INTO the bezel with a shadow along its top edge and one soft
 * gleam across the glass, the stand's neck turned into a cylinder by a
 * left-to-right gradient, the base pill lit on top and dark below, and a
 * soft shadow on the ground. Every shade is a white or black overlay at low
 * opacity over the same token fill, so the colours stay the kit's. The
 * viewBox and the footprint are unchanged, so a 3D computer sits exactly
 * where the flat one sat. The default stays flat: slides 7 to 9 keep the
 * flat drawing until asked, as the brief said slide 10 onward.
 */

/* Natural colours for a drawn person. Not brand tokens, and not from the
   reference's UI palette: these are the illustration's own, like session 15's
   chat palette was the screen's own. */
const SKIN = '#C98B5E'
const SKIN_DARK = '#B27549'
const HAIR = '#2B1B14'
const COLLAR = '#FFE3C2'
const MOUTH = '#7A3E22'
const BLUSH = '#E07A5F'

export function Anu({ height = 180, className = '' }: { height?: number; className?: string }) {
  const width = (height * 220) / 300
  return (
    <svg width={width} height={height} viewBox="0 0 220 300" className={`shrink-0 ${className}`} aria-label="Anu" role="img">
      <ellipse cx="110" cy="84" rx="66" ry="72" fill={HAIR} />
      <circle cx="170" cy="56" r="25" fill={HAIR} />
      <path d="M22 300C22 206 58 172 110 168C162 172 198 206 198 300Z" fill={colors.accent} />
      <rect x="96" y="128" width="28" height="46" rx="10" fill={SKIN_DARK} />
      <path d="M92 170L110 198L128 170Z" fill={COLLAR} />
      <ellipse cx="59" cy="102" rx="9" ry="13" fill={SKIN_DARK} />
      <ellipse cx="161" cy="102" rx="9" ry="13" fill={SKIN_DARK} />
      <ellipse cx="110" cy="98" rx="51" ry="57" fill={SKIN} />
      <path d="M58 98C54 46 84 30 112 30C142 30 168 48 162 98C150 66 132 58 110 58C90 58 70 68 58 98Z" fill={HAIR} />
      <path d="M83 88q9 -6 18 0M119 88q9 -6 18 0" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="102" r="5.5" fill={HAIR} />
      <circle cx="128" cy="102" r="5.5" fill={HAIR} />
      <circle cx="80" cy="120" r="8" fill={BLUSH} opacity=".25" />
      <circle cx="140" cy="120" r="8" fill={BLUSH} opacity=".25" />
      <path d="M96 124Q110 137 124 124" stroke={MOUTH} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M84 172L110 240L136 172" stroke={colors.brandDark} strokeWidth="5" fill="none" />
      <rect x="80" y="236" width="60" height="58" rx="7" fill={colors.white} stroke={colors.line} strokeWidth="2" />
      <rect x="80" y="236" width="60" height="14" rx="4" fill={colors.brandDark} />
      <text x="110" y="281" fontSize="20" fontWeight="800" fill={colors.ink} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif">
        Anu
      </text>
    </svg>
  )
}

export type Mood = 'smile' | 'o' | 'no'

export type Look = 'flat' | '3d'

export function Computer({
  height = 150,
  mood = 'smile',
  look = 'flat',
  className = '',
}: {
  height?: number
  mood?: Mood
  /** `3d`: the same object with depth, lighting and shading. See the note above. */
  look?: Look
  className?: string
}) {
  const width = (height * 300) / 272
  /* Gradient ids are per instance: two computers on one page (a slide leaving
     and a slide arriving) must not share a <defs> entry. */
  const id = `pc${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const d3 = look === '3d'
  return (
    <svg width={width} height={height} viewBox="0 0 300 272" className={`shrink-0 ${className}`} aria-label="Computer" role="img">
      {d3 && (
        <defs>
          {/* the body, lit from the top left */}
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
          </linearGradient>
          {/* the screen, set into the bezel: shade under the top edge, a little lift at the foot */}
          <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity="0.16" />
            <stop offset="0.2" stopColor="#000000" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.14" />
          </linearGradient>
          {/* one gleam across the glass */}
          <linearGradient id={`${id}-gleam`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.04" />
          </linearGradient>
          {/* the neck, a cylinder: light down its left, shade down its right */}
          <linearGradient id={`${id}-neck`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28" />
            <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
          {/* the base pill, lit on top */}
          <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.26" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id={`${id}-ground`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000000" stopOpacity="0.2" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-glass`}>
            <rect x="16" y="16" width="268" height="166" rx="12" />
          </clipPath>
        </defs>
      )}
      {/* the ground shadow, inside the viewBox so nothing is clipped */}
      {d3 && <ellipse cx="150" cy="266" rx="96" ry="5.5" fill={`url(#${id}-ground)`} />}
      <path d="M126 212L174 212L186 258L114 258Z" fill={colors.muted} />
      {d3 && <path d="M126 212L174 212L186 258L114 258Z" fill={`url(#${id}-neck)`} />}
      <rect x="84" y="254" width="132" height="18" rx="9" fill={colors.body} />
      {d3 && <rect x="84" y="254" width="132" height="18" rx="9" fill={`url(#${id}-base)`} />}
      {/* the slab: the body's thickness, seen along its bottom edge */}
      {d3 && <rect x="0" y="6" width="300" height="216" rx="24" fill="#000000" opacity="0.45" />}
      <rect x="0" y="0" width="300" height="216" rx="24" fill={colors.ink} />
      {d3 && <rect x="0" y="0" width="300" height="216" rx="24" fill={`url(#${id}-body)`} />}
      {d3 && <rect x="0.75" y="0.75" width="298.5" height="214.5" rx="23.25" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" />}
      <rect x="16" y="16" width="268" height="166" rx="12" fill={colors.surface2} />
      {d3 && <rect x="16" y="16" width="268" height="166" rx="12" fill={`url(#${id}-screen)`} />}
      {d3 && <path d="M16 16H176L16 176Z" fill={`url(#${id}-gleam)`} clipPath={`url(#${id}-glass)`} />}
      <circle cx="150" cy="8" r="3" fill={colors.muted} />
      <text x="150" y="206" fontSize="16" fontWeight="700" fill={colors.muted} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif">
        Computer
      </text>
      {mood === 'no' ? (
        <>
          <rect x="104" y="62" width="20" height="30" rx="10" fill={colors.brandDark} />
          <rect x="176" y="62" width="20" height="30" rx="10" fill={colors.brandDark} />
          <path d="M98 44L128 54M202 44L172 54" stroke={colors.danger} strokeWidth="6" strokeLinecap="round" />
          <path d="M120 134L180 134" stroke={colors.danger} strokeWidth="7" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="104" y="56" width="20" height="34" rx="10" fill={colors.brandDark} />
          <rect x="176" y="56" width="20" height="34" rx="10" fill={colors.brandDark} />
          <circle cx="86" cy="118" r="11" fill={colors.info} opacity=".3" />
          <circle cx="214" cy="118" r="11" fill={colors.info} opacity=".3" />
          {mood === 'o' ? (
            <ellipse cx="150" cy="128" rx="14" ry="12" fill={colors.brandDark} />
          ) : (
            <path d="M116 118Q150 146 184 118" stroke={colors.brandDark} strokeWidth="7" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </svg>
  )
}

/* ----------------------------------------------------------------- bubble */

export type Tail = 'down' | 'left' | 'right'

/**
 * A speech bubble. `warm` is Anu's (accent), `cool` is the Computer's (brand).
 * The tail points at the speaker: down when the bubble sits over a head, left
 * or right when it sits beside one. `<b>` inside is the brand's dark blue, the
 * reference's own emphasis.
 */
export function Bubble({
  tone,
  tail,
  size = 18,
  width,
  beatKey,
  className = '',
  children,
}: {
  tone: 'warm' | 'cool'
  tail: Tail
  size?: number
  width?: number
  /** Re-enter on every change of line. */
  beatKey?: string | number
  className?: string
  children: ReactNode
}) {
  const ring = tone === 'warm' ? colors.accent : colors.brand
  const bg = tone === 'warm' ? '#FFF4EC' : colors.surface2
  /*
    THE TAIL IS A ROTATED SQUARE whose two bordered sides meet at the tip and
    whose fill covers the bubble's own border where it attaches, so the outline
    runs from the bubble into the tail without a break. It was pinned at
    `top: 26`, which suits a two-line bubble: on a ONE-line bubble (46px) the
    square's lower corner stood 6px proud of the bubble's bottom edge, a notch
    that read as a tail hanging off the box (user, 2026-10-05, PF 18 slide 10,
    steps 2 and 3). The side tail now sits at 26px from the top OR centred,
    whichever is higher up: centred on a short bubble, at the head on a tall
    one, and always inside the bubble's own height.
  */
  const tailStyle =
    tail === 'down'
      ? { left: '50%', bottom: -11, transform: 'translateX(-50%) rotate(45deg)' }
      : tail === 'left'
        ? { left: -11, top: 'min(26px, calc(50% - 10px))', transform: 'rotate(135deg)' }
        : { right: -11, top: 'min(26px, calc(50% - 10px))', transform: 'rotate(-45deg)' }
  const style = { background: bg, border: `2.5px solid ${ring}`, color: colors.ink, fontSize: size, width, '--b': colors.brandDark } as React.CSSProperties
  const box = (
    <div className={`relative rounded-2xl px-4 py-2.5 font-semibold leading-snug ${className}`} style={style}>
      <span aria-hidden className="absolute block h-5 w-5" style={{ ...tailStyle, background: bg, borderStyle: 'solid', borderColor: ring, borderWidth: '0 2.5px 2.5px 0' }} />
      <span className="relative block [&_b]:font-extrabold [&_b]:text-[var(--b)]">{children}</span>
    </div>
  )
  return beatKey !== undefined ? <BeatFade beatKey={beatKey}>{box}</BeatFade> : box
}

/**
 * THE BUBBLE SLOT OVER A SPEAKER, on slides 7 to 9, in px.
 *
 * The `over` layout stacks the bubble above the figure, and the slot it sits
 * in used to be a MINIMUM of 86px: a taller line pushed the figure down, so
 * the Computer stood at y 323 on one press, 335 on the next and 360 on the
 * third, and at a different height on each of the three slides (user,
 * 2026-10-05: "the computer moves between slides 7, 8 and 9"). A fixed slot,
 * sized for the tallest Computer line on those slides (three lines at 18px,
 * 123px, slide 7's "1 is 49 / * is 42 / A digit is a character too") plus a
 * little slack, holds every bubble without pushing anything: a short line
 * sits at the slot's foot, a tall one fills it, and the figure is at the
 * same y on every press of every slide. Both speakers take the same slot so
 * their heads stay level, which is how the two were aligned before.
 */
export const OVER_SLOT = 128

/**
 * Anu, or the Computer, with a line beside or over them. `say` empty draws
 * the character alone and keeps the space the bubble would take, so the
 * figure never shifts when a speaker falls silent.
 */
export function Speaker({
  who,
  say,
  mood,
  look,
  tail = 'side',
  slot,
  height,
  bubbleWidth = 236,
  size = 18,
  beatKey,
}: {
  who: 'anu' | 'computer'
  say?: ReactNode
  mood?: Mood
  /** The Computer's rendering: `3d` from slide 10 on. Ignored for Anu. */
  look?: Look
  /** `side`: bubble beside the head (Anu's to her right, the Computer's to its left). `over`: bubble above. */
  tail?: 'side' | 'over'
  /** `over` only: a FIXED height for the bubble's slot (see `OVER_SLOT`). Without it the slot is a minimum of 86px and a taller bubble pushes the figure down. */
  slot?: number
  height?: number
  bubbleWidth?: number
  size?: number
  beatKey?: string | number
}) {
  const anu = who === 'anu'
  const figure = anu ? <Anu height={height ?? 180} /> : <Computer height={height ?? 150} mood={mood} look={look} />
  const tone = anu ? 'warm' : 'cool'
  if (tail === 'over') {
    return (
      <div className="flex flex-col items-center gap-4" style={{ width: Math.max(bubbleWidth, 200) }}>
        <div className="flex items-end" style={slot ? { height: slot } : { minHeight: 86 }}>
          {say && <Bubble tone={tone} tail="down" size={size} width={bubbleWidth} beatKey={beatKey}>{say}</Bubble>}
        </div>
        {figure}
      </div>
    )
  }
  return (
    <div className={`flex items-start gap-4 ${anu ? '' : 'flex-row-reverse'}`}>
      {figure}
      <div className="pt-1" style={{ width: bubbleWidth }}>
        {say && <Bubble tone={tone} tail={anu ? 'left' : 'right'} size={size} beatKey={beatKey}>{say}</Bubble>}
      </div>
    </div>
  )
}
