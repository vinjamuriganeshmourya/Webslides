import { RevealGroup, Reveal } from '@/motion/Reveal'
import { iconByName } from './icons'
import { colors } from '@/design/tokens'

/**
 * What the word `localhost` actually draws: a boundary.
 *
 * Inside the box, the browser and both dev servers are neighbours on one
 * machine. Outside it, a friend's browser sends the same request and it dies at
 * the boundary, because `localhost` resolved on *their* computer and there is
 * nothing there.
 *
 * Scope note (R2): the failed request is the point of the figure. Nothing here
 * is a server, a globe or a public address. This is still Problem 1.
 *
 * THREE THINGS THE DESIGN PASS CHANGED, AND WHAT EACH ONE WAS
 *
 *   1. **The severed request now touches both boxes.** It used to be a 30x34px
 *      SVG floating in the 12px gap between the machine and the friend's
 *      browser, with a dashed stub, an X at the stub's top, and the words beside
 *      it. Nothing about it connected the two things it was drawn between, so
 *      the frame read as three unrelated objects and the room had to be told
 *      which two the refusal was between. The connector is now a full-height
 *      element that starts on the machine's bottom edge and ends on the friend's
 *      top edge, with the X ON the line, halfway.
 *   2. **The tiles lost their tint.** Each was a radial highlight over a
 *      diagonal ramp over a white base, with a tone-tinted shadow and two inset
 *      hairlines: five layers of paint on a 44px box, which on a projector reads
 *      as a glossy button rather than as a thing running on a machine. Solid
 *      white on one hairline border.
 *   3. **The three named things carry their real marks.** "React dev server"
 *      was drawn with `code` (a `</>` glyph) and "Django runserver" with
 *      `server`, so the two names the room is meant to recognise looked like
 *      generic boxes. They carry the React and Django logos now, per hard rule
 *      12, and the browser carries a browser window rather than `devices`,
 *      which is a monitor with a phone in front of it and means "responsive".
 */

const REACT_LOGO = '/assets/tech/react.png'
const DJANGO_LOGO = '/assets/tech/django.png'

function Tile({
  icon,
  logo,
  label,
  port,
  muted = false,
}: {
  icon?: keyof typeof iconByName
  /** A vendor mark, unrecoloured, for a tile that names a technology. */
  logo?: string
  label: string
  port?: string
  muted?: boolean
}) {
  const Icon = icon ? iconByName[icon] : null
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-3.5 py-2"
      style={{
        background: colors.white,
        borderColor: colors.line,
        opacity: muted ? 0.6 : 1,
        boxShadow: `0 2px 8px -6px ${colors.nwNavy}59`,
      }}
    >
      {/*
        THE MARK SITS ON ITS OWN NEUTRAL WELL, and the well is a solid fill.
        A vendor logo needs the light ground it was drawn for, and giving the
        icon and the two logos the same well is what makes the three tiles read
        as one row rather than as a glyph beside two pictures.
      */}
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ background: colors.surface2, color: colors.body }}
      >
        {logo ? (
          <img src={logo} alt="" draggable={false} className="h-[18px] w-[18px] object-contain" />
        ) : Icon ? (
          <Icon width={17} height={17} />
        ) : null}
      </span>
      <span className="leading-tight">
        <span className="block text-body-sm font-semibold text-ink">{label}</span>
        {port && (
          /* NEAR-BLACK, NOT THE TILE'S OWN COLOUR. These three lines were teal
             and brand blue, which made the address look like a status: the room
             read "localhost:3000" in the same green the rest of the deck uses
             for "this works". It is an address, so it is set like text. */
          <span className="mt-0.5 block font-mono text-xs" style={{ color: colors.nwBlack }}>
            {port}
          </span>
        )}
      </span>
    </div>
  )
}

/**
 * THE SEVERED REQUEST.
 *
 * One element spanning the whole gap: the dashed line starts at y=0, which is
 * the machine's bottom edge, and ends at y=H, which is the friend's browser's
 * top edge. `RevealGroup` below runs at `gap-0` for exactly this reason, so
 * there is no 12px of unowned space at either end for the line to fall short of.
 *
 * The X sits on the line's midpoint, over an opaque disc, so the line reads as
 * cut rather than as crossed out.
 */
