import type { ReactNode } from 'react'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { colors } from '@/design/tokens'
import { lit } from './litSurface'

/**
 * A full Docker image name, split into the three parts it is actually made of.
 *
 * WHAT IT ARGUES. `ravi123/nxttrendz-backend:v1` looks like one opaque string,
 * and a learner who reads it as one string cannot fix the push that was denied:
 * the fix is to add the FIRST of three parts, and nothing in the plain text says
 * there are three. So the name is drawn here as three separable blocks, each in
 * its own colour, each with its own caption saying what that part answers:
 * whose, which app, which version. Once the name is spatial, a missing part is
 * visible as a gap in a row instead of being invisible inside a word.
 *
 * WHY NOT A TABLE OR BULLETS. A table can list the three parts and their rules,
 * and slide 25 is exactly that table. What a table cannot do is keep the parts
 * in the order and the punctuation they occupy in the real name: a table row for
 * "tag" says nothing about the colon that introduces it, and reading down a
 * column is the opposite of reading a name left to right. This figure teaches
 * where each part sits; the table teaches what each part must contain. Both
 * slides need one of the two, and neither substitutes for the other.
 *
 * WHY IT IS NOT AN SVG. Same reason `TargetAnatomy` in session 5 records: a
 * figure whose content is mostly labels must be built from real elements, so the
 * browser's layout engine keeps the labels apart and `align-check.mjs` can see
 * them. An `<svg>` is one DOM rectangle to all three harnesses, which is how two
 * session 4 figures shipped with overlapping `<text>` and reported clean.
 *
 * THE ABSENT DOCKER ID. `c2-youve-read-it` renders `python:3.14-slim`, an official image,
 * which genuinely has no Docker ID. The name line stays literal there, because a
 * placeholder inside the name would teach a string nobody types. The id keeps its
 * caption column instead, drawn dashed and muted with the reason in it, so the
 * figure holds the same three-column shape on both slides and slide 26 reads as
 * the same name pulled apart, not as a different figure.
 */

export interface ImageNameLabels {
  id?: string
  repo?: string
  tag?: string
}

const DEFAULT_LABELS: Required<ImageNameLabels> = {
  id: 'Docker ID (whose)',
  repo: 'repository (which app)',
  tag: 'tag (which version)',
}

/** Paint per part. Read off tokens so the figure cannot drift off-palette. */
const PAINT = {
  id: colors.brand,
  repo: colors.tealDark,
  tag: colors.accentDark,
} as const

function Part({ text, paint }: { text: string; paint: string }) {
  /*
    LIT, NOT A FLAT WASH. Each part used to be a 12 percent tint of its own hue
    with nothing else on it, so the three chips read as three coloured regions
    inside one panel rather than as three separable blocks of a name. `lit` at
    `tint` amplitude is the STYLE_GUIDE section 9 recipe at the volume a surface
    carrying dark text can take: the chip now has a top-left highlight, a ramp in
    its own hue, a shadow tinted with that hue and the two hairlines.
  */
  return (
    <Reveal dir="up">
      <span
        className="inline-block rounded-lg px-3 py-1.5 font-mono text-[34px] font-bold leading-none"
        style={{ ...lit(paint, 'tint'), color: paint }}
      >
        {text}
      </span>
    </Reveal>
  )
}

function Punct({ mark }: { mark: string }) {
  return (
    <Reveal dir="up">
      <span
        className="inline-block px-1 font-mono text-[34px] font-bold leading-none"
        style={{ color: colors.muted }}
      >
        {mark}
      </span>
    </Reveal>
  )
}

