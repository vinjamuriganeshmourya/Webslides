import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * `docker compose exec backend python manage.py migrate`, split into the three
 * questions it answers.
 *
 * `exec` is the one new command of the session, and it is long. Read as a single
 * string it looks like a magic incantation to memorise. Split into three labelled
 * parts it is obviously three decisions, and the third part is a command the room
 * has typed since the Django course.
 *
 * That last point is the reason the figure exists: the payoff is "the exact
 * command you have always used", and it only lands if the room can SEE the
 * familiar command sitting inside the unfamiliar one.
 *
 * The TR draws this as a labelled anatomy with rules dropping to captions, so
 * this figure keeps that shape rather than inventing another.
 */

const PARTS = [
  {
    text: 'docker compose exec',
    caption: 'run a command inside\na RUNNING container',
    paint: colors.brand,
  },
  {
    text: 'backend',
    caption: "in this service's\ncontainer",
    paint: colors.teal,
  },
  {
    text: 'python manage.py migrate',
    caption: 'the exact command you\nhave always used',
    paint: colors.accent,
  },
] as const

/* Monospace at 17px sits close enough to 10.2px per character that laying the
   parts out by character count keeps the rendered string continuous, without
   measuring text at runtime. */
const CH = 10.2
const GAP = 18
const START = 20

export function ExecAnatomy({ className = '' }: { className?: string }) {
  const instant = useInstant()

  let cursor = START
  const placed = PARTS.map((p) => {
    const w = p.text.length * CH
    const at = cursor
    cursor += w + GAP
    return { ...p, x: at, w }
  })

  return (
    <div className={className}>
      <svg viewBox="0 0 630 214" className="w-full" role="img" aria-label="The exec command split into its three parts">
        <rect x={8} y={16} width={614} height={58} rx={12} fill={colors.night} />

        {placed.map((p, i) => (
          <motion.g
            key={p.text}
            initial={instant ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: instant ? 0 : i * 0.18, ease: easing.soft }}
          >
            <text
              x={p.x}
              y={52}
              fontSize={17}
              fontWeight={700}
              fontFamily="ui-monospace, monospace"
              fill={p.paint}
            >
              {p.text}
            </text>
          </motion.g>
        ))}

        {placed.map((p, i) => {
          const mid = p.x + p.w / 2
          return (
            <motion.g
              key={`${p.text}-caption`}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: instant ? 0 : 0.5 + i * 0.2, ease: easing.soft }}
            >
              {/* The rule from the token down to its caption */}
              <path
                d={`M ${mid} 82 V 104`}
                stroke={p.paint}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle cx={mid} cy={104} r={3.4} fill={p.paint} />
              {p.caption.split('\n').map((line, li) => (
                <text
                  key={line}
                  x={mid}
                  y={128 + li * 19}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  fill={li === 0 ? colors.ink : colors.body}
                >
                  {line}
                </text>
              ))}
            </motion.g>
          )
        })}

        <motion.text
          x={315}
          y={196}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill={colors.muted}
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: instant ? 0 : 1.16 }}
        >
          Django lives inside the container now, so the command has to go there too
        </motion.text>
      </svg>
    </div>
  )
}
