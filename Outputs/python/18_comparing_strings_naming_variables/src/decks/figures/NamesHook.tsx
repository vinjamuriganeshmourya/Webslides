import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatList } from './BeatList'
import { Phone } from './Phone'
import { Lines } from './common'

/**
 * THE USERNAME THE APP REFUSES. PF 18 slide 17, the hook for naming rules.
 *
 * A sign-up form on a phone (session 16's `Phone`): `ravi kumar` refused,
 * `ravi@kumar` refused, `ravi_kumar` accepted. Then the same three names as
 * Python variables: Python refuses the first, accepts the second, and refuses
 * `1ravi`, which the app would have taken. Five beats, the reference's own.
 *
 * The app is named in the captions, which are the reference's sentences
 * (course rule R2), and nowhere on the screen: no logo, no wordmark (course
 * rule R5, plan decision 9). The form is a form.
 */
const SCREENS = [
  { name: 'ravi kumar', ok: false },
  { name: 'ravi@kumar', ok: false },
  { name: 'ravi_kumar', ok: true },
]

/* Content rule 36: one sentence per line. */
const BEATS = [
  { label: <Lines lines={['You sign up for Instagram', 'You type ravi kumar']} /> },
  { label: <Lines lines={['You try ravi@kumar', 'Still refused. What is allowed?']} /> },
  { label: <Lines lines={['ravi_kumar works', 'Instagram has rules for names']} /> },
  { label: <>Python has rules for the names you give variables</> },
  { label: <Lines lines={['Instagram takes 1ravi', 'Python does not. Python is stricter']} /> },
]

const STRIPS = [
  { code: 'ravi kumar = 18', says: 'SyntaxError: invalid syntax', ok: false, at: 4 },
  { code: 'ravi_kumar = 18', says: 'Python accepts it', ok: true, at: 4 },
  { code: '1ravi = 18', says: 'SyntaxError: invalid decimal literal', ok: false, at: 5 },
]

const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

function SignUp({ name, ok, dim }: { name: string; ok: boolean; dim: boolean }) {
  const tween = useTween(360)
  return (
    <div className="flex h-full flex-col" style={{ opacity: dim ? 0.45 : 1, transition: tween }}>
      <div className="flex-1 px-3 pt-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        <p className="mt-3 font-heading text-[15px] font-bold leading-tight" style={{ color: colors.ink }}>Create a username</p>
        <p className="mt-1 text-[8.5px] leading-snug" style={{ color: colors.body }}>
          Add a username or use our suggestion.
          <br />
          You can change this at any time.
        </p>
        <div className="mt-2.5 flex items-center rounded-md px-2 py-1" style={{ border: `1.5px solid ${ok ? colors.line : colors.danger}`, transition: tween }}>
          <div className="flex-1 leading-tight">
            <p className="text-[7.5px]" style={{ color: colors.muted }}>Username</p>
            <p className="font-mono text-[11.5px] font-bold" style={{ color: colors.ink }}>{name}</p>
          </div>
          {ok ? (
            <span className="grid h-4 w-4 place-items-center rounded-full" style={{ background: colors.success }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12l5 5L20 6" />
              </svg>
            </span>
          ) : (
            <span className="grid h-4 w-4 place-items-center rounded-full font-bold" style={{ border: `1.5px solid ${colors.danger}`, color: colors.danger, fontSize: 10 }}>
              !
            </span>
          )}
        </div>
        <p className="mt-1 h-[22px] text-[7.5px] leading-snug" style={{ color: colors.danger, opacity: ok ? 0 : 1, transition: tween }}>
          Usernames can only use letters,
          <br />
          numbers, underscores and periods.
        </p>
        <span className="mt-1 block rounded-md py-1.5 text-center text-[10px] font-bold text-white" style={{ background: ok ? colors.brand : `${colors.brand}66`, transition: tween }}>
          Next
        </span>
      </div>
      {/* the keyboard */}
      <div className="flex flex-col items-center gap-[4px] px-1.5 pb-5 pt-2" style={{ background: colors.surface2 }}>
        {KEYS.map((row) => (
          <div key={row} className="flex gap-[3px]">
            {[...row].map((k) => (
              <span key={k} className="grid h-[20px] w-[16px] place-items-center rounded-[3px] bg-white text-[9px] font-medium" style={{ color: colors.ink, boxShadow: `0 1px 0 ${colors.line}` }}>
                {k}
              </span>
            ))}
          </div>
        ))}
        <span className="mt-[2px] grid h-[20px] w-[110px] place-items-center rounded-[3px] bg-white text-[8px] font-medium" style={{ color: colors.ink, boxShadow: `0 1px 0 ${colors.line}` }}>
          space
        </span>
      </div>
    </div>
  )
}

export function NamesHook() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const s = SCREENS[Math.min(beat, 3) - 1]
  return (
    <>
      <div className="flex items-start gap-8">
        <div style={{ marginTop: -24 }}>
          <Phone width={200} height={412} time="9:41" island={{ w: 54, h: 18 }} top={{ bg: colors.white, light: false, header: null }}>
            <SignUp name={s.name} ok={s.ok} dim={beat >= 4} />
          </Phone>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <BeatList beats={BEATS} at={beat - 1} numbered compact />
        </div>
        <div className="flex w-[330px] shrink-0 flex-col gap-2.5">
          {STRIPS.map((st) => {
            const on = beat >= st.at
            return (
              <div
                key={st.code}
                className="flex flex-col gap-1 rounded-xl bg-white px-4 py-2.5"
                style={{ border: `1.5px solid ${on ? (st.ok ? colors.success : colors.danger) : colors.line}`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween, boxShadow: '0 6px 24px -10px rgba(0,37,75,0.16)' }}
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-md px-2 py-0.5 text-[12px] font-bold uppercase tracking-wider" style={{ background: colors.surface2, color: colors.body }}>
                    Python
                  </span>
                  <span className="font-mono text-[18px] font-bold" style={{ color: colors.ink }}>{st.code}</span>
                </span>
                <span className="text-[16px] font-bold" style={{ color: st.ok ? '#137A3A' : colors.danger }}>{st.says}</span>
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
