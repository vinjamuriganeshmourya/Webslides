import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { Rise, FadeIn, FadeG, useFigureAnim, at, ease } from './figureMotion'
import { LaptopGlyph, ServerGlyph } from './CloudPicture'
import { KEY_FILE } from '../deckShared'

/**
 * LockAndKey — a key file on your laptop, and the lock it fits on the instance.
 *
 * WHAT IT ARGUES
 *   One sentence on the slide, so the drawing carries the rest: the key is a
 *   FILE on your laptop, the lock is ON the instance, and this session they are
 *   not joined yet. Two states, one geometry:
 *
 *     apart    a dotted line from the key to the keyhole, a chip on it
 *     fitted   the key travels along the line over `T.travel` and the
 *              keyhole's ring turns green. Session 10 uses it the moment the
 *              key pair is downloaded.
 *
 * HOW IT MOVES
 *   Laptop and box `T.enter` together; the file card one beat later; the key
 *   one more; the dotted line fades up over `T.draw`; the chip fades `T.label`
 *   after. Same server and laptop as `CloudPicture`, imported, never redrawn.
 */

export type LockAndKeyState = 'apart' | 'fitted'

const W = 440
const H = 240
const LAPTOP = { x: 16, y: 96, w: 150 }
const FILE = { x: 40, y: 40, w: 136, h: 110 }
const KEY = { size: 28 }
const BOX = { x: 300, y: 30, w: 120, h: 170 }
const HOLE = { cx: BOX.x + BOX.w / 2, cy: BOX.y + 118, r: 13 }
/** The key's start (on the card) and end (in the keyhole), as top-left corners. */
const KEY_FROM = { x: FILE.x + FILE.w - KEY.size - 8, y: FILE.y + FILE.h - KEY.size - 10 }
const KEY_TO = { x: HOLE.cx - HOLE.r - KEY.size + 6, y: HOLE.cy - KEY.size / 2 }
const LINE = { x1: KEY_FROM.x + KEY.size + 6, y1: KEY_FROM.y + KEY.size / 2, x2: HOLE.cx - HOLE.r - 8, y2: HOLE.cy }

