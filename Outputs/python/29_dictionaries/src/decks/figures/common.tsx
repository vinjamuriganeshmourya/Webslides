import type { CSSProperties, ReactNode } from 'react'
import { SlideBase } from '@/ui/SlideBase'
import { ZonedFrame } from '@/ui/ZonedFrame'
import { colors, type Tone } from '@/design/tokens'
import { useTween } from '@/ui'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { easing } from '@/design/tokens'

/**
 * The pieces every PF 15 "String Methods" frame is drawn with.
 *
 * The reference draws a string the same way on every frame that teaches one:
 * a row of boxes, one character per box, the index under each box, a space
 * drawn as a grey dot so the room can count it. These are that row, and the
 * "you get" box a slice fills, and the two kinds of sentence the reference sets
 * under a figure (the narration, and the blue question handed to the room).
 *
 * Session-local on purpose: `slide-kit/sequence-lab/` owns the kit's version of
 * a character strip, and this file re-points at it when that lands.
 */

/* ------------------------------------------------------------------ Panel */

/**
 * A content frame whose body is one panel: the kit's zoned header, and the
 * body box in `top` mode so a figure that changes from beat to beat never
 * moves its top edge. `wide` takes Space-2 as well.
 */
export function Panel({
  kicker,
  title,
  lead,
  lesson,
  mode = 'top',
  wide = true,
  tone,
  spec,
  presses,
  children,
}: {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  lesson: string
  mode?: 'top' | 'center' | 'fill'
  wide?: boolean
  tone?: Tone
  /** The spec card this slide renders (`data-spec`), and its press count (`data-presses`), for the pedagogy team's review script. */
  spec?: string
  presses?: number
  children: ReactNode
}) {
  return (
    <SlideBase variant="light" lesson={lesson} padded={false}>
      <ZonedFrame kicker={kicker} title={title} lead={lead} mode={mode} wide={wide} tone={tone}>
        {spec ? (
          <div data-spec={spec} data-presses={presses}>
            {children}
          </div>
        ) : (
          children
        )}
      </ZonedFrame>
    </SlideBase>
  )
}

/* ------------------------------------------------------------------ Boxes */

/**
 * What one character box is doing.
 *
 *   plain    waiting
 *   hit      taken by the slice (blue)
 *   one      the single character `message[0]` hands back (green)
 *   skip     jumped over, never looked at (dashed, pink)
 *   never    the stop index, drawn and never reached (dashed, empty)
 *   ok, bad  a check that passed or failed (green tick, red cross)
 *   gone     taken off by strip (faded)
 *   stop     where strip stopped (green ring)
 */
export type BoxState = 'plain' | 'hit' | 'one' | 'skip' | 'never' | 'ok' | 'bad' | 'gone' | 'stop'

const SIZE = {
  xl: { w: 84, h: 94, font: 46, idx: 22, gap: 12 },
  lg: { w: 70, h: 80, font: 40, idx: 20, gap: 10 },
  md: { w: 56, h: 64, font: 30, idx: 17, gap: 8 },
  sm: { w: 46, h: 52, font: 24, idx: 16, gap: 7 },
} as const

export type BoxSize = keyof typeof SIZE

/** A space is drawn as a grey dot, the reference's own convention. */
export function glyph(c: string) {
  return c === ' ' ? '·' : c
}

