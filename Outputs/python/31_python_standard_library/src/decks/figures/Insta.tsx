import { type ReactNode, type Ref } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { LiveClock, Phone } from './Phone'
import { Face } from './people'

/**
 * A PHOTO-SHARING APP, drawn as the real thing (course rules R5, R5b; spec H1's
 * play line: "the gradient story ring, the dark story screen, the white viewer
 * sheet") and named nowhere: no product name, no wordmark, no logo (content
 * rule 12). These are the screen's own colours, inside the phone only (rule
 * 37 allows a drawn screen its own). Phones at 1 : 2.06 with a live clock and
 * no island (2b item 13, 24's rule).
 *
 * The viewer sheet looks as it does in the real app: the eye icon with the
 * count, one row per person. The app never shows a count of opens (H1's must
 * lines): the log of opens is a card beside the phone, never on it.
 */
export const IG = {
  ring: 'conic-gradient(from 200deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5, #FEDA75)',
  ink: '#111111',
  soft: '#737373',
  line: '#DBDBDB',
  story: '#121212',
  sheet: '#FFFFFF',
} as const

export const PHONE_W = 196
export const PHONE_H = 404

export function AppPhone({ dark = false, children }: { dark?: boolean; children: ReactNode }) {
  return (
    <Phone width={PHONE_W} height={PHONE_H} island={null} time={<LiveClock />} top={{ bg: dark ? IG.story : '#FFFFFF', light: dark, header: null }}>
      {children}
    </Phone>
  )
}

/** A face inside the story ring. `lit` draws the gradient ring; off, a grey hairline. */
export function Ring({ name, size = 46, lit = true, draw = false }: { name: string; size?: number; lit?: boolean; draw?: boolean }) {
  const instant = useInstant()
  return (
    <span className="relative grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full" style={{ background: '#DBDBDB' }} />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: IG.ring }}
        initial={draw && !instant ? { opacity: 0, rotate: -120, scale: 0.86 } : false}
        animate={{ opacity: lit ? 1 : 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="relative grid place-items-center rounded-full bg-white" style={{ width: size - 5, height: size - 5 }}>
        <Face name={name} size={size - 9} />
      </span>
    </span>
  )
}

