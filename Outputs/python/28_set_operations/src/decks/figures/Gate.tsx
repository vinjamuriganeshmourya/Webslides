import { useRef } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Group } from './common'
import { Show, Swap, CODE_REF_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { CSE, Chip, DANCE, HOUSE, Pool, Venn, pair, type ChipTone } from './venn'
import { SPEC } from './spec'

/**
 * E1 · IN CSE? IN DANCE? Fourteen presses, one person per press.
 *
 * Press 1: four_rules.py with an empty output, the two source circles (cse
 * and the fest dance team), the gate with its two lamps, and four EMPTY
 * result circles, one per print line. Presses 2 to 12 follow `data.walk`:
 * one person steps up to the gate, each lamp lights yes or no, and a copy
 * flies from the person's own chip into every result circle that keeps them;
 * the others get a grey slot that stays grey to the end of the card (that
 * grey is the finding). Press 13: the four counts. Press 14: the four rules.
 * The source circles never lose a chip; no free code box, no picker.
 */
const E1 = SPEC.E1
type Walk = { person: string; in_cse: boolean; in_dance: boolean; kept_by: string[]; caption: string }
const WALK: Walk[] = E1.data.walk
const OPS: string[] = E1.data.ops
const COUNTS: Record<string, string> = E1.data.counts
const RULES: string[] = E1.show.slice(4, 8)

/* the source circles: radius 88, 100 apart, small chips */
const VW = 278
const VH = 204
const G = pair(VW, VH, 86, 106, 14)
const FS = 11

/** One lamp of the gate: its question, and yes or no once someone is under it. */
function Lamp({ q, on }: { q: string; on: boolean | null }) {
  const tween = useTween(420)
  const tone = on === null ? colors.line : on ? colors.success : colors.danger
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="grid h-[46px] w-[46px] place-items-center rounded-full font-heading text-[14px] font-bold"
        style={{ background: on === null ? colors.white : on ? '#E9F8EF' : '#FDECEC', color: on === null ? colors.muted : on ? '#137A3A' : colors.danger, boxShadow: `inset 0 0 0 3px ${tone}, 0 0 ${on ? 16 : 0}px ${on ? colors.success : 'transparent'}66`, transition: tween }}
      >
        {on === null ? '' : on ? 'yes' : 'no'}
      </span>
      <span className="whitespace-nowrap text-[14px] font-bold" style={{ color: colors.ink }}>
        {q}
      </span>
    </div>
  )
}

export function Gate() {
  const beat = useBeats(14)
  const step = beat >= 2 && beat <= 12 ? beat - 1 : 0 /* people through the gate on this press: 1 to 11 */
  const walked = beat >= 13 ? WALK.length : step
  const cur = step > 0 ? WALK[step - 1] : null
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const tones: Record<string, ChipTone> = cur ? { [cur.person]: 'lit' } : {}
  const caption = beat === 1 ? E1.show[0] : cur ? cur.caption : beat >= 13 ? E1.show[3] : null
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Group pad={10} className="flex items-stretch gap-3.5" active={beat === 1 || cur !== null}>
          <div className="w-[644px] shrink-0">
            <CodePane code={E1.code[0].src} fontSize={CODE_REF_FS} rows={6} />
          </div>
          <Venn W={VW} H={VH} L={G.L} R={G.R} left={{ code: 'cse', items: CSE }} right={{ code: 'dance', items: DANCE }} fs={FS} tones={tones} refs={refs} />
          <div className="flex w-[180px] shrink-0 flex-col items-center gap-2">
            <div className="grid h-[34px] place-items-center">
              <Swap k={cur?.person ?? 'none'}>{cur ? <Chip name={cur.person} fs={16} tone="lit" /> : <span className="text-[14px] font-semibold" style={{ color: colors.muted }}>the gate</span>}</Swap>
            </div>
            <div className="flex gap-2.5">
              <Lamp q={E1.show[1]} on={cur ? cur.in_cse : null} />
              <Lamp q={E1.show[2]} on={cur ? cur.in_dance : null} />
            </div>
            {/* a fixed box: the longest walk line ("Lakshmi: in cse? no") fits in three lines, so the group never grows (slide 13) */}
            <div className="h-[76px] w-full shrink-0">
              <StepCaption text={caption} size={13} minH={76} />
            </div>
          </div>
        </Group>
        <Group pad={8} className="grid gap-3" active={beat >= 13} style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          {OPS.map((op, k) => {
            const items = WALK.slice(0, walked).map((w) => ({ name: w.person, slot: !w.kept_by.includes(op), from: refs.current[w.person] }))
            return (
              <div key={op} className="flex flex-col items-center gap-1">
                <div className="flex h-[24px] items-center gap-2">
                  <span className="whitespace-nowrap font-mono text-[15px] font-bold" style={{ color: colors.brandDark }}>
                    {op}
                  </span>
                  <Show on={beat >= 13}>
                    <span className="rounded-md px-2 font-mono text-[15px] font-bold leading-[22px]" style={{ background: '#E9F8EF', color: '#137A3A', boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                      {COUNTS[op]}
                    </span>
                  </Show>
                  <Show on={beat >= 14}>
                    <span className="whitespace-nowrap text-[13px] font-bold" style={{ color: colors.accentDark, transition: `opacity 420ms ${HOUSE} ${k * 130}ms` }}>
                      {RULES[k]}
                    </span>
                  </Show>
                </div>
                <Pool items={items} rx={134} ry={56} fs={FS} stagger={0} lit={cur !== null && cur.kept_by.includes(op)} />
              </div>
            )
          })}
        </Group>
      </div>
      <StepControls at={beat} total={14} />
    </>
  )
}
