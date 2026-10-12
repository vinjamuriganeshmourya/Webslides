import { useId, type CSSProperties, type ReactNode } from 'react'
import { ARC_RADIUS, ARC_STROKE, CORNER_LOGO, SLIDE_HEIGHT, SLIDE_WIDTH, colors, fonts } from '@/design/tokens'
import { GRADIENT_GROUND, MESH_GROUND } from '@/design/grounds'

/**
 * The pieces every slide is built from: the stage with its ground and grain,
 * the rings, the glass pill and the brand mark. Static only.
 */

/* ------------------------------------------------------------------ */
/* Grounds                                                             */
/* ------------------------------------------------------------------ */

/**
 * THE THREE GROUNDS, ALL LIVE CSS.
 *
 * The welcome / next-session mesh and the closing gradient are Figma mesh
 * gradients. They are reproduced as stacks of radial-gradients FITTED to the
 * reference background layers by least squares (`src/design/grounds.ts` has
 * the stacks and the method); the grain is synthesised on top. `paper` is the
 * agenda's flat light ground with its corner wash.
 */
export type Ground = 'mesh' | 'gradient' | 'paper'

/**
 * The agenda wash: an ellipse 980px along the top edge and 900px down the
 * right edge, with the reference's measured falloff, in the reference's own
 * azure over the reference's own off-white.
 */
const WASH_CURVE: Array<[stop: number, alpha: number]> = [
  [0, 1], [7, 0.98], [18, 0.87], [28, 0.73], [38, 0.56], [48, 0.36],
  [58, 0.21], [69, 0.11], [85, 0.02], [100, 0],
]
const PAPER_BACKGROUND = [
  `radial-gradient(980px 900px at 100% 0%, ${WASH_CURVE.map(
    ([stop, a]) => `rgba(41,137,253,${a}) ${stop}%`,
  ).join(', ')})`,
  colors.paper,
].join(', ')

const GROUND_STYLE: Record<Ground, CSSProperties> = {
  mesh: { background: MESH_GROUND },
  gradient: { background: GRADIENT_GROUND },
  paper: { background: PAPER_BACKGROUND },
}

/**
 * GRAIN, measured: the dark references carry monochrome, pixel-scale noise
 * (lag-1 autocorrelation ≈ 0.5), additive and clipped, with a standard
 * deviation of about 1.7/255 on the closing gradient and 2.3/255 on the
 * mesh. The agenda has none (0.5/255, which is dithering).
 *
 * Reproduced as an SVG filter on the ground layer: fractal noise, collapsed
 * to one channel so it is monochrome, then ADDED to the ground with a
 * zero-mean arithmetic composite (`k3·noise − k3/2`). `amount` is the
 * stroke of that addition; the values below were tuned against the
 * measurement in a headless render.
 */
const GRAIN: Record<Ground, { amount: number; frequency: number }> = {
  /* reference (σ=2 high-pass, G channel): std 2.5–2.9, lag-1 0.51–0.56, lag-2 ≈ 0.06 */
  mesh: { amount: 0.115, frequency: 0.35 },
  /* reference: std 1.4–1.6, lag-1 0.28–0.34, lag-2 ≈ −0.17 */
  gradient: { amount: 0.057, frequency: 0.5 },
  paper: { amount: 0, frequency: 0 },
}

/* ------------------------------------------------------------------ */
/* Stage                                                               */
/* ------------------------------------------------------------------ */

export function Stage({
  ground,
  children,
  style,
}: {
  ground: Ground
  children: ReactNode
  style?: CSSProperties
}) {
  const filterId = `grain-${useId().replace(/:/g, '')}`
  const grain = GRAIN[ground]
  return (
    <section
      style={{
        position: 'absolute',
        inset: 0,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        overflow: 'hidden',
        background: ground === 'paper' ? colors.paper : colors.deep,
        fontFamily: fonts.body,
        color: colors.white,
        ...style,
      }}
    >
      {grain.amount > 0 && (
        <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
          <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={grain.frequency}
              numOctaves={1}
              seed={7}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"
              result="mono"
            />
            <feComposite
              in="SourceGraphic"
              in2="mono"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={grain.amount}
              k4={-grain.amount / 2}
            />
          </filter>
        </svg>
      )}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          ...GROUND_STYLE[ground],
          filter: grain.amount > 0 ? `url(#${filterId})` : undefined,
        }}
      />
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Rings                                                               */
/* ------------------------------------------------------------------ */

/**
 * One background ring: radius 790, 3px stroke, centred on (cx, cy). `mask`
 * is a CSS gradient in the ring's own box; a `conic-gradient(from 0deg …)`
 * starts at 12 o'clock and runs clockwise, which is how the stroke profiles
 * below were measured (alpha against angle, every 10°, by differencing the
 * reference's ring layer against its ground layer).
 */
export function Arc({
  cx,
  cy,
  color,
  opacity = 1,
  mask,
}: {
  cx: number
  cy: number
  color: string
  opacity?: number
  mask?: string
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: cx - ARC_RADIUS,
        top: cy - ARC_RADIUS,
        width: ARC_RADIUS * 2,
        height: ARC_RADIUS * 2,
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: `${ARC_STROKE}px solid ${color}`,
        opacity,
        pointerEvents: 'none',
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  )
}

/**
 * The closing frames' rings (thank you, all the best, and — by decision —
 * the section breaker). Measured:
 *   - big ring, centre (850, 1015): WHITE, strongest at its crown (alpha
 *     0.16 from 330° through 0° to 20°) and gone by 60° and 270°;
 *   - right ring, centre (2122, 214): the background blue at full strength,
 *     fading in over its last 30° before it leaves at the right edge.
 */
