import { useLayoutEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group } from './common'
import { Confetti } from './motion'
import { Appear, Ask, BigLine, Swap } from './pieces'
import { StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, NoteCard, type Row, type RowTone } from './board'
import { BoardCard, DeckLine } from './frame'
import { SPEC } from './spec'

/**
 * dict() FROM PAIRS AND WHAT CAN BE A KEY: C13 (dict() from pairs), C14
 * (can it be a key?). Every program and output is the spec's, run on
 * CPython 3.12.3.
 */

/* ------------------------------------------------------------------ C13 */

const C13 = SPEC.C13
const [NOTEBOOK, FLAT] = C13.code as { file: string; src: string; output: string }[]
const PAIRS: Row[] = [...NOTEBOOK.src.matchAll(/[(\[]"(\w+)", (\d+)[)\]]/g)].map((m) => ({ key: m[1], value: Number(m[2]) }))
const OPTS13: string[] = C13.show.slice(4, 7)
const RIGHT13 = OPTS13.findIndex((o) => FLAT.output.startsWith(o))

/** The flat list, and "tea" coming apart into its three letters: not two parts. */
function FlatSplit({ on }: { on: boolean }) {
  const tween = useTween(480)
  const cell = (t: string, bad = false) => (
    <span key={t} className="grid h-[34px] min-w-[34px] place-items-center rounded-lg px-2 font-mono text-[14px] font-semibold" style={{ background: bad ? '#FDECEC' : colors.white, color: bad ? colors.danger : colors.ink, border: `2px solid ${bad ? colors.danger : colors.line}` }}>
      {t}
    </span>
  )
  return (
    <div className="flex flex-col gap-2" style={{ opacity: on ? 1 : 0, transition: tween }}>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[13px] font-bold" style={{ color: colors.brandDark }}>flat</span>
        {cell('"tea"')}
        {cell('12')}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[13px] font-bold" style={{ color: colors.danger }}>#0</span>
        {['t', 'e', 'a'].map((c) => cell(c, true))}
        <span className="ml-1 font-heading text-[14px] font-bold" style={{ color: colors.danger }}>length 3, not 2 parts</span>
      </div>
    </div>
  )
}

/**
 * C13, four presses: Anna's notebook, one pair per line, and notebook.py.
 * Press 2: each pair snaps onto the board as a row, the output fills, and
 * the deck's dict(sequence) lines show. Press 3 is flat.py and the vote.
 * Press 4: dict() takes "tea" as the first pair, three letters, not two
 * parts: ValueError.
 */
