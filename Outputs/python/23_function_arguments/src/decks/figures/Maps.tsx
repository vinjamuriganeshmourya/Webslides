import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { Pointer } from 'lucide-react'
import { Phone } from './Phone'

/**
 * ONE WORLD FOR THE SESSION (spec note 2): Teja's phone, a maps app open on
 * directions, going home from the college Main Gate to Ameerpet.
 *
 * The screen wears the look of the maps app every student has used: two white
 * boxes, the start with a hollow circle and the end with a red pin, joined by a
 * dotted line; the swap button at the right edge; the travel modes with the
 * bike chosen; the map with the blue route. Drawn in the template's tokens
 * (content rule 37), with no product mark or name (content rule 12).
 *
 * The places on the map never move. What the boxes say decides where the
 * start circle and the pin sit, and which way the route runs: swap the boxes
 * and the route redraws the other way (H1 must line: "the two names trade
 * boxes and the route redraws reversed"). H1, G1 and H2 draw the same
 * component, so the game's app "looks exactly like the hook's app".
 */

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const GATE = 'Main Gate'
export const HOME = 'Ameerpet'

/* map geometry, in the map's own 216 x 300 box */
const P_GATE = { x: 44, y: 246 }
const P_HOME = { x: 168, y: 62 }
const ROUTE = [P_GATE, { x: 44, y: 196 }, { x: 102, y: 196 }, { x: 102, y: 120 }, { x: 168, y: 120 }, P_HOME]
const pathOf = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')

export interface MapsState {
  /** what the top box says; null is an empty box */
  start: string | null
  /** what the bottom box says */
  end: string | null
  /** the top box shows `Your location` in blue (H2) */
  here?: boolean
  /** a crash screen in place of the map (G1 round 3), with the error */
  crash?: string | null
  /** a red ring round the top box: the wrong thing (G1) */
  circled?: boolean
  /** the finger over the swap button, which pulses once (H1 press 3) */
  finger?: boolean
  /** the text typed so far in each box, while a typing replay runs */
  typing?: { start?: string; end?: string; caret?: 'start' | 'end' | null }
}

const Field = forwardRef<HTMLSpanElement, { text: string | null; placeholder: string; blue?: boolean; caret?: boolean; icon: ReactNode }>(function Field({ text, placeholder, blue = false, caret = false, icon }, textRef) {
  const empty = !text
  return (
    <div className="flex items-center gap-2">
      <span className="grid w-[14px] shrink-0 place-items-center">{icon}</span>
      <span
        className="flex h-[30px] min-w-0 flex-1 items-center rounded-lg px-2.5 text-[13.5px] font-semibold"
        style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}`, color: empty ? colors.muted : blue ? colors.brand : colors.ink }}
      >
        <span ref={textRef} className="truncate">{empty ? placeholder : text}</span>
        {caret && <span className="ml-px inline-block h-[15px] w-[1.5px] animate-pulse" style={{ background: colors.brand }} />}
      </span>
    </div>
  )
})

const Ring = () => <span className="block h-[11px] w-[11px] rounded-full" style={{ boxShadow: `inset 0 0 0 2.5px ${colors.ink}` }} />
const Dot = () => <span className="block h-[11px] w-[11px] rounded-full" style={{ background: colors.brand, boxShadow: `0 0 0 3px ${colors.brand}33` }} />
const Pin = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 20 26" aria-hidden>
    <path d="M10 25s8-8.6 8-14.6A8 8 0 0 0 2 10.4C2 16.4 10 25 10 25z" fill={colors.danger} />
    <circle cx="10" cy="10.2" r="3.2" fill={colors.white} />
  </svg>
)

/** The swap button: two arrows, one up, one down. */
function SwapButton({ pulse }: { pulse: boolean }) {
  const instant = useInstant()
  return (
    <span
      key={pulse ? 'p' : 'n'}
      className="grid h-[28px] w-[28px] place-items-center rounded-full"
      style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 2px 6px rgba(16,32,58,0.14)`, animation: pulse && !instant ? `maps-pulse 900ms ${HOUSE} 350ms 1 both` : undefined }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.body} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 20V5M4 9l4-4 4 4" />
        <path d="M16 4v15M12 15l4 4 4-4" />
      </svg>
    </span>
  )
}

if (typeof document !== 'undefined' && !document.querySelector('style[data-maps]')) {
  const el = document.createElement('style')
  el.dataset.maps = ''
  el.textContent = `@keyframes maps-pulse { 0% { box-shadow: 0 0 0 0 ${colors.brand}66; transform: scale(1); } 40% { transform: scale(1.12); } 100% { box-shadow: 0 0 0 12px ${colors.brand}00; transform: scale(1); } }`
  document.head.appendChild(el)
}

/** A finger, its tip on the swap button. */
function Finger() {
  return (
    <span className="sm-bump block">
      <Pointer size={30} fill={colors.white} color={colors.ink} strokeWidth={1.8} />
    </span>
  )
}

