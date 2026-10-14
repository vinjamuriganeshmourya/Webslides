import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useStepPhase } from './phase'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Appear, Note, sentences } from './pieces'
import { StepCaption } from './trace'
import { CalcPhone } from './Calculator'
import { DeckLine } from './cards'
import { SPEC } from './spec'

/**
 * C1 AND C2: WHAT CAME WITH PYTHON.
 *
 * C1 (three presses): the built-ins the room already calls, as tiles beside
 * the upright calculator; the calculator turns and a shelf of many more
 * tools fades in, faded like the keys that were hidden; then the two
 * definition lines, on screen in words (its must line). The picture stays in
 * the calculator world and goes no further than it (its analogy's break:
 * thousands of tools are kept in many sets, not one sideways screen, which
 * is C2's job).
 *
 * C2 (three presses): the shelf sorts itself into labelled boxes (math,
 * random, datetime, collections, and more); the random box opens into a file
 * icon, random.py, with a few lines of code inside; several module files
 * slide into one folder icon. The words module and package stay on screen
 * with their one-line meaning (its must line).
 */
const EASE = [0.22, 1, 0.36, 1] as const
const C1 = SPEC.C1
const C2 = SPEC.C2
const BUILTINS: string[] = (C1.show as string[]).slice(1, 8)
/* a shelf of real standard-library tools, the room has not met: faded, many, in no order */
const SHELF = ['sqrt', 'factorial', 'pi', 'floor', 'ceil', 'gcd', 'randint', 'choice', 'shuffle', 'random', 'date', 'today', 'datetime', 'timedelta', 'mean', 'median', 'mode', 'ascii_letters', 'digits', 'monthrange', 'isleap', 'Counter', 'deque', 'namedtuple', 'reduce', 'sleep', 'time', 'perf_counter', 'dumps', 'loads', 'listdir', 'getcwd', 'path', 'sub', 'findall', 'match', 'log', 'sin', 'cos', 'tan', 'hypot', 'inf', 'nan', 'tau']

function Tile({ children, size = 17, dim = false }: { children: string; size?: number; dim?: boolean }) {
  return (
    <span className="inline-flex h-[36px] items-center rounded-lg bg-white px-3 font-mono font-bold" style={{ fontSize: size, color: dim ? colors.muted : colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      {children}
    </span>
  )
}

/* ===================================================================== C1 */

export function Library() {
  const beat = useBeats(3)
  const instant = useInstant()
  const caption = beat === 1 ? C1.show[0] : C1.show[8]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[262px] shrink-0 items-center justify-center" style={{ height: 400 }} active={beat === 2}>
          <CalcPhone landscape={beat >= 2} zoom={0.62} display={beat >= 2 ? ['√49 = 7'] : ['0']} glow={beat >= 2 ? ['√', 'π', 'x!'] : []} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 400 }} active={beat !== 2}>
          <StepCaption text={caption} size={16} minH={46} />
          <div className="flex flex-wrap gap-2">
            {BUILTINS.map((b) => (
              <Tile key={b}>{b}</Tile>
            ))}
          </div>
          <motion.div
            className="relative flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-hidden rounded-xl p-2.5"
            style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}
            initial={false}
            animate={{ opacity: beat >= 2 ? 1 : 0 }}
            transition={{ duration: instant ? 0 : 0.9, ease: EASE }}
          >
            {SHELF.map((t, i) => (
              <span key={t} className="inline-flex h-[22px] items-center rounded-md bg-white px-1.5 font-mono text-[11px] font-semibold" style={{ color: colors.muted, opacity: 0.55 + (i % 3) * 0.12 }}>
                {t}
              </span>
            ))}
          </motion.div>
          <div style={{ minHeight: 86 }}>
            {beat >= 3 && (
              <Appear>
                <DeckLine size={17}>
                  <Lines lines={[...sentences(C1.show[9]), ...sentences(C1.show[10])]} />
                </DeckLine>
              </Appear>
            )}
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ===================================================================== C2 */

const BOXES: [string, string[]][] = [
  ['math', ['sqrt', 'pi']],
  ['random', ['randint', 'choice']],
  ['datetime', ['date', 'time']],
  ['collections', ['Counter', 'deque']],
  ['and more', ['…']],
]
const FILE_LINES = ['def randint(a, b):', '    ...', 'def choice(seq):', '    ...']

/** A module box: a labelled box with its tools inside, the shelf sorted. */
function ModuleBox({ name, tools, lit = false, delay = 0 }: { name: string; tools: string[]; lit?: boolean; delay?: number }) {
  const tween = useTween(480)
  return (
    <div className="flex flex-col gap-1.5 rounded-xl px-2.5 pb-2.5 pt-2" style={{ width: 104, background: colors.night2, boxShadow: lit ? `inset 0 0 0 2.5px ${colors.warning}` : `inset 0 0 0 1.5px ${colors.night3}`, transition: tween }}>
      <span className="font-mono text-[13px] font-bold" style={{ color: '#7FA6FF' }}>
        {name}
      </span>
      {tools.map((t, i) => (
        <Appear key={t} delay={delay + i * 130}>
          <span className="inline-flex h-[22px] items-center rounded-md px-2 font-mono text-[11.5px] font-semibold text-white" style={{ background: 'rgba(255,255,255,0.12)' }}>
            {t}
          </span>
        </Appear>
      ))}
    </div>
  )
}

