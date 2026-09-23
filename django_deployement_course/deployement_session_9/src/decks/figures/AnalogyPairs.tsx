import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { FadeIn, Rise, useFigureAnim } from './figureMotion'
import { Building } from './RegionMap'
import { Bulb, Meter } from './Meter'
import { Scaled } from './Scaled'

/**
 * AnalogyPairs — the electricity analogy drawn, one pair per row.
 *
 * Plan slide 13, Pay for Use. `AnalogyMap` maps the words; the user asked for
 * the analogy to be SHOWN, so each row here is a plain glyph on the left (the
 * thing at home the room already owns), an equals mark, and the AWS thing it
 * stands for on the right, with one short label under each glyph:
 *
 *   the power station      =  Amazon's Data Centre
 *   the meter at home      =  your AWS bill
 *   a light switched on    =  a running instance
 *   a light switched off   =  a stopped instance, and the meter stands still
 *
 * Every AWS glyph is a drawing the room has met or is about to meet: the
 * building from `RegionMap`, the meter from `Meter`, the server box from
 * `CloudPicture`. Rows arrive one at a time at the explanatory tier, two
 * staggers apart so each pair is read before the next lands; inside a row the
 * left glyph leads, the mark follows, the right glyph lands last, which is the
 * order the analogy is spoken in.
 *
 * Session-local. Used on one slide.
 */

const ROW_H = 82
const ROW_GAP = 10
const HEAD_H = 24
const MARK_W = 46
const GLYPH_H = 46

interface Pair {
  home: ReactNode
  homeLabel: string
  aws: ReactNode
  awsLabel: string
}

export function AnalogyPairs({ width = 680, className = '' }: { width?: number; className?: string }) {
  const a = useFigureAnim()
  const cellW = (width - MARK_W) / 2
  const rows: Pair[] = [
    { home: <PowerPlant />, homeLabel: 'the power station', aws: <DataCentre />, awsLabel: "Amazon's Data Centre" },
    { home: <SmallMeter state="running" />, homeLabel: 'the meter at home', aws: <BillReadout />, awsLabel: 'your AWS bill' },
    { home: <Lamp lit />, homeLabel: 'a light switched on', aws: <Instance on />, awsLabel: 'a running instance' },
    { home: <Lamp lit={false} />, homeLabel: 'a light switched off', aws: <StoppedPair />, awsLabel: 'a stopped instance, meter still' },
  ]
  const rowAt = (i: number) => T.lead + i * T.stagger * 2

  return (
    <div className={`relative mx-auto ${className}`} style={{ width, height: HEAD_H + rows.length * (ROW_H + ROW_GAP) }}>
      <FadeIn a={a} delay={T.lead} className="absolute left-0 top-0 flex" style={{ width, height: HEAD_H }}>
        <Head w={cellW}>at home</Head>
        <span style={{ width: MARK_W }} />
        <Head w={cellW}>on AWS</Head>
      </FadeIn>

      {rows.map((r, i) => {
        const y = HEAD_H + i * (ROW_H + ROW_GAP)
        const t = rowAt(i)
        return (
          <div key={r.homeLabel}>
            <FadeIn
              a={a}
              delay={t}
              className="absolute rounded-card border"
              style={{ left: 0, top: y, width, height: ROW_H, borderColor: colors.line, background: colors.white }}
            >
              <span />
            </FadeIn>
            <Rise a={a} x={0} y={y} w={cellW} delay={t}>
              <Cell label={r.homeLabel}>{r.home}</Cell>
            </Rise>
            <FadeIn a={a} delay={t + T.stagger} className="absolute grid place-items-center font-heading text-[22px] font-bold" style={{ left: cellW, top: y, width: MARK_W, height: GLYPH_H + 8, color: colors.brand }}>
              =
            </FadeIn>
            <Rise a={a} x={cellW + MARK_W} y={y} w={cellW} delay={t + T.stagger * 2}>
              <Cell label={r.awsLabel}>{r.aws}</Cell>
            </Rise>
          </div>
        )
      })}
    </div>
  )
}

