import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * RANGE DIAL — a MACHINE the room sets, predicts, and then checks.
 *
 * WHY IT IS NOT A SLIDESHOW. The first cut drove three fixed beats off the
 * deck's step counter: `start` and `stop` were read-only cards, and every beat
 * arrived with the number line already lit. The room was watching an answer, not
 * making one, and it got exactly one prediction out of the frame because the
 * second and third beats revealed themselves the moment the presenter clicked
 * on. The reference gives both bounds real `-` and `+` steppers and hides the
 * numbers behind a button, and CHANGING EITHER BOUND HIDES THEM AGAIN, so every
 * setting is predicted before it is shown. That gate is the figure.
 *
 * THE LABELS SIT UNDER THE TILES THEY NAME. `start` under the start tile,
 * `stop` under the stop tile, each in its own element under its own tick, so
 * nothing can render on top of anything and the one claim the rest of the
 * session depends on is attached to the number it is about.
 *
 * THE OUT-OF-RANGE TILES ARE GREYED HARD. A tile that is merely a little paler
 * still reads as part of the answer from the back of a room. The numbers that
 * come out are the only ones with any colour on them.
 *
 * SESSION-LOCAL, ON PURPOSE AND TEMPORARILY. `slide-kit/sequence-lab/` owns the
 * promotion of this deck's figures into the kit; until it lands, this deck keeps
 * its own cut and re-points at `@/ui` afterwards.
 *
 * DOM, NOT SVG (content rule 17): every tick and every label is a real element
 * in a real flex row, so `align-check.mjs` can see each one.
 */

export interface RangeDialProps {
  /** The highest number drawn on the line. */
  max: number
  /** Where the dial is set when the frame arrives. */
  initialStart?: number
  initialStop?: number
  className?: string
}

function Stepper({
  name,
  onStep,
  canDown,
  canUp,
}: {
  name: string
  onStep: (d: number) => void
  canDown: boolean
  canUp: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-heading text-body-sm font-bold" style={{ color: colors.body }}>
        {name}
      </span>
      <Bump label={'\u2212'} onClick={() => onStep(-1)} disabled={!canDown} />
      <Bump label="+" onClick={() => onStep(1)} disabled={!canUp} />
    </div>
  )
}

function Bump({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-card border-2 font-mono text-[20px] font-bold leading-none"
      style={{
        borderColor: disabled ? colors.line : colors.brand,
        background: colors.white,
        color: disabled ? colors.muted : colors.brandDark,
      }}
    >
      {label}
    </button>
  )
}

export function RangeDial({ max, initialStart = 1, initialStop = 5, className = '' }: RangeDialProps) {
  const instant = useInstant()
  const [start, setStart] = useState(initialStart)
  const [stop, setStop] = useState(initialStop)
  /* THE GATE. Set by the button, cleared by any change to either bound. */
  const [shown, setShown] = useState(false)

  const move = (which: 'start' | 'stop', d: number) => {
    setShown(false)
    if (which === 'start') setStart((v) => Math.min(max, Math.max(0, v + d)))
    else setStop((v) => Math.min(max, Math.max(0, v + d)))
  }

  const ticks = Array.from({ length: max + 1 }, (_, i) => i)
  const count = Math.max(0, stop - start)
  const inRange = (n: number) => shown && n >= start && n < stop

  return (
    <div className={`flex w-full flex-col items-center gap-5 ${className}`}>
      <div className="flex items-center gap-8">
        <div className="font-mono text-[34px] font-bold leading-none" style={{ color: colors.brand }}>
          range(
          <Slot value={start} />
          <span style={{ color: colors.ink }}>, </span>
          <Slot value={stop} />)
        </div>
        <Stepper name="start" onStep={(d) => move('start', d)} canDown={start > 0} canUp={start < max} />
        <Stepper name="stop" onStep={(d) => move('stop', d)} canDown={stop > 0} canUp={stop < max} />
      </div>

      {/* BOTH FORMS ON ONE DIAL. Wind the start down to 0 and the call is the
          one-argument form the room met two frames ago, which is the cheapest
          way to say that the short form is not a different function. */}
      <div className="h-[22px] text-body-sm" style={{ color: colors.body }}>
        {start === 0 && <>Leave the start out and it is 0, so range({stop}) is the same call.</>}
      </div>

      <div className="flex items-start gap-2">
        {ticks.map((n) => {
          const lit = inRange(n)
          const isStop = n === stop
          const isStart = n === start
          const stopped = shown && isStop
          return (
            <div key={n} className="flex w-[64px] flex-col items-center gap-2">
              <motion.div
                className="relative grid h-[54px] w-full place-items-center rounded-card border-2 font-mono text-[22px] font-bold"
                style={{
                  borderColor: lit ? colors.brand : stopped ? colors.danger : colors.line,
                  background: lit ? `${colors.brand}1A` : stopped ? `${colors.danger}12` : colors.surface,
                  color: lit ? colors.brandDark : stopped ? colors.danger : colors.muted,
                  /* Greyed HARD: an out-of-range tile is not a paler answer, it
                     is not an answer. */
                  opacity: shown && !lit && !stopped ? 0.35 : 1,
                }}
                animate={instant ? {} : { scale: lit ? 1 : 0.97 }}
                transition={{ duration: T.enter, ease: c4(E.out) }}
              >
                {n}
                {stopped && (
                  <span
                    className="pointer-events-none absolute h-[2px] w-[34px] rotate-[-28deg]"
                    style={{ background: colors.danger }}
                  />
                )}
              </motion.div>
              {/* THE NAME OF THE BOUND, DIRECTLY UNDER THE TILE IT NAMES, in its
                  own element so nothing can sit on top of it. */}
              <div className="h-[20px] w-full text-center">
                {isStart && <Tag text="start" color={colors.brand} />}
                {isStop && !isStart && <Tag text="stop" color={colors.danger} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* THE PAYOFF, in the reference's own words. It arrives with the numbers
          and leaves with them, because it IS the answer to the prediction. */}
      <div className="min-h-[34px] w-full px-4 text-center">
        {shown && (
          <motion.p
            key={`${start}-${stop}`}
            className="text-body-lg leading-snug"
            style={{ color: colors.ink }}
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: T.enter, ease: c4(E.out) }}
          >
            {count === 0 ? (
              <>
                stop minus start is {stop} - {start} = 0, so no numbers come out. The loop body never
                runs.
              </>
            ) : (
              <>
                stop minus start is {stop} - {start} = {count}, so {count}{' '}
                {count === 1 ? 'number comes' : 'numbers come'} out. The last one is {stop - 1}, never{' '}
                {stop}.
              </>
            )}
          </motion.p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShown(true)}
        disabled={shown}
        className="rounded-pill px-6 py-2.5 font-heading text-body-lg font-bold"
        style={{
          background: shown ? `${colors.brand}59` : colors.brand,
          color: colors.white,
        }}
      >
        Show the numbers
      </button>
    </div>
  )
}

function Slot({ value }: { value: number }) {
  return (
    <span
      className="mx-1 inline-block min-w-[38px] rounded-card px-2 text-center"
      style={{ background: `${colors.brand}14`, color: colors.brandDark }}
    >
      {value}
    </span>
  )
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span className="font-heading text-[16px] font-bold lowercase leading-none" style={{ color }}>
      {text}
    </span>
  )
}
