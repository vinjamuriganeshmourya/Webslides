import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, Show, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { CallCode, GUTTER, IoBox, yOf } from './call'
import { SPEC } from './spec'

/**
 * THE PLAIN CODE CARDS OF PF 22: C1, C3, C5, C13. One program each, a
 * question, the answer on the press after the room has answered (spec rule
 * 2). Every program, output and line is the spec's.
 */

/* ================================================================== C1 */

const C1 = SPEC.C1
const C1_SRC: string = C1.code[0].src
/* the song's three copies: the runs of lines that are the four song prints */
const SONG_LINES = C1_SRC.split('\n')
  .map((l, i) => (l.includes('Happy birthday') ? i + 1 : 0))
  .filter(Boolean)
const GROUPS: number[][] = [SONG_LINES.slice(0, 4), SONG_LINES.slice(4, 8), SONG_LINES.slice(8, 12)]
const C1_FS = 14

/** A bracket in the code's left gutter round one copy of the song, with its number. */
function Bracket({ from, to, n }: { from: number; to: number; n: number }) {
  const instant = useInstant()
  const y1 = yOf(from, C1_FS) - 9
  const y2 = yOf(to, C1_FS) + 9
  return (
    <motion.g initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.52, delay: instant ? 0 : n * 0.26, ease: easing.soft }}>
      <path d={`M ${GUTTER - 6} ${y1} H ${GUTTER - 16} V ${y2} H ${GUTTER - 6}`} fill="none" stroke={colors.accent} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={14} cy={(y1 + y2) / 2} r={11} fill={colors.accent} />
      <text x={14} y={(y1 + y2) / 2 + 0.5} fill={colors.white} fontSize={13} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, system-ui, sans-serif">
        {n + 1}
      </text>
    </motion.g>
  )
}

/** Deck slide 12's block picture: three stacked bars of one block. */
function BlockPic() {
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden>
      <rect x="2" y="2" width="60" height="16" rx="4" fill={colors.brand} />
      <rect x="2" y="20" width="60" height="16" rx="4" fill={colors.accent} />
      <rect x="2" y="38" width="60" height="16" rx="4" fill={colors.teal} />
    </svg>
  )
}

/** Reusing: one block, three arrows out of it. */
function ReusePic() {
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden>
      <rect x="2" y="18" width="22" height="20" rx="4" fill={colors.brand} />
      {[10, 28, 46].map((y) => (
        <g key={y}>
          <path d={`M 26 28 Q 34 28 38 ${y} H 51`} fill="none" stroke={colors.success} strokeWidth={2.5} />
          <path d={`M 60 ${y} L 51 ${y - 5} L 51 ${y + 5} Z`} fill={colors.success} />
        </g>
      ))}
    </svg>
  )
}

/**
 * WRITE IT ONCE? Spec card C1, four presses: party_long.py and its line; the
 * song's lines lit in three groups of four; the question; the two definition
 * lines with their small pictures (deck slide 12).
 */
