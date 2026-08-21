/**
 * The recurring nouns of the deployment module's motion graphics.
 *
 * From the appendix: "These are the recurring nouns. Draw them identically
 * every time." Every object the spec's Shape-and-Object-Language table names
 * lives here and nowhere else. An asset that draws its own image slab is a bug,
 * even if it looks right — the whole module has to agree pixel for pixel so
 * that later sessions can reuse these directly.
 *
 * Coordinates are absolute px on the 1920×1080 motion canvas (`MG_WIDTH` /
 * `MG_HEIGHT`), so asset code can be written straight off the beat sheet.
 */

import type { CSSProperties, ReactNode } from 'react'
import {
  MG_HEIGHT,
  MG_TERMINAL_BG,
  MG_WIDTH,
  mgCaption,
  mgColors,
  mgFonts,
  mgObject,
  mgType,
  type MgColorToken,
} from '@/design/mg'
import { heartbeat } from './clock'

/** Absolute placement on the motion canvas. */
export function box(x: number, y: number, w?: number, h?: number): CSSProperties {
  return { position: 'absolute', left: x, top: y, ...(w != null ? { width: w } : null), ...(h != null ? { height: h } : null) }
}

/* ------------------------------------------------------------------ */
/* Text                                                                 */
/* ------------------------------------------------------------------ */

/** Asset title — top-left, inside the safe margin. */
export function MgTitle({ children, x = 80, y = 72 }: { children: ReactNode; x?: number; y?: number }) {
  return (
    <div style={{ ...box(x, y), ...mgType('title') }}>{children}</div>
  )
}

/**
 * The lower-third caption.
 *
 * The appendix is strict here, and the strictness is the point: one caption on
 * screen at a time, always the same y, stating the *conclusion* rather than the
 * mechanics. Rendering exactly one `<Caption>` per asset at a fixed y is how
 * that rule is enforced rather than merely documented — pass the currently
 * active text and nothing else.
 */
export function Caption({
  text,
  opacity = 1,
  tone = 'ink',
}: {
  text: ReactNode
  opacity?: number
  tone?: MgColorToken
}) {
  if (!text) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: mgCaption.y,
        textAlign: 'center',
        opacity,
        ...mgType('caption', tone),
      }}
    >
      {text}
    </div>
  )
}

/** A small annotation label pinned anywhere on the canvas. */
export function Annotation({
  x,
  y,
  children,
  width,
  align = 'left',
  tone = 'inkMuted',
}: {
  x: number
  y: number
  children: ReactNode
  width?: number
  align?: CSSProperties['textAlign']
  tone?: MgColorToken
}) {
  return <div style={{ ...box(x, y, width), ...mgType('annotation', tone), textAlign: align }}>{children}</div>
}

