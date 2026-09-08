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
 *
 * EVERY PART CARRIES A NUMBER, AND SO DOES ITS EXPLANATION.
 *
 * The first version paired a part with its caption by COLOUR alone: the name
 * chip was brand blue and the "Target name" card had a brand blue rail, and the
 * room was left to make the connection. The review said it had not worked:
 * *"Connect explanation with respective command part."*
 *
 * Colour is the wrong carrier for this. The three cards sit in a row UNDER the
 * whole panel rather than under the parts they describe, so there is no spatial
 * pairing to reinforce, and the second part is a single colon two characters
 * wide, which is not enough coloured area to register from the back of a room.
 * Colour also survives neither a washed-out projector nor a greyscale handout.
 *
 * So each part now wears a numbered badge and its card wears the same badge.
 * `PEDAGOGY_GUIDELINES.md` §5 names this exactly: use `01/02/03` numbered
 * callouts rather than bullets when the callouts map to parts of a line, so the
 * eye can pair them. The colour stays, as the secondary cue it should have been.
 */

interface Part {
  /** Which grid column this part's caption sits under. */
  label: string
  body: string
  paint: string
}

const PARTS: Part[] = [
  { label: 'Target name', body: 'Your choice, keep it short', paint: colors.brand },
  { label: 'Colon', body: 'Required, straight after the name', paint: colors.accentDark },
  { label: 'One TAB character', body: 'Spaces will not work', paint: colors.tealDark },
]

/**
 * The badge that pairs a part with its explanation.
 *
 * `on` is the part's own colour, so the badge reads as belonging to the part
 * rather than as deck furniture. It is a solid disc with white numerals: a
 * tinted badge on a tinted chip has too little separation to find quickly, and
 * finding it quickly is the entire job.
 */
function Badge({ n, paint, size = 22 }: { n: number; paint: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-heading font-extrabold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        background: `linear-gradient(135deg, ${paint} 0%, ${paint} 55%, rgba(0,0,0,0.18) 100%)`,
        boxShadow: `0 2px 5px -2px ${paint}, inset 0 1px 0 0 rgba(255,255,255,0.45)`,
      }}
    >
      {n}
    </span>
  )
}

export function TargetAnatomy({ className = '' }: { className?: string }) {
  return (
    <RevealGroup className={`mx-auto w-full max-w-[840px] ${className}`} stagger={0.12}>
      {/* The target itself, as it sits in the file. */}
      <Reveal dir="up">
        <div className="rounded-card border border-line bg-white p-6 shadow-card-soft">
          {/* Line 1: the name and the colon, each in its own chip so the caption
              below can point at one without the eye taking both. */}
          {/* Each part is a chip with its badge sitting on the chip's top-left
              corner, half outside it. Outside, so the badge never covers the
              character it is labelling: the colon part is two characters wide and
              a badge inside it would hide the colon itself. */}
          {/* `pt-3` reserves the room the badges need above the chips. Without
              it they sit half over the glyphs they are labelling, which on the
              two-character colon chip covered the colon itself. */}
          <div className="flex items-end gap-2 pt-3 font-mono text-[26px] font-bold leading-none">
            <span className="relative">
              <span
                className="block rounded-md px-2.5 py-1.5"
                style={{
                  background: 'rgba(45,99,251,0.12)',
                  color: colors.brandDark,
                  boxShadow: `inset 0 1px 0 0 #FFFFFF, inset 0 -1px 0 0 ${colors.brand}29`,
                }}
              >
                up
              </span>
              <span className="absolute -left-2.5 -top-4">
                <Badge n={1} paint={colors.brand} />
              </span>
            </span>
            <span className="relative">
              <span
                className="block rounded-md px-2 py-1.5"
                style={{
                  background: 'rgba(229,115,42,0.14)',
                  color: colors.accentDark,
                  boxShadow: `inset 0 1px 0 0 #FFFFFF, inset 0 -1px 0 0 ${colors.accentDark}29`,
                }}
              >
                :
              </span>
              <span className="absolute -left-2.5 -top-4">
                <Badge n={2} paint={colors.accentDark} />
              </span>
            </span>
          </div>

          {/* Line 2: the tab, then the command. The tab block is 4ch wide, which
              is the width a tab renders at in the editors this course uses, so
              the command starts where the learner will actually see it start. */}
          <div className="mt-5 flex items-center gap-1">
            <span
              className="relative flex h-[42px] w-[4ch] items-center justify-center rounded-md border-2 border-dashed"
              style={{ borderColor: colors.teal, background: 'rgba(18,181,168,0.10)' }}
            >
              <span className="absolute -left-2.5 -top-3">
                <Badge n={3} paint={colors.tealDark} />
              </span>
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
          {PARTS.map((p, i) => (
            <div
              key={p.label}
              className="rounded-card border-l-[3px] px-4 py-3"
              style={{
                borderColor: p.paint,
                /* Lit, per STYLE_GUIDE section 9: a ramp landing just off white,
                   a shadow tinted with the card's own rail colour, and a white
                   hairline on the top edge. Three flat `bg-surface` cards in a
                   row were the flattest thing on the slide. */
                background: `linear-gradient(135deg, #FFFFFF 0%, #FDFEFF 55%, ${p.paint}0d 100%)`,
                boxShadow: `0 3px 10px -6px ${p.paint}66, inset 0 1px 0 0 #FFFFFF`,
              }}
            >
              {/* The badge, repeated. This is the pairing: badge 2 on the colon
                  chip, badge 2 on the colon's card. */}
              <p className="flex items-center gap-2 font-heading text-body-sm font-bold" style={{ color: p.paint }}>
                <Badge n={i + 1} paint={p.paint} size={19} />
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
