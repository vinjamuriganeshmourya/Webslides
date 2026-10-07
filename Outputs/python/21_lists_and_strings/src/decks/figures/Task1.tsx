import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { OutPanel, Steps, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption } from './trace'
import { PieceRow, Tiles, splitStates, type TileState } from './tiles21'
import { literal, piecesOf } from './Split'
import { SPEC } from './spec'

/**
 * WORKSHEET TASK 1: COUNT THE CANTEEN ORDERS. Spec card T1, four presses, 5:00.
 *
 * Press 1: the story, both programs, the steps and the timer. Nothing about
 * any output shows until the room has run them (its must line). Press 2:
 * orders_a runs, the knife's cuts as in E1, four boxes with one empty, and
 * `4`. Press 3: the fix the room types, line 1 without the extra comma, and
 * `3`. Press 4: orders_b runs; the space after each comma stays in its piece,
 * lit in the tiles and in the boxes. The fixed program's output was run on
 * CPython (plan, outputs table); every other line is the spec's.
 */
const T1 = SPEC.T1
const A = T1.code[0]
const B = T1.code[1]
/* the fix, as the spec's answer writes it: `Fixed line 1: orders = "dosa,idli,vada"` */
const FIX_LINE: string = (T1.answer as string).match(/Fixed line 1: (orders = "[^"]*")/)![1]
const A_FIXED = [FIX_LINE, ...A.src.split('\n').slice(1)].join('\n')
const A_FIXED_OUT = "['dosa', 'idli', 'vada']\n3"

export function Task1() {
  const beat = useBeats(4)
  const prog = beat === 4 ? B : { src: beat >= 3 ? A_FIXED : A.src, output: beat >= 3 ? A_FIXED_OUT : A.output }
  const ran = beat >= 2
  const str = literal(prog.src)
  const out: string = ran ? prog.output : ''
  const pieces = ran ? piecesOf(out.split('\n')[0]) : []
  const states: Record<number, TileState> = ran ? splitStates(str, ',') : {}
  if (beat === 4) [...str].forEach((c, i) => c === ' ' && (states[i] = 'lit'))
  const caption = beat === 2 ? 'Three dishes, but len says 4.' : beat === 3 ? 'Line 1 without the extra comma: len prints 3.' : beat === 4 ? 'The space after each comma stays in the piece.' : null
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[500px] shrink-0 flex-col gap-3">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T1.show[1])} />
          </p>
          <CodePane code={beat >= 3 ? A_FIXED : A.src} at={beat === 2 || beat === 3 ? 4 : null} highlight={beat === 3 ? 1 : undefined} fontSize={15} rows={4} />
          <CodePane code={B.src} at={beat === 4 ? 3 : null} fontSize={15} rows={3} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <TaskPill>{T1.show[0]}</TaskPill>
              <Steps size={18} items={sentences(T1.show[2])} />
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <Tiles key={str} chars={[...str]} size="sm" states={states} lane={false} />
          <PieceRow key={beat} pieces={pieces} size="sm" lit={beat === 2 ? [2] : []} litSpaces={beat === 4} stagger={140} />
          <OutPanel lines={out ? out.split('\n').map((t) => ({ text: t })) : []} minRows={2} fontSize={15} />
          <StepCaption text={caption} tone={beat === 4 ? 'rule' : 'step'} size={17} minH={46} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
