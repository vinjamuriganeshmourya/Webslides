import { useEffect, useRef, useState } from 'react'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'

/**
 * Back · Next · Replay, drawn on the slide by a stepped figure.
 *
 * THE ARGUMENT
 *
 * A walk figure claims something about TIME: that there is a sequence, that it
 * is being consumed one item at a time, and that it runs out. A frame that
 * merely changes when a key is pressed does not say any of that. These three
 * buttons say it before anything moves, and the step counter beside them says
 * how far through the room is. `pedagogy-to-components` §5.6 is the rule.
 *
 * BACK IS THE ONE THAT EARNS ITS PLACE
 *
 * Forward-only is the default everywhere and it is wrong here. A prediction is
 * checked against the beat before it, a trace is re-read a line at a time, and
 * a wrong answer is understood by returning to the state that made it look
 * right. Without Back, answering one question from the back of the room means
 * replaying the whole figure from zero.
 *
 * ONE COUNTER
 *
 * `useStepControls` drives the DECK's step, the same one Ctrl+arrow and R
 * drive, so the buttons and a presenter's clicker can never disagree. Back and
 * Next are clamped to this slide and never cross into the next one: moving
 * between slides is the player's job.
 *
 * ALWAYS DRAWN, LIVE ONLY WHEN IT CAN BE
 *
 * The row renders under `?all` and in the overview too, so the contact sheet
 * shows what the room will see and a reviewer can check the figure's chrome.
 * It is inert there, because there is no player behind it to drive.
 *
 * DOM, never SVG (content rule 17), colours from tokens.
 */
export function StepControls({
  className = '',
  /** Hide the "3 / 8" counter when the figure already shows its own position. */
  showCount = true,
  mode = 'beats',
  nextLabel = 'Next',
}: {
  className?: string
  showCount?: boolean
  /**
   * What the forward press is CALLED, in the analogy's own words: `Join them`
   * on a card that joins three pairs, `Show the numbers` on a dial. The name is
   * part of the teaching — it says what the press is about to do — and a
   * generic `Next` throws that away. Course rule R5c.
   */
  nextLabel?: string
  /**
   * `beats` — Back · Next · Replay, for a narrative figure the instructor talks
   * over one beat at a time.
   *
   * `code` — Play · One step · Reset, for a code walkthrough. The difference is
   * not cosmetic and the lesson plans keep it deliberately: a trace is a
   * PROGRAM RUNNING, and a room needs to see it run continuously at least once
   * before it is picked apart a line at a time. Play does that; stepping alone
   * never shows the thing at speed.
   */
  mode?: 'beats' | 'code'
}) {
  const { step, max, canBack, canNext, back, next, replay } = useStepControls()

  /* Play advances the deck's own step on a timer and stops itself at the end,
     on a reset, or when the slide goes away. 620ms is the explanatory tier: a
     line of code has to be readable as it lights, not merely seen to flash. */
  const [playing, setPlaying] = useState(false)
  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    if (!playing) return
    if (!canNext) {
      setPlaying(false)
      return
    }
    const id = setInterval(() => nextRef.current(), 620)
    return () => clearInterval(id)
  }, [playing, canNext])

  if (mode === 'code') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Btn
          label={playing ? 'Pause' : 'Play'}
          onClick={() => setPlaying((p) => !p)}
          enabled={canNext || playing}
          glyph={playing ? 'pause' : 'play'}
          primary
        />
        <Btn
          label="One step"
          onClick={() => {
            setPlaying(false)
            next()
          }}
          enabled={canNext}
          glyph="next"
        />
        <Btn
          label="Reset"
          onClick={() => {
            setPlaying(false)
            replay()
          }}
          enabled
          glyph="replay"
          ghost
        />
        {showCount && max > 0 && (
          <span className="ml-1 font-mono text-body-sm tabular-nums" style={{ color: colors.body }}>
            {step} / {max}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Btn label="Back" onClick={back} enabled={canBack} glyph="back" />
      <Btn label={nextLabel} onClick={next} enabled={canNext} glyph="next" primary />
      <Btn label="Replay" onClick={replay} enabled glyph="replay" ghost />
      {showCount && max > 0 && (
        <span
          className="ml-1 font-mono text-body-sm tabular-nums"
          style={{ color: colors.body }}
        >
          {step} / {max}
        </span>
      )}
    </div>
  )
}

function Btn({
  label,
  onClick,
  enabled,
  glyph,
  primary = false,
  ghost = false,
}: {
  label: string
  onClick: () => void
  enabled: boolean
  glyph: 'back' | 'next' | 'replay' | 'play' | 'pause'
  primary?: boolean
  ghost?: boolean
}) {
  // The disabled state is drawn, not hidden: a Back that vanishes at step 0
  // makes the row jump, and a row that changes width while the figure is being
  // stepped reads as part of the figure's own motion.
  const base =
    'inline-flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-kicker transition-opacity'
  const style = primary
    ? { background: colors.brand, color: '#FFFFFF' }
    : ghost
      ? { background: 'transparent', color: colors.body, boxShadow: `inset 0 0 0 1px ${colors.line}` }
      : { background: '#FFFFFF', color: colors.ink, boxShadow: `inset 0 0 0 1px ${colors.line}` }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      aria-label={label}
      className={base}
      style={{ ...style, opacity: enabled ? 1 : 0.38 }}
    >
      <Glyph kind={glyph} />
      {label}
    </button>
  )
}

function Glyph({ kind }: { kind: 'back' | 'next' | 'replay' | 'play' | 'pause' }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'back') return <svg {...common}><path d="M15 18 9 12l6-6" /></svg>
  if (kind === 'next') return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>
  if (kind === 'play')
    return <svg {...common} fill="currentColor" stroke="none"><path d="M7 4.5 19 12 7 19.5Z" /></svg>
  if (kind === 'pause')
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <rect x="6" y="5" width="4" height="14" rx="1.2" />
        <rect x="14" y="5" width="4" height="14" rx="1.2" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}
