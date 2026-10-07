import type { Variants, Transition } from 'framer-motion'
import { easing, motionSpeed } from '@/design/tokens'

/**
 * Shared Framer Motion presets.
 *
 * Two layers of animation power the "dynamic effects":
 *   1. Slide transitions   — how a whole slide enters/exits (deck level)
 *   2. Element reveals      — how content staggers in within a slide
 */

/* ------------------------------------------------------------------ */
/* 1. SLIDE TRANSITIONS                                                */
/* ------------------------------------------------------------------ */

export type SlideTransition =
  | 'slide'
  | 'fade'
  | 'zoom'
  | 'rise'
  | 'cover'
  | 'flip'
  | 'none'

/** direction: +1 when advancing, -1 when going back. */
export function slideVariants(kind: SlideTransition): Variants {
  switch (kind) {
    case 'fade':
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    case 'zoom':
      return {
        enter: { opacity: 0, scale: 1.06 },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      }
    case 'rise':
      return {
        enter: { opacity: 0, y: 60 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -60 },
      }
    case 'cover':
      return {
        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
        center: { x: 0 },
        exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0.4 }),
      }
    case 'flip':
      return {
        enter: (dir: number) => ({ opacity: 0, rotateY: dir > 0 ? 35 : -35 }),
        center: { opacity: 1, rotateY: 0 },
        exit: (dir: number) => ({ opacity: 0, rotateY: dir > 0 ? -35 : 35 }),
      }
    case 'none':
      return { enter: {}, center: {}, exit: {} }
    case 'slide':
    default:
      return {
        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 120 : -120 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -120 : 120 }),
      }
  }
}

export const slideTransition: Transition = {
  duration: 0.6 * motionSpeed,
  ease: easing.soft,
}

/* ------------------------------------------------------------------ */
/* 2. ELEMENT REVEALS (in-slide, staggered)                            */
/* ------------------------------------------------------------------ */

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const offset = 26

export function revealVariants(dir: RevealDirection = 'up', duration = 0.55): Variants {
  const from: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    scale: { scale: 0.9 },
    fade: {},
  }
  return {
    hidden: { opacity: 0, ...from[dir] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      // duration 0 → the element snaps to its final state (used for instant,
      // no-animation slide jumps like Ctrl+←/→).
      transition: { duration: duration * motionSpeed, ease: easing.soft },
    },
  }
}

/** Parent container that staggers its children's reveals. */
export function staggerContainer(stagger = 0.09, delayChildren = 0.12): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger * motionSpeed, delayChildren: delayChildren * motionSpeed },
    },
  }
}