export function LockAndKey({
  state,
  keyName = KEY_FILE,
  chip,
  className = '',
}: {
  state: LockAndKeyState
  keyName?: string
  chip?: string
  className?: string
}) {
  const a = useFigureAnim()
  const fitted = state === 'fitted'
  const chipText = chip ?? (fitted ? 'the key fits' : 'next session')

  const tCard = at(1)
  const tKey = at(2)
  const tLine = at(3)
  const tChip = tLine + T.draw
  const tTravel = tChip + T.stagger
  const tGreen = tTravel + T.travel

  const keyRest = fitted && !a.instant
    ? { transform: [`translate(0px, 0px)`, `translate(${KEY_TO.x - KEY_FROM.x}px, ${KEY_TO.y - KEY_FROM.y}px)`] }
    : { transform: fitted ? `translate(${KEY_TO.x - KEY_FROM.x}px, ${KEY_TO.y - KEY_FROM.y}px)` : 'translate(0px, 0px)' }

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* A dotted line cannot trace with `pathLength` (framer owns the dash
            array for that), so it fades up over the draw beat instead. */}
        <FadeG a={a} delay={tLine} duration={T.draw}>
          <line x1={LINE.x1} y1={LINE.y1} x2={LINE.x2} y2={LINE.y2} stroke={colors.brand} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 8" />
        </FadeG>
      </svg>

      {/* the laptop and its file */}
      <Rise a={a} x={LAPTOP.x} y={LAPTOP.y} w={LAPTOP.w} delay={at(0)}>
        <LaptopGlyph w={LAPTOP.w} screen={colors.brand} />
      </Rise>
      <Rise a={a} x={LAPTOP.x} y={LAPTOP.y + LAPTOP.w * 0.62 + 16} w={LAPTOP.w} delay={at(0) + T.stagger} className="text-center">
        <span className="text-body-sm font-bold leading-5 text-ink">your laptop</span>
      </Rise>

      <Rise a={a} x={FILE.x} y={FILE.y} w={FILE.w} delay={tCard}>
        <div className="relative rounded-xl bg-white p-2 shadow-card" style={{ height: FILE.h, border: `2px solid ${colors.brand}` }}>
          {/* the folded corner */}
          <span className="absolute right-0 top-0 size-4 rounded-bl-md" style={{ background: colors.surface2, borderLeft: `2px solid ${colors.brand}`, borderBottom: `2px solid ${colors.brand}`, borderTopRightRadius: 10 }} />
          <div className="mt-4 break-words font-mono text-[11px] font-semibold leading-4 text-ink">{keyName}</div>
          <div className="mt-1 text-[11px] leading-4" style={{ color: colors.body }}>a file</div>
        </div>
      </Rise>

      {/* the instance and its keyhole */}
      <Rise a={a} x={BOX.x} y={BOX.y} w={BOX.w} delay={at(0)}>
        <ServerGlyph title="instance" sub="in Mumbai" h={BOX.h} light="on" />
      </Rise>
      <div className="pointer-events-none absolute" style={{ left: HOLE.cx - HOLE.r - 4, top: HOLE.cy - HOLE.r - 4, width: (HOLE.r + 4) * 2, height: (HOLE.r + 4) * 2 }}>
        <FadeIn a={a} delay={at(0) + T.stagger} className="size-full">
          <Keyhole r={HOLE.r} tone={colors.ink} />
        </FadeIn>
        {fitted && (
          <FadeIn a={a} delay={tGreen} className="absolute inset-0" duration={T.accent}>
            <Keyhole r={HOLE.r} tone={colors.success} ring />
          </FadeIn>
        )}
      </div>
      <Rise a={a} x={BOX.x - 20} y={BOX.y + BOX.h + 12} w={BOX.w + 40} delay={at(0) + T.stagger} className="text-center">
        <span className="text-body-sm font-bold leading-5 text-ink">the instance</span>
      </Rise>

      {/* the key, which stays on the card in `apart` and travels in `fitted` */}
      <motion.div
        className="absolute"
        style={{ left: KEY_FROM.x, top: KEY_FROM.y, width: KEY.size, height: KEY.size }}
        initial={a.instant ? false : { opacity: 0, transform: 'translate(0px, 0px)' }}
        animate={{ opacity: 1, ...keyRest }}
        transition={{
          opacity: { duration: T.label, delay: tKey, ease },
          transform: fitted && !a.instant
            ? { duration: a.reduce ? 0.01 : T.travel, delay: tTravel, ease: c4(E.inOut) }
            : { duration: 0 },
        }}
      >
        <Key size={KEY.size} />
      </motion.div>

      {/* the chip, at its own x above the line's midpoint */}
      <Rise a={a} x={190} y={LINE.y1 - 44} w={110} delay={tChip} duration={T.label} className="text-center">
        <span className="inline-block rounded-pill bg-white px-3 text-xs font-semibold leading-5 shadow-card-soft" style={{ color: fitted ? colors.success : colors.brand, border: `1px solid ${fitted ? colors.success : colors.brand}` }}>
          {chipText}
        </span>
      </Rise>
    </div>
  )
}

/** A key: a round bow, a shaft, two teeth. */
function Key({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={colors.brand} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="14" r="5" fill={colors.white} />
      <path d="M13 14h13M22 14v4M18 14v3" />
    </svg>
  )
}

/** A keyhole: a ring, a round top and a slot. */
function Keyhole({ r, tone, ring = false }: { r: number; tone: string; ring?: boolean }) {
  const s = (r + 4) * 2
  const c = s / 2
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" aria-hidden>
      <circle cx={c} cy={c} r={r} fill={colors.white} stroke={tone} strokeWidth={ring ? 3 : 2.5} />
      <circle cx={c} cy={c - 3} r={3.2} fill={tone} />
      <path d={`M${c - 2.4} ${c - 1} l-1.2 7.5 h7.2 l-1.2 -7.5 z`} fill={tone} />
    </svg>
  )
}
