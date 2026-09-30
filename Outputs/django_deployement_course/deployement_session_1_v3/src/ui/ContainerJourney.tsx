import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'

/**
 * One act of the containerization journey, played once.
 *
 *   act 0   Only the code travels. It lands on a machine that supplies the
 *           layers underneath at its own versions, and the app breaks.
 *   act 1   The code and its environment travel together as one sealed unit.
 *           It lands unchanged, and the app runs.
 *
 * The two acts share the same machines, the same lane and the same chip styling,
 * so across the two slides the ONLY thing that visibly differs is how much of the
 * stack made the journey. That difference is the whole teaching.
 *
 * Deliberately plays ONCE and stops on its final frame, rather than looping: a
 * looping graphic pulls the eye back every few seconds while the presenter is
 * still talking, and it never settles into a state you can point at.
 *
 * Under `?all` (QA and thumbnail mode) every stage renders at its final state
 * immediately, so screenshots capture the settled frame rather than mid flight.
 */

const STILL =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('all')

/** Slow enough to follow, with a long settle before the verdict lands. */
const START = 0.45
const TRAVEL = 2.6
/** The artifact dissolves as it arrives, and the destination fills in on the same
 *  beat, so the code is never visibly in two places at once. */
const VERDICT_AT = START + TRAVEL - 0.2

interface ChipSpec {
  label: string
  note?: string
  /** Vendor mark for a runtime layer. Omitted on `Your code`, which is not a product. */
  logo?: string
}

/*
  THE TWO RUNTIMES, NOT A RUNTIME AND A FRAMEWORK.

  This stack used to read Django 6.0 over Python 3.14, which named the same tier
  twice: Django is a library that Python supplies, so the picture showed one
  runtime wearing two boxes. The `LayerStack` pairs later in the deck already say
  Node and Python, because the project the room is building is a Vite frontend on
  Node and a REST backend on Python. Those two are what actually differ between
  machines, and they are the pair this figure now ships.

  The versions match the `LayerStack` slides exactly, on purpose: 22 and 3.14 on
  the machine that works, 20 and 3.10 on the machine that does not. The room sees
  the same four numbers in both figures, so the second one costs them nothing.

  PNG marks rather than the SVGs the deck header uses, so the chips carry the same
  raster assets as the OS tiles and nothing here depends on an inline SVG surviving
  the single-file build.
*/
const PY_LOGO = '/assets/tech/python.png'
const NODE_LOGO = '/assets/tech/nodejs.png'

const APP: ChipSpec[] = [
  { label: 'Your code' },
  { label: 'Node', note: '22', logo: NODE_LOGO },
  { label: 'Python', note: '3.14', logo: PY_LOGO },
]

/** What the receiving machine supplies itself, when nothing came with the code. */
const THEIRS: ChipSpec[] = [
  { label: 'Node', note: '20', logo: NODE_LOGO },
  { label: 'Python', note: '3.10', logo: PY_LOGO },
]

/*
  THE SHIPPING CHIP IS A LIT SURFACE, NOT A FLAT FILL.

  It was one flat `colors.brand` rectangle with a border of the SAME blue, which is
  a border doing no work: three of them stacked read as a single blue slab instead
  of as three separate things that travel. It now carries a 135deg ramp that starts
  above `brand` and lands on `brandDark`, a soft white radial at the top-left that
  makes it read as lit rather than two-tone, a brand-tinted drop shadow, and inset
  hairlines top and bottom that give it a thickness.

  A first pass at this used a `brand` to `brandDark` ramp on its own. Across a box
  this short that moves too few pixels to register, and at 3x zoom it still looked
  flat. The radial and the hairlines are what carry it.

  `#4C7AFD` is `brand` lifted about 12%, a literal because the palette has no tint
  ABOVE `brand`: `brand`, `brandDark` and `brandDeep` all run darker.

  `breaks` stays flat on purpose. This figure is about what travels, and depth on
  the layer that travels is what separates it from the ground it lands on. Lighting
  both would put us back where we started with more steps.
*/
const SHIP_BG = [
  'radial-gradient(120% 100% at 14% 0%, #FFFFFF3d 0%, #FFFFFF00 58%)',
  `linear-gradient(135deg, #4C7AFD 0%, ${colors.brand} 46%, ${colors.brandDark} 100%)`,
].join(', ')

const SHIP_SHADOW = [
  `0 3px 10px -3px ${colors.brandDeep}66`,
  'inset 0 1px 0 0 #FFFFFF59',
  `inset 0 -1px 0 0 ${colors.brandDeep}33`,
].join(', ')

