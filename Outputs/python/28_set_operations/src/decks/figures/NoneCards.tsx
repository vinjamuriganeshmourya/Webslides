import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { SlideBase } from '@/ui/SlideBase'
import { Kicker } from '@/ui/primitives'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { Confetti } from './motion'
import { Ask, DrawBox, Note, OutPanel, Swap, sentences, CODE_FS, OUT_FS, CODE_REF_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { usePhase } from './phase'
import { SPEC } from './spec'

/**
 * THE FIRST BLOCK: NONE. C1 (the divider), C2 (None is a value), C3 (no
 * return gives back None) and C4 (print gives back None).
 *
 * Every program and output is the spec's, run on CPython 3.12.3. Every output
 * box starts empty and fills only on the press after the room has said or
 * voted (each card's must line). Votes take a click or keys 1 to n and never
 * gate the press; confetti when the marked pick was right.
 */

type Prog = { file: string; src: string; output: string; input?: string }
const outLines = (p: Prog, error = false) => p.output.split('\n').map((t) => ({ text: t, tone: error ? ('error' as const) : ('plain' as const) }))

/* ------------------------------------------------------------------ C1 */

const RECAP_SRC: string = SPEC['S-RECAP'].code[0].src
const SORT_LINE = RECAP_SRC.split('\n')[1] /* x = queue.sort() */
const SORT_OUT: string = SPEC['S-RECAP'].code[0].output

/**
 * C1, one press, on the deck's divider. Review, 2026-10-08: the None that
 * flew up from the chip and swelled into the title read as odd. Now each
 * thing does what it is: the recap's chip `x = queue.sort()` and its None
 * rise into place under the title, exactly as the recap showed them; a
 * square draws itself round that None (this is the value the block is
 * about); then the divider's word rises in, None first, `Type Object` a beat
 * after, so the title is read as the name of the value just marked.
 */
export function NoneDivider({ lesson, kicker }: { lesson: string; kicker: string }) {
  const instant = useInstant()
  const [marked, setMarked] = useState(instant)
  useEffect(() => {
    if (instant) return setMarked(true)
    const t = window.setTimeout(() => setMarked(true), 750)
    return () => window.clearTimeout(t)
  }, [instant])
  const rise = (delay: number) => ({
    initial: instant ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: instant ? 0 : delay, duration: 0.7, ease: easing.soft },
  })
  return (
    <SlideBase variant="night" lesson={lesson} footer>
      <div className="relative grid h-full place-items-center text-center">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute select-none font-heading text-[200px] font-extrabold leading-none text-white/15"
          style={{ marginTop: -150 }}
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: easing.soft }}
        >
          01
        </motion.span>
        <div className="relative z-10 flex flex-col items-center">
          <motion.div className="mb-4 inline-block" {...rise(1.5)}>
            <Kicker onDark>{kicker}</Kicker>
          </motion.div>
          <h2 className="font-heading text-slide-title-lg font-extrabold leading-[1.04] text-white">
            <motion.span className="inline-block" {...rise(1.5)}>
              None
            </motion.span>
            <motion.span className="inline-block" {...rise(1.85)}>
              Type Object
            </motion.span>
          </h2>
          {/* the recap's chip and its output, unchanged */}
          <motion.div className="mt-10 flex items-center gap-4 rounded-2xl px-5 py-3" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.28)' }} {...rise(0.1)}>
            <span className="font-mono text-[24px] font-semibold text-white">{SORT_LINE}</span>
            <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden>
              <motion.path d="M2 7 H24" stroke="rgba(255,255,255,0.7)" strokeWidth="2.6" strokeLinecap="round" initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: instant ? 0 : 0.5, duration: 0.5, ease: [0.65, 0, 0.35, 1] }} />
              <motion.path d="M23 2.5 L31 7 L23 11.5 Z" fill="rgba(255,255,255,0.7)" initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: instant ? 0 : 0.95, duration: 0.2 }} />
            </svg>
            <span className="relative rounded-lg bg-white px-3 py-0.5 font-mono text-[24px] font-bold" style={{ color: colors.brandDark }}>
              {SORT_OUT}
              <DrawBox on={marked} color={colors.accent} pad={7} />
            </span>
          </motion.div>
        </div>
      </div>
    </SlideBase>
  )
}

/* ------------------------------------------------------------------ C2 */

const C2 = SPEC.C2
const P2: Prog[] = C2.code

