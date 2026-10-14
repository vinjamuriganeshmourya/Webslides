import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, sentences, CODE_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { Sheet, type Row, type RowTone } from './sheet'
import { SPEC } from './spec'

/**
 * RECAP: WHICH LINE IS TO BLAME? Spec card S-RECAP, three presses, format
 * "bug". Anna's canteen board from the dictionaries session.
 *
 * Press 1: the story line, samosa.py, `It prints: 15` beside `We wanted:
 * 20`, the board with its two rows, and the vote on the line (keys 1 to 4).
 * Press 2: line 3 lights as the culprit, the board grows a third row,
 * `Samosa 20`, and the why line shows. Press 3: line 3 becomes the fix, the
 * extra row goes, samosa's 15 is covered by 20, and the output turns to 20.
 * Both programs ran on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const R = SPEC['S-RECAP']
const P0: Prog = R.code[0]
const P1: Prog = R.code[1]
const LINES: string[] = R.data.lines
const CULPRIT = Number(R.data.culprit)

/** `It prints:` and `We wanted:`, each with its value. */
function Printed({ label, value, tone }: { label: string; value: string; tone: 'bad' | 'ok' | 'want' }) {
  const tween = useTween(420)
  const ink = tone === 'bad' ? colors.danger : tone === 'ok' ? '#137A3A' : colors.ink
  return (
    <div className="flex items-center gap-3">
      <span className="w-[92px] shrink-0 text-[15px] font-semibold" style={{ color: colors.body }}>
        {label}
      </span>
      <span className="rounded-lg bg-white px-3 py-1 font-mono text-[17px] font-bold" style={{ color: ink, boxShadow: `inset 0 0 0 2px ${tone === 'bad' ? colors.danger : tone === 'ok' ? colors.success : colors.line}`, transition: tween }}>
        {value}
      </span>
    </div>
  )
}

export function RecapBug() {
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 2
  const code = beat >= 3 ? P1.src : P0.src
  const rows: Row[] = beat === 2 ? [['tea', 14], ['samosa', 15], ['Samosa', 20]] : beat >= 3 ? [['tea', 14], ['samosa', 20]] : [['tea', 14], ['samosa', 15]]
  const tones: Record<string, RowTone> = beat === 2 ? { Samosa: 'new' } : beat >= 3 ? { samosa: 'hot' } : {}
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[600px] shrink-0 flex-col gap-2.5" active={beat === 1}>
          <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(R.show[0])} />
          </p>
          <Focus on={beat === 1}>
            <CodePane code={code} fontSize={CODE_FS} rows={4} at={beat === 2 ? CULPRIT : undefined} stop={beat === 2} highlight={beat >= 3 ? CULPRIT : undefined} />
          </Focus>
          <Vote options={LINES.map((_, i) => `Line ${i + 1}`)} right={CULPRIT - 1} shown={shown} pick={pick} setPick={setPick} cols={4} size={16} mono={false} nowrap dense />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-3" active={beat >= 2}>
          <div className="flex items-start gap-5">
            <Sheet title="Anna's canteen" look="board" cols={['Item', 'Price']} rows={rows} tones={tones} width={224} />
            <div className="flex flex-col gap-2.5 pt-1">
              <Printed label={R.show[1]} value={beat >= 3 ? R.data.right : R.data.wrong} tone={beat >= 3 ? 'ok' : 'bad'} />
              <Printed label={R.show[2]} value={R.data.right} tone="want" />
            </div>
          </div>
          <Ask size={20}>{R.show[3]}</Ask>
          <StepCaption text={shown ? R.data.why : null} tone="rule" size={16} minH={56} />
        </Group>
      </div>
      {shown && pick === CULPRIT - 1 && <Confetti seed={30} />}
      <StepControls at={beat} total={3} />
    </>
  )
}
