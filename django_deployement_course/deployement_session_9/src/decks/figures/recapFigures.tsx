import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui'
import { LaptopGlyph, ServerGlyph } from './CloudPicture'
import { Meter } from './Meter'
import { PlaceLadder } from './PlaceLadder'
import { Scaled } from './Scaled'
import { PRIVATE_IP, PUBLIC_IP, VPC_CIDR } from '../deckShared'

const LockIcon = iconByName.lock

/**
 * recapFigures — the twelve small pictures the four concept recaps carry.
 *
 * Each fits a 240 x 130 cell in `IllustratedRecap` and reuses the deck's own
 * drawings (the server box, the laptop, the meter, the ladder), so the recap
 * shows the room the same pictures it has been looking at for the last ten
 * slides, smaller. Nothing here is new to the room; that is the point.
 *
 * Session-local. The recaps are the only place these sizes are used.
 */

const chipStyle = (tone: string) => ({ background: `${tone}14`, color: tone, border: `1.5px solid ${tone}55` })

function Mono({ children, tone = colors.brand }: { children: ReactNode; tone?: string }) {
  return (
    <span className="rounded-full px-2.5 py-0.5 font-mono text-[12px] font-semibold leading-5" style={chipStyle(tone)}>
      {children}
    </span>
  )
}

/* ── Concept 1 · Cloud Basics ───────────────────────────────────────── */

/** The laptop with a cross: it cannot grow and cannot stay up. */
export function LaptopCrossed() {
  return (
    <div className="relative">
      <LaptopGlyph w={110} screen={colors.muted} />
      <svg className="absolute -right-3 -top-3" width={34} height={34} viewBox="0 0 34 34" aria-hidden>
        <circle cx={17} cy={17} r={15} fill={colors.white} stroke={colors.danger} strokeWidth={2.5} />
        <path d="M11 11 L23 23 M23 11 L11 23" stroke={colors.danger} strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  )
}

/** The server box with its public address on a chip. */
export function ServerWithAddress({ address = PUBLIC_IP }: { address?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Mono>{address}</Mono>
      <ServerGlyph title="a server" sub="always on" h={100} light="on" className="w-[130px]" />
    </div>
  )
}

/** The meter, running. */
export function MeterRunning({ scale = 0.7 }: { scale?: number }) {
  return (
    <Scaled w={200} h={120} scale={scale}>
      <Meter state="running" size="sm" />
    </Scaled>
  )
}

/* ── Concept 2 · AWS and EC2 ────────────────────────────────────────── */

export function AwsMark() {
  return <img src="/assets/tech/aws.png" alt="AWS" draggable={false} className="h-[64px] w-auto select-none" />
}

/** Ten squares, three lit: close to three in ten cloud servers are AWS. */
export function ThreeInTen() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="block size-5 rounded"
            style={i < 3 ? { background: colors.brand } : { background: colors.white, border: `2px solid ${colors.line}` }}
          />
        ))}
      </div>
      <span className="whitespace-nowrap font-heading text-[22px] font-bold leading-none" style={{ color: colors.brand }}>3 in 10</span>
    </div>
  )
}

/** The AWS mark above the three-in-ten glyph: the largest cloud. */
export function AwsLargest() {
  return (
    <div className="flex flex-col items-center gap-3">
      <img src="/assets/tech/aws.png" alt="AWS" draggable={false} className="h-[44px] w-auto select-none" />
      <ThreeInTen />
    </div>
  )
}

/** The service, named EC2, with what it does. */
export function Ec2Box() {
  return <ServerGlyph title="EC2" sub="rents you one computer" h={96} light="on" className="w-[168px]" />
}

/** The server box, named instance. */
export function InstanceBox({ light = 'on' as 'on' | 'off' }) {
  return <ServerGlyph title="instance" sub={light === 'on' ? 'on until you stop it' : 'stopped'} h={96} light={light} className="w-[140px]" />
}

/* ── Concept 3 · Regions and Networks ───────────────────────────────── */

/** The ladder with every rung lit: city, building, floor. */
export function LadderAll() {
  return (
    <Scaled w={300} h={200} scale={0.62}>
      <PlaceLadder state="all" size="sm" />
    </Scaled>
  )
}

/** The dashed VPC frame with two instances inside it. */
export function VpcFrame({ range = VPC_CIDR }: { range?: string }) {
  return (
    <div className="relative rounded-2xl px-2.5 pb-2.5 pt-6" style={{ border: `2px dashed ${colors.brand}` }}>
      <span className="absolute -top-3 left-3 rounded-full bg-white px-2 font-mono text-[11px] font-bold leading-5" style={{ color: colors.brand }}>
        VPC {range}
      </span>
      <div className="flex gap-2">
        <ServerGlyph title="instance" sub="private" h={92} light="on" className="w-[106px]" />
        <ServerGlyph title="instance" sub="private" h={92} light="on" className="w-[106px]" />
      </div>
    </div>
  )
}

/** One instance, two addresses: public outside, private inside. */
export function TwoAddresses({ pub = PUBLIC_IP, priv = PRIVATE_IP }: { pub?: string; priv?: string }) {
  return (
    <div className="flex items-center gap-3">
      <ServerGlyph title="instance" sub="two addresses" h={90} light="on" className="w-[108px]" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col"><span className="text-[11px] leading-4" style={{ color: colors.body }}>public</span><Mono>{pub}</Mono></div>
        <div className="flex flex-col"><span className="text-[11px] leading-4" style={{ color: colors.body }}>private</span><Mono tone={colors.teal}>{priv}</Mono></div>
      </div>
    </div>
  )
}

/* ── Concept 4 · Billing ────────────────────────────────────────────── */

/** The Free plan credit on a card that cannot be charged. */
export function CreditCard({ amount = 'USD 100' }: { amount?: string }) {
  return (
    <div className="relative rounded-2xl bg-white px-6 py-4 shadow-card" style={{ border: `2px solid ${colors.brand}`, minWidth: 170 }}>
      <span className="block text-[11px] uppercase tracking-wider" style={{ color: colors.body }}>Free plan credit</span>
      <span className="block font-heading text-[30px] font-extrabold leading-9" style={{ color: colors.brand }}>{amount}</span>
      <span className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-white shadow-card" style={{ color: colors.success, border: `2px solid ${colors.success}` }}>
        <LockIcon width={18} height={18} />
      </span>
    </div>
  )
}

/** A small hard disk. */
function Disk() {
  return (
    <svg width={44} height={56} viewBox="0 0 44 56" aria-hidden>
      <ellipse cx={22} cy={10} rx={18} ry={7} fill={colors.white} stroke={colors.ink} strokeWidth={2} />
      <path d="M4 10 V44 a18 7 0 0 0 36 0 V10" fill={colors.white} stroke={colors.ink} strokeWidth={2} />
      <path d="M4 22 a18 7 0 0 0 36 0 M4 34 a18 7 0 0 0 36 0" fill="none" stroke={colors.line} strokeWidth={2} />
    </svg>
  )
}

/** What you pay for: a running instance and its disk, with a meter under them. */
export function PaidThings() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-end gap-3">
        <ServerGlyph title="instance" sub="running" h={60} light="on" className="w-[116px]" />
        <Disk />
      </div>
      <Scaled w={200} h={120} scale={0.46}>
        <Meter state="running" size="sm" />
      </Scaled>
    </div>
  )
}

/** The meter with its bell: the zero-spend budget. */
export function MeterAlert() {
  return (
    <Scaled w={320} h={240} scale={0.58}>
      <Meter state="alert" size="md" tick={false} />
    </Scaled>
  )
}
