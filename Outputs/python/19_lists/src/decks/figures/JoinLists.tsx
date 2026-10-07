import { LayoutGroup, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Ask, OutPanel, Show } from './pieces'

/**
 * JOINING TWO LISTS WITH +. Spec card C7, from deck slide 20.
 *
 * list_a and list_b drawn as two rows; the room says what list_c will be;
 * the two rows slide together into one, first list then second, in order.
 * Shared-layout boxes (`layoutId`), as the hook's turn.
 */
const CODE = 'list_a = [1, 2, 3]\nlist_b = ["a", "b", "c"]\nlist_c = list_a + list_b\nprint(list_c)'
const A = ['1', '2', '3']
const B = ["'a'", "'b'", "'c'"]
const MOVE = { type: 'tween', duration: 0.72, ease: [0.22, 1, 0.36, 1] } as const

function Box({ id, text, tone, instant }: { id: string; text: string; tone: string; instant: boolean }) {
  return (
    <motion.div
      layoutId={id}
      layout
      transition={instant ? { duration: 0 } : MOVE}
      className="grid h-[54px] w-[72px] place-items-center rounded-xl bg-white font-mono text-[20px] font-semibold"
      style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${tone}` }}
    >
      {text}
    </motion.div>
  )
}

function Name({ children }: { children: string }) {
  return (
    <span className="grid h-[54px] w-[90px] shrink-0 place-items-center rounded-lg font-mono text-[17px] font-bold text-white" style={{ background: colors.brandDark }}>
      {children}
    </span>
  )
}

export function JoinLists() {
  const beat = useBeats(2)
  const instant = useInstant()
  const joined = beat >= 2
  return (
    <LayoutGroup>
      <div className="flex items-start gap-10">
        <div className="flex w-[480px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={4} lines={{ 3: 'mark' }} />
          <Ask size={21}>What will list_c be?</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {!joined ? (
            <>
              <div className="flex items-center gap-4">
                <Name>list_a</Name>
                <div className="flex gap-2">
                  {A.map((t, i) => (
                    <Box key={`a${i}`} id={`a-${i}`} text={t} tone={colors.brand} instant={instant} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Name>list_b</Name>
                <div className="flex gap-2">
                  {B.map((t, i) => (
                    <Box key={`b${i}`} id={`b-${i}`} text={t} tone={colors.teal} instant={instant} />
                  ))}
                </div>
              </div>
              <div className="h-[54px]" />
            </>
          ) : (
            <>
              <div className="h-[54px]" />
              <div className="flex items-center gap-4">
                <Name>list_c</Name>
                <div className="flex gap-2">
                  {A.map((t, i) => (
                    <Box key={`a${i}`} id={`a-${i}`} text={t} tone={colors.brand} instant={instant} />
                  ))}
                  {B.map((t, i) => (
                    <Box key={`b${i}`} id={`b-${i}`} text={t} tone={colors.teal} instant={instant} />
                  ))}
                </div>
              </div>
              <Show on={joined}>
                <OutPanel lines={[{ text: "[1, 2, 3, 'a', 'b', 'c']" }]} fontSize={20} width={420} />
              </Show>
            </>
          )}
          <Show on={joined}>
            <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
              First list, then second, in order
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </LayoutGroup>
  )
}