export function FromPairs() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 4
  const snap = useStepPhase(beat, [250, 450, 450])
  const rows = beat === 2 ? PAIRS.slice(0, snap) : beat >= 3 ? PAIRS : []
  const tones: Record<string, RowTone> = {}
  if (beat === 2 && snap >= 1) tones[PAIRS[snap - 1].key] = 'new'
  const prog = beat >= 3 ? FLAT : NOTEBOOK
  const out = beat === 2 ? [{ text: NOTEBOOK.output }] : beat === 4 ? [{ text: FLAT.output, tone: 'error' as const }] : []
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={3}
        at={beat === 4 ? 2 : null}
        stop={beat === 4}
        asking={beat === 1 || beat === 3}
        ask={beat >= 3 ? C13.show[3] : beat === 2 ? <BigLine size={20}>{C13.show[1]}</BigLine> : undefined}
        vote={beat >= 3 ? <Vote options={OPTS13} right={RIGHT13} shown={shown} pick={pick} setPick={setPick} cols={3} size={17} nowrap dense /> : undefined}
        out={out}
        note={beat === 2 ? <DeckLine text={C13.show[2]} /> : beat === 4 ? <DeckLine text={C13.show[7]} /> : undefined}
        board={
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <NoteCard title="Anna's notebook" lines={PAIRS.map((p) => `${p.key} ${p.value}`)} width={150} />
              <Board rows={rows} tones={tones} size="sm" name="menu" minRows={3} empty="nothing yet" style={{ width: 196 }} />
            </div>
            {beat >= 3 && <FlatSplit on={beat >= 4} />}
          </div>
        }
        boardActive={beat === 2 || beat === 4}
        caption={beat === 1 ? C13.show[0] : beat === 2 ? null : beat === 3 ? C13.show[3] : C13.show[7]}
        captionTone={beat === 2 || beat === 4 ? 'rule' : 'step'}
      />
      {shown && pick === RIGHT13 && <Confetti seed={30} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C14 */

const C14 = SPEC.C14
const [COMBO, COMBO_LIST] = C14.code as { file: string; src: string; output: string }[]
const EXAMPLES: string[] = C14.show.slice(1, 7)
const RESULTS: Record<string, string> = C14.data.results
const YES: string = C14.show[7]
const NO: string = C14.show[8]

/** A short program and what it printed, compact: the two lines on a dark chip, the result under it. */
function Mini({ prog }: { prog: { file: string; src: string; output: string } }) {
  const err = /Error/.test(prog.output)
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {prog.file}
      </span>
      <div className="self-start rounded-lg px-3 py-1.5 font-mono text-[14px] font-semibold leading-[20px]" style={{ background: colors.night2, color: colors.white }}>
        {prog.src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
      <span className="self-start whitespace-pre rounded-md px-2.5 py-0.5 font-mono text-[14px] font-bold" style={{ background: err ? '#FDECEC' : '#E9F8EF', color: err ? colors.danger : colors.ink, boxShadow: `inset 0 0 0 1.5px ${err ? colors.danger : colors.success}` }}>
        {prog.output}
      </span>
    </div>
  )
}

/** One table row's answer, filling on its press. */
function Answer({ ex, on }: { ex: string; on: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const instant = useInstant()
  const result = RESULTS[ex]
  const yes = !/Error/.test(result)
  useLayoutEffect(() => {
    if (!on || instant) return
    ref.current?.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(0.22,1,0.36,1)' })
  }, [on, instant])
  if (!on) return <span className="grid h-[30px] w-[64px] place-items-center rounded-md" style={{ border: `1.5px dashed ${colors.line}` }} />
  return (
    <span ref={ref} className="flex items-center gap-3">
      <span className="grid h-[30px] w-[64px] place-items-center rounded-md font-heading text-[15px] font-bold" style={{ background: yes ? '#E9F8EF' : '#FDECEC', color: yes ? '#137A3A' : colors.danger, boxShadow: `inset 0 0 0 1.5px ${yes ? colors.success : colors.danger}` }}>
        {yes ? YES : NO}
      </span>
      {!yes && (
        <span className="whitespace-nowrap font-mono text-[13px] font-bold" style={{ color: colors.danger }}>
          {result}
        </span>
      )}
    </span>
  )
}

/**
 * C14, eight presses: deck slide 52's table with this session's examples
 * and an empty "Can be used as key?" column. One row per press (2 to 7):
 * Yes, or No with the error beside it. Press 8: combo.py, a tuple of two
 * items as a key, 25; combo_list.py with square brackets, TypeError.
 */
export function CanBeKey() {
  const beat = useBeats(8)
  const filled = Math.min(Math.max(beat - 1, 0), 6)
  const tween = useTween(420)
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[640px] shrink-0 flex-col" active={beat >= 2 && beat <= 7}>
          <div className="overflow-hidden rounded-xl" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
            <div className="grid h-[40px] items-center font-heading text-[15px] font-bold" style={{ gridTemplateColumns: '220px 1fr', background: colors.brandDark, color: colors.white }}>
              <span className="px-4">Example</span>
              <span className="px-4">Can be used as key?</span>
            </div>
            {EXAMPLES.map((ex, i) => (
              <div key={ex} className="grid h-[52px] items-center" style={{ gridTemplateColumns: '220px 1fr', background: i < filled ? colors.white : 'transparent', boxShadow: `inset 0 -1px 0 ${colors.line}${i === filled ? `, inset 4px 0 0 ${colors.brand}` : ''}`, transition: tween }}>
                <span className="whitespace-pre px-4 font-mono text-[15px] font-semibold" style={{ color: colors.ink }}>
                  {ex}
                </span>
                <span className="px-4">
                  <Answer ex={ex} on={i < filled} />
                </span>
              </div>
            ))}
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" active={beat === 8}>
          <Swap k={beat >= 8 ? 'combo' : 'ask'}>
            {beat >= 8 ? (
              <div className="flex flex-col gap-3">
                <Mini prog={COMBO} />
                <Mini prog={COMBO_LIST} />
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Ask size={24}>{C14.show[0]}</Ask>
              </div>
            )}
          </Swap>
          <div className="mt-auto">
            {beat >= 8 ? <Appear><DeckLine text={[C14.show[9], C14.show[10]]} /></Appear> : <StepCaption text={beat === 1 ? C14.show[0] : null} size={16} minH={44} />}
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={8} />
    </>
  )
}

