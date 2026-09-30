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
}

export interface DeckMeta {
  title: string
  /**
   * `always` keeps the control bar on screen instead of fading it out when the
   * pointer leaves the bottom band. For a deck presented from a laptop where the
   * presenter wants the counter and arrows visible, as PF 14 "For Loop"'s
   * source deck had them. Default `auto`.
   */
  controls?: 'auto' | 'always'
  course?: string
  lesson?: string
  presenter?: string
}

export interface DeckProps {
  slides: SlideDef[]
  meta?: DeckMeta
  /** Default slide transition when a slide doesn't override it. */
  transition?: SlideTransition
}
