import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Lines } from './common'
import { OutPanel, Swap, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { CodeCard, DeckLine, TwoCols, lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * C15: FILTER, KEEP THE ONES THAT PASS. Three presses.
 *
 * Press 1: the two lines (filter keeps the items the function says True to;
 * the function must give True or False) and `filter(function, sequence)`.
 * Press 2: deck slide 32's funnel redrawn: the six ratings above it,
 * is_rated_4 inside; rating.py with its output empty. Press 3: the ratings
 * that pass drop out of the funnel as copies, the six above never move (its
 * keeps line); the two output lines.
 */
const EASE = [0.22, 1, 0.36, 1] as const
const C15 = SPEC.C15
const RATING: Prog = C15.code[0]
const RATINGS = [4.3, 4.1, 3.8, 3.6, 4.6, 3.9]
const KEPT = RATINGS.filter((r) => r >= 4.0)

function RatingChip({ value, kept = false, ghost = false }: { value: number; kept?: boolean; ghost?: boolean }) {
  return (
    <span className="grid h-[34px] w-[48px] place-items-center rounded-lg font-mono text-[15px] font-bold" style={{ background: ghost ? 'transparent' : kept ? '#E9F8EF' : colors.white, color: ghost ? 'transparent' : kept ? '#137A3A' : colors.ink, boxShadow: ghost ? 'none' : `inset 0 0 0 ${kept ? 2.5 : 1.5}px ${kept ? colors.success : colors.line}`, outline: ghost ? `1.5px dashed ${colors.line}` : 'none', outlineOffset: -1.5 }}>
      {value.toFixed(1)}
    </span>
  )
}

/** The funnel: a wide mouth, a narrow spout, the rule inside. */
function Funnel({ label }: { label: string }) {
  return (
    <div className="relative" style={{ width: 300, height: 120 }}>
      <svg width="300" height="120" viewBox="0 0 300 120" aria-hidden className="absolute inset-0">
        <path d="M10 6 L290 6 L178 72 L178 112 L122 112 L122 72 Z" fill={colors.surface2} stroke={colors.brandDark} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span className="absolute left-1/2 top-[26px] -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2.5 py-1 font-mono text-[14px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        {label}
      </span>
    </div>
  )
}

export function FilterCard() {
  const beat = useBeats(3)
  const drop = useStepPhase(beat, [360, 360, 360])
  const dropped = beat >= 3 ? drop : 0
  const instant = useInstant()
  const out: OutLine[] = beat >= 3 ? lines(RATING.output) : []
  const caption = beat >= 2 ? C15.show[3] : null
  return (
    <>
      <TwoCols
        height={H15}
        asking={beat === 1 || beat === 2}
        drawing={beat >= 3}
        left={
          <Swap k={beat === 1 ? 'intro' : 'code'}>
            {beat === 1 ? (
              <div className="flex min-h-[300px] flex-col items-start justify-center gap-6 pl-2">
                <DeckLine size={18}>
                  <Lines lines={[...sentences(C15.show[0]), ...sentences(C15.show[1])]} />
                </DeckLine>
                <CodeCard lines={[C15.show[2]]} size={24} className="ml-2" />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={RATING.src} fontSize={CODE_FS} rows={6} highlight={beat >= 3 ? 5 : undefined} />
                </Focus>
                <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={46} />
            <div className="flex flex-1 flex-col items-center justify-center gap-2" style={{ opacity: beat >= 2 ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
              <div className="flex items-center gap-1.5">
                <span className="mr-1 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
                  ratings
                </span>
                {RATINGS.map((r) => (
                  <RatingChip key={r} value={r} />
                ))}
              </div>
              <Funnel label="is_rated_4" />
              <div className="flex h-[40px] items-center gap-1.5">
                <span className="mr-1 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
                  kept
                </span>
                {KEPT.map((r, i) =>
                  i < dropped ? (
                    <motion.span key={r} initial={instant ? false : { y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: instant ? 0 : 0.6, ease: EASE }}>
                      <RatingChip value={r} kept />
                    </motion.span>
                  ) : (
                    <RatingChip key={`g${r}`} value={r} ghost />
                  ),
                )}
              </div>
            </div>
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

const H15 = 400
