import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { OVER_SLOT, Speaker } from './Characters'
import { BannerSlot, Tile, TileRow } from './tiles'

/**
 * UNICODE: WHAT YOU SEE, WHAT IT STORES. PF 18 slide 7.
 *
 * Anu presses a key, the Computer says what it keeps. Four characters land one
 * at a time in the `What you see` row, each with an arrow down to the number
 * the computer stores, and the fifth beat names the number: the character's
 * Unicode value. Five beats, the reference's own.
 */
const CHARS = [
  { ch: 'A', n: 65, at: 1 },
  { ch: 'z', n: 122, at: 3 },
  { ch: '1', n: 49, at: 4 },
  { ch: '*', n: 42, at: 4 },
]

const ANU: Record<number, React.ReactNode> = {
  1: <>I press <b>A</b> on my keyboard</>,
  3: <>And small <b>z</b>?</>,
  4: <>What about <b>1</b> and * ?</>,
}
const PC: Record<number, React.ReactNode> = {
  2: <>I keep it as <b>65</b><br />I only understand numbers</>,
  3: <>z is <b>122</b><br />A different number from Z</>,
  4: <>1 is <b>49</b><br />* is <b>42</b><br />A digit is a character too</>,
  5: <>Every character has its own number</>,
}

export function UnicodeIntro() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const numbers = (k: number) => (k === 0 ? beat >= 2 : beat >= CHARS[k].at)
  return (
    <>
      <div className="flex items-start justify-between">
        {/* 220 and not 210, as slides 8 and 9: the column is the bubble's width and
            Anu is centred in it, so 210 stood her 5px to the left of where she
            stands on the next slide. The slot holds the tallest Computer line. */}
        <Speaker who="anu" tail="over" slot={OVER_SLOT} say={ANU[beat]} beatKey={beat} bubbleWidth={220} />
        <div className="flex flex-col items-start pt-1">
          <p className="mb-2 text-[17px] font-bold" style={{ color: colors.body }}>What you see</p>
          <TileRow size="md">
            {CHARS.map((c) => (
              <Tile key={c.ch} size="md" ch={beat >= c.at ? c.ch : ''} showCode={false} state={beat >= c.at ? 'plain' : 'empty'} />
            ))}
          </TileRow>
          <TileRow size="md" className="h-[40px] items-center">
            {CHARS.map((c, k) => (
              <svg key={c.ch} width="72" height="36" viewBox="0 0 88 36" aria-hidden style={{ opacity: numbers(k) ? 1 : 0, transition: tween }}>
                <path d="M44 2V22" stroke={colors.brand} strokeWidth="4" strokeLinecap="round" />
                <path d="M34 20L44 34L54 20Z" fill={colors.brand} />
              </svg>
            ))}
          </TileRow>
          <p className="mb-2 text-[17px] font-bold" style={{ color: colors.body }}>What the computer stores</p>
          <TileRow size="md">
            {CHARS.map((c, k) => (
              <Tile key={c.ch} size="md" ch={numbers(k) ? c.n : ''} showCode={false} state={numbers(k) ? 'num' : 'empty'} />
            ))}
          </TileRow>
          <BannerSlot on={beat >= 5} className="mt-4 w-[600px]" sub={<>What you see: A.&nbsp;&nbsp; What the computer stores: 65.</>}>
            This number is the character's Unicode value
          </BannerSlot>
        </div>
        <Speaker who="computer" look="3d" tail="over" slot={OVER_SLOT} say={PC[beat]} beatKey={beat} bubbleWidth={230} />
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