export function Boxes({
  chars,
  states = {},
  size = 'lg',
  indices = true,
  marks = {},
  tags = {},
  frame,
  focus,
  className = '',
}: {
  chars: string[]
  states?: Record<number, BoxState>
  size?: BoxSize
  indices?: boolean
  /** Under a box: a tick, a cross, "never". */
  marks?: Record<number, ReactNode>
  /** Under the index: STAYS, REMOVED. */
  tags?: Record<number, ReactNode>
  /** A dashed frame drawn round a run of boxes, [first, last], inclusive. */
  frame?: [number, number]
  /** The box being read right now: a soft brand halo. No scale, which would make the glyph re-rasterise mid-tween. */
  focus?: number
  className?: string
}) {
  const s = SIZE[size]
  const tween = useTween(420)
  return (
    <div className={`relative flex items-start ${className}`} style={{ gap: s.gap }}>
      {frame && (
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-2xl"
          style={{
            left: frame[0] * (s.w + s.gap) - 7,
            width: (frame[1] - frame[0] + 1) * (s.w + s.gap) - s.gap + 14,
            top: -7,
            height: s.h + 14,
            border: `3px dashed ${colors.brandDark}`,
            transition: tween,
          }}
        />
      )}
      {chars.map((c, i) => {
        const st = states[i] ?? 'plain'
        const space = c === ' '
        const look: { bg: string; ring: string; ink: string; dash?: boolean; fade?: number } =
          st === 'hit'
            ? { bg: colors.surface2, ring: colors.brandDark, ink: colors.brandDark }
            : st === 'one' || st === 'ok' || st === 'stop'
              ? { bg: '#E9F8EF', ring: colors.success, ink: colors.ink }
              : st === 'bad'
                ? { bg: '#FDECEC', ring: colors.danger, ink: colors.danger }
                : st === 'skip'
                  ? { bg: 'transparent', ring: '#E8A0B4', ink: colors.muted, dash: true }
                  : st === 'never'
                    ? { bg: 'transparent', ring: colors.line, ink: 'transparent', dash: true }
                    : st === 'gone'
                      ? { bg: colors.surface, ring: colors.line, ink: colors.muted, fade: 0.28 }
                      : { bg: space ? colors.white : colors.surface, ring: colors.line, ink: colors.ink }
        const strong = st === 'hit' || st === 'one' || st === 'ok' || st === 'bad' || st === 'stop'
        const lit = focus === i
        return (
          <div key={i} className="flex flex-col items-center" style={{ width: s.w }}>
            <span
              className="grid place-items-center rounded-xl font-mono font-semibold"
              style={{
                width: s.w,
                height: s.h,
                fontSize: space ? s.font * 0.7 : s.font,
                background: look.bg,
                color: space && st === 'plain' ? colors.muted : look.ink,
                border: `${strong ? 3 : 2}px ${look.dash ? 'dashed' : 'solid'} ${look.ring}`,
                opacity: look.fade ?? 1,
                boxShadow: lit ? `0 0 0 4px ${colors.brand}33` : `0 0 0 0 ${colors.brand}00`,
                transition: tween,
              }}
            >
              {glyph(c)}
            </span>
            {indices && (
              <span className="mt-2 font-mono leading-none" style={{ fontSize: s.idx, color: colors.muted }}>
                {i}
              </span>
            )}
            {marks[i] !== undefined && (
              <span className="mt-1.5 whitespace-nowrap text-[16px] font-bold leading-none" style={{ color: st === 'bad' ? colors.danger : colors.success }}>
                {marks[i]}
              </span>
            )}
            {tags[i] !== undefined && <span className="mt-2">{tags[i]}</span>}
          </div>
        )
      })}
    </div>
  )
}

/** Width a row of `n` boxes takes, so a pointer or a label can be placed under box `i`. */
export function boxX(i: number, size: BoxSize = 'lg') {
  const s = SIZE[size]
  return i * (s.w + s.gap) + s.w / 2
}

export const BOX = SIZE

/* ------------------------------------------------------------------ you get */

/** "you get" and the box a slice fills. Dashed and empty until it has something. */
export function YouGet({ value, note, size = 44 }: { value: string; note?: ReactNode; size?: number }) {
  const tween = useTween(420)
  const has = value.length > 0
  return (
    <div className="flex items-center gap-5">
      <span className="text-[22px] font-semibold" style={{ color: colors.muted }}>you get</span>
      <span
        className="grid min-w-[180px] place-items-center rounded-2xl px-6 font-mono font-semibold tracking-[0.12em]"
        style={{
          height: size * 1.9,
          fontSize: size,
          color: colors.brandDark,
          background: has ? colors.surface2 : 'transparent',
          border: `3px ${has ? 'solid' : 'dashed'} ${has ? colors.brandDark : colors.line}`,
          transition: tween,
          whiteSpace: 'pre',
        }}
      >
        {value}
      </span>
      {note && <span className="text-[18px] font-semibold" style={{ color: colors.muted }}>{note}</span>}
    </div>
  )
}

