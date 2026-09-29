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
        <WordChooser words={WORDS} value={literal} onChange={setLiteral} />

        <div className="flex items-start justify-center gap-6">
          <AnnotatedCode
            filename={py}
            fontSize={15}
            showLineNumbers
            lineStates={lineStates}
            code={`word = ${literal}\nfor ch in word:\n    print(ch)\nprint("Done")`}
          />

          <div className="flex flex-col gap-2">
            {/* The sequence, with the pointer on the character ch is holding. */}
            <div className="flex items-end gap-1.5">
              {chars.map((c, i) => (
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
              <span
                className="grid h-[42px] place-items-center rounded-lg border-2 border-dashed px-2 font-heading text-[12px] font-bold"
                style={{
                  borderColor: s && s.at >= chars.length ? colors.danger : colors.line,
                  color: s && s.at >= chars.length ? colors.danger : colors.muted,
                }}
              >
                nothing left
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Slot label="ch" value={s?.ch ?? 'not set yet'} muted={!s?.ch} />
              {/* THE OUTPUT GROWS ONE LINE AT A TIME, which is the whole point:
                  the room watches P arrive, then y, and counts them. */}
              <div className="min-w-[150px] overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
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

        <StepControls className="w-full justify-center" showCount mode="code" />
      </div>
    </ContentSlide>
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
