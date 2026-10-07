import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween, VarTrail, type CodeLineState } from '@/ui'
import { BeatCaption } from './common'
import { StepControls } from './controls'
import { Glow } from './motion'
import { Phone } from './Phone'

/**
 * FOLLOW THE CODE: TWO OVERS. PF 16 slide 7, twenty beats.
 *
 * The cricket plan from the hook, now in Python, run one print line per
 * press. The reference's layout: the program top left with `Block 1` to
 * `Block 4` chips on the lines they are (the chips return as `ran 2`,
 * `ran 12`, `ran 2`, `ran 1` on the last beat), the `over` and `ball`
 * variables under it; the numbered caption top right, and under it the
 * live-score app on a phone beside what the program has printed, counted.
 * Reason for the picture: a hidden process made visible, and the phone comes
 * back because its numbers ARE the trace's numbers.
 *
 * THE CHIPS SIT INSIDE THE CODE PANEL. The first cut used the kit's `labels`,
 * which draws each label outside the box on a leader line, and the leader
 * lines were the "odd-looking lines beside the mobile graphic" (review,
 * 2026-10-01). The chips are placed on the kit panel's own row grid: the
 * title bar is 45px, the code area's padding 16px, and a 16px row is
 * round(16 x 1.55) = 25px, which is `CodeBlock`'s arithmetic.
 *
 * THE OUTPUT IS COLOURED AS THE REFERENCE COLOURS IT: the numbers in ink, the
 * three sentences (`New bowler`, `End of over`, `2 overs done`) in the accent
 * orange, so the room can see the two kinds of line at a glance. The panel
 * keeps the newest lines in view, as a terminal would.
 *
 * Every output line is a real run (CPython 3.12.3): 17 lines, line 4 ran 12.
 * The commentary is the reference's own.
 */
const CODE = 'for over in range(2):\n    print("New bowler")\n    for ball in range(1, 7):\n        print(over, ball)\n    print("End of over")\nprint("2 overs done")'

interface Ball {
  over: number
  n: number
  score: string
  text: string
}

const BALLS: Ball[] = [
  { over: 0, n: 1, score: '1-0', text: 'Starc to Rohit, 1 run' },
  { over: 0, n: 2, score: '1-0', text: 'Starc to Gill, no run' },
  { over: 0, n: 3, score: '5-0', text: 'Starc to Gill, FOUR!' },
  { over: 0, n: 4, score: '6-0', text: 'Starc to Gill, 1 run' },
  { over: 0, n: 5, score: '6-0', text: 'Starc to Rohit, no run' },
  { over: 0, n: 6, score: '8-0', text: 'Starc to Rohit, 2 runs' },
  { over: 1, n: 1, score: '8-0', text: 'Zampa to Gill, no run' },
  { over: 1, n: 2, score: '9-0', text: 'Zampa to Gill, 1 run' },
  { over: 1, n: 3, score: '15-0', text: 'Zampa to Rohit, SIX!' },
  { over: 1, n: 4, score: '16-0', text: 'Zampa to Rohit, 1 run' },
  { over: 1, n: 5, score: '17-0', text: 'Zampa to Rohit, 1 run' },
  { over: 1, n: 6, score: '17-0', text: 'Zampa to Rohit, no run' },
]

interface Beat {
  cap: string[]
  now?: number
  over?: number
  ballsDone: number
  out?: string
  banner: string
  sub?: string
}

