import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, BigLine, Note, OutPanel, Show, Swap, sentences, type OutLine, CODE_FS, CODE_REF_FS, OUT_FS } from './pieces'
import { CodePane, Vote } from './trace'
import { useForward, useStepPhase } from './phase'
import { Bag, Chip, bagSlot } from './bag'
import { SPEC } from './spec'

/**
 * THE FIRST BLOCK, "SETS": C1 (a set), C2 (creating one), C3 (no order), C4
 * (no repeats), C5 (only items that cannot change), C6 (an empty set) and C7
 * (no order, no position). E1 is `Converter.tsx`.
 *
 * Every card is two groups (2b items 1 and 2): the program with its output,
 * and the picture with the vote. The program being asked is ringed (`Focus`)
 * until its output shows. Every output box starts empty and fills only on
 * the press after the room has said or voted it (the cards' must lines).
 * Every program and output is the spec's, run on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
export const outOf = (p: Prog): OutLine[] => p.output.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

const LEFT = 'flex w-[468px] shrink-0 flex-col gap-3'
const RIGHT = 'flex min-w-0 flex-1 flex-col gap-3'
/* slides 11 and 14, C3 and C6, filled only the top half of the slide (the view fixes change spec, 2026-10-09): their code, output, question and picture are set larger, and the slide centres them */
const WIDE_LEFT = 'flex w-[564px] shrink-0 flex-col gap-3'
const BIG_CODE_FS = 18
const BIG_OUT_FS = 20

/* ------------------------------------------------------------------ C1 */

const C1 = SPEC.C1
const VIEWERS: string[] = SPEC.H1.data.seen_by

/** One of C1's three points: a number, the words, lit from its press on. */
function Point({ n, text, on }: { n: number; text: string; on: boolean }) {
  const tween = useTween(480)
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-2.5"
      style={{ background: on ? colors.white : 'rgba(255,255,255,0)', boxShadow: on ? `inset 0 0 0 1.5px ${colors.line}, 0 8px 18px -14px rgba(16,32,58,0.35)` : `inset 0 0 0 1.5px ${colors.line}00`, opacity: on ? 1 : 0.3, transition: tween }}
    >
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[15px] font-bold" style={{ background: on ? colors.brandDark : colors.surface2, color: on ? colors.white : colors.muted, transition: tween }}>
        {n}
      </span>
      <span className="font-heading text-[22px] font-bold leading-snug" style={{ color: colors.ink }}>
        <Lines lines={sentences(text)} />
      </span>
    </div>
  )
}

/**
 * C1, four presses: the bag from the hook with deck slide 16's line; point 1
 * and Ravi's chip pulses; point 2 and the chips drift to new places; point 3
 * and a small lock beside each chip.
 */
export function WhatSet() {
  const beat = useBeats(4)
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT}>
          <div className="rounded-card px-5 py-3" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
            <span className="font-heading text-[26px] font-bold" style={{ color: colors.brandDark }}>
              {C1.show[0]}
            </span>
          </div>
          {[1, 2, 3].map((i) => (
            <Point key={`pt-${i}`} n={i} text={C1.show[i]} on={beat > i} />
          ))}
        </Group>
        <Group className={`${RIGHT} items-center justify-center`}>
          <Bag items={VIEWERS} door={false} w={430} h={268} name="viewers" drift={beat >= 3 ? 1 : 0} locks={beat >= 4} states={beat === 2 ? { Ravi: 'lit' } : {}} />
        </Group>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C2 */

const C2 = SPEC.C2
const P2: Prog = C2.code[0]
/* the brackets as two dashed slots until press 2 (the play line) */
const P2_OPEN = P2.src.replace('{', '___').replace('}', '___')
/* two lines from the last two weeks: a list in [ ], a tuple in ( ) */
const BEFORE = 'opens = ["Ravi", "Anu", "Ravi"]\norder = ("Maggi", 40)'

/**
 * C2, three presses: last weeks' list and tuple lines, create.py with its
 * brackets as two dashed slots; the slots fill with { and }, the line is the
 * biggest text on the card, and the three names drop into a bag; the output
 * and the rule. The names stay exactly as typed: only the brackets are new.
 */
