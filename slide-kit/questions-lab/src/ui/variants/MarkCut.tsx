import { SlideBase } from '@/ui/SlideBase'
import { AskIn, MarkIn } from './motion'
import { resolveAsk, type AskFigureProps } from './askFigure'
import { AskKicker, AskMark, paintOf, ProblemPanel, Qualifier, Stem } from './askChrome'

/**
 * MARK CUT — the question mark is the composition, not a watermark behind one.
 *
 * THE ARGUMENT
 *
 * A deck is looked at in a strip as often as it is looked at one frame at a time:
 * in the slide picker, in a scrubbed recording, in the thumbnail rail while
 * someone hunts for the bit they missed. Nothing in this deck is recognisable at
 * that size except by its GROUND, which is why every dark frame looks like every
 * other dark frame.
 *
 * This variant gives the pause beat a shape. A ring with a mark in it, sitting on
 * the right third, is identifiable at 120px wide with every word in it unreadable,
 * so a room that has seen two of them knows what the third one is before the
 * projector has finished switching. That is a thing no amount of type size buys,
 * because type size is relative and a thumbnail has nothing to be relative to.
 *
 * WHY THE MARK IS DRAWN AND NOT SET BEHIND THE TEXT
 *
 * The kit's `QuestionSlide` has an oversized `?` already, at 300px and 10%
 * opacity, sitting beside the card. It is a watermark: it is there to be not
 * noticed, and it succeeds, which means it is 300px of canvas doing nothing.
 *
 * The difference here is that the mark is OPAQUE and it is on a ground of its
 * own. It is the second thing on the frame rather than the ninth, and because it
 * is a real object with an edge, the question beside it reads as being attached
 * to something rather than floating. That is what the kit's card was for, and
 * this gets it without putting a box round the words.
 *
 * WHY RINGS AND NOT A FILLED PLATE
 *
 * A solid disc behind an opaque glyph is a badge, and a badge is a thing a
 * product puts on a feature it is proud of. Two concentric rings with a soft fill
 * between them read as a target or a lens, which is closer to what the frame is
 * doing: it is pointing at something. The rings are also cheap in ink, so the
 * whole device sits at under 25% alpha except for the glyph itself, and it never
 * competes with a sentence set at 38px.
 *
 * `decor` IS OFF, AND THAT IS PART OF THE DEVICE
 *
 * This is the only light variant in the lab that switches the deck's own
 * furniture off. The two orbit arcs are 1052px circles, and a 400px ring sitting
 * on top of two much larger arcs reads as a diagram of orbits rather than as a
 * mark: the eye starts looking for the relationship between the circles, and
 * there is not one. So the frame's geometry replaces the deck's geometry rather
 * than being added to it.
 *
 * EVERY PIECE IS A DIV, NOT AN SVG, AND THAT IS NOT A STYLE PREFERENCE
 *
 * `video-safe.mjs` skips decorative layers by reading `pointer-events-none` off
 * an element's class string. On an SVG element `className` is an
 * `SVGAnimatedString`, so the harness cannot read it and reports every
 * decorative svg as content in the reserved rectangle. `SlideBase` draws its own
 * arcs as rounded divs for exactly this reason and says so. Rings are circles,
 * circles are `border-radius: 50%`, and nothing here needs a path.
 *
 * WHAT IT IS WORST AT
 *
 * **It costs the question a line.** The mark takes the right third, so the
 * sentence gets a 736px measure against `QuietField`'s 800 at a size 12px
 * smaller, and the ring cannot be made smaller to give any of it back without
 * becoming a badge, which is the thing it is not. The margin is thin: 62px of
 * gutter is what stands between this frame and text pressed against a circle,
 * and a question 15 characters longer takes the fourth line the frame has no
 * room for.
 *
 * Second, **the mark says "question" and nothing else.** `SpotlightAsk`'s ground
 * and `QuietField`'s type size are both content-blind, so they carry a question
 * about anything equally well. A frame whose most recognisable feature is a
 * question mark is at its worst on the one question that most needs the room to
 * think, because it has told them the genre before they have read a word, and the
 * genre is the only thing about it that is not surprising.
 */

/**
 * 736, WHICH IS NOT A WIDTH THIS FRAME CHOSE. IT IS WHAT THE RING LEFT.
 *
 * The lab's shared cap is 840 from x=64. The outer ring's left edge lands at
 * x=862, and 62px is the narrowest gutter at which the sentence and the mark read
 * as two objects rather than as text pressed against a circle, so the question
 * ends at x=800 and the measure is 736.
 *
 * MEASURED: at 36px that is three lines. The first pass used 700 and 38px, which
 * was four, and the fourth line is what this variant is least able to afford,
 * since it is the one frame here already spending a third of the canvas.
 */
const MEASURE = 736