/*
  52, AND THE NUMBER IS MEASURED RATHER THAN CHOSEN.

  The figure has to end above y=649, which is where the deck draws its own
  control bar over the stage: `align-check.mjs` reported the friend's caption
  sitting under it by 5px, which is the defect that made a v3 slide read as
  "the a__r_ss becomes". At 74 the framed figure was 496px tall in a 440px well,
  so it hung 28px past each end. 52 gets it to 454 and clears the bar.

  It is still more than twice the gap this figure had before the pass, and the
  gap is now doing work: it holds the line, the X and the label.
*/
const CONNECTOR_H = 52

function SeveredRequest() {
  const mid = CONNECTOR_H / 2
  return (
    <div className="relative w-full" style={{ height: CONNECTOR_H }}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${CONNECTOR_H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* The request travels UP, from the friend's browser toward the machine,
            which is the direction it is actually sent in. */}
        <path
          d={`M50 ${CONNECTOR_H} V0`}
          stroke={colors.danger}
          strokeWidth="2.5"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The arrowhead, drawn in its own un-stretched SVG so `preserveAspectRatio
          none` above cannot skew it. */}
      <svg
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M1 9 8 1l7 8"
          stroke={colors.danger}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* THE X, ON THE LINE. */}
      <span
        className="absolute left-1/2 grid place-items-center rounded-full"
        style={{
          top: mid,
          width: 26,
          height: 26,
          transform: 'translate(-50%, -50%)',
          background: colors.white,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 3l10 10M13 3 3 13"
            stroke={colors.danger}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className="absolute font-mono text-body-sm font-semibold"
        style={{ left: '50%', marginLeft: 22, top: mid, transform: 'translateY(-50%)', color: colors.danger }}
      >
        connection refused
      </span>
    </div>
  )
}

export function MachineBoundary({ className = '' }: { className?: string }) {
  return (
    /* `gap-0`: the connector owns the space between the two boxes, so it can
       touch both of them. See `SeveredRequest`. */
    <RevealGroup className={`flex flex-col items-center gap-0 ${className}`} stagger={0.12}>
      {/* Inside the boundary */}
      <Reveal dir="up" className="w-full">
        <div
          className="relative rounded-card border-2 border-dashed p-6"
          style={{
            borderColor: colors.brand,
            background: colors.surface,
          }}
        >
          {/*
            THE MACHINE IS NAMED WITH A MARK, NOT ONLY WITH WORDS.

            It used to be a text-only pill notched into the top border. The one
            object on this slide that the whole argument is about ("your machine")
            was the only object on it with nothing to look at, so the eye went to
            the three tiles inside instead and the boundary read as a container
            for them rather than as the subject.
          */}
          <span
            className="absolute -top-3.5 left-5 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
            style={{ background: colors.brand }}
          >
            <LaptopMark />
            Your machine
          </span>
          <div className="mt-1 flex flex-col gap-2">
            <Tile icon="browser" label="Your browser" />
            <Tile logo={REACT_LOGO} label="React dev server" port="localhost:3000" />
            <Tile logo={DJANGO_LOGO} label="Django runserver" port="localhost:8000" />
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-brand-600">
            Neighbours inside one box
          </p>
        </div>
      </Reveal>

      <Reveal dir="up" className="w-full">
        <SeveredRequest />
      </Reveal>

      <Reveal dir="up" className="w-full">
        <div className="mx-auto w-[66%]">
          <Tile icon="browser" label="A friend's browser" port="localhost:3000" muted />
        </div>
        <p className="mt-2 text-center text-xs text-body">
          Their <span className="font-mono">localhost</span> is their machine
        </p>
      </Reveal>
    </RevealGroup>
  )
}

/** The laptop glyph in the machine's own chip, at chip size and in white. */
function LaptopMark() {
  const Icon = iconByName.laptop
  return <Icon width={13} height={13} />
}
