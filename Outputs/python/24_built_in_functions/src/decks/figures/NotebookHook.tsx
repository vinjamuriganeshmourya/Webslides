import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { sentences } from './pieces'
import { usePhase } from './tiles21'
import { SPEC } from './spec'

/**
 * HOOK H1: WRITE IT IN MY NOTEBOOK. Six presses, no code and no code word
 * (its must_not lines).
 *
 *   1  A classroom bench in exam week. Ravi's notebook lies open: Unit 1,
 *      Unit 2, then a blank page. A small calendar has Monday circled.
 *   2  Ravi holds his notebook out to Priya.
 *   3  ONE movement (its must line): the notebook slides to Priya, a Unit 3
 *      page fills in after Unit 2, and the same notebook slides back.
 *   4  A week later: Priya at the xerox shop counter with the notebook,
 *      which now ends at Unit 3.
 *   5  The machine slides out a xerox beside the notebook; Unit 4 fills in
 *      on the xerox only; the notebook goes back to Ravi, still ending at
 *      Unit 3.
 *   6  Two halves together: one notebook with `Ravi's notebook` and `the
 *      book in Priya's hands` on it; then the notebook and the xerox, each
 *      with its own label.
 *
 * Ravi's notebook is ONE element (same blue cover, same name label), moved,
 * never redrawn. The notebook, the xerox and the machine keep their own
 * colours (a ruled college notebook, photocopy paper), not brand tokens.
 * Nothing moves by itself: the movement inside a press plays only when the
 * press is reached forward.
 */
const H1 = SPEC.H1
const BEFORE: string[] = H1.data.units_before
const IN_BOOK: string = H1.data.added_in_book
const ON_XEROX: string = H1.data.added_on_xerox
const SHOW: string[] = H1.show

/** The notebook's own colours (a ruled college notebook), not brand tokens. */
const NB = { cover: '#1F4FA3', coverDark: '#163B7C', paper: '#FFFEF8', rule: '#CFE0F5', margin: '#F2A7A7', ink: '#1C3F94' }
/** Photocopy paper and its grey toner. */
const XR = { paper: '#FAFAFA', edge: '#D9DCE1', ink: '#4B5058', rule: '#E6E8EC' }

const W = 150
const H = 236
const ROW = 42
const STAGE_W = 780
const STAGE_H = 418
const BOOK_Y = 112
const RAVI_X = 40
const PRIYA_X = 400
const XEROX_X = 610
const LEFT_X = 210
const COPY_X = 440

