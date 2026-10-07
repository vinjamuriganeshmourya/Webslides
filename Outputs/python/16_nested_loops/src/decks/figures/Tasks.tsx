import { colors } from '@/design/tokens'
import { Countdown } from '@/ui'
import { IoPanels } from './IoPanels'

/**
 * SOLVE IT YOURSELF FIRST. PF 16 slide 14: the problem on the left as the
 * question frames stated it, and on the right what the room does for five
 * minutes before the solution is shown (Merrill's Application, placed before
 * the Demonstration because the reference puts it there). The timer starts
 * when the instructor presses play.
 */
const STEPS = [
  'Open the code playground',
  <>Write a program that reads <b>N</b> and prints this triangle</>,
  <>Run it with <b>3</b>, then with <b>4</b></>,
  <>Stuck? Write the rows for 3 by hand first, then look for what repeats</>,
]

export function SolveFirst() {
  return (
    <div className="flex items-start gap-10 [&_b]:font-bold [&_b]:text-ink">
      <div className="flex w-[560px] shrink-0 flex-col gap-3">
        <p className="font-heading text-[24px] font-bold" style={{ color: colors.brandDark }}>Triangular pattern with numbers</p>
        <IoPanels row panels={[{ label: 'Input', text: '4' }, { label: 'Output', text: '1 \n1 2 \n1 2 3 \n1 2 3 4 ' }]} />
        <p className="text-[17px] italic" style={{ color: colors.muted }}>There is a space after every number</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.warning }}>Your turn · 5 minutes</span>
        <ol className="flex flex-col gap-1.5">
          {STEPS.map((t, i) => (
            <li key={i} className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
              <b className="w-5 shrink-0">{i + 1}.</b>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <Countdown seconds={300} />
      </div>
    </div>
  )
}
