import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, BigLine, OutPanel, Show, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { PieceRow, Tiles, sepStates, splitStates } from './tiles21'
import { literal, piecesOf } from './Split'
import { SPEC } from './spec'

/**
 * THE JOIN CARDS: C6 (cut at a, glue with a) and C7 (join needs strings).
 *
 * C6: the sentence as tiles with every a lit; the cut, the five pieces drop
 * into boxes; glue_a's line 2 arrives at the top, the biggest text, only
 * after the room has tried (its must line); then an a tile drops into every
 * gap between two pieces and none at the ends. C7: the vote, then Python's
 * error exactly, with item 0, the number 0, shaking in its box. Code and
 * outputs are the spec's.
 */

/* ------------------------------------------------------------------- C6 */

const C6 = SPEC.C6
const CUT = C6.code[0]
const GLUE = C6.code[1]
const SENTENCE = literal(CUT.src)
const PIECES = piecesOf(CUT.output)
const GLUE_LINE = (GLUE.src as string).split('\n')[1]

export function JoinGlue() {
  const beat = useBeats(4)
  const glueProg = beat >= 3
  const prog = glueProg ? GLUE : CUT
  const ran = beat === 2 || beat === 4
  const caption = beat === 2 ? C6.show[0] : beat === 4 ? C6.show[1] : null
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex h-[66px] items-end">
          {glueProg ? (
            <BigLine k="glue" size={34}>
              {GLUE_LINE}
            </BigLine>
          ) : (
            <Tiles chars={[...SENTENCE]} size="sm" states={beat >= 2 ? splitStates(SENTENCE, 'a') : sepStates(SENTENCE, 'a')} lane={false} />
          )}
        </div>
        <PieceRow pieces={beat >= 2 ? PIECES : []} glue="a" glueOn={beat >= 4} stagger={beat === 2 ? 160 : 0} />
        <div className="flex items-start gap-7">
          <div className="w-[640px] shrink-0">
            <CodePane code={prog.src} at={ran ? 3 : null} highlight={beat === 3 ? 2 : undefined} fontSize={15.5} rows={3} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <OutPanel lines={ran ? [{ text: prog.output }] : []} minRows={1} fontSize={16} />
            <StepCaption text={caption} tone={beat === 4 ? 'rule' : 'step'} size={18} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------- C7 */

const C7 = SPEC.C7
const NUMS = ['0', '1', '2', '3'] /* list(range(4)) */

export function JoinNumbers() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex items-start gap-9">
        <div className="flex w-[580px] shrink-0 flex-col gap-3">
          <CodePane code={C7.code[0].src} at={shown ? 2 : null} stop={shown} fontSize={18} rows={3} />
          <OutPanel title="Terminal" lines={shown ? [{ text: C7.code[0].output, tone: 'error' }] : []} minRows={1} fontSize={14} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Ask size={24}>{sentences(C7.show[0])[0]}</Ask>
          <div className="w-[420px]">
            <Vote options={['0,1,2,3', <span className="font-body">an error</span>]} right={1} shown={shown} pick={pick} setPick={setPick} size={19} />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[18px] font-bold" style={{ color: colors.brandDark }}>
              list_a
            </span>
            <PieceRow pieces={NUMS} plain bad={shown ? [0] : []} />
          </div>
          <Show on={shown}>
            <StepCaption text={C7.show[1]} tone="rule" size={19} />
          </Show>
        </div>
      </div>
      {shown && pick === 1 && <Confetti seed={15} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
