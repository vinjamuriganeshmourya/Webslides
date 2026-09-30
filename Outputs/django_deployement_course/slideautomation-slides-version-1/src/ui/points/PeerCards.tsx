import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { FcEdgeLabel, FcNodeIn, useBeats } from '@/ui/figures/motion'
import { resolvePoints, type PointsFigureProps } from './pointsFigure'
import { HoverAside, ProblemPanel, TermChip, ToneChip, toneOf } from './pointsChrome'

/**
 * PEER CARDS — four cards of identical size, because the points are peers.
 *
 * THE ARGUMENT
 *
 * Equal geometry is a CLAIM, and it is the right one more often than the kit
 * currently admits. When a set is four things of the same kind, four boxes of the
 * same size say so without a word: nothing is first, nothing is bigger, and the
 * room is free to read them in any order and compare them against each other. A
 * row stack cannot say that, because top and bottom mean something whether the
 * author intended it or not.
 *
 * This is also the only variant here that puts the four claims SIDE BY SIDE at the
 * same eye height. Comparison is a horizontal act. "A volume outlives the
 * container" only lands next to "a container is one running copy", and in a
 * vertical stack those two are 90px apart with a third claim in between.
 *
 * The icon earns its 34px here for the same reason the term does in `RuleStack`: a
 * card is a small target on a projector, and an icon is what lets a presenter say
 * "the one on the right" and have the room find it in one glance.
 *
 * WHAT IT IS WORST AT
 *
 * **It flattens the lead, and the fixture has one.** The image is the point the
 * other three hang off, and here it is card one of four at exactly the weight of
 * the other three, with a chip that has to SAY "start here" because the geometry
 * cannot. That is a figure arguing with its own content, and it is why
 * `LeadAndRest` exists.
 *
 * Second, and this is the measured limit: **224px of content width is brutal on a
 * claim.** The fixture's longest is 434px of type, so it wraps to two lines and
 * the card allows three. A claim of 60 characters is 592px, which is three lines,
 * and at 65 it is four and the card's declared 18px of padding becomes 0. The
 * resolver's 52-character ceiling on a label is not a style preference here, it is
 * this card's arithmetic. An author who writes a good long claim will find this
 * variant refuses it.
 *
 * Third, it cannot hold a reason longer than about 90 characters. The fixture's
 * 81-character reason already takes three of the four allowed lines.
 *
 * GEOMETRY, AND THE PADDING ARITHMETIC
 *
 * A fixed 1100x290 stage. Four cards 260 wide on a 280 pitch, so the gaps are 20
 * and the last card's right edge is 840 + 260 = 1100 exactly. Cards run y 0 to 254
 * and the caption sits at 262, 26 tall.
 *
 * PADDING IS A FLOOR, NOT A DECLARATION. A box shows `(box - content) / 2`, so
 * CARD_H is derived from the fixture's worst card rather than declared:
 *
 *   icon tile, with the tone chip on the same line   34px
 *   gap                                              10px
 *   term chip, `sm`                                  20px
 *   gap                                               6px
 *   claim, 17px on 22px lines, 3 allowed             66px
 *   gap                                               6px
 *   reason, 13.5px on 19px lines, 4 allowed          76px
 *   ------------------------------------------------------
 *   content                                         218px
 *   CARD_H = 218 + 2 x 18                            254px  -> exactly 18px real
 *
 * Content width is 260 - 2 x 18 = 224.
 *
 *   - The longest claim is 44 characters of 17px Sora bold at about 9.86px each:
 *     434px, which is 1.94 lines in 224, so 2. The third allowed line is headroom
 *     for the 52-character claim the resolver still permits, at 513px or 2.3
 *     lines.
 *   - The longest reason is 81 characters of 13.5px Inter at about 6.75px each:
 *     547px, or 2.44 lines in 224, so 3. The fourth is headroom.
 *   - The tone chip shares the icon's line rather than taking a row of its own,
 *     which is what keeps the content at 218: "this one is free" is about 125px
 *     against the 224 - 34 - 8 = 182px left beside the icon tile.
 *   - The hover aside is 300px wide and centres on its card, so cards 1 and 4
 *     would overhang the stage by 20px. `dx` pulls them back rather than letting
 *     the aside leave the figure.
 */

const GAP = 20
const CAPTION_GAP = 8
const CAPTION_H = 26

