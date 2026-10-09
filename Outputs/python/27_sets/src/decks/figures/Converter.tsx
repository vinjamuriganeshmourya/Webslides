import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { Ask, Note, OutPanel, Show, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useForward, useStepPhase } from './phase'
import { Row, py, type CellState } from './rows'
import { Bag } from './bag'
import { outOf } from './SetCards'
import { SPEC } from './spec'

/**
 * EXPLAINER: set() LETS EACH VALUE IN ONCE. Spec card E1, fifteen presses.
 *
 *   1      views as a list row (7 cells, 0 to 6), an empty bag, the switch on
 *          list, views_to_set.py, the vote 7 and 7 / 7 and 3 / 3 and 3
 *   2-8    one value per press (data.walks.list): it leaves its cell for the
 *          door and joins, or bounces off as already in; a bounced cell turns
 *          grey and stays grey to the end of the card
 *   9      the output 7 / 3; under views, "Every open is still in views."
 *   10     the switch moves to string: Anna as four letter cells, vote 1 to 4
 *   11-14  one letter per press (data.walks.string); the output 3 on the last
 *   15     the switch moves to tuple: tuple_to_set.py runs in one press, 2
 *
 * The source row never loses a cell: set() reads it (must line). No free code
 * box, no picker, no input field: the switch has only list, string and tuple,
 * and it moves on a press, never by itself (must_not). Chips are never
 * numbered. Every program, walk and caption is the spec's data.
 */
const E1 = SPEC.E1
type Walk = { index: number; item: string; result: string; bag: string[]; caption: string }
const LIST: Walk[] = E1.data.walks.list
const WORD: Walk[] = E1.data.walks.string
const [PV, PN, PT] = E1.code as { file: string; src: string; output: string }[]
const VIEWS: string[] = E1.data.views
const LETTERS = [...(E1.data.word as string)]
const TUPLE = [...PT.src.split('\n')[0].matchAll(/"([^"]*)"/g)].map((m) => m[1])

type Beat = { mode: 'list' | 'string' | 'tuple'; kind: 'ask' | 'walk' | 'out' | 'run'; w?: number }
const SCHEDULE: Beat[] = [
  { mode: 'list', kind: 'ask' },
  ...LIST.map((_, w): Beat => ({ mode: 'list', kind: 'walk', w })),
  { mode: 'list', kind: 'out' },
  { mode: 'string', kind: 'ask' },
  ...WORD.map((_, w): Beat => ({ mode: 'string', kind: 'walk', w })),
  { mode: 'tuple', kind: 'run' },
]

