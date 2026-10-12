import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus } from './common'
import { Note, OutPanel, Show, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { TwoCols } from './DictCards'
import { Board, type Row, type RowTone, type SheetSpec, type TagSpec } from './sheet'
import { SPEC } from './spec'

/**
 * EXPLAINER E1: REMOVE THE UNPAID. Twenty-two presses, format "walk".
 *
 * Press 1: remove_unpaid.py and the four-row sheet; the room writes what it
 * prints. Presses 2 to 7 (walk_v1): one line per press, the dot on the row
 * the loop is at, a deleted row vanishes from the sheet at once, and Python
 * stops on line 2 with RuntimeError. Press 8: the deck's line. Press 9: the
 * fixed program, backup beside trip, the dot on backup. Presses 10 to 22
 * (walk_v2): the dot walks the copy row by row while rows vanish from trip;
 * backup keeps all four rows to the end. Every step is the spec's
 * (`data.walk_v1`, `data.walk_v2`); both programs ran on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
type Walk = { line: number; name: string | null; trip: [string, number][]; backup: [string, number][] | null; caption: string; printed: string }
const E1 = SPEC.E1
const P0: Prog = E1.code[0]
const P1: Prog = E1.code[1]
const V1: Walk[] = E1.data.walk_v1
const V2: Walk[] = E1.data.walk_v2
const RULE_AT = 2 + V1.length /* 8 */
const FIX_AT = RULE_AT + 1 /* 9 */
const TOTAL = FIX_AT + V2.length /* 22 */
const TITLE = 'Ooty trip money'
const COPY_TITLE = `Copy of ${TITLE}`

export function Loop() {
  const beat = useBeats(TOTAL)
  const inV1 = beat >= 2 && beat < RULE_AT
  const inV2 = beat > FIX_AT
  const step: Walk | null = inV1 ? V1[beat - 2] : inV2 ? V2[beat - FIX_AT - 1] : null
  const fixed = beat >= FIX_AT
  const lastV1 = V1[V1.length - 1]
  const tripRows: Row[] = step ? step.trip : beat === RULE_AT ? lastV1.trip : fixed ? V2[0].trip : V1[0].trip
  const backupRows: Row[] | null = fixed ? (step?.backup ?? V2[0].backup) : null
  const ended = !!step && (/no names left/.test(step.caption) || !!step.printed)
  const dotName = step && !ended ? step.name : null
  const dotIn = (rows: Row[]) => (dotName ? rows.findIndex(([n]) => n === dotName) : -1)
  const tripDot = inV1 ? dotIn(tripRows) : -1
  const backupDot = inV2 && backupRows ? dotIn(backupRows) : -1
  const printed = step?.printed ?? (beat === RULE_AT ? lastV1.printed : '')
  const out: OutLine[] = printed ? [{ text: printed, tone: /Error/.test(printed) ? 'error' : 'plain' }] : []
  const err = /Error/.test(printed)
  const at = step ? step.line : beat === RULE_AT ? lastV1.line : beat === FIX_AT ? 2 : undefined
  const caption = beat === 1 ? `${E1.show[0]} ${E1.show[1]}` : beat === RULE_AT ? E1.show[2] : step ? step.caption : null
  const sheets: SheetSpec[] = [
    { id: 'trip', title: TITLE, rows: tripRows, dot: tripDot >= 0 ? tripDot : null, tones: tripDot >= 0 ? { [dotName!]: 'now' as RowTone } : {} },
    ...(backupRows ? [{ id: 'backup', title: COPY_TITLE, rows: backupRows, dot: backupDot >= 0 ? backupDot : null, tones: backupDot >= 0 ? { [dotName!]: 'now' as RowTone } : {}, stagger: beat === FIX_AT } as SheetSpec] : []),
  ]
  const tags: TagSpec[] = [{ name: 'trip', to: 'trip' }, ...(backupRows ? [{ name: 'backup', to: 'backup' } as TagSpec] : [])]
  return (
    <>
      <TwoCols
        leftW={610}
        height={401}
        asking={beat === 1}
        drawing={beat > 1}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={fixed ? P1.src : P0.src} fontSize={CODE_FS} rows={6} at={at} stop={err && at === lastV1.line && !fixed} />
            </Focus>
            <OutPanel lines={out} minRows={1} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <StepCaption text={caption} tone={beat === RULE_AT ? 'rule' : 'step'} size={16} minH={86} />
            <Board lane gap={30} sheets={sheets} tags={tags} minRows={4} />
            <Show on={beat === TOTAL}>
              <Note lines={[E1.show[3]]} size={15} />
            </Show>
          </>
        }
      />
      <StepControls at={beat} total={TOTAL} />
    </>
  )
}
