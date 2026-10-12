import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Appear, BigLine, Swap } from './pieces'
import { Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, menuRows, type Row, type RowTone, type Search } from './board'
import { BoardCard, DeckLine } from './frame'
import { Face } from './people'
import { SPEC } from './spec'

/**
 * LOOKING UP A PRICE: C5 ([ ] takes the name), C6 (KeyError or None), C7
 * (in checks the names). The board keeps every row the whole card; a lifted
 * card is a copy; a search walks the tag column only, in its own lane.
 * Every program and output is the spec's, run on CPython 3.12.3.
 */
const MENU: Row[] = menuRows(SPEC)
const N = MENU.length
const LANE = 118
/** the finger's walk: one row at a time, then past the last tag */
const walkDelays = (stopAt: number) => [300, ...Array.from({ length: stopAt }, () => 420)]

/** The finger's state for a walk that has got `p` phases in: stopped on `found`, or past the end with `miss`. */
function searching(label: string, p: number, found: number | null, miss: 'alarm' | 'quiet'): Search | null {
  if (p === 0) return null
  const at = p - 1
  if (found !== null) return at >= found ? { label, at: found, found: true } : { label, at }
  return at >= N ? { label, at: N, miss } : { label, at }
}

/** A short run beside a vote: the one line that matters and what it printed (C6's tea_get.py). */
function MiniRun({ file, line, output }: { file: string; line: string; output: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {file}
      </span>
      <span className="whitespace-pre rounded-lg px-3 py-1 font-mono text-[15px] font-semibold" style={{ background: colors.night2, color: colors.white }}>
        {line}
      </span>
      <span className="font-heading text-[16px] font-bold" style={{ color: colors.muted }}>
        prints
      </span>
      <span className="whitespace-pre rounded-md px-2.5 py-0.5 font-mono text-[15px] font-bold" style={{ background: '#E9F8EF', color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
        {output}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ C5 */

const C5 = SPEC.C5
const [SAMOSA, THIRD] = C5.code as { file: string; src: string; output: string }[]
const OPTS5: string[] = C5.show.slice(3, 6)
const RIGHT5 = OPTS5.indexOf(THIRD.output)

/**
 * C5, four presses: the full board and samosa.py with the deck's
 * `dict_name[key]`. Press 2 lights the samosa tag and lifts a copy of its
 * card: 15. Press 3 is third.py, menu[2], and the vote. Press 4 walks the
 * tag column for a tag called 2, finds none, and stops: KeyError: 2.
 */
export function Bracket() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 4
  const walk = useStepPhase(beat, walkDelays(N))
  const tones: Record<string, RowTone> = {}
  if (beat === 2) tones.samosa = 'lit'
  const search = beat === 4 ? searching('2', walk, null, 'alarm') : null
  const prog = beat >= 3 ? THIRD : SAMOSA
  const err = beat === 4
  const out = beat === 2 ? [{ text: SAMOSA.output }] : beat === 4 ? [{ text: THIRD.output, tone: 'error' as const }] : []
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={2}
        at={err ? 2 : null}
        stop={err}
        asking={beat === 3}
        ask={
          <div className="flex items-center gap-4">
            <BigLine size={20}>{C5.show[0]}</BigLine>
            {beat >= 3 && (
              <Appear>
                <span className="font-heading text-[19px] font-bold" style={{ color: colors.brandDark }}>
                  {C5.show[2].replace(/\.$/, '')}
                </span>
              </Appear>
            )}
          </div>
        }
        vote={beat >= 3 ? <Vote options={OPTS5} right={RIGHT5} shown={shown} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense /> : undefined}
        out={out}
        note={beat === 4 ? <DeckLine text={C5.show[6]} /> : undefined}
        board={<Board rows={MENU} tones={tones} size="lg" name="menu" lift={beat === 2 ? 'samosa' : null} search={search} lane={LANE} />}
        boardActive={beat === 2 || beat === 4}
        caption={beat === 1 ? C5.show[1] : beat === 2 ? null : beat === 3 ? C5.show[2] : C5.show[6]}
        captionTone={beat === 4 ? 'rule' : 'step'}
      />
      {shown && pick === RIGHT5 && <Confetti seed={15} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C6 */

const C6 = SPEC.C6
const [DOSA, DOSA_GET, TEA_GET] = C6.code as { file: string; src: string; output: string }[]
const OPTS6: string[] = C6.show.slice(3, 6)
const RIGHT6 = OPTS6.indexOf(DOSA_GET.output)

/**
 * C6, four presses: Kiran asks for dosa; dosa.py. Press 2 walks the tags,
 * finds no dosa tag and the alarm stops the program: KeyError: 'dosa'.
 * Press 3 is dosa_get.py and the vote. Press 4 walks again and comes back
 * empty-handed with no alarm: None; and tea_get.py beside it prints 12.
 */
export function GetOrError() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 4
  const walk = useStepPhase(beat, walkDelays(N))
  const search = beat === 2 ? searching('"dosa"', walk, null, 'alarm') : beat === 4 ? searching('"dosa"', walk, null, 'quiet') : null
  const prog = beat >= 3 ? DOSA_GET : DOSA
  const out = beat === 2 ? [{ text: DOSA.output, tone: 'error' as const }] : beat === 4 ? [{ text: DOSA_GET.output }] : []
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={2}
        at={beat === 2 ? 2 : null}
        stop={beat === 2}
        asking={beat === 3}
        ask={beat >= 3 ? C6.show[2] : undefined}
        vote={
          beat >= 3 ? (
            <Swap k={beat === 4 ? 'tea' : 'vote'}>
              {beat === 4 ? <MiniRun file={TEA_GET.file} line={TEA_GET.src.split('\n')[1]} output={TEA_GET.output} /> : <Vote options={OPTS6} right={RIGHT6} shown={shown} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />}
            </Swap>
          ) : undefined
        }
        out={out}
        note={beat === 2 ? <DeckLine text={C6.show[1]} /> : beat === 4 ? <DeckLine text={C6.show[6]} /> : undefined}
        board={
          <div className="flex flex-col items-center gap-2">
            <Board rows={MENU} size="lg" name="menu" search={search} lane={LANE} />
            {/* Kiran at the counter: under the board and centred on it. Beside the board there is no room in the
                column, and the bubble ran off the slide's right edge (fix pass, 2026-10-12). */}
            {beat === 1 && (
              <Appear className="flex items-center gap-2">
                <Face name="Kiran" size={44} />
                <span className="whitespace-nowrap rounded-xl rounded-bl-none bg-white px-3 py-1.5 font-heading text-[15px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                  dosa?
                </span>
              </Appear>
            )}
          </div>
        }
        boardActive={beat === 2 || beat === 4}
        caption={beat === 1 ? C6.show[0] : beat === 2 ? C6.show[1] : beat === 3 ? C6.show[2] : C6.show[6]}
        captionTone={beat === 2 || beat === 4 ? 'rule' : 'step'}
      />
      {shown && pick === RIGHT6 && <Confetti seed={16} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C7 */

const C7 = SPEC.C7
const IN_MENU = C7.code[0] as { file: string; src: string; output: string }
const ANSWERS: string[] = IN_MENU.output.split('\n')
/** what each print line looks for, and the row it finds (or none) */
const CHECKS: { label: string; found: number | null }[] = [
  { label: '"samosa"', found: MENU.findIndex((r) => r.key === 'samosa') },
  { label: '15', found: null },
  { label: '"Samosa"', found: null },
]

/**
 * C7, five presses: in_menu.py with three print lines, each output empty.
 * Presses 2 to 4: the searched word walks down the tag column only (the
 * price column stays dim) and the line fills: True, False, False. Press 5
 * is the deck's line and the caption.
 */
export function InChecks() {
  const beat = useBeats(5)
  const k = beat - 2 /* which check is walking */
  const check = k >= 0 && k < 3 ? CHECKS[k] : null
  const walk = useStepPhase(beat, walkDelays(check?.found !== null && check?.found !== undefined ? check.found : N))
  const search = check ? searching(check.label, walk, check.found, 'quiet') : null
  const tones: Record<string, RowTone> = {}
  if (search?.found) tones[MENU[check!.found!].key] = 'lit'
  const filled = Math.min(Math.max(beat - 1, 0), 3)
  const out = ANSWERS.slice(0, filled).map((t) => ({ text: t }))
  return (
    <>
      <BoardCard
        code={IN_MENU.src}
        rows={4}
        at={check ? k + 2 : null}
        asking={beat === 1}
        ask={beat === 1 ? C7.show[1] : undefined}
        out={out}
        outMinRows={3}
        note={beat === 5 ? <DeckLine text={C7.show[0]} /> : undefined}
        board={<Board rows={MENU} tones={tones} size="lg" name="menu" search={search} lane={LANE} dimCards={beat >= 2 && beat <= 4} />}
        boardActive={beat >= 2 && beat <= 4}
        caption={beat === 1 ? C7.show[1] : beat === 5 ? C7.show[2] : check ? `${IN_MENU.src.split('\n')[k + 1]}` : null}
        badge={check ? `line ${k + 2}` : null}
        captionTone={beat === 5 ? 'rule' : 'step'}
      />
      <StepControls at={beat} total={5} />
    </>
  )
}
