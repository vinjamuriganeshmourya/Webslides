import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatList } from './BeatList'
import { Lines } from './common'
import { Laptop, LoginScreen } from './Laptop'
import { Tile, TileRow, code } from './tiles'

/**
 * THE PASSWORD THAT SAYS WRONG. PF 18 slide 4, the hook.
 *
 * Five beats, the reference's own: the password typed from memory, the
 * refusal, the eye (Caps Lock was on), the two words side by side, and the
 * numbers. The word `Unicode` is not on this frame (course rule R5): the room
 * has to want "why is S not s" before it is told the two are different numbers.
 *
 * Every beat stays listed beside the laptop (course rule R5b): the current one
 * is lit, the spent ones dim. The tiles arrive on beat 3, the numbers on 5.
 */
const SAVED = 'sunny@123'
const TYPED = 'SUNNY@123'

/* Content rule 36: a caption that held two sentences is two lines. Beat 2
   stays one line: `Enter.` is the key press and the quoted dialog is the
   screen's own text. */
const BEATS = [
  { label: <Lines lines={['You type your laptop password', 'You know it by heart']} /> },
  { label: <>Enter. “The password is incorrect.” Why?</> },
  { label: <Lines lines={['Tap the eye', 'Caps Lock was on']} /> },
  { label: <Lines lines={['Put them side by side', 'Which letters are different?']} /> },
  { label: <Lines lines={['Every letter is stored as a number', 'S and s are different']} /> },
]

export function PasswordHook() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const shown = beat >= 3
  const numbered = beat >= 5
  const state = (i: number) => (!shown ? 'empty' : !numbered ? 'plain' : SAVED[i] !== TYPED[i] ? 'bad' : 'good')
  return (
    <>
      <div className="flex items-start gap-12">
        <Laptop width={330} capsOn={beat >= 3}>
          <LoginScreen name="Sunny" typed={TYPED} revealed={beat >= 3} dialog={beat === 2} capsNote={beat >= 3} />
        </Laptop>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <BeatList beats={BEATS} at={beat - 1} numbered compact />
          <div className="flex flex-col gap-1" style={{ opacity: shown ? 1 : 0.7, transition: tween }}>
            {(['saved', 'typed'] as const).map((row, r) => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-[56px] text-right text-[15px] font-bold" style={{ color: colors.muted }}>
                  {row}
                </span>
                <div className="flex flex-col">
                  {r === 1 && (
                    <TileRow size="xs" className="mb-0.5 h-[18px] items-center">
                      {[...SAVED].map((c, i) => (
                        <span key={i} className="grid w-[46px] place-items-center font-mono text-[17px] font-bold leading-none" style={{ color: c !== TYPED[i] ? colors.danger : colors.success, opacity: numbered ? 1 : 0, transition: tween }}>
                          {c !== TYPED[i] ? '≠' : '='}
                        </span>
                      ))}
                    </TileRow>
                  )}
                  <TileRow size="xs">
                    {[...(r === 0 ? SAVED : TYPED)].map((c, i) => (
                      <Tile key={i} size="xs" ch={shown ? c : ''} code={numbered ? code(c) : undefined} state={state(i)} />
                    ))}
                  </TileRow>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
