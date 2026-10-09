import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, sentences } from './pieces'
import { CodePane, Vote } from './trace'
import { CODE_FS } from './Methods'
import { SPEC } from './spec'

/**
 * THE CLOSE: X1 (exit, keep Kissik at 2) and K1 (today, in six examples).
 * Code, options, outputs and why lines are the spec's, run on CPython 3.12.3.
 */

/* ================================================================== X1 */

type XOpt = { line3_index: string; prints: string; why: string }

export function ExitQueue() {
  const X1 = SPEC.X1
  const opts: XOpt[] = X1.data.options
  const right = 'ABCD'.indexOf(X1.data.right)
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[20px] font-semibold leading-snug" style={{ color: colors.body }}>
          <Lines lines={sentences(X1.show[0])} />
        </p>
        {/* the program and the question, then the four answers side by side under them: two clusters, two groups (PF 24's rule G3) */}
        <div className="flex items-stretch gap-[22px]">
          <Group pad={8} className="w-[613px] shrink-0">
            {/* the program the room is asked about, ringed until the answer shows (PF 24's Focus) */}
            <Focus on={!shown}>
              <CodePane code={X1.code[0].src} fontSize={CODE_FS} highlight={3} />
            </Focus>
          </Group>
          <Group pad={14} className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3">
            <Ask size={24}>{X1.show[1]}</Ask>
            <Countdown seconds={X1.timer} />
          </Group>
        </div>
        <Group pad={10}>
          <Vote
            options={opts.map((o) => o.line3_index)}
            right={right}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={4}
            size={18}
            dense
            details={opts.map((o, i) => (
              <span key={i} className="block text-[14.5px]">
                <span className="block whitespace-nowrap font-mono text-[15px] font-bold leading-snug" style={{ color: i === right ? colors.success : colors.ink }}>
                  prints {o.prints}
                </span>
                <Lines lines={sentences(o.why)} />
              </span>
            ))}
          />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={28} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== K1 */

type Ex = { file: string; src: string; output: string }

function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative rounded-lg px-3 pb-1.5 pt-4" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10.5px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      <div className="font-mono text-[13px] leading-[19px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

function Slot({ n, ex, sentence, open, said, onSay }: { n: number; ex: Ex; sentence: string; open: boolean; said: boolean; onSay: () => void }) {
  const tween = useTween(480)
  return (
    <div
      className="flex h-full flex-col gap-1 rounded-card px-3 py-2"
      style={{
        background: open ? colors.white : 'transparent',
        boxShadow: open ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: open ? colors.brandDark : colors.surface2, color: open ? colors.white : colors.muted }}>
          {n + 1}
        </span>
        <span className="font-heading text-[15px] font-bold leading-tight" style={{ color: colors.ink, opacity: open ? 1 : 0, transition: tween }}>
          {ex.file}
        </span>
      </div>
      {open && (
        <div className="sm-bump flex min-h-0 flex-1 flex-col gap-1">
          <MiniCode src={ex.src} />
          <button
            type="button"
            disabled={said}
            onClick={onSay}
            onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
            className="self-start rounded-md px-2 py-0.5 text-left font-mono text-[13px] font-bold leading-[18px]"
            style={{ background: said ? `${colors.success}1A` : 'transparent', color: colors.ink, boxShadow: said ? `inset 0 0 0 1.5px ${colors.success}` : `inset 0 0 0 1.5px ${colors.line}`, transition: tween, minWidth: 120 }}
          >
            {said ? (
              ex.output.split('\n').map((l, i) => (
                <span key={i} className="block whitespace-pre">
                  {l}
                </span>
              ))
            ) : (
              <span className="font-sans text-[13px] font-semibold italic" style={{ color: colors.muted }}>
                Shout it first
              </span>
            )}
          </button>
          <span className="text-[13px] font-semibold leading-[16px]" style={{ color: colors.body, opacity: said ? 1 : 0, transition: tween }}>
            <Lines lines={sentences(sentence)} />
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * K1, six presses: press n opens example n (its heading and code; the result
 * empty); the room shouts the output; the NEXT press fills example n's result
 * and sentence as it opens example n + 1. The last example's result fills on
 * a tap of its empty box (or End), since the spec gives the card six presses.
 * All six slots are there, empty and numbered, from press 1 (its must lines).
 */
export function Takeaways() {
  const K1 = SPEC.K1
  const examples: Ex[] = K1.code
  const SENTENCES: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)
  const beat = useBeats(6)
  const [lastSaid, setLastSaid] = useState(false)
  useEffect(() => {
    if (beat < 6) setLastSaid(false)
    /* End shows the whole card (build contract 3): on the last press it fills the last result too */
    const onKey = (e: KeyboardEvent) => e.key === 'End' && beat === 6 && setLastSaid(true)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beat])
  const [tapped, setTapped] = useState<Record<number, boolean>>({})
  return (
    <>
      {/* unequal outer columns, so the middle one is not read as a centred block (content rule 38) */}
      <div className="grid gap-x-3 gap-y-2" style={{ gridTemplateColumns: '372px 400px 354px', gridTemplateRows: '206px 206px' }}>
        {examples.map((ex, i) => (
          <Slot
            key={ex.file}
            n={i}
            ex={ex}
            sentence={SENTENCES[i]}
            open={beat >= i + 1}
            said={beat >= i + 2 || (i === 5 && lastSaid) || !!tapped[i]}
            onSay={() => (i === 5 ? setLastSaid(true) : setTapped((t) => ({ ...t, [i]: true })))}
          />
        ))}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