const BEATS: Beat[] = [
  { cap: ['The cricket plan from the start, now in Python', 'Blocks 1 to 4 are the same'], ballsDone: 0, banner: '', sub: 'Waiting for the first ball' },
  { cap: ['This program follows two overs', 'Each press runs one print line'], ballsDone: 0, banner: '', sub: 'Waiting for the first ball' },
  { cap: ['Line 1: over is 0', 'Line 2 prints New bowler'], now: 2, over: 0, ballsDone: 0, out: 'New bowler', banner: 'Over 1 · Starc bowling' },
  { cap: ['Line 3: ball is 1', "Line 4 prints 0 1, the app's 0.1"], now: 4, over: 0, ballsDone: 1, out: '0 1', banner: 'Over 1 · Starc bowling' },
  { cap: ['Back to line 3: ball is 2', 'Line 4 prints 0 2'], now: 4, over: 0, ballsDone: 2, out: '0 2', banner: 'Over 1 · Starc bowling' },
  { cap: ['Back to line 3: ball is 3', 'Line 4 prints 0 3'], now: 4, over: 0, ballsDone: 3, out: '0 3', banner: 'Over 1 · Starc bowling' },
  { cap: ['Back to line 3: ball is 4', 'Line 4 prints 0 4'], now: 4, over: 0, ballsDone: 4, out: '0 4', banner: 'Over 1 · Starc bowling' },
  { cap: ['Back to line 3: ball is 5', 'Line 4 prints 0 5'], now: 4, over: 0, ballsDone: 5, out: '0 5', banner: 'Over 1 · Starc bowling' },
  { cap: ['Back to line 3: ball is 6', 'Line 4 prints 0 6'], now: 4, over: 0, ballsDone: 6, out: '0 6', banner: 'Over 1 · Starc bowling' },
  { cap: ['ball has no value left after 6', 'Line 5 prints End of over'], now: 5, over: 0, ballsDone: 6, out: 'End of over', banner: 'End of over 1 · 8 runs' },
  { cap: ['Back to line 1: over is now 1', 'ball still says 6', 'Line 2 prints New bowler'], now: 2, over: 1, ballsDone: 6, out: 'New bowler', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Line 3 starts again: ball is 1 again', 'Line 4 prints 1 1'], now: 4, over: 1, ballsDone: 7, out: '1 1', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Back to line 3: ball is 2', 'Line 4 prints 1 2'], now: 4, over: 1, ballsDone: 8, out: '1 2', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Back to line 3: ball is 3', 'Line 4 prints 1 3'], now: 4, over: 1, ballsDone: 9, out: '1 3', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Back to line 3: ball is 4', 'Line 4 prints 1 4'], now: 4, over: 1, ballsDone: 10, out: '1 4', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Back to line 3: ball is 5', 'Line 4 prints 1 5'], now: 4, over: 1, ballsDone: 11, out: '1 5', banner: 'Over 2 · Zampa bowling' },
  { cap: ['Back to line 3: ball is 6', 'Line 4 prints 1 6'], now: 4, over: 1, ballsDone: 12, out: '1 6', banner: 'Over 2 · Zampa bowling' },
  { cap: ['ball has no value left after 6', 'Line 5 prints End of over'], now: 5, over: 1, ballsDone: 12, out: 'End of over', banner: 'End of over 2 · 9 runs' },
  { cap: ['over has no value left after 1', 'Line 6 prints 2 overs done'], now: 6, over: 1, ballsDone: 12, out: '2 overs done', banner: 'End of over 2 · 9 runs' },
  { cap: ['Line 4 ran 12 times: 2 overs times 6 balls'], over: 1, ballsDone: 12, banner: 'End of over 2 · 9 runs' },
]

/* ------------------------------------------------------------- code chips */

const CODE_FONT = 16
const ROW_H = Math.round(CODE_FONT * 1.55)
const BAR = 45
const PAD = 16
const CHIP_H = 22
const BLOCK_LINES: Record<number, string> = { 2: 'Block 1', 4: 'Block 2', 5: 'Block 3', 6: 'Block 4' }
const RAN_LINES: Record<number, string> = { 2: 'ran 2', 4: 'ran 12', 5: 'ran 2', 6: 'ran 1' }

/** The chips on the code lines: the block names before the run, how often each ran after it. */
function CodeChips({ beat, tween }: { beat: number; tween: string }) {
  const labels = beat <= 2 ? BLOCK_LINES : beat === BEATS.length ? RAN_LINES : null
  return (
    <>
      {Object.entries(BLOCK_LINES).map(([n]) => {
        const text = labels?.[+n]
        /* a hidden chip keeps its last words, so it never changes size as it fades */
        const words = text ?? (beat === BEATS.length ? RAN_LINES[+n] : BLOCK_LINES[+n])
        return (
          <span
            key={n}
            className="pointer-events-none absolute right-3 inline-flex items-center rounded-pill px-2.5 font-body text-[12.5px] font-bold text-white"
            style={{
              top: BAR + PAD + (+n - 1) * ROW_H + ROW_H / 2 - CHIP_H / 2,
              height: CHIP_H,
              background: colors.brand,
              opacity: text ? 1 : 0,
              transform: text ? 'scale(1)' : 'scale(0.6)',
              transition: tween,
            }}
          >
            {words}
          </span>
        )
      })}
    </>
  )
}