/** The feed: the app's top icons, the stories row with Teja's ring, the top of a post. */
export function Feed({ lit, draw }: { lit: boolean; draw?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[34px] items-center justify-between px-3">
        <span className="h-[14px] w-[64px] rounded-full" style={{ background: '#EFEFEF' }} />
        <span className="flex items-center gap-2.5">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={IG.ink} strokeWidth="2" aria-hidden>
            <path d="M12 21s-7.5-4.6-9.4-9.1C1.3 8.6 3.4 5 7 5c2.2 0 3.6 1.2 5 3 1.4-1.8 2.8-3 5-3 3.6 0 5.7 3.6 4.4 6.9C19.5 16.4 12 21 12 21z" />
          </svg>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={IG.ink} strokeWidth="2" aria-hidden>
            <path d="M3 11.5 21 3l-8.5 18-2-7.5z" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div className="flex gap-2.5 px-2.5 pb-2 pt-1">
        {(['Teja', 'Ravi', 'Anu'] as const).map((n, i) => (
          <span key={n} className="flex flex-col items-center gap-1">
            <Ring name={n} size={48} lit={i === 0 ? lit : true} draw={i === 0 && draw} />
            <span className="text-[10px] font-medium" style={{ color: IG.ink }}>
              {i === 0 ? 'Your story' : n.toLowerCase()}
            </span>
          </span>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: '#EFEFEF' }} />
      <div className="flex items-center gap-2 px-2.5 py-2">
        <Face name="Kiran" size={24} />
        <span className="text-[11px] font-semibold" style={{ color: IG.ink }}>
          kiran
        </span>
      </div>
      <div className="mx-0 flex-1" style={{ background: 'linear-gradient(160deg, #F3E9DC, #E7D3BC)' }} />
    </div>
  )
}

/** Teja's photo: a plate of Maggi on the canteen table. Drawn, not a stock image. */
export function Maggi({ w = 172, h = 214 }: { w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 172 214" aria-label="A plate of Maggi on a table" role="img">
      <defs>
        <linearGradient id="pf27-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A5A3B" />
          <stop offset="1" stopColor="#5E3A24" />
        </linearGradient>
        <radialGradient id="pf27-plate" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0.6" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6E9EE" />
        </radialGradient>
      </defs>
      <rect width="172" height="214" fill="url(#pf27-table)" />
      {[38, 82, 126, 170].map((y) => (
        <path key={y} d={`M0 ${y} C 50 ${y - 6} 110 ${y + 6} 172 ${y - 2}`} stroke="#4C2E1C" strokeOpacity="0.35" strokeWidth="1.4" fill="none" />
      ))}
      <ellipse cx="86" cy="116" rx="70" ry="58" fill="#000" opacity="0.25" />
      <ellipse cx="86" cy="110" rx="70" ry="58" fill="url(#pf27-plate)" />
      <ellipse cx="86" cy="110" rx="50" ry="40" fill="#F4F4F2" />
      <g stroke="#F2B53A" strokeWidth="4.2" fill="none" strokeLinecap="round">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${48 + i * 4} ${92 + (i % 3) * 9} c 8 -10 14 10 22 0 s 14 10 22 0 s 12 8 ${16 - i} 0`} stroke={i % 2 ? '#E9A62C' : '#F7C64A'} />
        ))}
      </g>
      {[
        [64, 100, '#3FA34D'],
        [98, 118, '#E8572A'],
        [110, 96, '#3FA34D'],
        [78, 124, '#E8572A'],
        [92, 104, '#3FA34D'],
      ].map(([x, y, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r="3.4" fill={c as string} />
      ))}
      <g stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M70 58 c -6 -8 6 -12 0 -20" />
        <path d="M88 52 c -6 -8 6 -12 0 -20" />
        <path d="M106 58 c -6 -8 6 -12 0 -20" />
      </g>
    </svg>
  )
}

function Eye({ color = IG.ink, size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-label="seen by" role="img">
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

/** Teja's own story, open: dark screen, the progress bar, the photo, `Seen by` at the bottom. */
export function Story({ children, tap = false, seenRef, owner, covered = false }: { children?: ReactNode; tap?: boolean; seenRef?: Ref<HTMLSpanElement>; /** someone else's view of Teja's story: his name in the header, no Seen by */ owner?: string; /** the viewer sheet is over the bottom: Seen by is under it */ covered?: boolean }) {
  return (
    <div className="relative flex h-full flex-col" style={{ background: IG.story }}>
      <div className="mx-2.5 mt-1 h-[2.5px] rounded-full" style={{ background: 'rgba(255,255,255,0.9)' }} />
      <div className="flex items-center gap-2 px-2.5 py-2">
        <Face name="Teja" size={24} />
        <span className="text-[11px] font-semibold text-white">{owner ? owner.toLowerCase() : 'Your story'}</span>
        <span className="text-[10.5px] text-white/60">now</span>
      </div>
      <div className="mx-auto overflow-hidden rounded-xl">
        <Maggi w={172} h={226} />
      </div>
      <div className="flex flex-1 items-end px-3 pb-4" style={{ visibility: owner || covered ? 'hidden' : undefined }}>
        <span ref={seenRef} className={`relative flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold text-white ${tap ? 'ig-tap' : ''}`}>
          <Eye color="#FFFFFF" size={15} />
          Seen by
        </span>
      </div>
      {children}
    </div>
  )
}

const TAP_CSS = `
.ig-tap { animation: ig-tap 1.8s cubic-bezier(0.22,1,0.36,1) infinite; }
@keyframes ig-tap { 0%, 100% { background-color: rgba(255,255,255,0); box-shadow: 0 0 0 0 rgba(255,255,255,0); } 45% { background-color: rgba(255,255,255,0.22); box-shadow: 0 0 0 2px rgba(255,255,255,0.75); } }
@media (prefers-reduced-motion: reduce) { .ig-tap { animation: none; background-color: rgba(255,255,255,0.22); } }
`
if (typeof document !== 'undefined' && !document.querySelector('style[data-ig-tap]')) {
  const el = document.createElement('style')
  el.dataset.igTap = ''
  el.textContent = TAP_CSS
  document.head.appendChild(el)
}

/**
 * The viewer sheet, sliding up over the story: the eye icon with the count,
 * one row per person. `rowRefs` let a name lift off the sheet (H1's last press).
 */
export function ViewerSheet({ names, open, slideIn = false, rowRefs, lit }: { names: string[]; open: boolean; /** it mounts below the screen and slides up (the press that opens it) */ slideIn?: boolean; rowRefs?: (name: string, el: HTMLDivElement | null) => void; lit?: boolean }) {
  const instant = useInstant()
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-white px-3 pb-6 pt-2"
      style={{ height: 232, boxShadow: '0 -10px 24px -12px rgba(0,0,0,0.45)' }}
      initial={slideIn && !instant ? { y: 250 } : false}
      animate={{ y: open ? 0 : 250 }}
      transition={{ duration: instant ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="mx-auto mb-2 block h-[4px] w-[36px] rounded-full" style={{ background: IG.line }} />
      <div className="flex items-center gap-1.5 border-b pb-2" style={{ borderColor: '#EFEFEF' }}>
        <Eye size={17} />
        <span className="text-[15px] font-bold" style={{ color: IG.ink }}>
          {names.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 pt-2.5">
        {names.map((n) => (
          <div key={n} ref={(el) => rowRefs?.(n, el)} className="flex items-center gap-2.5 rounded-lg px-1 py-0.5" style={{ background: lit ? 'rgba(11,95,255,0.08)' : 'transparent', transition: 'background-color 420ms' }}>
            <Face name={n} size={30} />
            <span className="text-[13px] font-semibold" style={{ color: IG.ink }}>
              {n.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