/** The switch: list, string, tuple. The marker slides to the one in use; nothing else on it moves. */
function Switch({ mode }: { mode: Beat['mode'] }) {
  const instant = useInstant()
  const modes = ['list', 'string', 'tuple'] as const
  return (
    <div className="relative inline-grid grid-cols-3 rounded-full p-1" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <motion.span
        className="absolute bottom-1 top-1 rounded-full"
        style={{ width: 'calc((100% - 8px) / 3)', left: 4, background: colors.brandDark }}
        initial={false}
        animate={{ x: `${modes.indexOf(mode) * 100}%` }}
        transition={{ duration: instant ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {modes.map((m) => (
        <span key={m} className="relative z-[1] px-5 py-1 text-center font-heading text-[16px] font-bold" style={{ color: m === mode ? colors.white : colors.brandDark, transition: 'color 420ms' }}>
          {m}
        </span>
      ))}
    </div>
  )
}

export function Converter() {
  const beat = useBeats(SCHEDULE.length)
  const fwd = useForward(beat)
  const b = SCHEDULE[beat - 1]
  const [picks, setPicks] = useState<[number, number]>([-1, -1])
  const vi = b.mode === 'list' ? 0 : 1
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  /* inside a walk press, ONE move (user, 2026-10-08): the value flies straight
     from its cell into its place in the bag, or, a repeat, up to the rim where
     it stops grey; its cell greys as it lands (phase 1) */
  const phase = useStepPhase(beat, [900])
  const walks = b.mode === 'list' ? LIST : WORD
  const done = b.kind === 'walk' ? b.w! + 1 : b.kind === 'ask' ? 0 : walks.length
  const cur = b.kind === 'walk' ? walks[b.w!] : null
  const landed = !cur || phase >= 1
  const inBag = b.mode === 'tuple' ? [...new Set(TUPLE)] : done === 0 ? [] : walks[done - 1].bag
  /* grey: every value that bounced, from the moment it lands at the rim to the end of the card */
  const states: Record<number, CellState> = {}
  walks.slice(0, done).forEach((w) => w.result !== 'joins' && (w !== cur || landed) && (states[w.index] = 'grey'))
  if (cur && !landed) states[cur.index] = 'lit'
  const visitor = cur && cur.result !== 'joins' ? { label: cur.item, mode: 'bounce' as const, from: () => cells.current[cur.index] } : null
  const origin = (l: string) => (cur && cur.result === 'joins' && l === cur.item ? cells.current[cur.index] : null)
  const prog = b.mode === 'list' ? PV : b.mode === 'string' ? PN : PT
  const shown = b.mode === 'list' ? beat >= 9 : b.mode === 'string' ? done === WORD.length && landed : true
  const out = shown ? outOf(prog) : []
  const opts: string[] = b.mode === 'list' ? E1.data.options : ['1', '2', '3', '4']
  const right = b.mode === 'list' ? 'ABC'.indexOf(E1.data.right) : opts.indexOf(PN.output)
  const pick = picks[vi]
  const setPick = (p: number) => setPicks((ps) => (vi === 0 ? [p, ps[1]] : [ps[0], p]))
  const ask = b.mode === 'list' ? E1.show[1] : b.mode === 'string' ? E1.show[6] : E1.show[7]
  const rowName = b.mode === 'list' ? 'views' : b.mode === 'string' ? 'name' : 'opens'
  return (
    <>
      <div className="flex items-start gap-6">
        {/* left: the program, and the sequence it reads */}
        <div className="flex w-[672px] shrink-0 flex-col gap-3">
          <Group>
            <Focus on={b.kind === 'ask'}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={4} highlight={b.kind === 'walk' ? 2 : undefined} />
            </Focus>
          </Group>
          <Group className="flex flex-col gap-2.5" active={b.kind === 'walk'}>
            <Row
              key={`row-${b.mode}`}
              items={b.mode === 'list' ? VIEWS.map(py) : b.mode === 'string' ? LETTERS.map(py) : TUPLE.map(py)}
              kind={b.mode === 'list' ? 'list' : b.mode === 'tuple' ? 'tuple' : 'plain'}
              size="sm"
              fit
              name={rowName}
              states={states}
              cellRefs={cells}
            />
            <div className="min-h-[50px]">
              {b.mode === 'list' && b.kind === 'out' ? (
                <Show on>
                  <Note size={17} lines={[E1.show[5]]} />
                </Show>
              ) : (
                <StepCaption text={cur ? cur.caption : null} size={16} minH={48} />
              )}
            </div>
          </Group>
        </div>
        {/* right: the switch, what it prints, the vote, and the bag */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Group className="flex flex-col gap-2.5" active={b.kind === 'ask'}>
            <div className="flex items-center gap-3">
              <Switch mode={b.mode} />
              <span className="whitespace-nowrap font-mono text-[15px] font-bold" style={{ color: colors.muted }}>
                {E1.show[0]}
              </span>
            </div>
            <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
            <Ask size={19}>{ask}</Ask>
            {b.mode !== 'tuple' && <Vote key={`vote-${b.mode}`} options={opts} right={right} shown={shown} pick={pick} setPick={setPick} cols={opts.length} size={17} dense nowrap />}
          </Group>
          <Group>
            <Bag
              key={`bag-${b.mode}`}
              items={inBag}
              universe={b.mode === 'list' ? ['Ravi', 'Anu', 'Kiran'] : b.mode === 'string' ? ['A', 'n', 'a'] : ['Ravi', 'Anu']}
              w={250}
              h={128}
              doorW={118}
              size="sm"
              visitor={visitor}
              origin={origin}
              moving={fwd}
              door={b.mode !== 'tuple'}
            />
          </Group>
        </div>
      </div>
      {shown && b.mode !== 'tuple' && pick === right && <Confetti seed={vi ? 132 : 131} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
