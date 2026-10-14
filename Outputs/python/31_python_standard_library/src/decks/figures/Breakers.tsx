import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SlideBase } from '@/ui/SlideBase'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Appear, sentences } from './pieces'
import { SPEC } from './spec'

/**
 * THE THREE MARKER CARDS: C4 `Math Module`, C9 `Random Module`, C12 `Map,
 * Filter & Reduce`. Each is the original deck's divider (slides 9, 16, 23: the
 * title alone on the frame) drawn as the spec's own card: the title arrives
 * the way the card says, and nothing else is on the card (their must lines).
 *
 *   C4   the sideways calculator's keys √, π and x! fly in and settle into
 *        the words
 *   C9   a Ludo dice rolls across the card and the words come out of it
 *   C12  the three Zomato moments shrink into three tiles that read the
 *        title; press 2 adds the deck's one line
 *
 * The night stage of the kit's section breaker, with no index numeral (the
 * spec's cards are not numbered chapters). Explanatory-tier timings; an
 * instant landing shows the end state.
 */
const EASE = [0.22, 1, 0.36, 1] as const

function Stage({ lesson, spec, presses, children }: { lesson: string; spec: string; presses: number; children: ReactNode }) {
  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="relative grid h-full place-items-center text-center" data-spec={spec} data-presses={presses}>
        {children}
      </div>
    </SlideBase>
  )
}

function Title({ children, delay }: { children: string; delay: number }) {
  const instant = useInstant()
  return (
    <motion.h2 className="font-heading text-[56px] font-extrabold leading-tight text-white" initial={instant ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.7, delay: instant ? 0 : delay, ease: EASE }}>
      {children}
    </motion.h2>
  )
}

/* ===================================================================== C4 */

const KEYS: { k: string; from: { x: number; y: number; r: number } }[] = [
  { k: '√', from: { x: -520, y: -180, r: -200 } },
  { k: 'π', from: { x: 40, y: -300, r: 160 } },
  { k: 'x!', from: { x: 540, y: -160, r: 220 } },
]

export function MathBreaker({ lesson }: { lesson: string }) {
  const instant = useInstant()
  const C4 = SPEC.C4
  return (
    <Stage lesson={lesson} spec="C4" presses={C4.press_count}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          {KEYS.map(({ k, from }, i) => (
            <motion.span
              key={k}
              className="inline-flex h-[64px] w-[64px] items-center justify-center rounded-full text-[26px] font-semibold text-white"
              style={{ background: '#333333', boxShadow: `0 0 0 2px ${colors.warning}, 0 0 22px ${colors.warning}88` }}
              initial={instant ? false : { x: from.x, y: from.y, rotate: from.r, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: instant ? 0 : 1.1, delay: instant ? 0 : 0.15 + i * 0.18, ease: EASE }}
            >
              {k}
            </motion.span>
          ))}
        </div>
        <Title delay={1.1}>{C4.show[0]}</Title>
      </div>
    </Stage>
  )
}

/* ===================================================================== C9 */

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
}

/** A Ludo dice: a rounded white cube face with its pips. */
export function Dice({ value, size = 56, ink = colors.ink, glow = false, className = '' }: { value: number; size?: number; ink?: string; glow?: boolean; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-label={`dice showing ${value}`}>
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#FFFFFF" stroke={glow ? colors.warning : '#D9DEE6'} strokeWidth={glow ? 6 : 3} />
      {(PIPS[value] ?? PIPS[1]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8.5" fill={ink} />
      ))}
    </svg>
  )
}

export function RandomBreaker({ lesson }: { lesson: string }) {
  const instant = useInstant()
  const C9 = SPEC.C9
  return (
    <Stage lesson={lesson} spec="C9" presses={C9.press_count}>
      <div className="flex flex-col items-center gap-6">
        <motion.div initial={instant ? false : { x: -620, rotate: -900, opacity: 0.6 }} animate={{ x: 0, rotate: 0, opacity: 1 }} transition={{ duration: instant ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}>
          <Dice value={6} size={84} ink={colors.danger} />
        </motion.div>
        <motion.div initial={instant ? false : { opacity: 0, scale: 0.6, y: -40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.8, delay: instant ? 0 : 1.3, ease: EASE }}>
          <h2 className="font-heading text-[56px] font-extrabold leading-tight text-white">{C9.show[0]}</h2>
        </motion.div>
      </div>
    </Stage>
  )
}

/* ==================================================================== C12 */

/** One of the three Zomato moments, small, and the tile it becomes. */
function MomentTile({ word, moment, delay }: { word: string; moment: ReactNode; delay: number }) {
  const instant = useInstant()
  return (
    <motion.div className="flex w-[232px] flex-col items-center gap-3 rounded-2xl px-4 pb-4 pt-5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' }} initial={instant ? false : { opacity: 0, scale: 1.28, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.9, delay: instant ? 0 : delay, ease: EASE }}>
      <div className="flex h-[70px] items-center justify-center">{moment}</div>
      <span className="font-mono text-[26px] font-bold text-white">{word}</span>
    </motion.div>
  )
}

/* the app's own colours, inside the tiles' small screens only (content rule 37) */
const RED = '#E23744'
const GREEN = '#24963F'

export function MapBreaker({ lesson }: { lesson: string }) {
  const C12 = SPEC.C12
  const beat = useBeats(2)
  const line: string = C12.show[1]
  return (
    <Stage lesson={lesson} spec="C12" presses={C12.press_count}>
      {/* the tiles start below the speaker box (x 913..1280, y 0..220): the column sits 80px under the stage's centre */}
      <div className="flex flex-col items-center gap-7" style={{ marginTop: 80 }}>
        <div className="flex items-stretch gap-5">
          <MomentTile
            word="map"
            delay={0.1}
            moment={
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-white/85">
                {[
                  ['Chicken biryani', '₹250 × 2', '₹500'],
                  ['Double ka meetha', '₹90 × 1', '₹90'],
                  ['Thums Up', '₹40 × 3', '₹120'],
                ].map(([n, q, a]) => (
                  <span key={n} className="flex w-[190px] items-center justify-between gap-2">
                    <span className="whitespace-nowrap">{n}</span>
                    <span className="whitespace-nowrap text-white/55">{q}</span>
                    <span className="whitespace-nowrap font-mono">{a}</span>
                  </span>
                ))}
              </div>
            }
          />
          <MomentTile
            word="filter"
            delay={0.3}
            moment={
              <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-white" style={{ background: RED }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden>
                  <path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.2l1.4-7L2 9.4l7-.8z" />
                </svg>
                Rating 4.0+
              </span>
            }
          />
          <MomentTile
            word="reduce"
            delay={0.5}
            moment={
              <div className="flex w-[190px] items-center justify-between rounded-lg bg-white px-3 py-2 text-[13px] font-bold" style={{ color: colors.ink }}>
                <span>Item total</span>
                <span className="font-mono" style={{ color: GREEN }}>
                  ₹710
                </span>
              </div>
            }
          />
        </div>
        <Title delay={0.9}>{C12.show[0]}</Title>
        <div style={{ minHeight: 40 }}>
          {beat >= 2 && (
            <Appear>
              <p className="max-w-[820px] text-[22px] font-semibold leading-snug text-white/85">
                <Lines lines={sentences(line)} />
              </p>
            </Appear>
          )}
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </Stage>
  )
}
