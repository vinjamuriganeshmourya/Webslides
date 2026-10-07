import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, Option, sentences } from './pieces'

/**
 * EXIT: WHICH ONE PRINTS NO SONG? Spec card X1, one hard question.
 *
 * The program with line numbers, the question, three options as values and a
 * 2:30 timer. On the second press the right option marks and every option
 * shows what it prints and why. The options are clickable so the room's pick
 * is locked in; the press never waits for a pick. Real runs: a = 1, b = 2
 * prints Hukum; 4, 2 prints nothing; 5, 6 prints Kesariya.
 */
const CODE = 'road_trip = ["Chuttamalle", "Hukum", "Illuminati", "Naatu Naatu", "Kaavaalaa", "Kesariya"]\nfor song in road_trip[a:b]:\n    print(song)'
const OPTIONS = [
  { v: 'a = 1, b = 2', prints: 'prints Hukum', why: 'Start 1, stop before 2: one song, Hukum. Only the stop is left out, not the start.' },
  { v: 'a = 4, b = 2', prints: 'prints nothing', why: 'Start at 4 and the stop, 2, is already behind you. The slice is empty, so the loop never runs.' },
  { v: 'a = 5, b = 6', prints: 'prints Kesariya', why: 'Position 5 is Kesariya. road_trip[6] crashes, but a slice that stops at 6 is fine.' },
]
const RIGHT = 1

export function ExitVote() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-[19px] leading-snug" style={{ color: colors.body }}>
          <Lines lines={['Your app plays a part of the Road Trip songs']} />
        </p>
        <div className="w-[940px]">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={14} rows={3} />
        </div>
        <div className="flex items-start gap-8">
          <div className="flex w-[300px] shrink-0 flex-col gap-3">
            <Ask size={20}>Which values of a and b print no song at all?</Ask>
            <Countdown seconds={150} />
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-3">
            {OPTIONS.map((o, i) => (
              <Option
                key={o.v}
                letter={'ABC'[i]}
                picked={pick === i}
                right={i === RIGHT}
                shown={shown}
                onPick={() => setPick(i)}
                size={18}
                detail={
                  <span className="block">
                    <span className="block font-mono font-bold" style={{ color: i === RIGHT ? '#137A3A' : colors.ink }}>
                      {o.prints}
                    </span>
                    <Lines lines={sentences(o.why)} />
                  </span>
                }
              >
                {o.v}
              </Option>
            ))}
          </div>
        </div>
      </div>
      {shown && pick === RIGHT && <Confetti seed={61} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
