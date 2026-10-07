import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'

/**
 * THE INSTRUCTION COLUMN ON A CARD THAT GIVES THE ROOM WORK.
 *
 * WHY IT IS ON THE SLIDE AND NOT IN THE NOTES. The reference puts the sentences
 * the instructor says while the room works on the frame itself: what to open,
 * what to write, what to run, in that order. A version that keeps them in
 * speaker notes leaves fifty people looking at a code panel with no task
 * attached to it, and the instructor repeating the task four times.
 *
 * Session-local, like the rest of `./figures/`, and for the same reason: the
 * lab has not chosen the kit's final task-card shape yet.
 */
export function TaskCard({
  lines,
  ordered = false,
  className = '',
  children,
}: {
  /** One sentence per line, in the order the room does them. */
  lines: ReactNode[]
  /** Number the lines, for a task whose steps must happen in that order. */
  ordered?: boolean
  className?: string
  /** Anything that follows the sentences: a timer, a hint. */
  children?: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-2">
        {lines.map((line, i) => (
          <div key={i} className="flex items-baseline gap-2">
            {ordered && (
              <span
                className="shrink-0 font-mono text-body-lg font-bold leading-snug"
                style={{ color: colors.brand }}
              >
                {i + 1}.
              </span>
            )}
            <p className="text-body-lg leading-snug" style={{ color: colors.ink }}>
              {line}
            </p>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}

/** A word the sentence leans on. The reference bolds exactly these. */
export function Em({ children }: { children: ReactNode }) {
  return <strong style={{ color: colors.ink }}>{children}</strong>
}

/** A fragment of program inside a sentence. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[18px]" style={{ color: colors.brandDark }}>
      {children}
    </span>
  )
}
