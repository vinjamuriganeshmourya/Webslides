import type { ReactNode } from 'react'
import type { SlideTransition } from '@/motion/presets'

/** One slide in a deck. */
export interface SlideDef {
  /** Stable id — also used as the URL hash target. */
  id: string
  /** The rendered slide element. */
  element: ReactNode
  /** How this slide enters/exits. Defaults to the deck's transition. */
  transition?: SlideTransition
  /** Optional section label, used to group slides in the progress rail. */
  section?: string
  /** Short human label for the overview grid / navigation. */
  label?: string
  /** Speaker notes (shown in the presenter overlay, press "N"). */
  notes?: string
  /**
   * `false` makes this slide START PAUSED while the deck is in Auto Play:
   * nothing plays until the instructor's first press, which shows step 1 and
   * starts the rest playing by itself. For a slide the room works on, votes on
   * or predicts before anything is shown (a worksheet task with a timer, a
   * vote-then-run machine, an exit question), where a build playing by itself
   * on entry would give the answer away. Default `true`.
   */
  autoPlay?: boolean
}

/**
 * What a session may ask of the PLAYER, as opposed to of a slide.
 *
 * It rides on `DeckMeta` because that is the one session-owned object that
 * already reaches `Deck`: `App.tsx` is kit and identical in every session, so a
 * new prop there would be a kit change for every option a session wanted.
 */
export interface DeckPlayerOptions {
  /**
   * On a SMALL SCREEN (a phone, either way up), lay the control bar over the
   * stage and keep it hidden until it is asked for: a tap on the stage or a pull
   * up from the bottom edge shows it, a press on it or a few seconds of nothing
   * hides it again. Off, the bar keeps a strip of its own under the stage and
   * stays on screen. Desktop is the same either way. See `DeckControls`.
   */
  autoHideControls?: boolean
  /**
   * One extra control for the bar, drawn beside fullscreen. Build it from
   * `ControlButton` (exported by `DeckControls`) so it takes the bar's size and
   * its auto-hide timing with the rest.
   */
  extraControls?: ReactNode
  /**
   * Auto Play's pace: the gap between one build step and the next, in ms.
   * Default 2800, the explanatory tier: long enough for a step's own motion
   * (a machine's run, a hook's frames) to finish and the room to read it.
   */
  autoPlayStepMs?: number
}

export interface DeckMeta {
  title: string
  course?: string
  lesson?: string
  presenter?: string
  player?: DeckPlayerOptions
}

export interface DeckProps {
  slides: SlideDef[]
  meta?: DeckMeta
  /** Default slide transition when a slide doesn't override it. */
  transition?: SlideTransition
}