function Head({ w, children }: { w: number; children: ReactNode }) {
  return (
    <span className="text-center font-heading text-body-sm font-bold uppercase tracking-wider" style={{ width: w, color: colors.body }}>
      {children}
    </span>
  )
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: ROW_H }}>
      <div className="flex items-end justify-center" style={{ height: GLYPH_H + 6 }}>{children}</div>
      <span className="mt-1 text-[15px] leading-4" style={{ color: colors.ink }}>{label}</span>
    </div>
  )
}

/* ── glyphs ──────────────────────────────────────────────────────────── */

/** A power station: a hall with a tall chimney and three puffs of smoke. */
function PowerPlant() {
  return (
    <svg width={78} height={GLYPH_H + 2} viewBox="0 0 96 64" aria-hidden>
      <rect x={10} y={30} width={62} height={30} rx={4} fill={colors.white} stroke={colors.ink} strokeWidth={2} />
      <path d="M10 30 L26 18 L42 30 L58 18 L72 30" fill={colors.white} stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" />
      <rect x={74} y={8} width={12} height={52} rx={2} fill={colors.white} stroke={colors.ink} strokeWidth={2} />
      <line x1={74} y1={18} x2={86} y2={18} stroke={colors.ink} strokeWidth={2} />
      <circle cx={80} cy={3} r={3} fill={colors.muted} opacity={0.7} />
      <circle cx={88} cy={-1} r={3.5} fill={colors.muted} opacity={0.5} />
      <rect x={20} y={42} width={10} height={10} rx={1.5} fill={colors.brand} opacity={0.7} />
      <rect x={36} y={42} width={10} height={10} rx={1.5} fill={colors.brand} opacity={0.7} />
      <rect x={52} y={42} width={10} height={10} rx={1.5} fill={colors.brand} opacity={0.7} />
    </svg>
  )
}

/** The same building `RegionMap` draws for an Availability Zone. */
function DataCentre() {
  return (
    <svg width={62} height={GLYPH_H + 2} viewBox="0 0 200 160" aria-hidden>
      <Building x={40} y={14} w={120} h={140} />
    </svg>
  )
}

function SmallMeter({ state }: { state: 'running' | 'stopped' }) {
  return (
    <Scaled w={200} h={120} scale={0.42}>
      <Meter state={state} size="sm" />
    </Scaled>
  )
}

/** The meter again, wearing a currency chip: the AWS bill is a meter reading in dollars. */
function BillReadout() {
  return (
    <div className="relative">
      <SmallMeter state="running" />
      <span
        className="absolute -left-1 top-2 rounded-full px-2 font-mono text-[11px] font-bold leading-4"
        style={{ background: colors.brand, color: colors.white }}
      >
        USD
      </span>
    </div>
  )
}

function Lamp({ lit }: { lit: boolean }) {
  return (
    <svg width={50} height={GLYPH_H + 2} viewBox="0 0 64 64" aria-hidden>
      <Bulb cx={32} top={4} lit={lit} />
    </svg>
  )
}

/**
 * The instance as a small labelled card rather than the full `ServerGlyph`.
 * At this size the glyph's own title and sub line were too faint to read from
 * the back of a room, and running versus stopped is the whole point of the row.
 */
function Instance({ on }: { on: boolean }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border-2 px-2.5 py-1.5"
      style={{ borderColor: on ? colors.brand : colors.line, background: colors.white }}
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: on ? colors.success : colors.muted }} />
      <span className="font-heading text-[15px] font-bold leading-5" style={{ color: colors.ink }}>instance</span>
      <span className="text-[13px] leading-5" style={{ color: on ? colors.brand : colors.body }}>{on ? 'running' : 'stopped'}</span>
    </div>
  )
}

function StoppedPair() {
  return (
    <div className="flex items-center gap-2">
      <Instance on={false} />
      <Scaled w={200} h={120} scale={0.34}>
        <Meter state="stopped" size="sm" />
      </Scaled>
    </div>
  )
}
