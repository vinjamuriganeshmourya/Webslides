import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * "One container = one process. Node gets a container. Python gets a container."
 *
 * The room's natural instinct is to put both apps in one container, and the TR
 * answers "technically yes, and it would be a mess". A table cannot show a mess.
 * So the left half tries it and visibly fails: both runtimes crammed into one
 * box, the box turning red, and a crash marker landing on BOTH halves at once to
 * make the "one crash takes down both" point. The right half is the same content
 * arranged correctly, and stays calm.
 *
 * The failure plays once and stops on the failed frame, so the presenter can point
 * at it.
 *
 * THE TWO HALVES ARE ONE COMPARISON, SO THEY ARE ONE HEIGHT.
 *
 * They used to be two loose stacks under two floating labels, sized by whatever
 * each happened to contain: the left column ran about thirty pixels taller than
 * the right, the two verdict labels sat at the same y but nothing under them
 * did, and the eye had no shared line to compare across. Reported on the
 * one-process slide. Both halves are now cards on `items-stretch` with the
 * verdict in a header band, so the frames are the same height by construction
 * however the copy inside them changes, and the two bands read as one row.
 *
 * THE CARD TREATMENT IS SESSION 1 V3'S, NOT A NEW ONE.
 *
 * Lifted from `deployement_session_1_v3/src/ui/MachineBoundary.tsx`, which is
 * where the deck's containers were given a light source: a top-left white
 * radial, a 135deg ramp landing just off white, a hairline pair inset top and
 * bottom, and a drop shadow tinted with the card's OWN colour rather than
 * neutral black. Every other figure in that deck reads as lit, and a flat white
 * rectangle beside them reads as a different drawing.
 */

const CRASH_AT = 1.6

/** The lit surface, at the amplitude v3 uses for a tinted tile. */
function litSurface(color: string) {
  return [
    'radial-gradient(120% 100% at 14% 0%, #FFFFFF 0%, #FFFFFF00 60%)',
    `linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 45%, ${color}0f 100%)`,
  ].join(', ')
}

function litShadow(color: string) {
  return [
    `0 3px 10px -4px ${color}4d`,
    'inset 0 1px 0 0 #FFFFFF',
    `inset 0 -1px 0 0 ${color}1f`,
  ].join(', ')
}

/**
 * One half of the comparison: a header band naming the verdict, and a body.
 *
 * `items-stretch` on the row is what equalises the two heights; `flex-1` on the
 * body is what lets the shorter half's content spread into the extra space
 * instead of leaving a hole under it.
 */
function Half({
  label,
  color,
  children,
}: {
  label: string
  color: string
  children: ReactNode
}) {
  return (
    <div
      /* No `h-full` here: a percentage height on a flex item overrides the row's
         `items-stretch` and resolves against an auto-height parent, which is what
         left the two cards 23px apart when this was first written. Stretch alone
         is what equalises them. */
      className="flex w-[224px] flex-col overflow-hidden rounded-card border-2"
      style={{ borderColor: color, background: litSurface(color), boxShadow: litShadow(color) }}
    >
      <div
        className="px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white"
        style={{ background: color }}
      >
        {label}
      </div>
      <div className="flex flex-1 flex-col p-3">{children}</div>
    </div>
  )
}

function Runtime({ logo, name, onDark = false }: { logo: string; name: string; onDark?: boolean }) {
  const color = onDark ? colors.danger : colors.line
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg border-2 px-2.5 py-1.5"
      style={{
        borderColor: color,
        background: litSurface(color),
        boxShadow: litShadow(color),
      }}
    >
      <img src={logo} alt="" draggable={false} className="h-5 w-5 shrink-0 object-contain" />
      <span className="text-xs font-bold" style={{ color: colors.ink }}>
        {name}
      </span>
    </div>
  )
}

export function OneProcessRule({ className = '' }: { className?: string }) {
  const instant = useInstant()
  const d = (x: number) => (instant ? 0 : x)

  return (
    <div className={`flex items-stretch justify-center gap-5 ${className}`}>
      {/* The attempt */}
      <Half label="Both in one" color={colors.danger}>
        {/*
          The inner box is what turns red, not the card: the card's frame is the
          verdict and has been red since the slide arrived, so animating it again
          would say nothing. What changes is the thing being attempted inside it.
        */}
        <motion.div
          className="relative flex flex-1 flex-col rounded-xl border-2 p-2.5"
          initial={instant ? false : { borderColor: colors.line, background: '#FFFFFF' }}
          animate={{ borderColor: colors.danger, background: '#FEF2F2' }}
          transition={{ duration: 0.5, delay: d(CRASH_AT), ease: easing.soft }}
        >
          <div className="flex flex-col gap-2">
            <Runtime logo="/assets/tech/nodejs.png" name="Node runtime" onDark />
            <Runtime logo="/assets/tech/python.png" name="Python runtime" onDark />
          </div>
          <div
            className="mt-2 space-y-1 text-xs font-semibold"
            style={{ color: colors.danger }}
          >
            <div>two runtimes in one image</div>
            <div>two processes to babysit</div>
          </div>
          {/* The crash lands across BOTH runtimes, which is the actual argument.
              It is pinned to the two runtime chips (inset from the box's own
              padding, 84px tall, which is the pair plus their gap) rather than
              centred in the box, so it still covers exactly them now that the box
              stretches to the card's height. */}
          <motion.div
            className="absolute inset-x-2.5 top-2.5 flex h-[84px] items-center justify-center rounded-lg"
            style={{ background: 'rgba(239,68,68,0.9)' }}
            initial={instant ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: d(CRASH_AT + 0.25), ease: easing.springy }}
          >
            <span className="text-center text-xs font-bold leading-tight text-white">
              one crash kills both
            </span>
          </motion.div>
        </motion.div>
      </Half>

      {/* The rule */}
      <Half label="One each" color={colors.brand}>
        <div className="flex flex-1 flex-col gap-2">
          {[
            { logo: '/assets/tech/nodejs.png', name: 'Node runtime', svc: 'frontend' },
            { logo: '/assets/tech/python.png', name: 'Python runtime', svc: 'backend' },
          ].map((r, i) => (
            <motion.div
              key={r.svc}
              /* `flex-1` on each of the two, so the pair fills the card the left
                 half's taller content sets. Without it they sat at their natural
                 height and left a gap under the second one. */
              className="flex flex-1 flex-col justify-center rounded-xl border-2 p-2.5"
              style={{
                borderColor: colors.brand,
                background: litSurface(colors.brand),
                boxShadow: litShadow(colors.brand),
              }}
              initial={instant ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: d(0.2 + i * 0.15), ease: easing.soft }}
            >
              <Runtime logo={r.logo} name={r.name} />
              <div className="mt-1.5 text-center text-xs font-bold" style={{ color: colors.brandDark }}>
                its own container
              </div>
            </motion.div>
          ))}
        </div>
      </Half>
    </div>
  )
}
