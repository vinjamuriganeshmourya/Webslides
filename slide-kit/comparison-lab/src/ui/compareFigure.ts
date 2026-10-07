import type { ReactNode } from 'react'

/**
 * THE SHARED CONTRACT FOR EVERY CANDIDATE IN THIS LAB.
 *
 * All four figures take these identical props, so swapping one for another in a
 * deck is a rename and nothing else. `flow-lab` established that pattern with
 * `flowFigure.ts` and it is the thing that made choosing a winner cheap: the
 * gallery renders the same content four times and the only variable is the
 * drawing.
 *
 * WHAT A COMPARISON FIGURE IS FOR. Two systems that do the same job, where the
 * point is that one is a stand-in for the other. It is NOT for a general table
 * of differences: `DataTable` already draws that, and it draws it better,
 * because a table's rows are independent facts. Here every row is a PAIRING, and
 * the figure's whole job is to make the pairing legible as one thing rather than
 * as two cells that happen to be adjacent.
 */

export interface ComparePair {
  /** The familiar side. */
  from: ReactNode
  /** The thing being explained. */
  to: ReactNode
  /**
   * Renders both cells in monospace.
   *
   * `make_coffee()` and `make "up"` are code, and set as prose they read as
   * names of ideas rather than as things you type. `AnalogyMap` has no notion of
   * this, which is one of the four reasons this lab exists.
   */
  code?: boolean
  /**
   * The pairing the slide is actually about.
   *
   * There is always one. On the session 5 slide it is the last row, and under
   * `AnalogyMap` it looked exactly like the first three. Every candidate here
   * has to answer "which row is the point" without the presenter saying it.
   */
  key?: boolean
  /** A short gloss under the pairing, where one earns its place. */
  note?: ReactNode
}

export interface CompareFigureProps {
  /** The familiar system. */
  leftLabel: string
  /** The system being explained. */
  rightLabel: string
  pairs: ComparePair[]
  /**
   * The claim the comparison makes, in the figure rather than in the lead.
   *
   * `AnalogyMap` shows two column headings and no claim, so the argument lives
   * entirely in the slide's lead and the figure is left as evidence for a
   * sentence the eye has already moved on from.
   */
  caption?: ReactNode
  className?: string
}
