import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Ask, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane } from './trace'
import { useForward } from './phase'
import { Row, py } from './rows'
import { Bag } from './bag'
import { Face } from './people'
import { AppPhone, IG, Story } from './Insta'
import { outOf } from './SetCards'
import { SPEC } from './spec'

/**
 * HOOK 2: OUR OWN SEEN BY. Spec card H2, five presses.
 *
 *   1  Teja's story, live: the seven opens pop up one after another, the
 *      same seven as the hook
 *   2  viewers_plain.py, an empty output: "What number does our app show?"
 *   3  the list fills one name per open, Ravi lands four times; 7, and beside
 *      it the app's real sheet from the hook: 3
 *   4  viewers_check.py: the new `if name not in viewers:` line lights; 3
 *   5  the fold, one movement: line 2 becomes `viewers = set()`, the if line
 *      goes, append becomes add; the output does not change, 3; the list
 *      gives way to the bag
 *
 * The seven opens and the app's 3 never change (keeps line); only our
 * program does. All three programs are real; every output is theirs.
 */
const H2 = SPEC.H2
const [PLAIN, CHECK, SET] = H2.code as { file: string; src: string; output: string }[]
const OPENS: string[] = H2.data.opens
const SEEN: string[] = SPEC.H1.data.seen_by

/** The app's viewer sheet from the hook, small: the eye, 3, the three faces. */
function AppSays() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-card bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${IG.line}` }}>
      <span className="w-full text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        Seen by
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={IG.ink} strokeWidth="2" aria-hidden>
        <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
      <span className="font-heading text-[24px] font-bold" style={{ color: IG.ink }}>
        {SEEN.length}
      </span>
      <span className="flex -space-x-2">
        {SEEN.map((n) => (
          <Face key={`seen-${n}`} name={n} size={28} ring="#FFFFFF" />
        ))}
      </span>
    </div>
  )
}

/** The opens arriving on the live story: one small pop-up each, in order. */
function Popups({ play }: { play: boolean }) {
  const instant = useInstant()
  return (
    <div className="absolute inset-x-2 bottom-12 flex flex-col-reverse gap-1">
      {OPENS.map((n, i) => (
        <motion.span
          key={`pop-${i}`}
          className="flex items-center gap-1.5 self-start rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.62)' }}
          initial={play && !instant ? { opacity: 0, x: -16 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: play ? i * 0.32 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <Face name={n} size={16} />
          {n.toLowerCase()} opened it
        </motion.span>
      ))}
    </div>
  )
}

export function SeenByHook() {
  const beat = useBeats(5)
  const fwd = useForward(beat)
  const prog = beat >= 5 ? SET : beat >= 4 ? CHECK : PLAIN
  const ran = beat >= 3
  const kept = beat >= 4 ? [...new Set(OPENS)] : OPENS
  return (
    <>
      <div className="flex items-start gap-8">
        <Group className="flex shrink-0 flex-col items-center gap-1.5">
          <AppPhone dark>
            <Story>
              <Popups play={beat === 1 && fwd} />
            </Story>
          </AppPhone>
        </Group>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* fixed height (two lines): the code box under it never moves when the caption changes */}
          <div className="h-[62px] shrink-0">
            <Swap k={beat}>
              <Ask size={22}>{H2.show[beat === 2 ? 1 : beat === 3 ? 2 : beat === 4 ? 3 : beat === 5 ? 4 : 0]}</Ask>
            </Swap>
          </div>
          <Group className="flex items-start gap-4" active={beat === 2}>
            <div className="w-[640px] shrink-0">
              <Focus on={beat === 2}>
                <CodePane code={beat >= 2 ? prog.src : PLAIN.src} fontSize={CODE_FS} rows={6} highlight={beat === 4 ? 4 : beat === 5 ? 2 : undefined} />
              </Focus>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
              {ran && <AppSays />}
            </div>
          </Group>
          <Group pad={8} className="flex min-h-[80px] items-center">
            <Swap k={beat >= 5 ? 'bag' : 'list'}>
              {beat >= 5 ? (
                <Bag items={SEEN} door={false} w={360} h={88} size="sm" name="viewers" />
              ) : ran ? (
                /* the list, one cell per open that got in: Ravi four times, then once each with the check */
                <motion.div key={`row-${beat}`} initial={fwd ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Row items={kept.map(py)} kind="list" size="sm" fit name="viewers" states={beat === 3 ? Object.fromEntries(OPENS.flatMap((n, i) => (n === 'Ravi' ? [[i, 'check' as const]] : []))) : {}} />
                </motion.div>
              ) : (
                <Row items={[]} kind="list" size="sm" name="viewers" />
              )}
            </Swap>
          </Group>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
