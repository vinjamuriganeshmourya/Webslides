import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContentSlide } from '@/slides'
import { StepControls } from '@/ui'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { AnnotatedCode } from './AnnotatedCode'
import { WordChooser } from './WordChooser'

/**
 * "PYTHON", ONE CHARACTER AT A TIME — one press per LINE EXECUTED.
 *
 * WHY PER LINE AND NOT PER PASS. The earlier cut advanced a whole pass at a
 * time, four presses for the card. The room could see that six characters came
 * out but not that line 3 runs once per character, which is the only thing this
 * card teaches. The reference walks every executed line: `"Python"` is 15
 * presses, and the count is not decoration, it is the claim.
 *
 * THE THREE LINE STATES. A line that has run, the line running now, and a line
 * NEVER REACHED. The third is the one that matters on `""`: the body is never
 * entered, and `print(ch)` staying grey after the run has finished is the only
 * thing on the frame that proves the loop ran zero times.
 *
 * Three words, because two of them behave the way a room expects and the empty
 * one does not. Choosing a word resets the walk, so every word is predicted
 * rather than watched.
 */

const WORDS = [
  { literal: '"Python"', label: 'Python' },
  { literal: '"Go"', label: 'Go' },
  { literal: '""', label: 'nothing' },
]

interface RunStep {
  line: number
  /** Pointer into the characters. `-1` before the walk, `n` once exhausted. */
  at: number
  ch?: string
  out: string[]
  label: string
  caption: string
}

function buildSteps(literal: string): RunStep[] {
  const chars = literal.slice(1, -1).split('').filter(Boolean)
  const n = chars.length
  const steps: RunStep[] = []
  const out: string[] = []

  steps.push({
    line: 1,
    at: -1,
    out: [],
    label: 'Line 1',
    caption: `word holds ${literal}.${n ? ` That is ${n} characters.` : ' Nothing between the quote marks.'}`,
  })
  chars.forEach((c, i) => {
    steps.push({
      line: 2,
      at: i,
      ch: c,
      out: [...out],
      label: `Line 2 · pass ${i + 1}`,
      caption: `The loop takes the next character out of the sequence. ch is ${c}.`,
    })
    out.push(c)
    steps.push({
      line: 3,
      at: i,
      ch: c,
      out: [...out],
      label: 'Line 3',
      caption: `It prints whatever ch is holding right now, so ${c} goes on its own line.`,
    })
  })
  steps.push({
    line: 2,
    at: n,
    ch: n ? chars[n - 1] : undefined,
    out: [...out],
    label: n ? 'Line 2 · again' : 'Line 2',
    caption: n
      ? 'The loop asks for the next character. There is none left, so the loop ends.'
      : 'The loop asks for a first character. There is none, so the body never runs at all.',
  })
  out.push('Done')
  steps.push({
    line: 4,
    at: n,
    ch: n ? chars[n - 1] : undefined,
    out: [...out],
    label: 'Line 4',
    caption: n
      ? 'print("Done") is outside the loop, so it runs once, after it.'
      : 'print("Done") still runs. It is outside the loop, and the loop simply did nothing.',
  })
  return steps
}

