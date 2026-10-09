import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { sentences } from './pieces'
import { MiniScope } from './scope'
import { SPEC } from './spec'

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, twelve presses.
 *
 * Six real programs from the session, each with what it prints and the rule
 * it shows: examples, not a concept map (its must line). All six slots are
 * there from press 1, empty and numbered. Two presses per example: its
 * heading and code show with the result empty and `Say it before it fills.`;
 * the room says the output together; the next press fills the result and
 * the sentence (its interaction and must lines). The first three carry the arrow picture
 * from C1, small (the card's play line): which names point at which list once
 * the program has run. Code and results are the spec's, run on CPython.
 */
const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string }
const EXAMPLES: Ex[] = K1.code
/* the spec's `show` pairs each heading with its sentence: heading, sentence, heading, …, then the caption */
const SENTENCES: string[] = (K1.show as string[]).slice(0, 12).filter((_, i) => i % 2 === 1)
const SAY: string = K1.show[12]

/* the picture at the end of each of the first three programs, as the spec's C1, C2 and E1 traces draw it at their last call */
const PICTURES: ReactNode[] = [
  <MiniScope names={{ ravi: 'L1', list_x: 'L1' }} lists={{ L1: ['Unit 1', 'Unit 2', 'Unit 3'] }} width={300} />,
  <MiniScope names={{ ravi: 'L1', list_x: 'L2' }} lists={{ L1: ['Unit 1', 'Unit 2'], L2: ['Unit 1', 'Unit 2', 'Unit 3'] }} width={300} />,
  <MiniScope names={{ list_x: 'L1' }} lists={{ L1: ['Unit 3', 'Unit 3'] }} width={300} />,
]

/* the notebook's programs are longer than the deck's: the code takes its own width, one size down */
function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative shrink-0 rounded-lg px-3 pb-1.5 pt-4" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10.5px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      {/* one element per line, so a line is measured as a line, never as one wrapped token */}
      <div className="font-mono text-[10.5px] leading-[12px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * One element per output line, so each printed line is measured as a line.
 * Until the room has said it, the box is an empty dashed slot of the same
 * size carrying the card's caption, `Say it before it fills.`
 */
function Result({ text, on }: { text: string; on: boolean }) {
  const tween = useTween(480)
  return (
    <div
      className="grid self-start rounded-md px-2 py-0.5 font-mono text-[13px] font-bold leading-[17px]"
      style={{ background: on ? `${colors.success}1A` : 'transparent', color: colors.ink, boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : 'none', outline: on ? 'none' : `1.5px dashed ${colors.line}`, outlineOffset: -1.5, transition: tween }}
    >
      <div className="col-start-1 row-start-1" style={{ opacity: on ? 1 : 0, transition: tween }}>
        {text.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
      {!on && (
        <span className="col-start-1 row-start-1 self-center whitespace-nowrap font-sans text-[13px] font-semibold italic" style={{ color: colors.muted }}>
          {SAY}
        </span>
      )}
    </div>
  )
}

/* the arrow picture, at this scale of its 300 x 74 frame */
const PIC = 0.48

function Slot({ n, ex, filled, said }: { n: number; ex: Ex; filled: boolean; said: boolean }) {
  const tween = useTween(480)
  const pic = PICTURES[n]
  return (
    <div
      className="relative flex h-full flex-col gap-1 rounded-card px-3 py-2"
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
        <div className="sm-bump flex min-h-0 flex-1 flex-col gap-1">
          <div className="flex items-start gap-2">
            <MiniCode src={ex.src} />
            {pic && (
              <div className="shrink-0 overflow-hidden" style={{ width: 300 * PIC, height: 74 * PIC, opacity: said ? 1 : 0, transition: tween }}>
                <div className="origin-top-left" style={{ transform: `scale(${PIC})`, width: 300, height: 74 }}>
                  {pic}
                </div>
              </div>
            )}
          </div>
          <Result text={ex.output} on={said} />
          <span className="text-[13px] font-semibold leading-[16px]" style={{ color: colors.body, opacity: said ? 1 : 0, transition: tween }}>
            <Lines lines={sentences(SENTENCES[n])} />
          </span>
        </div>
      )}
    </div>
  )
}

export function Takeaways() {
  const beat = useBeats(12)
  return (
    <>
      {/* unequal outer columns, so the middle one is not read as a centred block (content rule 38); widths follow each column's longest program */}
      {/* two row heights: the first row carries the default-list program, seven lines and three printed */}
      <div className="grid gap-x-3 gap-y-2" style={{ gridTemplateColumns: '372px 400px 354px', gridTemplateRows: '228px 190px' }}>
        {EXAMPLES.map((ex, i) => (
          <Slot key={ex.file} n={i} ex={ex} filled={beat >= 2 * i + 1} said={beat >= 2 * i + 2} />
        ))}
      </div>
      <StepControls at={beat} total={12} />
    </>
  )
}
