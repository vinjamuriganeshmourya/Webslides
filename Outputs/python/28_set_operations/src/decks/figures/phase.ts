import { useEffect, useRef, useState } from 'react'
import { useInstant } from '@/motion/instant'

/**
 * MOVEMENT INSIDE ONE PRESS (the spec allows it: "movement inside one press is
 * fine; a press that plays by itself is not"). Carried from session 21's
 * `tiles21.tsx` unchanged. It plays only when the press was reached by one
 * step forward; arriving any other way (a jump, Replay, going back) shows the
 * end state at once.
 */


/**
 * How far the movement of press `at` has got: 0 before it starts, `delays.length`
 * when it is over. `delays` are the waits before each phase, in ms.
 */
export function usePhase(beat: number, at: number, delays: number[]): number {
  const instant = useInstant()
  const prev = useRef<number | null>(null)
  const n = delays.length
  const [phase, setPhase] = useState(() => (beat >= at ? n : 0))
  useEffect(() => {
    const was = prev.current
    prev.current = beat
    if (beat < at) {
      setPhase(0)
      return
    }
    if (beat > at || instant || was !== at - 1) {
      setPhase(n)
      return
    }
    setPhase(0)
    const timers: number[] = []
    let t = 0
    delays.forEach((d, i) => {
      t += d
      timers.push(window.setTimeout(() => setPhase(i + 1), t))
    })
    return () => timers.forEach((x) => window.clearTimeout(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, at, instant])
  return phase
}


/**
 * Movement inside the press on screen now, whichever press that is: 0 when a
 * press was just reached by one step forward (then it counts up through
 * `delays`), `delays.length` when it was reached any other way. Derived during
 * render, so a new press never shows the last press's end state for a frame.
 */
export function useStepPhase(beat: number, delays: number[]): number {
  const instant = useInstant()
  const n = delays.length
  const prevBeat = useRef(beat)
  const [st, setSt] = useState({ beat, phase: n })
  const forward = beat === prevBeat.current + 1 && !instant
  const phase = st.beat === beat ? st.phase : forward ? 0 : n
  useEffect(() => {
    const fwd = beat === prevBeat.current + 1 && !instant
    prevBeat.current = beat
    if (!fwd) {
      setSt({ beat, phase: n })
      return
    }
    setSt({ beat, phase: 0 })
    const timers: number[] = []
    let t = 0
    delays.forEach((d, i) => {
      t += d
      timers.push(window.setTimeout(() => setSt({ beat, phase: i + 1 }), t))
    })
    return () => timers.forEach((x) => window.clearTimeout(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, instant])
  return phase
}
