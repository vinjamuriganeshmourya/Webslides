import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Group, Lines } from './common'
import { sentences, type OutLine } from './pieces'

/**
 * THE PIECES EVERY CONCEPT CARD OF PF 31 IS MADE OF (session 30's
 * `DictCards.tsx` kept these beside its own cards; PF 31 keeps them in a file
 * of their own so every card file imports them from one place).
 *
 *   TwoCols   the two groups every concept card is made of: the program with
 *             its output on the left, the caption, picture and vote on the
 *             right; `active` lights the one the room is working on; one
 *             explicit height for both, chosen for the card's tallest press
 *             (user, 2026-10-12: a box never grows with its content)
 *   DeckLine  the original deck's own sentence, in the rule's band
 *   CodeCard  the deck's "Code" card: a shape in mono (`import module_name`)
 *   usePick   a vote held per card
 *   lines     a program's output, one OutLine per line, errors in their tone
 */
export type Prog = { file: string; src: string; output: string; input?: string }

export const lines = (s: string): OutLine[] => s.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

/** The deck's own sentence, in the rule's band. */
export function DeckLine({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <p className="rounded-xl px-3.5 py-2 font-semibold leading-snug" style={{ fontSize: size, background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
      {typeof children === 'string' ? <Lines lines={sentences(children)} /> : children}
    </p>
  )
}

/**
 * The deck's code card (slides 8, 18, 20, 25, 31, 34 of the original deck): a
 * small `Code` tag over a white box with the shape in mono. For a shape, never
 * for a program that runs (that is `CodePane`).
 */
export function CodeCard({ lines: ls, size = 20, className = '' }: { lines: string[]; size?: number; className?: string }) {
  return (
    <div className={`relative inline-flex flex-col items-start gap-1 rounded-xl bg-white px-5 pb-3 pt-4 ${className}`} style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 8px 18px -14px rgba(16,32,58,0.3)` }}>
      <span className="absolute -top-2.5 left-3 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: colors.brandDark }}>
        Code
      </span>
      {ls.map((l) => (
        <span key={l} className="whitespace-pre font-mono font-bold leading-tight" style={{ fontSize: size, color: colors.brandDark }}>
          {l}
        </span>
      ))}
    </div>
  )
}

/** A vote held per card: the pick, and its setter, kept across the card's presses. */
export function usePick() {
  const [pick, setPick] = useState(-1)
  return { pick, setPick }
}

/** The two groups every concept card is made of. */
export function TwoCols({ left, right, leftW = 560, height, asking, drawing, leftPad = 10, rightPad = 10 }: { left: ReactNode; right: ReactNode; leftW?: number; height?: number; asking: boolean; drawing: boolean; leftPad?: number; rightPad?: number }) {
  return (
    <div className="flex items-stretch gap-3">
      <Group pad={leftPad} className="flex shrink-0 flex-col gap-2.5" style={{ width: leftW, height }} active={asking}>
        {left}
      </Group>
      <Group pad={rightPad} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height }} active={drawing}>
        {right}
      </Group>
    </div>
  )
}

/** A small word under a picture: `module`, `the value 78`. */
export function Label({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'brand' | 'danger' }) {
  const ink = tone === 'brand' ? colors.brandDark : tone === 'danger' ? colors.danger : colors.muted
  return (
    <span className="whitespace-nowrap text-[12.5px] font-semibold leading-none" style={{ color: ink }}>
      {children}
    </span>
  )
}
