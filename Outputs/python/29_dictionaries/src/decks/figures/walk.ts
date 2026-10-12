import type { Visitor } from './bag'

/**
 * A FEW ITEMS WALKING TO THE BAG INSIDE ONE PRESS (C8, C9). Each item makes
 * ONE move, straight from its place in line (or the door) to where it ends:
 * into its place in the bag, or, a repeat, up to the rim where it stops grey
 * (user, 2026-10-08: one smooth move per chip, no pause, no bounce). Items
 * start one after another: `phase` counts how many have started
 * (`useStepPhase` with `walkDelays`); a press reached any way but forward
 * lands at n, the end state.
 */
export type WalkItem = { item: string; joins: boolean }

/** the first item starts at once; each next one when the last has landed */
export const walkDelays = (n: number) => Array.from({ length: n }, (_, k) => (k === 0 ? 60 : 1100))

export function walkState(start: string[], steps: WalkItem[], phase: number, from?: (k: number) => HTMLElement | null) {
  const n = steps.length
  const begun = Math.min(phase, n)
  const joined = steps.slice(0, begun).filter((s) => s.joins)
  const items = [...start, ...joined.map((s) => s.item).filter((x) => !start.includes(x))]
  /* the most recent repeat stays at the rim, grey, until the press ends */
  let last = -1
  steps.slice(0, begun).forEach((s, k) => !s.joins && (last = k))
  const visitor: Visitor | null = last >= 0 ? { label: steps[last].item, mode: 'bounce', from: from ? () => from(last) : undefined } : null
  /* where each joining item flies in from: its own place in line */
  const origin = (label: string) => {
    const k = steps.findIndex((s, j) => j < begun && s.joins && s.item === label)
    return k >= 0 && from ? from(k) : null
  }
  return { items, visitor, origin, gone: (k: number) => k < begun }
}