/* ---------------------------------------------------------------- output */

/* The panel's fixed height holds all 17 lines of the run: 384 less the 37px
   header and 20px of padding leaves 327, and 17 lines at 15px x 1.25 take 319.
   Review, 2026-10-01: the content must fit the box, not scroll inside it. */
const OUT_FONT = 15
const OUT_LH = 1.25

/**
 * The kit's `OutputPanel` chrome with the reference's colouring: a number line
 * in ink, a sentence in the accent orange. Fixed height, sized so the whole
 * run fits inside it.
 */
function ColourOutput({ lines, ran, height }: { lines: string[]; ran: number; height: number }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card-soft" style={{ height }}>
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: colors.success }} />
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
          Output · {lines.length} line{lines.length === 1 ? '' : 's'}
        </span>
        <span className="ml-auto rounded-pill px-2 py-0.5 font-mono text-[12px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
          line 4 ran {ran}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-2.5">
        {lines.length === 0 ? (
          <pre className="m-0 whitespace-pre font-mono italic" style={{ fontSize: OUT_FONT, color: colors.muted }}>Nothing printed yet</pre>
        ) : (
          lines.map((l, i) => (
            <pre key={i} className="m-0 whitespace-pre font-mono" style={{ fontSize: OUT_FONT, lineHeight: OUT_LH, color: /^\d/.test(l) ? colors.ink : colors.accentDark }}>
              {l}
            </pre>
          ))
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ phone */

function LiveApp({ b, tween }: { b: Beat; tween: string }) {
  const shown = BALLS.slice(0, b.ballsDone).reverse()
  const score = b.ballsDone ? BALLS[b.ballsDone - 1].score : '0-0'
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: colors.surface }}>
      <div className="flex gap-3 px-3 pb-1 pt-1 text-[10px] font-semibold" style={{ color: colors.muted }}>
        {['Info', 'Live', 'Scorecard', 'Squads'].map((t) => (
          <span key={t} className={t === 'Live' ? 'border-b-2 pb-0.5' : ''} style={t === 'Live' ? { color: colors.brandDark, borderColor: colors.brandDark } : undefined}>
            {t}
          </span>
        ))}
      </div>
      <div className="mx-2 rounded-xl bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold" style={{ color: colors.ink }}>IND</span>
          <span className="font-mono text-[17px] font-bold leading-none" style={{ color: colors.ink, transition: tween }}>{score}</span>
          <span className="ml-auto flex items-center gap-1 rounded-pill px-1.5 py-px text-[8px] font-bold tracking-wider text-white" style={{ background: colors.danger }}>
            <span className="h-1 w-1 rounded-full bg-white" /> LIVE
          </span>
        </div>
        <p className="mt-0.5 text-[10px] font-semibold" style={{ color: b.banner ? colors.brandDark : colors.muted, transition: tween }}>{b.banner || b.sub}</p>
      </div>
      <p className="mt-1.5 px-3 text-[9.5px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Commentary</p>
      <div className="mx-2 mt-1 flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
        {shown.slice(0, 5).map((x, i) => (
          <div key={`${x.over}.${x.n}`} className={`flex items-center gap-2 rounded-lg bg-white px-2 py-1 ${i === 0 ? 'sm-rise' : ''}`} style={{ opacity: i === 0 ? 1 : 0.78 }}>
            <span className="rounded-md px-1.5 py-px font-mono text-[9.5px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
              {x.over}.{x.n}
            </span>
            <span className="text-[10px] leading-tight" style={{ color: colors.ink }}>{x.text}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-around border-t border-line bg-white px-1 pb-4 pt-1.5 text-[9px] font-semibold" style={{ color: colors.muted }}>
        {['Home', 'Matches', 'Videos', 'News', 'More'].map((t) => (
          <span key={t} style={t === 'Matches' ? { color: colors.brandDark } : undefined}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- figure */

/** The ball variable: one row of chips per over, the value on now ringed. */
function BallRows({ over, ballsDone, tween }: { over: number | undefined; ballsDone: number; tween: string }) {
  const rows = over === undefined ? [] : over === 0 ? [Math.min(ballsDone, 6)] : [6, ballsDone - 6]
  return (
    <div className="flex flex-col gap-1">
      {rows.map((k, r) => (
        <div key={r} className="flex items-center gap-1.5">
          <span className="w-[42px] font-mono text-[11px]" style={{ color: colors.muted }}>over {r}</span>
          {Array.from({ length: 6 }, (_, i) => {
            const done = i < k
            const now = r === rows.length - 1 && i === k - 1
            return (
              <span
                key={i}
                className="grid h-[22px] w-[22px] place-items-center rounded-md font-mono text-[12px] font-semibold"
                style={{
                  background: now ? colors.brandDark : done ? colors.surface2 : 'transparent',
                  color: now ? colors.white : done ? colors.body : colors.line,
                  boxShadow: `inset 0 0 0 1px ${done ? 'transparent' : colors.line}`,
                  transition: tween,
                }}
              >
                {i + 1}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* A real handset is about 1 : 2 (session 15's `PHONE` is 232 x 478). The
   right column has y 221..636 to itself, so 190 x 384 fits with its label
   under it and keeps the proportion; the first cut's 176 x 300 was squat and
   clipped the app's foot (review, 2026-10-01). The caption sits under the
   code it narrates, which gives the right column its full height. */
const PHONE_W = 190
const PHONE_H = 384

export function TwoOversWalk() {
  const beat = useBeats(BEATS.length)
  const tween = useTween(420)
  const b = BEATS[beat - 1]
  const lines: Record<number, CodeLineState> = {}
  if (beat >= 3) for (let l = 1; l <= 6; l++) lines[l] = 'ran'
  if (b.now) lines[b.now] = 'now'
  const printed = BEATS.slice(0, beat).map((x) => x.out).filter((x): x is string => !!x)
  const overVals = b.over === undefined ? [] : b.over === 0 ? ['0'] : ['0', '1']
  return (
    <>
      <div className="flex items-start gap-6">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <div className="relative">
            <CodeBlock code={CODE} filename="Python" chip={false} fontSize={CODE_FONT} rows={6} lines={lines} />
            <CodeChips beat={beat} tween={tween} />
          </div>
          <div className="flex items-start gap-5">
            <VarTrail name="over" values={overVals} empty="not set yet" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[16px] font-semibold" style={{ color: colors.brandDark }}>ball</span>
              {b.over === undefined ? <span className="text-[16px]" style={{ color: colors.muted }}>not set yet</span> : <BallRows over={b.over} ballsDone={b.ballsDone} tween={tween} />}
            </div>
          </div>
          <BeatCaption n={beat} lines={b.cap} size={16} />
        </div>
        <div className="flex min-w-0 flex-1 items-start gap-5">
          <div className="flex shrink-0 flex-col items-center gap-1">
            {/* no island on this phone (review, 2026-10-01) */}
            <Phone width={PHONE_W} height={PHONE_H} time="7:42" island={null} top={{ bg: colors.brandDeep, light: true, header: <p className="px-3 pb-1.5 text-[11px] font-bold leading-tight text-white">IND vs AUS<span className="block text-[9.5px] font-normal opacity-80">3rd T20I · Chennai</span></p> }}>
              <LiveApp b={b} tween={tween} />
            </Phone>
            <span className="text-[12px] font-semibold" style={{ color: colors.muted }}>What the app shows</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="w-full">
              <Glow on={printed.length > 0 && !!b.out} pulse={printed.length}>
                <ColourOutput lines={printed} ran={b.ballsDone} height={PHONE_H} />
              </Glow>
            </div>
            <span className="text-[12px] font-semibold" style={{ color: colors.muted }}>What the program prints</span>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={BEATS.length} />
    </>
  )
}
