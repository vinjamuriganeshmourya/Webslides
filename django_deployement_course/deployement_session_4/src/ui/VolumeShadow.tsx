import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { SurfaceDefs, surface, TopHighlight } from '@/ui/svgDepth'

/**
 * Why the volume mounts at `/app/data` and not at `/app`.
 *
 * "A volume mounted at a folder TAKES THAT FOLDER OVER." Mounted at `/app`, the
 * volume captures the code on its first run and keeps serving that stale copy
 * forever: every rebuilt image is silently shadowed, and `--build` appears to do
 * nothing. That symptom is indistinguishable from the trap this course has hit
 * twice already, which is exactly why it needs a picture rather than a sentence.
 *
 * Two acts on one figure, chosen with the `act` prop the way `ContainerJourney`
 * and `VolumeSurvival` do it:
 *
 *   act 1 — the volume lands on `/app`, the code greys out, a rebuild bounces off
 *   act 2 — the volume lands on `/app/data`, the code stays lit, the rebuild lands
 *
 * The wrong version is drawn FIRST and on the left, so the correct one reads as
 * the fix rather than as an alternative worth weighing.
 */

const BOX = { w: 250, h: 172 }

function Panel({
  x,
  wrong,
  active,
  instant,
  delay,
}: {
  x: number
  wrong: boolean
  active: boolean
  instant: boolean
  delay: number
}) {
  const paint = wrong ? colors.danger : colors.success
  /* The code folder is shadowed only in the wrong panel, and only once the
     volume has landed on it. */
  const codeDim = wrong && active

  return (
    <motion.g
      initial={instant ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: active ? 1 : 0.34, y: 0 }}
      transition={{ duration: 0.5, delay: instant ? 0 : delay, ease: easing.soft }}
    >
      {/* The panel, lit (STYLE_GUIDE section 9). `fill={colors.white}` on both
          halves made the wrong one and the right one the same flat object, and
          the tinted shadow is what tells them apart before a single label has
          been read: the wrong panel's is red, the correct one's is green. */}
      <rect
        x={x}
        y={34}
        width={BOX.w}
        height={BOX.h}
        rx={14}
        {...surface(wrong ? 'danger' : 'teal')}
        strokeWidth={2.5}
      />
      <TopHighlight x={x} y={34} width={BOX.w} rx={14} />

      <text x={x + BOX.w / 2} y={22} textAnchor="middle" fontSize={14} fontWeight={800} fill={paint}>
        {wrong ? 'db_data:/app' : 'db_data:/app/data'}
      </text>

      {/* /app, holding the code that came from the image */}
      {/* /app is the layer that gets covered, so it sits FLATTER than the panel
          around it: `flat` keeps its ramp and drops its shadow, which is how the
          style guide says a surface recedes without going dead. */}
      <rect
        x={x + 20}
        y={58}
        width={BOX.w - 40}
        height={90}
        rx={10}
        {...surface('neutral', { flat: true })}
        strokeWidth={1.5}
        opacity={codeDim ? 0.55 : 1}
      />
      <text x={x + 32} y={78} fontSize={13} fontWeight={800} fontFamily="ui-monospace, monospace" fill={colors.ink}>
        /app
      </text>
      <motion.text
        x={x + 32}
        y={100}
        fontSize={12}
        fontWeight={700}
        fill={codeDim ? colors.muted : colors.body}
        animate={{ opacity: codeDim ? 0.45 : 1 }}
        transition={{ duration: 0.4 }}
      >
        manage.py · myproject
      </motion.text>
      <motion.text
        x={x + 32}
        y={118}
        fontSize={12}
        fontWeight={700}
        fill={codeDim ? colors.muted : colors.body}
        animate={{ opacity: codeDim ? 0.45 : 1 }}
        transition={{ duration: 0.4 }}
      >
        products · users · cart
      </motion.text>

      {/* The data sub-folder exists only in the correct panel */}
      {!wrong && (
        <rect
          x={x + 32}
          y={124}
          width={BOX.w - 64}
          height={18}
          rx={5}
          {...surface('teal')}
          stroke={colors.success}
          strokeWidth={1.5}
        />
      )}
      {!wrong && (
        <text x={x + 42} y={137} fontSize={11} fontWeight={800} fontFamily="ui-monospace, monospace" fill={colors.success}>
          /app/data
        </text>
      )}

      {/* Where the volume lands */}
      <motion.rect
        x={wrong ? x + 20 : x + 32}
        y={wrong ? 58 : 124}
        width={wrong ? BOX.w - 40 : BOX.w - 64}
        height={wrong ? 90 : 18}
        rx={wrong ? 10 : 5}
        fill={paint}
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: active ? (wrong ? 0.2 : 0.16) : 0 }}
        transition={{ duration: 0.5, delay: instant ? 0 : delay + 0.25, ease: easing.soft }}
      />

      <text x={x + BOX.w / 2} y={172} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={paint}>
        {wrong ? 'the code is shadowed' : 'the code stays in the image'}
      </text>
      <text x={x + BOX.w / 2} y={191} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={colors.muted}>
        {wrong ? '--build appears to do nothing' : 'rebuilds replace it normally'}
      </text>
    </motion.g>
  )
}

export function VolumeShadow({ act = 1, className = '' }: { act?: 1 | 2; className?: string }) {
  const instant = useInstant()

  return (
    <div className={className}>
      <svg viewBox="0 0 630 210" className="w-full" role="img" aria-label="A volume mounted at /app shadows the code; mounted at /app/data it does not">
        <SurfaceDefs />
        <Panel x={12} wrong active={act >= 1} instant={instant} delay={0} />
        <Panel x={368} wrong={false} active={act >= 2} instant={instant} delay={0.14} />
      </svg>
    </div>
  )
}
