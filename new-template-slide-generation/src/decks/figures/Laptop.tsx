import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'

/**
 * A LAPTOP, drawn to the detail that makes it read as one: the screen in its
 * bezel, the hinge, and a keyboard with the three rows the hook needs, `Tab`,
 * `Caps` and `Shift` on the left. The password hook is about Caps Lock, a key a
 * phone does not have, which is why this is a laptop and not session 16's
 * `Phone` (plan decision 8).
 *
 * The wallpaper is the kit's own brand gradient. The chrome is the handset
 * near-black `Phone` uses. No maker's mark anywhere.
 */
const CHROME = '#15191F'
const ROWS = [
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
] as const

export function Laptop({ width = 350, capsOn = false, children }: { width?: number; capsOn?: boolean; children: ReactNode }) {
  const screenH = Math.round(width * 0.6)
  const tween = useTween(300)
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width }}>
      <div className="relative w-full rounded-t-2xl rounded-b-md p-[9px]" style={{ background: CHROME, height: screenH }}>
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-nw-night">{children}</div>
        <span aria-hidden className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full" style={{ background: colors.muted }} />
      </div>
      {/* the hinge */}
      <div aria-hidden className="h-[12px]" style={{ width: width + 16, background: `linear-gradient(${colors.line}, ${colors.muted}55)`, clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }} />
      {/* the keyboard */}
      <div className="flex w-full flex-col gap-[6px] rounded-b-xl px-[14px] pb-[12px] pt-[10px]" style={{ background: colors.surface2 }}>
        {ROWS.map((row, r) => (
          <div key={r} className="flex gap-[5px]">
            {row.map((k) => {
              const wide = k.length > 1
              const caps = k === 'Caps'
              return (
                <span
                  key={k}
                  className="relative grid h-[22px] place-items-center rounded-[4px] bg-white font-semibold"
                  style={{
                    width: wide ? 44 : 23,
                    fontSize: wide ? 9.5 : 10.5,
                    color: colors.ink,
                    boxShadow: caps && capsOn ? `inset 0 0 0 1.5px ${colors.success}` : `0 1px 0 ${colors.line}`,
                    transition: tween,
                  }}
                >
                  {k}
                  {caps && <span aria-hidden className="absolute right-[5px] top-[4px] h-[4px] w-[4px] rounded-full" style={{ background: capsOn ? colors.success : colors.line, transition: tween }} />}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- login */

/**
 * The login screen: avatar, name, the password field, the time. `revealed`
 * shows the characters instead of dots; `dialog` draws the refusal over it;
 * `capsNote` is the small line under the field once the eye is tapped.
 */
export function LoginScreen({
  name,
  typed,
  revealed,
  dialog,
  capsNote,
  time = '8:52 AM',
}: {
  name: string
  typed: string
  revealed: boolean
  dialog: boolean
  capsNote: boolean
  time?: string
}) {
  const tween = useTween(300)
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center text-white">
      <span className="grid h-[48px] w-[48px] place-items-center rounded-full bg-white/90">
        <svg width="30" height="30" viewBox="0 0 34 34" aria-hidden>
          <circle cx="17" cy="13" r="6.5" fill={colors.muted} />
          <path d="M5 32c1.8-7 6.6-10 12-10s10.2 3 12 10" fill={colors.muted} />
        </svg>
      </span>
      <p className="mt-2 text-[14px] font-semibold">{name}</p>
      <div className="mt-3 flex h-[26px] w-[160px] items-center rounded-[4px] bg-white pl-2 pr-1" style={{ boxShadow: `0 0 0 1.5px ${revealed ? colors.brand : 'transparent'}`, transition: tween }}>
        <span className="flex-1 font-mono text-[12px] font-bold tracking-[0.08em]" style={{ color: colors.ink }}>
          {revealed ? typed : '•'.repeat(typed.length)}
        </span>
        <svg width="14" height="12" viewBox="0 0 24 18" fill="none" stroke={colors.body} strokeWidth="2" aria-hidden>
          <path d="M1 9s4-7 11-7 11 7 11 7-4 7-11 7S1 9 1 9z" />
          <circle cx="12" cy="9" r="3" />
        </svg>
        <span className="ml-1 grid h-[20px] w-[20px] place-items-center rounded-[3px]" style={{ background: colors.brand }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <p className="mt-1.5 h-[14px] text-[10px] font-semibold" style={{ opacity: capsNote ? 1 : 0, transition: tween }}>
        Caps Lock is on
      </p>
      <span className="absolute bottom-2 right-3 text-[9px] font-semibold opacity-85">{time}</span>
      {/* the refusal */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ background: 'rgba(0,37,75,0.55)', opacity: dialog ? 1 : 0, transition: tween, pointerEvents: 'none' }}
      >
        <div className="flex w-[228px] flex-col items-center gap-2 rounded-md px-3 py-2.5" style={{ background: colors.white, color: colors.ink }}>
          <p className="text-center text-[11px] font-semibold leading-snug">The password is incorrect. Try again.</p>
          <span className="rounded-[3px] px-5 py-[3px] text-[10px] font-bold text-white" style={{ background: colors.brand }}>
            OK
          </span>
        </div>
      </div>
    </div>
  )
}
