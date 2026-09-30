import { SlideBase } from '@/ui/SlideBase'
import { colors } from '@/design/tokens'
import { AskIn, MarkIn } from './motion'
import { resolveAsk, type AskFigureProps } from './askFigure'
import { AskKicker, AskMark, paintOnDark, ProblemPanel, Qualifier, Stem } from './askChrome'

/**
 * SPOTLIGHT ASK — the projector goes dark, one light falls on the question.
 *
 * THE ARGUMENT
 *
 * The loudest signal available to a slide is not a size, a colour or a mark. It
 * is the GROUND. A room half-watching a run of pale blue content slides looks up
 * when the wall changes colour, and it looks up before it has read anything,
 * which is the one thing none of the other three variants can claim: they all
 * announce themselves in ink, and ink has to be read to be noticed.
 *
 * That is the entire job of a pause beat. `QuizTimeSlide` in the kit already
 * makes this argument and makes it with a whole frame that carries no question at
 * all, spent purely on the mode switch. This variant makes the same switch and
 * asks the question on the same frame.
 *
 * WHY A SPOTLIGHT AND NOT JUST NAVY
 *
 * The kit's dark ground is a flat navy with two orbs and a dot grid, and it is
 * the ground the section dividers, the practice frame and the thank-you frame all
 * sit on. Drop a question onto it unchanged and the frame reads as a divider that
 * happens to have a sentence on it.
 *
 * So `decor` is off and the furniture is replaced by one thing: a single soft
 * pool of light behind the question block, falling off to nothing well before the
 * edges. It reads as attention rather than as decoration, and it is what makes
 * this frame different from the other dark frames in the same deck rather than
 * simply another one of them.
 *
 * ONE LIGHT SOURCE. `SlideBase` argues this for the light family ("one source of
 * light is what makes it read as light") after removing a second wash that made
 * the frame read as a flat sheet with two smudges. It is more true on navy, where
 * two pools have nothing to lose their contrast against.
 *
 * THE PAINT HAD TO CHANGE, AND THE RAMP DID NOT
 *
 * `check` is #0146C7, which against the navy ground is about 1.5:1. On a
 * projector in a lit room the kicker simply disappears. `paintOnDark` moves each
 * stop to the lightest member of its own family rather than inventing a second
 * hue, so the tone is still recognisably the same tone. See the note in
 * `askChrome.tsx`.
 *
 * WHAT IT IS WORST AT
 *
 * **It cannot follow the slide it belongs to.** A question that lands directly
 * out of a content slide, mid-explanation, wants the room's attention to CONTINUE
 * rather than to reset. This frame resets it: the ground changes, and for about a
 * second everybody is looking at the change instead of the sentence. It is right
 * for a question that opens or closes a stretch, and wrong for one in the middle
 * of one.
 *
 * Second, and this is the real cost: **the deck's dark ground is already spent.**
 * Welcome, the session name, every section divider, practice, feedback and thank
 * you are all navy. A deck that puts its questions there too has six kinds of
 * navy frame, and the room stops reading navy as a boundary, which is the thing
 * the dividers were relying on. The spotlight is what keeps them apart, and it is
 * a thinner distinction than it looks on one slide in isolation.
 */

/**
 * THE SCRIM, AND WHY THE FRAME NEEDS ONE BEFORE IT NEEDS A SPOTLIGHT.
 *
 * `bg-nw-night` is not flat navy. It is
 * `radial-gradient(120% 120% at 18% 0%, #0146C7 0%, #013A86 42%, #00254B 100%)`,
 * so the deck's dark ground has a BRIGHT BLUE CORNER at 18% across and 0% down,
 * fading to navy only at the far corner.
 *
 * That was discovered on the render and it is the single most useful thing this
 * frame turned up. The first pass put a 34% spotlight at 22%/46%, which is
 * almost exactly on top of the ground's own hot corner, and the result was not a
 * dark frame with a light on it: it was a bright blue slide, indistinguishable
 * from `bg-nw-gradient`, with a sentence on it. The entire argument of this
 * variant, that the projector goes DARK, was false on screen.
 *
 * Worse, it is false for the kit's dark frames generally: the brightest part of
 * the deck's darkest ground is the top left, which is exactly where every one of
 * them puts its heading.
 *
 * So the scrim comes first and it is part of the device rather than a correction
 * to it. A flat wash of the palette's own deepest navy at 62% pulls the whole
 * ground down to something the eye reads as dark, INCLUDING the hot corner, and
 * the spotlight is then the only light in the frame instead of the second one.
 * `brandDeep` rather than black: black over a blue gradient greys it, and a grey
 * navy looks like a screen with the brightness turned down rather than like a
 * dark room.
 */
const SCRIM = 'rgba(0, 37, 75, 0.62)'

