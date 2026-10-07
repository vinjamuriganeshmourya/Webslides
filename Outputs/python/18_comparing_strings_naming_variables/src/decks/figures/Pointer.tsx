import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { useDeck } from '@/deck/DeckContext'
import { StepControls } from './controls'
import { Lines } from './common'
import { WordCompare, walk } from './compare'

/**
 * FOLLOW THE POINTER: LETTER BY LETTER. PF 18 slide 14.
 *
 * `"BAD" >= ` a second word the slider picks (BAT, CAT, BAC, BA, bad), one
 * pair per `One step`. Four beats as the reference has: predict, then up to
 * three pairs; a word that decides on its first pair stops there and the last
 * presses hold. Moving the slider changes the word AND walks the deck back to
 * beat 1, the reference's own behaviour, so the room predicts again.
 */
const WORDS = ['BAT', 'CAT', 'BAC', 'BA', 'bad'] as const

export function Pointer() {
  const beat = useBeats(4)
  const deck = useDeck()
  const tween = useTween(360)
  const [wi, setWi] = useState(0)
  const w = WORDS[wi]
  const { steps } = walk('BAD', w, '>=')
  const at = Math.min(beat - 1, steps.length)
  const pick = (i: number) => {
    setWi(i)
    for (let k = beat; k > 1; k--) deck.prev()
  }
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[400px] shrink-0 flex-col gap-4">
          <CodeBlock code={`print("BAD" >= "${w}")`} filename="Python" chip={false} fontSize={18} rows={1} />
          <div className="min-h-[96px]">
            {beat === 1 ? (
              <p className="text-[21px] leading-snug" style={{ color: colors.body }}>
                <Lines lines={['Before we press: True or False?', 'Say it out loud']} />
              </p>
            ) : (
              <p className="rounded-xl px-4 py-2.5 text-[16px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
                <Lines lines={['Python starts at the left', 'It looks at one pair of letters at a time, and stops at the first pair that is different']} />
              </p>
            )}
          </div>
          {/* the slider: pick the second word */}
          <div className="rounded-2xl bg-white px-4 pb-2 pt-3" style={{ border: `1.5px solid ${colors.line}`, boxShadow: '0 6px 24px -10px rgba(0,37,75,0.16)' }}>
            <p className="text-[16px] font-bold" style={{ color: colors.body }}>the second word</p>
            <input
              type="range"
              min={0}
              max={WORDS.length - 1}
              step={1}
              value={wi}
              aria-label="the second word"
              onChange={(e) => pick(Number(e.target.value))}
              /* the deck's arrow keys stay the deck's: the slider is a mouse control */
              onKeyDown={(e) => e.currentTarget.blur()}
              className="mt-1 w-full"
              style={{ accentColor: colors.brand }}
            />
            <div className="mt-1 flex justify-between">
              {WORDS.map((word, i) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => pick(i)}
                  onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                  className="sm-tap rounded-md px-1.5 py-0.5 font-mono text-[16px] font-bold"
                  style={{ color: i === wi ? colors.brandDark : colors.success, background: i === wi ? colors.surface2 : 'transparent', transition: tween }}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>
        <WordCompare key={w} a="BAD" b={w} op=">=" at={at} size="md" className="min-w-0 flex-1" />
      </div>
      <StepControls at={beat} total={4} nextLabel="One step" />
    </>
  )
}
