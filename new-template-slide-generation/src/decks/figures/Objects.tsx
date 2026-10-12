import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti, Glow } from './motion'
import { Memory, type MNode, type MTag } from './memory'
import { Ask, OutPanel, Show } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { SPEC } from './spec'

/**
 * OBJECTS AND ID: C4, C5, C6.
 *
 * An id is never typed as an answer (spec note): ids change on every run. The
 * numbers on these cards are the original deck's own examples (its slides 16
 * to 27), and every card that shows one says so under the picture: `Every id
 * here is an example` / `your number will be different`.
 */
export const ID_HELLO = '140589419285168'
export const ID_WORLD = '140708394752368'
export const ID_HELLO_WORLD = '140708395477552'

export function ExampleNote({ on = true }: { on?: boolean }) {
  return (
    <p className="text-[15px] font-semibold italic leading-snug" style={{ color: colors.muted, opacity: on ? 1 : 0, transition: 'opacity 420ms' }}>
      Every id here is an example: your number will be different
    </p>
  )
}

const idNote = (n: string) => <>id {n}</>

/* ------------------------------------------------------------------ C4 */

/**
 * C4: run it twice. The program, the question; then two example outputs, one
 * per run, two different numbers.
 */
export function IdTwice() {
  const beat = useBeats(2)
  const src = SPEC.C4.code[0].src as string
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[520px] shrink-0 flex-col gap-4">
          <CodePane code={src} fontSize={24} />
          <Ask size={24}>Run it twice. Same number both times?</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Show on={beat >= 2}>
            <div className="flex gap-4">
              <OutPanel title="Output · run 1" lines={beat >= 2 ? [{ text: ID_HELLO }] : []} fontSize={22} className="flex-1" />
              <OutPanel title="Output · run 2" lines={beat >= 2 ? [{ text: ID_HELLO_WORLD }] : []} fontSize={22} className="flex-1" />
            </div>
          </Show>
          <ExampleNote on={beat >= 2} />
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ------------------------------------------------------------------ C5 */

/**
 * C5: first the object, then the name. Line 1 makes `"Hello"` with its id
 * label and no name; the tag `a` arrives with its arrow (the arrow goes from
 * the name to the object; the name never sits inside it); line 2 prints the
 * same number as the label, and the two light together.
 */
export function NamePoints() {
  const beat = useBeats(3)
  const src = SPEC.C5.code[0].src as string
  const nodes: MNode[] = [{ id: 'hello', kind: 'obj', text: '"Hello"', x: 240, y: 40, size: 'lg', note: idNote(ID_HELLO) }]
  const tags: MTag[] = beat >= 2 ? [{ name: 'a', x: 0, y: 49, to: 'hello' }] : []
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <CodePane code={src} at={beat >= 3 ? 2 : 1} fontSize={22} />
          <Glow on={beat >= 3} color={colors.success}>
            <OutPanel lines={beat >= 3 ? [{ text: ID_HELLO }] : []} minRows={1} fontSize={20} />
          </Glow>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Memory width={600} height={150} nodes={nodes} tags={tags} size="lg" />
          <ExampleNote />
          <StepCaption text={beat === 2 ? 'First the object. Then the name points at it.' : beat >= 3 ? 'id(a) is the id of what a points at.' : 'Python makes the object first.'} />
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C6 */

/**
 * C6: same id, or a new one? One part of line 3 per press, in the spec's
 * order: `" World"`, then `"Hello World"`, then a's arrow lifts and lands.
 * The two objects left with no name grey out and stay grey for the rest of
 * the card. The vote marks on line 4's output.
 */
export function NewObject() {
  const beat = useBeats(5)
  const src = SPEC.C6.code[0].src as string
  const [pick, setPick] = useState(-1)
  const moved = beat >= 4
  const nodes: MNode[] = [{ id: 'hello', kind: 'obj', text: '"Hello"', x: 210, y: 14, size: 'md', note: idNote(ID_HELLO), grey: moved }]
  if (beat >= 2) nodes.push({ id: 'world', kind: 'obj', text: '" World"', x: 420, y: 14, size: 'md', note: idNote(ID_WORLD), grey: moved })
  if (beat >= 3) nodes.push({ id: 'hw', kind: 'obj', text: '"Hello World"', x: 210, y: 110, size: 'md', note: idNote(ID_HELLO_WORLD) })
  const tags: MTag[] = [{ name: 'a', x: 0, y: 21, to: moved ? 'hw' : 'hello' }]
  const line = beat === 1 ? 2 : beat <= 4 ? 3 : 4
  const out = [{ text: ID_HELLO }, ...(beat >= 5 ? [{ text: ID_HELLO_WORLD }] : [])]
  const captions = [
    'Will the two ids be the same?',
    'Python makes " World" first.',
    '"Hello" is not changed.',
    'a moved. Nothing points at the old ones now.',
    '+ makes a new object. a moves to it.',
  ]
  const shown = beat >= 5
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <CodePane code={src} at={line} fontSize={18} />
          <OutPanel lines={out} minRows={2} fontSize={18} />
          <ExampleNote />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={22}>Will the two ids be the same?</Ask>
          <div className="w-[360px]">
            <Vote options={['Same', 'Different']} right={1} shown={shown} pick={pick} setPick={setPick} />
          </div>
          <Memory width={620} height={194} nodes={nodes} tags={tags} size="md" />
          <StepCaption line={beat === 1 ? null : line} text={beat === 1 ? null : captions[beat - 1]} tone={beat === 5 ? 'rule' : 'step'} />
        </div>
      </div>
      {shown && pick === 1 && <Confetti seed={6} />}
      <StepControls at={beat} total={5} />
    </>
  )
}
