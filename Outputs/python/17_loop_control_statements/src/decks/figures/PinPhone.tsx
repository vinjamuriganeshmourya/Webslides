import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { BeatFade } from './common'
import { Back, Phone, PHONE } from './Phone'

/**
 * THE PAYMENT APP'S SCREENS, on session 15's phone, shared by the two PIN
 * frames (slides 4 and 10). Six screens: the pay sheet; the PIN keypad with
 * the four dots typed (`pin1`, `pin2`), refused (`pin1x`) or waiting for the
 * first digit (`pin3`); the receipt. World picture, so drawn as the real
 * object (course rule R5b). No bank mark (content rule 12); the bank's name
 * is the screen's own text, as the reference has it.
 *
 * `scale` draws the whole phone smaller with its proportions and its screens
 * untouched. On these two slides the phone sits on the RIGHT of the canvas,
 * where nothing may rise above y 221 (the speaker box, content rule 32), and
 * the three try cards sit under it, so the 478px phone is drawn at 0.84 to
 * leave them room (plan revision 1, decision A). The wrapper reserves the
 * scaled footprint so the layout around it measures the phone as drawn.
 */
export type Screen = 'pay' | 'pin1' | 'pin1x' | 'pin2' | 'pin3' | 'paid'

/* ------------------------------------------------------------ screens */

function BankGlyph({ size = 22, color = colors.brandDark }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" />
    </svg>
  )
}

function PaySheet() {
  return (
    <div className="absolute inset-0 flex flex-col px-3 pb-8 pt-3" style={{ background: colors.surface }}>
      <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm ring-1 ring-line">
        <p className="text-[11px] font-semibold" style={{ color: colors.muted }}>Paying</p>
        <p className="mt-0.5 text-[34px] font-bold leading-none" style={{ color: colors.ink }}>₹40</p>
        <span className="mt-2 inline-block rounded-pill px-3 py-0.5 text-[11px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>Lunch</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-line">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: colors.surface2 }}>
          <BankGlyph />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-bold leading-tight" style={{ color: colors.ink }}>State Bank of India</span>
          <span className="block text-[10px] leading-tight" style={{ color: colors.muted }}>Savings •• 4821</span>
        </span>
      </div>
      <span className="mt-auto grid h-[40px] place-items-center rounded-xl text-[13px] font-bold text-white" style={{ background: colors.brand }}>
        PAY ₹40
      </span>
    </div>
  )
}

