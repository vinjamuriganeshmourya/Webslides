import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { Phone } from './Phone'
import { OutPanel, sentences } from './pieces'
import { CodePane } from './trace'
import { usePhase } from './tiles21'
import { SPEC } from './spec'

/**
 * HOOK H2: SCREEN TIME, THE LONG WAY. Four presses.
 *
 *   1  Teja's phone, its screen time page: a bar for each day, Mon to Sun,
 *      with the spec's minutes. `Which day did Teja use his phone the most?`
 *   2  A finger runs along the bars, left to right, keeping the tallest so
 *      far (movement inside the one press, played only going forward).
 *   3  The long way, written out: busiest_long.py and its output 210.
 *   4  The turn, one movement: the long program collapses into one line,
 *      busiest_short.py, and the output stays 210 (its must line).
 *
 * The screen time page wears a real phone's weekly bar chart, in the app's
 * own colours inside the phone. Both programs and their 210 are the spec's,
 * run on CPython.
 */
const H2 = SPEC.H2
export const DAYS: string[] = H2.data.days
export const MINUTES: number[] = H2.data.minutes
const LONG = H2.code[0]
const SHORT = H2.code[1]

/** The screen time app's own colours (the screen's palette, not brand tokens). */
export const APP = { bar: '#A9C6FB', top: '#2F6FEB', ink: '#1F2328', soft: '#6B7280', grid: '#EEF1F5' }

/**
 * The weekly bar chart. `scan` is the day the finger is on (-1 for none),
 * `best` the tallest so far; `found` lights the busiest day for good.
 */
export function ScreenBars({ scan = -1, best = -1, found = false, width = 196, height = 190, label }: { scan?: number; best?: number; found?: boolean; width?: number; height?: number; label?: ReactNode }) {
  const instant = useInstant()
  const max = Math.max(...MINUTES)
  const top = MINUTES.indexOf(max)
  const colW = width / DAYS.length
  const barW = Math.round(colW * 0.56)
  const chartH = height - 40
  return (
    <div className="relative" style={{ width, height }}>
      {label}
      {/* the finger, in its own lane above the bars */}
      {scan >= 0 && (
        <motion.span
          aria-hidden
          className="absolute top-0 text-[18px] leading-none"
          initial={false}
          animate={{ x: scan * colW + colW / 2 - 9 }}
          transition={instant ? { duration: 0 } : { duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
            <path d="M9 19 V7" stroke={APP.ink} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M3.5 12.5 L9 19 L14.5 12.5" fill="none" stroke={APP.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      )}
      <div className="absolute inset-x-0 flex items-end" style={{ top: 22, height: chartH - 22 }}>
        {MINUTES.map((m, i) => {
          const h = Math.round((m / max) * (chartH - 44))
          const lit = (found && i === top) || i === best
          const on = i === scan
          return (
            <div key={i} className="flex flex-col items-center justify-end" style={{ width: colW, height: '100%' }}>
              <span className="mb-1 font-mono text-[11px] font-bold" style={{ color: lit ? APP.top : APP.soft }}>
                {m}
              </span>
              <span className="block rounded-t-md" style={{ width: barW, height: h, background: lit ? APP.top : APP.bar, boxShadow: on ? `0 0 0 2px ${APP.ink}` : 'none', transition: instant ? 'none' : 'background-color 300ms, box-shadow 300ms' }} />
            </div>
          )
        })}
      </div>
      <div className="absolute inset-x-0 flex" style={{ top: chartH + 6 }}>
        {DAYS.map((d, i) => (
          <span key={d} className="text-center text-[11.5px] font-semibold" style={{ width: colW, color: (found && i === top) || i === best ? APP.top : APP.soft }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}

function ScreenTimePhone({ scan, best, found }: { scan: number; best: number; found: boolean }) {
  const total = MINUTES.reduce((a, b) => a + b, 0)
  return (
    <Phone width={232} height={404} island={null} top={{ bg: '#FFFFFF', light: false, header: null }}>
      <div className="flex h-full flex-col bg-white px-4 pt-1">
        <span className="text-[19px] font-bold" style={{ color: APP.ink }}>
          Screen time
        </span>
        <span className="mt-0.5 text-[12px] font-semibold" style={{ color: APP.soft }}>
          This week
        </span>
        <span className="mt-2 text-[26px] font-bold leading-none" style={{ color: APP.ink }}>
          {Math.floor(total / 60)}h {total % 60}m
        </span>
        <div className="mt-4 border-t pt-3" style={{ borderColor: APP.grid }}>
          <ScreenBars scan={scan} best={best} found={found} width={200} height={210} />
        </div>
      </div>
    </Phone>
  )
}

/** A box whose height follows its content with a tween, so a program can collapse in one movement. */
export function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number | undefined>(undefined)
  const instant = useInstant()
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    setH(el.offsetHeight)
    return () => ro.disconnect()
  }, [])
  return (
    <div style={{ height: h, overflow: 'hidden', transition: instant ? 'none' : 'height 720ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
      <div ref={inner}>{children}</div>
    </div>
  )
}

export function ScreenTimeHook() {
  const beat = useBeats(4)
  /* press 2: the finger visits each day in turn, then lifts */
  const scanPh = usePhase(beat, 2, [...DAYS.map(() => 520), 520])
  const scan = beat === 2 && scanPh >= 1 && scanPh <= DAYS.length ? scanPh - 1 : -1
  const best = scan >= 0 ? MINUTES.slice(0, scan + 1).indexOf(Math.max(...MINUTES.slice(0, scan + 1))) : -1
  const found = beat >= 3 || (beat === 2 && scanPh > DAYS.length)
  /* press 4: the middle lines dim, then the program collapses to its one line */
  const fold = usePhase(beat, 4, [80, 700])
  const short = beat === 4 && fold >= 2
  const prog = short ? SHORT : LONG
  const caption = beat === 1 ? [H2.show[0]] : beat === 2 ? [H2.show[1]] : beat === 3 ? [H2.show[2], H2.show[3]] : [H2.show[4]]
  return (
    <>
      <div className="flex items-start gap-10">
        <ScreenTimePhone scan={scan} best={best} found={found} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <BeatFade beatKey={beat}>
            <div className="flex flex-col gap-1.5">
              {caption.map((c, i) => (
                <p key={i} className="font-heading text-[23px] font-bold leading-snug" style={{ color: c.endsWith('?') ? colors.brandDark : colors.ink }}>
                  <Lines lines={sentences(c)} />
                </p>
              ))}
            </div>
          </BeatFade>
          {/* the output sits beside the program, not under it, so the long program and its output both end clear of Next and Autoplay */}
          <div className="flex items-start gap-4" style={{ opacity: beat >= 3 ? 1 : 0, transform: beat >= 3 ? 'none' : 'translateY(8px)', transition: 'opacity 480ms, transform 480ms' }}>
            <div className="w-[560px] shrink-0">
              <AutoHeight>
                <CodePane key={short ? 's' : 'l'} code={prog.src} mark={beat === 4 && fold === 1 ? [2, 3, 4, 5] : short ? [2] : undefined} fontSize={17} />
              </AutoHeight>
            </div>
            <div className="min-w-0 flex-1">
              <OutPanel lines={beat >= 3 ? [{ text: prog.output }] : []} minRows={1} fontSize={18} />
            </div>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