/**
 * The pool of light, centred on the question block rather than on the canvas.
 *
 * 26% across and 48% down is roughly where the first line of the question sits,
 * so the brightest part of the ground is under the words and the falloff carries
 * the eye down the rest of them. Centring it on the canvas instead put the peak
 * at x=640, which is past the end of every line, and the block then sat on the
 * dim left flank of its own spotlight.
 *
 * 26% ALPHA, AGAINST 34% IN THE FIRST PASS, and the reduction is what the scrim
 * bought. Over the raw ground the pool had to be strong enough to be seen against
 * an already-bright corner, which is how it ended up brighter than the corner and
 * took the frame with it. Over the scrim there is nothing to compete with, so the
 * same visible pool costs a third less paint and the navy survives.
 *
 * The blue is the style guide's own, so the pool reads as the deck's light rather
 * than as a grey haze: at these alphas over #00254B a neutral white wash goes
 * milky and kills the navy, which is the ground doing the work.
 */
const SPOTLIGHT = `radial-gradient(780px 640px at 26% 48%, rgba(45,99,251,0.26), rgba(45,99,251,0.08) 46%, rgba(0,37,75,0) 74%)`

/**
 * 840px, WHICH IS THE ONE MEASUREMENT ALL FOUR VARIANTS SHARE.
 *
 * `SlideBase` applies the px-16 gutter, so content starts at x=64 and a block
 * capped at 840 ends at x=904. The instructor video rectangle starts at x=913.
 * Nine pixels is not much, and it does not need to be: the point is that the cap
 * makes the frame legal at ANY height, so a longer question grows downward and
 * nothing has to be nudged. The kit's `QuestionSlide` arrived at the same number
 * the same way, and every variant in this lab keeps it.
 */
const MEASURE = 840

export function SpotlightAsk({
  kicker,
  question,
  qualifier,
  ordinal,
  tone,
  className = '',
}: AskFigureProps) {
  const a = resolveAsk({ question, qualifier, ordinal })
  const paint = paintOnDark(tone)

  /* The refusal renders on the light ground whatever this frame's own ground is:
     it is a message to whoever is building the deck, not a slide. */
  if (a.problems.length) {
    return (
      <SlideBase variant="light">
        <ProblemPanel problems={a.problems} />
      </SlideBase>
    )
  }

  return (
    <SlideBase variant="night" decor={false} className={className}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: SCRIM }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: SPOTLIGHT }}
      />

      {/*
        THE MARK, CUT BY THE RIGHT EDGE.

        The kit's `QuestionSlide` sets its `?` at 300px and 10% opacity in the
        gap beside the card. That is a watermark: it is there to be not noticed,
        and it succeeds, so it is 300px of canvas doing nothing. This one is
        larger, brighter, and CROPPED, which is the difference. A complete glyph
        sitting in a margin is a decoration somebody placed; one running off the
        edge is part of the frame.

        THE POSITION IS FIXED BY TWO OBSTACLES, NOT CHOSEN.

        `bottom: 64` puts the box's floor at y=656, which clears the NxtWave mark
        in the footer. At the first pass's `bottom: -168` the glyph's right stem
        ran directly behind the logo, and a 0.18-alpha shape behind the one place
        the deck is signed is the same mistake `SlideBase` records having made
        with a blur in the same corner.

        `size: 400` is then what fits: the box's top lands at y=256, clear of the
        instructor video rectangle's y=220 floor. `pointer-events-none` would make
        the sweep skip it either way; not relying on that is the cheaper habit,
        and the repo's own rule is stronger than the harness, since decorating a
        region a video will cover is wasted ink whether or not it passes.
      */}
      <MarkIn
        className="pointer-events-none absolute"
        style={{ right: -46, bottom: 64 }}
        from={0.88}
      >
        <AskMark size={400} paint={paint} opacity={0.2} />
      </MarkIn>

      {/*
        THE KICKER AT THE FRAME'S OWN DATUM, x=64 and y=48, which is what
        `SlideBase`'s pt-12 gives a first child in normal flow.

        Hard content rule 19 wants the concept pinned there on every slide that
        carries one, and the kit's `QuestionSlide` does NOT do this: it folds the
        kicker into the centred card, so the room's answer to "where am I in this
        session" moves down the frame every time a question is asked. All four
        variants in this lab pin it, which is the only thing they all agree on
        besides the measure.
      */}
      <AskIn at={0}>
        <AskKicker ordinal={ordinal} paint={paint}>
          {kicker}
        </AskKicker>
      </AskIn>

      {/* `data-align-exempt`: the band under the question is the pause, not tail
          drift. `align-check.mjs` reads this exact attribute; see the named
          opt-out in that harness. */}
      <div
        data-align-exempt="centred"
        className="relative z-10 flex flex-1 flex-col justify-center"
        style={{ maxWidth: MEASURE }}
      >
        <AskIn at={1}>
          <Stem size="lg" invert>
            {a.question}
          </Stem>
        </AskIn>
        {a.qualifier && (
          <AskIn at={2} className="mt-9">
            <Qualifier paint={paint} invert>
              {a.qualifier}
            </Qualifier>
          </AskIn>
        )}
      </div>

      {/* A hairline along the foot, in the tone, fading out to the right.
          The one piece of structure on the frame: it gives the empty lower half
          an edge, so the composition ends somewhere instead of trailing off, and
          it is the same device the light family gets from its `slide-footer-bar`
          and the dark family has never had. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
        style={{
          background: `linear-gradient(to right, ${paint}, ${colors.nwBlue}00 62%)`,
        }}
      />
    </SlideBase>
  )
}
