import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * THE OBJECTS EVERY SCENE IS DRAWN FROM (plan decision 3).
 *
 * Flat, in the character lab's style (CONTRACTS.md "Art direction"): flat
 * fills, one shade a step darker where a form turns away, no outlines on big
 * forms, rounded corners. Every colour is a token (content rule 37) except an
 * object's own colour, which is marked where it is used (a taxi is yellow, a
 * cash note is green). Each object is one `<svg>` sized by `w`; its labels are
 * never drawn inside it (content rule 17): a scene puts its labels beside it
 * as DOM.
 *
 * Every state change eases on the house curve and stands still during an
 * instant jump (`useEase`).
 */

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** The transition every drawn state change uses: explanatory tier, none during a jump. */
export function useEase(ms = 520): string {
  return useInstant() ? 'none' : `all ${ms}ms ${HOUSE}`
}

type SvgBox = { w: number; className?: string; style?: CSSProperties }

function Svg({ w, vw, vh, className, style, children }: SvgBox & { vw: number; vh: number; children: ReactNode }) {
  return (
    <svg width={w} height={(w * vh) / vw} viewBox={`0 0 ${vw} ${vh}`} className={className} style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      {children}
    </svg>
  )
}

/* ------------------------------------------------------------------ servers */

/** One server unit's state: running (green light), idle (paid for, nothing on it), off (not there), alarm. */
export type UnitState = 'run' | 'idle' | 'off' | 'hot'

/**
 * A server rack: a tall cabinet holding `units.length` server units, top to
 * bottom. A running unit carries a green light and two lit bars; an idle unit
 * is greyed with its light dark; an `off` unit is an empty slot.
 */
export function Rack({ w, units, locked = false }: { w: number; units: UnitState[]; locked?: boolean }) {
  const ease = useEase()
  const n = units.length
  const H = 30 + n * 34
  return (
    <Svg w={w} vw={120} vh={H}>
      <rect x={4} y={4} width={112} height={H - 8} rx={10} fill={colors.brandDeep} />
      <rect x={4} y={4} width={112} height={14} rx={7} fill={colors.night3} />
      {units.map((u, i) => {
        const y = 22 + i * 34
        const live = u === 'run' || u === 'hot'
        return (
          <g key={i} style={{ transition: ease }}>
            <rect x={14} y={y} width={92} height={28} rx={5} fill={u === 'off' ? colors.night2 : live ? colors.surface2 : colors.muted} opacity={u === 'off' ? 0.6 : u === 'idle' ? 0.55 : 1} style={{ transition: ease }} />
            {u !== 'off' && (
              <>
                <rect x={24} y={y + 8} width={40} height={4} rx={2} fill={live ? colors.brand : colors.night2} opacity={live ? 1 : 0.5} style={{ transition: ease }} />
                <rect x={24} y={y + 16} width={28} height={4} rx={2} fill={live ? colors.brand : colors.night2} opacity={live ? 0.6 : 0.4} style={{ transition: ease }} />
                <circle cx={94} cy={y + 14} r={5} fill={u === 'hot' ? colors.danger : live ? colors.success : colors.night2} style={{ transition: ease }} />
              </>
            )}
          </g>
        )
      })}
      {locked && (
        <g transform={`translate(60 ${H - 14})`}>
          <rect x={-11} y={-6} width={22} height={16} rx={3} fill={colors.warning} />
          <path d="M -6 -6 V -11 A 6 6 0 0 1 6 -11 V -6" fill="none" stroke={colors.warning} strokeWidth={3} />
        </g>
      )}
    </Svg>
  )
}

/** One server, drawn as a flat unit, for tiles and pools. */
export function ServerUnit({ w, state = 'run' }: { w: number; state?: UnitState }) {
  const ease = useEase()
  const live = state === 'run' || state === 'hot'
  return (
    <Svg w={w} vw={80} vh={30}>
      <rect x={1} y={1} width={78} height={28} rx={6} fill={state === 'off' ? colors.surface : live ? colors.brandDeep : colors.muted} opacity={state === 'idle' ? 0.6 : 1} style={{ transition: ease }} />
      <rect x={10} y={9} width={34} height={4} rx={2} fill={live ? colors.brand : colors.white} opacity={state === 'off' ? 0 : 0.8} />
      <rect x={10} y={17} width={22} height={4} rx={2} fill={live ? colors.brand : colors.white} opacity={state === 'off' ? 0 : 0.5} />
      <circle cx={66} cy={15} r={4.5} fill={state === 'hot' ? colors.danger : live ? colors.success : colors.line} style={{ transition: ease }} />
    </Svg>
  )
}

/* ------------------------------------------------------------------ devices */

/** A laptop, its screen holding whatever the scene puts there (DOM, laid over by the caller). */
export function Laptop({ w, screen = colors.surface2, glow = false }: { w: number; screen?: string; glow?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={160} vh={104}>
      <rect x={18} y={4} width={124} height={80} rx={8} fill={colors.brandDeep} />
      <rect x={25} y={11} width={110} height={66} rx={4} fill={glow ? colors.brand : screen} style={{ transition: ease }} />
      <path d="M 4 88 H 156 L 148 100 H 12 Z" fill={colors.line} />
      <rect x={66} y={88} width={28} height={4} rx={2} fill={colors.muted} />
    </Svg>
  )
}

/** A desktop computer: monitor on a stand, a small tower beside it. */
export function Desktop({ w, lit = false }: { w: number; lit?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={150} vh={110}>
      <rect x={4} y={6} width={104} height={70} rx={7} fill={colors.brandDeep} />
      <rect x={11} y={13} width={90} height={56} rx={3} fill={lit ? colors.brand : colors.surface2} style={{ transition: ease }} />
      <rect x={50} y={76} width={12} height={16} fill={colors.muted} />
      <rect x={34} y={92} width={44} height={8} rx={3} fill={colors.muted} />
      <rect x={116} y={30} width={30} height={70} rx={5} fill={colors.night3} />
      <circle cx={131} cy={44} r={4} fill={lit ? colors.success : colors.muted} style={{ transition: ease }} />
    </Svg>
  )
}

