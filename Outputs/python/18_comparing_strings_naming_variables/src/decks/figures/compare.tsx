import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { Lines } from './common'
import { GreyLegend, Tile, TileRow, Verdict, code, type TileSize, type TileState } from './tiles'

/**
 * TWO WORDS, ONE PAIR AT A TIME. The comparison every frame from 13 to 15
 * draws: the first word over the second, one tile per character, the operator
 * between the rows, and the walk Python makes from the left: a pair that
 * matches turns green, the first pair that differs turns orange and decides,
 * the letters after it go grey because Python never looked at them, and a
 * word that runs out shows a dashed `nothing` tile.
 *
 * `walk()` derives every step and its sentence from the two words and the
 * operator, so the sentences can never disagree with what Python does; the
 * verdicts match the real runs in the plan's output table.
 */
export type Op = '>' | '>=' | '<' | '<=' | '=='

export interface Step {
  kind: 'same' | 'decides' | 'short' | 'equal'
  lines: string[]
}

const PHRASE: Record<Op, string> = { '>': 'more than', '>=': 'more than or equal to', '<': 'less than', '<=': 'less than or equal to', '==': 'equal to' }

function compare(a: string, b: string, op: Op) {
  return op === '>' ? a > b : op === '>=' ? a >= b : op === '<' ? a < b : op === '<=' ? a <= b : a === b
}

export function walk(a: string, b: string, op: Op): { steps: Step[]; verdict: boolean } {
  const steps: Step[] = []
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const x = a[i]
    const y = b[i]
    if (x === undefined || y === undefined) {
      const shortW = x === undefined ? a : b
      const longW = x === undefined ? b : a
      steps.push({ kind: 'short', lines: [`"${shortW}" has no letters left`, `"${longW}" still has ${longW[i]}`, 'The shorter one is smaller'] })
      break
    }
    if (x === y) {
      steps.push({ kind: 'same', lines: [`${x} and ${y}: ${code(x)} and ${code(y)}`, 'The same, so look at the next pair'] })
      continue
    }
    if (op === '==') {
      steps.push({ kind: 'equal', lines: [`${x} and ${y}: ${code(x)} and ${code(y)}`, 'Different, so the two strings are not equal'] })
    } else {
      const yes = compare(x, y, op)
      steps.push({ kind: 'decides', lines: [`${x} and ${y}: ${code(x)} and ${code(y)}`, 'Different, so this pair decides', `Is ${code(x)} ${PHRASE[op]} ${code(y)}? ${yes ? 'Yes' : 'No'}`] })
    }
    break
  }
  /* two equal words: the walk ends with every pair the same */
  return { steps, verdict: compare(a, b, op) }
}

/** The tile state of character `i` of one word after `at` steps of the walk. */
function stateAt(word: string, other: string, i: number, at: number, steps: Step[], numbers: boolean): { state: TileState; code: boolean } {
  if (at <= 0) return { state: 'plain', code: numbers }
  const last = steps[Math.min(at, steps.length) - 1]
  const lastIndex = Math.min(at, steps.length) - 1
  if (i < lastIndex) return { state: 'same', code: true }
  if (i === lastIndex) {
    if (last.kind === 'same') return { state: 'same', code: true }
    if (last.kind === 'short') return word[i] === undefined ? { state: 'nothing', code: false } : { state: 'decides', code: true }
    return { state: 'decides', code: true }
  }
  /* past the deciding pair: never looked at, unless the walk is still going */
  const ended = last.kind !== 'same' || at >= steps.length
  void other
  return ended && last.kind !== 'same' ? { state: 'never', code: true } : { state: 'plain', code: numbers }
}

