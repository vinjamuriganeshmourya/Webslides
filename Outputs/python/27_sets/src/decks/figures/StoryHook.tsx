import { useRef } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Group } from './common'
import { Swap, sentences } from './pieces'
import { useForward } from './phase'
import { Row } from './rows'
import { Bag } from './bag'
import { Face } from './people'
import { AppPhone, Feed, Story, ViewerSheet } from './Insta'
import { SPEC } from './spec'

/**
 * HOOK: SEEN BY. Spec card H1, six presses. No code and no session word
 * anywhere on the card (its must_not lines).
 *
 *   1  Teja posts the Maggi story; his ring lights at the top of the feed
 *   2  beside the phone, the log of opens fills in one movement: 7 rows
 *   3  the story is open, a tap ripple on Seen by; the sheet is still shut
 *   4  the viewer sheet slides up: the eye and 3, Ravi, Anu, Kiran once each;
 *      Ravi's four rows in the log light together
 *   5  Ravi's phone opens it again: the log gets row 8; the sheet does not move
 *   6  the three names lift off the sheet into a round bag (no numbers, no
 *      order); the log becomes a row of 8 cells with 0 to 7 under them
 *
 * The log is a card beside the phone, never part of the app: the app shows
 * no count of opens (must line). Every name and number is the spec's data.
 */
const H1 = SPEC.H1
const OPENS: string[] = H1.data.opens
const SEEN: string[] = H1.data.seen_by
const EXTRA: string = H1.data.extra_open
/* when each open came: an evening, in order (the log's own times; the app shows none) */
const TIMES = ['8:02 PM', '8:05 PM', '8:09 PM', '8:14 PM', '8:21 PM', '8:30 PM', '8:44 PM', '8:52 PM']

function LogCard({ rows, lit, fresh, grow }: { rows: string[]; lit: boolean; fresh: boolean; grow: boolean }) {
  const instant = useInstant()
  return (
    <div className="flex w-[262px] shrink-0 flex-col rounded-card bg-white px-3 pb-2.5 pt-2" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 10px 22px -16px rgba(16,32,58,0.4)` }}>
      <span className="mb-1.5 flex items-center justify-between border-b pb-1.5 text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.muted, borderColor: colors.line }}>
        <span>Log of opens</span>
        <span className="font-mono">{rows.length}</span>
      </span>
      <div className="flex flex-col gap-[3px]">
        {rows.map((n, i) => {
          const on = lit && n === 'Ravi'
          const late = i === 7
          return (
            <motion.div
              key={`log-${i}`}
              className="flex items-center gap-2.5 rounded-lg px-1.5"
              style={{ height: 30, background: on ? colors.surface2 : 'rgba(255,255,255,0)', boxShadow: on ? `inset 0 0 0 2px ${colors.brand}` : 'none', transition: instant ? 'none' : 'background-color 420ms, box-shadow 420ms' }}
              initial={(fresh && !late) || (grow && late) ? { opacity: 0, x: late ? 40 : -14 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: late ? 0.8 : 0.42, delay: fresh && !late ? i * 0.09 : late ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Face name={n} size={24} />
              <span className="flex-1 text-[15px] font-semibold" style={{ color: colors.ink }}>
                {n}
              </span>
              <span className="font-mono text-[13px]" style={{ color: colors.muted }}>
                {TIMES[i]}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function StoryHook() {
  const beat = useBeats(6)
  const fwd = useForward(beat)
  const rows = useRef<Record<string, HTMLDivElement | null>>({})
  const log = beat >= 5 ? [...OPENS, EXTRA] : OPENS
  const turned = beat >= 6
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col items-center">
          <AppPhone dark={beat >= 3}>
            <div className="relative h-full overflow-hidden">
              <Swap k={beat <= 2 ? 'feed' : 'story'} from="right" overlay className="h-full">
                {beat <= 2 ? (
                  <Feed lit={beat >= 1} draw={beat === 1} />
                ) : (
                  <Story tap={beat === 3} covered={beat >= 4}>
                    {beat >= 4 && <ViewerSheet names={SEEN} open slideIn={beat === 4 && fwd} rowRefs={(n, el) => { rows.current[n] = el }} />}
                  </Story>
                )}
              </Swap>
            </div>
          </AppPhone>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 pt-1">
          <div className="min-h-[76px]">
            <Swap k={beat}>
              <p className="font-heading text-[27px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                <Lines lines={sentences(H1.show[beat - 1])} />
              </p>
            </Swap>
          </div>
          <Swap k={turned ? 'turn' : beat >= 2 ? 'log' : 'none'}>
            {turned ? (
              <div className="flex flex-col gap-4">
                <Group className="flex items-center gap-5 self-start">
                  <Bag items={SEEN} door={false} w={330} h={184} moving={fwd} origin={(n) => rows.current[n] ?? null} />
                </Group>
                <Group className="flex flex-col gap-1.5 self-start">
                  <Row items={log} kind="list" size="sm" />
                </Group>
              </div>
            ) : beat >= 2 ? (
              <div className="flex items-start gap-6">
                <LogCard rows={log} lit={beat >= 4} fresh={beat === 2 && fwd} grow={beat === 5 && fwd} />
                {beat >= 5 && (
                  /* Ravi's own phone, small: he opens the story again */
                  <motion.div className="flex flex-col items-center gap-1.5" initial={fwd ? { opacity: 0, x: 40 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <div style={{ zoom: 0.55 }}>
                      <AppPhone dark>
                        <Story owner="Teja" />
                      </AppPhone>
                    </div>
                    <span className="flex items-center gap-1.5 text-[15px] font-bold" style={{ color: colors.body }}>
                      <Face name="Ravi" size={22} />
                      Ravi
                    </span>
                  </motion.div>
                )}
              </div>
            ) : (
              <div />
            )}
          </Swap>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