/** An object label — uppercase for IMAGE / CONTAINER, per the appendix. */
export function ObjectLabel({
  x,
  y,
  children,
  width,
  tone = 'ink',
}: {
  x: number
  y: number
  children: ReactNode
  width?: number
  tone?: MgColorToken
}) {
  return (
    <div style={{ ...box(x, y, width), ...mgType('label', tone), textAlign: 'center', letterSpacing: '0.04em' }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Status markers — never colour alone                                  */
/* ------------------------------------------------------------------ */

/**
 * ✓ / ✕ / ! markers.
 *
 * "Never encode meaning in colour alone — pair every colour state with an icon
 * or label (red + ✕, green + ✓)." So `success`/`error`/`attention` fills in
 * this module should always arrive with one of these attached.
 */
export function Marker({
  x,
  y,
  kind,
  size = 44,
  opacity = 1,
}: {
  x: number
  y: number
  kind: 'ok' | 'fail' | 'attention'
  size?: number
  opacity?: number
}) {
  const tone = kind === 'ok' ? mgColors.success : kind === 'fail' ? mgColors.error : mgColors.attention
  const glyph = kind === 'ok' ? 'M5 12.5l4.5 4.5L19 7.5' : kind === 'fail' ? 'M6 6l12 12M18 6L6 18' : 'M12 5v9m0 4.5v.5'
  return (
    <div
      style={{
        ...box(x, y, size, size),
        borderRadius: '50%',
        background: tone,
        display: 'grid',
        placeItems: 'center',
        opacity,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={glyph} stroke="#0F172A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** A size / time / version badge, e.g. "~2 GB" or "1:47". */
export function Badge({
  x,
  y,
  children,
  tone = 'inkMuted',
  scale = 1,
  opacity = 1,
}: {
  x: number
  y: number
  children: ReactNode
  tone?: MgColorToken
  scale?: number
  opacity?: number
}) {
  return (
    <div
      style={{
        ...box(x, y),
        ...mgType('annotation', tone),
        border: `2px solid ${mgColors[tone]}`,
        borderRadius: 999,
        padding: '6px 20px',
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        opacity,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The image / container pair — the module's two most important objects */
/* ------------------------------------------------------------------ */

/**
 * An IMAGE.
 *
 * Flat `image-grey`, 2px dashed, 4px radius, **no** shadow and **no** animation
 * on itself. The appendix repeats "an image must never glow" twice, because the
 * entire image-vs-container lesson rests on the visual contrast: this object is
 * inert, and the container next to it is alive. Do not add a transition here.
 */
export function ImageSlab({
  x,
  y,
  w = 300,
  h = 120,
  label = 'IMAGE',
  sub,
  opacity = 1,
  blueprint = true,
}: {
  x: number
  y: number
  w?: number
  h?: number
  label?: ReactNode
  sub?: ReactNode
  opacity?: number
  blueprint?: boolean
}) {
  return (
    <div
      style={{
        ...box(x, y, w, h),
        borderRadius: mgObject.image.radius,
        border: mgObject.image.border,
        background: blueprint
          ? `${mgObject.image.fill} repeating-linear-gradient(90deg, rgba(148,163,184,0.14) 0 1px, transparent 1px 26px), repeating-linear-gradient(0deg, rgba(148,163,184,0.14) 0 1px, transparent 1px 26px)`
          : mgObject.image.fill,
        boxShadow: mgObject.image.shadow,
        display: 'grid',
        placeContent: 'center',
        gap: 6,
        textAlign: 'center',
        opacity,
      }}
    >
      <span style={{ ...mgType('label'), letterSpacing: '0.08em' }}>{label}</span>
      {sub && <span style={mgType('annotation')}>{sub}</span>}
    </div>
  )
}

/**
 * A CONTAINER.
 *
 * Running: docker-blue border, 10% fill, soft outer glow, and a pulsing
 * activity ring. Stopped: grey, ring off, 60% opacity. `t` drives the ring, so
 * pass the clock's `t` for anything that is meant to read as alive.
 */
export function ContainerBox({
  x,
  y,
  w = 240,
  h = 120,
  label = 'CONTAINER',
  sub,
  state = 'running',
  t = 0,
  opacity = 1,
  scale = 1,
}: {
  x: number
  y: number
  w?: number
  h?: number
  label?: ReactNode
  sub?: ReactNode
  state?: 'running' | 'stopped'
  t?: number
  opacity?: number
  scale?: number
}) {
  const running = state === 'running'
  const beat = running ? heartbeat(t) : 0
  const tone = running ? mgColors.dockerBlue : mgColors.inkMuted

  return (
    <div
      style={{
        ...box(x, y, w, h),
        borderRadius: mgObject.container.radius,
        border: `2px solid ${tone}`,
        background: running ? mgObject.container.fill : 'rgba(148,163,184,0.08)',
        boxShadow: running ? mgObject.container.glow : 'none',
        display: 'grid',
        placeContent: 'center',
        gap: 6,
        textAlign: 'center',
        opacity: opacity * (running ? 1 : mgObject.container.stoppedOpacity),
        transform: `scale(${scale})`,
      }}
    >
      {running && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: 16,
            top: 16,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: mgColors.dockerBlue,
            boxShadow: `0 0 0 ${4 + beat * 8}px rgba(36,150,237,${0.28 - beat * 0.2})`,
          }}
        />
      )}
      <span style={{ ...mgType('label', running ? 'ink' : 'inkMuted'), letterSpacing: '0.08em' }}>{label}</span>
      {sub && <span style={mgType('annotation')}>{sub}</span>}
    </div>
  )
}

/**
 * The stopped-container tray.
 *
 * Appendix: "Stopped containers move here — they never fade out unless
 * `docker rm` is shown." Keeping the shelf on screen is what stops students
 * believing that stopping a container destroys it.
 */
export function StoppedTray({
  x,
  y,
  w = 620,
  h = 180,
  children,
  opacity = 1,
}: {
  x: number
  y: number
  w?: number
  h?: number
  children?: ReactNode
  opacity?: number
}) {
  return (
    <div style={{ ...box(x, y, w, h), opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          background: mgColors.surface,
          border: `2px solid rgba(148,163,184,0.25)`,
        }}
      />
      <div style={{ ...box(20, 12), ...mgType('annotation') }}>Stopped</div>
      {children}
    </div>
  )
}

/** Docker Hub — a cloud outline, always at the top of the frame. */
export function DockerHubCloud({ x, y, w = 340, opacity = 1 }: { x: number; y: number; w?: number; opacity?: number }) {
  const h = w * 0.46
  return (
    <div style={{ ...box(x, y, w, h), opacity }}>
      <svg width={w} height={h} viewBox="0 0 340 156" fill="none" aria-hidden>
        <path
          d="M84 132c-26 0-46-20-46-45 0-23 17-42 39-45 7-24 29-42 56-42 30 0 55 22 58 51 24 2 43 22 43 46 0 20-13 35-32 35H84z"
          stroke={mgColors.dockerBlue}
          strokeWidth={2.5}
          fill="rgba(36,150,237,0.06)"
        />
      </svg>
      <div style={{ ...box(0, h * 0.42, w), ...mgType('label', 'dockerBlue'), textAlign: 'center' }}>Docker Hub</div>
    </div>
  )
}

/** The local disk / shelf line that images sit on. */
export function Shelf({ x, y, w, label }: { x: number; y: number; w: number; label?: ReactNode }) {
  return (
    <div style={box(x, y, w)}>
      <div style={{ height: 2, background: 'rgba(148,163,184,0.45)' }} />
      {label && <div style={{ ...mgType('annotation'), marginTop: 10 }}>{label}</div>}
    </div>
  )
}

/**
 * A machine / laptop — thin 2px `ink-muted` outline illustration.
 * `children` render inside the screen area, which is how every asset puts a
 * layer stack or two app boxes "inside" a machine.
 */
export function MachineOutline({
  x,
  y,
  w = 520,
  h = 360,
  label,
  children,
  tone = mgObject.machine.stroke,
  opacity = 1,
  youAreHere = false,
}: {
  x: number
  y: number
  w?: number
  h?: number
  label?: ReactNode
  children?: ReactNode
  tone?: string
  opacity?: number
  /** The subtle marker that lets a student track their own machine. */
  youAreHere?: boolean
}) {
  return (
    <div style={{ ...box(x, y, w, h + 74), opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: `0 0 ${74}px 0`,
          border: `${mgObject.machine.strokeWidth}px solid ${tone}`,
          borderRadius: 14,
          background: 'rgba(30,41,59,0.35)',
        }}
      />
      {/* The laptop base */}
      <div
        style={{
          position: 'absolute',
          left: -28,
          right: -28,
          top: h + 8,
          height: 10,
          borderRadius: 6,
          background: tone,
          opacity: 0.7,
        }}
      />
      {youAreHere && (
        <div
          style={{
            ...box(w - 150, -18),
            ...mgType('annotation', 'attention'),
            border: `2px solid ${mgColors.attention}`,
            borderRadius: 999,
            padding: '2px 14px',
            background: mgColors.bg,
          }}
        >
          you are here
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      {label && (
        <div style={{ ...box(0, h + 30, w), ...mgType('annotation'), textAlign: 'center' }}>{label}</div>
      )}
    </div>
  )
}

export interface MgLayer {
  label: ReactNode
  /** Layer fill tone. Defaults to `surface`. */
  tone?: MgColorToken
  /** Taller than the default 64px — used for a guest OS slab. */
  height?: number
  /** Dim to inkMuted text, for layers that are present but not the point. */
  dim?: boolean
}

/**
 * A layer stack.
 *
 * Appendix: "Always build bottom-up: Hardware → Host OS → (Hypervisor |
 * Docker Engine) → app layers. Never reorder." `layers[0]` is therefore the
 * BOTTOM layer, and this component renders it at the bottom — pass them in
 * physical order and the rule enforces itself.
 *
 * `built` is how many layers have appeared so far, so a stack can assemble
 * across the timeline without the caller doing any layout maths.
 */
export function LayerStack({
  x,
  bottom,
  w = 360,
  layers,
  built = layers.length,
  gap = 6,
  opacity = 1,
}: {
  x: number
  /** y of the stack's bottom edge — stacks grow upward from here. */
  bottom: number
  w?: number
  layers: MgLayer[]
  built?: number
  gap?: number
  opacity?: number
}) {
  let y = bottom
  const rendered: ReactNode[] = []

  layers.forEach((layer, i) => {
    const h = layer.height ?? 64
    y -= h
    if (i < built) {
      rendered.push(
        <div
          key={i}
          style={{
            ...box(x, y, w, h),
            borderRadius: 8,
            background: layer.tone ? `${mgColors[layer.tone]}22` : 'rgba(30,41,59,0.9)',
            border: `2px solid ${layer.tone ? mgColors[layer.tone] : 'rgba(148,163,184,0.35)'}`,
            display: 'grid',
            placeItems: 'center',
            ...mgType('label', layer.dim ? 'inkMuted' : 'ink'),
          }}
        >
          {layer.label}
        </div>,
      )
    }
    y -= gap
  })

  return <div style={{ position: 'absolute', inset: 0, opacity }}>{rendered}</div>
}

/**
 * The terminal panel — left third of frame, `#0B1120`, macOS-style dot header.
 * Commands are typed at 25 chars/sec; use `typed()` from ./clock to drive the
 * text rather than re-implementing the rate.
 */
export function TerminalPanel({
  x,
  y,
  w = 560,
  h = 420,
  lines,
  opacity = 1,
}: {
  x: number
  y: number
  w?: number
  h?: number
  /** Rendered in order. `prompt: true` prefixes a `$`. */
  lines: { text: string; prompt?: boolean; tone?: MgColorToken }[]
  opacity?: number
}) {
  return (
    <div
      style={{
        ...box(x, y, w, h),
        background: MG_TERMINAL_BG,
        borderRadius: 12,
        border: '1px solid rgba(148,163,184,0.22)',
        overflow: 'hidden',
        opacity,
      }}
    >
      <div style={{ display: 'flex', gap: 8, padding: '14px 18px', borderBottom: '1px solid rgba(148,163,184,0.16)' }}>
        {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
      </div>
      <pre
        style={{
          margin: 0,
          padding: '18px 22px',
          fontFamily: mgFonts.mono,
          fontSize: 26,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ color: mgColors[l.tone ?? 'ink'] }}>
            {l.prompt && <span style={{ color: mgColors.dockerBlue, marginRight: 10 }}>$</span>}
            {l.text}
          </div>
        ))}
      </pre>
    </div>
  )
}

/**
 * A request / data dot travelling a straight path.
 * 8px glowing dot on a 2px path; `success` when it completes, `error` when it
 * dies. `p` is 0→1 along the path.
 */
export function RequestDot({
  from,
  to,
  p,
  tone = 'dockerBlue',
  visible = true,
}: {
  from: [number, number]
  to: [number, number]
  p: number
  tone?: MgColorToken
  visible?: boolean
}) {
  if (!visible) return null
  const x = from[0] + (to[0] - from[0]) * p
  const y = from[1] + (to[1] - from[1]) * p
  const c = mgColors[tone]
  return (
    <div
      style={{
        ...box(x - mgObject.path.dot / 2, y - mgObject.path.dot / 2, mgObject.path.dot, mgObject.path.dot),
        borderRadius: '50%',
        background: c,
        boxShadow: `0 0 16px 4px ${c}66`,
      }}
    />
  )
}

/** A 2px connector path between two points. Dashed reads as "not built yet". */
export function PathLine({
  from,
  to,
  tone = 'inkMuted',
  dashed = false,
  progress = 1,
  width = mgObject.path.strokeWidth,
}: {
  from: [number, number]
  to: [number, number]
  tone?: MgColorToken
  dashed?: boolean
  /** 0→1 draw-on. */
  progress?: number
  width?: number
}) {
  const x2 = from[0] + (to[0] - from[0]) * progress
  const y2 = from[1] + (to[1] - from[1]) * progress
  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={MG_WIDTH} height={MG_HEIGHT} aria-hidden>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={x2}
        y2={y2}
        stroke={mgColors[tone]}
        strokeWidth={width}
        strokeDasharray={dashed ? '10 12' : undefined}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A progress bar used for builds, boots and pulls. */
export function ProgressTrack({
  x,
  y,
  w = 300,
  p,
  tone = 'dockerBlue',
  opacity = 1,
}: {
  x: number
  y: number
  w?: number
  p: number
  tone?: MgColorToken
  opacity?: number
}) {
  return (
    <div style={{ ...box(x, y, w, 10), borderRadius: 999, background: 'rgba(148,163,184,0.22)', opacity }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(1, p)) * 100}%`,
          height: '100%',
          borderRadius: 999,
          background: mgColors[tone],
        }}
      />
    </div>
  )
}
