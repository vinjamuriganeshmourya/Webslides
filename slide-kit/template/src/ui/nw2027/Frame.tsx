import type { CSSProperties, ReactNode } from 'react'
import {
  NW_SLIDE_HEIGHT,
  NW_SLIDE_WIDTH,
  NW_STAGE_SCALE,
  nwColors,
  nwGradients,
  nwLayout,
  nwShadow,
  nwType,
} from '@/design/nw2027'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '@/design/tokens'

/**
 * The two backdrop families in the V2 Figma deck:
 *  - `light` — near-white lavender field with soft blue flares and faint arcs.
 *              Used by every content slide.
 *  - `hero`  — full-bleed blue mesh gradient. Used by Welcome / Topic Title /
 *              section breakers / closing slides.
 */
export type NwVariant = 'light' | 'hero'

/**
 * The frame every 2027-theme slide sits in.
 *
 * Slides are authored at the Figma-native 1920×1080 and scaled down into the
 * engine's 1280×720 stage here, so layout code can use Figma's px values
 * verbatim. See `NW_STAGE_SCALE`.
 */
export function Slide2027({
  variant = 'light',
  children,
  progress,
  footerMark = true,
  className = '',
  style,
}: {
  variant?: NwVariant
  children: ReactNode
  /** Segmented bottom progress bar: `{ total, current }` (1-based). */
  progress?: { total: number; current: number }
  footerMark?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <section
      className="absolute inset-0 overflow-hidden"
      style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, background: nwColors.white }}
    >
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          width: NW_SLIDE_WIDTH,
          height: NW_SLIDE_HEIGHT,
          transform: `scale(${NW_STAGE_SCALE})`,
          transformOrigin: 'top left',
          background: variant === 'hero' ? nwGradients.heroField : nwGradients.lightField,
          ...style,
        }}
      >
        <Arcs variant={variant} />
        {children}
        {footerMark && <FooterMark onDark={variant === 'hero'} />}
        {progress && <ProgressBar {...progress} />}
      </div>
    </section>
  )
}

/**
 * The faint sweeping arcs that run across every V2 slide. Large-radius circles
 * cropped by the frame, so only a shallow curve is visible.
 */
function Arcs({ variant }: { variant: NwVariant }) {
  // Kept deliberately faint — in the Figma these read as a texture, not as
  // linework, and must never compete with slide content.
  const stroke = variant === 'hero' ? 'rgba(255,255,255,0.10)' : 'rgba(45,99,251,0.09)'
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={NW_SLIDE_WIDTH}
      height={NW_SLIDE_HEIGHT}
      viewBox={`0 0 ${NW_SLIDE_WIDTH} ${NW_SLIDE_HEIGHT}`}
      fill="none"
      aria-hidden
    >
      <circle cx={1560} cy={-260} r={880} stroke={stroke} strokeWidth={2} />
      <circle cx={1980} cy={520} r={1120} stroke={stroke} strokeWidth={2} />
      <circle cx={240} cy={1320} r={720} stroke={stroke} strokeWidth={2} />
    </svg>
  )
}

/** The segmented progress bar pinned to the bottom edge of content slides. */
export function ProgressBar({ total, current }: { total: number; current: number }) {
  const segments = Math.max(1, total)
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex"
      style={{ height: nwLayout.progressHeight, gap: 4 }}
      aria-hidden
    >
      {Array.from({ length: segments }, (_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            background:
              i === current - 1
                ? nwGradients.brand
                : i < current - 1
                  ? 'rgba(45,99,251,0.55)'
                  : 'rgba(45,99,251,0.20)',
          }}
        />
      ))}
    </div>
  )
}

/** The small NxtWave mark in the bottom-right corner of every slide. */
export function FooterMark({ onDark = false }: { onDark?: boolean }) {
  return (
    <img
      src="/assets/logo-nxtwave.png"
      alt="NxtWave"
      draggable={false}
      className="pointer-events-none absolute select-none"
      style={{
        right: nwLayout.marginX,
        bottom: nwLayout.marginBottom - 24,
        height: 56,
        width: 'auto',
        ...(onDark ? { filter: 'brightness(0) invert(1)' } : null),
      }}
    />
  )
}

/**
 * The instructor video still, top-right on content slides — a rounded tile
 * with a hairline border.
 */
export function InstructorTile({
  src,
  alt = '',
  tall = false,
}: {
  src?: string
  alt?: string
  /**
   * The full-height treatment used on diagram-heavy light slides
   * (Figma "Slide 16:9 - 67"), rather than the compact top-right tile.
   */
  tall?: boolean
}) {
  const { width, height, radius, top, right } = tall
    ? { width: 460, height: 762, radius: 44, top: 158, right: nwLayout.marginX }
    : nwLayout.instructor
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top,
        right,
        width,
        height,
        borderRadius: radius,
        boxShadow: nwShadow.card,
        // Neutral placeholder until a still is supplied — a saturated fill
        // would read as a design element rather than a missing asset.
        background: src ? nwColors.primaryDarkBlue : '#DCE5F7',
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}

/**
 * Slide header: session kicker, a gradient hairline rule, and the numbered
 * title — the chrome shared by every content slide in the V2 deck.
 */
export function SlideHeading({
  kicker,
  index,
  title,
  ruleWidth = 460,
}: {
  kicker?: ReactNode
  /** Section number rendered before the title, as in "2. Challenges". */
  index?: number | string
  title: ReactNode
  ruleWidth?: number
}) {
  return (
    <header style={{ position: 'absolute', left: nwLayout.marginX, top: nwLayout.marginTop, right: 420 }}>
      {kicker && (
        <div style={{ ...nwType('subHeadM'), color: nwColors.primaryDarkBlue }}>{kicker}</div>
      )}
      <div
        style={{
          width: ruleWidth,
          height: 3,
          marginTop: 14,
          marginBottom: 26,
          background: nwGradients.kickerRule,
        }}
      />
      <h2 style={{ ...nwType('headingS'), color: nwColors.primaryDarkBlue, margin: 0 }}>
        {index != null && <span style={{ marginRight: 22 }}>{index}.</span>}
        {title}
      </h2>
    </header>
  )
}

/**
 * The frosted "Glass Container" component from the Figma library — the pill
 * behind hero wordmarks on gradient backdrops.
 */
export function GlassPanel({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        borderRadius: nwLayout.radius.glass,
        background: 'rgba(255,255,255,0.14)',
        border: '2px solid rgba(255,255,255,0.28)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        boxShadow: nwShadow.glass,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** The rounded brand pill used as an eyebrow tag ("Session on"). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        ...nwType('subHeadL'),
        display: 'inline-block',
        color: nwColors.white,
        background: nwGradients.brand,
        borderRadius: nwLayout.radius.tag,
        padding: '14px 44px',
      }}
    >
      {children}
    </span>
  )
}

/** A white content card — the base surface for table rows, notes and panels. */
export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        background: nwColors.white,
        borderRadius: nwLayout.radius.card,
        boxShadow: nwShadow.cardSoft,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
