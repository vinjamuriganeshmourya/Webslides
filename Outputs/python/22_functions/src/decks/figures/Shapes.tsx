import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines } from './common'
import { Ask, Show, sentences } from './pieces'
import { StepCaption } from './trace'
import { CallCode, TokenRing } from './call'
import { SPEC } from './spec'

/**
 * THE SHAPE OF A FUNCTION, drawn the way the original deck draws it (slides
 * 13 to 16, 21, 33, 40): `def function_name():` large in mono, and under it
 * the block, indented, with the empty indent strip on its left kept visible
 * (C2's must line: "the indent is part of the rule"). Dashed outlines and
 * labels arrive one per press. All geometry is fixed so the arrows can be
 * drawn to exact points: JetBrains Mono advances 0.6em per character.
 *
 *   DefFigure     the shape, with every optional part
 *   DefShape      C2, five presses
 *   CallIt        C4, three presses
 *   Arguments     C7, three presses
 *   DefShapeLine  C11's first press: the shape ending in `return value`
 */

const FONT = 34
const CH = FONT * 0.6
const G = 70 /* left gutter, for the call arrows */
const T = 64 /* top of the header row: room above for the name's label */
const HEAD_H = 54
const BLOCK_Y = T + HEAD_H + 10
const BLOCK_H = 84
const INDENT = 46
const BOX_W = 300
const RET_Y = BLOCK_Y + BLOCK_H + 10
const CALL_FONT = 28
const CALL_H = 46
const ARROW = 9

const DEF = colors.accentDark
const NAME = colors.brandDark

function Arrowhead({ x, y, dir, color }: { x: number; y: number; dir: 'left' | 'right' | 'down' | 'up'; color: string }) {
  const h = ARROW
  const w = ARROW / 2 + 0.5
  const d =
    dir === 'right'
      ? `M ${x} ${y} L ${x - h} ${y - w} L ${x - h} ${y + w} Z`
      : dir === 'left'
        ? `M ${x} ${y} L ${x + h} ${y - w} L ${x + h} ${y + w} Z`
        : dir === 'down'
          ? `M ${x} ${y} L ${x - w} ${y - h} L ${x + w} ${y - h} Z`
          : `M ${x} ${y} L ${x - w} ${y + h} L ${x + w} ${y + h} Z`
  return <path d={d} fill={color} />
}

/** A fade-in for one part of the figure. */
function Part({ on, children }: { on: boolean; children: ReactNode }) {
  const instant = useInstant()
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: instant ? 0 : 0.52, ease: easing.soft }}>
      {children}
    </motion.g>
  )
}

export interface DefFigureProps {
  args?: string
  headerOutline?: boolean
  blockOutline?: boolean
  nameArrow?: string | null
  argsArrow?: string | null
  headerLabel?: string | null
  blockLabel?: string | null
  ret?: boolean
  retLabel?: string | null
  calls?: number
  callLabel?: string | null
  blockText?: string
  width?: number
  height?: number
}

