import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatList } from './BeatList'

/**
 * WHY A LOOP INSIDE A LOOP? PF 16 slide 15, five beats: the question, the one
 * loop trick, the long way, what it costs, the shape. Move 4 of
 * `pedagogy-to-components` in full; the fourth beat is the one that must not
 * be cut, because without "what it costs" the shape is an answer and not a
 * relief.
 *
 * The left side is the Code Playground drawn as it looks: the Coding Practice
 * header with Run and Submit, the problem card with its sample input and
 * output, the editor, the YOUR OUTPUT and EXPECTED panes, and the two test
 * case chips. Its editor tab reads `main.py` because that is what the portal
 * shows (plan decision 2). The right side lists the five beats, all visible,
 * the current one bold (course rule R5b).
 *
 * `print("1 " * i)` really prints `1 `, `1 1 `, `1 1 1 ` (CPython 3.12.3), and
 * 5,050 is the sum of 1 to 100.
 */
const BEATS = [
  'The question: print this pattern for any N',
  /* Content rule 2b: the reference says "Last session's trick repeats a string".
     The deck names the operator instead of when the room used it (plan decision 4). */
  'The * trick repeats a string. The rows come out wrong',
  'Write every row by hand. It passes for 3 and fails for 4',
  'For N = 100: 100 print lines and 5,050 numbers to type',
  'Each row is its own count, from 1 up to the row number',
]

const CODES: string[][] = [
  ['# write your code here'],
  ['n = int(input())', 'for i in range(1, n + 1):', '    print("1 " * i)'],
  ['print("1 ")', 'print("1 2 ")', 'print("1 2 3 ")'],
  ['print("1 ")', 'print("1 2 ")', 'print("1 2 3 ")', '...', 'print("1 2 3 4 5 ... 100 ")'],
  [],
]

type Chip = { state: '?' | 'ok' | 'bad'; text: string }
const CHIPS: [Chip, Chip][] = [
  [{ state: '?', text: 'Test case 1 · input 3' }, { state: '?', text: 'Test case 2 · input 4' }],
  [{ state: 'bad', text: 'Test case 1 · input 3' }, { state: '?', text: 'Test case 2 · input 4' }],
  [{ state: 'ok', text: 'Test case 1 · input 3' }, { state: 'bad', text: 'Test case 2 · input 4: row 4 is missing' }],
  [{ state: '?', text: 'Test case 1 · input 3' }, { state: '?', text: 'Test case 2 · input 4' }],
  [{ state: '?', text: 'Test case 1 · input 3' }, { state: '?', text: 'Test case 2 · input 4' }],
]

function Pane({ title, lines, tone }: { title: string; lines: string[]; tone: 'plain' | 'bad' | 'ok' }) {
  const ring = tone === 'bad' ? colors.danger : tone === 'ok' ? colors.success : colors.line
  return (
    <div className="flex-1 rounded-lg bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${ring}` }}>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>{title}</p>
      {lines.map((l, i) => (
        <p key={i} className="whitespace-pre font-mono text-[13px] leading-snug" style={{ color: colors.ink }}>{l}</p>
      ))}
    </div>
  )
}

function Chips({ chips }: { chips: [Chip, Chip] }) {
  const look = (c: Chip) => (c.state === 'ok' ? { bg: '#E9F8EF', fg: '#137A3A', mark: '✓' } : c.state === 'bad' ? { bg: '#FDECEC', fg: colors.danger, mark: '✗' } : { bg: colors.surface, fg: colors.muted, mark: '?' })
  return (
    <div className="flex gap-2">
      {chips.map((c, i) => {
        const l = look(c)
        return (
          <span key={i} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold" style={{ background: l.bg, color: l.fg }}>
            <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: c.state === '?' ? colors.muted : l.fg }}>{l.mark}</span>
            {c.text}
          </span>
        )
      })}
    </div>
  )
}

