import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'

/**
 * The three parts of a Make target, with the one you cannot see made visible.
 *
 * WHY THIS EXISTS. A target is `name`, `:`, and an indented command, and two of
 * those three are perfectly readable in a `CodeBlock`. The third is a single TAB
 * character that renders as empty space, and getting it wrong produces
 * `missing separator`, the most common Make error there is. A code panel cannot
 * teach a character that has no glyph: it can only show the space the character
 * left behind. So the tab is drawn here as a labelled block with a real arrow in
 * it, sized to the width it actually occupies.
 *
 * WHY IT IS NOT AN SVG. Content rule 17 exists because two SVG figures shipped
 * in session 4 with their `<text>` labels overlapping, and all three harnesses
 * reported clean, because an `<svg>` is one DOM rectangle to them. Every label
 * here is a real element in a grid, so the browser's layout engine keeps them
 * apart and `align-check.mjs` can actually see them. Any figure whose content is
 * mostly labels should be built this way.
 */

interface Part {
  /** Which grid column this part's caption sits under. */
  label: string
  body: string
  paint: string
}

const PARTS: Part[] = [
  { label: 'Target name', body: 'Your choice. Keep it short', paint: colors.brand },
  { label: 'The colon', body: 'Required, straight after the name', paint: colors.accentDark },
  { label: 'One TAB character', body: 'Spaces will not work', paint: colors.tealDark },
]

export function TargetAnatomy({ className = '' }: { className?: string }) {
  return (
    <RevealGroup className={`mx-auto w-full max-w-[840px] ${className}`} stagger={0.12}>
      {/* The target itself, as it sits in the file. */}
      <Reveal dir="up">
        <div className="rounded-card border border-line bg-white p-6 shadow-card-soft">
          {/* Line 1: the name and the colon, each in its own chip so the caption
              below can point at one without the eye taking both. */}
          <div className="flex items-center gap-1 font-mono text-[26px] font-bold leading-none">
            <span
              className="rounded-md px-2.5 py-1.5"
              style={{ background: 'rgba(45,99,251,0.12)', color: colors.brandDark }}
            >
              up
            </span>
            <span
              className="rounded-md px-2 py-1.5"
              style={{ background: 'rgba(229,115,42,0.14)', color: colors.accentDark }}
            >
              :
            </span>
          </div>

          {/* Line 2: the tab, then the command. The tab block is 4ch wide, which
              is the width a tab renders at in the editors this course uses, so
              the command starts where the learner will actually see it start. */}
          <div className="mt-3 flex items-center gap-1">
            <span
              className="flex h-[42px] w-[4ch] items-center justify-center rounded-md border-2 border-dashed"
              style={{ borderColor: colors.teal, background: 'rgba(18,181,168,0.10)' }}
            >
              {/*
                A rightwards arrow to bar, the conventional glyph for a tab. Not
                a character the learner types: a stand-in for one they cannot
                see.

                The glyph sits in its OWN span rather than directly in the box
                above. `align-check.mjs` infers wrapped text by comparing an
                element's height to its line-height, and a 42px-tall box holding
                one 15px character looks exactly like a token wrapped over two
                lines. Giving the glyph its own tight-leading element means the
                box carries no direct text and the harness measures the span.
              */}
              <span className="font-mono text-[22px] font-extrabold leading-none" style={{ color: colors.tealDark }}>
                &#8677;
              </span>
            </span>
            <span className="font-mono text-[22px] font-semibold" style={{ color: colors.ink }}>
              docker compose up -d --build
            </span>
          </div>
        </div>
      </Reveal>

      {/* The three captions, in one grid so no caption can land on top of
          another however wide the font renders. */}
      <Reveal dir="up">
        <div className="mt-6 grid grid-cols-3 gap-4">
          {PARTS.map((p) => (
            <div
              key={p.label}
              className="rounded-card border-l-[3px] bg-surface px-4 py-3"
              style={{ borderColor: p.paint }}
            >
              <p className="font-heading text-body-sm font-bold" style={{ color: p.paint }}>
                {p.label}
              </p>
              <p className="mt-1 text-body-sm font-medium" style={{ color: colors.body }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </RevealGroup>
  )
}