/** The directions header: the two boxes, the line between their icons, the swap button, the modes. */
function Directions({ s, startRef, endRef }: { s: MapsState; startRef?: React.Ref<HTMLSpanElement>; endRef?: React.Ref<HTMLSpanElement> }) {
  const t = s.typing
  const startText = t ? (t.start ?? null) : s.here ? 'Your location' : s.start
  const endText = t ? (t.end ?? null) : s.end
  /* THE TURN (H1 press 4): when the two names trade boxes, each slides from the other box */
  const instant = useInstant()
  const a = useRef<HTMLSpanElement>(null)
  const b = useRef<HTMLSpanElement>(null)
  const was = useRef({ start: startText, end: endText })
  useLayoutEffect(() => {
    const p = was.current
    was.current = { start: startText, end: endText }
    if (instant || !startText || !endText || startText === endText) return
    if (p.start === endText && p.end === startText) {
      const opts = { duration: 860, easing: HOUSE }
      a.current?.animate([{ transform: 'translateY(38px)' }, { transform: 'none' }], opts)
      b.current?.animate([{ transform: 'translateY(-38px)' }, { transform: 'none' }], opts)
    }
  }, [startText, endText, instant])
  return (
    <div className="relative px-2.5 pb-2 pt-1">
      <div className="relative flex flex-col gap-2 pr-9">
        <span ref={startRef} className="block rounded-lg" style={{ boxShadow: s.circled ? `0 0 0 3px ${colors.danger}` : 'none', transition: 'box-shadow 420ms' }}>
          <Field ref={a} text={startText} placeholder="Choose start" blue={!t && s.here} caret={t?.caret === 'start'} icon={s.here && !t ? <Dot /> : <Ring />} />
        </span>
        <span ref={endRef} className="block">
          <Field ref={b} text={endText} placeholder="Choose destination" caret={t?.caret === 'end'} icon={<Pin />} />
        </span>
        {/* the dotted line between the two icons */}
        <span className="absolute left-[6px] top-[22px] flex h-[16px] flex-col justify-between">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-[2.5px] w-[2.5px] rounded-full" style={{ background: colors.muted }} />
          ))}
        </span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2">
          <SwapButton pulse={!!s.finger} />
        </span>
        {s.finger && (
          <span className="absolute right-[-12px] top-[38px] z-10">
            <Finger />
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-1 whitespace-nowrap text-[10.5px] font-semibold">
        {[
          { k: 'car', t: '24 min' },
          { k: 'bike', t: '18 min', on: true },
          { k: 'walk', t: '62 min' },
        ].map((m) => (
          <span key={m.k} className="flex items-center gap-1 rounded-pill px-1.5 py-[3px]" style={{ background: m.on ? colors.surface2 : 'transparent', color: m.on ? colors.brandDark : colors.body, boxShadow: m.on ? 'none' : `inset 0 0 0 1px ${colors.line}` }}>
            <ModeIcon k={m.k} />
            {m.t}
          </span>
        ))}
      </div>
    </div>
  )
}

function ModeIcon({ k }: { k: string }) {
  const p = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (k === 'car') return <svg {...p}><path d="M5 16V11l2-5h10l2 5v5M5 16h14M4 16v3h3v-3M17 16v3h3v-3" /></svg>
  if (k === 'bike') return <svg {...p}><circle cx="5.5" cy="16.5" r="3.5" /><circle cx="18.5" cy="16.5" r="3.5" /><path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 8 6h2.5M12 16.5 15 9" /></svg>
  return <svg {...p}><circle cx="13" cy="4.5" r="2" /><path d="m9 21 2.5-7L14 16v5M11.5 14l1-6-3.5 2-1 3M12.5 8l2.5 3 3 1" /></svg>
}

