import { useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Definition, Focus, Group } from './common'
import { Confetti } from './motion'
import { Ask, Note, OutPanel, Show, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, Vote } from './trace'
import { useForward, useStepPhase } from './phase'
import { Bag, Chip, Star, STAR_GREEN } from './bag'
import { walkDelays, walkState, type WalkItem } from './walk'
import { outOf } from './SetCards'
import { SPEC } from './spec'

/**
 * THE SECOND BLOCK, "CHANGING A SET": C8 (add), C9 (update), C10 (discard)
 * and C11 (remove). Teja's Close Friends list is the bag, every chip with
 * its green star (spec note 2; the app's own colour inside the drawn world).
 * The three already in, Ravi, Anu and Sneha, never move when a chip bounces
 * or another leaves (the cards' keeps lines). Every output box fills only on
 * the press after the room has said or voted it, and on that press itself,
 * never after a wait inside it (the view fixes change spec, 2026-10-09: no
 * output on a timer); the chips' walks are the movement inside the press.
 */
type Prog = { file: string; src: string; output: string }
const CLOSE: string[] = SPEC.C12.data.close
const LEFT = 'flex w-[478px] shrink-0 flex-col gap-3'
const RIGHT = 'flex min-w-0 flex-1 flex-col gap-3'

/** The Close Friends header: the star and the list's name, as the app titles it. */
function CloseFriends() {
  return (
    <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1 text-[15px] font-bold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${STAR_GREEN}` }}>
      <Star size={18} />
      Close Friends
    </span>
  )
}

/** The items a program sends in, waiting in line outside the door. */
function Waiting({ items, gone, refs }: { items: string[]; gone: (k: number) => boolean; refs: React.MutableRefObject<(HTMLSpanElement | null)[]> }) {
  return (
    <div className="flex min-h-[44px] items-center gap-2">
      {items.map((it, k) => (
        <span key={`wait-${k}-${it}`} ref={(el) => { refs.current[k] = el }} style={{ opacity: gone(k) ? 0 : 1, transition: 'opacity 300ms' }}>
          <Chip label={it} size="sm" />
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ C8 */

const C8 = SPEC.C8
const [P8A, P8B]: Prog[] = C8.code
const C8_CHOICES: string[] = C8.show.slice(4, 7)

/**
 * C8, four presses: the Close Friends bag, add.py; Kiran walks in and joins,
 * 4, and deck slide 26's lines; add_again.py, vote 4 / 3 / Error; Ravi walks
 * up and bounces off, the bag does not change, 3.
 */
export function AddItem() {
  const beat = useBeats(4)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const again = beat >= 3
  const prog = again ? P8B : P8A
  const ran = beat === 2 || beat === 4
  const phase = useStepPhase(beat, [...walkDelays(1), 900])
  const step: WalkItem[] = again ? [{ item: 'Ravi', joins: false }] : [{ item: 'Kiran', joins: true }]
  const w = ran ? walkState(CLOSE, step, phase) : { items: CLOSE, visitor: null }
  const right = C8_CHOICES.indexOf(P8B.output)
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT} active={beat === 3}>
          <Focus on={!ran}>
            <CodePane code={prog.src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          <Show on={beat >= 2}>
            <Definition sig={C8.show[1]}>{C8.show[2].replace(/\.$/, '')}</Definition>
          </Show>
        </Group>
        <Group className={RIGHT} active={ran}>
          <div className="min-h-[96px]">
            <Swap k={again ? 'again' : 'add'}>
              {again ? (
                <div className="flex flex-col gap-2.5">
                  <Ask size={21}>{C8.show[3]}</Ask>
                  <Vote options={C8_CHOICES} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={3} size={19} nowrap />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <CloseFriends />
                  <Ask size={21}>{C8.show[0]}</Ask>
                </div>
              )}
            </Swap>
          </div>
          <Bag key={again ? 'again' : 'add'} items={w.items} universe={[...CLOSE, 'Kiran']} w={400} h={224} name="close" stars visitor={w.visitor} moving={fwd} />
        </Group>
      </div>
      {beat >= 4 && pick === right && <Confetti seed={81} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C9 */

const C9 = SPEC.C9
const [P9U, P9N, P9P, P9A]: Prog[] = C9.code
const C9_CHOICES: string[] = C9.show.slice(3, 6)
const SENT: string[] = [...P9U.src.split('\n')[1].matchAll(/"([^"]*)"/g)].map((m) => m[1])
const POOJA = 'Pooja'
const LETTERS = [...POOJA]

/**
 * C9, five presses: update.py, three chips waiting at the door, deck slide
 * 28's lines; Vamsi joins, Ravi bounces, Pooja joins, one movement each, 5;
 * update_name.py, vote 4 / 8 / 7; the name breaks into letter chips that walk
 * in one by one, the second o bounces, 7 and the printed set; add_name.py, 4.
 */
export function UpdateMany() {
  const beat = useBeats(5)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const waitRefs = useRef<(HTMLSpanElement | null)[]>([])
  const prog = beat >= 5 ? P9A : beat >= 3 ? P9N : P9U
  const walking = beat === 2 || beat === 4
  const steps: WalkItem[] =
    beat <= 2 ? SENT.map((n) => ({ item: n, joins: !CLOSE.includes(n) })) : beat <= 4 ? LETTERS.map((l, k) => ({ item: l, joins: LETTERS.indexOf(l) === k })) : [{ item: POOJA, joins: true }]
  const phase = useStepPhase(beat, [...walkDelays(steps.length), 1000])
  const w = walking || beat === 5 ? walkState(CLOSE, steps, beat === 5 ? 1 : phase, beat === 5 ? undefined : (k) => waitRefs.current[k]) : { items: CLOSE, visitor: null, gone: () => false, origin: () => null }
  const ran = walking || beat === 5
  const right = C9_CHOICES.indexOf(P9N.output)
  const universe = beat <= 2 ? [...CLOSE, 'Vamsi', 'Pooja'] : beat <= 4 ? [...CLOSE, 'P', 'o', 'j', 'a'] : [...CLOSE, POOJA]
  const waiting = beat <= 2 ? SENT : beat <= 4 ? LETTERS : []
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT} active={beat === 3}>
          <Focus on={beat === 1 || beat === 3}>
            <CodePane code={prog.src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          <Swap k={beat <= 2 ? 'def' : beat === 4 ? 'print' : beat === 5 ? 'add' : 'ask'}>
            {beat <= 2 ? (
              <Definition sig={C9.show[0]}>{C9.show[1].replace(/\.$/, '')}</Definition>
            ) : beat === 3 ? (
              <div className="flex flex-col gap-2.5">
                <Ask size={20}>{C9.show[2]}</Ask>
                <Vote options={C9_CHOICES} right={right} shown={false} pick={pick} setPick={setPick} cols={3} size={19} nowrap />
              </div>
            ) : beat === 4 ? (
              <div className="flex flex-col gap-2">
                <Vote options={C9_CHOICES} right={right} shown pick={pick} setPick={setPick} cols={3} size={19} nowrap />
                <Show on className="flex flex-col gap-2">
                  <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 font-mono text-[15px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                    {P9P.output}
                  </span>
                  <Note size={18} lines={[C9.show[6]]} />
                </Show>
              </div>
            ) : (
              <Note size={19} lines={[C9.show[7]]} />
            )}
          </Swap>
        </Group>
        <Group className={RIGHT} active={walking}>
          <CloseFriends />
          <Waiting items={waiting} gone={walking || beat === 5 ? w.gone : () => false} refs={waitRefs} />
          <Bag key={`c9-${beat <= 2 ? 'list' : beat <= 4 ? 'name' : 'add'}`} items={w.items} universe={universe} w={400} h={232} name="close" stars visitor={w.visitor} origin={w.origin} moving={fwd} />
        </Group>
      </div>
      {beat === 4 && pick === right && <Confetti seed={91} />}
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ C10 */

const C10 = SPEC.C10
const [P10A, P10M]: Prog[] = C10.code

/**
 * C10, four presses: the Close Friends bag and discard.py, deck slide 29's
 * lines; Anu walks out, 2; discard_missing.py, Pooja was never in; a finger
 * checks the chips for Pooja and finds nothing, nothing moves, 3.
 */
export function Discard() {
  const beat = useBeats(4)
  const fwd = useForward(beat)
  const second = beat >= 3
  const prog = second ? P10M : P10A
  const ran = beat === 2 || beat === 4
  const items = beat === 2 ? CLOSE.filter((n) => n !== 'Anu') : CLOSE
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className={LEFT}>
          <Focus on={!ran}>
            <CodePane code={prog.src} fontSize={CODE_FS} highlight={2} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          <Definition sig={C10.show[0]}>{C10.show[1]}</Definition>
        </Group>
        <Group className={RIGHT} active={ran}>
          <div className="min-h-[40px]">
            <Swap k={beat}>{beat === 3 ? <Ask size={21}>{C10.show[2]}</Ask> : beat === 4 ? <Ask size={21}>{C10.show[3]}</Ask> : <CloseFriends />}</Swap>
          </div>
          <Bag key={second ? 'missing' : 'discard'} items={items} universe={CLOSE} w={400} h={232} name="close" stars moving={fwd} finger={beat === 4 ? { path: CLOSE, found: null } : null} />
        </Group>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C11 */

const C11 = SPEC.C11
const [P11M, P11A]: Prog[] = C11.code
const C11_CHOICES: string[] = C11.show.slice(1, 4)

/**
 * C11, three presses: discard_missing.py and remove_missing.py side by side
 * (only line 2 differs), vote 3 / 2 / KeyError; line 2 lights red, the
 * KeyError, line 3 greys, "Line 3 never runs."; remove.py, Anu is there and
 * walks out, 2, "discard is quiet. remove complains."
 *
 * The output sits under the program that made it, the remove column, and is
 * titled remove's output (the view fixes change spec, 2026-10-09: it used to
 * sit under the discard code and read as discard's KeyError). On press 3 the
 * choices dim: they were about remove_missing.py, not remove.py.
 */
export function RemoveComplains() {
  const beat = useBeats(3)
  const fwd = useForward(beat)
  const [pick, setPick] = useState(-1)
  const third = beat >= 3
  const prog = third ? P11A : P11M
  const right = C11_CHOICES.indexOf('KeyError')
  return (
    <>
      <div className="flex flex-col gap-3">
        {/* deck slide 30's two boxes side by side: only line 2 differs */}
        <Group className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              discard
            </span>
            <CodePane code={P10M.src} fontSize={CODE_FS} highlight={2} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              remove
            </span>
            <Focus on={beat === 1}>
              <CodePane code={prog.src} fontSize={CODE_FS} at={beat === 2 ? 2 : null} stop={beat === 2} gap={beat === 2 ? 3 : undefined} highlight={beat !== 2 ? 2 : undefined} />
            </Focus>
          </div>
        </Group>
        <div className="flex items-stretch gap-4">
          <Group className="flex w-[400px] shrink-0 flex-col gap-2.5" active={beat === 1}>
            <Ask size={21}>{C11.show[0]}</Ask>
            <div style={{ opacity: third ? 0.35 : 1, transition: 'opacity 420ms cubic-bezier(0.22,1,0.36,1)' }}>
              <Vote options={C11_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} template="0.7fr 0.7fr 1.5fr" size={19} nowrap />
            </div>
          </Group>
          <Group className="flex min-w-0 flex-1 items-center justify-center">
            <Bag items={third ? CLOSE.filter((n) => n !== 'Anu') : CLOSE} universe={CLOSE} w={300} h={150} size="sm" name="close" stars moving={fwd} door={false} />
          </Group>
          {/* under the remove column: the program that made the output */}
          <Group className="flex w-[380px] shrink-0 flex-col gap-2.5">
            <OutPanel title="remove's output" lines={beat >= 2 ? outOf(prog) : []} fontSize={OUT_FS} />
            <Swap k={beat}>{beat === 2 ? <Note size={18} lines={[C11.show[4]]} /> : beat === 3 ? <Note size={18} lines={[C11.show[5]]} /> : null}</Swap>
          </Group>
        </div>
      </div>
      {beat >= 2 && pick === right && <Confetti seed={111} />}
      <StepControls at={beat} total={3} />
    </>
  )
}