/* ------------------------------------------------------------------ copy */

/**
 * Lines of copy, one sentence per line (content rule 36). A caption that held
 * two sentences in the reference is two lines here, in the same box.
 */
export function Lines({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={`block ${className}`}>
          {l}
        </span>
      ))}
    </>
  )
}

/**
 * The reference's numbered beat caption: a round badge with the beat number,
 * the sentence or two beside it. Re-enters on every beat.
 */
export function BeatCaption({ n, lines, size = 19 }: { n: number; lines: ReactNode[]; size?: number }) {
  return (
    <BeatFade beatKey={n} className="flex items-start gap-3 rounded-card bg-white px-4 py-2.5 shadow-card-soft ring-1 ring-line">
      <span
        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[14px] font-bold text-white"
        style={{ background: colors.warning }}
      >
        {n}
      </span>
      <span className="min-w-0 font-semibold leading-snug" style={{ fontSize: size, color: colors.ink }}>
        <Lines lines={lines} />
      </span>
    </BeatFade>
  )
}

/**
 * A lead centred over a centred figure. The kit's `ZonedFrame` lead is always
 * left-aligned, which reads as misaligned when everything under it sits on the
 * centre line (review, 2026-10-01, slides 8, 16 and 22). Same type as the kit's
 * lead, same 26px gap to the figure; only the alignment differs. Use it in
 * place of the `lead` prop, as the first child.
 */
export function CenteredLead({ children }: { children: ReactNode }) {
  return <p className="mx-auto mb-[26px] max-w-[816px] text-center text-body-lg text-body">{children}</p>
}

/** The narration the reference sets under a figure, one or two short lines. */
export function Narration({ lines, size = 23 }: { lines: ReactNode[]; size?: number }) {
  /* Regular weight: the narration is the quietest layer under a figure, below
     the expression and the "you get" box, so it must not compete with them. */
  return (
    <div className="leading-[1.35]" style={{ fontSize: size, color: colors.body }}>
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  )
}

/** The blue line: the question handed to the room, or the turn in a story. */
export function Ask({ children, size = 26 }: { children: ReactNode; size?: number }) {
  return (
    <p className="font-heading font-bold leading-snug" style={{ fontSize: size, color: colors.brandDark }}>
      {children}
    </p>
  )
}

/**
 * The definition band: the method's shape in mono, the sentence under it.
 * The reference's `str_var.isdigit()` card.
 */
export function Definition({ sig, children }: { sig: ReactNode; children: ReactNode }) {
  return (
    <div
      className="rounded-card px-6 py-3 [&_b]:font-bold [&_b]:text-ink"
      style={{ background: '#EAF3FF', boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}
    >
      <p className="font-mono text-[24px] font-bold leading-tight" style={{ color: colors.brandDark }}>{sig}</p>
      <p className="mt-1 text-[19px] leading-snug" style={{ color: colors.body }}>{children}</p>
    </div>
  )
}

/** A plain line of mono with Python colouring for a variable and a string. */
export function Assign({ name, value, size = 30 }: { name: string; value: string; size?: number }) {
  return (
    <p className="font-mono font-medium leading-tight" style={{ fontSize: size, color: colors.body }}>
      {name} = <span style={{ color: colors.success }}>"{value}"</span>
    </p>
  )
}

/** A small uppercase pill: STAYS, REMOVED, SAME. */
export function Tag({ children, tone = 'ok' }: { children: ReactNode; tone?: 'ok' | 'muted' }) {
  return (
    <span
      className="rounded-pill px-3 py-1 text-[16px] font-bold uppercase tracking-wider"
      style={tone === 'ok' ? { background: '#E3F6EA', color: '#137A3A' } : { background: colors.surface2, color: colors.muted }}
    >
      {children}
    </span>
  )
}

/**
 * A block that re-enters on every beat: `key` it by the beat. Explanatory-tier
 * timing (generate-slides 4b), and no motion at all during an instant jump.
 */
export function BeatFade({ beatKey, className = '', children }: { beatKey: string | number; className?: string; children: ReactNode }) {
  const instant = useInstant()
  return (
    <motion.div
      key={beatKey}
      className={className}
      initial={instant ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: easing.soft }}
    >
      {children}
    </motion.div>
  )
}

