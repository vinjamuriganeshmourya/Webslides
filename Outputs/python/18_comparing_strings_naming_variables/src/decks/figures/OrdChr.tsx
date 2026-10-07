import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, OutputPanel, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { OVER_SLOT, Speaker } from './Characters'
import { Glow } from './motion'
import { ArrowRight, BannerSlot, FnBox, Tile } from './tiles'

/**
 * ORD AND CHR, the two machines. PF 18 slides 8 and 9.
 *
 * The same picture both ways: a tile goes in on the left, the function box in
 * the middle, the answer comes out on the right, with the program that did it
 * above and its real output under the program. Anu asks, the Computer answers.
 * `ord` runs five beats, `chr` four, the reference's own.
 */

/** A snippet with what it printed, stacked: the kit's file panel over its output panel. */
export function CodeOut({ code, out, on, width = 420, rows = 2 }: { code: string; out: string; on: boolean; width?: number; rows?: number }) {
  return (
    <div className="flex flex-col gap-2" style={{ width }}>
      <CodeBlock code={code} filename="Python" chip={false} fontSize={17} rows={rows} />
      <Glow on={on} pulse={out}>
        <OutputPanel output={on ? out : ' '} fontSize={18} />
      </Glow>
    </div>
  )
}

/** in → fn( ) → out, the machine the reference draws under the program. */
function Machine({ fn, input, output, inState, outState }: { fn: string; input: ReactNode; output: ReactNode; inState: 'plain' | 'num' | 'empty'; outState: 'plain' | 'num' | 'empty' }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-4">
      <Tile size="md" ch={input} showCode={false} state={inState} />
      <ArrowRight width={48} />
      <FnBox name={fn} size={26} />
      <ArrowRight width={48} />
      <div className="relative">
        <Tile size="md" ch={output} showCode={false} state={outState} />
        <span className="absolute inset-0 grid place-items-center font-mono text-[40px] font-bold" style={{ color: colors.muted, opacity: outState === 'empty' && output === '' ? 0 : 0, transition: tween }}>
          ?
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- ord */

const ORD_ANU: Record<number, ReactNode> = {
  1: <>What number do you keep for <b>A</b>?</>,
  4: <>So what is <b>ord("a")</b>?<br />Guess first!</>,
}
const ORD_PC: Record<number, ReactNode> = {
  2: <>Ask me with <b>ord</b><br />Put the character inside</>,
  3: <><b>65</b><br />That is my number for A</>,
  5: <><b>97</b><br />Small a has its own number</>,
}

export function OrdFrame() {
  const beat = useBeats(5)
  const small = beat >= 4
  const ch = small ? 'a' : 'A'
  const n = small ? 97 : 65
  const known = beat === 3 || beat === 5
  return (
    <>
      <div className="flex items-start justify-between">
        <Speaker who="anu" tail="over" slot={OVER_SLOT} say={ORD_ANU[beat]} beatKey={beat} bubbleWidth={220} />
        <div className="flex flex-col items-center gap-3">
          <div style={{ visibility: beat >= 2 ? 'visible' : 'hidden' }}>
            <CodeOut code={`unicode_value = ord("${ch}")\nprint(unicode_value)`} out={String(n)} on={known} />
          </div>
          <Machine fn="ord" input={ch} output={known ? n : beat >= 4 ? '?' : ''} inState="plain" outState={known ? 'num' : beat >= 4 ? 'plain' : 'empty'} />
          <BannerSlot on={beat >= 5} className="w-[560px]">
            ord(character) gives its Unicode value
          </BannerSlot>
        </div>
        <Speaker who="computer" look="3d" tail="over" slot={OVER_SLOT} say={ORD_PC[beat]} beatKey={beat} bubbleWidth={230} />
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* -------------------------------------------------------------------- chr */

const CHR_ANU: Record<number, ReactNode> = {
  1: <>Now the other way<br />I give you a number</>,
  3: <>And <b>chr(100)</b>? Guess first!</>,
}
const CHR_PC: Record<number, ReactNode> = {
  2: <><b>75</b> is K<br />Use chr for number to character</>,
  4: <><b>100</b> is small d</>,
}

export function ChrFrame() {
  const beat = useBeats(4)
  const second = beat >= 3
  const n = second ? 100 : 75
  const ch = second ? 'd' : 'K'
  const known = beat === 2 || beat === 4
  return (
    <>
      <div className="flex items-start justify-between">
        <Speaker who="anu" tail="over" slot={OVER_SLOT} say={CHR_ANU[beat]} beatKey={beat} bubbleWidth={220} />
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4" style={{ visibility: beat >= 2 ? 'visible' : 'hidden' }}>
            <CodeOut code={'char = chr(75)\nprint(char)'} out="K" on={beat >= 2} width={290} />
            <div style={{ visibility: second ? 'visible' : 'hidden' }}>
              <CodeOut code={'char = chr(100)\nprint(char)'} out="d" on={beat >= 4} width={290} />
            </div>
          </div>
          <Machine fn="chr" input={n} output={known ? ch : '?'} inState="num" outState={known ? 'plain' : 'plain'} />
          <BannerSlot on={beat >= 4} className="w-[700px]" size={20}>
            ord: character to number.&nbsp;&nbsp; chr: number to character.
          </BannerSlot>
        </div>
        <Speaker who="computer" look="3d" tail="over" slot={OVER_SLOT} say={CHR_PC[beat]} beatKey={beat} bubbleWidth={230} />
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
