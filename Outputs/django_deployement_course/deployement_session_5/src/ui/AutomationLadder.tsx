import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'

/**
 * The four levels of automation this course climbs, with a pin on the one the
 * session is standing on.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT ONE OF THE KIT'S FIGURES. Three were
 * considered first. `JourneyRoadmap` hardcodes this course's
 * Package / Configure / Combine stages and answers a different question (which
 * part of deployment are we on). `LayerStack`'s states are
 * `ships` / `host` / `breaks` / `shared`, which are claims about what travels
 * with a `git push`, so reusing it here would contradict the slide it sits on.
 * `StepList` draws a horizontal sequence, and the argument here is a climb: each
 * level removes one kind of human effort that the level below it still paid.
 *
 * THE TOP LEVEL IS DELIBERATELY EMPTY. Content rule 4 says a later problem is
 * named, never opened, and never faded to look less important. The exception the
 * rule grants is exactly this figure: a "you are here" roadmap may mark a level
 * unopened, because showing position is the whole job. So level 3 is dashed and
 * carries no tool name. Anyone who has not yet felt the problem cannot place a
 * tool against it, and naming one here would spend the next session's opening.
 *
 * Built from real elements rather than SVG text, for the reason in
 * `TargetAnatomy`: labels are what this figure is made of, and SVG has no layout
 * engine to keep them off one another.
 */

interface Level {
  n: string
  title: string
  /** What this level automated. Empty on the unopened level. */
  automated?: string
  /** The command it reduced the work to. Empty on the unopened level. */
  command?: string
  /** The one that is not reached yet: dashed, no tool named. */
  unopened?: boolean
  /** The level the session is standing on. */
  here?: boolean
}

/** Listed top-first, so the array reads the way the figure looks. */
const LEVELS: Level[] = [
  { n: '3', title: 'Later in this course', unopened: true },
  { n: '2', title: 'Makefile', automated: 'The commands', command: 'make up', here: true },
  { n: '1', title: 'Docker and Compose', automated: 'The environment', command: 'docker compose up -d --build' },
  { n: '0', title: 'Manual everything', automated: 'Nothing', command: 'venv, pip, npm, two terminals' },
]

export function AutomationLadder({ className = '' }: { className?: string }) {
  return (
    /* Bottom-up: the last item in the array is the ground, so it should land
       first and the climb should build upward off it. `RevealGroup` staggers in
       DOM order, so the array is reversed for the reveal and the visual order is
       restored with `flex-col-reverse`. */
    <RevealGroup className={`mx-auto flex w-full max-w-[880px] flex-col-reverse gap-2.5 ${className}`} stagger={0.13}>
      {[...LEVELS].reverse().map((l) => {
        const paint = l.unopened ? colors.muted : l.here ? colors.brand : colors.tealDark
        return (
          <Reveal key={l.n} dir="up">
            <div
              className="flex items-center gap-4 rounded-card px-4 py-3"
              style={{
                background: l.here ? 'rgba(45,99,251,0.08)' : l.unopened ? 'transparent' : colors.surface,
                border: `2px ${l.unopened ? 'dashed' : 'solid'} ${l.here ? colors.brand : colors.line}`,
                /* Each rung steps in from the one below it. Drawn at equal
                   widths the four levels read as a list, and the argument this
                   figure makes is a climb: every level up does strictly less
                   work than the level under it. 14px per rung is enough for the
                   eye to see the stair without shrinking the top rung's text. */
                transform: `translateX(${Number(l.n) * 14}px)`,
                width: `calc(100% - ${Number(l.n) * 14}px)`,
              }}
            >
              {/* Level number */}
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-heading text-body font-extrabold"
                style={{
                  background: l.unopened ? 'transparent' : paint,
                  border: l.unopened ? `2px dashed ${colors.muted}` : 'none',
                  color: l.unopened ? colors.muted : colors.white,
                }}
              >
                {l.n}
              </span>

              {/* Name of the level */}
              <span
                className="w-[215px] shrink-0 font-heading text-body font-bold"
                style={{ color: l.unopened ? colors.muted : colors.ink }}
              >
                {l.title}
              </span>

              {/* What it automated. Fixed width so the column reads down. */}
              <span
                className="w-[140px] shrink-0 text-body-sm font-semibold"
                style={{ color: l.unopened ? colors.muted : paint }}
              >
                {l.automated ?? 'Not opened yet'}
              </span>

              {/* What the work shrank to. `min-w-0` so a long command truncates
                  inside its own cell instead of pushing the pin off the row. */}
              <span
                className="min-w-0 flex-1 truncate font-mono text-body-sm"
                style={{ color: l.unopened ? colors.muted : colors.body }}
              >
                {l.command ?? ''}
              </span>

              {/* The pin. Its own cell at the end of the row, so it cannot land
                  on top of the command however wide that renders. */}
              {l.here && (
                <span
                  className="shrink-0 rounded-full px-3 py-1 font-heading text-[12px] font-extrabold uppercase tracking-wider"
                  style={{ background: colors.brand, color: colors.white }}
                >
                  You are here
                </span>
              )}
            </div>
          </Reveal>
        )
      })}
    </RevealGroup>
  )
}
