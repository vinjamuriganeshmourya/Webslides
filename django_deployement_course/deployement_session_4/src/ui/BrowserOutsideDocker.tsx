import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * "The frontend container only DELIVERS the React code. The code RUNS in your
 * browser, and your browser is not inside Docker."
 *
 * The most important figure in the session, and the answer to the paradox set up
 * two concepts earlier: the Compose file says `VITE_API_BASE_URL:
 * http://localhost:8000`, flatly contradicting last session's rule that service
 * names are hostnames, and it is correct.
 *
 * It is correct because of ONE spatial fact, and this figure exists to make that
 * fact impossible to miss: the browser sits OUTSIDE the Docker boundary. Both of
 * its arrows therefore leave the machine's Docker box and come back in through
 * published ports. Nothing crosses the Compose network today, because nothing in
 * this session is container-to-container.
 *
 * Deliberately NOT a variant of Session 3's `ComposeNetwork`. That figure draws
 * the inside view, where `backend:8000` resolves and `localhost` loops back on
 * itself. Drawing both claims on one figure is what makes a learner believe the
 * two addresses are interchangeable options. They are answers to different
 * questions, so they get different pictures.
 */

const OUTER = { x: 10, y: 12, w: 610, h: 268 }
const DOCKER = { x: 258, y: 46, w: 348, h: 214 }
const BROWSER = { x: 32, y: 108, w: 176, h: 92 }

function Container({
  y,
  name,
  port,
  logo,
  delay,
  instant,
}: {
  y: number
  name: string
  port: string
  logo: string
  delay: number
  instant: boolean
}) {
  return (
    <motion.g
      initial={instant ? false : { opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: instant ? 0 : delay, ease: easing.soft }}
    >
      <rect x={412} y={y} width={166} height={70} rx={12} fill={colors.white} stroke={colors.teal} strokeWidth={2} />
      <image href={logo} x={428} y={y + 20} width={30} height={30} preserveAspectRatio="xMidYMid meet" />
      <text x={470} y={y + 32} fontSize={15} fontWeight={800} fill={colors.ink}>
        {name}
      </text>
      <text x={470} y={y + 52} fontSize={12.5} fontWeight={700} fontFamily="ui-monospace, monospace" fill={colors.tealDark}>
        {port}
      </text>
    </motion.g>
  )
}

/** One published-port door on the Docker boundary. */
function PortDoor({ y, delay, instant }: { y: number; delay: number; instant: boolean }) {
  return (
    <motion.rect
      x={DOCKER.x - 9}
      y={y}
      width={18}
      height={40}
      rx={4}
      fill={colors.white}
      stroke={colors.accent}
      strokeWidth={2.5}
      initial={instant ? false : { opacity: 0, scaleY: 0.4 }}
      animate={{ opacity: 1, scaleY: 1 }}
      style={{ transformOrigin: `${DOCKER.x}px ${y + 20}px` }}
      transition={{ duration: 0.4, delay: instant ? 0 : delay, ease: easing.soft }}
    />
  )
}

function Hop({
  d,
  label,
  labelX,
  labelY,
  delay,
  instant,
}: {
  d: string
  label: string
  labelX: number
  labelY: number
  delay: number
  instant: boolean
}) {
  return (
    <>
      <motion.path
        d={d}
        fill="none"
        stroke={colors.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        markerEnd="url(#bod-arrow)"
        initial={instant ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: instant ? 0 : delay, ease: easing.soft }}
      />
      <motion.text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fontSize={12.5}
        fontWeight={800}
        fontFamily="ui-monospace, monospace"
        fill={colors.accentDark}
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: instant ? 0 : delay + 0.3 }}
      >
        {label}
      </motion.text>
    </>
  )
}