export function CreateSet() {
  const beat = useBeats(3)
  const fwd = useForward(beat)
  const ran = beat >= 3
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[500px] shrink-0 flex-col gap-3">
          {/* the caption's three sentences side by side: list, tuple, set */}
          <div className="flex gap-2">
            {sentences(C2.show[0]).map((t, i) => (
              <span key={`q-${i}`} className="whitespace-nowrap rounded-lg px-3 py-1.5 font-heading text-[19px] font-bold" style={{ background: i === 2 ? colors.brandDark : colors.white, color: i === 2 ? colors.white : colors.brandDark, boxShadow: i === 2 ? 'none' : `inset 0 0 0 1.5px ${colors.line}` }}>
                {t}
              </span>
            ))}
          </div>
          <CodePane code={BEFORE} fontSize={CODE_REF_FS} />
          <Focus on={!ran}>
            <CodePane code={beat >= 2 ? P2.src : P2_OPEN} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(P2) : []} fontSize={OUT_FS} />
        </Group>
        <Group className={`${RIGHT} items-start`} active={beat === 2}>
          <div style={{ minHeight: 58 }}>
            {beat >= 2 && (
              <BigLine size={24} k="set" className="!px-4">
                {P2.src.split('\n')[0]}
              </BigLine>
            )}
          </div>
          <Bag items={beat >= 2 ? VIEWERS : []} door={false} w={380} h={212} name="viewers" moving={fwd} />
          <div className="min-h-[56px]">
            <Swap k={beat}>
              {beat === 2 && <Ask size={22}>{C2.show[1]}</Ask>}
              {beat === 3 && <Note size={20} lines={sentences(C2.show[2])} />}
            </Swap>
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C3 */

const C3 = SPEC.C3
const RUNS: Prog[] = C3.code.slice(0, 3)
const LIKES: Prog = C3.code[3]
/* one tint per name, so the room sees the same four in each run */
const TINT: Record<string, string> = { Ravi: colors.brand, Anu: colors.accent, Kiran: colors.success, Sneha: colors.warning }