/*
  THE SAME LIGHT SOURCE ON THE OTHER STATES.

  Lighting only the blue chip left the red one flat beside it, and a figure lit from
  two different places reads as two figures. `breaks` gets the identical structure
  at a gentler amplitude, because it is a TINT with dark text on it rather than a
  solid with white text: the same ramp depth that looks like dimension on the blue
  would look like a stain here. Highlight down, shadow down, hairline kept.
*/
const BREAK_BG = [
  'radial-gradient(120% 100% at 14% 0%, #FFFFFF99 0%, #FFFFFF00 62%)',
  'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 52%, #FBCDCD 100%)',
].join(', ')

const BREAK_SHADOW = [
  `0 3px 10px -4px ${colors.danger}59`,
  'inset 0 1px 0 0 #FFFFFFb3',
  `inset 0 -1px 0 0 ${colors.danger}2e`,
].join(', ')

function Chip({ spec, tone, dim = false }: { spec: ChipSpec; tone: 'ships' | 'breaks'; dim?: boolean }) {
  const ships = tone === 'ships'
  const style = ships
    ? {
        background: SHIP_BG,
        color: '#fff',
        borderColor: colors.brandDark,
        boxShadow: SHIP_SHADOW,
        /* the label has to hold up over the dark end of the ramp too */
        textShadow: `0 1px 1px ${colors.brandDeep}4d`,
      }
    : {
        background: BREAK_BG,
        color: colors.danger,
        borderColor: colors.danger,
        boxShadow: BREAK_SHADOW,
      }
  return (
    <div
      className="flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-body-sm font-semibold"
      style={{ ...style, opacity: dim ? 0.4 : 1 }}
    >
      {/*
        THE MARK SITS ON ITS OWN WHITE TILE, the same treatment the deck's
        `RuntimeLabel` uses. Python's navy-and-yellow and Node's dark green have
        almost no separation from the brand blue of a `ships` chip, so dropped
        straight onto it they read as smudges. The tile gives every mark the light
        ground it was drawn for, on the blue chips and the red ones alike, and it
        keeps the vendor files unrecoloured, which the asset rules require.
      */}
      <span className="inline-flex min-w-0 items-center gap-2">
        {spec.logo && (
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
            style={{ background: '#fff', boxShadow: `0 1px 2px 0 ${colors.brandDeep}2e` }}
          >
            <img src={spec.logo} alt="" draggable={false} className="h-3.5 w-3.5 object-contain" />
          </span>
        )}
        <span className="truncate">{spec.label}</span>
      </span>
      {/* A flat 0.8 opacity over a gradient goes muddy at the bottom of the box. */}
      {spec.note && (
        <span
          className="font-mono text-xs"
          style={ships ? { color: '#FFFFFFc7' } : { opacity: 0.8 }}
        >
          {spec.note}
        </span>
      )}
    </div>
  )
}

/* The bottom row is labelled OS, not Windows. Naming one vendor lets the room
   read this as a Windows problem, when the whole point is that the layer differs
   from machine to machine whatever it happens to be. */
function Machine({
  title,
  tag,
  children,
}: {
  title: string
  /** Optional Docker word for this machine. The row is reserved whether or not a
   *  tag is passed, so both machines stay vertically aligned. */
  tag?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="w-[250px] shrink-0">
      <div className="mb-1 text-center text-body-sm font-bold text-ink">{title}</div>
      <div className="mb-1 h-4 text-center text-xs font-bold uppercase tracking-wide">{tag}</div>
      {/*
        THE MACHINE ITSELF IS A SURFACE TOO. It was a flat 70% white panel with a
        grey rule around it, which made the lit chips look like they were floating
        on nothing. It now has the same top-left light and a soft neutral shadow,
        one step quieter than the chips it holds so it stays the ground and they
        stay the figure.
      */}
      <div
        className="rounded-xl border-2 p-3"
        style={{
          borderColor: '#C9D4E2',
          background:
            'radial-gradient(120% 90% at 12% 0%, #FFFFFF 0%, #FFFFFFd9 40%, #F3F7FDd9 100%)',
          boxShadow: `0 4px 14px -8px ${colors.brandDeep}33, inset 0 1px 0 0 #FFFFFF`,
        }}
      >
        <div className="flex flex-col gap-2" style={{ minHeight: 132 }}>
          {children}
        </div>
        {/* The plinth the stack stands on. Lit like everything else, and the
            quietest of the three: it is the layer that never travels. */}
        <div
          className="mt-2 rounded-lg py-1.5 text-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #F6F9FD 0%, #EEF2F7 55%, #E2E9F3 100%)',
            color: colors.body,
            boxShadow: `inset 0 1px 0 0 #FFFFFF, inset 0 -1px 0 0 ${colors.brandDeep}14`,
          }}
        >
          OS
        </div>
      </div>
    </div>
  )
}