export function BrowserOutsideDocker({ className = '' }: { className?: string }) {
  const instant = useInstant()

  return (
    <div className={className}>
      <svg
        viewBox="0 0 630 292"
        className="w-full"
        role="img"
        aria-label="The browser sits outside Docker and reaches both containers through published ports"
      >
        <defs>
          <marker id="bod-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.accent} />
          </marker>
        </defs>

        {/* The machine. Everything on this figure is on one laptop, which is why
            the Docker box is INSIDE it rather than beside it. */}
        <motion.g
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: easing.soft }}
        >
          <rect
            x={OUTER.x}
            y={OUTER.y}
            width={OUTER.w}
            height={OUTER.h}
            rx={16}
            fill={colors.surface}
            stroke={colors.line}
            strokeWidth={2}
          />
          <text x={OUTER.x + 18} y={OUTER.y + 26} fontSize={13} fontWeight={800} fill={colors.muted}>
            YOUR MACHINE
          </text>
        </motion.g>

        {/* The Docker boundary. The single most important line on the slide. */}
        <motion.g
          initial={instant ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: `${DOCKER.x + DOCKER.w / 2}px ${DOCKER.y + DOCKER.h / 2}px` }}
          transition={{ duration: 0.5, delay: instant ? 0 : 0.16, ease: easing.soft }}
        >
          <rect
            x={DOCKER.x}
            y={DOCKER.y}
            width={DOCKER.w}
            height={DOCKER.h}
            rx={14}
            fill={colors.white}
            stroke={colors.brand}
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
          <text x={DOCKER.x + 16} y={DOCKER.y + 26} fontSize={13} fontWeight={800} fill={colors.brand}>
            INSIDE DOCKER
          </text>
        </motion.g>

        {/* The browser, outside that boundary. */}
        <motion.g
          initial={instant ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: instant ? 0 : 0.26, ease: easing.soft }}
        >
          <rect
            x={BROWSER.x}
            y={BROWSER.y}
            width={BROWSER.w}
            height={BROWSER.h}
            rx={12}
            fill={colors.white}
            stroke={colors.ink}
            strokeWidth={2.5}
          />
          <rect x={BROWSER.x} y={BROWSER.y} width={BROWSER.w} height={22} rx={12} fill={colors.ink} />
          <rect x={BROWSER.x} y={BROWSER.y + 14} width={BROWSER.w} height={8} fill={colors.ink} />
          <circle cx={BROWSER.x + 16} cy={BROWSER.y + 11} r={3.4} fill={colors.white} opacity={0.55} />
          <circle cx={BROWSER.x + 28} cy={BROWSER.y + 11} r={3.4} fill={colors.white} opacity={0.55} />
          <text x={BROWSER.x + BROWSER.w / 2} y={BROWSER.y + 52} textAnchor="middle" fontSize={16} fontWeight={800} fill={colors.ink}>
            Your browser
          </text>
          <text x={BROWSER.x + BROWSER.w / 2} y={BROWSER.y + 74} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={colors.danger}>
            NOT inside Docker
          </text>
        </motion.g>

        <PortDoor y={104} delay={0.4} instant={instant} />
        <PortDoor y={188} delay={0.46} instant={instant} />

        <Hop
          d={`M ${BROWSER.x + BROWSER.w} 124 H ${DOCKER.x - 12}`}
          label="localhost:3000"
          labelX={300}
          labelY={112}
          delay={0.54}
          instant={instant}
        />
        <Hop
          d={`M ${BROWSER.x + BROWSER.w / 2} ${BROWSER.y + BROWSER.h} V 208 H ${DOCKER.x - 12}`}
          label="localhost:8000"
          labelX={300}
          labelY={230}
          delay={0.78}
          instant={instant}
        />

        <Container y={92} name="frontend" port="3000" logo="/assets/tech/react.png" delay={0.6} instant={instant} />
        <Container y={176} name="backend" port="8000" logo="/assets/tech/django.png" delay={0.68} instant={instant} />

        {/* Short connectors from each door to its container, so the journey does
            not appear to stop at the boundary. */}
        <motion.g
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: instant ? 0 : 0.86 }}
        >
          <line x1={DOCKER.x + 9} y1={124} x2={412} y2={124} stroke={colors.teal} strokeWidth={2} strokeLinecap="round" />
          <line x1={DOCKER.x + 9} y1={208} x2={412} y2={208} stroke={colors.teal} strokeWidth={2} strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  )
}