/** The shape itself, in one SVG + DOM overlay of fixed geometry. */
export function DefFigure({
  args = '',
  headerOutline = false,
  blockOutline = false,
  nameArrow = null,
  argsArrow = null,
  headerLabel = null,
  blockLabel = null,
  ret = false,
  retLabel = null,
  calls = 0,
  callLabel = null,
  blockText = 'Reusable block of code',
  width = 760,
  height,
}: DefFigureProps) {
  const header = `def function_name(${args}):`
  const headW = header.length * CH
  const nameX = G + 4 * CH + (13 * CH) / 2
  const argsX = G + (18 + args.length / 2) * CH
  const blockX = G + INDENT + 8
  const callTop = (ret ? RET_Y + HEAD_H : BLOCK_Y + BLOCK_H) + 26
  const callY = (k: number) => callTop + k * (CALL_H + 12)
  const H = height ?? (calls ? callY(calls - 1) + CALL_H + 6 : ret ? RET_Y + HEAD_H + 6 : BLOCK_Y + BLOCK_H + 6)
  const headMid = T + HEAD_H / 2
  return (
    <div className="relative shrink-0" style={{ width, height: H }}>
      <svg className="absolute inset-0 overflow-visible" width={width} height={H} aria-hidden>
        {/* the indent strip and the block */}
        <rect x={G} y={BLOCK_Y} width={INDENT} height={BLOCK_H} rx={6} fill={colors.surface} stroke={colors.line} strokeWidth={1.5} />
        <rect x={blockX} y={BLOCK_Y} width={BOX_W} height={BLOCK_H} rx={10} fill={colors.surface2} stroke={colors.brand} strokeOpacity={0.45} strokeWidth={2} />
        <Part on={headerOutline}>
          <rect x={G - 10} y={T - 4} width={headW + 20} height={HEAD_H + 8} rx={10} fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray="7 6" />
          {headerLabel && (
            <>
              <path d={`M ${G + headW + 12} ${headMid} H ${G + headW + 52}`} stroke={colors.accent} strokeWidth={2.5} />
              <Arrowhead x={G + headW + 60} y={headMid} dir="right" color={colors.accent} />
            </>
          )}
        </Part>
        <Part on={blockOutline}>
          <rect x={G - 6} y={BLOCK_Y - 6} width={INDENT + 8 + BOX_W + 12} height={BLOCK_H + 12} rx={12} fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray="7 6" />
          {blockLabel && (
            <>
              <path d={`M ${blockX + BOX_W + 8} ${BLOCK_Y + BLOCK_H / 2} H ${blockX + BOX_W + 48}`} stroke={colors.accent} strokeWidth={2.5} />
              <Arrowhead x={blockX + BOX_W + 56} y={BLOCK_Y + BLOCK_H / 2} dir="right" color={colors.accent} />
            </>
          )}
        </Part>
        <Part on={!!nameArrow}>
          <path d={`M ${nameX + 40} 16 H ${nameX} V ${T - 8 - ARROW}`} fill="none" stroke={colors.brand} strokeWidth={2.5} />
          <Arrowhead x={nameX} y={T - 8} dir="down" color={colors.brand} />
        </Part>
        <Part on={!!argsArrow}>
          <path d={`M ${argsX + 70} 16 H ${argsX} V ${T - 8 - ARROW}`} fill="none" stroke={colors.brand} strokeWidth={2.5} />
          <Arrowhead x={argsX} y={T - 8} dir="down" color={colors.brand} />
        </Part>
        {ret && retLabel && (
          <>
            <path d={`M ${blockX + 13 * CH} ${RET_Y + HEAD_H / 2} H ${blockX + 13 * CH + 44}`} stroke={colors.brand} strokeWidth={2.5} />
            <Arrowhead x={blockX + 13 * CH + 52} y={RET_Y + HEAD_H / 2} dir="right" color={colors.brand} />
          </>
        )}
        {/* the calls: each with its arrow up to the header, in the left gutter */}
        {Array.from({ length: calls }, (_, k) => {
          const y = callY(k) + CALL_H / 2
          const lane = 14 + k * 16
          return (
            <Part key={k} on>
              <path d={`M ${G - 6} ${y} H ${lane} V ${headMid} H ${G - 14 - ARROW}`} fill="none" stroke={colors.success} strokeWidth={2.5} strokeDasharray="6 5" strokeLinejoin="round" />
              <Arrowhead x={G - 14} y={headMid} dir="right" color={colors.success} />
            </Part>
          )
        })}
      </svg>
      {/* the words, in DOM so they are real text */}
      <div className="absolute whitespace-pre font-mono font-bold" style={{ left: G, top: T, height: HEAD_H, lineHeight: `${HEAD_H}px`, fontSize: FONT }}>
        <span style={{ color: DEF }}>def</span> <span style={{ color: NAME }}>function_name</span>
        <span style={{ color: colors.ink }}>(</span>
        {args && <span style={{ color: colors.accentDark }}>{args}</span>}
        <span style={{ color: colors.ink }}>):</span>
      </div>
      <div className="absolute grid place-items-center text-center text-[20px] font-semibold leading-snug" style={{ left: blockX, top: BLOCK_Y, width: BOX_W, height: BLOCK_H, color: colors.brandDark }}>
        {blockText}
      </div>
      {ret && (
        <div className="absolute whitespace-pre font-mono font-bold" style={{ left: blockX, top: RET_Y, height: HEAD_H, lineHeight: `${HEAD_H}px`, fontSize: FONT }}>
          <span style={{ color: DEF }}>return</span> <span style={{ color: colors.ink }}>value</span>
        </div>
      )}
      {ret && retLabel && <Label x={blockX + 13 * CH + 66} y={RET_Y + HEAD_H / 2} color={colors.brandDark} on>{retLabel}</Label>}
      <Label x={G + headW + 72} y={headMid} on={!!headerLabel && headerOutline} color={colors.accentDark}>
        {headerLabel}
      </Label>
      <Label x={blockX + BOX_W + 68} y={BLOCK_Y + BLOCK_H / 2} on={!!blockLabel && blockOutline} color={colors.accentDark}>
        {blockLabel}
      </Label>
      <Label x={nameX + 50} y={16} on={!!nameArrow} color={colors.brandDark}>
        {nameArrow}
      </Label>
      <Label x={argsX + 80} y={16} on={!!argsArrow} color={colors.brandDark}>
        {argsArrow}
      </Label>
      {Array.from({ length: calls }, (_, k) => (
        <motion.div
          key={k}
          className="absolute whitespace-pre rounded-lg px-3 font-mono font-bold"
          style={{ left: G, top: callY(k), height: CALL_H, lineHeight: `${CALL_H}px`, fontSize: CALL_FONT, color: NAME, background: '#E9F8EF', boxShadow: `inset 0 0 0 2px ${colors.success}` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: k * 0.13, ease: easing.soft }}
        >
          function_name()
        </motion.div>
      ))}
      {calls > 0 && callLabel && (
        <Label x={G + 15 * CALL_FONT * 0.6 + 44} y={callY(0) + (calls * (CALL_H + 12) - 12) / 2} on color={colors.success}>
          {callLabel}
        </Label>
      )}
    </div>
  )
}

