import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Lines } from './common'
import { sentences, type OutLine } from './pieces'
import { Vote } from './trace'
import { useStepPhase } from './phase'
import { DeckLine, OpFrame, usePick } from './OpCards'
import { BUS, CRICKET, CSE, VOLUNTEERS, Venn, type ChipTone, type Circ } from './venn'
import { SPEC } from './spec'

/**
 * C7 TO C9: COMPARING TWO GROUPS. The answers are True or False.
 *
 * The same two parts as C2 to C6: the program with the question and the
 * vote, then the picture with the output and the original deck's sentence.
 * The picture is the session's one picture: volunteers sits inside cse
 * (subset, superset), and Harsha pokes out of it; the bus group and Hostel
 * cricket slide together and stop with nobody in the middle (disjoint).
 * The cards never say first and second, only "before the dot" and "in the
 * brackets" (C7's must line). Every program was run on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const line = (t: string): OutLine[] => [{ text: t }]

/** The definition: the call in mono, its sentence under it. */
function Def({ sig, text, on }: { sig: string; text: string; on: boolean }) {
  return (
    <DeckLine on={on}>
      <span className="block font-mono text-[16px] font-bold" style={{ color: colors.brandDark }}>
        {sig}
      </span>
      <Lines lines={sentences(text)} />
    </DeckLine>
  )
}

/* the nested picture: cse big, volunteers inside it */
const NW = 410
const NH = 232
const BIG: Circ = { cx: 104, cy: 128, r: 100 }
const INNER: Circ = { cx: 144, cy: 128, r: 56 }
/* with Harsha, volunteers pokes out of cse on the right */
const POKE: Circ = { cx: 186, cy: 128, r: 92 }

/* ===================================================================== C7 */

const C7 = SPEC.C7
const C7P: Prog[] = C7.code
const WITH_HARSHA = [...VOLUNTEERS, 'Harsha']

/**
 * C7. Press 1: the volunteers circle inside cse, subset.py, its True from
 * H2, and the definition. Press 2: Harsha votes too, the vote. Press 3: each
 * volunteer is checked against cse, one after another; Harsha pokes out and
 * lights red; False. Press 4: cse.issubset(volunteers): say it first, then
 * the cse people outside volunteers light red, False.
 */
