import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Focus, Group } from './common'
import { Appear, Fresh, CODE_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import type { Mark } from './Code'
import { RoundHead, WhyLines, schedule } from './game'
import { SPEC } from './spec'

/**
 * GAME G1 · FIX THE IMPORT (make-it-print, played as fix the import).
 * Twenty-four presses: four rounds of the ask, one try per press (A, B, C,
 * D, the right one included, in that order) and the verdict.
 *
 *   - The target output, big, and the program with line 1 blank (the deck's
 *     fill-in slot); the options are line 1s.
 *   - Each try drops its line into the blank, and the list of tries keeps
 *     its real output or error beside the target: it matches or misses. The
 *     list stays, so the four results can be compared (its must line).
 *   - The import picture (spec note 5) is on the program: the name the tried
 *     line 1 brings in is underlined, and line 2's name in the same colour
 *     when they are the same, red when they are not.
 *   - The verdict keeps the line that hit, says why, and gives a line for
 *     every wrong option.
 * Every try was run on CPython 3.12.3 and matches the spec.
 */
const G1 = SPEC.G1
type Step = { caption: string; fill: string; output: string; match: boolean }
type Round = { ask: string; template: string; target: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G1.data.rounds
const SCHEDULE = schedule(ROUNDS, false)

/** The name an import line brings in. */
function bound(line: string): string | null {
  let m = /^from \w+ import (\w+) as (\w+)$/.exec(line)
  if (m) return m[2]
  m = /^from \w+ import (\w+)$/.exec(line)
  if (m) return m[1]
  m = /^import (\w+) as (\w+)$/.exec(line)
  if (m) return m[2]
  m = /^import (\w+)$/.exec(line)
  if (m) return m[1]
  return null
}

/** The name line 2 asks for: the first name in `print(...)`. */
function asked(template: string): string {
  const l2 = template.split('\n')[1]
  return /print\((\w+)/.exec(l2)?.[1] ?? ''
}

/** The underlines for a tried line 1: brought-in and asked-for names, one colour when they match, red when they do not. */
function marksFor(fill: string, template: string, output: string): Record<number, Mark[]> {
  const b = bound(fill)
  const want = asked(template)
  if (!b) return {}
  const err = /NameError|ModuleNotFoundError/.test(output)
  if (/ModuleNotFoundError/.test(output)) return { 1: [{ text: b, tone: 'bad' }] }
  if (b === want) return { 1: [{ text: b, tone: 'a', nth: fill.split(/\W+/).filter((w) => w === b).length }], 2: [{ text: want, tone: 'a' }] }
  return { 1: [{ text: b, tone: 'c', nth: fill.split(/\W+/).filter((w) => w === b).length }], 2: [{ text: want, tone: err ? 'bad' : 'c' }] }
}

/** The target, big, beside the round's question. */
function Target({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        Target
      </span>
      <span className="whitespace-nowrap rounded-lg bg-white px-3 py-0.5 font-mono text-[22px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
        {value}
      </span>
    </span>
  )
}

/** The list of tries: every try stays with its real output, hit or miss. Full width, so the longest error line fits its row. */
function Tries({ round, done, shown }: { round: Round; done: number; shown: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex w-full flex-col gap-[3px]">
      {round.steps.map((st, i) => {
        const on = i < done
        const err = /Error/.test(st.output)
        const win = shown && st.match
        return (
          <div key={st.fill} className="flex h-[28px] items-center gap-2 rounded-lg px-2" style={{ background: win ? '#E9F8EF' : on ? colors.white : 'transparent', boxShadow: win ? `inset 0 0 0 2px ${colors.success}` : on ? `inset 0 0 0 1px ${colors.line}` : `inset 0 0 0 1.5px ${colors.line}44`, transition: tween }}>
            <span className="w-4 shrink-0 font-mono text-[13px] font-bold" style={{ color: colors.muted }}>
              {'ABCD'[i]}
            </span>
            <span className="w-[255px] shrink-0 whitespace-nowrap font-mono text-[13px] font-semibold" style={{ color: on ? colors.ink : colors.muted }}>
              {st.fill}
            </span>
            {on && (
              <Appear className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[12px] font-bold" style={{ color: colors.muted }}>
                  →
                </span>
                <span className="whitespace-nowrap font-mono text-[11.5px] font-bold" style={{ color: err ? colors.danger : '#137A3A' }}>
                  {st.output}
                </span>
                <span className="shrink-0 text-[14px] font-bold" style={{ color: st.match ? colors.success : colors.danger }}>
                  {st.match ? '✓' : '✗'}
                </span>
              </Appear>
            )}
          </div>
        )
      })}
    </div>
  )
}

const TOP_H = 200
const BOTTOM_H = 207

export function FixImport() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const done = b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round.steps.length : 0
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const fill = b.kind === 'step' ? round.steps[b.s].fill : shown ? round.answer : null
  const code = fill ? round.template.replace('____', fill) : round.template
  const step = b.kind === 'step' ? round.steps[b.s] : null
  const marks = step ? marksFor(step.fill, round.template, step.output) : shown ? marksFor(round.answer, round.template, round.target) : undefined
  const stop = !!step && !step.match
  const caption = step ? step.caption : shown ? round.because : null
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Group pad={10} className="flex items-stretch gap-4" style={{ height: TOP_H }} active={b.kind === 'ask'}>
          <div className="w-[384px] shrink-0">
            <Focus on={b.kind === 'ask'}>
              <CodePane code={code} fontSize={CODE_FS} rows={2} marks={marks} at={stop ? 2 : null} stop={stop} />
            </Focus>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <div className="flex items-end justify-between gap-4">
              <RoundHead r={r} n={ROUNDS.length} ask={round.ask} />
              <Fresh k={`t${r}`}>
                <Target value={round.target} />
              </Fresh>
            </div>
            <Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} cols={2} size={14} nowrap dense />
          </div>
        </Group>
        <Group pad={8} className="flex flex-col gap-2" style={{ height: BOTTOM_H }} active={b.kind === 'step'}>
          <div className="flex items-start gap-3">
            <div className="w-[712px] shrink-0">
              <Fresh k={`r${r}`} className="w-full">
                <Tries round={round} done={done} shown={shown} />
              </Fresh>
            </div>
            <div className="min-w-0 flex-1">
              <StepCaption text={caption} tone={shown ? 'rule' : 'step'} size={15} h={121} />
            </div>
          </div>
          <WhyLines on={shown} cols={3} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={40 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
