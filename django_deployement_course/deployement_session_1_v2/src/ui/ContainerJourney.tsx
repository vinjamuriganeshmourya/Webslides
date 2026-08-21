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
  /**
   * Vendor mark for a runtime chip, shown at 16px before the label. The two
   * stack figures in this deck carry the same marks at the same size, so Node
   * and Python stay recognisable as the SAME two things wherever they appear.
   * Vendor file, never recoloured, even inside a red `breaks` chip.
   */
  logo?: string
}

/*
  THE TWO RUNTIMES THIS PROJECT NEEDS, not a runtime and a framework.

  These used to read Django 6.0 / Python 3.14 and Django 5.0 / Python 3.10. The
  `LayerStack` figure on the "Different Ground" slide names the same two things
  and now says Node and Python, so this had to follow: the two figures use the
  same visual language one slide apart, and a room that sees Django in one and
  Node in the other assumes it missed something.

  Node and Python is also the truer pair for this course. The Django backend runs
  on Python and the Vite/React frontend runs on Node, which is exactly what the
  room saw in the two terminals earlier in the deck.

  Keep these version numbers identical to the ones in that `LayerStack`. If one
  moves, move the other.
*/
const APP: ChipSpec[] = [
  { label: 'Your code' },
  { label: 'Node', note: '22', logo: '/assets/tech/nodejs.svg' },
  { label: 'Python', note: '3.14', logo: '/assets/tech/python.svg' },
]

/** What the receiving machine supplies itself, when nothing came with the code. */
const THEIRS: ChipSpec[] = [
  { label: 'Node', note: '20', logo: '/assets/tech/nodejs.svg' },
  { label: 'Python', note: '3.10', logo: '/assets/tech/python.svg' },
]

function Chip({ spec, tone, dim = false }: { spec: ChipSpec; tone: 'ships' | 'breaks'; dim?: boolean }) {
  const style =
    tone === 'ships'
      ? { background: colors.brand, color: '#fff', borderColor: colors.brand }
      : { background: '#FEE2E2', color: colors.danger, borderColor: colors.danger }
  return (
    <div
      className="flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-body-sm font-semibold"
      style={{ ...style, opacity: dim ? 0.4 : 1 }}
    >
      <span className="inline-flex items-center gap-2">
        {spec.logo && (
          <img
            src={spec.logo}
            alt=""
            draggable={false}
            className="h-4 w-4 object-contain"
          />
        )}
        {spec.label}
      </span>
      {spec.note && <span className="font-mono text-xs opacity-80">{spec.note}</span>}
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
      <div className="rounded-xl border-2 bg-white/70 p-3" style={{ borderColor: '#C9D4E2' }}>
        <div className="flex flex-col gap-2" style={{ minHeight: 132 }}>
          {children}
        </div>
        <div
          className="mt-2 rounded-lg py-1.5 text-center text-xs font-bold"
          style={{ background: '#EEF2F7', color: colors.body }}
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
            ...(sealed
              ? {
                  border: `2px dashed ${colors.brand}`,
                  borderRadius: 14,
                  padding: 8,
                  background: '#F5F8FF',
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
          <>
            <Chip spec={{ label: 'Your code' }} tone="ships" dim />
            <AfterLanding>
              <div className="flex flex-col gap-2">
                {THEIRS.map((c) => (
                  <Chip key={c.label} spec={c} tone="breaks" />
                ))}
              </div>
            </AfterLanding>
          </>
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
