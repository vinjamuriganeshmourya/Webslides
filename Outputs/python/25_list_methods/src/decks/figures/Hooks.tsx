import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Appear, Ask, OutPanel, Show } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { usePhase } from './tiles21'
import { Focus, Group } from './common'
import { LiveClock } from './Phone'
import { FACE, Idling, RAM } from './Cast'
import { CellRow, cellsOf } from './cells'
import { MenuSheet, MusicPhone, NowPlaying, QueueRows, ROW_H, SongRow, UpNextTab, YT, Dots } from './Music'
import { CODE_FS, OUT_FS } from './Methods'
import { SPEC } from './spec'

/**
 * THE STORY CARDS: S-RECAP (the bug from session 24), H1 (the party queue
 * hook), C1 (a list's own tools) and H2 (counting plays the long way).
 * Every word on screen is the spec's `show` line for that press, one
 * sentence per line (content rule 36); every program is the spec's, run.
 */

/* ================================================================== S-RECAP */

function OutBox({ label, text, tone }: { label: string; text: string; tone: 'bad' | 'good' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[16px] font-bold" style={{ color: colors.body }}>
        {label}
      </span>
      <span
        key={text}
        className="sm-bump rounded-xl px-4 py-2 font-mono text-[20px] font-bold"
        style={{ background: tone === 'bad' ? '#FDECEC' : '#E9F8EF', color: colors.ink, boxShadow: `inset 0 0 0 2px ${tone === 'bad' ? colors.danger : colors.success}` }}
      >
        {text}
      </span>
    </div>
  )
}

