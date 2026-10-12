import { useState } from 'react'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, toRows, type Row, type RowTone, type Search } from './board'
import { BoardCard } from './frame'
import { SPEC } from './spec'

/**
 * CHANGING THE BOARD: C8 (add or change: the same line), C9 (del wipes a
 * row). A new key is written at the bottom; a changed value is a sticker
 * over the old one in the same row; a wiped row leaves with its card and
 * the rows below close up. Every program and output is the spec's, run on
 * CPython 3.12.3.
 */
const LANE = 118

/* ------------------------------------------------------------------ C8 */

const C8 = SPEC.C8
const [ADD_CHANGE, CAPITAL] = C8.code as { file: string; src: string; output: string }[]
const OPTS8: string[] = C8.show.slice(1, 4)
const RIGHT8 = OPTS8.indexOf(ADD_CHANGE.output)
const START8: Row[] = toRows([['tea', 12], ['samosa', 15]])

/**
 * C8, four presses: add_change.py beside a two-row board and the vote.
 * Press 2 runs line 2: no bun tag, so a new row at the bottom. Press 3 runs
 * line 3: the tea tag is there, so 14 is stuck over 12 in tea's own row,
 * and the output fills. Press 4 is capital_tea.py: Tea with a capital T is
 * a new name, so a fourth row, and 4.
 */
export function AddChange() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 3
  const rows: Row[] = [...START8]
  const tones: Record<string, RowTone> = {}
  let stuck: string[] = []
  if (beat >= 2) {
    rows.push({ key: 'bun', value: 10 })
    if (beat === 2) tones.bun = 'new'
  }
  if (beat >= 3) {
    rows[0] = { key: 'tea', value: 14 }
    stuck = ['tea']
  }
  if (beat >= 4) {
    rows.push({ key: 'Tea', value: 16 })
    tones.Tea = 'new'
  }
  const prog = beat >= 4 ? CAPITAL : ADD_CHANGE
  const out = beat === 3 ? [{ text: ADD_CHANGE.output }] : beat === 4 ? [{ text: CAPITAL.output }] : []
  const caption = beat === 1 ? C8.show[0] : beat === 2 ? 'bun is new. New row, at the end.' : beat === 3 ? C8.show[4] : C8.show[5]
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={beat >= 4 ? 5 : 4}
        at={beat === 2 ? 2 : beat === 3 ? 3 : beat === 4 ? 4 : null}
        asking={beat === 1}
        ask={beat === 1 ? C8.show[0] : undefined}
        vote={beat <= 3 ? <Vote options={OPTS8} right={RIGHT8} shown={shown} pick={pick} setPick={setPick} cols={2} spans={{ 0: 2 }} size={14} nowrap dense /> : undefined}
        out={out}
        board={<Board rows={rows} tones={tones} stuck={stuck} size="lg" name="menu" minRows={4} />}
        boardActive={beat >= 2}
        caption={caption}
        captionTone={beat >= 3 ? 'rule' : 'step'}
        codeW={770}
      />
      {shown && pick === RIGHT8 && <Confetti seed={18} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C9 */

const C9 = SPEC.C9
const [MAGGI_OVER, MAGGI_TWICE] = C9.code as { file: string; src: string; output: string }[]
const START9: Row[] = toRows([['tea', 12], ['samosa', 15], ['maggi', 30]])

/**
 * C9, three presses: maggi_over.py beside the board tea, samosa, maggi.
 * Press 2 wipes the maggi row, tag and card together, and the output
 * fills. Press 3 is maggi_twice.py: the second del looks for a maggi tag,
 * finds none, and stops: KeyError: 'maggi'.
 */
export function Delete() {
  const beat = useBeats(3)
  const rows = beat >= 2 ? START9.filter((r) => r.key !== 'maggi') : START9
  const walk = useStepPhase(beat, [300, 420, 420])
  const search: Search | null = beat === 3 && walk > 0 ? (walk >= 3 ? { label: '"maggi"', at: 2, miss: 'alarm' } : { label: '"maggi"', at: walk - 1 }) : null
  const prog = beat >= 3 ? MAGGI_TWICE : MAGGI_OVER
  const out = beat === 2 ? MAGGI_OVER.output.split('\n').map((t: string) => ({ text: t })) : beat === 3 ? [{ text: MAGGI_TWICE.output, tone: 'error' as const }] : []
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={4}
        at={beat === 2 ? 2 : beat === 3 ? 3 : null}
        stop={beat === 3}
        asking={beat === 1}
        out={out}
        outMinRows={2}
        board={<Board rows={rows} size="lg" name="menu" minRows={3} search={search} lane={LANE} />}
        boardActive={beat >= 2}
        caption={beat === 1 ? C9.show[0] : beat === 2 ? C9.show[1] : C9.show[2]}
        captionTone={beat === 2 ? 'rule' : 'step'}
      />
      <StepControls at={beat} total={3} />
    </>
  )
}