/** Teja's token slot on the canteen counter: empty before he orders; `token = None` puts None in it. */
function TokenSlot({ value }: { value: string | null }) {
  const tween = useTween(480)
  return (
    <div className="flex flex-col items-center gap-2 rounded-card px-6 pb-4 pt-3" style={{ background: '#FBF4EA', boxShadow: 'inset 0 0 0 1.5px #E7D9C4' }}>
      <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: '#8A6A3E' }}>
        Sri Sai Canteen counter
      </span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[20px] font-bold" style={{ color: colors.brandDark }}>
          token
        </span>
        <span
          className="grid h-[58px] w-[132px] place-items-center rounded-xl font-mono text-[24px] font-bold"
          style={{ background: value ? colors.white : 'transparent', border: `2.5px ${value ? 'solid' : 'dashed'} ${value ? colors.accent : '#CDB892'}`, color: colors.accentDark, transition: tween }}
        >
          <span key={value ?? 'empty'} className="sm-bump">
            {value ?? ''}
          </span>
        </span>
      </div>
    </div>
  )
}

/**
 * C2, three presses: token.py, its output empty, and the recap's
 * sort_gives_back.py small in the corner with its None, as the reason for the
 * question; both lines print and Teja's token slot shows None; the deck's two
 * lines.
 */