/** The plan in plain English: the two nested dashed frames the hook used. */
function PlanBox() {
  const line = (t: string, bold = false) => (
    <div className={`rounded-md bg-white px-2.5 py-1 font-mono text-[13px] ${bold ? 'font-bold' : ''}`} style={{ color: colors.ink, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
      {t}
    </div>
  )
  return (
    <div className="rounded-lg p-2.5" style={{ border: `2px dashed ${colors.accent}` }}>
      <p className="font-mono text-[13px] font-bold" style={{ color: colors.ink }}><span style={{ color: '#C2185B' }}>loop</span> over the rows, 1 to N:</p>
      <div className="ml-4 mt-1.5 rounded-lg p-2" style={{ border: `2px dashed ${colors.brand}` }}>
        <p className="font-mono text-[13px] font-bold" style={{ color: colors.ink }}><span style={{ color: '#C2185B' }}>loop</span> over one row, 1 up to the row number:</p>
        <div className="ml-4 mt-1.5">{line('add the number to the row')}</div>
      </div>
      <div className="ml-4 mt-1.5">{line('print the row')}</div>
    </div>
  )
}

const SAMPLE_OUT = '1 \n1 2 \n1 2 3 \n1 2 3 4 '

export function PlaygroundStory() {
  const beat = useBeats(BEATS.length)
  const tween = useTween(420)
  const k = beat - 1
  const code = CODES[k]
  let under: ReactNode = null
  if (k === 1) under = <div className="flex gap-2"><Pane title="Your output" lines={['1 ', '1 1 ', '1 1 1 ']} tone="bad" /><Pane title="Expected" lines={['1 ', '1 2 ', '1 2 3 ']} tone="plain" /></div>
  if (k === 2) under = <div className="flex gap-2"><Pane title="Your output" lines={['1 ', '1 2 ', '1 2 3 ']} tone="ok" /><Pane title="Expected" lines={['1 ', '1 2 ', '1 2 3 ']} tone="plain" /></div>
  if (k === 3)
    under = (
      <div className="flex gap-2">
        {[
          ['100', 'print lines'],
          ['5,050', 'numbers typed'],
        ].map(([n, l]) => (
          <div key={l} className="flex-1 rounded-lg px-3 py-2" style={{ background: '#FDECEC' }}>
            <p className="font-mono text-[26px] font-bold leading-none" style={{ color: colors.danger }}>{n}</p>
            <p className="mt-1 text-[12px] font-semibold" style={{ color: colors.body }}>{l}</p>
          </div>
        ))}
      </div>
    )

  return (
    <>
      <div className="flex items-start gap-6">
        {/* THE PORTAL, drawn as it looks */}
        <div className="w-[700px] shrink-0 rounded-card bg-white shadow-card-soft ring-1 ring-line">
          <div className="flex items-center gap-3 border-b border-line px-4 py-2">
            <span className="text-[13px] font-bold" style={{ color: colors.brandDark }}>Coding Practice</span>
            <span className="text-[12px]" style={{ color: colors.muted }}>Loops · Question 4</span>
            <span className="ml-auto rounded-md px-2.5 py-1 text-[11px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>▶ Run</span>
            <span className="rounded-md px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: colors.success }}>Submit</span>
          </div>
          <div className="grid gap-3 px-4 py-3" style={{ gridTemplateColumns: '220px 1fr' }}>
            <div className="rounded-lg px-3 py-2.5" style={{ background: colors.surface }}>
              <p className="text-[13px] font-bold" style={{ color: colors.ink }}>Triangular Pattern with Numbers</p>
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: colors.body }}>Read a number N. Print a triangle of numbers in N rows. There is a space after every number.</p>
              <p className="mt-2 text-[9.5px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Sample input</p>
              <p className="rounded-md bg-white px-2 py-1 font-mono text-[12px]" style={{ color: colors.ink }}>4</p>
              <p className="mt-2 text-[9.5px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Sample output</p>
              <div className="rounded-md bg-white px-2 py-1">
                {SAMPLE_OUT.split('\n').map((l, i) => (
                  <p key={i} className="whitespace-pre font-mono text-[12px] leading-snug" style={{ color: colors.ink }}>{l}</p>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2.5">
              {k === 4 ? (
                <PlanBox />
              ) : (
                <div className="overflow-hidden rounded-lg" style={{ background: colors.night2, transition: tween }}>
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: colors.brand }} />
                    <span className="font-mono text-[11px] text-white/80">main.py</span>
                  </div>
                  <div className="px-3 py-2">
                    {code.map((l, i) => (
                      <p key={i} className="whitespace-pre font-mono text-[13.5px] leading-[1.55] text-white/90">
                        <span className="mr-3 inline-block w-3 text-right text-white/35">{i + 1}</span>
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {under}
              <Chips chips={CHIPS[k]} />
            </div>
          </div>
        </div>
        <BeatList beats={BEATS.map((label) => ({ label }))} at={k} numbered className="min-w-0 flex-1" />
      </div>
      <StepControls at={beat} total={BEATS.length} />
    </>
  )
}