/* Card width: fill the slot, within reason. */
const CARD_MIN = 240
/*
  CARD_MAX WAS 420, AND THE COMMENT UNDER IT SAID "at 540px it is a banner".

  That was true of a card carrying a claim and a reason, which is what this
  figure held when the number was chosen: 420px of width over 150px of height is
  already a wide, shallow box, and wider is a strip.

  It is not true any more, because the card carries a third block. The hover
  aside is gone deck-wide (see `HoverAside`), so a point's `detail` is rendered
  in the card instead of behind a pointer, and a card with a detail paragraph in
  it is 260 to 300px tall. At that height 566px is a card.

  566 is not a taste number either: it is exactly half of a `ContentSlide`'s
  1152px well, less the 20px gap, so a two-point set fills the slide's own width
  and the left card's left edge lands on the x=64 header datum that
  `align-check.mjs` measures every slide against. Session 1 v3's two-question
  slide is the set that needed it: two 420px cards centred in the well left
  146px of stranded stage on each side, under a title, over a caption, and the
  frame read as two tiles adrift.
*/
const CARD_MAX = 566

/*
  THE ROOMY TIER.

  A card at 566px has 530px of content width, which is 2.4x the 224px every type
  size below was measured against. Type that is right in 224px is small in 530:
  a 17px claim across half a slide reads as a caption. So past `ROOMY_AT` the
  card steps up one notch on every size and on its padding, and the metrics
  below carry both tiers rather than one set being scaled at the call site.
*/
const ROOMY_AT = 420

/*
  TYPE METRICS, and the row heights below are computed from them rather than
  declared. Same approach as `LineAnnotated` in the pseudocode lab: the card height
  has to be known before layout, and measuring would mean a render, a read and a
  second render, which on a figure that must look identical in the browser and in
  the exported single file is not worth the risk of the two disagreeing.
*/
const TIER = {
  tight: {
    pad: 18,
    icon: 34,
    iconGap: 10,
    termH: 20,
    termGap: 6,
    labelPx: 17,
    labelLh: 22,
    labelCh: 9.4 /* 17px Sora semibold */,
    bodyGap: 6,
    bodyPx: 13.5,
    bodyLh: 19,
    bodyCh: 6.8 /* 13.5px Inter */,
    detailGap: 10,
    detailPx: 12.5,
    detailLh: 18,
    detailCh: 6.3,
  },
  roomy: {
    pad: 24,
    icon: 40,
    iconGap: 14,
    termH: 22,
    termGap: 8,
    labelPx: 22,
    labelLh: 28,
    labelCh: 12.1 /* 22px Sora semibold */,
    bodyGap: 8,
    bodyPx: 16,
    bodyLh: 24,
    bodyCh: 8.0 /* 16px Inter */,
    detailGap: 14,
    detailPx: 14,
    detailLh: 22,
    detailCh: 7.0,
  },
} as const

const linesFor = (text: string, chWidth: number, room: number) =>
  Math.max(1, Math.ceil((text.length * chWidth) / room))

/**
 * THE ROW IS CENTRED, AND IT USED TO BE PINNED TO x=0. MEASURED.
 *
 * The first version laid cards from the left on a fixed 1100px stage, which is
 * right for the four the fixture has and wrong for everything else: two cards
 * filled the left half and stranded 540px, three stranded 260px, and
 * `align-check.mjs` reports that as DRIFT because the figure's centre is nowhere
 * near the content area's centre. Session 1 v3 hit it on a two-point slide and a
 * three-point slide on the same day.
 *
 * Centred is not a cosmetic fix. `align-check` allows exactly two verdicts, ALIGNED
 * on the header's left edge or CENTRED on the content area, so a centred row of any
 * length is a legal figure while a left-pinned short row is a reported defect.
 *
 * `width` exists for the other half of the same problem: these figures were all
 * built to own a 1100px stage, and a `ContentSlide` that pairs a figure with a
 * points column gives it about half that. Pass the width of the slot it is in.
 */
