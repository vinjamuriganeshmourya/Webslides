import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Appear, OutPanel, Swap, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Face } from './people'
import { ParamBox } from './boxes'
import { SPEC } from './spec'

/**
 * HOOK H2: DINNER ON THE WAY TO OOTY. Five presses.
 *
 * The bus stops at a dhaba at night; the bill is 1200; three friends at the
 * table. split3.py works for three. Sai pulls up a chair and the same call
 * stops with TypeError: four friends, three boxes. split4? split5? split10?
 * Then the turn, one movement: the three boxes a, b, c fold into one box
 * `*friends` and the three prints into one loop, and split_any.py runs for
 * four. Every program ran on CPython 3.12.3.
 *
 * THE SCENE IS DRAWN AS THE REAL THING (course rules R5, R5b): the night
 * road, the bus, the dhaba with its lamp, the table with the bill and the
 * friends as lab faces. Every colour is a token: the sky the night tones, the
 * lamp the warning tone, the bus the brand, the table the accent's dark.
 */
type Prog = { file: string; src: string; output: string }
const H2 = SPEC.H2
const P: Prog[] = H2.code
const BILL = String(H2.data.bill)
const EASE = [0.22, 1, 0.36, 1] as const
const lines = (s: string): OutLine[] => s.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

const SCENE_W = 520
const SCENE_H = 214

function Bus() {
  return (
    <svg width="150" height="70" viewBox="0 0 150 70" aria-hidden>
      <rect x="4" y="8" width="138" height="48" rx="9" fill={colors.brand} />
      <rect x="4" y="34" width="138" height="22" rx="6" fill={colors.brandDark} />
      {[14, 42, 70, 98].map((x) => (
        <rect key={x} x={x} y="15" width="22" height="15" rx="3" fill="#CFE0FF" />
      ))}
      <rect x="126" y="15" width="12" height="15" rx="3" fill="#CFE0FF" />
      <circle cx="30" cy="58" r="9" fill={colors.ink} />
      <circle cx="30" cy="58" r="4" fill={colors.muted} />
      <circle cx="116" cy="58" r="9" fill={colors.ink} />
      <circle cx="116" cy="58" r="4" fill={colors.muted} />
      <circle cx="140" cy="46" r="4" fill={colors.warning} />
      <circle cx="6" cy="46" r="3" fill={colors.danger} />
    </svg>
  )
}

function Dhaba() {
  return (
    <svg width="170" height="120" viewBox="0 0 170 120" aria-hidden>
      <polygon points="10,52 85,10 160,52" fill={colors.accentDark} />
      <rect x="22" y="52" width="126" height="60" fill={colors.surface} />
      <rect x="40" y="76" width="26" height="36" rx="2" fill={colors.night3} />
      <rect x="96" y="70" width="34" height="22" rx="2" fill={colors.warning} opacity="0.9" />
      <rect x="55" y="30" width="60" height="18" rx="4" fill={colors.ink} />
      <text x="85" y="43" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="11" fill={colors.warning}>
        DHABA
      </text>
      <circle cx="146" cy="40" r="7" fill={colors.warning} />
      <circle cx="146" cy="40" r="16" fill={colors.warning} opacity="0.18" />
    </svg>
  )
}

/** A friend at the table: a lab face on a chair. */
function Seat({ name, x, y, arriving = false }: { name: string; x: number; y: number; arriving?: boolean }) {
  const instant = useInstant()
  return (
    <motion.div className="absolute flex flex-col items-center" style={{ left: x, top: y }} initial={arriving && !instant ? { opacity: 0, x: 60 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, ease: EASE }}>
      <Face name={name} size={34} ring={colors.white} />
      <span className="mt-0.5 text-[11px] font-bold" style={{ color: colors.white }}>
        {name}
      </span>
    </motion.div>
  )
}

function Scene({ sai }: { sai: boolean }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl" style={{ width: SCENE_W, height: SCENE_H, background: `linear-gradient(${colors.night} 0%, ${colors.night2} 60%, ${colors.night3} 100%)` }}>
      {/* stars */}
      {[
        [30, 18],
        [90, 30],
        [150, 14],
        [230, 26],
        [300, 12],
        [380, 22],
        [460, 16],
        [500, 34],
      ].map(([x, y]) => (
        <span key={`${x}-${y}`} aria-hidden className="absolute block rounded-full" style={{ left: x, top: y, width: 3, height: 3, background: colors.white, opacity: 0.7 }} />
      ))}
      {/* the road */}
      <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ height: 46, background: colors.ink }} />
      <div aria-hidden className="absolute inset-x-0" style={{ bottom: 22, height: 2, backgroundImage: `repeating-linear-gradient(90deg, ${colors.warning} 0 18px, transparent 18px 34px)`, opacity: 0.8 }} />
      <div className="absolute" style={{ left: 14, bottom: 40 }}>
        <Bus />
      </div>
      <div className="absolute" style={{ right: 10, top: 10 }}>
        <Dhaba />
      </div>
      {/* the table, the bill, the friends */}
      <div aria-hidden className="absolute rounded-[40%]" style={{ left: 200, top: 106, width: 170, height: 60, background: colors.accentDark, boxShadow: `0 10px 0 ${colors.ink}66` }} />
      <div className="absolute flex flex-col items-center rounded-md bg-white px-2 py-1" style={{ left: 258, top: 114, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          Bill
        </span>
        <span className="font-mono text-[14px] font-bold leading-none" style={{ color: colors.ink }}>
          {BILL}
        </span>
      </div>
      <Seat name="Teja" x={176} y={48} />
      <Seat name="Ravi" x={268} y={44} />
      <Seat name="Kiran" x={352} y={48} />
      {sai ? <Seat name="Sai" x={386} y={110} arriving /> : <span aria-hidden className="absolute block rounded-full" style={{ left: 386, top: 110, width: 34, height: 34, border: `2px dashed ${colors.muted}`, opacity: 0.6 }} />}
    </div>
  )
}

