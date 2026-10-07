import { LayoutGroup, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Appear } from './pieces'

/**
 * RECAP: TRUE OR FALSE? Spec card S-RECAP, the sort format.
 *
 * Two bins, `Prints True` and `Prints False`, and five chips waiting in a
 * tray, each an expression from the session before. One chip flies per press
 * into its bin and its why line stays under it. The room says True or False
 * out loud before each press; nobody is counted or named (spec rules 2 and 3).
 *
 * The flight is a shared-layout animation (`layoutId`): the chip unmounts from
 * the tray and mounts in the bin, and framer-motion carries it across. Every
 * value is a real run (plan, outputs table).
 */
const CHIPS = [
  { chip: '"a" > "A"', value: true, why: 'Small a is 97 and capital A is 65, so a is bigger' },
  { chip: '"98" <= "123"', value: false, why: 'Python checks the first letters: 9 comes after 1' },
  { chip: '"BAD" >= "BAT"', value: false, why: 'B and A are the same. Then D comes before T' },
  { chip: '"9" > "5"', value: true, why: '9 comes after 5, so it is bigger' },
  { chip: '"Apple" < "apple"', value: true, why: 'Capital A is 65, small a is 97' },
]

const FLY = { type: 'tween', duration: 0.62, ease: [0.22, 1, 0.36, 1] } as const

function Chip({ id, text, landed, instant }: { id: string; text: string; landed: boolean; instant: boolean }) {
  return (
    <motion.div
      layoutId={id}
      layout
      transition={instant ? { duration: 0 } : FLY}
      className="flex h-[46px] items-center self-start rounded-xl bg-white px-4 font-mono text-[19px] font-bold"
      style={{ color: colors.brandDark, boxShadow: landed ? `inset 0 0 0 2px ${colors.brand}` : `inset 0 0 0 2px ${colors.line}, 0 6px 16px -8px rgba(0,37,75,0.25)`, whiteSpace: 'nowrap' }}
    >
      {text}
    </motion.div>
  )
}

export function RecapSort() {
  const beat = useBeats(6)
  const instant = useInstant()
  const moved = beat - 1 /* chips 0..moved-1 have landed */
  return (
    <LayoutGroup>
      <div className="flex items-start gap-10">
        {/* the tray */}
        <div className="flex w-[300px] shrink-0 flex-col gap-2.5 rounded-2xl px-5 pb-5 pt-3" style={{ background: 'rgba(255,255,255,0.55)', border: `2px dashed ${colors.line}`, minHeight: 340 }}>
          <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
            the chips
          </span>
          {CHIPS.map((c, i) => (i >= moved ? <Chip key={c.chip} id={`chip-${i}`} text={c.chip} landed={false} instant={instant} /> : null))}
        </div>
        {/* the two bins */}
        <div className="grid flex-1 grid-cols-2 gap-6">
          {[true, false].map((v) => {
            const tone = v ? colors.success : colors.danger
            const ink = v ? '#137A3A' : colors.danger
            const bg = v ? '#E9F8EF' : '#FDECEC'
            return (
              <div key={String(v)} className="flex flex-col gap-3 rounded-2xl bg-white px-5 pb-5 pt-4" style={{ boxShadow: `inset 0 0 0 2px ${tone}`, minHeight: 340 }}>
                <span className="self-start rounded-pill px-4 py-1 font-mono text-[18px] font-bold" style={{ background: bg, color: ink }}>
                  Prints {v ? 'True' : 'False'}
                </span>
                {CHIPS.map((c, i) =>
                  i < moved && c.value === v ? (
                    <div key={c.chip} className="flex flex-col gap-1">
                      <Chip id={`chip-${i}`} text={c.chip} landed instant={instant} />
                      <Appear delay={instant ? 0 : 520}>
                        <p className="pl-1 text-[16px] leading-snug" style={{ color: colors.body }}>
                          {c.why}
                        </p>
                      </Appear>
                    </div>
                  ) : null,
                )}
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </LayoutGroup>
  )
}