export function PeerCards({
  points,
  caption,
  width = 1100,
  className = '',
}: PointsFigureProps & { width?: number }) {
  const g = resolvePoints({ points })
  const n = g.points.length

  /*
    THE CARDS FILL THE SLOT, AND THEY USED TO BE 260px WHATEVER THE SET.

    260 is a quarter of 1100, which is right for the four the lab fixture has and
    wrong for every other count: two 260px cards centred in 1100 left 280px of
    empty stage on each side, and the room reads that as a figure that stopped
    early. Session 1 v3 has a two-card slide and a three-card slide.

    So the width is the slot divided by the count, clamped: two cards come to 420
    each, three to 353, four to 260. `CARD_MAX` exists because a card is a card, and
    at 540px it is a banner.
  */
  const CARD_W = Math.max(
    CARD_MIN,
    Math.min(CARD_MAX, n > 0 ? (width - (n - 1) * GAP) / n : CARD_MIN),
  )
  const t = CARD_W >= ROOMY_AT ? TIER.roomy : TIER.tight
  const PAD = t.pad
  const CONTENT_W = CARD_W - PAD * 2
  const rowW = n > 0 ? n * CARD_W + (n - 1) * GAP : 0
  const x0 = Math.max(0, (width - rowW) / 2)
  const cardLeft = (i: number) => x0 + i * (CARD_W + GAP)
  const W = width

  /*
    THE CARD IS AS TALL AS ITS OWN TALLEST CONTENT, AND IT USED TO BE 254 ALWAYS.

    254 is the lab fixture's worst card: a three-line claim over a four-line reason.
    Session 1 v3's cards carry a one-line claim and a two-line reason, so they came
    out with about 120px of empty card under the text, which is the same defect as
    stranded width and reads the same way.

    Estimated, not measured, for the reason in the metrics note above, and estimated
    generously: a set of equal cards takes the WORST card's line counts, so a card
    can only ever be too tall by a rounding, never too short. The declared 18px of
    padding is therefore still the floor it claims to be.
  */
  const labelLines = Math.max(1, ...g.points.map((p) => linesFor(p.label, t.labelCh, CONTENT_W)))
  const bodyLines = Math.max(
    0,
    ...g.points.map((p) =>
      typeof p.body === 'string' ? linesFor(p.body, t.bodyCh, CONTENT_W) : p.body ? 3 : 0,
    ),
  )
  /*
    THE DETAIL IS CONTENT NOW, SO IT IS IN THE ARITHMETIC.

    It used to live in a 300px hover popover that was never in the DOM unless a
    pointer was on the card, which is exactly why it cost nothing here. With the
    hover gone it is a paragraph in the card, and a paragraph nobody measured is
    how a figure runs off the bottom of a slide.
  */
  const detailLines = Math.max(
    0,
    ...g.points.map((p) =>
      typeof p.detail === 'string' ? linesFor(p.detail, t.detailCh, CONTENT_W) : p.detail ? 4 : 0,
    ),
  )
  const contentH =
    t.icon +
    t.iconGap +
    (g.points.some((p) => p.term) ? t.termH + t.termGap : 0) +
    labelLines * t.labelLh +
    (bodyLines ? t.bodyGap + bodyLines * t.bodyLh : 0) +
    (detailLines ? t.detailGap + detailLines * t.detailLh : 0)
  const CARD_H = Math.round(contentH + PAD * 2)
  const CAPTION_Y = CARD_H + CAPTION_GAP
  const H = CARD_H + CAPTION_GAP + CAPTION_H

  /*
    BEATS. Beat 0 is free and carries the first card, so the slide opens with a
    figure and the first click states the second point. One click per remaining
    point, then the caption.

    A SET OF PEERS STILL BUILDS ONE AT A TIME, and that is not a contradiction. The
    geometry claims the four are equal; the build claims the instructor says them
    in some order, because a person can only say one thing at a time. Landing all
    four together would hand the room four claims to read while the presenter is
    still on the first.

    Derived from props, never from state, and claimed before the problem panel can
    return: a hook behind an early return appears and disappears with the props.
  */
  const CAPTION = g.points.length
  const shown = useBeats(CAPTION + 1)

  /* This variant's own limit: the cards are laid out sideways, so the stage runs
     out of WIDTH rather than height. */
  const problems = [...g.problems]
  if (rowW > width) {
    problems.push(
      `${n} cards need ${rowW}px of width and the slot is ${width}px, so this set is a grid rather than a row`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={W} height={H} />

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      {g.points.map((p, i) => {
        const paint = toneOf(p.tone)
        const Icon = p.icon ? iconByName[p.icon as keyof typeof iconByName] : null
        return (
          <FcNodeIn
            key={p.id}
            at={i}
            shown={shown[i]}
            /* `absolute` is load-bearing: `.fc-node-slot`'s `z-index` is ignored on
               a static element, and the aside then gets painted over by the card to
               its right. See the note in `pointsChrome.tsx`. */
            className="absolute"
            style={{ left: cardLeft(i), top: 0, width: CARD_W, height: CARD_H }}
          >
            <HoverAside>
              <div
                className="relative flex h-full w-full flex-col overflow-hidden rounded-card"
                style={{
                  /*
                    ONE FLAT SURFACE, ONE ACCENT EDGE.

                    This card used to carry four layers of paint: a diagonal wash,
                    a radial corner highlight, a tone-tinted shadow, and a hairline
                    inner ring, plus a fading 3px rule across the top. Every one of
                    them was argued for and the argument was the wrong one: it was
                    trying to make a small box look raised, and a slide is not a
                    surface you can pick things up off. At 566px the same treatment
                    reads as a glossy panel from 2013.

                    So: an opaque white card, one hairline border, one 4px accent
                    edge on the left that says which tone the point is, and a soft
                    neutral shadow to lift it off the light ground. The accent moved
                    from the top to the LEFT on purpose, so it lines up with the
                    edge `RuleStack` and `Callout` both accent, and the three read
                    as one system.
                  */
                  background: colors.white,
                  border: `1px solid ${colors.line}`,
                  borderLeft: `4px solid ${paint}`,
                  boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
                  padding: PAD,
                }}
              >
                {/* THE ICON LINE. The tone chip rides here rather than taking a row
                    of its own. */}
                <span className="flex items-center" style={{ height: t.icon }}>
                  <span
                    className="grid shrink-0 place-items-center rounded-xl2"
                    style={{
                      width: t.icon,
                      height: t.icon,
                      /* A solid tint at the tone's own hue, not a ramp with a ring
                         in it. The icon is what should read, not its tile. */
                      background: `${paint}14`,
                      color: paint,
                    }}
                  >
                    {Icon ? <Icon width={Math.round(t.icon * 0.52)} height={Math.round(t.icon * 0.52)} /> : null}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <ToneChip tone={p.tone} tag={p.tag} />
                  </span>
                </span>

                {p.term && (
                  <span className="flex" style={{ marginTop: t.iconGap, height: t.termH }}>
                    <TermChip term={p.term} paint={paint} size="sm" />
                  </span>
                )}

                <span
                  className="block font-heading font-bold"
                  style={{
                    color: colors.ink,
                    fontSize: t.labelPx,
                    lineHeight: `${t.labelLh}px`,
                    marginTop: p.term ? t.termGap : t.iconGap,
                    width: CONTENT_W,
                  }}
                >
                  {p.label}
                </span>

                {p.body && (
                  <span
                    className="block"
                    style={{
                      color: colors.body,
                      fontSize: t.bodyPx,
                      lineHeight: `${t.bodyLh}px`,
                      marginTop: t.bodyGap,
                      width: CONTENT_W,
                    }}
                  >
                    {p.body}
                  </span>
                )}

                {/*
                  THE DETAIL, IN THE CARD.

                  It was a hover popover, which on a projector is content nobody in
                  the room can reach. It sits under a hairline rule instead, one
                  size down from the reason, so the card reads claim, then reason,
                  then the why, in that order, and the room can read the third layer
                  or not.
                */}
                {p.detail && (
                  <span
                    className="block"
                    style={{
                      color: colors.body,
                      fontSize: t.detailPx,
                      lineHeight: `${t.detailLh}px`,
                      marginTop: t.detailGap,
                      paddingTop: Math.round(t.detailGap * 0.6),
                      borderTop: `1px solid ${colors.line}`,
                      width: CONTENT_W,
                    }}
                  >
                    {p.detail}
                  </span>
                )}
              </div>
            </HoverAside>
          </FcNodeIn>
        )
      })}

      {caption && (
        <FcEdgeLabel
          at={CAPTION}
          shown={shown[CAPTION]}
          className="absolute text-center text-body-sm"
          style={{ left: 0, width: W, top: CAPTION_Y, color: colors.body }}
        >
          {caption}
        </FcEdgeLabel>
      )}
    </figure>
  )
}
