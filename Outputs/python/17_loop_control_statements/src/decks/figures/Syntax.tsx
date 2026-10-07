import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Callout, CodeBlock, type CodeLineState } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { Reveal, RevealGroup } from '@/motion/Reveal'

/**
 * THE ORIGINAL DECK'S OWN FRAMES, the `.slide` cards the reference keeps
 * between its activity panels (reference cards 9, 10, 14, 20, 21, 24, 27;
 * the original deck's slides 16, 17, 35, 58, 59, 76, 84). Static: each
 * arrives whole, text and figure together (content rule 6). Cards 25 and 26
 * (the growth-stage program and its empty-block error) left this file on
 * the feedback of 2026-10-06: they are rounds 1 and 2 of `PassGame`.
 *
 * THE SHAPE of break, continue and pass, drawn as the reference draws it: a
 * code panel with the statement's line marked, the line after the loop in
 * the warm tone, a loop-back arrow on the lines the loop repeats, and short
 * labels on leader lines to the right of the lines they name. That is the
 * kit's `CodeBlock` with `lines`, `loop` and `labels`, so nothing here is new
 * markup. The panel says `Python` (content rule 31), not the reference's
 * `break.py`, `continue.py`, `pass.py`, `growth.py`, `pass_loop.py`.
 *
 * ONE ALIGNMENT PER SLIDE. The kit's lead is left-aligned at x 64, so every
 * figure here starts at x 64 too. The first cut centred the figures under a
 * left lead and the user read it as mixed alignment (2026-10-05): a slide's
 * blocks share one alignment, and a code explanation's is the left edge, as
 * on every other code slide in this deck. Nothing here uses `mx-auto`.
 *
 * Every output is a real run (CPython 3.12.3): `pass` in the loop prints
 * 0 to 4 for input 5.
 */

const CODE_FONT = 19
const LABEL_ROOM = 300

/** The code panel with room for its labels, on the slide's left edge like the lead above it. */
function Shape({ code, rows, lines, loop, labels, width = 600 }: { code: string; rows: number; lines?: Record<number, CodeLineState>; loop?: [number, number]; labels?: Record<number, string>; width?: number }) {
  return (
    <RevealGroup stagger={0.2}>
      <Reveal dir="up">
        <div style={{ width: width + (labels ? LABEL_ROOM : 0) }}>
          <div style={{ width }}>
            <CodeBlock code={code} filename="Python" chip={false} fontSize={CODE_FONT} rows={rows} lines={lines} loop={loop} labels={labels} />
          </div>
        </div>
      </Reveal>
    </RevealGroup>
  )
}

/* ------------------------------------------------------------------ break */

/** Reference card 9: break makes the program leave a loop early. */
export function BreakShape() {
  return (
    <Shape
      code={'while condition_a:\n    statement_1\n    break\n    statement_2\nstatement_after_loop'}
      rows={5}
      lines={{ 3: 'mark', 5: 'warn' }}
      loop={[1, 2]}
      labels={{ 3: 'leave the loop now', 4: 'never runs', 5: 'runs next' }}
    />
  )
}

/** Reference card 10: most of the time, break sits inside an if. */
export function BreakInIf() {
  return (
    <Shape
      code={'for item in sequence:\n    statement_1\n    if condition_b:\n        break\n    statement_2\nstatement_after_loop'}
      rows={6}
      lines={{ 4: 'mark', 6: 'warn' }}
      loop={[1, 5]}
      labels={{ 3: 'is it True?', 4: 'yes: leave the loop', 6: 'runs next' }}
    />
  )
}

/** Reference card 14: break in the inner loop stops only the inner loop. */
export function BreakNested() {
  return (
    <Shape
      code={'for item_a in sequence_a:\n    for item_b in sequence_b:\n        if condition:\n            break\n        statement_1\n    statement_2'}
      rows={6}
      lines={{ 4: 'mark', 6: 'warn' }}
      loop={[1, 6]}
      labels={{ 2: 'inner loop', 4: 'leave the inner loop', 6: 'outer loop goes on' }}
    />
  )
}

/* --------------------------------------------------------------- continue */

/** Reference card 20: continue skips the rest of this pass. */
export function ContinueShape() {
  return (
    <Shape
      code={'while condition_a:\n    statement_1\n    continue\n    statement_2\nstatement_after_loop'}
      rows={5}
      lines={{ 3: 'mark' }}
      loop={[1, 3]}
      labels={{ 3: 'back to the top', 4: 'skipped this pass' }}
    />
  )
}

/** Reference card 21: most of the time, continue sits inside an if. */
export function ContinueInIf() {
  return (
    <Shape
      code={'for item in sequence:\n    statement_1\n    if condition:\n        continue\n    statement_2\nstatement_after_loop'}
      rows={6}
      lines={{ 4: 'mark' }}
      loop={[1, 4]}
      labels={{ 3: 'is it True?', 4: 'yes: next pass', 5: 'skipped this pass' }}
    />
  )
}

/* ------------------------------------------------------------------- pass */

/** Two blocks side by side from the left edge, vertically centred on each other: the code and what goes with it. */
function Pair({ left, right, leftWidth = 560, gap = 40 }: { left: ReactNode; right: ReactNode; leftWidth?: number; gap?: number }) {
  return (
    <RevealGroup className="flex items-center" style={{ gap }} stagger={0.2}>
      <Reveal dir="up">
        <div style={{ width: leftWidth }}>{left}</div>
      </Reveal>
      <Reveal dir="up">{right}</Reveal>
    </RevealGroup>
  )
}

/** Reference card 24: pass holds the place of a block. */
export function PassShape() {
  return (
    <Pair
      left={<CodeBlock code={'if condition_a:\n    block_1\nelif condition_b:\n    pass\nelse:\n    block_3'} filename="Python" chip={false} fontSize={CODE_FONT} rows={6} lines={{ 4: 'mark' }} />}
      right={
        <div className="w-[440px]">
          <Callout kind="note" title="When do we use it?" asStep={false}>
            When we want to test our code before the whole code is written
          </Callout>
        </div>
      }
    />
  )
}

/** Reference card 27: pass does nothing, so 3 is still printed. */
export function PassInLoop() {
  return (
    <Pair
      left={<CodeBlock code={'n = int(input())\nfor i in range(n):\n    if i == 3:\n        pass\n    print(i)'} filename="Python" chip={false} fontSize={CODE_FONT} rows={5} lines={{ 4: 'mark' }} loop={[2, 5]} />}
      right={
        <div className="flex items-start gap-5">
          <div className="w-[150px]">
            <OutputPanel output="5" kind="input" fontSize={24} />
          </div>
          <div className="w-[170px]">
            <OutputPanel output={'0\n1\n2\n3\n4'} fontSize={24} lineHeight={1.3} />
          </div>
        </div>
      }
      gap={48}
    />
  )
}

export { colors }