/** A printed set, each name on its own tint. One element per run. */
function RunLine({ n, text, fresh }: { n: number; text: string; fresh: boolean }) {
  const instant = useInstant()
  const names = [...text.matchAll(/'([^']*)'/g)].map((m) => m[1])
  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl bg-white px-3 py-2"
      style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}
      initial={fresh && !instant ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="w-[62px] shrink-0 text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        Run {n}
      </span>
      <span className="whitespace-nowrap font-mono text-[20px] font-semibold" style={{ color: colors.ink }}>
        {'{'}
        {names.map((nm, i) => (
          <span key={`${n}-${nm}`}>
            <motion.span
              className="inline-block rounded-md px-1"
              style={{ background: `${TINT[nm]}2E`, boxShadow: `inset 0 -2px 0 ${TINT[nm]}` }}
              initial={fresh && !instant ? { y: -30, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            >
              '{nm}'
            </motion.span>
            {i < names.length - 1 ? ', ' : ''}
          </span>
        ))}
        {'}'}
      </span>
    </motion.div>
  )
}

/** Teja's last three posts, each with its likes. */
function Posts({ likes }: { likes: number[] }) {
  return (
    <div className="flex gap-3">
      {likes.map((n, i) => (
        <div key={`post-${i}`} className="flex w-[140px] flex-col overflow-hidden rounded-xl bg-white" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 8px 18px -14px rgba(16,32,58,0.4)` }}>
          <span className="h-[84px]" style={{ background: ['linear-gradient(150deg,#F3E9DC,#E2C9A8)', 'linear-gradient(150deg,#DDE9F7,#B9CDEB)', 'linear-gradient(150deg,#E4F3E6,#BFE0C4)'][i] }} />
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[18px] font-bold" style={{ color: colors.ink }}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 21s-7.5-4.6-9.4-9.1C1.3 8.6 3.4 5 7 5c2.2 0 3.6 1.2 5 3 1.4-1.8 2.8-3 5-3 3.6 0 5.7 3.6 4.4 6.9C19.5 16.4 12 21 12 21z" fill="#ED4956" />
            </svg>
            {n}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * C3, six presses: order.py, empty output; run 1; run 2 ("Run it again");
 * run 3, the three runs one above the other, the same four names lit in each,
 * and deck slide 18's line; likes.py on three post tiles, "Does a set sort
 * numbers?"; {40, 120, 15}, not sorted and not the typed order. No question
 * asks which order is right (must_not).
 */
export function NoOrder() {
  const beat = useBeats(6)
  const fwd = useForward(beat)
  const likes = beat >= 5
  const runs = likes ? 0 : Math.max(0, beat - 1)
  const caption = beat === 1 ? C3.show[0] : beat === 3 ? C3.show[1] : beat === 4 ? C3.show[2] : beat === 5 ? C3.show[4] : null
  const likeNums = (LIKES.src.match(/\{([^}]*)\}/)![1]).split(', ').map(Number)
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={WIDE_LEFT}>
          <Focus on={beat === 1 || beat === 5}>
            <CodePane code={likes ? LIKES.src : RUNS[0].src} fontSize={BIG_CODE_FS} />
          </Focus>
          <div className="min-h-[60px]">
            <Swap k={caption ?? 'none'}>{caption && <Ask size={25}><Lines lines={sentences(caption)} /></Ask>}</Swap>
          </div>
          <Show on={beat === 4}>
            <Note size={21} lines={[C3.show[3]]} />
          </Show>
        </Group>
        <Group className={RIGHT}>
          <Swap k={likes ? 'likes' : 'runs'}>
            {likes ? (
              <div className="flex flex-col gap-3">
                <Posts likes={likeNums} />
                <OutPanel lines={beat >= 6 ? outOf(LIKES) : []} fontSize={BIG_OUT_FS} />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <span className="text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                  Output, one run at a time
                </span>
                {RUNS.slice(0, runs).map((r, i) => (
                  <RunLine key={`run-${i}`} n={i + 1} text={r.output} fresh={fwd && i === runs - 1} />
                ))}
                {runs === 0 && <div className="h-[56px] rounded-xl" style={{ boxShadow: `inset 0 0 0 2px ${colors.line}`, outline: 'none' }} />}
              </div>
            )}
          </Swap>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ C4 */

const C4 = SPEC.C4
const [P4, P4P, P4C]: Prog[] = C4.code
const TYPED: string[] = [...P4.src.split('\n')[0].matchAll(/"([^"]*)"/g)].map((m) => m[1])
const C4_CHOICES: string[] = C4.show.slice(1, 4)

/**
 * C4, four presses: repeats.py (Ravi three times), vote 5 / 3 / Error; the
 * output fills 3, the printed set beside it, and the five typed names settle
 * as three in the bag; case.py, "Ravi and ravi?"; 2, the R and the r ringed.
 */
export function NoRepeats() {
  const beat = useBeats(4)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = second ? P4C : P4
  const ran = beat === 2 || beat === 4
  const right = C4_CHOICES.indexOf(P4.output)
  const caseItems = [...P4C.src.split('\n')[0].matchAll(/"([^"]*)"/g)].map((m) => m[1])
  return (
    <>
      <div className="flex items-stretch gap-8">
        {/* the asked cluster: the program, its output and the question */}
        <Group className="flex w-[548px] shrink-0 flex-col gap-3" active={beat === 1 || beat === 3}>
          <Focus on={!ran}>
            <CodePane code={prog.src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          <Swap k={second ? 'case' : 'count'}>
            {second ? (
              <Ask size={22}>{C4.show[5]}</Ask>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Ask size={22}>{C4.show[0]}</Ask>
                <Vote options={C4_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={20} nowrap />
              </div>
            )}
          </Swap>
        </Group>
        {/* the picture: the typed names settling in the bag */}
        <Group className={RIGHT} active={beat === 2 || beat === 4}>
          {!second && (
            <div className="flex gap-2">
              {TYPED.map((n, i) => (
                <Chip key={`typed-${i}`} label={n} size="sm" state={beat >= 2 && TYPED.indexOf(n) !== i ? 'grey' : 'plain'} />
              ))}
            </div>
          )}
          <Bag
            key={second ? 'case' : 'count'}
            items={second ? (beat >= 4 ? caseItems : []) : beat >= 2 ? [...new Set(TYPED)] : []}
            door={false}
            w={360}
            h={190}
            name="viewers"
            moving={fwd}
            marks={beat >= 4 ? caseItems : []}
          />
          <Show on={beat === 2} className="flex flex-col gap-2">
            {/* repeats_print.py: the same set, printed */}
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[15px] font-semibold" style={{ background: colors.night2, color: colors.white }}>
                {P4P.src.split('\n')[1]}
              </span>
              <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 font-mono text-[16px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                {P4P.output}
              </span>
            </div>
            <Note size={18} lines={[C4.show[4]]} />
          </Show>
        </Group>
      </div>
      {beat >= 2 && pick === right && <Confetti seed={41} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C5 */

const C5 = SPEC.C5
const [P5T, P5L]: Prog[] = C5.code
const TUPLE_CHIP = '("Ravi", 4)'
const LIST_CHIP = '["Ravi", 4]'
const C5_CHOICES: string[] = C5.show.slice(2, 5)

/**
 * C5, four presses: tuple_in.py, a locked tuple chip at the bag's door beside
 * Kiran; it slides in, 2; list_in.py, a list chip with handles, vote 2 / 3 /
 * TypeError; it walks up and bounces off, the bag stays empty (Python stops
 * on that line), the TypeError and the two lines.
 */
export function Immutable() {
  const beat = useBeats(4)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const list = beat >= 3
  const prog = list ? P5L : P5T
  const ran = beat === 2 || beat === 4
  const right = C5_CHOICES.indexOf('TypeError')
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT}>
          <Focus on={!ran}>
            <CodePane code={prog.src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          <Show on={beat === 4} className="flex flex-col gap-2">
            <Note size={19} lines={[C5.show[5]]} />
            <Note size={19} lines={[C5.show[6]]} />
          </Show>
        </Group>
        <Group className={RIGHT} active={beat === 1 || beat === 3}>
          <div className="min-h-[96px]">
            <Swap k={list ? 'list' : 'tuple'}>
              {list ? (
                <div className="flex flex-col gap-2.5">
                  <Ask size={22}>{C5.show[1]}</Ask>
                  <Vote options={C5_CHOICES} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={3} size={19} nowrap />
                </div>
              ) : (
                <Ask size={22}>{C5.show[0]}</Ask>
              )}
            </Swap>
          </div>
          {/* a wider door zone, so the tuple and list chips waiting at it sit fully inside the card (the view fixes change spec, 2026-10-09) */}
          <Bag
            key={list ? 'list' : 'tuple'}
            items={list ? [] : beat >= 2 ? ['Kiran', TUPLE_CHIP] : ['Kiran']}
            universe={['Kiran', TUPLE_CHIP]}
            doorW={220}
            w={392}
            h={220}
            name="opens"
            moving={fwd}
            visitor={list ? { label: LIST_CHIP, mode: beat >= 4 ? 'bounce' : 'wait', tag: beat >= 4 ? 'can change' : '' } : beat === 1 ? { label: TUPLE_CHIP, mode: 'wait', tag: '' } : null}
          />
        </Group>
      </div>
      {beat >= 4 && pick === right && <Confetti seed={51} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C6 */

const C6 = SPEC.C6
const P6: Prog = C6.code[0]
const C6_CHOICES: string[] = C6.show.slice(1, 4)

/** One of C6's two empty bags, with the line that names it once the output is in. */
function EmptyBag({ name, kind, note, on }: { name: string; kind: 'set' | 'dict'; note: string; on: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Bag items={[]} door={false} w={240} h={136} name={name} kind={kind} />
      <Show on={on} className="min-w-0 flex-1">
        <Note size={20} lines={sentences(note)} />
      </Show>
    </div>
  )
}

/**
 * C6, two presses: empty.py with lines 1 and 2 lit, two empty bags a and b,
 * vote a / b / Both; the three outputs, bag a turns out to be a dictionary
 * (dashed, `dict`) with its line, bag b with set()'s line. Dictionaries are
 * named once, never taught (must_not).
 */
export function EmptySet() {
  const beat = useBeats(2)
  const [pick, setPick] = useState(-1)
  const ran = beat >= 2
  const right = C6_CHOICES.indexOf('b')
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={WIDE_LEFT}>
          <Focus on={!ran}>
            <CodePane code={P6.src} fontSize={BIG_CODE_FS} mark={ran ? undefined : [1, 2]} highlight={ran ? 1 : undefined} />
          </Focus>
          <OutPanel lines={ran ? outOf(P6) : []} minRows={3} fontSize={BIG_OUT_FS} />
        </Group>
        <Group className={RIGHT} active={beat === 1}>
          <Ask size={25}>{C6.show[0]}</Ask>
          <Vote options={C6_CHOICES} right={right} shown={ran} pick={pick} setPick={setPick} cols={3} size={22} nowrap />
          <EmptyBag name={ran ? 'a · dict' : 'a'} kind={ran ? 'dict' : 'set'} note={C6.show[5]} on={ran} />
          <EmptyBag name={ran ? 'b · set' : 'b'} kind="set" note={C6.show[4]} on={ran} />
        </Group>
      </div>
      {ran && pick === right && <Confetti seed={61} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ------------------------------------------------------------------ C7 */

const C7 = SPEC.C7
const [P7F, P7S, P7I]: Prog[] = C7.code
const C7_CHOICES: string[] = C7.show.slice(1, 4)
const BAG7 = { w: 360, h: 220 }

/**
 * The index pointer: a `[0]` tag that hovers over the chips looking for a
 * number under each, finds none and shakes. It never moves a chip.
 */
function Pointer({ text, play }: { text: string; play: boolean }) {
  const instant = useInstant()
  const pts = VIEWERS.map((_, i) => bagSlot(i, BAG7.w, BAG7.h, false))
  const xs = pts.map((p) => p[0] - 26)
  /* it searches along the bag's bottom edge, under each chip in turn, so it never crosses one (rule 47) */
  const ys = pts.map(() => BAG7.h + 6)
  const end = { x: BAG7.w / 2 - 30, y: BAG7.h + 6 }
  const go = play && !instant
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-[3]"
      initial={go ? { x: xs[0], y: ys[0], opacity: 0 } : false}
      animate={
        go
          ? { x: [...xs, end.x, end.x - 9, end.x + 8, end.x - 5, end.x], y: [...ys, end.y, end.y, end.y, end.y, end.y], opacity: [1, 1, 1, 1, 1, 1, 1, 1], transition: { duration: 3.2, times: [0, 0.18, 0.36, 0.6, 0.72, 0.8, 0.88, 1], ease: 'easeInOut' } }
          : { x: end.x, y: end.y, opacity: 1 }
      }
    >
      <span className="whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-[18px] font-bold" style={{ background: '#FDECEC', color: colors.danger, boxShadow: `inset 0 0 0 2px ${colors.danger}` }}>
        {text}
      </span>
    </motion.div>
  )
}

/**
 * C7, four presses: first.py with the viewer bag, vote "Ravi" / "Kiran" /
 * TypeError; the [0] pointer finds no number and shakes, the TypeError, "No
 * first item. No [0]."; slice.py, the [0:2] pointer shakes too; in_check.py,
 * the finger checks the chips for Kiran (found), then for Pooja (none), True
 * then False, "Ask with in instead." Neither the pointer nor the finger
 * moves a chip (keeps line). Both lines of in_check.py's output are on the
 * press itself; the finger's two searches are the movement inside it (the
 * view fixes change spec, 2026-10-09: no output on a timer).
 */
export function NoPosition() {
  const beat = useBeats(4)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const prog = beat >= 4 ? P7I : beat >= 3 ? P7S : P7F
  const ran = beat >= 2
  const right = C7_CHOICES.indexOf('TypeError')
  /* press 4: the first check (Kiran) runs, then the second (Pooja) */
  const phase = useStepPhase(beat, [2600])
  const second = beat === 4 && phase >= 1
  const finger = beat === 4 ? (second ? { path: VIEWERS, found: null } : { path: VIEWERS, found: 'Kiran' }) : null
  const out = ran ? outOf(prog) : []
  const caption = beat === 2 ? C7.show[4] : beat === 4 ? C7.show[5] : null
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT}>
          <Focus on={beat === 1}>
            <CodePane code={prog.src} fontSize={CODE_FS} highlight={beat === 4 ? (second ? 3 : 2) : 2} />
          </Focus>
          <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          <div className="min-h-[50px]">
            <Swap k={caption ?? 'none'}>{caption && <Note size={19} lines={sentences(caption)} />}</Swap>
          </div>
        </Group>
        <Group className={RIGHT} active={beat === 1}>
          <Ask size={22}>{C7.show[0]}</Ask>
          <Vote options={C7_CHOICES} right={right} shown={ran} pick={pick} setPick={setPick} cols={3} size={19} nowrap />
          <div className="pb-10">
            <Bag items={VIEWERS} door={false} w={BAG7.w} h={BAG7.h} name="viewers" finger={finger} moving={fwd} states={beat === 4 && !second ? { Kiran: 'check' } : {}}>
              {(beat === 2 || beat === 3) && <Pointer key={`ptr-${beat}`} text={beat === 2 ? '[0]' : '[0:2]'} play={fwd} />}
            </Bag>
          </div>
        </Group>
      </div>
      {ran && pick === right && <Confetti seed={71} />}
      <StepControls at={beat} total={4} />
    </>
  )
}