export function RecapBug() {
  const R = SPEC['S-RECAP']
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const fixed = beat >= 3
  const src: string = fixed ? R.code[1].src : R.code[0].src
  const prints = fixed ? R.code[1].output : R.data.wrong
  const right = R.data.culprit - 1
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[560px] shrink-0 flex-col gap-3">
          <p className="text-[21px] font-semibold leading-snug" style={{ color: colors.body }}>
            {R.show[0].replace(/\.$/, '')}
          </p>
          <Group pad={10} className="flex flex-col gap-3">
            <Focus on={beat === 1}>
              <CodePane code={src} fontSize={CODE_FS + 2} highlight={beat === 2 ? 2 : undefined} at={beat === 2 ? 2 : null} stop={beat === 2} mark={fixed ? [2] : undefined} />
            </Focus>
            <div className="flex items-start gap-6">
              <OutBox label={R.show[1]} text={prints} tone={fixed ? 'good' : 'bad'} />
              <OutBox label={R.show[2]} text={R.data.right} tone="good" />
            </div>
          </Group>
        </div>
        <Group pad={12} className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-2.5">
            {/* show[3], the question, is the card's heading: said once, as the title */}
            <Vote options={['Line 1', 'Line 2', 'Line 3']} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={18} mono={false} />
          </div>
          <div>
            <StepCaption tone="rule" text={beat >= 2 ? R.show[4] : null} size={18} minH={84} />
          </div>
        </Group>
      </div>
      {beat >= 2 && pick === right && <Confetti seed={11} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== H1 */

const H1 = SPEC.H1

/** Ram's messages as the room reads them: a big chat bubble, not the phone's small banner alone. */
function Bubble({ text, on }: { text: string; on: boolean }) {
  return (
    <Show on={on} className="flex items-start gap-3">
      {/* Ram, a character from the lab (G4), alive with its idle layer: breath, blinks, a slow sway */}
      <span className="grid h-12 w-12 shrink-0 place-items-end justify-center overflow-hidden rounded-full" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        <Idling cfg={RAM} crop={FACE} scale={0.36} seed={7} />
      </span>
      <span className="rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-[21px] font-semibold leading-snug" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.18)` }}>
        {text}
      </span>
    </Show>
  )
}

/** Press 6: the row of songs with its index under each, and its own menu of jobs, attached to it. */
function RowWithMenu({ songs, on }: { songs: string[]; on: boolean }) {
  const jobs: string[] = H1.data.jobs
  return (
    <Show on={on} className="flex items-start">
      <CellRow cells={cellsOf(songs)} font={15} quote={false} lane={false} />
      {/* the menu hangs off the row's own end: attached, not floating */}
      <div className="flex items-start" style={{ marginTop: 8 }}>
        <span className="mt-[18px] block h-[3px] w-6" style={{ background: colors.brandDark }} />
        <div className="rounded-card bg-white px-4 py-2.5" style={{ boxShadow: `inset 0 0 0 2px ${colors.brandDark}, 0 8px 18px -10px rgba(16,32,58,0.3)` }}>
          <span className="mb-1 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.brandDark }}>
            <Dots color={colors.brandDark} /> its menu
          </span>
          {jobs.map((j) => (
            <span key={j} className="block text-[18px] font-semibold leading-[30px]" style={{ color: colors.ink }}>
              {j}
            </span>
          ))}
        </div>
      </div>
    </Show>
  )
}

export function PartyHook() {
  const beat = useBeats(6)
  const instant = useInstant()
  const now: string = H1.data.now_playing
  const base: string[] = H1.data.up_next
  const req: string = H1.data.request
  const p2 = usePhase(beat, 2, [700])
  const p3 = usePhase(beat, 3, [420])
  const p4 = usePhase(beat, 4, [600, 700])
  const p5 = usePhase(beat, 5, [500, 420])
  let songs = base
  let out: string[] = []
  let sheet = false
  let tap: 'Play next' | 'Add to queue' | null = null
  if (beat === 2) {
    sheet = true
    tap = p2 >= 1 ? 'Add to queue' : null
  } else if (beat === 3) {
    sheet = p3 < 1
    tap = 'Add to queue'
    songs = p3 >= 1 ? [...base, req] : base
  } else if (beat === 4) {
    songs = [...base, req]
    out = p4 >= 1 ? [req] : []
    sheet = p4 >= 2
  } else if (beat >= 5) {
    sheet = beat === 5 && p5 < 1
    tap = 'Play next'
    songs = beat === 5 && p5 < 2 ? [...base, req] : [req, ...base]
    out = beat === 5 && p5 < 2 ? [req] : []
  }
  const caption = [null, H1.show[1], H1.show[2], H1.show[4], H1.show[5], H1.show[6]][beat - 1]
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="shrink-0" style={{ opacity: beat === 6 ? 0.2 : 1, transition: instant ? 'none' : 'opacity 700ms' }}>
          {/* real proportions (1 : 2.06, user 2026-10-08), the device's own running clock, covers with a live sound wave */}
          <MusicPhone
            width={209}
            height={430}
            time={<LiveClock />}
            top={
              <>
                <NowPlaying song={now} wave="live" />
                <UpNextTab />
              </>
            }
          >
            <div className="relative h-full px-1 pt-1.5">
              <QueueRows songs={songs} out={out} lit={beat === 5 && p5 >= 2 ? [req] : beat === 3 && p3 >= 1 ? [req] : []} height={3 * ROW_H} wave="calm" />
              <MenuSheet song={req} open={sheet} tap={tap} />
            </div>
          </MusicPhone>
        </div>
        <Group pad={12} className="flex min-w-0 flex-1 flex-col gap-4">
          {beat < 6 ? (
            <Appear className="flex flex-col gap-3">
              <Bubble text={H1.show[0].replace(/^Ram: /, '')} on />
              <Bubble text={H1.show[3].replace(/^Ram: /, '')} on={beat >= 4} />
            </Appear>
          ) : (
            <Appear>
              <RowWithMenu songs={[req, ...base]} on />
            </Appear>
          )}
          <div>
            <StepCaption tone={beat === 6 ? 'rule' : 'step'} text={caption} size={21} minH={64} />
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== C1 */

/**
 * The dot between a name and its method, marked with a RECTANGLE that draws
 * itself (user, 2026-10-08, slide 7): one stroke travels round the dot's box
 * on an eased path-draw, so the eye follows it to the dot. An instant jump
 * shows it drawn.
 */
function DotMark({ on }: { on: boolean }) {
  const instant = useInstant()
  return (
    <svg className="pointer-events-none absolute -inset-[5px]" width="calc(100% + 10px)" height="calc(100% + 10px)" viewBox="0 0 40 46" preserveAspectRatio="none" aria-hidden>
      <rect
        x="2"
        y="2"
        width="36"
        height="42"
        rx="5"
        fill="none"
        stroke={colors.accent}
        strokeWidth="3"
        pathLength={1}
        strokeDasharray="1"
        style={{ strokeDashoffset: on ? 0 : 1, opacity: on ? 1 : 0, transition: instant ? 'none' : 'stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1) 120ms, opacity 200ms' }}
      />
    </svg>
  )
}

function MethodChip({ text, ringDot = false }: { text: string; ringDot?: boolean }) {
  const dot = text.indexOf('.')
  /* the queue. chip mounts with the mark on: draw it once it is on screen */
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setDrawn(ringDot), ringDot ? 60 : 0)
    return () => window.clearTimeout(t)
  }, [ringDot])
  return (
    <span className="inline-flex items-center rounded-lg bg-white px-4 py-1.5 font-mono text-[24px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
      {dot < 0 ? (
        text
      ) : (
        <>
          <span style={{ color: colors.ink }}>{text.slice(0, dot)}</span>
          <span className="relative mx-1.5 inline-grid h-8 w-6 place-items-center" style={{ color: colors.accentDark }}>
            .
            <DotMark on={drawn} />
          </span>
          {text.slice(dot + 1)}
        </>
      )}
    </span>
  )
}

export function ListTools() {
  const C = SPEC.C1
  const beat = useBeats(2)
  const strs: string[] = C.show.slice(1, 3)
  const mine: string[] = C.show.slice(4, 8)
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-12">
          <Group pad={12} className="flex w-[330px] shrink-0 flex-col gap-3">
            <Ask size={22}>{C.show[0].replace(/\.$/, '')}</Ask>
            {strs.map((s) => (
              <MethodChip key={s} text={s} ringDot={beat >= 2} />
            ))}
          </Group>
          <Show on={beat >= 2} className="flex min-w-0 flex-1 flex-col gap-3">
            <Group pad={12} className="flex flex-col gap-3">
              <Ask size={22}>{C.show[3].replace(/\.$/, '')}</Ask>
              <div className="flex items-start gap-6">
                <MethodChip text="queue." ringDot />
                <div className="flex flex-col gap-2">
                  {mine.map((m, i) => (
                    <span key={m} className="flex items-center gap-3" style={{ opacity: beat >= 2 ? 1 : 0, transition: `opacity 520ms ${i * 130}ms` }}>
                      <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden className="shrink-0">
                        <path d="M2 7 H24" stroke={colors.success} strokeWidth="2.75" strokeLinecap="round" />
                        <path d="M23 2.5 L31 7 L23 11.5 Z" fill={colors.success} />
                      </svg>
                      <span className="font-mono text-[22px] font-bold" style={{ color: colors.brandDark }}>
                        {m}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Group>
          </Show>
        </div>
        <Show on={beat >= 2}>
        <Group pad={10} className="flex items-center gap-6">
          <div className="flex items-center gap-4 rounded-card px-3 py-2" style={{ background: YT.bg }}>
            <div className="w-[230px]">
              <SongRow song="Chuttamalle" />
            </div>
            <div className="flex flex-col gap-0.5 rounded-lg px-3 py-1.5" style={{ background: YT.sheet }}>
              {['Play next', 'Add to queue'].map((t) => (
                <span key={t} className="text-[14px] font-semibold" style={{ color: YT.ink }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <StepCaption tone="rule" text={C.show[8]} size={20} minH={56} />
          </div>
        </Group>
        </Show>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== H2 */

/** The same height change for the program's collapse: one movement, the output under it does not move away. */
function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number | undefined>(undefined)
  const instant = useInstant()
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    setH(el.offsetHeight)
    return () => ro.disconnect()
  }, [])
  return (
    <div style={{ height: h, overflow: 'hidden', transition: instant ? 'none' : 'height 720ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
      <div ref={inner}>{children}</div>
    </div>
  )
}

export function HistoryHook() {
  const H2 = SPEC.H2
  const history: string[] = H2.data.history
  const song: string = H2.data.song
  const [long, short] = H2.code
  const beat = useBeats(4)
  const scanPh = usePhase(beat, 2, [...history.map(() => 520), 520])
  const scan = beat === 2 && scanPh >= 1 && scanPh <= history.length ? scanPh - 1 : -1
  const seen = beat === 2 ? Math.min(scanPh, history.length) : beat > 2 ? history.length : 0
  const count = history.slice(0, seen).filter((s) => s === song).length
  const linePh = usePhase(beat, 3, [300, 520, 520, 520, 520, 520])
  const at = beat === 3 ? (linePh >= 1 ? Math.min(linePh, 6) : null) : null
  const fold = usePhase(beat, 4, [80, 700])
  const isShort = beat === 4 && fold >= 2
  const prog = isShort ? short : long
  const showOut = (beat === 3 && linePh >= 6) || beat === 4
  const caption = [H2.show[0], H2.show[1], H2.show[2], H2.show[3]][beat - 1]
  return (
    <>
      <div className="flex items-start gap-6">
        <div className="shrink-0">
          <MusicPhone
            width={210}
            height={432}
            top={
              <div className="flex gap-5 border-b px-3 pb-1.5 pt-1" style={{ borderColor: YT.line }}>
                <span className="border-b-2 pb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: YT.ink, borderColor: YT.ink }}>
                  History
                </span>
                <span className="pb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: YT.sub }}>
                  Today
                </span>
              </div>
            }
          >
            <div className="relative flex flex-col px-1 pt-1">
              {history.map((s, i) => (
                <div key={i} className="relative">
                  <SongRow song={s} lit={(beat === 2 && i < seen && s === song) || (beat > 2 && s === song)} />
                  <span className="absolute -left-0.5 top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full" style={{ background: YT.red, opacity: scan === i ? 1 : 0, transition: 'opacity 260ms cubic-bezier(0.22,1,0.36,1)' }} />
                </div>
              ))}
            </div>
          </MusicPhone>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Group pad={10} className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <StepCaption tone={beat >= 3 ? 'rule' : 'step'} text={caption} size={20} minH={58} />
            </div>
            <div className="shrink-0">
              <div className="flex flex-col items-center rounded-card bg-white px-4 py-1.5" style={{ boxShadow: `inset 0 0 0 2px ${colors.accent}`, opacity: beat >= 2 ? 1 : 0, transition: 'opacity 420ms' }}>
                <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                  {song}
                </span>
                <span key={count} className="font-mono text-[30px] font-bold leading-tight" style={{ color: colors.accentDark, animation: count ? 'pf25-tick 420ms both' : 'none' }}>
                  {count}
                </span>
              </div>
            </div>
          </Group>
          <Show on={beat >= 3}>
            <Group pad={8} className="flex flex-col gap-2.5">
              <div>
                <AutoHeight>
                  <CodePane key={isShort ? 's' : 'l'} code={prog.src} at={at} mark={beat === 4 && fold === 1 ? [2, 3, 4, 5] : isShort ? [2] : undefined} fontSize={CODE_FS} />
                </AutoHeight>
              </div>
              <div>
                <OutPanel lines={showOut ? [{ text: prog.output }] : []} minRows={1} fontSize={OUT_FS} />
              </div>
            </Group>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

