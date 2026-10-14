import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Group } from './common'
import { Appear, Ask, Fresh, OutPanel, sentences, OUT_FS, CODE_REF_FS } from './pieces'
import { useStepPhase } from './phase'
import { CodePane, StepCaption } from './trace'
import { Row, flyFrom, py } from './rows'
import { SPEC } from './spec'

/**
 * RECAP: CHANGES THE LIST, OR GIVES BACK AN ANSWER? Spec card S-RECAP, seven
 * presses, format "sort".
 *
 * Teja's party queue as a list row (handles), two bins and six code chips in
 * a tray. Press 1 is the question; each press after it files one chip into
 * its bin, flying from its place in the tray. Beside the bins, the chip that
 * just ran, the queue row as it is after that chip (`queue_after`), what the
 * chip gave back, and its why line. Every chip runs on the queue as it was
 * at the start, so the row resets between chips (its must line); sorted's
 * row stays unsorted. `Bins` is reused on C9.
 */
const R = SPEC['S-RECAP']
type Chip = { chip: string; bin: string; gives_back: string; queue_after: string; why: string }
const CHIPS: Chip[] = R.data.chips
const BINS: string[] = R.data.bins
const QUEUE: string[] = R.data.queue

/** `['Naatu Naatu', 'Kissik']` as its items. */
export const itemsOf = (list: string) => [...list.matchAll(/'([^']*)'/g)].map((m) => m[1])

/** A code chip: mono, white, a hairline. `ghost` is the dashed place a chip left. */
export function CodeChip({ children, ghost = false, refEl, tone = 'plain' }: { children: ReactNode; ghost?: boolean; refEl?: (el: HTMLSpanElement | null) => void; tone?: 'plain' | 'bounce' }) {
  return (
    <span
      ref={refEl}
      className="inline-flex h-[38px] items-center whitespace-nowrap rounded-lg px-3 font-mono text-[15px] font-semibold"
      style={{
        background: ghost ? 'transparent' : colors.white,
        color: ghost ? 'transparent' : tone === 'bounce' ? colors.danger : colors.brandDark,
        boxShadow: ghost ? 'none' : `inset 0 0 0 1.5px ${tone === 'bounce' ? colors.danger : colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)`,
        outline: ghost ? `1.5px dashed ${colors.line}` : 'none',
        outlineOffset: -1.5,
      }}
    >
      {children}
    </span>
  )
}

/** A chip that has just been filed: it flies in from where it was. */
function FiledChip({ text, from, fly }: { text: string; from: HTMLElement | null; fly: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (fly && !instant) flyFrom(ref.current, from, 820)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <CodeChip refEl={(el) => (ref.current = el)}>{text}</CodeChip>
}

/** The two bins. `items` holds what each has received, in order. */
export function Bins({ items, width = 300, minH = 170, lit }: { items: { text: string; bin: number; from?: HTMLElement | null; fly?: boolean }[]; width?: number; minH?: number; lit?: number }) {
  const tween = useTween(420)
  return (
    <div className="flex gap-4">
      {BINS.map((b, k) => (
        <div
          key={b}
          className="flex flex-col gap-2 rounded-card px-3 pb-3 pt-2"
          style={{ width, minHeight: minH, background: colors.surface2, boxShadow: `inset 0 0 0 ${lit === k ? 3 : 2}px ${lit === k ? colors.brand : colors.line}`, transition: tween }}
        >
          <span className="font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
            {b}
          </span>
          {items
            .filter((it) => it.bin === k)
            .map((it) => (
              <FiledChip key={it.text} text={it.text} from={it.from ?? null} fly={!!it.fly} />
            ))}
        </div>
      ))}
    </div>
  )
}

export function RecapSort() {
  const beat = useBeats(7)
  const filed = beat - 1 /* chips filed so far */
  const cur = filed >= 1 ? CHIPS[filed - 1] : null
  const tray = useRef<(HTMLSpanElement | null)[]>([])
  const row = cur ? itemsOf(cur.queue_after) : QUEUE
  /* the last press: the chip flies from the tray first, then the tray gives way to the program (G2) */
  const phase = useStepPhase(beat, [1250])
  const trayOn = filed < CHIPS.length || phase < 1
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[540px] shrink-0 flex-col gap-3" active={beat === 1}>
          <Ask size={18}>{R.show[1]}</Ask>
          <span className="font-heading text-[16px] font-semibold" style={{ color: colors.body }}>
            <Lines lines={sentences(R.show[0])} />
          </span>
          <div className="flex min-h-[44px] items-center gap-3">
            {cur && (
              <span key={cur.chip} className="sm-bump rounded-lg bg-white px-3 py-1.5 font-mono text-[19px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
                {cur.chip}
              </span>
            )}
          </div>
          <span className="-mb-1 font-mono text-[15px] font-bold" style={{ color: colors.muted }}>
            queue
          </span>
          {/* each chip runs on the queue as it was at the start: the row eases into the chip's result */}
          <Fresh k={cur?.chip ?? 'start'}>
            <Row items={row.map(py)} kind="list" size="sm" fit states={cur && cur.queue_after !== `[${QUEUE.map(py).join(', ')}]` ? Object.fromEntries(row.map((_, i) => [i, 'new'])) : {}} />
          </Fresh>
          <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ minHeight: 48, background: cur ? colors.white : 'transparent', boxShadow: cur ? `inset 0 0 0 1.5px ${colors.line}` : 'none' }}>
            {cur && (
              <>
                <span className="shrink-0 text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                  gives back
                </span>
                <span key={cur.chip} className="sm-bump font-mono text-[17px] font-bold" style={{ color: colors.accentDark }}>
                  {cur.gives_back}
                </span>
              </>
            )}
          </div>
          <StepCaption text={cur?.why ?? null} tone="rule" size={17} minH={64} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4" active={beat > 1}>
          {/* the tray: a chip that has been filed leaves a dashed place behind */}
          {/* the tray, and on the last press the recap's own program in its place: a cross-fade, never a swap */}
          <div className="grid">
            <div className="col-start-1 row-start-1 grid grid-cols-2 content-start gap-x-3 gap-y-2.5" style={{ opacity: trayOn ? 1 : 0, transition: 'opacity 520ms cubic-bezier(0.22,1,0.36,1)' }}>
              {CHIPS.map((c, i) => (
                <span key={c.chip}>
                  <CodeChip ghost={i < filed} refEl={(el) => (tray.current[i] = el)}>
                    {c.chip}
                  </CodeChip>
                </span>
              ))}
            </div>
            {!trayOn && (
              /* the program C1 opens on, with its None */
              <Appear className="col-start-1 row-start-1 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <CodePane code={R.code[0].src} fontSize={CODE_REF_FS} />
                </div>
                <OutPanel lines={[{ text: R.code[0].output }]} fontSize={OUT_FS} className="w-[112px] shrink-0" />
              </Appear>
            )}
          </div>
          <Bins width={282} minH={186} lit={cur ? BINS.indexOf(cur.bin) : undefined} items={CHIPS.slice(0, filed).map((c, i) => ({ text: c.chip, bin: BINS.indexOf(c.bin), from: tray.current[i], fly: i === filed - 1 }))} />
        </Group>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
