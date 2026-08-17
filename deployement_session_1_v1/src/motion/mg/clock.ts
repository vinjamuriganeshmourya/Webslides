/**
 * The motion-graphic timeline clock.
 *
 * WHY A CLOCK RATHER THAN FRAMER VARIANTS
 * The appendix specifies each asset as a numbered beat sheet in seconds
 * ("12–16s — a request dot leaves the phone…"). Framer's variant/stagger model
 * is excellent for element reveals but awkward for a 36-second scripted
 * sequence with overlapping objects and back-references. Driving everything
 * from one `t` in seconds lets each asset's code read like the beat sheet it
 * was specified as — which is also what makes it reviewable against the TR doc.
 *
 * Every helper below takes `t` first, so call sites read chronologically.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { mgMotion } from '@/design/mg'

export interface MgClock {
  /** Elapsed seconds since play started, clamped to `duration`. */
  t: number
  playing: boolean
  duration: number
  play: () => void
  pause: () => void
  /** Jump to 0 and play. */
  restart: () => void
  /** Jump to a specific second without changing play state. */
  seek: (seconds: number) => void
  /** True once the timeline has reached the end and is holding its final frame. */
  done: boolean
}

/**
 * A requestAnimationFrame clock that stops at `duration` and holds.
 *
 * The appendix requires every asset to hold its final composed frame for at
 * least 2s "so it can be screenshotted and reused as a static diagram" — so
 * this deliberately does not loop. Holding forever is the correct end state.
 */
export function useMgClock(duration: number, autoplay = true): MgClock {
  const [t, setT] = useState(autoplay ? 0 : duration)
  const [playing, setPlaying] = useState(autoplay)
  const startedAt = useRef<number | null>(null)
  const offset = useRef(autoplay ? 0 : duration)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return

    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now
      const elapsed = offset.current + (now - startedAt.current) / 1000
      if (elapsed >= duration) {
        setT(duration)
        setPlaying(false)
        return
      }
      setT(elapsed)
      frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      startedAt.current = null
    }
  }, [playing, duration])

  const play = useCallback(() => {
    offset.current = t >= duration ? 0 : t
    startedAt.current = null
    setPlaying(true)
  }, [t, duration])

  const pause = useCallback(() => {
    offset.current = t
    startedAt.current = null
    setPlaying(false)
  }, [t])

  const restart = useCallback(() => {
    offset.current = 0
    startedAt.current = null
    setT(0)
    setPlaying(true)
  }, [])

  const seek = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(duration, seconds))
    offset.current = clamped
    startedAt.current = null
    setT(clamped)
  }, [duration])

  return { t, playing, duration, play, pause, restart, seek, done: t >= duration }
}

/* ------------------------------------------------------------------ */
/* Easing — the four curves the appendix's Motion Language table names  */
/* ------------------------------------------------------------------ */

export const ease = {
  linear: (p: number) => p,
  /** Element enters. */
  out: (p: number) => 1 - Math.pow(1 - p, 3),
  /** Element exits. */
  in: (p: number) => p * p * p,
  /** Object travel, camera moves. */
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
} as const

export type MgEase = keyof typeof ease

/* ------------------------------------------------------------------ */
/* Timeline helpers                                                     */
/* ------------------------------------------------------------------ */

/** Linear 0→1 across `[start, start + dur]`, clamped at both ends. */
export function ramp(t: number, start: number, dur: number): number {
  if (dur <= 0) return t >= start ? 1 : 0
  return Math.max(0, Math.min(1, (t - start) / dur))
}

/** `ramp` with an easing curve applied. */
export function curve(t: number, start: number, dur: number, kind: MgEase = 'out'): number {
  return ease[kind](ramp(t, start, dur))
}

/** True once `t` has passed `s`. */
export function after(t: number, s: number): boolean {
  return t >= s
}

/** True while `t` sits inside `[start, end)`. */
export function during(t: number, start: number, end: number): boolean {
  return t >= start && t < end
}

export function lerp(a: number, b: number, p: number): number {
  return a + (b - a) * p
}

/** Interpolate a value across a timed window, eased. */
export function tween(
  t: number,
  start: number,
  dur: number,
  from: number,
  to: number,
  kind: MgEase = 'out',
): number {
  return lerp(from, to, curve(t, start, dur, kind))
}

/**
 * The standard element entrance: fade up over `mgMotion.enter.dur`.
 * Returns styles directly so assets don't restate the spec on every object.
 */
export function entrance(t: number, start: number, rise = 24) {
  const p = curve(t, start, mgMotion.enter.dur, 'out')
  return {
    opacity: p,
    transform: `translateY(${lerp(rise, 0, p)}px)`,
  }
}

/** The standard element exit: fade down over `mgMotion.exit.dur`. */
export function departure(t: number, start: number) {
  const p = curve(t, start, mgMotion.exit.dur, 'in')
  return { opacity: 1 - p }
}

/**
 * The error shake — 3 cycles at 60ms, per the Motion Language table.
 * Returns an x offset in px; pair it with an `error` flash and an ✕, because
 * the appendix forbids encoding meaning in colour alone.
 */
export function shake(t: number, start: number, amplitude = 10): number {
  const { cycles, cycleDur } = mgMotion.shake
  const span = cycles * cycleDur
  if (t < start || t > start + span) return 0
  const p = (t - start) / span
  return Math.sin(p * Math.PI * 2 * cycles) * amplitude * (1 - p)
}

/** Emphasis pulse — scale 1.0 → 1.06 → 1.0, capped at 2 repeats. */
export function pulse(t: number, start: number, repeats = 1): number {
  const { dur, peak, maxRepeats } = mgMotion.pulse
  const n = Math.min(repeats, maxRepeats)
  if (t < start || t > start + dur * n) return 1
  const p = ((t - start) % dur) / dur
  return 1 + (peak - 1) * Math.sin(p * Math.PI)
}

/**
 * The pulsing activity ring on a *running* container. Unlike the helpers above
 * this is free-running — a container is alive for as long as it is on screen.
 */
export function heartbeat(t: number, period = 1.6): number {
  return 0.5 + 0.5 * Math.sin((t / period) * Math.PI * 2)
}

/**
 * How much of `text` has been typed by time `t`, at the appendix's 25 chars/sec.
 * Returns the visible substring.
 */
export function typed(t: number, start: number, text: string, cps = 25): string {
  if (t < start) return ''
  return text.slice(0, Math.floor((t - start) * cps))
}