function Page({ unit, ink, rule, fresh }: { unit: string | null; ink: string; rule: string; fresh: boolean }) {
  const instant = useInstant()
  return (
    <div className="relative flex items-center pl-7" style={{ height: ROW, borderBottom: `1.5px solid ${rule}` }}>
      {unit && (
        <motion.span
          className="font-heading text-[19px] font-bold italic"
          style={{ color: ink }}
          initial={instant || !fresh ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {unit}
        </motion.span>
      )}
    </div>
  )
}

/** A ruled notebook: the blue cover band with its name label, then one ruled line per unit heading. */
function Notebook({ units, fresh }: { units: string[]; fresh?: string }) {
  const lines = [...units, ...Array(Math.max(0, 4 - units.length)).fill(null)]
  return (
    <div className="relative overflow-hidden rounded-[10px]" style={{ width: W, height: H, background: NB.paper, boxShadow: `0 0 0 2px ${NB.coverDark}, 0 12px 22px -14px rgba(16,32,58,0.55)` }}>
      <div className="flex items-center justify-center" style={{ height: 52, background: NB.cover }}>
        <span className="rounded-md bg-white px-3 py-0.5 font-heading text-[16px] font-bold" style={{ color: NB.coverDark }}>
          Ravi
        </span>
      </div>
      <span className="absolute bottom-0 top-[52px] w-[1.5px]" style={{ left: 18, background: NB.margin }} />
      <div className="flex flex-col">
        {lines.map((u, i) => (
          <Page key={i} unit={u} ink={NB.ink} rule={NB.rule} fresh={u !== null && u === fresh} />
        ))}
      </div>
    </div>
  )
}

/** A xerox: stapled photocopy sheets, grey toner, no cover. */
function Xerox({ units, fresh }: { units: string[]; fresh?: string }) {
  const lines = [...units, ...Array(Math.max(0, 4 - units.length)).fill(null)]
  return (
    <div className="relative" style={{ width: W, height: H }}>
      <span className="absolute rounded-[4px]" style={{ left: 6, top: 6, width: W, height: H, background: XR.paper, boxShadow: `0 0 0 1.5px ${XR.edge}` }} />
      <div className="relative overflow-hidden rounded-[4px]" style={{ width: W, height: H, background: XR.paper, boxShadow: `0 0 0 1.5px ${XR.edge}, 0 12px 22px -14px rgba(16,32,58,0.45)` }}>
        <div className="relative" style={{ height: 52, background: '#ECEDEF' }}>
          <span className="absolute left-3 top-2 h-[3px] w-5 rounded-full" style={{ background: '#9AA0A8' }} />
        </div>
        <div className="flex flex-col">
          {lines.map((u, i) => (
            <Page key={i} unit={u} ink={XR.ink} rule={XR.rule} fresh={u !== null && u === fresh} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** The copy machine at the shop counter: its lid, glass and the tray the xerox comes out of. */
function Machine() {
  return (
    <svg width="170" height="98" viewBox="0 0 170 98" aria-hidden>
      <rect x="4" y="10" width="162" height="70" rx="10" fill="#D5D9DE" stroke="#9AA0A8" strokeWidth="2" />
      <rect x="10" y="2" width="150" height="14" rx="5" fill="#5C6470" />
      <rect x="22" y="30" width="96" height="10" rx="3" fill="#8FA9C7" />
      <circle cx="144" cy="35" r="6" fill="#2EB872" />
      <rect x="30" y="80" width="110" height="12" rx="3" fill="#B7BDC5" />
    </svg>
  )
}

/** The small exam-week calendar, Monday circled. */
function Calendar() {
  return (
    <div className="absolute flex flex-col overflow-hidden rounded-lg bg-white" style={{ left: RAVI_X, top: 0, width: 92, boxShadow: `0 0 0 1.5px ${colors.line}, 0 6px 14px -10px rgba(16,32,58,0.3)` }}>
      <span className="h-3" style={{ background: '#E5484D' }} />
      <span className="relative grid h-[54px] place-items-center font-heading text-[20px] font-bold" style={{ color: '#1F2328' }}>
        Mon
        <span className="absolute h-[38px] w-[62px] rounded-full" style={{ border: '2.5px solid #E5484D' }} />
      </span>
    </div>
  )
}

/** A person's name, under the spot where they stand. */
function Person({ name, x }: { name: string; x: number }) {
  return (
    <span className="absolute whitespace-nowrap text-[17px] font-bold" style={{ left: x, top: BOOK_Y + H + 18, width: W, textAlign: 'center', color: colors.brandDark }}>
      {name}
    </span>
  )
}

export function NotebookHook() {
  const beat = useBeats(6)
  const instant = useInstant()
  /* press 3: across (1), the Unit 3 page (2), back (3) */
  const p3 = usePhase(beat, 3, [80, 820, 900])
  /* press 5: the xerox slides out (1), Unit 4 on the xerox (2), the notebook goes back (3) */
  const p5 = usePhase(beat, 5, [80, 900, 900])

  const withUnit3 = [...BEFORE, IN_BOOK]
  const units = beat < 3 ? BEFORE : beat === 3 && p3 < 2 ? BEFORE : withUnit3
  const bookX =
    beat === 1 ? RAVI_X : beat === 2 ? RAVI_X + 56 : beat === 3 ? (p3 === 1 || p3 === 2 ? PRIYA_X : RAVI_X) : beat === 4 ? PRIYA_X : beat === 5 ? (p5 >= 3 ? RAVI_X : PRIYA_X) : LEFT_X
  const xerox = (beat === 5 && p5 >= 1) || beat === 6
  const xeroxUnits = beat === 6 || p5 >= 2 ? [...withUnit3, ON_XEROX] : withUnit3
  const caption = beat === 1 ? [SHOW[0]] : beat === 2 ? [SHOW[1], SHOW[2]] : beat === 3 ? [SHOW[3]] : beat === 4 ? [SHOW[4], SHOW[5]] : beat === 5 ? [SHOW[6]] : [SHOW[10]]
  return (
    <>
      <div className="flex items-start gap-6">
        <div className="relative shrink-0" style={{ width: STAGE_W, height: STAGE_H }}>
          {beat <= 3 && <Calendar />}
          {/* the bench (presses 1 to 3), then the shop counter (4 and 5) */}
          {beat <= 3 && <span className="absolute rounded-md" style={{ left: 0, top: BOOK_Y + H + 6, width: 600, height: 9, background: '#C89B6D' }} />}
          {(beat === 4 || beat === 5) && <span className="absolute rounded-md" style={{ left: PRIYA_X - 30, top: BOOK_Y + H + 6, width: STAGE_W - PRIYA_X + 30, height: 9, background: '#9AA0A8' }} />}
          {beat < 6 && <Person name="Ravi" x={RAVI_X} />}
          {beat < 6 && <Person name="Priya" x={PRIYA_X} />}
          {/* Ravi's spot while his notebook is away: an empty outline where it goes */}
          {(beat === 4 || (beat === 5 && p5 < 3)) && <span className="absolute rounded-[10px]" style={{ left: RAVI_X, top: BOOK_Y, width: W, height: H, border: `2px dashed ${colors.line}` }} />}
          {(beat === 4 || beat === 5) && (
            <motion.div className="absolute" style={{ left: XEROX_X - 10, top: 0 }} initial={instant ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}>
              <Machine />
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {xerox && (
              <motion.div key="xerox" className="absolute" style={{ left: XEROX_X, top: BOOK_Y }} initial={instant || beat === 6 ? false : { opacity: 0, y: -70 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <Xerox units={xeroxUnits} fresh={beat === 5 ? ON_XEROX : undefined} />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Ravi's notebook: ONE element, moved, never redrawn */}
          <motion.div
            className="absolute left-0 z-10"
            style={{ top: BOOK_Y }}
            initial={false}
            animate={{ x: bookX, rotate: beat === 2 ? -4 : 0 }}
            transition={instant ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Notebook units={units} fresh={beat === 3 ? IN_BOOK : undefined} />
          </motion.div>
          {beat === 6 && <TwoHalves />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-6">
          <BeatFade beatKey={beat}>
            <div className="flex flex-col gap-3">
              {caption.map((c, i) => (
                <p key={i} className="font-heading text-[23px] font-bold leading-snug" style={{ color: c.endsWith('?') ? colors.brandDark : colors.ink }}>
                  <Lines lines={sentences(c)} />
                </p>
              ))}
            </div>
          </BeatFade>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/**
 * Press 6, both halves on screen together (its must line). Left: the one
 * notebook, `Ravi's notebook` above it and `the book in Priya's hands` under
 * it, an arrow from each. Right: the notebook again and the xerox, each with
 * its own label.
 */
function TwoHalves() {
  const instant = useInstant()
  const enter = (d: number) => ({ initial: instant ? false : { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.52, delay: instant ? 0 : d } })
  const cx = LEFT_X + W / 2
  const below = BOOK_Y + H + 30
  const label = 'absolute whitespace-nowrap text-center font-heading text-[18px] font-bold'
  return (
    <>
      <span className="absolute" style={{ left: COPY_X - 22, top: 20, width: 2, height: STAGE_H - 30, background: colors.line }} />
      <motion.span {...enter(0.2)} className={label} style={{ left: cx - 130, top: 34, width: 260, color: colors.brandDark }}>
        {SHOW[7]}
      </motion.span>
      <motion.span {...enter(0.5)} className={label} style={{ left: cx - 130, top: below, width: 260, color: colors.brandDark }}>
        {SHOW[8]}
      </motion.span>
      <motion.div {...enter(0.8)} className="absolute" style={{ left: COPY_X, top: BOOK_Y }}>
        <Notebook units={[...BEFORE, IN_BOOK]} />
      </motion.div>
      <motion.span {...enter(1)} className={label} style={{ left: COPY_X - 20, top: below, width: W + 40, color: colors.brandDark }}>
        {SHOW[7]}
      </motion.span>
      <motion.span {...enter(1.2)} className={label} style={{ left: XEROX_X - 20, top: below, width: W + 40, color: colors.brandDark }}>
        {SHOW[9]}
      </motion.span>
      <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={STAGE_W} height={STAGE_H} aria-hidden>
        <defs>
          <marker id="h1-head" viewBox="0 0 10 10" refX="6.8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={colors.accent} />
          </marker>
        </defs>
        <motion.path d={`M ${cx} 66 L ${cx} ${BOOK_Y - 6}`} stroke={colors.accent} strokeWidth={2.75} strokeLinecap="round" fill="none" markerEnd="url(#h1-head)" {...enter(0.3)} />
        <motion.path d={`M ${cx} ${below - 4} L ${cx} ${BOOK_Y + H + 6}`} stroke={colors.accent} strokeWidth={2.75} strokeLinecap="round" fill="none" markerEnd="url(#h1-head)" {...enter(0.6)} />
      </svg>
    </>
  )
}