export function WordCompare({
  a,
  b,
  op,
  at,
  numbers = false,
  size = 'md',
  verdictOn,
  frame,
  bare = false,
  className = '',
}: {
  a: string
  b: string
  op: Op
  /** Steps of the walk shown so far; 0 is the two words alone. */
  at: number
  /** Show every Unicode value before the walk starts (frame 13, beat 2). */
  numbers?: boolean
  size?: TileSize
  /** Show the verdict pill; defaults to "the walk is complete". */
  verdictOn?: boolean
  /** A dashed frame round pair 1, with its label (frame 13, beat 3). */
  frame?: boolean
  /** The two rows alone: no legend, no sentence, no verdict (frame 13). */
  bare?: boolean
  className?: string
}) {
  const { steps, verdict } = walk(a, b, op)
  const shown = Math.min(at, steps.length)
  const done = shown >= steps.length && shown > 0
  const tween = useTween(420)
  const n = Math.max(a.length, b.length)
  const w = { lg: 88, md: 72, sm: 56, xs: 46 }[size]
  const gap = { lg: 12, md: 10, sm: 8, xs: 6 }[size]
  const row = (word: string, other: string) => (
    <TileRow size={size}>
      {Array.from({ length: n }, (_, i) => {
        const c = word[i]
        const st = stateAt(word, other, i, shown, steps, numbers)
        if (c === undefined) {
          /* a shorter word: the reference draws `nothing` there from the start, grey
             until the walk reaches it and finds the word has run out */
          return <Tile key={i} size={size} state={st.state === 'nothing' ? 'nothing' : 'nothing-grey'} showCode={false} />
        }
        return <Tile key={i} size={size} ch={c} code={st.code ? code(c) : undefined} state={st.state} />
      })}
    </TileRow>
  )
  const anyGrey = shown > 0 && steps[shown - 1].kind !== 'same' && n > shown
  const last = shown > 0 ? steps[shown - 1] : null
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="relative flex items-center gap-6">
        <div className="flex w-[82px] shrink-0 flex-col justify-around self-stretch font-mono text-[22px] font-bold" style={{ color: colors.success }}>
          <span>"{a}"</span>
          <span className="text-center text-[30px]" style={{ color: colors.accentDark }}>{op === '>=' ? '≥' : op === '<=' ? '≤' : op}</span>
          <span>"{b}"</span>
        </div>
        <div className="relative flex flex-col gap-3">
          {row(a, b)}
          {row(b, a)}
          {/* the frame round pair 1 */}
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-2xl"
            style={{ left: -7, top: -7, width: w + 14, height: '100%', border: `3px dashed ${colors.brandDark}`, opacity: frame ? 1 : 0, transition: tween, boxSizing: 'content-box' }}
          />
          <div className="absolute left-0 flex items-center gap-4" style={{ top: 'calc(100% + 10px)', opacity: frame ? 1 : 0, transition: tween }}>
            <span className="grid font-heading text-[17px] font-bold" style={{ width: w, color: colors.brandDark, textAlign: 'center' }}>pair 1</span>
            <svg width={Math.max(0, (n - 1) * (w + gap) - 10)} height="14" aria-hidden>
              <path d={`M2 7H${(n - 1) * (w + gap) - 24}`} stroke={colors.brandDark} strokeWidth="3" strokeLinecap="round" />
              <path d={`M${(n - 1) * (w + gap) - 24} 1 L${(n - 1) * (w + gap) - 12} 7 L${(n - 1) * (w + gap) - 24} 13 Z`} fill={colors.brandDark} />
            </svg>
          </div>
        </div>
      </div>
      <div className={frame ? 'h-[28px]' : 'h-0'} style={{ transition: tween }} />
      {bare ? null : (
        <>
      <GreyLegend on={anyGrey} />
      <div className="min-h-[76px] text-[19px] font-semibold leading-snug" style={{ color: colors.ink }}>
        {last && (
          <span key={shown} className="block">
            <Lines lines={last.lines} />
          </span>
        )}
      </div>
      <Verdict value={verdict} on={verdictOn ?? done} />
        </>
      )}
    </div>
  )
}