function Caption({
  label,
  value,
  paint,
  absent = false,
}: {
  label: string
  value: string
  paint: string
  absent?: boolean
}) {
  return (
    /* The same four-layer depth as the panel above, one step quieter: the
       captions explain the name, they do not compete with it. Hover is gated to
       a real pointer for the same reason. */
    <div className="flex flex-col items-center">
      {/*
        THE TICK, AND IT IS THE FIGURE'S ARGUMENT.

        Until now the only thing joining a caption to the part of the name it
        explains was that the two shared a colour. Colour alone fails the two
        cases this figure exists for: a projector that shifts the hues, and the
        slide where the Docker ID is ABSENT and the eye has to be told which gap
        the caption belongs to. A 14px rule in the part's own hue, rising out of
        the top of the card towards the name, says it structurally. Drawn as two
        real elements rather than SVG, so `align-check` can measure them.
      */}
      <span
        className="block w-[2px] rounded-full"
        style={{
          height: 16,
          background: absent
            ? `linear-gradient(180deg, ${colors.muted}00 0%, ${colors.muted}80 100%)`
            : `linear-gradient(180deg, ${paint}00 0%, ${paint} 100%)`,
        }}
      />
      <span
        className="mb-[-4px] block h-[7px] w-[7px] rounded-full"
        style={{
          background: absent ? colors.muted : paint,
          boxShadow: `0 0 0 3px ${colors.surface}`,
        }}
      />
      <div
        className={`w-full rounded-card px-4 py-3 transition-[transform,box-shadow] duration-200 ease-out [@media(hover:hover)and(pointer:fine)]:hover:-translate-y-[2px] ${
          absent ? 'border border-dashed' : 'border border-l-[3px]'
        }`}
        style={{
          borderColor: absent ? colors.muted : paint,
          ...lit(absent ? colors.muted : paint, absent ? 'quiet' : 'tint'),
        }}
      >
        <p className="font-mono text-body-sm font-bold" style={{ color: absent ? colors.muted : paint }}>
          {value}
        </p>
        <p className="mt-1 font-heading text-body-sm font-semibold" style={{ color: colors.body }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export function ImageNameAnatomy({
  dockerId,
  repository,
  tag,
  labels,
  note,
  className = '',
}: {
  dockerId?: string
  repository: string
  tag?: string
  labels?: ImageNameLabels
  note?: ReactNode
  className?: string
}) {
  const L = { ...DEFAULT_LABELS, ...labels }

  /*
    WIDTH IS THE CONTENT'S, NOT THE WELL'S.

    This used to be `w-full max-w-[980px]`. With three parts that looked right,
    because the name nearly filled it. With TWO parts, which is what an official
    image like `python:3.14-slim` has, the name stopped around x=560 and left
    roughly 570px of empty panel: the user reported the container as bigger than
    required, on that exact slide.

    `w-fit` makes the panel and the caption row both stop where their content
    does, and `mx-auto` then centres that block in the body well, which is what
    the user asked for once the panel was no longer full width. `align-check`
    accepts it as CENTRED rather than ALIGNED: a block sized to its content and
    centred is one of the two verdicts it allows, and a two-part name and a
    three-part name are each centred rather than sharing a left edge.
  */
  return (
    <RevealGroup className={`mx-auto w-fit max-w-[980px] ${className}`} stagger={0.08}>
      {/* The name itself, in one card, at the size it can be read from the back
          of the room. Each part is its own element so a caption below can point
          at one without the eye taking all three. */}
      <Reveal dir="up">
        {/*
          A HEAVIER EDGE THAN THE KIT'S DEFAULT CARD, ON PURPOSE.

          `border-line` plus `shadow-card-soft` is the right treatment for a card
          sitting on white. This figure sits on `bg-brand-soft`, which is only a
          few percent away from `surface-card`, so at projector contrast the panel
          had no edge and read as text floating on the slide. The user reported it
          as the container merging with the background. Two changes fix it without
          inventing a new colour: the full `shadow-card` (blue-tinted, 34px) and a
          brand-tinted border instead of the neutral line.

          THE BORDER IS 40 PERCENT, NOT 20. The first attempt used `brand33` and
          the panel still read as flat in the render: a 20 percent tint of the
          brand blue against `bg-brand-soft` is very nearly the background it is
          meant to separate from. Checked against the shot, not the diff.
        */}
        {/*
          DEPTH, NOT A FLAT FILL. Four layers, all derived from tokens:

            1. a top-to-bottom wash from `surface-card` to `surface2`, so the
               panel is lit from above instead of being one paint colour,
            2. a 1px white inset along the top edge, which is the highlight a
               raised surface catches,
            3. a brand-tinted inset along the bottom, so the panel sits IN the
               slide rather than on it,
            4. two stacked drop shadows, a tight contact shadow and a wide soft
               one, because a single blur reads as a sticker.

          HOVER IS GATED to `(hover: hover) and (pointer: fine)`. A projector has
          no cursor, so this is only ever seen by someone reading the deck on a
          laptop, and on a touch screen an ungated `:hover` sticks after a tap.
          It is polish, and it carries no teaching.
        */}
        <div
          className="group rounded-card border-2 px-6 py-5 transition-[transform,box-shadow] duration-200 ease-out [@media(hover:hover)and(pointer:fine)]:hover:-translate-y-[3px]"
          style={{
            borderColor: `${colors.brand}66`,
            backgroundImage: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
            boxShadow: [
              `inset 0 1px 0 rgba(255,255,255,0.95)`,
              `inset 0 -1px 0 ${colors.brand}1f`,
              `0 2px 4px -2px ${colors.brandDeep}26`,
              `0 18px 40px -20px ${colors.brand}59`,
            ].join(', '),
          }}
        >
          {/* Nested group so the parts land one after another, left to right,
              inside the card's own entrance. It re-roots the variant tree, which
              a plain <div> here would break. */}
          {/* `justify-center`: the name row is narrower than the caption row
              below it, which is what sets the panel's width, so left-aligned
              parts sat off to one side of their own container. Centring them
              puts the name over the captions that explain it. */}
          <RevealGroup
            className="flex flex-wrap items-center justify-center"
            stagger={0.07}
            delayChildren={0.14}
          >
            {dockerId ? (
              <>
                <Part text={dockerId} paint={PAINT.id} />
                <Punct mark="/" />
              </>
            ) : null}
            <Part text={repository} paint={PAINT.repo} />
            {tag ? (
              <>
                <Punct mark=":" />
                <Part text={tag} paint={PAINT.tag} />
              </>
            ) : null}
          </RevealGroup>
        </div>
      </Reveal>

      {/* Three captions in a row that sizes to them, so no caption lands on top
          of another however wide the font renders, and the row cannot re-inflate
          the figure that `w-fit` just tightened. `flex-1` with a floor keeps the
          three cards even without forcing them to fill 980px.
          The id column is always present: when there is no Docker ID it says so,
          and says why. */}
      <Reveal dir="up">
        <div className="mt-5 flex items-start gap-4 [&>*]:min-w-[188px] [&>*]:flex-1">
          <Caption
            label={L.id}
            value={dockerId ?? 'none'}
            paint={PAINT.id}
            absent={!dockerId}
          />
          <Caption label={L.repo} value={repository} paint={PAINT.repo} />
          <Caption
            label={L.tag}
            value={tag ?? 'latest'}
            paint={PAINT.tag}
            absent={!tag}
          />
        </div>
      </Reveal>

      {note ? (
        <Reveal dir="up">
          <p className="mt-4 text-center text-body-sm font-medium" style={{ color: colors.body }}>
            {note}
          </p>
        </Reveal>
      ) : null}
    </RevealGroup>
  )
}