/** The functions that would be needed, one per table size, each longer than the last. */
function Stack() {
  const calls = ['split4(bill, a, b, c, d)', 'split5(bill, a, b, c, d, e)', 'split10(bill, a, b, c, d, e, f, g, h, i, j)']
  return (
    <div className="flex flex-col items-start gap-1.5">
      {calls.map((c, i) => (
        <Appear key={c} delay={i * 260}>
          <span className="whitespace-nowrap rounded-lg bg-white px-3 py-0.5 font-mono text-[14px] font-semibold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
            {c}
          </span>
        </Appear>
      ))}
    </div>
  )
}

/** a, b, c fold into one box `*friends`; one movement. */
function Fold({ folded }: { folded: boolean }) {
  const instant = useInstant()
  const names = ['"Teja"', '"Ravi"', '"Kiran"']
  return (
    <div className="relative" style={{ width: 500, height: 72 }}>
      <div className="absolute left-0 top-0">
        <ParamBox box={{ name: 'bill', kind: 'named', value: BILL }} />
      </div>
      {['a', 'b', 'c'].map((n, i) => (
        <motion.div key={n} className="absolute top-0" initial={false} animate={folded ? { x: 250, opacity: 0, scale: 0.7 } : { x: 130 + i * 118, opacity: 1, scale: 1 }} transition={{ duration: instant ? 0 : 0.5, ease: EASE }}>
          <ParamBox box={{ name: n, kind: 'named', value: names[i].replace(/"/g, "'") }} />
        </motion.div>
      ))}
      <motion.div className="absolute top-0" style={{ left: 150 }} initial={false} animate={folded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }} transition={{ duration: instant ? 0 : 0.5, ease: EASE, delay: folded && !instant ? 0.25 : 0 }}>
        <ParamBox box={{ name: 'friends', kind: 'tuple', items: ["'Teja'", "'Ravi'", "'Kiran'", "'Sai'"] }} />
      </motion.div>
    </div>
  )
}

/** The three boxes with the three friends, and Sai with nowhere to go. */
function ThreeBoxes({ sai }: { sai: boolean }) {
  const instant = useInstant()
  return (
    <div className="flex items-start gap-4">
      <ParamBox box={{ name: 'bill', kind: 'named', value: BILL }} />
      {['a', 'b', 'c'].map((n, i) => (
        <ParamBox key={n} box={{ name: n, kind: 'named', value: ["'Teja'", "'Ravi'", "'Kiran'"][i] }} />
      ))}
      {sai && (
        <motion.span className="mt-[22px] inline-flex h-[44px] items-center whitespace-nowrap rounded-xl px-3 font-mono text-[15px] font-semibold" style={{ color: colors.danger, background: '#FDECEC', boxShadow: `inset 0 0 0 2px ${colors.danger}` }} initial={instant ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: [24, 0, -8, 8, -6, 0] }} transition={{ duration: instant ? 0 : 0.9, ease: 'easeOut' }}>
          "Sai"
        </motion.span>
      )}
    </div>
  )
}

export function DhabaHook() {
  const beat = useBeats(5)
  const fold = useStepPhase(beat, [150])
  const prog = beat >= 5 ? P[2] : beat >= 3 ? P[1] : P[0]
  const out: OutLine[] = beat >= 2 ? lines(prog.output) : []
  const caption = H2.show[beat - 1]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex shrink-0 flex-col gap-2.5" style={{ width: beat === 1 ? 1130 : 560, transition: 'width 520ms cubic-bezier(0.22,1,0.36,1)' }} active={beat === 1 || beat >= 4}>
          <StepCaption text={caption} size={16} minH={46} />
          <div className="flex justify-center">
            <Scene sai={beat >= 3} />
          </div>
          <div className="flex h-[76px] items-center justify-center">
            <Swap k={beat >= 5 ? 'fold' : beat === 4 ? 'stack' : beat >= 2 ? 'boxes' : 'none'}>
              {beat >= 5 ? <Fold folded={fold >= 1} /> : beat === 4 ? <Stack /> : beat >= 2 ? <ThreeBoxes sai={beat >= 3} /> : <div />}
            </Swap>
          </div>
        </Group>
        {beat >= 2 && (
          <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" active={beat >= 2 && beat <= 3}>
            <Appear className="flex flex-col gap-2.5">
              <Focus on={beat === 2 || beat === 3}>
                <CodePane code={prog.src} fontSize={CODE_FS} rows={prog.src.split('\n').length} at={beat === 3 ? 7 : undefined} stop={beat === 3} highlight={beat >= 5 ? 1 : undefined} />
              </Focus>
              <OutPanel lines={out} minRows={3} fontSize={OUT_FS} />
            </Appear>
          </Group>
        )}
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
