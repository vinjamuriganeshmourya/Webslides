import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatFade } from './common'
import { Phone, PHONE_LIFT } from './Phone'
import { Kw, PlanBox, StoryBeats } from './pieces'

/**
 * A REEL YOU SWIPE AWAY. PF 17 slide 14, the hook for continue, five beats.
 *
 * A reels feed on a phone: reel 1 plays out, reel 2 is swiped away at 0:03,
 * reel 3 starts, and the feed is still open. The room sees that skipping one
 * item is not the same as leaving the feed, which is the whole difference
 * between continue and break, before the word arrives. Beat 5 is the plan,
 * with the one arrow that goes back to the top.
 *
 * World picture, drawn as the real object (course rule R5b): the reel, its
 * caption pill, the action rail, the handle and Follow, the nav bar. No
 * product mark or glyph is copied (content rule 12); the feed's name is in
 * the beat's own sentence, where the reference has it. Colours are tokens:
 * each reel's ground is built from the kit's palette.
 */

type ReelId = 0 | 1 | 2

const REELS: { handle: string; initial: string; caption: string; length: string; pill?: string; ground: [string, string] }[] = [
  { handle: 'cricket.daily', initial: 'C', caption: 'Last over, 6 needed', length: '0:15', pill: '6 needed off 1 ball', ground: [colors.night2, colors.tealDark] },
  { handle: 'hostel.kitchen', initial: 'H', caption: '5 minute Maggi hack', length: '0:20', pill: '5 MINUTE MAGGI HACK', ground: [colors.accentDark, colors.warning] },
  { handle: 'funny.pets', initial: 'F', caption: 'Cat meets cucumber', length: '0:12', ground: [colors.brandDark, colors.brand] },
]

