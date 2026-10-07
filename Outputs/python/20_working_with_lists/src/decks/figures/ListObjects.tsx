import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Memory, type MNode, type MRef, type MTag } from './memory'
import { Ask, BigLine, OutPanel, Show } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { ExampleNote } from './Objects'
import { SPEC } from './spec'

/**
 * A LIST IS AN OBJECT; TWO LISTS OR ONE: C7, C8, C9.
 *
 * C7 builds the picture the rest of the session uses, one part per press, as
 * the original deck's slides 29 to 32 do: three item cubes, the list object's
 * three slots each with an arrow down to a cube, the tag, and then the cubes
 * rise into their slots as the long form shrinks to the short one: tag,
 * arrow, one row of boxes. C8 and C9 are the hook's two ways in that
 * picture: two tags into two rows (Way B), two tags into ONE row (Way A).
 */

/* ------------------------------------------------------------------ C7 */

const SLOT_W = 64
const ROW_X = 250
const ROW_Y = 14
const CUBE_Y = 150

export function ListObject() {
  const beat = useBeats(4)
  const src = SPEC.C7.code[0].src as string
  const short = beat >= 4
  const nodes: MNode[] = []
  const refs: MRef[] = []
  ;['1', '2', '3'].forEach((v, i) => {
    const cx = ROW_X + i * (SLOT_W - 2) + SLOT_W / 2
    nodes.push({
      id: `c${v}`,
      kind: 'cube',
      text: v,
      size: 'md',
      x: short ? ROW_X + i * (SLOT_W - 2) + 8 : cx - 24,
      y: short ? ROW_Y : CUBE_Y,
      fade: short ? 0 : 1,
      delay: beat === 1 ? i * 0.13 : 0,
    })
    if (beat >= 2) refs.push({ from: 'L', slot: i, to: `c${v}`, fade: short ? 0 : 1, delay: beat === 2 ? 0.3 + i * 0.13 : 0 })
  })
  if (beat >= 2) nodes.push({ id: 'L', kind: 'row', x: ROW_X, y: ROW_Y, boxW: SLOT_W, size: 'md', items: short ? ['1', '2', '3'] : [{ ref: 'c1' }, { ref: 'c2' }, { ref: 'c3' }] })
  const tags: MTag[] = beat >= 3 ? [{ name: 'list_a', x: 0, y: ROW_Y + 7, to: 'L' }] : []
  const captions = ['Each item is an object.', 'The list holds an arrow to each item.', 'list_a points at the list.', 'We draw it like this.']
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <CodePane code={src} at={1} fontSize={20} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Memory width={620} height={210} nodes={nodes} tags={tags} refs={refs} size="md" />
          <StepCaption line={short ? null : 1} text={captions[beat - 1]} tone={short ? 'rule' : 'step'} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C8 */

export function TwoLists() {
  const beat = useBeats(3)
  const src = SPEC.C8.code[0].src as string
  const [pick, setPick] = useState(-1)
  const shown = beat >= 3
  const nodes: MNode[] = beat >= 2
    ? [
        { id: 'L1', kind: 'row', x: 230, y: 14, items: ['1', '2', '3'], size: 'md' },
        { id: 'L2', kind: 'row', x: 230, y: 124, items: ['1', '2', '3'], size: 'md', delay: 0.65 },
      ]
    : []
  const tags: MTag[] = beat >= 2
    ? [
        { name: 'list_a', x: 0, y: 21, to: 'L1' },
        { name: 'list_b', x: 0, y: 131, to: 'L2', delay: 0.65 },
      ]
    : []
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <CodePane code={src} at={beat === 1 ? null : beat === 2 ? 2 : 4} fontSize={18} />
          <OutPanel lines={shown ? [{ text: '139637858236800' }, { text: '139637857505984' }] : []} minRows={2} fontSize={18} />
          <ExampleNote on={shown} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={22}>Will the two ids be the same?</Ask>
          <div className="w-[360px]">
            <Vote options={['Same', 'Different']} right={1} shown={shown} pick={pick} setPick={setPick} />
          </div>
          <Memory width={620} height={180} nodes={nodes} tags={tags} size="md" />
          <StepCaption text={beat === 2 ? 'Two sets of brackets, two lists.' : beat === 3 ? 'Same values, but two lists. Like Way B in the hook.' : null} tone={beat === 3 ? 'rule' : 'step'} />
        </div>
      </div>
      {shown && pick === 1 && <Confetti seed={8} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C9 */

/**
 * C9: the line `list_b = list_a` is written only after the room has tried
 * (its must line): press 1 shows line 1 alone and the question; press 2 brings
 * line 2 in, the biggest text on the card, with list_b's arrow into the SAME
 * row; press 3 runs lines 3 and 4.
 */
export function SecondName() {
  const beat = useBeats(3)
  const full = SPEC.C9.code[0].src as string
  const lines = full.split('\n')
  const code = lines.slice(0, beat === 1 ? 1 : beat === 2 ? 2 : 4).join('\n')
  const nodes: MNode[] = [{ id: 'L1', kind: 'row', x: 230, y: 68, items: ['1', '2', '3'], size: 'md' }]
  const tags: MTag[] = [{ name: 'list_a', x: 0, y: 14, to: 'L1' }]
  if (beat >= 2) tags.push({ name: 'list_b', x: 0, y: 128, to: 'L1' })
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <div className="flex h-[64px] items-center">
            {beat >= 2 ? (
              <BigLine size={34} k={beat}>
                {lines[1]}
              </BigLine>
            ) : (
              <span className="grid h-[58px] w-[300px] place-items-center rounded-2xl font-mono text-[28px] font-bold" style={{ border: `2px dashed ${colors.line}`, color: colors.muted }}>
                ?
              </span>
            )}
          </div>
          <CodePane code={code} at={beat === 1 ? 1 : beat === 2 ? 2 : 4} fontSize={18} rows={4} />
          <OutPanel lines={beat >= 3 ? [{ text: '140334087715264' }, { text: '140334087715264' }] : []} minRows={2} fontSize={18} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={22}>I want list_b to be this same list. What do I write?</Ask>
          <Memory width={620} height={170} nodes={nodes} tags={tags} size="md" />
          <Show on={beat >= 3}>
            <ExampleNote />
          </Show>
          <StepCaption text={beat === 2 ? 'No brackets on the right, so no new list.' : beat === 3 ? 'Two names. One list.' : null} tone={beat === 3 ? 'rule' : 'step'} />
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
