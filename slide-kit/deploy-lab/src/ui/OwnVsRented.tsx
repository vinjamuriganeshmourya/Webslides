import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from './figureTiming'
import { Rise, FadeIn, useFigureAnim, at, ease, type FigureAnim } from './figureMotion'
import { LaptopGlyph } from './CloudPicture'

/**
 * OwnVsRented — two small scenes for the two reasons your laptop cannot be
 * the server. Each sits inside a card above the card's own text.
 *
 *     scale   the laptop, then ten person dots that fit under it, then a
 *             second row of twenty that keeps coming and runs past its edge
 *             in grey. The room WATCHES the overflow.
 *     fails   the same laptop, then three plain glyphs in a row: the plug
 *             pulled, the lid closing, the wifi gone. As the third lands the
 *             screen goes from brand blue to grey.
 *
 * HOW IT MOVES
 *   Laptop `T.enter`. Dots arrive 60ms apart, deliberately faster than
 *   `T.stagger`, so the second row feels like a crowd; the whole run is capped
 *   at 1.3s. In `fails` the glyphs land at `T.stagger` and the screen dims over
 *   `T.accent`, which is one opacity fade on a blue screen over a grey one.
 */

export type OwnVsRentedState = 'scale' | 'fails'

const H = 130
const DOT = 10
const DOT_GAP = 3
const LAPTOP_W = 80

export function OwnVsRented({ state, width = 400, className = '' }: { state: OwnVsRentedState; width?: number; className?: string }) {
  const a = useFigureAnim()
  return (
    <div className={`relative ${className}`} style={{ width, height: H }}>
      {state === 'scale' ? <Scale a={a} /> : <Fails a={a} />}
    </div>
  )
}

function Scale({ a }: { a: FigureAnim }) {
  const tDots1 = at(1)
  const tDots2 = tDots1 + 10 * 0.06 + T.stagger
  const step2 = Math.min(0.06, (1.3 - tDots2) / 20)
  return (
    <>
      <Rise a={a} x={10} y={4} w={LAPTOP_W} delay={at(0)}>
        <LaptopGlyph w={LAPTOP_W} screen={colors.brand} />
      </Rise>

      <DotRow a={a} x={11} y={72} n={10} tone={colors.brand} start={tDots1} step={0.06} />
      <Rise a={a} x={11 + 10 * (DOT + DOT_GAP) + 10} y={70} w={80} delay={tDots1 + 10 * 0.06} duration={T.label}>
        <span className="text-[15px] font-semibold leading-5 text-ink">10 fit</span>
      </Rise>

      <DotRow a={a} x={11} y={92} n={20} tone={colors.muted} start={tDots2} step={step2} />
      <Rise a={a} x={11 + 20 * (DOT + DOT_GAP) + 10} y={90} w={120} delay={tDots2 + 20 * step2} duration={T.label}>
        <span className="text-[15px] font-semibold leading-5" style={{ color: colors.body }}>10,000 do not</span>
      </Rise>
    </>
  )
}

/** A row of person dots, each a head on a shoulder, arriving one after another. */
function DotRow({ a, x, y, n, tone, start, step }: { a: FigureAnim; x: number; y: number; n: number; tone: string; start: number; step: number }) {
  return (
    <div className="absolute flex" style={{ left: x, top: y, gap: DOT_GAP }}>
      {Array.from({ length: n }, (_, i) => (
        <motion.svg
          key={i}
          width={DOT}
          height={DOT + 3}
          viewBox="0 0 8 10"
          aria-hidden
          initial={a.instant ? false : { opacity: 0, transform: a.reduce ? 'translateY(0px)' : 'translateY(4px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: T.label, delay: start + i * step, ease }}
        >
          <circle cx="4" cy="2.6" r="2.4" fill={tone} />
          <path d="M0.5 10 a3.5 3.5 0 0 1 7 0 z" fill={tone} />
        </motion.svg>
      ))}
    </div>
  )
}

function Fails({ a }: { a: FigureAnim }) {
  const glyphs = [
    { label: 'power cut', draw: <Plug /> },
    { label: 'lid closed', draw: <Lid /> },
    { label: 'wifi gone', draw: <NoWifi /> },
  ]
  const tGlyph = (i: number) => at(1 + i)
  const tDim = tGlyph(2) + T.enter * 0.5
  return (
    <>
      {/* the grey screen under the blue one, so dimming is a fade */}
      <Rise a={a} x={10} y={30} w={LAPTOP_W} delay={at(0)}>
        <div className="relative">
          <LaptopGlyph w={LAPTOP_W} screen={colors.muted} />
          <motion.div
            className="absolute inset-0"
            initial={a.instant ? false : { opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: T.accent, delay: tDim, ease }}
          >
            <LaptopGlyph w={LAPTOP_W} screen={colors.brand} />
          </motion.div>
        </div>
      </Rise>

      {glyphs.map((g, i) => (
        <Rise key={g.label} a={a} x={116 + i * 80} y={26} w={76} delay={tGlyph(i)} className="text-center">
          <FadeIn a={a} delay={tGlyph(i)} className="mx-auto grid size-11 place-items-center rounded-xl bg-white shadow-card-soft" style={{ border: `2px solid ${colors.danger}` }}>
            {g.draw}
          </FadeIn>
          <div className="mt-1.5 text-[13px] font-semibold leading-4" style={{ color: colors.body }}>{g.label}</div>
        </Rise>
      ))}
    </>
  )
}

const G = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: colors.danger, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

/** A plug pulled from its socket. */
function Plug() {
  return (
    <svg {...G}>
      {/* the socket on the wall, the plug pulled clear of it */}
      <rect x="2" y="6" width="6" height="12" rx="1.5" />
      <path d="M12 9.5h4M12 14.5h4" />
      <rect x="16" y="6" width="6" height="12" rx="2" />
      <path d="M22 12h1" />
    </svg>
  )
}

/** A laptop lid tilting shut. */
function Lid() {
  return (
    <svg {...G}>
      {/* the base, the lid tilted half shut, an arrow pressing it down */}
      <path d="M2 19h20" />
      <path d="M4 19l3-8h11" />
      <path d="M19 3v5m-2.5-2.5L19 8l2.5-2.5" />
    </svg>
  )
}

/** A wifi mark with a slash. */
function NoWifi() {
  return (
    <svg {...G}>
      <path d="M2 9a15 15 0 0 1 20 0" />
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r="0.8" fill={colors.danger} />
      <path d="M4 4l16 16" />
    </svg>
  )
}
