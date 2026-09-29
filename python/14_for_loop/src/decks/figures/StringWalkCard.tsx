import { useState } from 'react'
import { ContentSlide } from '@/slides'
import { CodeBlock, StepControls } from '@/ui'
import { SequenceWalk } from './SequenceWalk'
import { WordChooser } from './WordChooser'

/**
 * "PYTHON", ONE CHARACTER AT A TIME — the card, because it holds state.
 *
 * A slide in `forLoopDeck` is a plain element in an array and cannot own a
 * `useState`, so the one card on this deck that the room DRIVES is a component.
 *
 * Three words, and the third is the lesson. `"Python"` and `"Go"` both behave
 * the way a room expects; `""` is the case that separates understanding "once
 * for each item" from having learned "it repeats". The empty string is taught,
 * not mentioned.
 */

const WORDS = [
  { literal: '"Python"', label: 'Python' },
  { literal: '"Go"', label: 'Go' },
  { literal: '""', label: 'nothing' },
]

const SPELLED = ['zero', 'one', 'two', 'three', 'four', 'five', 'six']

function charsOf(literal: string) {
  return literal.slice(1, -1).split('')
}

export function StringWalkCard({ session, py }: { session: string; py: string }) {
  const [literal, setLiteral] = useState(WORDS[0].literal)
  const chars = charsOf(literal)
  const n = chars.length
  const spelled = SPELLED[n] ?? String(n)

  const beats = [
    {
      at: -1,
      visible: 0,
      label: 'One string',
      caption:
        n === 0
          ? 'Nothing between the quote marks. How many characters is that? Say it, then press Split it.'
          : `word holds ${literal}. Say it: is that one thing, or ${spelled}?`,
    },
    {
      at: -1,
      label: 'Split it',
      caption:
        n === 0
          ? 'No characters at all. The sequence is empty before the loop starts.'
          : `${spelled[0].toUpperCase()}${spelled.slice(1)} characters. A string is a sequence of characters.`,
    },
    ...(n > 0
      ? [
          {
            at: n - 1,
            holds: chars[n - 1],
            label: 'One at a time',
            caption: `The loop hands ch one character per pass: ${chars.join(', ')}.`,
          },
        ]
      : []),
    {
      at: n,
      holds: n > 0 ? chars[n - 1] : undefined,
      label: 'It runs out',
      caption:
        n === 0
          ? 'The loop asks for a first character. There is none, so the body never runs even once, and print("Done") is all that prints.'
          : 'The loop asks for the next character. There is none, so the loop ends and print("Done") runs.',
    },
  ]

  return (
    <ContentSlide
      kicker="A string is a sequence"
      title={'"Python", one character at a time'}
      lesson={session}
      lead="Pick a word, say how many characters it is, then press Split it."
    >
      {/* The lead is what reserves the header's floor (KIT.md: the content well
          opens at y=168). Without it this card's first row rode up over the
          title. It is one line on purpose: every pixel it takes is a pixel the
          walk loses at the bottom. */}
      {/* SIDE BY SIDE, not stacked. Stacked, the chooser, the panel, the strip,
          the slot and the caption came to ~550px on top of a 168px header, so
          the card rode up over its own title. The code and the walk are the two
          halves of one claim and read fine beside each other. */}
      <div className="grid grid-cols-[400px_minmax(0,1fr)] items-start gap-8">
        <div className="flex flex-col items-center gap-3">
          <WordChooser words={WORDS} value={literal} onChange={setLiteral} />
          <CodeBlock
            filename={py}
            showLineNumbers={false}
            code={`word = ${literal}\nfor ch in word:\n    print(ch)\nprint("Done")`}
            fontSize={16}
          />
        </div>
        <SequenceWalk
          holdsLabel="ch"
          endLabel="nothing left"
          compact
          items={chars.map((c) => ({ label: c }))}
          beats={beats}
        />
      </div>
      <StepControls className="mt-4 w-full justify-center" showCount mode="code" />
    </ContentSlide>
  )
}