export function NoneValue() {
  const beat = useBeats(3)
  const ran = beat >= 2
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[560px] shrink-0 flex-col gap-3">
          <Ask size={22}>{C2.show[0]}</Ask>
          <Focus on={!ran}>
            <CodePane code={P2[0].src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outLines(P2[0]) : []} minRows={2} fontSize={OUT_FS} />
          <Note on={beat >= 3} size={18} lines={[...sentences(C2.show[1]), ...sentences(C2.show[2])]} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              From the recap
            </span>
            <CodePane code={P2[1].src} fontSize={CODE_REF_FS} />
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-1.5">
              <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
                Output
              </span>
              <span className="font-mono text-[15px] font-semibold" style={{ color: colors.ink }}>
                {P2[1].output}
              </span>
            </div>
          </div>
          <TokenSlot value={ran ? 'None' : null} />
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C3 */

const C3 = SPEC.C3
const P3: Prog[] = C3.code
const C3_CHOICES: string[] = C3.show.slice(1, 4)

/**
 * A function box handing a parcel back to a name: the call's box on the left
 * with what happened inside, the name on the right, and on `sent` a parcel
 * marked None travels along the arrow and lands in the name's box.
 */
export function HandBack({ fn, inside, name, sent, value = 'None', width = 520 }: { fn: string; inside?: ReactNode; name: string; sent: boolean; value?: string; width?: number }) {
  const instant = useInstant()
  const [landed, setLanded] = useState(sent)
  useEffect(() => {
    if (!sent) return setLanded(false)
    if (instant) return setLanded(true)
    const t = window.setTimeout(() => setLanded(true), 900)
    return () => window.clearTimeout(t)
  }, [sent, instant])
  const travel = width - 160 - 130
  return (
    <div className="relative flex items-center" style={{ width, height: 112 }}>
      <div className="flex h-[104px] w-[160px] shrink-0 flex-col justify-center gap-1 rounded-card px-3" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 2px ${colors.brandDark}` }}>
        <span className="font-mono text-[15px] font-bold" style={{ color: colors.brandDark }}>
          {fn}
        </span>
        {inside}
      </div>
      {/* the way back: a faint dashed guide; on the run a solid line draws itself along it, left to right, and its head lands last (2b, item 10) */}
      <svg className="shrink-0" width={travel} height="20" viewBox={`0 0 ${travel} 20`} aria-hidden>
        <path d={`M6 10 H${travel - 14}`} stroke={colors.line} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 6" />
        <path
          d={`M6 10 H${travel - 14}`}
          stroke={colors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          style={{ strokeDashoffset: sent ? 0 : 1, transition: instant ? 'none' : sent ? 'stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1)' : 'stroke-dashoffset 300ms ease-out' }}
        />
        <path d={`M${travel - 15} 4.5 L${travel - 5} 10 L${travel - 15} 15.5 Z`} fill={sent ? colors.accent : colors.line} style={{ opacity: 1, transition: instant ? 'none' : `fill 240ms ease-out ${sent ? 760 : 0}ms` }} />
      </svg>
      <div className="flex w-[130px] shrink-0 flex-col items-center gap-1">
        <span className="font-mono text-[17px] font-bold" style={{ color: colors.brandDark }}>
          {name}
        </span>
        <span className="grid h-[50px] w-full place-items-center rounded-xl font-mono text-[19px] font-bold" style={{ border: `2.5px ${landed ? 'solid' : 'dashed'} ${landed ? colors.accent : colors.line}`, background: landed ? '#FFF4EC' : 'transparent', color: colors.accentDark }}>
          {landed ? value : ''}
        </span>
      </div>
      {/* the parcel, travelling along the arrow, empty but for its label */}
      {sent && !landed && (
        <span
          aria-hidden
          className="absolute grid h-[36px] w-[70px] place-items-center rounded-md font-mono text-[14px] font-bold"
          style={{ left: 150, top: 18, background: '#FFF4EC', boxShadow: `inset 0 0 0 2px ${colors.accent}`, color: colors.accentDark, animation: 'c3-parcel 900ms cubic-bezier(0.22,1,0.36,1) forwards', ['--travel' as string]: `${travel + 10}px` }}
        >
          {value}
        </span>
      )}
      <style>{'@keyframes c3-parcel { from { transform: translateX(0); opacity: 0.4 } to { transform: translateX(var(--travel)); opacity: 1 } }'}</style>
    </div>
  )
}

/**
 * C3, six presses in three pairs: a version of increment, then its output.
 * Only line 3 changes (nothing, `return`, `return None`), and it is the line
 * lit; the input 5 and every other line stay. On each run the function's box
 * hands back an empty parcel marked None to result.
 */
export function NoReturn() {
  const beat = useBeats(6)
  const [pick, setPick] = useState(-1)
  const v = Math.floor((beat - 1) / 2) /* version 0, 1, 2 */
  const ran = beat % 2 === 0
  const prog = P3[v]
  const ask = beat <= 2 ? C3.show[0] : beat <= 4 ? C3.show[4] : C3.show[5]
  const right = C3_CHOICES.indexOf(P3[0].output)
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[500px] shrink-0 flex-col gap-3">
          <Focus on={!ran}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={7} highlight={beat >= 3 ? 3 : undefined} />
          </Focus>
          <div className="grid grid-cols-2 gap-3">
            <OutPanel title="Input" lines={[{ text: prog.input ?? '' }]} fontSize={OUT_FS} />
            <OutPanel lines={ran ? outLines(prog) : []} fontSize={OUT_FS} />
          </div>
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4" active={!ran}>
          <Swap k={ask}>
            <Ask size={22}>
              <Lines lines={sentences(ask)} />
            </Ask>
          </Swap>
          {v === 0 ? <Vote options={C3_CHOICES} right={right} shown={ran} pick={pick} setPick={setPick} cols={3} size={20} /> : <div className="h-[46px]" />}
          <HandBack
            fn="increment(5)"
            inside={
              ran ? (
                <span className="sm-bump font-mono text-[15px]" style={{ color: colors.body }}>
                  a is 6 here
                </span>
              ) : undefined
            }
            name="result"
            sent={ran}
            width={580}
          />
          <StepCaption text={beat === 6 ? C3.show[6] : null} tone="rule" size={19} minH={52} />
        </Group>
      </div>
      {beat === 2 && pick === right && <Confetti seed={31} />}
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ C4 */

const C4 = SPEC.C4
const P4: Prog = C4.code[0]
const C4_CHOICES: string[] = C4.show.slice(1, 4)

/**
 * C4, two presses: print_result.py, vote Hi, Hi / None, None; then the
 * output fills one line at a time: Hi first (line 1 prints), then None (what
 * print gave back), while print's box hands None to result.
 */
export function PrintNone() {
  const beat = useBeats(2)
  const [pick, setPick] = useState(-1)
  const phase = usePhase(beat, 2, [300, 1300])
  const lines = outLines(P4).slice(0, beat >= 2 ? phase : 0)
  const right = C4_CHOICES.indexOf(P4.output.replace('\n', ' / '))
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[500px] shrink-0 flex-col gap-3">
          <Ask size={22}>{C4.show[0]}</Ask>
          <Focus on={beat === 1}>
            <CodePane code={P4.src} fontSize={CODE_FS} at={beat >= 2 ? (phase >= 2 ? 2 : 1) : null} />
          </Focus>
          <OutPanel lines={lines} minRows={2} fontSize={OUT_FS} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-5" active={beat === 1}>
          <Vote options={C4_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={20} />
          <HandBack
            fn={'print("Hi")'}
            inside={
              <span className="font-mono text-[15px]" style={{ color: colors.body }}>
                shows Hi
              </span>
            }
            name="result"
            sent={beat >= 2}
            width={580}
          />
        </Group>
      </div>
      {beat >= 2 && pick === right && <Confetti seed={41} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