/** The map: blocks, roads, the two places, the route between whatever the boxes say. */
function MapView({ s, redrawKey }: { s: MapsState; redrawKey: string }) {
  const instant = useInstant()
  const typingNow = !!s.typing
  const a = typingNow ? null : s.here ? GATE : s.start
  const b = typingNow ? null : s.end
  const placeOf = (n: string | null) => (n === GATE ? P_GATE : n === HOME ? P_HOME : null)
  const pa = placeOf(a)
  const pb = placeOf(b)
  const route = pa && pb ? (pa === P_GATE ? ROUTE : [...ROUTE].reverse()) : null
  const d = route ? pathOf(route) : ''
  /* the route's arrow: a chevron at the middle of its middle leg, pointing the way it runs */
  const mid = route ? { from: route[2], to: route[3] } : null
  const up = mid ? mid.to.y < mid.from.y : true
  return (
    <svg width="100%" height="100%" viewBox="0 0 216 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="216" height="300" fill={colors.surface} />
      {/* blocks */}
      {[
        [8, 10, 70, 90],
        [118, 10, 90, 36],
        [118, 140, 90, 40],
        [8, 214, 26, 70],
        [58, 214, 150, 70],
        [8, 130, 26, 56],
        [130, 196, 70, 10],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill={colors.surface2} />
      ))}
      <rect x="60" y="20" width="44" height="80" rx="10" fill={`${colors.success}22`} />
      <path d="M 0 156 Q 70 170 120 150 T 216 168" fill="none" stroke={`${colors.info}40`} strokeWidth="9" />
      {/* roads */}
      {[
        'M 44 0 V 300',
        'M 0 196 H 216',
        'M 102 0 V 300',
        'M 0 120 H 216',
        'M 168 0 V 300',
        'M 0 62 H 216',
      ].map((r) => (
        <path key={r} d={r} stroke={colors.white} strokeWidth="7" />
      ))}
      {/* place names: they never move */}
      <text x={P_GATE.x + 10} y={P_GATE.y + 22} fontSize="11" fontWeight="700" fill={colors.body} fontFamily="Inter, system-ui, sans-serif">College Main Gate</text>
      <text x={P_HOME.x - 14} y={P_HOME.y + 18} fontSize="11" fontWeight="700" fill={colors.body} textAnchor="end" fontFamily="Inter, system-ui, sans-serif">Ameerpet</text>
      {route && (
        <g key={redrawKey}>
          <path d={d} fill="none" stroke={colors.brandDark} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path
            d={d}
            fill="none"
            stroke={colors.brand}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: 0, animation: instant ? undefined : `maps-draw 900ms ${HOUSE} both` }}
          />
          {mid && (
            <path
              d={up ? `M ${mid.from.x - 6} ${(mid.from.y + mid.to.y) / 2 + 4} l 6 -7 l 6 7` : `M ${mid.from.x - 6} ${(mid.from.y + mid.to.y) / 2 - 4} l 6 7 l 6 -7`}
              fill="none"
              stroke={colors.white}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
      )}
      {/* start: a hollow circle; end: the red pin */}
      {pa && <circle cx={pa.x} cy={pa.y} r="7" fill={colors.white} stroke={colors.ink} strokeWidth="3" />}
      {pb && (
        <g transform={`translate(${pb.x - 10} ${pb.y - 25})`}>
          <path d="M10 25s8-8.6 8-14.6A8 8 0 0 0 2 10.4C2 16.4 10 25 10 25z" fill={colors.danger} stroke={colors.white} strokeWidth="1.5" />
          <circle cx="10" cy="10.2" r="3.2" fill={colors.white} />
        </g>
      )}
    </svg>
  )
}

if (typeof document !== 'undefined' && !document.querySelector('style[data-maps-draw]')) {
  const el = document.createElement('style')
  el.dataset.mapsDraw = ''
  el.textContent = `@keyframes maps-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`
  document.head.appendChild(el)
}

/** The crash screen: a sad face and the error, in place of the map. */
function Crash({ error }: { error: string }) {
  return (
    <div className="sm-bump flex h-full flex-col items-center justify-center gap-3 px-4 text-center" style={{ background: '#FDECEC' }}>
      <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden>
        <circle cx="27" cy="27" r="24" fill={colors.white} stroke={colors.danger} strokeWidth="3" />
        <circle cx="19" cy="22" r="3" fill={colors.danger} />
        <circle cx="35" cy="22" r="3" fill={colors.danger} />
        <path d="M17 38c3-5 17-5 20 0" fill="none" stroke={colors.danger} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-[14px] font-bold" style={{ color: colors.danger }}>The app stopped</span>
      <span className="font-mono text-[11px] font-semibold leading-[15px]" style={{ color: colors.ink }}>
        {error}
      </span>
    </div>
  )
}

/**
 * The whole phone. `startRef` and `endRef` mark the two boxes, so a value can
 * fly out of them (H1's last press).
 */
export const MapsPhone = forwardRef<HTMLDivElement, { s: MapsState; width?: number; height?: number; time?: string; startRef?: React.Ref<HTMLSpanElement>; endRef?: React.Ref<HTMLSpanElement>; dim?: boolean }>(function MapsPhone(
  { s, width = 232, height = 478, time = '5:30', startRef, endRef, dim = false },
  ref,
) {
  const key = `${s.here ? 'here' : s.start}>${s.end}`
  return (
    <div ref={ref} style={{ opacity: dim ? 0.45 : 1, transition: 'opacity 480ms' }}>
      <Phone width={width} height={height} time={time} island={null} top={{ bg: colors.white, light: false, header: <Directions s={s} startRef={startRef} endRef={endRef} /> }}>
        <div className="absolute inset-0" style={{ boxShadow: `inset 0 1px 0 ${colors.line}` }}>
          {s.crash ? <Crash error={s.crash} /> : <MapView s={s} redrawKey={key} />}
        </div>
      </Phone>
    </div>
  )
})

/**
 * Types `text` one letter at a time once `go` turns true, as a person types
 * into a box. Shows the whole text at once during an instant jump.
 */
export function useTyped(text: string, go: boolean, ms = 85): string {
  const instant = useInstant()
  const [n, setN] = useState(go ? (instant ? text.length : 0) : 0)
  useEffect(() => {
    if (!go) {
      setN(0)
      return
    }
    if (instant) {
      setN(text.length)
      return
    }
    setN(0)
    let i = 0
    const t = window.setInterval(() => {
      i++
      setN(i)
      if (i >= text.length) window.clearInterval(t)
    }, ms)
    return () => window.clearInterval(t)
  }, [go, text, ms, instant])
  return text.slice(0, n)
}