export function ClosingRings() {
  return (
    <>
      <Arc
        cx={850}
        cy={1014}
        color={colors.white}
        opacity={0.16}
        mask={
          'conic-gradient(from 0deg, rgba(0,0,0,.94) 0deg, rgba(0,0,0,.88) 10deg, rgba(0,0,0,.75) 20deg, ' +
          'rgba(0,0,0,.56) 30deg, rgba(0,0,0,.31) 40deg, rgba(0,0,0,.12) 50deg, transparent 60deg, ' +
          'transparent 270deg, rgba(0,0,0,.12) 280deg, rgba(0,0,0,.19) 290deg, rgba(0,0,0,.75) 300deg, ' +
          'rgba(0,0,0,.88) 310deg, rgba(0,0,0,.94) 320deg, #000 330deg, #000 350deg, rgba(0,0,0,.94) 360deg)'
        }
      />
      <Arc
        cx={2122}
        cy={214}
        color={colors.deep}
        mask={
          'conic-gradient(from 0deg, transparent 190deg, rgba(0,0,0,.57) 200deg, rgba(0,0,0,.9) 210deg, ' +
          '#000 220deg, #000 360deg)'
        }
      />
    </>
  )
}

/**
 * The welcome / next-session rings. Measured:
 *   - big ring, centre (850, 932): the background blue, invisible on its left
 *     flank and strengthening clockwise from the crown (0.07 at 310°) to the
 *     right side (0.54 at 70°), where it leaves at the bottom edge;
 *   - right ring, centre (2220, 196): the background blue at full strength,
 *     fading in over its last 20° before the right edge.
 */
export function MeshRings() {
  return (
    <>
      <Arc
        cx={850}
        cy={931}
        color={colors.deep}
        mask={
          'conic-gradient(from 0deg, rgba(0,0,0,.30) 0deg, rgba(0,0,0,.35) 10deg, rgba(0,0,0,.39) 20deg, ' +
          'rgba(0,0,0,.42) 30deg, rgba(0,0,0,.46) 40deg, rgba(0,0,0,.51) 50deg, rgba(0,0,0,.53) 60deg, ' +
          'rgba(0,0,0,.54) 70deg, rgba(0,0,0,.53) 80deg, rgba(0,0,0,.52) 90deg, rgba(0,0,0,.48) 100deg, ' +
          'rgba(0,0,0,.40) 110deg, transparent 120deg, transparent 300deg, rgba(0,0,0,.07) 310deg, ' +
          'rgba(0,0,0,.10) 320deg, rgba(0,0,0,.14) 330deg, rgba(0,0,0,.21) 340deg, rgba(0,0,0,.25) 350deg, ' +
          'rgba(0,0,0,.30) 360deg)'
        }
      />
      <Arc
        cx={2220}
        cy={196}
        color={colors.deep}
        mask={
          'conic-gradient(from 0deg, transparent 195deg, rgba(0,0,0,.6) 202deg, rgba(0,0,0,.9) 210deg, ' +
          '#000 220deg, #000 360deg)'
        }
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Glass                                                               */
/* ------------------------------------------------------------------ */

/**
 * The glass pill, measured: white at 10% over the ground blurred with
 * σ≈24px (the σ that best predicts the pill's interior from the ground
 * layer), a 1px rim at ~33% white, and a short dark shadow under the bottom
 * edge that is gone within ~9px.
 */
export function GlassPill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        /* a full pill: the radius is half the height, whatever the height */
        borderRadius: 999,
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.33), 0 3px 9px rgba(0,8,50,0.35)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * THE SLAB BEHIND A HERO WORD, sized off its font.
 *
 * In the references the slab is 1.6x the ink height tall and runs 0.83x the
 * ink height past the ink on each side (welcome: 252 tall, 127 either side
 * of a 157px word; closing: 206 and 111 around 127px). Sora's ink is ~0.75
 * of its font size, so: height 1.2·fs, side padding 0.62·fs, radius half the
 * height. Change the font size and the slab follows.
 */
export function heroSlab(fontSize: number): CSSProperties {
  return { height: Math.round(fontSize * 1.2), padding: `0 ${Math.round(fontSize * 0.62)}px` }
}

/* ------------------------------------------------------------------ */
/* Brand mark                                                          */
/* ------------------------------------------------------------------ */

/**
 * The NxtWave lockup. On a blue ground it is reversed to white with a filter
 * (`brightness(0) invert(1)` crushes the artwork to black, then flips it):
 * a flat reverse of the supplied PNG, not a recolour.
 */
export function Logo({
  width,
  onDark = false,
  style,
}: {
  width: number
  onDark?: boolean
  style?: CSSProperties
}) {
  return (
    <img
      src="/assets/logo-nxtwave.png"
      alt="NxtWave"
      width={width}
      draggable={false}
      style={{
        display: 'block',
        width,
        height: 'auto',
        userSelect: 'none',
        filter: onDark ? 'brightness(0) invert(1)' : undefined,
        ...style,
      }}
    />
  )
}

/** The mark in the bottom-right corner, where the references put it. */
export function CornerLogo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Logo
      width={CORNER_LOGO.width}
      onDark={onDark}
      style={{ position: 'absolute', left: CORNER_LOGO.left, top: CORNER_LOGO.top }}
    />
  )
}

/** The mark centred at the top of the welcome / closing frames. */
export function HeroLogo({ top, width }: { top: number; width: number }) {
  return (
    <Logo
      width={width}
      onDark
      style={{ position: 'absolute', left: (SLIDE_WIDTH - width) / 2, top }}
    />
  )
}