/** A .py file icon: a page with a folded corner, the name, a few lines of code. */
function FileIcon({ name, code = false, width = 118, height = 128 }: { name: string; code?: boolean; width?: number; height?: number }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center gap-1 rounded-lg bg-white px-2 pb-2 pt-3" style={{ width, height, boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 8px 18px -14px rgba(16,32,58,0.4)` }}>
      <span aria-hidden className="absolute right-0 top-0 h-[18px] w-[18px]" style={{ background: `linear-gradient(225deg, ${colors.surface} 50%, ${colors.line} 50%)`, borderTopRightRadius: 8 }} />
      <span className="font-mono text-[12.5px] font-bold" style={{ color: colors.brandDark }}>
        {name}
      </span>
      {code ? (
        <span className="flex w-full flex-col rounded-md px-1.5 py-1 font-mono text-[9.5px] leading-[13px]" style={{ background: colors.night2, color: colors.white }}>
          {FILE_LINES.map((l, i) => (
            <span key={i} className="block whitespace-pre">
              {l}
            </span>
          ))}
        </span>
      ) : (
        <span className="flex w-full flex-col gap-1 px-1">
          {[72, 48, 60].map((w, i) => (
            <span key={i} className="block h-[5px] rounded-full" style={{ width: `${w}%`, background: colors.line }} />
          ))}
        </span>
      )}
    </div>
  )
}

/** A folder icon: the tab, the body, the word `package` on it. */
function FolderIcon({ label, width = 176, height = 128 }: { label: string; width?: number; height?: number }) {
  return (
    <div className="relative shrink-0" style={{ width, height }}>
      <span aria-hidden className="absolute left-0 top-0 h-[22px] w-[72px] rounded-t-lg" style={{ background: colors.warning }} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center rounded-lg rounded-tl-none pb-2" style={{ top: 12, background: '#FFD27A', boxShadow: `inset 0 0 0 1.5px ${colors.warning}` }}>
        <span className="font-mono text-[14px] font-bold" style={{ color: colors.accentDark }}>
          {label}
        </span>
      </div>
    </div>
  )
}

export function Modules() {
  const beat = useBeats(3)
  const instant = useInstant()
  /* press 3: the files slide into the folder, then leave the page (a file at opacity 0 inside the folder is still a box to overlap-check) */
  const slid = useStepPhase(beat, [1900])
  const filesIn = beat >= 3 && slid >= 1
  const caption = beat === 1 ? C2.show[0] : beat === 2 ? C2.show[1] : C2.show[3]
  const files = ['math.py', 'random.py', 'datetime.py']
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[580px] shrink-0 flex-col justify-between gap-3" style={{ height: 400 }} active={beat === 1}>
          <div className="flex items-start justify-between gap-2">
            {BOXES.map(([n, tools], i) => (
              <ModuleBox key={n} name={n} tools={tools} lit={beat === 2 && n === 'random'} delay={i * 90} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Note lines={[C2.show[1]]} size={15} on={beat >= 2} />
            <Note lines={[C2.show[3]]} size={15} on={beat >= 3} />
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 400 }} active={beat >= 2}>
          <StepCaption text={caption} size={16} minH={46} />
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            {beat === 2 && (
              <Appear>
                <FileIcon name={C2.show[2]} code width={150} height={128} />
              </Appear>
            )}
            {beat >= 3 && (
              <div className="relative flex h-[200px] w-full items-center">
                {/* the three files slide side by side towards the folder, shrinking and fading, and stop above its top edge: at no sample time does a file sit on the folder or on another file (rule 47) */}
                {!filesIn && files.map((f, i) => (
                  <motion.div
                    key={f}
                    className="absolute"
                    style={{ top: 0, transformOrigin: '0 0' }}
                    initial={instant ? false : { left: 8 + i * 118, opacity: 1, scale: 1 }}
                    animate={{ left: 176 + i * 62, opacity: 0, scale: 0.5 }}
                    transition={{ duration: instant ? 0 : 1.2, delay: instant ? 0 : 0.3, ease: EASE }}
                  >
                    <FileIcon name={f} width={100} height={104} />
                  </motion.div>
                ))}
                <motion.div className="absolute" style={{ left: 190, top: 64 }} initial={instant ? false : { opacity: 0.35, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: instant ? 0 : 0.6, delay: instant ? 0 : 1.2, ease: EASE }}>
                  <FolderIcon label="package" />
                </motion.div>
              </div>
            )}
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