const GROUP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Copied from PF 24 (2026-10-08). ONE CLUSTER, ONE CONTAINER (PF 24's rule G3, user review 2026-10-08, with the
 * reference screenshot of an output panel and its piggy bank sitting in one
 * shared box). Things that belong to one concept, one worksheet or one
 * exercise sit in this: a near-white wash over the slide's tint, a soft 1px
 * rim, a long soft shadow and one padding, so they read as one group.
 * `active` is the same box lit in the brand tone, for the cluster the room is
 * working on now; it moves on the house curve.
 */
export function Group({ children, className = '', active, pad = 12, style }: { children: ReactNode; className?: string; active?: boolean; pad?: number; style?: CSSProperties }) {
  const instant = useInstant()
  /* only a group that can light carries a transition: a still group is a container, not a highlight (overlap-check rule 43) */
  const lights = active !== undefined
  /* PF 29: the rim and its lit ring are drawn on their own layer, never on the
     group's own box. overlap-check (rule 43) reads any element whose inline
     transition animates box-shadow and that wraps ONE child as a glow wrapper
     that must hug that child; a group holding one program is a container with
     padding, and the padding was reported as an oversized highlight. The
     layer has no children of its own and no inset shadow, so neither rule 43
     nor rule 47 reads it as anything. */
  return (
    <div
      data-group=""
      className={`relative rounded-[20px] ${className}`}
      style={{
        padding: pad,
        background: active ? 'rgba(232,240,255,0.92)' : 'rgba(255,255,255,0.62)',
        transition: !lights || instant ? undefined : `background-color 480ms ${GROUP_EASE}`,
        ...style,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          boxShadow: active
            ? `0 0 0 2px ${colors.brand}, 0 14px 30px -18px ${colors.brand}88`
            : `0 0 0 1px ${colors.line}, 0 12px 28px -20px rgba(16,32,58,0.24)`,
          transition: !lights || instant ? undefined : `box-shadow 480ms ${GROUP_EASE}`,
        }}
      />
      {children}
    </div>
  )
}

/**
 * A ring of light round a code panel, for the panel the room is reading now
 * (slide 3: the program whose output was just shown; slide 15: the program
 * being asked). The rim is drawn on the panel's own bounds (rule 43) and a
 * brand tint washes over the panel; both move together on the house curve,
 * in and out.
 */
export function Focus({ on, children, className = '' }: { on: boolean; children: ReactNode; className?: string }) {
  const instant = useInstant()
  const ease = instant ? 'none' : `520ms ${GROUP_EASE}`
  return (
    <div
      className={`relative rounded-card ${className}`}
      style={{
        boxShadow: on ? `0 0 0 3px ${colors.brand}, 0 12px 28px -12px ${colors.brand}aa` : `0 0 0 0 ${colors.brand}00, 0 0 0 0 ${colors.brand}00`,
        transition: instant ? 'none' : `box-shadow ${ease}`,
      }}
    >
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-card" style={{ background: on ? `${colors.brand}1F` : `${colors.brand}00`, transition: instant ? 'none' : `background-color ${ease}` }} />
    </div>
  )
}