export function StringWalkCard({ session, py }: { session: string; py: string }) {
  const instant = useInstant()
  const [literal, setLiteral] = useState(WORDS[0].literal)
  /* THE SPLIT IS THE COMMITMENT. The reference makes the room answer "one
     string, or six characters?" and press Split it before anything walks. Until
     they do, the frame shows the word as ONE thing, because that is the belief
     the card is about to correct. */
  const [split, setSplit] = useState(false)
  const chars = literal.slice(1, -1).split('').filter(Boolean)
  const steps = buildSteps(literal)
  const shown = useClaimedSteps(steps.length)
  const reached = shown.filter(Boolean).length
  const s = reached > 0 ? steps[reached - 1] : undefined

  /* Every line the interpreter has already executed, the one it is on now, and
     any line it has not reached by the end of the run. */
  const lineStates: Record<number, 'ran' | 'running' | 'unreached'> = {}
  const everRan = new Set(steps.slice(0, reached).map((x) => x.line))
  for (const ln of everRan) lineStates[ln] = 'ran'
  if (s) lineStates[s.line] = 'running'
  if (reached === steps.length && !everRan.has(3)) lineStates[3] = 'unreached'

  return (
    <ContentSlide
      kicker="A string is a sequence"
      title={'"Python", one character at a time'}
      lesson={session}
      lead="Pick a word, say how many lines it will print, then step it one line at a time."
    >
      <div className="flex flex-col items-center gap-2">
        <WordChooser
          words={WORDS}
          value={literal}
          onChange={(v) => {
            setLiteral(v)
            setSplit(false)
          }}
        />

        {/* The CODE keeps its natural width -- a panel stretched past its
            longest line is just a dark rectangle with a margin -- and the right
            column takes the rest of the row. The strip, the slots and the
            output are the things with something to gain from the space. */}
        <div className="grid w-full grid-cols-2 items-center gap-7">
          <div className="flex w-full flex-col gap-2">
          <AnnotatedCode
            className="w-full"
            filename={py}
            fontSize={17}
            showLineNumbers
            lineStates={lineStates}
            code={`word = ${literal}\nfor ch in word:\n    print(ch)\nprint("Done")`}
          />
          {/* THE LEGEND NAMES THE THREE STATES, because the colours alone do
              not say what they mean. The third is the one that matters: on the
              empty word `print(ch)` stays grey after the run has finished, and
              that is the only thing on the frame proving the body ran zero
              times. All three are on screen from the start, so the room can
              read the key before it needs it. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <LegendKey swatch={`${colors.brand}29`} label="already run" />
            <LegendKey swatch={colors.brand} label="running now" />
            <LegendKey swatch={colors.line} dim label="never reached, and it stays grey" />
          </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {/* The sequence, with the pointer on the character ch is holding. */}
            <div className="flex items-end gap-1.5">
              {!split && (
                <button
                  type="button"
                  onClick={() => setSplit(true)}
                  className="flex items-center gap-3 rounded-card border-2 px-4 py-2"
                  style={{ borderColor: colors.brand, background: colors.white }}
                >
                  <span className="font-mono text-[22px] font-bold" style={{ color: colors.ink }}>
                    {literal}
                  </span>
                  <span
                    className="rounded-pill px-3 py-1 font-heading text-body-sm font-bold"
                    style={{ background: colors.brand, color: colors.white }}
                  >
                    Split it
                  </span>
                </button>
              )}
              {split &&
                chars.map((c, i) => (
                <span
                  key={i}
                  className="grid h-[42px] w-[42px] place-items-center rounded-lg border-2 font-mono text-[18px] font-bold"
                  style={{
                    borderColor: s && s.at === i ? colors.brand : colors.line,
                    background: s && s.at === i ? `${colors.brand}14` : colors.white,
                    color: colors.ink,
                    opacity: s && s.at > i ? 0.4 : 1,
                  }}
                >
                  {c}
                </span>
                ))}
              {split && (
              <span
                className="grid h-[42px] place-items-center rounded-lg border-2 border-dashed px-2 font-heading text-[12px] font-bold"
                style={{
                  borderColor: s && s.at >= chars.length ? colors.danger : colors.line,
                  color: s && s.at >= chars.length ? colors.danger : colors.muted,
                }}
              >
                nothing left
              </span>
              )}
            </div>

            <div className="flex w-full items-start gap-2">
              <Slot label="ch" value={s?.ch ?? 'not set yet'} muted={!s?.ch} />
              {/* THE OUTPUT GROWS ONE LINE AT A TIME, which is the whole point:
                  the room watches P arrive, then y, and counts them. */}
              <div className="min-w-[150px] flex-1 overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
                <div className="border-b border-line bg-surface px-3 py-1 text-center">
                  <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
                    Output
                  </span>
                </div>
                <div className="min-h-[104px] px-4 py-2">
                  {(s?.out ?? []).map((line, i) => (
                    <motion.div
                      key={`${line}-${i}`}
                      className="font-mono text-[15px] leading-[1.35]"
                      style={{ color: colors.ink }}
                      initial={instant ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: T.label, ease: c4(E.out) }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[54px] w-full max-w-[940px] rounded-card border border-line bg-surface px-5 py-2">
          {s && (
            <motion.div
              key={reached}
              initial={instant ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: T.enter, ease: c4(E.out) }}
            >
              <span
                className="mr-2 font-heading text-body-sm font-bold uppercase tracking-wider"
                style={{ color: colors.brand }}
              >
                {s.label}
              </span>
              <span className="text-body" style={{ color: colors.ink }}>
                {s.caption}
              </span>
            </motion.div>
          )}
        </div>

        {split ? (
          <StepControls className="w-full justify-center" showCount mode="code" />
        ) : (
          <p className="text-center text-body" style={{ color: colors.muted }}>
            One string, or {chars.length || 'no'} characters? Say which, then press Split it.
          </p>
        )}
      </div>
    </ContentSlide>
  )
}

function LegendKey({ swatch, label, dim }: { swatch: string; label: string; dim?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-[14px] w-[22px] rounded-[4px] border"
        style={{ background: swatch, borderColor: colors.line, opacity: dim ? 0.45 : 1 }}
      />
      <span className="text-body-sm" style={{ color: colors.body }}>
        {label}
      </span>
    </span>
  )
}

function Slot({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="w-[112px] overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="border-b border-line bg-surface px-3 py-1 text-center">
        <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
          {label}
        </span>
      </div>
      <div className="grid h-[104px] place-items-center px-2 text-center">
        <span
          className={muted ? 'font-mono text-[13px]' : 'font-mono text-[22px] font-semibold'}
          style={{ color: muted ? colors.muted : colors.brandDark }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}