export function WriteOnce() {
  const beat = useBeats(4)
  const tween = useTween(480)
  const lit = beat >= 2 ? SONG_LINES : []
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="relative shrink-0" style={{ width: 520 }}>
          <svg className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible" width={GUTTER} height={460} aria-hidden>
            {beat >= 2 && GROUPS.map((g, k) => <Bracket key={k} from={g[0]} to={g[g.length - 1]} n={k} />)}
          </svg>
          <CallCode code={C1_SRC} fs={C1_FS} mark={lit} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 pt-2">
          <StepCaption text={C1.show[0]} size={19} minH={48} />
          <Show on={beat >= 2}>
            <StepCaption text={beat >= 2 ? C1.show[1] : null} size={19} minH={48} />
          </Show>
          <Show on={beat >= 3}>
            <Ask size={24}>{C1.show[2]}</Ask>
          </Show>
          <div className="flex flex-col gap-3" style={{ opacity: beat >= 4 ? 1 : 0, transform: beat >= 4 ? 'none' : 'translateY(8px)', transition: tween }}>
            {[
              { pic: <BlockPic />, text: C1.show[3] },
              { pic: <ReusePic />, text: C1.show[4] },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-4 rounded-card bg-white px-4 py-3" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` }}>
                {d.pic}
                <span className="text-[19px] font-semibold leading-snug" style={{ color: colors.ink }}>
                  <Lines lines={sentences(d.text)} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ================================================================== C3 */

const C3 = SPEC.C3

/**
 * WHY DID HELLO NOT PRINT? Spec card C3, three presses: greet.py, the input,
 * an empty output and the vote; the output `Teja` (only after the vote, its
 * must line) and the question; line 2 greys out with the rule.
 */
export function NoHello() {
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const right = 'ABCD'.indexOf(C3.answer[0])
  const k = C3.code[0]
  const caption = beat === 1 ? C3.show[0] : beat === 2 ? C3.show[1] : C3.show[2]
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 560 }}>
          <CallCode code={k.src} fs={21} grey={beat >= 3 ? [2] : []} />
          <StepCaption text={caption} tone={beat === 3 ? 'rule' : 'step'} size={19} minH={52} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-start gap-3">
            <IoBox title="Input" tone="in" lines={[k.input]} fs={18} width={160} />
            <div className="min-w-0 flex-1">
              <IoBox title="Output" lines={beat >= 2 ? k.output.split('\n') : []} rows={2} fs={18} />
            </div>
          </div>
          <Vote options={C3.vote.map((o: string) => o.replace(/ \/ /g, '\n'))} right={right} shown={beat >= 2} pick={pick} setPick={setPick} size={19} />
        </div>
      </div>
      {beat >= 2 && pick === right && <Confetti seed={9} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C5 */

const C5 = SPEC.C5

/**
 * DEFINE FIRST, THEN CALL. Spec card C5, three presses: greet_before.py and
 * its input, the question; line 2 turns red and the output is Python's
 * NameError; the rule.
 */
export function DefineFirst() {
  const beat = useBeats(3)
  const k = C5.code[0]
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 560 }}>
          <CallCode code={k.src} fs={21} error={beat >= 2 ? 2 : null} />
          <StepCaption text={beat === 3 ? C5.show[1] : beat === 1 ? C5.show[0] : null} tone={beat === 3 ? 'rule' : 'step'} size={19} minH={52} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <IoBox title="Input" tone="in" lines={[k.input]} fs={18} width={160} />
          <IoBox title="Output" lines={beat >= 2 ? k.output.split('\n') : []} rows={1} fs={18} />
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C13 */

const C13 = SPEC.C13
const BUILTINS: string[] = C13.show.slice(1, 5)

/**
 * BUILT-IN FUNCTIONS. Spec card C13, three presses: four dashed slots and the
 * question; the slots fill with print(), int(), str(), len() and the line;
 * len.py runs, `4`, and the line that ties it to return.
 */
export function BuiltIns() {
  const beat = useBeats(3)
  const tween = useTween(480)
  const k = C13.code[0]
  return (
    <>
      <div className="flex flex-col gap-6">
        <Ask size={26}>{C13.show[0]}</Ask>
        <div className="flex gap-5">
          {BUILTINS.map((b, i) => {
            const on = beat >= 2
            return (
              <div
                key={b}
                className="grid h-[92px] w-[210px] place-items-center rounded-card font-mono text-[34px] font-bold"
                style={{
                  background: on ? '#E9F8EF' : 'transparent',
                  boxShadow: on ? `inset 0 0 0 2.5px ${colors.success}` : 'none',
                  border: on ? '2px solid transparent' : `2px dashed ${colors.line}`,
                  color: colors.brandDark,
                  transition: tween,
                  transitionDelay: on ? `${i * 130}ms` : '0ms',
                }}
              >
                <span style={{ opacity: on ? 1 : 0, transition: tween, transitionDelay: on ? `${i * 130}ms` : '0ms' }}>{b}</span>
              </div>
            )
          })}
        </div>
        <Show on={beat >= 2}>
          <StepCaption text={beat >= 2 ? C13.show[5] : null} tone="rule" size={20} minH={50} />
        </Show>
        <Show on={beat >= 3} className="flex items-start gap-5">
          <CallCode code={k.src} fs={19} width={420} />
          <IoBox title="Output" lines={beat >= 3 ? [k.output] : []} rows={1} fs={19} width={220} />
          <div className="min-w-0 flex-1 pt-2">
            <StepCaption text={beat >= 3 ? C13.show[6] : null} size={19} minH={50} />
          </div>
        </Show>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