/** A label beside a point of the figure, vertically centred on `y`. */
function Label({ x, y, on, color, children }: { x: number; y: number; on: boolean; color: string; children: ReactNode }) {
  const tween = useTween(480)
  return (
    <span className="absolute -translate-y-1/2 whitespace-nowrap text-[20px] font-bold leading-snug" style={{ left: x, top: y, color, opacity: on ? 1 : 0, transition: tween }}>
      {children}
    </span>
  )
}

/** C11's first press: the shape with `return value` and its label. */
export function DefShapeLine({ args = '', ret = false, label }: { args?: string; ret?: boolean; label?: string }) {
  return <DefFigure args={args} ret={ret} retLabel={label ?? null} blockText="Reusable block of code" />
}

/* ================================================================== C2 */

const C2 = SPEC.C2

/**
 * DEFINING A FUNCTION. Spec card C2, five presses: the shape; the header
 * outlined and labelled; the block outlined and labelled; an arrow at the name
 * with its line; song.py, the song written once.
 */
export function DefShape() {
  const beat = useBeats(5)
  return (
    <>
      <div className="flex items-start gap-6 pt-8">
        <DefFigure
          width={660}
          blockText={C2.show[1]}
          headerOutline={beat >= 2}
          headerLabel={C2.show[2]}
          blockOutline={beat >= 3}
          blockLabel={C2.show[3]}
          nameArrow={beat >= 4 ? sentences(C2.show[4])[0] : null}
        />
        <Show on={beat >= 5} className="flex min-w-0 flex-1 flex-col gap-3 pt-10">
          <CallCode code={C2.code[0].src} fs={14} />
          <StepCaption text={beat >= 5 ? C2.show[5] : null} tone="rule" size={18} minH={48} />
        </Show>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== C4 */

const C4 = SPEC.C4

/**
 * CALLING A FUNCTION. Spec card C4, three presses. Press 1: the def shape
 * and empty space under it, the question. Press 2 (only after the room has
 * tried, its must line): `function_name()` twice, each with an arrow up to
 * the header, and the label. Press 3: party_short.py beside it with its line.
 */
export function CallIt() {
  const beat = useBeats(3)
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 flex-col gap-2" style={{ width: 640 }}>
          <DefFigure width={640} height={420} calls={beat >= 2 ? 2 : 0} callLabel={C4.show[2]} blockText="Reusable block of code" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {beat < 3 ? (
            <div className="pt-28">
              <Ask size={26}>{C4.show[0]}</Ask>
            </div>
          ) : (
            <Show on className="flex flex-col gap-3">
              <CallCode code={C4.code[0].src} fs={13} mark={[8, 10, 12]} />
              <StepCaption text={C4.show[3]} tone="rule" size={18} minH={48} />
            </Show>
          )}
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C7 */

const C7 = SPEC.C7

/**
 * FUNCTION WITH ARGUMENTS. Spec card C7, three presses. Press 1:
 * greet_question.py, `?` where the name should go (deck slide 32), the
 * question. Press 2: `def function_name(args):` the biggest text, the line
 * pointing at args. Press 3: greet_word.py, `word` in the header labelled
 * `Argument`, the call `greet(word=name)` labelled `Passing value`.
 */
export function Arguments() {
  const beat = useBeats(3)
  const host = useRef<HTMLDivElement>(null)
  return (
    <>
      {beat === 1 && (
        <div className="flex items-start gap-10">
          <div ref={host} className="relative">
            <CallCode code={C7.code[0].src} fs={21} width={560} />
            <TokenRing host={host} line={2} token="?" on color={colors.accent} />
          </div>
          <div className="pt-24">
            <Ask size={26}>{C7.show[0]}</Ask>
          </div>
        </div>
      )}
      {beat === 2 && (
        <div className="pl-4 pt-4">
          <DefFigure args="args" argsArrow={sentences(C7.show[2])[0]} width={1000} blockText="Reusable block of code" />
        </div>
      )}
      {beat === 3 && (
        <div className="flex items-start">
          <div ref={host} className="relative">
            <CallCode code={C7.code[1].src} fs={21} width={560} labels={{ 1: C7.show[3], 6: C7.show[4] }} />
            <TokenRing host={host} line={1} token="word" on />
            <TokenRing host={host} line={6} token="word=name" on color={colors.brand} />
          </div>
        </div>
      )}
      <StepControls at={beat} total={3} />
    </>
  )
}

/** Exposed for the takeaways and the hook: the lines of a caption, rule 36. */
export function Said({ text, size = 18 }: { text: string; size?: number }) {
  return (
    <span className="font-semibold leading-snug" style={{ fontSize: size, color: colors.ink }}>
      <Lines lines={sentences(text)} />
    </span>
  )
}
