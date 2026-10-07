import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'
import { Lines } from './common'

/**
 * FOUR RULES FOR A VARIABLE NAME. PF 18 slide 19.
 *
 * One rule per two presses: the rule lights and Anu offers four box names;
 * the next press marks them, and the Computer says which it refuses and why.
 * Every rule stays on screen once shown (the list is the lesson), and the
 * four names are the reference's own.
 */
const RULES = [
  { title: 'Use only letters, digits and _', sub: ['A to Z, a to z, 0 to 9, and the underscore _'] },
  { title: 'No spaces, commas or special characters', sub: ['like ~ ! @ # $ % ^ . ?'] },
  { title: 'Begin with a letter or _', sub: ['never with a digit'] },
  { title: 'Do not use a keyword', sub: ['like while', 'Python keeps those for itself'] },
]

const NAMES: { name: string; ok: boolean }[][] = [
  [{ name: 'age', ok: true }, { name: 'input_1', ok: true }, { name: 'high_score', ok: true }, { name: '_counter2', ok: true }],
  [{ name: 'left', ok: true }, { name: 'start_playing', ok: true }, { name: 'read, write & learn', ok: false }],
  [{ name: 'left', ok: true }, { name: '_player1', ok: true }, { name: 'Height_in_feet', ok: true }, { name: '1_player', ok: false }],
  [{ name: 'move', ok: true }, { name: '_player1', ok: true }, { name: '_if', ok: true }, { name: 'while', ok: false }],
]

const ANU: ReactNode[] = [
  <>I want names for my boxes<br />Can I use these?</>,
  <>What about spaces and commas?</>,
  <>Can a name begin with a digit?</>,
  <>Can I call my box <b>while</b>?</>,
]
const PC: ReactNode[] = [
  <>Yes. Letters, digits and _ are all fine</>,
  <>No spaces, no commas, no &amp;<br />I refuse the last</>,
  <><b>1_player</b> begins with a digit<br />I refuse it</>,
  <><b>while</b> is my own word<br />It is a keyword</>,
]

function Mark({ ok, on }: { ok: boolean; on: boolean }) {
  const tween = useTween(360)
  return (
    <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full" style={{ background: ok ? colors.success : colors.danger, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.7)', transition: tween }}>
      {ok ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 12l5 5L20 6" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" aria-hidden>
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      )}
    </span>
  )
}

export function Rules() {
  const beat = useBeats(8)
  const tween = useTween(420)
  const ri = Math.floor((beat - 1) / 2)
  const marked = beat % 2 === 0
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[470px] shrink-0 flex-col gap-2.5">
          {RULES.map((r, k) => {
            const on = k <= ri
            const now = k === ri
            return (
              <div
                key={r.title}
                className="flex min-h-[64px] items-center gap-3 rounded-2xl px-3.5 py-2"
                style={{
                  background: on ? colors.white : 'rgba(255,255,255,0.5)',
                  border: `2px ${on ? 'solid' : 'dashed'} ${now ? colors.brand : colors.line}`,
                  boxShadow: now ? `0 0 0 3px ${colors.brand}22` : on ? '0 6px 24px -10px rgba(0,37,75,0.16)' : 'none',
                  transition: tween,
                }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[16px] font-bold text-white" style={{ background: colors.brandDark, opacity: on ? 1 : 0, transition: tween }}>
                  {k + 1}
                </span>
                <div className="leading-tight" style={{ opacity: on ? 1 : 0, transition: tween }}>
                  <p className="text-[17px] font-bold" style={{ color: colors.ink }}>{r.title}</p>
                  <p className="text-[16px]" style={{ color: colors.body }}><Lines lines={r.sub} /></p>
                </div>
              </div>
            )
          })}
          <div className="pt-1">
            <Speaker who="anu" say={marked ? undefined : ANU[ri]} beatKey={beat} height={116} bubbleWidth={290} size={17} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3" key={ri}>
            {NAMES[ri].map((n) => (
              <div key={n.name} className="relative rounded-2xl px-4 pb-3 pt-2.5" style={{ background: '#FFF4EC', border: `1.5px solid ${colors.accent}` }}>
                <p className="text-[16px] font-bold" style={{ color: colors.accentDark }}>box name</p>
                <p className="mt-1 rounded-lg bg-white px-3 py-1.5 text-center font-mono text-[19px] font-bold" style={{ color: colors.ink, border: `1px solid ${colors.accent}66` }}>
                  {n.name}
                </p>
                <Mark ok={n.ok} on={marked} />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Speaker who="computer" look="3d" say={marked ? PC[ri] : undefined} mood={marked && NAMES[ri].some((n) => !n.ok) ? 'no' : 'smile'} beatKey={beat} height={116} bubbleWidth={250} size={17} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={8} />
    </>
  )
}
