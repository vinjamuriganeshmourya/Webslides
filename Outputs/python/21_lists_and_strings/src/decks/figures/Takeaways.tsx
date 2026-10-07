import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { ListBoxes, sentences } from './pieces'
import { PieceRow, Tiles } from './tiles21'
import { SPEC } from './spec'

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, six presses.
 *
 * Six real programs from the session, each with what it prints and the rule
 * it shows: examples, not a concept map (its must line). All six slots are
 * there from press 1, empty and numbered; each press fills one with its
 * heading, its code, a small tiles or boxes picture, its result and its
 * sentence. Code and results are the spec's (each run on CPython; plan,
 * outputs table). The pictures are the session's own two: tiles and pieces
 * for the first half, boxes with two position rows for the second.
 */
const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string }
const EXAMPLES: Ex[] = K1.code
/* the spec's `show` pairs each heading with its sentence: heading, sentence, heading, … */
const SENTENCES: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)

const NUMS = ['5', '4', '3', '2', '1']
const ALL5 = NUMS.map(() => true)
const PICTURES: ReactNode[] = [
  <PieceRow pieces={['1', '2', '', '3']} size="xs" lit={[2]} />,
  <PieceRow pieces={['1', '2', '3']} size="xs" />,
  <PieceRow pieces={['10', '06', '2007']} size="xs" glue="-" glueOn />,
  <ListBoxes items={NUMS} size="xxs" lane={false} neg={ALL5} states={{ 4: 'hit', 1: 'hit' }} />,
  <ListBoxes items={NUMS} size="xxs" lane={false} neg={ALL5} states={{ 2: 'hit', 3: 'hit', 4: 'grey' }} />,
  <Tiles chars={[...'margorP']} size="xs" lane={false} />,
]

function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative w-[284px] shrink-0 rounded-lg px-3 pb-1.5 pt-4" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10.5px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      {/* one element per line, so a line is measured as a line, never as one wrapped token */}
      <div className="font-mono text-[11.5px] leading-[15px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

function Slot({ n, ex, filled }: { n: number; ex: Ex; filled: boolean }) {
  const tween = useTween(480)
  return (
    <div
      className="relative flex h-[130px] flex-col gap-1 rounded-card px-3 py-[7px]"
      style={{
        background: filled ? colors.white : 'transparent',
        boxShadow: filled ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: filled ? colors.brandDark : colors.surface2, color: filled ? colors.white : colors.muted }}>
          {n + 1}
        </span>
        <span className="font-heading text-[16px] font-bold leading-none" style={{ color: colors.ink, opacity: filled ? 1 : 0, transition: tween }}>
          {ex.file}
        </span>
      </div>
      {filled && (
        <div className="sm-bump flex items-start gap-3.5">
          <div className="flex flex-col gap-1">
            <MiniCode src={ex.src} />
            <span className="w-[284px] text-[13px] font-semibold leading-[17px]" style={{ color: colors.body }}>
              <Lines lines={sentences(SENTENCES[n])} />
            </span>
          </div>
          <div className={`flex min-w-0 flex-1 items-start gap-2 ${n === 3 || n === 4 ? 'flex-row' : 'flex-col'}`}>
            {PICTURES[n]}
            <span className="whitespace-pre rounded-md px-2 py-0.5 font-mono text-[14px] font-bold" style={{ background: `${colors.success}1A`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
              {ex.output}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export function Takeaways() {
  const beat = useBeats(6)
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {EXAMPLES.map((ex, i) => (
          <Slot key={ex.file} n={i} ex={ex} filled={beat >= i + 1} />
        ))}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
