import { SPEC } from './spec'
import { TraceCard, type Picture } from './trace'
import type { MNode, MTag, SpecStep } from './memory'

/**
 * THREE PREDICT-THEN-WALK CARDS: C10, C11, C12.
 *
 * Every program, step, caption and output is the spec's (`spec.ts`, built
 * from the JSON). The layouts are fixed so the arrow that must not move does
 * not move:
 *
 *   C10  list_b's tag and its row sit on one line at the bottom from line 2
 *        on, so its arrow is the same path on every press ("list_b's arrow
 *        never moves on this card"); the new row [6, 7] arrives on the top
 *        line and only list_a's arrow lifts to it.
 *   C11  list_b's second slot is an ARROW to list_a's own row, never a copy of
 *        its boxes (the spec's defect fix for the original deck's slides
 *        66 to 68). Line 3 changes the row once and both names show it.
 *   C12  a and the list's second slot both point at one cube 2; on line 4 a
 *        cube 3 appears and only a's arrow moves.
 */

const C10 = SPEC.C10
export function MoveName() {
  return (
    <TraceCard
      code={C10.code[0].src}
      steps={C10.data.steps}
      ask="What does list b print?"
      options={['[6, 7]', '[1, 2]']}
      right={1}
      revealStep={4}
      closing="= moves one name. The old list stays."
      canvas={{ w: 640, h: 184 }}
      lay={{
        rows: { L1: { x: 230, y: 116 }, L2: { x: 230, y: 10 } },
        tags: { list_a: { x: 0, y: 19 }, list_b: { x: 0, y: 125 } },
        size: 'lg',
      }}
      seed={20}
    />
  )
}

const C11 = SPEC.C11
export function NestedRef() {
  return (
    <TraceCard
      code={C11.code[0].src}
      steps={C11.data.steps}
      ask="What does print(list_b) show?"
      options={['[3, [1, 2]]', '[3, [1, 4]]']}
      right={1}
      revealStep={4}
      canvas={{ w: 640, h: 184 }}
      lay={{
        rows: { L1: { x: 230, y: 10 }, L2: { x: 230, y: 120 } },
        tags: { list_a: { x: 0, y: 19 }, list_b: { x: 0, y: 129 } },
        size: 'lg',
      }}
      seed={23}
    />
  )
}

/*
 * C12 draws a number as the original deck does: a cube. `a` is not a list, so
 * the spec's `points` leave it out; its arrow is drawn from `vars.a`. The
 * list's second slot holds an arrow to the cube a pointed at on line 2, and
 * keeps it.
 */
const C12 = SPEC.C12
function numberPicture(k: number, step: SpecStep | null): Picture {
  if (!step) return { nodes: [] }
  const nodes: MNode[] = [{ id: 'c2', kind: 'cube', text: '2', x: 250, y: 34, size: 'lg' }]
  if (step.vars?.a === '3') nodes.push({ id: 'c3', kind: 'cube', text: '3', x: 400, y: 34, size: 'lg' })
  /* a's arrow arcs over cube 2 on its way to cube 3, so it never seems to pass through it */
  const three = step.vars?.a === '3'
  const tags: MTag[] = [{ name: 'a', x: 0, y: 43, to: three ? 'c3' : 'c2', lift: three ? 92 : 0 }]
  const refs = []
  if (step.points.list_a) {
    nodes.push({ id: 'L1', kind: 'row', x: 200, y: 128, items: ['1', { ref: 'c2' }], size: 'lg' })
    tags.push({ name: 'list_a', x: 0, y: 137, to: 'L1' })
    refs.push({ from: 'L1', slot: 1, to: 'c2' })
  }
  void k
  return { nodes, tags, refs }
}

export function NumberRef() {
  return (
    <TraceCard
      code={C12.code[0].src}
      steps={C12.data.steps}
      ask="a changes. Does the list?"
      options={['[1, 2]', '[1, 3]']}
      right={0}
      revealStep={4}
      closing="The list took 2. a moved; the list did not."
      canvas={{ w: 640, h: 184 }}
      lay={{ rows: {}, tags: {}, size: 'lg' }}
      picture={numberPicture}
      seed={24}
    />
  )
}