function Keypad() {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓']
  return (
    <div className="mt-auto grid grid-cols-3 gap-x-3 gap-y-1.5 px-1">
      {keys.map((k) => (
        <span
          key={k}
          className="grid h-[34px] place-items-center rounded-lg text-[15px] font-semibold"
          style={{ background: colors.white, color: k === '✓' ? colors.brand : colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}
        >
          {k}
        </span>
      ))}
    </div>
  )
}

/**
 * The PIN keypad. `typed`: the four dots are in. `refused`: the app's red
 * line under them. Try 3 waits with the cursor in the first box.
 */
function PinPad({ attempt, typed, refused }: { attempt: 1 | 2 | 3; typed: boolean; refused: boolean }) {
  const tone = refused ? colors.danger : attempt === 3 ? colors.warning : colors.brand
  const ink = refused ? colors.danger : attempt === 3 ? colors.accentDark : colors.brandDark
  return (
    <div className="absolute inset-0 flex flex-col px-3 pb-7 pt-2" style={{ background: colors.surface }}>
      <span className="self-center rounded-pill px-3 py-0.5 text-[11px] font-bold" style={{ background: `${tone}22`, color: ink, transition: 'all 300ms ease' }}>
        Try {attempt} of 3
      </span>
      <p className="mt-2.5 text-center text-[10.5px] font-bold tracking-wide" style={{ color: colors.ink }}>ENTER 4-DIGIT UPI PIN</p>
      <div className="mt-2 flex justify-center gap-5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="relative flex h-[22px] w-[26px] items-end justify-center border-b-2" style={{ borderColor: colors.ink }}>
            {typed ? (
              <span className="mb-1 h-2.5 w-2.5 rounded-full" style={{ background: colors.ink }} />
            ) : i === 0 ? (
              <span className="mb-0.5 h-4 w-[2px]" style={{ background: colors.ink }} />
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-2 h-[26px]">
        {refused && (
          <BeatFade beatKey="refused">
            <p className="grid h-[26px] place-items-center rounded-md text-center text-[10px] font-bold" style={{ background: `${colors.danger}1A`, color: colors.danger }}>
              Incorrect UPI PIN. 2 attempts left.
            </p>
          </BeatFade>
        )}
      </div>
      <Keypad />
    </div>
  )
}

function Receipt() {
  return (
    <div className="absolute inset-0 flex flex-col items-center px-3 pb-7 pt-5 text-center" style={{ background: colors.white }}>
      <span className="grid h-[64px] w-[64px] place-items-center rounded-full" style={{ background: colors.success }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5 10 17l9-10" />
        </svg>
      </span>
      <p className="mt-3 text-[14px] font-bold" style={{ color: colors.ink }}>Payment Successful</p>
      <p className="mt-1 text-[30px] font-bold leading-none" style={{ color: colors.ink }}>₹40</p>
      <p className="mt-1.5 text-[11px]" style={{ color: colors.body }}>Paid to Ravi Canteen</p>
      <div className="mt-4 w-full rounded-xl px-3 py-2 text-left" style={{ background: colors.surface }}>
        <p className="text-[9.5px] font-semibold" style={{ color: colors.muted }}>Debited from</p>
        <p className="text-[11px] font-bold" style={{ color: colors.ink }}>State Bank of India •• 4821</p>
      </div>
      <span className="mt-auto grid h-[38px] w-full place-items-center rounded-xl text-[13px] font-bold text-white" style={{ background: colors.brand }}>
        Done
      </span>
    </div>
  )
}

function BankHeader() {
  return (
    <div className="flex items-center justify-between border-b border-line px-3 pb-2 pt-0.5">
      <span>
        <span className="block text-[11px] font-bold leading-tight" style={{ color: colors.ink }}>State Bank of India</span>
        <span className="block text-[9.5px] leading-tight" style={{ color: colors.muted }}>To: Ravi Canteen</span>
      </span>
      <span className="text-[12px] font-bold" style={{ color: colors.ink }}>₹ 40.00</span>
    </div>
  )
}

const PAY_TOP = {
  bg: colors.brandDark,
  light: true,
  header: (
    <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-0.5">
      <Back color={colors.white} />
      <span className="grid h-7 w-7 place-items-center rounded-full text-[12px] font-bold" style={{ background: colors.white, color: colors.brandDark }}>R</span>
      <span className="min-w-0">
        <span className="block text-[12px] font-bold leading-tight text-white">Ravi Canteen</span>
        <span className="block text-[9.5px] leading-tight text-white/80">ravicanteen@ybl</span>
      </span>
    </div>
  ),
}
const PIN_TOP = { bg: colors.white, light: false, header: <BankHeader /> }
const PAID_TOP = { bg: colors.white, light: false, header: <div className="h-2" /> }

const TOP: Record<Screen, { bg: string; light: boolean; header: ReactNode }> = {
  pay: PAY_TOP,
  pin1: PIN_TOP,
  pin1x: PIN_TOP,
  pin2: PIN_TOP,
  pin3: PIN_TOP,
  paid: PAID_TOP,
}

/** Which screen a `Screen` belongs to, so the refusal line fades in on the keypad instead of the whole keypad re-entering. */
function family(screen: Screen) {
  return screen === 'pin1x' ? 'pin1' : screen
}

export function PinPhone({ screen, scale = 1 }: { screen: Screen; scale?: number }) {
  return (
    <div className="shrink-0" style={{ width: Math.round(PHONE.width * scale), height: Math.round(PHONE.height * scale) }}>
      <div style={{ width: PHONE.width, height: PHONE.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <Phone time="12:48" top={TOP[screen]}>
          <BeatFade beatKey={family(screen)} className="absolute inset-0">
            {screen === 'pay' ? (
              <PaySheet />
            ) : screen === 'paid' ? (
              <Receipt />
            ) : (
              <PinPad attempt={screen === 'pin2' ? 2 : screen === 'pin3' ? 3 : 1} typed={screen !== 'pin3'} refused={screen === 'pin1x'} />
            )}
          </BeatFade>
        </Phone>
      </div>
    </div>
  )
}
