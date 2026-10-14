import type { ReactNode, Ref } from 'react'
import { LiveClock, Phone } from './Phone'

/**
 * A UPI PAYMENT APP, drawn as the real thing (course rules R5, R5b) and named
 * nowhere: no product name and no logo (content rule 12). The spec asks for
 * "PhonePe's look"; what makes it recognisable is the purple header, the
 * green tick screen and the transaction details layout, so that is what is
 * drawn. These are the screen's own colours, not brand tokens (rule 37
 * allows a drawn screen its own). The phones have no island (24's rule).
 *
 * Every amount, name and time is the spec's H1 data.
 */
export const UPI = {
  top: '#5F259F',
  topSoft: '#F3EEFA',
  ok: '#1E9E5A',
  ink: '#1F1A2B',
  soft: '#6B6478',
  line: '#E7E2EE',
  in: '#1E9E5A',
} as const

export const PHONE_W = 196

const TAP_CSS = `
.upi-pay { animation: upi-press 2.4s cubic-bezier(0.22,1,0.36,1) infinite; }
@keyframes upi-press { 0%, 62%, 100% { transform: scale(1); } 70% { transform: scale(0.96); } 82% { transform: scale(1); } }
.upi-tap-dot { position: absolute; left: -9px; top: -9px; width: 18px; height: 18px; border-radius: 9999px; background: rgba(255,255,255,0.85); box-shadow: 0 0 0 2px rgba(95,37,159,0.35); animation: upi-dot 2.4s cubic-bezier(0.22,1,0.36,1) infinite; }
.upi-tap-ring { position: absolute; left: -9px; top: -9px; width: 18px; height: 18px; border-radius: 9999px; border: 2px solid rgba(255,255,255,0.9); opacity: 0; animation: upi-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite; }
.upi-tap-ring2 { animation-delay: 0.18s; }
@keyframes upi-dot { 0%, 58% { transform: scale(0.6); opacity: 0; } 68% { transform: scale(1); opacity: 1; } 90%, 100% { transform: scale(1); opacity: 0; } }
@keyframes upi-ring { 0%, 66% { transform: scale(1); opacity: 0; } 70% { opacity: 0.9; } 100% { transform: scale(3.2); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .upi-pay, .upi-tap-dot, .upi-tap-ring { animation: none; } .upi-tap-dot { opacity: 1; transform: none; } }
`
if (typeof document !== 'undefined' && !document.querySelector('style[data-upi-tap]')) {
  const el = document.createElement('style')
  el.dataset.upiTap = ''
  el.textContent = TAP_CSS
  document.head.appendChild(el)
}
/* a real handset's outline, 1 : 2.06 (generate-slides 2b, item 13) */
export const PHONE_H = 404

function Header({ title }: { title: string }) {
  return (
    <div className="flex h-[40px] items-center gap-2 px-3" style={{ background: UPI.top }}>
      <svg width="10" height="16" viewBox="0 0 14 22" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 3 3 11l8 8" />
      </svg>
      <span key={title} className="sm-bump whitespace-nowrap text-[13px] font-semibold text-white">
        {title}
      </span>
    </div>
  )
}

/** The phone itself, with the app's purple status strip. */
export function UpiPhone({ title, children, light = true }: { title?: string; children: ReactNode; light?: boolean }) {
  return (
    <Phone width={PHONE_W} height={PHONE_H} island={null} time={<LiveClock />} top={{ bg: light ? UPI.top : '#FFFFFF', light, header: title ? <Header title={title} /> : null }}>
      {children}
    </Phone>
  )
}

/** The shop's round initial, as the app draws a payee. */
export function Payee({ letter = 'S', size = 34 }: { letter?: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, fontSize: size * 0.42, background: '#E2803B' }}>
      {letter}
    </span>
  )
}

