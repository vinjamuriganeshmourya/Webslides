import { CodeBlock, Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { ListBoxes, Note, OutPanel, Steps, TaskPill, type OutLine } from './pieces'
import { Lines } from './common'

/**
 * WORKSHEET TASK 1: PREDICT, THEN RUN. Spec card T1.
 *
 * The program with line numbers, the six Road Trip songs as boxes with
 * positions 0 to 5, a 4:00 timer and an empty terminal. Nothing about the
 * output shows until the timer has ended and the instructor presses: then
 * lines 2 to 6 light one per press, the cursor shows the position each one
 * reaches, the terminal adds the line and the why line says why. On line 6
 * the cursor goes past the last box and finds nothing there; the error is
 * shown exactly as Python prints it, and lines 2 to 5 stay, because Python
 * printed them first (the spec's must lines).
 */
export const SONGS = ['Chuttamalle', 'Hukum', 'Illuminati', 'Naatu Naatu', 'Kaavaalaa', 'Kesariya']
const CODE =
  'road_trip = ["Chuttamalle", "Hukum", "Illuminati", "Naatu Naatu", "Kaavaalaa", "Kesariya"]\nprint(len(road_trip))\nprint(road_trip[1])\nprint(road_trip[0], road_trip[5])\nprint(road_trip[len(road_trip) - 1])\nprint(road_trip[6])'

/* line, the positions the cursor reaches, what the terminal adds, the why line (rule 36 applied) */
const LINES = [
  { line: 2, reach: [] as number[], out: '6', why: ['Six songs, so len gives 6'] },
  { line: 3, reach: [1], out: 'Hukum', why: ['Positions start at 0, so position 1 is the second song'] },
  { line: 4, reach: [0, 5], out: 'Chuttamalle Kesariya', why: ['Position 0 is the first song and position 5 is the last'] },
  { line: 5, reach: [5], out: 'Kesariya', why: ['len is 6, so this is road_trip[5], the last song'] },
  { line: 6, reach: [6], out: 'IndexError: list index out of range', why: ['The last position is 5', 'There is no position 6, so Python stops with an error'] },
]

export function Task1() {
  const beat = useBeats(6)
  const k = beat - 2 /* -1 = the task, 0..4 = lines 2..6 */
  const cur = k >= 0 ? LINES[k] : null
  const outLines: OutLine[] = LINES.slice(0, Math.max(0, k + 1)).map((l) => ({ text: l.out, tone: l.line === 6 ? 'error' : 'plain' }))
  const states: Record<number, 'now' | 'plain'> = {}
  cur?.reach.forEach((p) => {
    if (p < SONGS.length) states[p] = 'now'
  })
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-6">
          <div className="w-[820px] shrink-0">
            <CodeBlock code={CODE} filename="Python" chip={false} fontSize={13} rows={6} lines={cur ? { [cur.line]: cur.line === 6 ? 'error' : 'now' } : {}} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
            <TaskPill>Worksheet · Task 1</TaskPill>
            <Steps size={16} items={['Open Task 1 on your worksheet', <Lines lines={['Type what lines 2 to 6 print', 'Do not run it yet']} />, 'Then type it in the playground, run it, and compare']} />
            <Countdown seconds={240} />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="flex w-[760px] shrink-0 flex-col gap-2">
            <ListBoxes
              items={SONGS}
              size="xs"
              width={104}
              ghosts={1}
              ghostStates={cur?.line === 6 ? { 6: 'wall' } : {}}
              states={states}
              cursor={cur && cur.reach.length ? cur.reach[cur.reach.length - 1] : null}
              cursorDown
            />
            <Note lines={cur ? cur.why : ['Type first, then run']} size={16} on />
          </div>
          <OutPanel title="Terminal" lines={outLines} minRows={5} fontSize={14} className="flex-1" />
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
