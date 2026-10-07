import { colors } from '@/design/tokens'
import { CodeBlock, TraceCaption, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { OutputPanel } from '@/ui/CodeOutput'
import { BeatFade, Lines } from './common'
import { Glow } from './motion'

/**
 * WRITING IT, ONE LINE AT A TIME. PF 16 slide 16, eight beats: start, lines 1
 * to 6, run it. The program is built one line per press in a panel that is
 * six rows tall from the first beat (`rows={6}`), so nothing under it moves
 * (pedagogy-to-components Part VII, "size for the last step"); the caption
 * for the line just written sits beside it. The last beat runs it for 3.
 *
 * `PEDAGOGY_GUIDELINES.md` section 3: nothing arrives assembled.
 * Real run (CPython 3.12.3): `1 `, `1 2 `, `1 2 3 `, each with its trailing space.
 */
const LINES = [
  'num = int(input())',
  'for row_num in range(1, num + 1):',
  '    row_out = ""',
  '    for seq_num in range(1, row_num + 1):',
  '        row_out = row_out + str(seq_num) + " "',
  '    print(row_out)',
]

const CAPS: string[][] = [
  ['Read N, the number of rows'],
  ['The outer loop: one pass for each row, from 1 up to N'],
  ['Start each row empty', 'This line runs again on every row'],
  ['The inner loop: count from 1 up to this row\'s number'],
  ['Add the number and a space to the row'],
  ['Print the row once it is built', 'It sits under the outer loop only'],
]

export function LineByLine() {
  const beat = useBeats(8)
  const tween = useTween(420)
  const written = Math.min(beat - 1, 6)
  const ran = beat === 8
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="w-[660px] shrink-0">
          <CodeBlock code={LINES.slice(0, written).join('\n') || ' '} filename="Python" chip={false} fontSize={19} rows={6} lines={written && !ran ? { [written]: 'mark' } : undefined} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
          <BeatFade beatKey={beat}>
            <TraceCaption>
              {beat === 1 ? (
                'Watch the program being written, one line at a time'
              ) : ran ? (
                <Lines lines={['Line 6', ...CAPS[5]]} />
              ) : (
                <>
                  <b>Line {written}</b>
                  <Lines lines={CAPS[written - 1]} />
                </>
              )}
            </TraceCaption>
          </BeatFade>
          <div style={{ opacity: ran ? 1 : 0, transform: ran ? 'none' : 'translateY(8px)', transition: tween }}>
            <p className="mb-1.5 text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>It prints, for 3</p>
            <Glow on={ran}>
              <OutputPanel output={'1 \n1 2 \n1 2 3 '} fontSize={20} height={150} />
            </Glow>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={8} />
    </>
  )
}