/**
 * THE RING SYSTEM, PLACED RATHER THAN NUDGED. Every number is a clearance.
 *
 * Centre (1062, 448), outer diameter 400, which puts the four edges at
 * x 862..1262 and y 248..648:
 *
 *   **Top at 248**, clear of the instructor video rectangle's y=220 floor. The
 *   repo's own rule here is stronger than the harness: `SlideBase` deleted a dot
 *   grid from the light family rather than move it, on the grounds that
 *   decorating a region a video will cover is wasted ink. A ring that is legal
 *   only because `pointer-events-none` makes the sweep skip it is still wasted.
 *
 *   **Bottom at 648**, clear of the NxtWave mark in the footer, which starts at
 *   about y=668. The first pass ran the ring's lower arc straight through it.
 *
 *   **Right at 1262**, past the frame, so the outer ring is CUT by the edge
 *   rather than floating inside it with a margin. A complete circle sitting in a
 *   corner with air all round it is a sticker. One that runs off the edge is part
 *   of the frame, and it is where the variant's name comes from.
 *
 *   **Left at 862**, which is what sets the question's measure. See `MEASURE`.
 */
const RING = { cx: 1062, cy: 448, outer: 400, inner: 280 }

export function MarkCut({
  kicker,
  question,
  qualifier,
  ordinal,
  tone,
  className = '',
}: AskFigureProps) {
  const a = resolveAsk({ question, qualifier, ordinal })
  const paint = paintOf(tone)

  if (a.problems.length) {
    return (
      <SlideBase variant="light">
        <ProblemPanel problems={a.problems} />
      </SlideBase>
    )
  }

  return (
    <SlideBase variant="light" decor={false} className={className}>
      {/*
        THE RING SYSTEM, AS ONE MOTION UNIT.

        `MarkIn` wraps the whole thing rather than each ring, so the device
        arrives as one object. Animating the two rings separately was the first
        pass and it read as a loading spinner assembling: two concentric circles
        appearing 130ms apart is a progress indicator, which is a promise that
        something is about to finish.

        It is also the lab's one timing exception, at 780ms and starting before
        everything else. See the note on `MarkIn`: the room has to notice the
        shape before it starts reading, or a 430px object moves behind a sentence
        somebody is halfway through.
      */}
      <MarkIn className="pointer-events-none absolute inset-0" from={0.9}>
        {/* the soft fill, innermost */}
        <div
          aria-hidden
          className="absolute rounded-[50%]"
          style={{
            width: RING.inner,
            height: RING.inner,
            left: RING.cx - RING.inner / 2,
            top: RING.cy - RING.inner / 2,
            background: `${paint}0F`,
          }}
        />
        {/* the outer ring, cut by the right edge of the frame */}
        <div
          aria-hidden
          className="absolute rounded-[50%]"
          style={{
            width: RING.outer,
            height: RING.outer,
            left: RING.cx - RING.outer / 2,
            top: RING.cy - RING.outer / 2,
            border: `2px solid ${paint}33`,
          }}
        />
        {/* the inner ring, a hairline, so the two read as a lens rather than as
            one circle with a thick edge */}
        <div
          aria-hidden
          className="absolute rounded-[50%]"
          style={{
            width: RING.inner,
            height: RING.inner,
            left: RING.cx - RING.inner / 2,
            top: RING.cy - RING.inner / 2,
            border: `1px solid ${paint}2E`,
          }}
        />
        {/*
          THE GLYPH, OPAQUE, AND THE ONLY SATURATED THING ON THE FRAME.

          Optically centred rather than boxed-centred. A `?` has its visual mass
          low and slightly left of its em box, because the em box reserves room
          for a descender the glyph does not use, so a mathematically centred one
          sits visibly high in its ring. `translate(-50%, -54%)` is the correction
          and it was arrived at on the render, not computed: the number is what it
          took for the dot and the hook to straddle the ring's horizontal
          diameter.
        */}
        <div
          aria-hidden
          className="absolute"
          style={{ left: RING.cx, top: RING.cy, transform: 'translate(-50%, -54%)' }}
        >
          <AskMark size={232} paint={paint} opacity={0.9} />
        </div>
      </MarkIn>

      {/* Pinned at the frame's datum, x=64 and y=48, like every variant here.
          See the note in `SpotlightAsk`. */}
      <AskIn at={0}>
        <AskKicker ordinal={ordinal} paint={paint}>
          {kicker}
        </AskKicker>
      </AskIn>

      {/* `data-align-exempt`: the air under the question is the pause, not tail
          drift. See the named opt-out in `align-check.mjs`. */}
      <div
        data-align-exempt="centred"
        className="relative z-10 flex flex-1 flex-col justify-center"
        style={{ maxWidth: MEASURE }}
      >
        <AskIn at={1}>
          <Stem size="md">{a.question}</Stem>
        </AskIn>
        {a.qualifier && (
          <AskIn at={2} className="mt-8">
            <Qualifier paint={paint}>{a.qualifier}</Qualifier>
          </AskIn>
        )}
      </div>
    </SlideBase>
  )
}