/** Press 1: the amount pad after scanning the canteen's QR. */
export function PayPad({ amount }: { amount: number }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']
  return (
    <div className="flex h-full flex-col items-center px-3 pt-3" style={{ background: '#FFFFFF' }}>
      <Payee />
      <span className="mt-1.5 text-[13px] font-semibold" style={{ color: UPI.ink }}>
        Sri Sai Canteen
      </span>
      <span className="mt-2 font-heading text-[30px] font-bold leading-none" style={{ color: UPI.ink }}>
        ₹{amount}
      </span>
      <span className="mt-1 h-px w-[90px]" style={{ background: UPI.line }} />
      <div className="mt-3 grid w-full grid-cols-3 gap-x-2 gap-y-1">
        {keys.map((k, i) => (
          <span key={i} className="grid h-[26px] place-items-center text-[15px] font-semibold" style={{ color: UPI.ink }}>
            {k}
          </span>
        ))}
      </div>
      {/* Pay, being tapped: a touch point on the button and two rings spreading from it,
          the way a phone shows a tap. No drawn hand (review, 2026-10-08). */}
      <span className="upi-pay relative mt-2 grid h-[34px] w-full place-items-center overflow-visible rounded-lg text-[14px] font-bold text-white" style={{ background: UPI.top }}>
        Pay
        <span aria-hidden className="pointer-events-none absolute right-7 top-1/2 h-0 w-0">
          <span className="upi-tap-dot" />
          <span className="upi-tap-ring" />
          <span className="upi-tap-ring upi-tap-ring2" />
        </span>
      </span>
    </div>
  )
}

/** Press 2: the green tick. */
export function Success({ amount, time }: { amount: number; time: string }) {
  return (
    <div className="flex h-full flex-col items-center px-3 pt-8" style={{ background: UPI.ok }}>
      <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-white">
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 12.5 10 17.5 19 7" fill="none" stroke={UPI.ok} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="mt-3 text-[15px] font-bold text-white">Payment Successful</span>
      <span className="mt-3 font-heading text-[32px] font-bold leading-none text-white">₹{amount}</span>
      <span className="mt-3 text-[13px] font-semibold text-white">to Sri Sai Canteen</span>
      <span className="mt-1 text-[12px] font-medium text-white/85">{time}</span>
    </div>
  )
}

/** Press 3: the transaction details. Only Share and Help at the bottom, as in the real app: no Edit. */
export function Details({ amount, time, rowRef }: { amount: number; time: string; rowRef?: Ref<HTMLDivElement> }) {
  return (
    <div className="flex h-full flex-col" style={{ background: UPI.topSoft }}>
      <div className="m-2 flex flex-col gap-2 rounded-xl bg-white p-3" ref={rowRef}>
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: UPI.soft }}>
          Paid to
        </span>
        <span className="flex items-center gap-2">
          <Payee size={28} />
          <span className="text-[13px] font-bold" style={{ color: UPI.ink }}>
            Sri Sai Canteen
          </span>
        </span>
        <span className="font-heading text-[26px] font-bold leading-none" style={{ color: UPI.ink }}>
          ₹{amount}
        </span>
        <span className="text-[12px] font-medium" style={{ color: UPI.soft }}>
          {time}
        </span>
      </div>
      <div className="mx-2 flex flex-col gap-1 rounded-xl bg-white p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: UPI.soft }}>
          UPI transaction ID
        </span>
        <span className="font-mono text-[12px] font-semibold" style={{ color: UPI.ink }}>
          428519376620
        </span>
      </div>
      <div className="mt-auto flex gap-2 p-2 pb-5">
        {['Share', 'Help'].map((b) => (
          <span key={b} className="grid h-[32px] flex-1 place-items-center rounded-lg bg-white text-[13px] font-bold" style={{ color: UPI.top, boxShadow: `inset 0 0 0 1.5px ${UPI.line}` }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  )
}

/** One History row: who, when, and the amount, green when it came in. */
export function HistoryRow({ label, who, amount, time, incoming, rowRef, fresh }: { label: string; who: string; amount: number; time: string; incoming?: boolean; rowRef?: Ref<HTMLDivElement>; fresh?: boolean }) {
  return (
    <div ref={rowRef} className={`flex flex-col rounded-xl bg-white px-3 py-2 ${fresh ? 'sm-rise' : ''}`} style={{ boxShadow: `inset 0 0 0 1px ${UPI.line}` }}>
      <span className="text-[11px] font-semibold" style={{ color: UPI.soft }}>
        {label}
      </span>
      <span className="whitespace-nowrap text-[13px] font-bold" style={{ color: UPI.ink }}>
        {who}
      </span>
      <span className="mt-0.5 flex items-baseline justify-between">
        <span className="text-[11px] font-medium" style={{ color: UPI.soft }}>
          {time}
        </span>
        <span className="text-[15px] font-bold" style={{ color: incoming ? UPI.in : UPI.ink }}>
          {incoming ? '+' : ''}₹{amount}
        </span>
      </span>
    </div>
  )
}

/** A History list. */
export function History({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-2 px-2 pt-2" style={{ background: UPI.topSoft }}>
      {children}
    </div>
  )
}