export function Subset() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const phase = useStepPhase(beat, beat === 3 ? [500, 550, 550, 550, 700, 600] : [2200])
  const harsha = beat === 2 || beat === 3
  const prog = beat === 4 ? C7P[2] : harsha ? C7P[1] : C7P[0]
  const items = harsha ? WITH_HARSHA : VOLUNTEERS
  const tones: Record<string, ChipTone> = {}
  if (beat === 3) WITH_HARSHA.slice(0, phase).forEach((n) => (tones[n] = n === 'Harsha' ? 'bad' : 'ok'))
  const swapDone = beat === 4 && phase >= 1
  if (swapDone) CSE.filter((n) => !VOLUNTEERS.includes(n)).forEach((n) => (tones[n] = 'bad'))
  const out = beat === 1 ? line(C7P[0].output) : beat === 3 && phase >= 6 ? line(C7P[1].output) : swapDone ? line(C7P[2].output) : []
  const caption = beat === 1 ? null : beat === 2 ? C7.show[2] : beat === 3 ? (phase >= 6 ? C7.show[5] : null) : C7.show[6]
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={3}
        ask={caption}
        out={out}
        asking={beat === 2 || (beat === 4 && !swapDone)}
        drawing={beat === 1 || beat === 3 || swapDone}
        vote={<Vote options={[C7.show[3], C7.show[4]]} right={1} shown={beat >= 3} pick={pick} setPick={setPick} cols={2} size={18} nowrap dense />}
        picture={<Venn W={NW} H={NH} L={BIG} R={harsha ? POKE : INNER} left={{ code: 'cse', items: CSE }} right={{ code: 'volunteers', items, at: 'right' }} tones={tones} fs={12} />}
        line={<Def sig={C7.show[0]} text={C7.show[1]} on />}
        side={340}
      />
      {beat >= 3 && pick === 1 && <Confetti seed={19} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C8 */

const C8 = SPEC.C8
const C8P: Prog[] = C8.code

/**
 * C8. Press 1: the same picture, read from the big circle; superset.py and
 * the definition. Press 2: True fills, then the swap, volunteers.issuperset
 * (cse), and the vote. Press 3: False, and the original deck's two lines:
 * small inside big, subset; big around small, superset.
 */
export function Superset() {
  const beat = useBeats(3)
  const { pick, setPick } = usePick()
  const phase = useStepPhase(beat, [1600])
  const swapped = beat === 3 || (beat === 2 && phase >= 1)
  const prog = swapped ? C8P[1] : C8P[0]
  const out = beat === 2 && phase < 1 ? line(C8P[0].output) : beat === 3 ? line(C8P[1].output) : []
  /* the circle the sentence is read from lights */
  const outline = swapped ? { r: true } : { l: true }
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={3}
        ask={swapped ? C8.show[2] : null}
        out={out}
        asking={beat === 1 || (beat === 2 && swapped)}
        drawing={beat === 3}
        vote={
          <div style={{ opacity: swapped ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
            <Vote options={[C8.show[3], C8.show[4]]} right={1} shown={beat >= 3} pick={pick} setPick={setPick} cols={2} size={18} nowrap dense />
          </div>
        }
        picture={<Venn W={NW} H={NH} L={BIG} R={INNER} left={{ code: 'cse', items: CSE }} right={{ code: 'volunteers', items: VOLUNTEERS, at: 'right' }} outline={outline} fs={12} />}
        line={
          beat >= 3 ? (
            <DeckLine on>
              <Lines lines={[C8.show[5], C8.show[6]]} />
            </DeckLine>
          ) : (
            <Def sig={C8.show[0]} text={C8.show[1]} on />
          )
        }
        side={340}
      />
      {beat >= 3 && pick === 1 && <Confetti seed={20} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ===================================================================== C9 */

const C9 = SPEC.C9
const C9P: Prog[] = C9.code
const DW = 470
const DH = 222
const BUS_C: Circ = { cx: 86, cy: 124, r: 82 }
const far: Circ = { cx: DW - 100, cy: 124, r: 96 }
const touch: Circ = { cx: 86 + 82 + 12 + 96, cy: 124, r: 96 }
const meet: Circ = { cx: 180, cy: 124, r: 96 }

/**
 * C9. Press 1: the College bus group and Hostel cricket, apart; disjoint.py.
 * Press 2: the two circles slide toward each other and stop, nobody in the
 * middle; True. Press 3: the bus and CSE-A gang, the vote. Press 4: the
 * circles overlap, Pooja and Divya in the middle; False.
 */
export function Disjoint() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const withCse = beat >= 3
  const prog = withCse ? C9P[1] : C9P[0]
  const R = beat === 2 ? touch : beat === 4 ? meet : far
  const out = beat === 2 ? line(C9P[0].output) : beat === 4 ? line(C9P[1].output) : []
  const tones: Record<string, ChipTone> = beat === 4 ? { Pooja: 'bad', Divya: 'bad' } : {}
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={3}
        ask={beat === 1 ? C9.show[2] : beat === 2 ? C9.show[3] : C9.show[4]}
        out={out}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        vote={
          <div style={{ opacity: withCse ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
            <Vote options={[C9.show[5], C9.show[6]]} right={1} shown={beat >= 4} pick={pick} setPick={setPick} cols={2} size={18} nowrap dense />
          </div>
        }
        picture={<Venn W={DW} H={DH} L={BUS_C} R={R} left={{ code: 'bus', label: 'College bus', items: BUS }} right={withCse ? { code: 'cse', items: CSE } : { code: 'cricket', items: CRICKET }} tones={tones} fs={12} />}
        line={<Def sig={C9.show[0]} text={C9.show[1]} on={beat >= 2} />}
        side={300}
      />
      {beat >= 4 && pick === 1 && <Confetti seed={21} />}
      <StepControls at={beat} total={4} />
    </>
  )
}
