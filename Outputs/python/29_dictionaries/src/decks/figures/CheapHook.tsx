import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Group } from './common'
import { Appear, Fresh, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Board, NoteCard, toRows, type Row } from './board'
import { LIST_SM, TwoLists, type CellTone } from './CanteenHook'
import { HALF, Idling } from './Cast'
import { ANNA } from './people'
import { SPEC } from './spec'

/**
 * H2 · THE UNDER-15 BOARD, THE LONG WAY. Four presses.
 *
 * Anna with a small card for the exam week crowd. Press 2: the long way,
 * names and prices as two lists matched by position, and it works. Press 3:
 * bun goes into names only; six names, five prices; the loop runs off the
 * end of prices: IndexError. Press 4, the turn: the two lists zip into one
 * board, each name joined to its price, and the loop is for name, price in
 * menu.items(). All three programs are the spec's, run on CPython 3.12.3.
 */
const H2 = SPEC.H2
const [LISTS, BUN, BOARD] = H2.code as { file: string; src: string; output: string }[]
const NAMES: string[] = H2.data.names
const PRICES: number[] = H2.data.prices
const ROWS: Row[] = [...toRows(NAMES.map((n, i) => [n, PRICES[i]] as [string, number])), { key: 'bun', value: 10 }]

export function CheapHook() {
  const beat = useBeats(4)
  /* press 3: bun joins the names row, then the empty place under it shows red */
  const join = useStepPhase(beat, [300, 900])
  const prog = beat >= 4 ? BOARD : beat >= 3 ? BUN : LISTS
  const out = beat === 1 ? [] : prog.output.split('\n').map((t: string) => ({ text: t, tone: (/Error/.test(t) ? 'error' : 'plain') as 'error' | 'plain' }))
  const names = beat >= 3 && join >= 1 ? [...NAMES, 'bun'] : NAMES
  const nameTones: Record<string, CellTone> = {}
  const priceTones: Record<number, CellTone> = {}
  if (beat === 2) {
    for (let i = 0; i < 3; i++) {
      nameTones[NAMES[i]] = 'hit'
      priceTones[i] = 'hit'
    }
  }
  if (beat === 3 && join >= 2) nameTones.bun = 'bad'
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <div className="flex w-[730px] shrink-0 flex-col gap-2.5">
          <Group pad={10} active={beat === 2 || beat === 3}>
            {beat === 1 ? (
              <div className="grid h-[210px] place-items-start rounded-card px-5 py-4" style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                <span className="font-heading text-[22px] font-bold" style={{ color: colors.brandDark }}>
                  How would you print it with what you knew last month?
                </span>
              </div>
            ) : (
              <Fresh k={prog.file}>
                <CodePane code={prog.src} fontSize={CODE_FS} rows={6} at={beat === 3 ? 5 : undefined} stop={beat === 3} highlight={beat === 4 ? 3 : undefined} />
              </Fresh>
            )}
          </Group>
          <Group pad={10} className="flex min-h-0 flex-1 flex-col" active={beat === 4}>
            <OutPanel lines={out} minRows={4} fontSize={OUT_FS} />
          </Group>
        </div>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={beat === 1 || beat === 4}>
          <div className="flex min-h-0 flex-1 items-start justify-start pt-3">
            <Swap k={beat === 1 ? 'anna' : beat === 4 ? 'board' : 'lists'}>
              {beat === 1 ? (
                <div className="flex items-end gap-4">
                  <Idling cfg={ANNA} crop={HALF} scale={0.5} seed={9} apron />
                  <NoteCard title="Exam week" lines={['Under 15 rupees', '?']} width={190} />
                </div>
              ) : beat === 4 ? (
                <Appear>
                  <Board rows={ROWS} size="sm" name="menu" />
                </Appear>
              ) : (
                <TwoLists names={names} prices={PRICES} nameTones={nameTones} priceTones={priceTones} sz={LIST_SM} fresh={['bun']} ghosts={beat === 3 && join >= 2 ? 1 : 0} badIdx={beat === 3 && join >= 2 ? [5] : []} />
              )}
            </Swap>
          </div>
          <StepCaption text={H2.show[beat - 1]} size={16} minH={62} />
        </Group>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