/** A phone at real proportions (1 : 2.06, generate-slides 2b item 13). */
export function MiniPhone({ w, lit = false }: { w: number; lit?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={50} vh={103}>
      <rect x={1} y={1} width={48} height={101} rx={9} fill={colors.brandDeep} />
      <rect x={4.5} y={7} width={41} height={88} rx={5} fill={lit ? colors.brand : colors.surface2} style={{ transition: ease }} />
      <rect x={19} y={3} width={12} height={2.4} rx={1.2} fill={colors.night3} />
    </Svg>
  )
}

/** A terminal at a desk: a boxy screen with green text lines, a keyboard below. */
export function Terminal({ w, lit = false }: { w: number; lit?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={100} vh={90}>
      <rect x={8} y={4} width={84} height={60} rx={8} fill={colors.muted} />
      <rect x={15} y={10} width={70} height={46} rx={4} fill={colors.night} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={21} y={18 + i * 10} width={i === 1 ? 30 : 44} height={4} rx={2} fill={colors.success} opacity={lit ? 1 : 0.25} style={{ transition: ease }} />
      ))}
      <path d="M 4 70 H 96 L 90 86 H 10 Z" fill={colors.line} />
    </Svg>
  )
}

/** The mainframe: a row of tall cabinets with two tape reels and a light panel. */
export function Mainframe({ w, busy = false }: { w: number; busy?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={200} vh={150}>
      <rect x={4} y={10} width={192} height={134} rx={10} fill={colors.brandDeep} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={14 + i * 62} y={20} width={54} height={114} rx={6} fill={colors.night3} />
      ))}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${41 + i * 62} 52)`}>
          <circle r={18} fill={colors.surface2} />
          <circle r={6} fill={colors.brandDeep} />
          <circle r={12} fill="none" stroke={colors.muted} strokeWidth={2} strokeDasharray="4 5" style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: busy ? 'rotate(120deg)' : 'none', transition: ease }} />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={148 + (i % 3) * 12} cy={40 + Math.floor(i / 3) * 14} r={4} fill={busy && i % 2 === 0 ? colors.success : busy ? colors.warning : colors.muted} style={{ transition: ease }} />
      ))}
      <rect x={140} y={80} width={40} height={6} rx={3} fill={colors.muted} />
      <rect x={140} y={94} width={30} height={6} rx={3} fill={colors.muted} />
    </Svg>
  )
}

/* ------------------------------------------------------------------ places */

/** The cloud mark: a soft cloud shape. `tone` fills it. */
export function CloudShape({ w, fill = colors.brand, shade = colors.brandDark }: { w: number; fill?: string; shade?: string }) {
  return (
    <Svg w={w} vw={120} vh={74}>
      <path d="M 30 70 C 12 70 2 58 4 46 C 6 34 16 28 28 29 C 30 14 44 4 60 6 C 74 7 84 16 87 27 C 102 25 116 36 116 50 C 116 62 106 70 94 70 Z" fill={fill} />
      <path d="M 30 70 C 18 70 9 63 6 54 C 20 60 90 62 115 52 C 114 63 105 70 94 70 Z" fill={shade} opacity={0.55} />
    </Svg>
  )
}

/** The provider's data centre: a long low building with a cloud on its roof and lit windows. */
export function ProviderBuilding({ w, lit = 0 }: { w: number; lit?: number }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={220} vh={150}>
      <path d="M 62 44 C 52 44 46 37 47 30 C 48 23 54 20 60 20 C 62 11 70 6 79 7 C 87 8 92 13 94 19 C 102 18 110 24 110 32 C 110 39 104 44 97 44 Z" fill={colors.brand} />
      <rect x={10} y={52} width={200} height={92} rx={10} fill={colors.surface2} />
      <rect x={10} y={52} width={200} height={16} rx={8} fill={colors.brand} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={24 + (i % 6) * 31} y={78 + Math.floor(i / 6) * 28} width={22} height={18} rx={3} fill={i < lit ? colors.brand : colors.white} style={{ transition: ease }} />
      ))}
      <rect x={98} y={118} width={24} height={26} rx={3} fill={colors.brandDark} />
    </Svg>
  )
}

/** Ravi's locked server room: a closed door with a padlock and a rack window. */
export function ServerRoom({ w, locked = true }: { w: number; locked?: boolean }) {
  return (
    <Svg w={w} vw={180} vh={150}>
      <rect x={6} y={20} width={168} height={124} rx={10} fill={colors.line} />
      <path d="M 0 26 L 90 2 L 180 26 Z" fill={colors.muted} />
      <rect x={22} y={44} width={64} height={52} rx={5} fill={colors.brandDeep} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30} y={52 + i * 14} width={48} height={8} rx={2} fill={colors.brand} opacity={0.75} />
      ))}
      <rect x={104} y={60} width={52} height={84} rx={4} fill={colors.brandDark} />
      <circle cx={146} cy={102} r={3} fill={colors.white} />
      {locked && (
        <g transform="translate(130 92)">
          <rect x={-11} y={-4} width={22} height={18} rx={3} fill={colors.warning} />
          <path d="M -6 -4 V -9 A 6 6 0 0 1 6 -9 V -4" fill="none" stroke={colors.warning} strokeWidth={3} />
        </g>
      )}
    </Svg>
  )
}

/** A world-ish ground: a soft rounded panel with faint latitude lines, not a coastline (reference note: no invented geography). */
export function MapGround({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} aria-hidden>
      <rect x={0} y={0} width={w} height={h} rx={16} fill={colors.surface} />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={14} x2={w - 14} y1={h * f} y2={h * f} stroke={colors.line} strokeWidth={1.5} strokeDasharray="6 8" />
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((f) => (
        <line key={f} y1={14} y2={h - 14} x1={w * f} x2={w * f} stroke={colors.line} strokeWidth={1.5} strokeDasharray="6 8" />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ money and time */

/** A stack of coins, `n` high. */
export function Coins({ w, n }: { w: number; n: number }) {
  const ease = useEase()
  const H = 12 + 10 * 12
  return (
    <Svg w={w} vw={60} vh={H}>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} style={{ opacity: i < n ? 1 : 0, transform: i < n ? 'none' : 'translateY(-14px)', transition: ease, transitionDelay: `${i * 40}ms` }}>
          <ellipse cx={30} cy={H - 10 - i * 12} rx={26} ry={8} fill={colors.warning} />
          <ellipse cx={30} cy={H - 13 - i * 12} rx={26} ry={8} fill={colors.accent} opacity={0.35} />
        </g>
      ))}
    </Svg>
  )
}

/** One coin with the rupee mark. */
export function Coin({ w }: { w: number }) {
  return (
    <Svg w={w} vw={40} vh={40}>
      <circle cx={20} cy={20} r={18} fill={colors.warning} />
      <circle cx={20} cy={20} r={13} fill="none" stroke={colors.accentDark} strokeWidth={2} />
      <path d="M 14 13 H 26 M 14 18 H 26 M 16 13 C 24 13 24 23 16 23 L 25 30" fill="none" stroke={colors.accentDark} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

/**
 * A meter dial: a needle swept by `value` (0 to 1) and a number wheel under
 * it. `spin` turns the little wheel, the sign that something is being counted.
 */
export function MeterDial({ w, value, spin = false, tone = colors.brand }: { w: number; value: number; spin?: boolean; tone?: string }) {
  const ease = useEase(700)
  const a = -120 + Math.max(0, Math.min(1, value)) * 240
  return (
    <Svg w={w} vw={100} vh={100}>
      <circle cx={50} cy={50} r={46} fill={colors.white} />
      <circle cx={50} cy={50} r={46} fill="none" stroke={colors.line} strokeWidth={3} />
      <path d="M 18.2 68.4 A 36 36 0 1 1 81.8 68.4" fill="none" stroke={colors.surface2} strokeWidth={8} strokeLinecap="round" />
      <path d="M 18.2 68.4 A 36 36 0 1 1 81.8 68.4" fill="none" stroke={tone} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - Math.max(0, Math.min(1, value)), transition: ease }} />
      <g style={{ transformBox: 'view-box', transformOrigin: '50px 50px', transform: `rotate(${a}deg)`, transition: ease }}>
        <path d="M 50 50 L 48 26 L 50 20 L 52 26 Z" fill={colors.ink} />
      </g>
      <circle cx={50} cy={50} r={5} fill={colors.ink} />
      <g transform="translate(50 80)">
        <rect x={-14} y={-7} width={28} height={14} rx={3} fill={colors.ink} />
        <circle r={4} fill="none" stroke={spin ? colors.success : colors.muted} strokeWidth={2} strokeDasharray="3 3" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: spin ? 'cc-spin 1.2s linear infinite' : undefined }} />
      </g>
    </Svg>
  )
}

/** A wall calendar with a page that tears: `page` is the number shown. */
export function Calendar({ w, page, label = 'WEEK' }: { w: number; page: number | string; label?: string }) {
  return (
    <div className="relative" style={{ width: w, height: w * 1.05 }}>
      <Svg w={w} vw={80} vh={84}>
        <rect x={2} y={8} width={76} height={74} rx={8} fill={colors.white} />
        <rect x={2} y={8} width={76} height={20} rx={8} fill={colors.danger} />
        <rect x={2} y={20} width={76} height={8} fill={colors.danger} />
        <rect x={18} y={2} width={6} height={14} rx={3} fill={colors.muted} />
        <rect x={56} y={2} width={6} height={14} rx={3} fill={colors.muted} />
        <rect x={2} y={8} width={76} height={74} rx={8} fill="none" stroke={colors.line} strokeWidth={2} />
      </Svg>
      {w >= 110 && (
        <span className="absolute inset-x-0 text-center font-heading font-semibold leading-none text-white" style={{ top: w * 0.13, fontSize: w * 0.13 }}>
          {label}
        </span>
      )}
      <span className="absolute inset-x-0 text-center font-heading font-semibold leading-none" style={{ top: w * 0.45, fontSize: w * 0.34, color: colors.ink }}>
        {page}
      </span>
    </div>
  )
}

/** A stopwatch whose hand sits at `turn` (0 to 1 of a lap). */
export function Stopwatch({ w, turn, tone = colors.success }: { w: number; turn: number; tone?: string }) {
  const ease = useEase(700)
  return (
    <Svg w={w} vw={80} vh={92}>
      <rect x={33} y={2} width={14} height={10} rx={3} fill={colors.muted} />
      <circle cx={40} cy={52} r={36} fill={colors.white} />
      <circle cx={40} cy={52} r={36} fill="none" stroke={tone} strokeWidth={5} />
      <path d="M 40 52 L 40 52" />
      <path d={`M 40 52 L 40 22`} stroke={colors.ink} strokeWidth={3.5} strokeLinecap="round" style={{ transformBox: 'view-box', transformOrigin: '40px 52px', transform: `rotate(${turn * 360}deg)`, transition: ease }} />
      <circle cx={40} cy={52} r={4} fill={colors.ink} />
    </Svg>
  )
}

/** A clock face with its hand at `turn` (0 to 1), for scheduled turns. */
export function ClockFace({ w, turn }: { w: number; turn: number }) {
  const ease = useEase(700)
  return (
    <Svg w={w} vw={60} vh={60}>
      <circle cx={30} cy={30} r={27} fill={colors.white} stroke={colors.brand} strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={30 + 20 * Math.sin((i * Math.PI) / 6)} cy={30 - 20 * Math.cos((i * Math.PI) / 6)} r={1.6} fill={colors.muted} />
      ))}
      <path d="M 30 30 L 30 11" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" style={{ transformBox: 'view-box', transformOrigin: '30px 30px', transform: `rotate(${turn * 360}deg)`, transition: ease }} />
      <circle cx={30} cy={30} r={3} fill={colors.ink} />
    </Svg>
  )
}

/** A procurement ticket: a slip with lines and a stamp slot. `struck` crosses it out. */
export function Ticket({ w, struck = false }: { w: number; struck?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={90} vh={60}>
      <path d="M 4 6 H 86 V 22 A 8 8 0 0 0 86 38 V 54 H 4 V 38 A 8 8 0 0 0 4 22 Z" fill={colors.white} stroke={colors.line} strokeWidth={2} />
      <rect x={14} y={14} width={44} height={5} rx={2.5} fill={colors.muted} />
      <rect x={14} y={26} width={58} height={4} rx={2} fill={colors.line} />
      <rect x={14} y={35} width={50} height={4} rx={2} fill={colors.line} />
      <rect x={62} y={10} width={18} height={14} rx={3} fill="none" stroke={colors.warning} strokeWidth={2} strokeDasharray="3 2" />
      <path d="M 6 52 L 84 8" stroke={colors.danger} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: struck ? 0 : 1, transition: ease }} />
    </Svg>
  )
}

/** A padlock, open or shut. */
export function Padlock({ w, open = false, tone = colors.warning }: { w: number; open?: boolean; tone?: string }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={40} vh={48}>
      <path d="M 11 22 V 13 A 9 9 0 0 1 29 13 V 22" fill="none" stroke={tone} strokeWidth={5} strokeLinecap="round" style={{ transformBox: 'fill-box', transformOrigin: '29px 22px', transform: open ? 'translateY(-6px) rotate(25deg)' : 'none', transition: ease }} />
      <rect x={4} y={21} width={32} height={25} rx={5} fill={tone} />
      <circle cx={20} cy={32} r={3.5} fill={colors.brandDeep} />
      <rect x={18.5} y={33} width={3} height={7} rx={1.5} fill={colors.brandDeep} />
    </Svg>
  )
}

/** A key. */
export function KeyIcon({ w, tone = colors.warning }: { w: number; tone?: string }) {
  return (
    <Svg w={w} vw={60} vh={30}>
      <circle cx={14} cy={15} r={11} fill={tone} />
      <circle cx={14} cy={15} r={4.5} fill={colors.white} />
      <rect x={22} y={12} width={34} height={6} rx={3} fill={tone} />
      <rect x={44} y={16} width={5} height={9} rx={2} fill={tone} />
      <rect x={51} y={16} width={5} height={7} rx={2} fill={tone} />
    </Svg>
  )
}

/** A toolbox, for in-house maintenance. */
export function Toolbox({ w }: { w: number }) {
  return (
    <Svg w={w} vw={70} vh={50}>
      <path d="M 24 14 V 8 H 46 V 14" fill="none" stroke={colors.muted} strokeWidth={4} />
      <rect x={4} y={14} width={62} height={32} rx={5} fill={colors.danger} />
      <rect x={4} y={24} width={62} height={5} fill={colors.ink} opacity={0.25} />
      <rect x={30} y={22} width={10} height={9} rx={2} fill={colors.warning} />
    </Svg>
  )
}

/** A bill: a sheet with item rows, the last row the total. */
export function Bill({ w, rows = 4, alarm = false }: { w: number; rows?: number; alarm?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={70} vh={90}>
      <path d="M 4 4 H 66 V 84 L 58 78 L 50 84 L 42 78 L 34 84 L 26 78 L 18 84 L 10 78 L 4 84 Z" fill={colors.white} stroke={alarm ? colors.danger : colors.line} strokeWidth={2} style={{ transition: ease }} />
      <rect x={12} y={12} width={30} height={5} rx={2.5} fill={colors.brand} />
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <rect x={12} y={26 + i * 10} width={28} height={4} rx={2} fill={colors.line} />
          <rect x={46} y={26 + i * 10} width={12} height={4} rx={2} fill={colors.muted} />
        </g>
      ))}
      <rect x={12} y={30 + rows * 10} width={46} height={5} rx={2.5} fill={alarm ? colors.danger : colors.ink} style={{ transition: ease }} />
    </Svg>
  )
}

/** A bell, for an alarm. `ringing` tilts it. */
export function Bell({ w, ringing = false, tone = colors.danger }: { w: number; ringing?: boolean; tone?: string }) {
  return (
    <Svg w={w} vw={40} vh={44}>
      <g style={{ transformBox: 'view-box', transformOrigin: '20px 4px', animation: ringing ? 'cc-ring 0.5s ease-in-out infinite alternate' : undefined }}>
        <path d="M 20 4 C 10 4 7 13 7 22 C 7 28 4 31 3 34 H 37 C 36 31 33 28 33 22 C 33 13 30 4 20 4 Z" fill={ringing ? tone : colors.muted} />
        <circle cx={20} cy={38} r={4} fill={ringing ? tone : colors.muted} />
      </g>
    </Svg>
  )
}

/* ------------------------------------------------------------------ everyday objects */

/** A suitcase or a travel bag. */
export function Bag({ w }: { w: number }) {
  return (
    <Svg w={w} vw={50} vh={50}>
      <path d="M 17 12 V 7 H 33 V 12" fill="none" stroke={colors.brandDeep} strokeWidth={3.5} />
      <rect x={4} y={12} width={42} height={34} rx={6} fill={colors.accent} />
      <rect x={4} y={24} width={42} height={4} fill={colors.accentDark} />
    </Svg>
  )
}

/** A bed, seen from the side. */
export function Bed({ w }: { w: number }) {
  return (
    <Svg w={w} vw={120} vh={60}>
      <rect x={4} y={10} width={10} height={46} rx={3} fill={colors.brandDark} />
      <rect x={12} y={28} width={104} height={18} rx={5} fill={colors.surface2} />
      <rect x={12} y={38} width={104} height={10} rx={3} fill={colors.brand} />
      <rect x={18} y={20} width={26} height={12} rx={6} fill={colors.white} stroke={colors.line} strokeWidth={1.5} />
      <rect x={110} y={34} width={8} height={22} rx={3} fill={colors.brandDark} />
    </Svg>
  )
}

/** A sofa. */
export function Sofa({ w }: { w: number }) {
  return (
    <Svg w={w} vw={110} vh={60}>
      <rect x={10} y={8} width={90} height={30} rx={10} fill={colors.teal} />
      <rect x={2} y={24} width={20} height={28} rx={8} fill={colors.tealDark} />
      <rect x={88} y={24} width={20} height={28} rx={8} fill={colors.tealDark} />
      <rect x={18} y={32} width={74} height={18} rx={6} fill={colors.teal} />
      <rect x={14} y={50} width={6} height={8} fill={colors.brandDeep} />
      <rect x={90} y={50} width={6} height={8} fill={colors.brandDeep} />
    </Svg>
  )
}

/** A fridge. */
export function Fridge({ w }: { w: number }) {
  return (
    <Svg w={w} vw={50} vh={90}>
      <rect x={2} y={2} width={46} height={86} rx={6} fill={colors.white} stroke={colors.line} strokeWidth={2} />
      <line x1={2} x2={48} y1={32} y2={32} stroke={colors.line} strokeWidth={2} />
      <rect x={38} y={12} width={4} height={14} rx={2} fill={colors.muted} />
      <rect x={38} y={40} width={4} height={20} rx={2} fill={colors.muted} />
    </Svg>
  )
}

/** A floor lamp. */
export function Lamp({ w, on = true }: { w: number; on?: boolean }) {
  return (
    <Svg w={w} vw={40} vh={90}>
      {on && <ellipse cx={20} cy={30} rx={18} ry={12} fill={colors.warning} opacity={0.25} />}
      <path d="M 8 24 L 14 4 H 26 L 32 24 Z" fill={on ? colors.warning : colors.muted} />
      <rect x={18.5} y={24} width={3} height={58} fill={colors.brandDeep} />
      <rect x={8} y={82} width={24} height={6} rx={3} fill={colors.brandDeep} />
    </Svg>
  )
}

/** Bricks and a cement bag: what you would build with, and do not have to. */
export function Bricks({ w }: { w: number }) {
  return (
    <Svg w={w} vw={80} vh={50}>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={4 + c * 24 + (r % 2) * 10} y={34 - r * 14} width={22} height={12} rx={2} fill={colors.danger} opacity={0.8} />),
      )}
    </Svg>
  )
}

/** One thick reference book. */
export function Book({ w, tone = colors.brand }: { w: number; tone?: string }) {
  return (
    <Svg w={w} vw={50} vh={40}>
      <rect x={4} y={6} width={42} height={30} rx={3} fill={tone} />
      <rect x={8} y={6} width={4} height={30} fill={colors.brandDeep} opacity={0.35} />
      <rect x={18} y={14} width={20} height={4} rx={2} fill={colors.white} opacity={0.85} />
      <rect x={18} y={22} width={14} height={3} rx={1.5} fill={colors.white} opacity={0.6} />
    </Svg>
  )
}

/** A long table top. */
export function TableTop({ w }: { w: number }) {
  return (
    <svg width={w} height={30} viewBox={`0 0 ${w} 30`} style={{ display: 'block' }} aria-hidden>
      <rect x={0} y={0} width={w} height={12} rx={6} fill={colors.brandDark} opacity={0.75} />
      <rect x={18} y={12} width={8} height={18} fill={colors.brandDeep} opacity={0.6} />
      <rect x={w - 26} y={12} width={8} height={18} fill={colors.brandDeep} opacity={0.6} />
    </svg>
  )
}

/** A building cut away into `n` flats side by side, each with its own door and lock. */
export function Flats({ w, n = 3, locked = true }: { w: number; n?: number; locked?: boolean }) {
  const ease = useEase()
  const fw = 64
  const W = 16 + n * fw
  return (
    <Svg w={w} vw={W} vh={110}>
      <path d={`M 0 30 L ${W / 2} 4 L ${W} 30 Z`} fill={colors.danger} opacity={0.75} />
      <rect x={4} y={30} width={W - 8} height={76} rx={4} fill={colors.line} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={10 + i * fw} y={38} width={fw - 8} height={64} rx={3} fill={colors.white} />
          {i > 0 && <rect x={6 + i * fw} y={34} width={4} height={72} fill={colors.brandDeep} />}
          <rect x={10 + i * fw + (fw - 8) / 2 - 10} y={62} width={20} height={40} rx={2} fill={colors.brand} opacity={0.75} />
          <g transform={`translate(${10 + i * fw + (fw - 8) / 2} 80)`} style={{ opacity: locked ? 1 : 0, transition: ease }}>
            <rect x={-6} y={-2} width={12} height={10} rx={2} fill={colors.warning} />
            <path d="M -3.5 -2 V -5 A 3.5 3.5 0 0 1 3.5 -5 V -2" fill="none" stroke={colors.warning} strokeWidth={2} />
          </g>
        </g>
      ))}
    </Svg>
  )
}

/** A delivery truck, with up to three parcels in its open back. `tones` colours them. */
export function Truck({ w, parcels = [] }: { w: number; parcels?: string[] }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={170} vh={90}>
      <rect x={4} y={10} width={110} height={58} rx={6} fill={colors.surface2} stroke={colors.line} strokeWidth={2} />
      {parcels.map((t, i) => (
        <rect key={i} x={14 + i * 32} y={32} width={28} height={30} rx={3} fill={t} style={{ transition: ease }} />
      ))}
      <path d="M 116 26 H 146 L 164 46 V 68 H 116 Z" fill={colors.brand} />
      <path d="M 124 32 H 143 L 155 46 H 124 Z" fill={colors.white} opacity={0.8} />
      <circle cx={34} cy={74} r={12} fill={colors.brandDeep} />
      <circle cx={34} cy={74} r={5} fill={colors.muted} />
      <circle cx={140} cy={74} r={12} fill={colors.brandDeep} />
      <circle cx={140} cy={74} r={5} fill={colors.muted} />
    </Svg>
  )
}

/** A parcel, in the sender's colour. */
export function Parcel({ w, tone }: { w: number; tone: string }) {
  return (
    <Svg w={w} vw={40} vh={40}>
      <rect x={3} y={6} width={34} height={30} rx={4} fill={tone} />
      <rect x={17} y={6} width={6} height={30} fill={colors.white} opacity={0.45} />
    </Svg>
  )
}

/** A weighing scale with a needle at `value` (0 to 1). */
export function WeighScale({ w, value }: { w: number; value: number }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={70} vh={60}>
      <rect x={6} y={8} width={58} height={6} rx={3} fill={colors.muted} />
      <rect x={30} y={14} width={10} height={10} fill={colors.muted} />
      <rect x={4} y={24} width={62} height={32} rx={8} fill={colors.brandDeep} />
      <path d="M 18 48 A 17 17 0 0 1 52 48" fill="none" stroke={colors.white} strokeWidth={2} />
      <path d="M 35 48 L 35 34" stroke={colors.warning} strokeWidth={3} strokeLinecap="round" style={{ transformBox: 'view-box', transformOrigin: '35px 48px', transform: `rotate(${-80 + value * 160}deg)`, transition: ease }} />
    </Svg>
  )
}

/** An ATM set into a wall: the screen, keypad, card slot and cash slot. */
export function Atm({ w, card = false, cash = false, screen = colors.surface2 }: { w: number; card?: boolean; cash?: boolean; screen?: string }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={110} vh={150}>
      <rect x={0} y={0} width={110} height={150} rx={10} fill={colors.line} />
      <rect x={12} y={10} width={86} height={134} rx={8} fill={colors.brandDeep} />
      <rect x={22} y={20} width={66} height={44} rx={4} fill={screen} style={{ transition: ease }} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={26 + (i % 3) * 14} y={74 + Math.floor(i / 3) * 12} width={10} height={8} rx={2} fill={colors.muted} />
      ))}
      <rect x={72} y={76} width={18} height={4} rx={2} fill={colors.night} />
      <rect x={75} y={card ? 70 : 76} width={12} height={card ? 8 : 0} rx={1.5} fill={colors.warning} style={{ transition: ease }} />
      <rect x={30} y={118} width={50} height={6} rx={3} fill={colors.night} />
      {/* the cash note's own green */}
      <rect x={35} y={cash ? 122 : 118} width={40} height={cash ? 18 : 0} rx={2} fill="#3BAA5C" style={{ transition: ease }} />
    </Svg>
  )
}

/** A bank counter with a teller window. */
export function Counter({ w }: { w: number }) {
  return (
    <Svg w={w} vw={130} vh={80}>
      <rect x={2} y={4} width={126} height={40} rx={6} fill={colors.surface2} />
      <rect x={20} y={10} width={90} height={30} rx={4} fill={colors.white} stroke={colors.line} strokeWidth={2} />
      <rect x={2} y={44} width={126} height={34} rx={4} fill={colors.brandDark} />
      <rect x={2} y={44} width={126} height={6} fill={colors.brandDeep} />
    </Svg>
  )
}

/** A serving counter with three shared trays and a ladle. */
export function MessCounter({ w, served = 0 }: { w: number; served?: number }) {
  const ease = useEase()
  const food = [colors.warning, colors.success, colors.accent]
  return (
    <Svg w={w} vw={220} vh={90}>
      <rect x={2} y={40} width={216} height={46} rx={6} fill={colors.muted} />
      <rect x={2} y={36} width={216} height={10} rx={4} fill={colors.line} />
      {food.map((t, i) => (
        <g key={i}>
          <rect x={16 + i * 68} y={20} width={56} height={22} rx={4} fill={colors.white} stroke={colors.line} strokeWidth={2} />
          <ellipse cx={44 + i * 68} cy={26} rx={22} ry={6} fill={t} style={{ opacity: 1 - served * 0.08, transition: ease }} />
        </g>
      ))}
      <path d="M 196 8 V 28 M 190 30 A 6 6 0 0 0 202 30" fill="none" stroke={colors.brandDeep} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  )
}

/** A steel plate with up to three portions. */
export function Plate({ w, portions = 0 }: { w: number; portions?: number }) {
  const ease = useEase()
  const food = [colors.warning, colors.success, colors.accent]
  return (
    <Svg w={w} vw={50} vh={30}>
      <ellipse cx={25} cy={18} rx={23} ry={10} fill={colors.line} />
      <ellipse cx={25} cy={16} rx={19} ry={8} fill={colors.surface} />
      {food.map((t, i) => (
        <ellipse key={i} cx={14 + i * 11} cy={16} rx={5.5} ry={3.5} fill={t} style={{ opacity: i < portions ? 1 : 0, transition: ease, transitionDelay: `${i * 120}ms` }} />
      ))}
    </Svg>
  )
}

/** A gas stove, the dedicated thing pooling replaces. */
export function Stove({ w }: { w: number }) {
  return (
    <Svg w={w} vw={60} vh={40}>
      <rect x={2} y={14} width={56} height={22} rx={4} fill={colors.muted} />
      <circle cx={18} cy={14} r={8} fill="none" stroke={colors.brandDeep} strokeWidth={3} />
      <circle cx={42} cy={14} r={8} fill="none" stroke={colors.brandDeep} strokeWidth={3} />
    </Svg>
  )
}

/** A rubber band stretched by `stretch` (0 at rest to 1 fully stretched), between two pegs. */
export function RubberBand({ w, stretch }: { w: number; stretch: number }) {
  const ease = useEase(640)
  const spread = 30 + stretch * 70
  const left = 110 - spread
  const right = 110 + spread
  return (
    <Svg w={w} vw={220} vh={80}>
      <path
        d={`M ${left} 40 C ${left} ${22 - stretch * 6} ${right} ${22 - stretch * 6} ${right} 40 C ${right} ${58 + stretch * 6} ${left} ${58 + stretch * 6} ${left} 40 Z`}
        fill="none"
        stroke={colors.accent}
        strokeWidth={7 - stretch * 2.5}
        style={{ transition: ease }}
      />
      <circle cx={left} cy={40} r={7} fill={colors.brandDeep} style={{ transition: ease }} />
      <circle cx={right} cy={40} r={7} fill={colors.brandDeep} style={{ transition: ease }} />
    </Svg>
  )
}

/** A taxi with its meter on the roof (the taxi's own yellow is the object's colour). */
export function Taxi({ w, meterOn = false }: { w: number; meterOn?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={170} vh={80}>
      <rect x={66} y={4} width={36} height={12} rx={3} fill={meterOn ? colors.success : colors.muted} style={{ transition: ease }} />
      <path d="M 20 40 L 40 18 H 124 L 146 40 H 160 A 6 6 0 0 1 166 46 V 60 H 4 V 46 A 6 6 0 0 1 10 40 Z" fill="#F5C518" />
      <path d="M 46 22 H 80 V 40 H 30 Z M 86 22 H 120 L 138 40 H 86 Z" fill={colors.white} opacity={0.8} />
      <rect x={4} y={46} width={162} height={4} fill={colors.ink} opacity={0.2} />
      <circle cx={42} cy={62} r={13} fill={colors.brandDeep} />
      <circle cx={42} cy={62} r={5} fill={colors.muted} />
      <circle cx={130} cy={62} r={13} fill={colors.brandDeep} />
      <circle cx={130} cy={62} r={5} fill={colors.muted} />
    </Svg>
  )
}

/** A parked car with a cover of dust: owned, idle. */
export function ParkedCar({ w }: { w: number }) {
  return (
    <Svg w={w} vw={170} vh={80}>
      <path d="M 20 40 L 40 18 H 124 L 146 40 H 160 A 6 6 0 0 1 166 46 V 60 H 4 V 46 A 6 6 0 0 1 10 40 Z" fill={colors.muted} />
      <path d="M 46 22 H 80 V 40 H 30 Z M 86 22 H 120 L 138 40 H 86 Z" fill={colors.white} opacity={0.5} />
      <circle cx={42} cy={62} r={13} fill={colors.brandDeep} />
      <circle cx={130} cy={62} r={13} fill={colors.brandDeep} />
    </Svg>
  )
}

/** A house front. */
export function House({ w }: { w: number }) {
  return (
    <Svg w={w} vw={90} vh={80}>
      <path d="M 4 36 L 45 4 L 86 36 Z" fill={colors.danger} opacity={0.8} />
      <rect x={12} y={34} width={66} height={44} rx={3} fill={colors.surface2} />
      <rect x={38} y={50} width={16} height={28} rx={2} fill={colors.brandDark} />
      <rect x={20} y={44} width={12} height={12} rx={2} fill={colors.warning} opacity={0.8} />
      <rect x={60} y={44} width={12} height={12} rx={2} fill={colors.warning} opacity={0.8} />
    </Svg>
  )
}

/** A table fan whose blades turn while `on`. */
export function Fan({ w, on }: { w: number; on: boolean }) {
  return (
    <Svg w={w} vw={60} vh={80}>
      <circle cx={30} cy={28} r={26} fill={colors.white} stroke={colors.line} strokeWidth={2} />
      <g style={{ transformBox: 'view-box', transformOrigin: '30px 28px', animation: on ? 'cc-spin 0.6s linear infinite' : undefined }}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx={30} cy={15} rx={6} ry={12} fill={on ? colors.brand : colors.muted} transform={`rotate(${a} 30 28)`} />
        ))}
      </g>
      <circle cx={30} cy={28} r={4} fill={colors.brandDeep} />
      <rect x={27} y={54} width={6} height={18} fill={colors.muted} />
      <rect x={14} y={72} width={32} height={6} rx={3} fill={colors.muted} />
    </Svg>
  )
}

/** A light bulb, lit or not. */
export function Bulb({ w, on }: { w: number; on: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={40} vh={60}>
      {on && <circle cx={20} cy={20} r={19} fill={colors.warning} opacity={0.25} />}
      <path d="M 20 4 C 9 4 4 12 4 20 C 4 28 11 32 12 40 H 28 C 29 32 36 28 36 20 C 36 12 31 4 20 4 Z" fill={on ? colors.warning : colors.line} style={{ transition: ease }} />
      <rect x={12} y={42} width={16} height={5} rx={2} fill={colors.muted} />
      <rect x={13} y={49} width={14} height={5} rx={2} fill={colors.muted} />
    </Svg>
  )
}

/** A row of fitted kitchen cupboards along a wall, each drawer with its label slot. */
export function Cupboards({ w, labels = false }: { w: number; labels?: boolean }) {
  const ease = useEase()
  return (
    <Svg w={w} vw={220} vh={100}>
      <rect x={2} y={2} width={216} height={10} rx={3} fill={colors.warning} opacity={0.75} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={6 + i * 53} y={14} width={49} height={82} rx={4} fill={colors.white} stroke={colors.line} strokeWidth={2} />
          <line x1={6 + i * 53} x2={55 + i * 53} y1={42} y2={42} stroke={colors.line} strokeWidth={2} />
          <line x1={6 + i * 53} x2={55 + i * 53} y1={68} y2={68} stroke={colors.line} strokeWidth={2} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={20 + i * 53} y={24 + r * 26} width={22} height={5} rx={2.5} fill={labels ? colors.brand : colors.muted} style={{ transition: ease }} />
          ))}
        </g>
      ))}
    </Svg>
  )
}

/** A wall: the fixing the cupboards are screwed to. */
export function Wall({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} aria-hidden>
      <rect width={w} height={h} rx={8} fill={colors.surface2} />
      {Array.from({ length: Math.floor(h / 18) }, (_, i) => (
        <line key={i} x1={0} x2={w} y1={9 + i * 18} y2={9 + i * 18} stroke={colors.line} strokeWidth={1.5} />
      ))}
    </svg>
  )
}

/** A world map pin. */
export function Pin({ w, tone = colors.brand }: { w: number; tone?: string }) {
  return (
    <Svg w={w} vw={30} vh={40}>
      <path d="M 15 2 C 7 2 2 8 2 15 C 2 25 15 38 15 38 C 15 38 28 25 28 15 C 28 8 23 2 15 2 Z" fill={tone} />
      <circle cx={15} cy={15} r={5} fill={colors.white} />
    </Svg>
  )
}

/** A rocket, for speed to market. */
export function Rocket({ w }: { w: number }) {
  return (
    <Svg w={w} vw={40} vh={60}>
      <path d="M 20 2 C 30 12 32 26 30 40 H 10 C 8 26 10 12 20 2 Z" fill={colors.brand} />
      <circle cx={20} cy={20} r={5} fill={colors.white} />
      <path d="M 10 30 L 2 44 L 10 40 Z M 30 30 L 38 44 L 30 40 Z" fill={colors.brandDark} />
      <path d="M 14 42 L 20 56 L 26 42 Z" fill={colors.accent} />
    </Svg>
  )
}

/** A light idea bulb with a spark: Meera's idea. */
export function Idea({ w }: { w: number }) {
  return <Bulb w={w} on />
}

/** A storefront, for a provider opening its doors in a launch year. `open` lifts its shutter. */
export function Storefront({ w, open, children }: { w: number; open: boolean; children?: ReactNode }) {
  const ease = useEase(640)
  return (
    <div className="relative" style={{ width: w, height: w * 0.78 }}>
      <Svg w={w} vw={100} vh={78}>
        <rect x={2} y={14} width={96} height={62} rx={6} fill={colors.surface2} />
        <path d="M 0 16 L 10 2 H 90 L 100 16 Z" fill={colors.brand} />
        <rect x={12} y={26} width={76} height={46} rx={3} fill={colors.white} />
        <rect x={12} y={26} width={76} height={open ? 6 : 46} rx={3} fill={colors.muted} style={{ transition: ease }} />
        {Array.from({ length: open ? 1 : 6 }, (_, i) => (
          <line key={i} x1={14} x2={86} y1={30 + i * 7} y2={30 + i * 7} stroke={colors.line} strokeWidth={1.5} style={{ transition: ease }} />
        ))}
      </Svg>
      {children && (
        <div className="absolute inset-x-0 grid place-items-center" style={{ top: w * 0.34, height: w * 0.4, opacity: open ? 1 : 0, transition: ease }}>
          {children}
        </div>
      )}
    </div>
  )
}

/** A balance scale; `tilt` in degrees, positive drops the right pan. Pans carry DOM content laid over by the caller. */
export function Balance({ w, tilt = 0 }: { w: number; tilt?: number }) {
  const ease = useEase(700)
  return (
    <Svg w={w} vw={220} vh={120}>
      <rect x={106} y={30} width={8} height={80} fill={colors.brandDeep} />
      <rect x={76} y={108} width={68} height={8} rx={4} fill={colors.brandDeep} />
      <g style={{ transformBox: 'view-box', transformOrigin: '110px 30px', transform: `rotate(${tilt}deg)`, transition: ease }}>
        <rect x={14} y={26} width={192} height={8} rx={4} fill={colors.brand} />
        <path d="M 30 34 L 14 70 M 30 34 L 46 70" stroke={colors.muted} strokeWidth={2} />
        <path d="M 190 34 L 174 70 M 190 34 L 206 70" stroke={colors.muted} strokeWidth={2} />
        <path d="M 6 70 H 54 A 24 10 0 0 1 6 70 Z" fill={colors.brand} />
        <path d="M 166 70 H 214 A 24 10 0 0 1 166 70 Z" fill={colors.danger} />
      </g>
      <circle cx={110} cy={30} r={7} fill={colors.brandDeep} />
    </Svg>
  )
}

/** A roaming phone: a phone with a plane over it and a signal arc. */
export function RoamingPhone({ w, on }: { w: number; on: boolean }) {
  const ease = useEase()
  return (
    <div className="relative" style={{ width: w, height: w * 2.06 }}>
      <MiniPhone w={w} />
      <div className="absolute inset-0 grid place-items-center">
        <Svg w={w * 0.6} vw={40} vh={40}>
          <path d="M 4 22 L 36 10 L 30 16 L 34 30 L 28 28 L 22 18 L 14 22 L 12 28 L 8 26 Z" fill={on ? colors.brand : colors.muted} style={{ transition: ease }} />
        </Svg>
      </div>
    </div>
  )
}

/** A moon, for "overnight". */
export function Moon({ w }: { w: number }) {
  return (
    <Svg w={w} vw={40} vh={40}>
      <path d="M 26 4 A 17 17 0 1 0 36 28 A 13 13 0 1 1 26 4 Z" fill={colors.warning} />
    </Svg>
  )
}

/** The keyframes the objects above use, mounted once by the deck. */
export const ART_CSS = `
@keyframes cc-spin { to { transform: rotate(360deg) } }
@keyframes cc-ring { from { transform: rotate(-12deg) } to { transform: rotate(12deg) } }
@keyframes cc-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }
@keyframes cc-dash { to { stroke-dashoffset: -24 } }
`