/** Fades in once, after the artifact has landed. */
function AfterLanding({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={STILL ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: STILL ? 0 : VERDICT_AT, duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function ContainerJourney({
  act,
  /**
   * Annotate the same figure with Docker's vocabulary: the sealed thing you send
   * is an IMAGE, the running copy on the far machine is a CONTAINER. Used on the
   * bridge slide so the two new words attach to a picture the room already
   * understands, rather than arriving cold.
   */
  docker = false,
}: {
  act: 0 | 1
  docker?: boolean
}) {
  const shipped = act === 0 ? 1 : 3
  const sealed = act === 1

  return (
    <div className="flex items-start justify-between gap-4 px-2">
      <Machine title="Your machine">
        {APP.map((c) => (
          <Chip key={c.label} spec={c} tone="ships" />
        ))}
      </Machine>

      {/* the lane the artifact crosses */}
      <div className="relative mt-14 min-w-0 flex-1">
        <div className="h-0.5 w-full" style={{ background: '#C9D4E2' }} />

        <motion.div
          className="absolute top-0 flex -translate-y-1/2 flex-col gap-1.5"
          style={{
            width: 180,
            /* The sealed unit is the travelling twin of the machine panel, so it
               takes the same light rather than a flat fill. Its shadow is the one
               shadow in the figure that is allowed to be a little stronger: this
               box is the only thing here that is off the ground. */
            ...(sealed
              ? {
                  border: `2px dashed ${colors.brand}`,
                  borderRadius: 14,
                  padding: 8,
                  background:
                    'radial-gradient(120% 90% at 12% 0%, #FFFFFF 0%, #F5F8FF 55%, #E8F0FF 100%)',
                  boxShadow: `0 8px 22px -12px ${colors.brandDeep}66`,
                }
              : null),
          }}
          initial={STILL ? false : { left: '0%', opacity: 0 }}
          animate={
            STILL
              ? { left: '68%', opacity: docker ? 1 : 0 }
              : {
                  left: ['0%', '0%', '68%', '68%'],
                  opacity: docker ? [0, 1, 1, 1] : [0, 1, 1, 0],
                }
          }
          transition={{
            duration: STILL ? 0 : START + TRAVEL,
            times: [0, START / (START + TRAVEL), 0.9, 1],
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {docker && sealed && (
            <div
              className="absolute -top-6 left-0 text-xs font-bold uppercase tracking-wide"
              style={{ color: colors.brand }}
            >
              image
            </div>
          )}
          {APP.slice(0, shipped).map((c) => (
            <Chip key={c.label} spec={c} tone="ships" />
          ))}
        </motion.div>

        <div
          className="absolute inset-x-0 text-center text-body-sm font-semibold"
          style={{ top: sealed ? 92 : 46, color: sealed ? colors.brand : colors.danger }}
        >
          {sealed ? 'the code and its environment' : 'the code alone'}
        </div>
      </div>

      <Machine
        title="Another machine"
        tag={
          docker && act === 1 ? (
            <AfterLanding>
              <span style={{ color: colors.success }}>container</span>
            </AfterLanding>
          ) : null
        }
      >
        {act === 0 ? (
          /*
            YOUR CODE ARRIVES, IT IS NOT ALREADY THERE.

            This chip used to render outside `AfterLanding`, so "Your code" sat on
            the far machine from the first frame, before the packet had left the
            near one. The figure then said the opposite of what the slide says: the
            code was in two places at once and the journey looked decorative.

            It now lands on the same beat as the versions the receiving machine
            supplies itself, which is what `VERDICT_AT` was written for: the packet
            dissolves as the destination fills in. It stays `dim`, because arriving
            is not the same as running, and the red rows underneath are the reason.

            `Machine` reserves `minHeight: 132` so the panel does not resize when
            this appears, and `AfterLanding` renders immediately under `?all`, so
            the static harnesses still measure the settled frame.
          */
          <AfterLanding>
            <div className="flex flex-col gap-2">
              <Chip spec={{ label: 'Your code' }} tone="ships" dim />
              {THEIRS.map((c) => (
                <Chip key={c.label} spec={c} tone="breaks" />
              ))}
            </div>
          </AfterLanding>
        ) : (
          <AfterLanding>
            <div className="flex flex-col gap-2">
              {APP.map((c) => (
                <Chip key={c.label} spec={c} tone="ships" />
              ))}
            </div>
          </AfterLanding>
        )}
      </Machine>
    </div>
  )
}