/* The three pictures, as simple shapes in token colours. */
function Picture({ id }: { id: ReelId }) {
  if (id === 0)
    return (
      <svg viewBox="0 0 120 140" width="120" height="140" aria-hidden>
        <ellipse cx="60" cy="118" rx="52" ry="12" fill={colors.success} opacity="0.55" />
        <rect x="52" y="30" width="16" height="78" rx="6" fill={colors.accent} />
        <rect x="56" y="18" width="8" height="18" rx="3" fill={colors.white} opacity="0.85" />
        <circle cx="92" cy="70" r="8" fill={colors.danger} />
      </svg>
    )
  if (id === 1)
    return (
      <svg viewBox="0 0 140 120" width="140" height="120" aria-hidden>
        <ellipse cx="70" cy="70" rx="58" ry="26" fill={colors.ink} />
        <path d="M30 62c10-10 20 10 30 0s20 10 30 0 20 10 30 0" fill="none" stroke={colors.warning} strokeWidth="5" strokeLinecap="round" />
        <path d="M38 56c10-10 20 10 30 0s20 10 30 0" fill="none" stroke={colors.white} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M40 104c6-10 14-10 20 0M74 104c6-10 14-10 20 0" fill={colors.accent} />
      </svg>
    )
  return (
    <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden>
      <path d="M38 36 48 70h44l10-34-20 14H58z" fill={colors.accent} />
      <circle cx="70" cy="78" r="36" fill={colors.accent} />
      <circle cx="58" cy="74" r="4" fill={colors.ink} />
      <circle cx="82" cy="74" r="4" fill={colors.ink} />
      <path d="M64 88q6 6 12 0" fill="none" stroke={colors.ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="112" width="60" height="14" rx="7" fill={colors.success} />
    </svg>
  )
}

function Rail() {
  const stroke = colors.white
  return (
    <div className="absolute bottom-[58px] right-2 flex flex-col items-center gap-3 text-white">
      <span className="flex flex-col items-center gap-0.5 text-[9px] font-bold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" aria-hidden>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
        12.4K
      </span>
      <span className="flex flex-col items-center gap-0.5 text-[9px] font-bold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" aria-hidden>
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" />
        </svg>
        231
      </span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={stroke} aria-hidden>
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    </div>
  )
}

function NavBar() {
  const s = { stroke: colors.white, strokeWidth: 2, fill: 'none' } as const
  return (
    <div className="flex h-[44px] items-center justify-around px-3" style={{ background: colors.ink }}>
      <svg width="20" height="20" viewBox="0 0 24 24" {...s} aria-hidden><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" {...s} aria-hidden><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" {...s} aria-hidden><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M10 9v6l5-3z" fill={colors.white} /></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" {...s} aria-hidden><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
      <span className="h-5 w-5 rounded-full" style={{ background: colors.brand }} />
    </div>
  )
}

function ReelScreen({ id, progress, swipe }: { id: ReelId; progress: number; swipe: boolean }) {
  const r = REELS[id]
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden" style={{ background: `linear-gradient(180deg, ${r.ground[0]} 0%, ${r.ground[1]} 100%)` }}>
        {r.pill && (
          <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-bold" style={{ background: id === 1 ? colors.white : 'rgba(8,16,38,0.55)', color: id === 1 ? colors.accentDark : colors.white }}>
            {r.pill}
          </span>
        )}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
          <Picture id={id} />
        </div>
        {swipe && (
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 flex flex-col items-center">
            <svg width="26" height="40" viewBox="0 0 26 40" fill="none" stroke={colors.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13 36V6M5 14l8-8 8 8" />
            </svg>
            <span className="mt-1 h-7 w-7 rounded-full" style={{ background: 'rgba(255,255,255,0.35)', boxShadow: `0 0 0 2px ${colors.white}` }} />
          </div>
        )}
        <Rail />
        <div className="absolute bottom-3 left-3 right-14 text-white">
          <p className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold" style={{ background: colors.white, color: colors.ink }}>{r.initial}</span>
            <span className="text-[11px] font-bold">{r.handle}</span>
            <span className="rounded-md px-1.5 py-px text-[9px] font-bold" style={{ boxShadow: `inset 0 0 0 1px ${colors.white}` }}>Follow</span>
          </p>
          <p className="mt-1 text-[10.5px] font-semibold">{r.caption}</p>
          <p className="mt-0.5 text-[9.5px] opacity-85">♫ original audio</p>
        </div>
        <span className="absolute bottom-0 left-0 h-[3px]" style={{ width: `${progress * 100}%`, background: colors.white }} />
      </div>
      <NavBar />
    </div>
  )
}

/* -------------------------------------------------------------- beats */

const BEATS: ReactNode[][] = [
  ['Instagram Reels', 'Reel 1 plays all the way to the end'],
  ['Reel 2 starts', 'At 0:03 you do not like it'],
  ['You swipe up', 'The rest of reel 2 never plays', 'Reel 3 starts'],
  ['Did the feed stop? No', 'Only reel 2 was cut short'],
  ['Skip the rest of this one', 'Go back to the top for the next'],
]

type TileState = 'wait' | 'playing' | 'cut' | 'done'

interface Tile {
  state: TileState
  fill: number
  text: string
}

function tilesAt(beat: number): Tile[] {
  const r1: Tile = { state: 'done', fill: 1, text: 'watched to the end' }
  const r2: Tile = beat >= 3 ? { state: 'cut', fill: 0.15, text: 'rest of it never played' } : beat === 2 ? { state: 'playing', fill: 0.15, text: 'playing, 0:03' } : { state: 'wait', fill: 0, text: 'not yet' }
  const r3: Tile = beat >= 4 ? { state: 'done', fill: 1, text: 'watched to the end' } : beat === 3 ? { state: 'playing', fill: 0.06, text: 'playing from 0:00' } : { state: 'wait', fill: 0, text: 'not yet' }
  return [r1, r2, r3]
}

const TONE: Record<TileState, string> = { wait: colors.muted, playing: colors.accentDark, cut: colors.danger, done: colors.success }

const LOG: { at: number; text: string; color: string; weight?: number }[] = [
  { at: 1, text: 'Reel 1: watched to the end', color: colors.success },
  { at: 2, text: 'Reel 2: swiped away at 0:03', color: colors.accentDark },
  { at: 3, text: 'Reel 3: starts from 0:00', color: colors.body },
  { at: 4, text: 'The app is still open. The feed carries on', color: colors.success, weight: 700 },
  { at: 4, text: 'Closing the app would stop the whole feed', color: colors.muted },
]

export function ReelHook() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const reel: ReelId = beat === 1 ? 0 : beat === 2 ? 1 : 2
  const progress = beat === 1 ? 1 : beat === 2 ? 0.15 : beat === 3 ? 0.06 : 1
  const r = REELS[reel]
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="shrink-0" style={{ marginTop: -PHONE_LIFT, opacity: beat === 5 ? 0.45 : 1, transition: tween }}>
          <Phone
            time="9:41"
            top={{
              bg: r.ground[0],
              light: true,
              header: (
                <div className="flex items-center justify-between px-3 pb-2 pt-0.5 text-white">
                  <span className="text-[15px] font-bold">Reels</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                </div>
              ),
            }}
          >
            <BeatFade beatKey={reel} className="absolute inset-0">
              <ReelScreen id={reel} progress={progress} swipe={beat === 2} />
            </BeatFade>
          </Phone>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <StoryBeats beats={BEATS} at={beat} />
          <div className="grid grid-cols-3 gap-3">
            {tilesAt(beat).map((t, i) => {
              const tone = TONE[t.state]
              const wait = t.state === 'wait'
              return (
                <div key={i} className="flex flex-col gap-1 rounded-card px-3.5 py-2.5" style={{ border: `2px ${wait ? 'dashed' : 'solid'} ${wait ? colors.line : `${tone}80`}`, background: wait ? 'rgba(255,255,255,0.5)' : `${tone}10`, transition: tween }}>
                  <span className="text-[12px] font-semibold" style={{ color: colors.muted }}>Reel {i + 1} · {REELS[i].length}</span>
                  <span className="text-[15px] font-bold leading-tight" style={{ color: colors.ink }}>{REELS[i].caption}</span>
                  <span className="relative mt-1 block h-[7px] w-full overflow-hidden rounded-full" style={{ background: colors.surface2 }}>
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${t.fill * 100}%`, background: tone, transition: tween }} />
                    {t.state === 'cut' && <span className="absolute inset-y-0 right-0 rounded-full" style={{ left: `${t.fill * 100 + 2}%`, border: `1.5px dashed ${colors.danger}` }} />}
                  </span>
                  <span className="text-[14.5px] font-bold leading-tight" style={{ color: tone, transition: tween }}>{t.text}</span>
                </div>
              )
            })}
          </div>
          {beat < 5 ? (
            <div className="pl-1">
              <p className="text-[12.5px] font-semibold" style={{ color: colors.muted }}>What happened</p>
              {/* two columns of three, so five lines take the height of three and stay clear of the controls */}
              <ol className="mt-1 grid grid-flow-col grid-rows-3 gap-x-8 gap-y-0.5 border-l-2 pl-3" style={{ borderColor: colors.line }}>
                {LOG.filter((l) => l.at <= beat).map((l, i) => (
                  <li key={i} className="flex items-center gap-2 text-[15px] leading-snug" style={{ color: l.color, fontWeight: l.weight ?? 600 }}>
                    <span className="-ml-[19px] h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: l.color }} />
                    {l.text}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <BeatFade beatKey="plan">
              <PlanBox
                lines={[
                  { kind: 'head', indent: 0, text: <><Kw>every reel</Kw> in the feed:</> },
                  { kind: 'test', indent: 1, text: <><Kw>if</Kw> you do not like it:</> },
                  { kind: 'go', indent: 2, text: 'swipe up, go to the next reel' },
                  { kind: 'chip', indent: 1, text: 'watch the rest of it' },
                  { kind: 'chip', indent: 0, text: 'close the app' },
                ]}
                arrow={{ kind: 'back', label: 'back to the top' }}
              />
            </BeatFade>
          )}
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
