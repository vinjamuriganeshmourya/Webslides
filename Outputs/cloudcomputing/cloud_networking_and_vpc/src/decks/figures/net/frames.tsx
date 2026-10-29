import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeftRight, Building2, Database, Globe, Lock, Router, Server, Table2, Waypoints, X } from 'lucide-react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { BOX_W, Card, Label, Num, STILL } from '../scene'
import { TILE_SKIN } from '../card'
import { RichCloud } from '../clay-c'

/**
 * THE SESSION'S OWN FRAMES ("Cloud Networking & VPC"). Everything else comes
 * from the layers sessions 1 to 4 left: `Card`, `Stage`, `Label`, `At`, `Fade`,
 * `Arrow`, `Traveller`, `useLoop`, `useCycle` (`../scene`), `PointsFigure`,
 * `FigureOnly`, `TableCard`, `IsoAnalogy` (`../iso/frames`), the 3D finish
 * (`Icon3D`, the clay objects, `../d3/kit`).
 *
 *   MARK / Logo     the three provider logos the spec names, imported so the single file inlines them
 *   Mono            a CIDR, an address, a zone name or a resource name inside a line (spec design note 3)
 *   shot / Crop     the TR's lab screenshots from `spec.json`, cropped in source pixels, never redrawn
 *   ShotCard        one screenshot card: the step label, the screenshot, its caption
 *   NET             the network palette: one template tone per kind of piece
 *   Boundary        a dashed boundary box with a corner label (the deployment boundary, a VPC, a region, a zone)
 *   SubnetBox       a solid tinted box: public or private, its label, its CIDR
 *   Gateway         a round glyph on an edge: internet gateway, NAT gateway, virtual private gateway, customer gateway, router
 *   RouteChip       the route table beside a subnet, as a chip; `MiniRouteTable` when the rows are on the card
 *   LockBadge       the security control on a subnet or an instance
 *   Resource        an instance, a server or a database inside a subnet
 *   InternetCloud   the public internet outside the VPC
 *   NoMark          the blocked mark on an arrow that is stopped
 *   VpcScene / G    THE ONE VPC DRAWING the whole deck reuses (spec design note 1), with its geometry exported
 */

/* ------------------------------------------------------------------ marks */

import aws from './marks/aws.png'
import azure from './marks/azure.png'
import gcp from './marks/google-cloud.png'

export const MARK = { aws, azure, gcp } as const
export type MarkName = keyof typeof MARK

/** One logo at a height, its name under it when given (a logo supports a label, never replaces it: rule 12). */
export function Logo({ name, h = 26, caption, style }: { name: MarkName; h?: number; caption?: string; style?: CSSProperties }) {
  return (
    <span className="inline-flex flex-col items-center gap-1" style={style}>
      <img src={MARK[name]} alt={caption ?? name} draggable={false} className="block w-auto select-none" style={{ height: h }} />
      {caption && (
        <span className="whitespace-nowrap text-[14px] font-medium leading-tight" style={{ color: colors.muted }}>
          {caption}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ monospace inside a line */

/** A CIDR, address, zone or resource name set in monospace inside running text (spec design note 3). The words are the spec's. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-[6px] px-1.5 py-[1px] font-mono" style={{ fontSize: '0.9em', background: colors.surface2, color: colors.brandDark, fontVariantLigatures: 'none' }}>
      {children}
    </code>
  )
}

/* ------------------------------------------------------------------ screenshots */

/* `shots-hd/`: the TR screenshots at 2x (Lanczos) with a light unsharp mask (course rule R4). Crops stay in SOURCE pixels. */
const SHOTS = import.meta.glob('./shots-hd/*.png', { eager: true, import: 'default' }) as Record<string, string>

/** A TR screenshot by its spec name, `slide-25-1` and so on. */
export const shot = (name: string) => SHOTS[`./shots-hd/${name}.png`]

/** Natural sizes of the TR screenshots, in source pixels (read from the files). */
export const SHOT_SIZE: Record<string, [number, number]> = {
  'slide-25-1': [1519, 795], 'slide-26-1': [1532, 358], 'slide-26-2': [1206, 683],
  'slide-27-1': [1475, 579], 'slide-28-1': [1325, 611], 'slide-28-2': [1435, 356],
}

export type Rect = [x: number, y: number, w: number, h: number]

/**
 * A screenshot cropped to the part the caption names (content rule 11), scaled
 * to fit `maxW` x `maxH`, never redrawn. `crop` and `highlight` are in SOURCE
 * pixels; the highlight ring is the template orange (course rule R4).
 */
export function Crop({ name, crop, highlight, maxW, maxH, alt, bg = colors.white, ring = 3 }: { name: string; crop?: Rect; highlight?: Rect | Rect[]; maxW: number; maxH: number; alt: string; bg?: string; ring?: number }) {
  const [W, H] = SHOT_SIZE[name]
  const [x, y, w, h] = crop ?? [0, 0, W, H]
  const s = Math.min(maxW / w, maxH / h)
  const rings = highlight ? (Array.isArray(highlight[0]) ? (highlight as Rect[]) : [highlight as Rect]) : []
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ width: Math.round(w * s), height: Math.round(h * s), boxShadow: '0 18px 36px -22px rgba(16,32,58,0.55), inset 0 0 0 1px rgba(16,32,58,0.08)', background: bg }}>
      {/* the crop is a background, so the element IS the visible window (an oversized clipped <img> read as overflow to qa and video-safe) */}
      <div role="img" aria-label={alt} className="absolute inset-0 select-none" style={{ backgroundImage: `url(${shot(name)})`, backgroundSize: `${W * s}px ${H * s}px`, backgroundPosition: `${-x * s}px ${-y * s}px`, backgroundRepeat: 'no-repeat' }} />
      {rings.map(([hx, hy, hw, hh], i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute rounded-md ${STILL ? '' : 'net-ring'}`}
          style={{ left: (hx - x) * s, top: (hy - y) * s, width: hw * s, height: hh * s, border: `${ring}px solid ${colors.accent}`, boxShadow: `0 0 0 4px ${colors.accent}30` }}
        />
      ))}
    </div>
  )
}

/**
 * One screenshot card (spec figure `AnnotatedShot`): the kit header, then the
 * step label and its lines in a column on the left, the cropped screenshot on
 * the right, its caption under it. `lines` are any extra spec lines (a point,
 * a note) shown under the label, in the spec's order.
 */
export function ShotCard({
  id, kicker, title, lesson, lead, step, lines = [], caption, name, crop, highlight, side, maxH = 380, colW = 380, bg, ring,
}: {
  id: string; kicker: string; title: string; lesson: string; lead?: ReactNode; step?: ReactNode; lines?: ReactNode[]; caption: ReactNode
  name: string; crop?: Rect; highlight?: Rect | Rect[]; side?: ReactNode; maxH?: number; colW?: number; bg?: string; ring?: number
}) {
  const gap = 36
  const shotW = BOX_W - colW - gap
  return (
    <Card id={id} kicker={kicker} title={title} lead={lead} lesson={lesson}>
      <div className="flex items-center" style={{ width: BOX_W, gap }}>
        <div className="flex flex-col gap-4" style={{ width: colW }}>
          {step && <StepLabel>{step}</StepLabel>}
          {lines.map((l, i) => (
            <p key={i} className="text-[18px] leading-snug" style={{ color: colors.ink }}>
              {l}
            </p>
          ))}
          {side}
        </div>
        <figure className="m-0 flex flex-col items-center gap-3" style={{ width: shotW }}>
          <Crop name={name} crop={crop} highlight={highlight} maxW={shotW} maxH={maxH} bg={bg} ring={ring} alt={typeof caption === 'string' ? caption : ''} />
          <figcaption className="text-center text-[17px] font-semibold leading-snug" style={{ color: colors.ink }}>
            {caption}
          </figcaption>
        </figure>
      </div>
    </Card>
  )
}

/** A step's label, in the heading face, brand ink. */
export function StepLabel({ children, n }: { children: ReactNode; n?: number }) {
  return (
    <div className="flex items-start gap-2.5">
      {n !== undefined && <Num n={n} size={28} />}
      <span className="font-heading text-[22px] font-bold leading-tight" style={{ color: colors.brandDark }}>
        {children}
      </span>
    </div>
  )
}

/** A callout under a figure or a list (the TR's `Important Note`): the kit callout's look, the accent rim, one or two lines. */
export function NoteBox({ children, w = BOX_W, tone = colors.accent, size = 17 }: { children: ReactNode; w?: number | string; tone?: string; size?: number }) {
  return (
    <div className="rounded-[16px] px-5 py-3 leading-snug" style={{ width: w, fontSize: size, color: colors.ink, background: 'linear-gradient(135deg, #FFF7EC 0%, #FFEBD4 100%)', boxShadow: `inset 5px 0 0 0 ${tone}, inset 0 0 0 1px #F8D9B4, 0 12px 24px -18px rgba(229,115,42,0.45)` }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ the network palette */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'

/** One template tone per kind of piece, the same on every slide (content rule 37; never a colour from the AWS images). */
export const NET = {
  boundary: colors.brand, // the dashed deployment boundary and the VPC edge
  public: colors.success, // a public subnet
  private: colors.teal, // a private subnet
  gateway: colors.brandDark, // a gateway glyph
  lock: colors.brandDark, // a security control
  blocked: colors.danger, // a stopped arrow
  cost: colors.warning, // a cost tag
  lit: colors.accent, // the part the card is about
} as const

/** 0 before a, 1 after b, eased between (for a lap-driven scene). */
export function within(t: number, a: number, b: number) {
  if (t <= a) return 0
  if (t >= b) return 1
  const x = (t - a) / (b - a)
  return x * x * (3 - 2 * x)
}

/** The ring that lights a piece: the template orange, inset so the piece keeps its bounds (content rule 43). */
export const litRing = (lit: boolean, base = '') => `${base}${base && lit ? ', ' : ''}${lit ? `0 0 0 3px ${NET.lit}, 0 10px 22px -12px ${NET.lit}` : ''}`

/* ------------------------------------------------------------------ pieces */

/**
 * A dashed boundary box with its label in the top-left corner: the deployment
 * boundary of T01-1, the VPC of every later card, a region, a zone. Children
 * are placed absolutely inside it (`At` from `../scene`), so the box is
 * `position: relative`. `fill` washes the inside; `solid` draws a solid rim.
 */
export function Boundary({ w, h, label, tone = NET.boundary, lit = false, dim = false, fill, solid = false, labelTone = 'brand', children, style, radius = 18, labelSize = 14 }: {
  w: number; h: number; label?: ReactNode; tone?: string; lit?: boolean; dim?: boolean; fill?: string; solid?: boolean; labelTone?: 'brand' | 'solid' | 'plain' | 'good' | 'muted' | 'dark'; children?: ReactNode; style?: CSSProperties; radius?: number; labelSize?: number
}) {
  const instant = useInstant()
  return (
    <div
      className="relative"
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        border: `2.5px ${solid ? 'solid' : 'dashed'} ${tone}`,
        background: fill ?? `${tone}0D`,
        boxShadow: litRing(lit),
        opacity: dim ? 0.4 : 1,
        transition: instant ? 'none' : `box-shadow 420ms ${EASE}, opacity 420ms ${EASE}, border-color 420ms ${EASE}`,
        ...style,
      }}
    >
      {label !== undefined && (
        <div className="absolute" style={{ left: 12, top: -13 }}>
          <Label size={labelSize} strong tone={labelTone} raised>
            {label}
          </Label>
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * A subnet: a solid tinted box, its label chip in the top-left corner, its
 * CIDR under the label in monospace when given. `kind` picks the tone (public
 * green, private teal, plain blue). Children are placed absolutely inside.
 */
export function SubnetBox({ w, h, kind = 'plain', label, cidr, lit = false, dim = false, children, style, labelSize = 14 }: {
  w: number; h: number; kind?: 'public' | 'private' | 'plain'; label?: ReactNode; cidr?: ReactNode; lit?: boolean; dim?: boolean; children?: ReactNode; style?: CSSProperties; labelSize?: number
}) {
  const instant = useInstant()
  const tone = kind === 'public' ? NET.public : kind === 'private' ? NET.private : NET.boundary
  return (
    <div
      className="relative"
      style={{
        width: w,
        height: h,
        borderRadius: 14,
        background: `linear-gradient(180deg, ${tone}14 0%, ${tone}22 100%)`,
        boxShadow: litRing(lit, `inset 0 0 0 2px ${tone}`),
        opacity: dim ? 0.4 : 1,
        transition: instant ? 'none' : `box-shadow 420ms ${EASE}, opacity 420ms ${EASE}`,
        ...style,
      }}
    >
      {label !== undefined && (
        <div className="absolute flex flex-col items-start gap-1" style={{ left: 8, top: 8 }}>
          <span className="inline-flex whitespace-nowrap rounded-pill px-2 py-[2px] font-heading font-semibold leading-tight" style={{ fontSize: labelSize, color: colors.white, background: tone }}>
            {label}
          </span>
          {cidr !== undefined && (
            <span className="whitespace-nowrap font-mono text-[14px] font-medium leading-tight" style={{ color: colors.ink, fontVariantLigatures: 'none' }}>
              {cidr}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export type GatewayKind = 'igw' | 'nat' | 'vgw' | 'cgw' | 'router' | 'peer'

const GW_ICON: Record<GatewayKind, (px: number) => ReactNode> = {
  igw: (px) => <Globe size={px} strokeWidth={2.2} />,
  nat: (px) => <ArrowLeftRight size={px} strokeWidth={2.2} />,
  vgw: (px) => <Waypoints size={px} strokeWidth={2.2} />,
  cgw: (px) => <Building2 size={px} strokeWidth={2.2} />,
  router: (px) => <Router size={px} strokeWidth={2.2} />,
  peer: (px) => <Waypoints size={px} strokeWidth={2.2} />,
}

/**
 * A gateway: a white disc ringed in the gateway tone with the kind's icon, and
 * its label chip under it when given. Sized `size`, centred on its own box, so
 * place it with `At … cx cy` on the point it sits on (a VPC edge, inside the
 * public subnet).
 */
export function Gateway({ kind, label, lit = false, dim = false, size = 46, labelBelow = true, labelTone = 'plain', labelSize = 14, faint = false }: {
  kind: GatewayKind; label?: ReactNode; lit?: boolean; dim?: boolean; size?: number; labelBelow?: boolean; labelTone?: 'plain' | 'brand' | 'solid' | 'lift' | 'good' | 'muted' | 'dark'; labelSize?: number; faint?: boolean
}) {
  const instant = useInstant()
  return (
    <div className={`flex items-center gap-1.5 ${labelBelow ? 'flex-col' : 'flex-row'}`} style={{ opacity: dim ? 0.4 : 1, transition: instant ? 'none' : `opacity 420ms ${EASE}` }}>
      <span
        className="grid shrink-0 place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: faint ? 'transparent' : `linear-gradient(180deg, #FFFFFF 0%, ${colors.surface2} 100%)`,
          color: faint ? colors.muted : NET.gateway,
          boxShadow: faint ? `inset 0 0 0 2px ${colors.line}` : litRing(lit, `inset 0 0 0 2.5px ${NET.gateway}, 0 10px 20px -12px rgba(16,32,58,0.5)`),
          border: faint ? `2px dashed ${colors.line}` : undefined,
          transition: instant ? 'none' : `box-shadow 420ms ${EASE}, color 420ms ${EASE}, background 420ms ${EASE}`,
        }}
        aria-hidden
      >
        {GW_ICON[kind](Math.round(size * 0.52))}
      </span>
      {label !== undefined && (
        <Label size={labelSize} strong tone={lit ? 'solid' : labelTone}>
          {label}
        </Label>
      )}
    </div>
  )
}

/** The route table beside a subnet, as one chip with the table icon. `lit` lights it. */
export function RouteChip({ label = 'route table', lit = false, dim = false, size = 14 }: { label?: ReactNode; lit?: boolean; dim?: boolean; size?: number }) {
  const instant = useInstant()
  return (
    <span style={{ display: 'inline-block', opacity: dim ? 0.4 : 1, transition: instant ? 'none' : `opacity 420ms ${EASE}` }}>
      <Label size={size} strong tone={lit ? 'solid' : 'plain'} raised icon={<Table2 />}>
        {label}
      </Label>
    </span>
  )
}

/**
 * A route table drawn with its rows: the heads `Destination` and `Target`, then
 * each row in monospace. `litRow` rings one row (the matching entry); `pending`
 * leaves a row's target blank (the entry with no target yet, T15-1). Every
 * string in it is the card's.
 */
export function MiniRouteTable({ rows, heads = ['Destination', 'Target'], w = 230, litRow = -1, lit = false, title, size = 14, dim = false }: {
  rows: [ReactNode, ReactNode][]; heads?: [ReactNode, ReactNode]; w?: number; litRow?: number; lit?: boolean; title?: ReactNode; size?: number; dim?: boolean
}) {
  const instant = useInstant()
  const ease = instant ? 'none' : `all 420ms ${EASE}`
  return (
    <div className="overflow-hidden rounded-[12px]" style={{ width: w, ...TILE_SKIN, boxShadow: litRing(lit, TILE_SKIN.boxShadow as string), opacity: dim ? 0.4 : 1, transition: ease }}>
      {title !== undefined && (
        <div className="px-3 py-1.5 font-heading font-semibold leading-tight" style={{ fontSize: size, color: colors.white, background: NET.gateway }}>
          {title}
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: '1.15fr 1fr' }}>
        {heads.map((h, i) => (
          <div key={i} className="px-3 py-1.5 font-heading font-semibold leading-tight" style={{ fontSize: size, color: colors.brandDark, background: colors.surface2 }}>
            {h}
          </div>
        ))}
        {rows.map((r, i) => (
          <div key={i} className="contents">
            {r.map((c, j) => (
              <div
                key={j}
                className="px-3 py-1.5 font-mono leading-tight"
                style={{ fontSize: size, color: colors.ink, fontVariantLigatures: 'none', borderTop: `1px solid ${colors.line}`, background: litRow === i ? `${NET.lit}26` : undefined, boxShadow: litRow === i && j === 0 ? `inset 3px 0 0 0 ${NET.lit}` : undefined, transition: ease }}
              >
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** A security control: a disc with a padlock. `ring` draws it as a ring (a security group ring, a network ACL ring) instead. */
export function LockBadge({ lit = false, dim = false, size = 28, faint = false }: { lit?: boolean; dim?: boolean; size?: number; faint?: boolean }) {
  const instant = useInstant()
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: faint ? colors.surface : lit ? NET.lit : NET.lock,
        color: faint ? colors.muted : colors.white,
        boxShadow: faint ? `inset 0 0 0 1.5px ${colors.line}` : `0 0 0 3px ${colors.white}, 0 8px 16px -8px rgba(16,32,58,0.6)`,
        opacity: dim ? 0.4 : 1,
        transition: instant ? 'none' : `background 420ms ${EASE}, opacity 420ms ${EASE}`,
      }}
    >
      <Lock style={{ width: size * 0.52, height: size * 0.52, strokeWidth: 2.4 }} />
    </span>
  )
}

/** A resource inside a subnet: an instance (a server) or a database, on a raised tile, its label under it when given. */
export function Resource({ kind = 'instance', label, lit = false, dim = false, size = 54, labelSize = 14, labelTone = 'plain' }: { kind?: 'instance' | 'server' | 'database'; label?: ReactNode; lit?: boolean; dim?: boolean; size?: number; labelSize?: number; labelTone?: 'plain' | 'brand' | 'solid' | 'muted' | 'good' | 'bad' }) {
  const instant = useInstant()
  const px = Math.round(size * 0.5)
  const icon = kind === 'database' ? <Database size={px} strokeWidth={2} /> : <Server size={px} strokeWidth={2} />
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ opacity: dim ? 0.4 : 1, transition: instant ? 'none' : `opacity 420ms ${EASE}` }}>
      <span className="grid place-items-center rounded-[14px]" style={{ width: size, height: size, ...TILE_SKIN, boxShadow: litRing(lit, TILE_SKIN.boxShadow as string), color: colors.brandDark, transition: instant ? 'none' : `box-shadow 420ms ${EASE}` }} aria-hidden>
        {icon}
      </span>
      {label !== undefined && (
        <Label size={labelSize} strong tone={lit ? 'solid' : labelTone}>
          {label}
        </Label>
      )}
    </div>
  )
}

/** The public internet outside the VPC: session 1's rich cloud with its label under it. */
export function InternetCloud({ w = 110, label = 'internet', lit = false, dim = false, labelSize = 14 }: { w?: number; label?: ReactNode; lit?: boolean; dim?: boolean; labelSize?: number }) {
  const instant = useInstant()
  return (
    <div className="flex flex-col items-center" style={{ gap: 0, opacity: dim ? 0.4 : 1, transition: instant ? 'none' : `opacity 420ms ${EASE}` }}>
      <RichCloud w={w} />
      {label !== undefined && (
        <Label size={labelSize} strong tone={lit ? 'solid' : 'plain'} style={{ marginTop: -6 }}>
          {label}
        </Label>
      )}
    </div>
  )
}

/** The blocked mark at the end of a stopped arrow: a danger disc with a cross. */
export function NoMark({ size = 24, on = true }: { size?: number; on?: boolean }) {
  const instant = useInstant()
  return (
    <span aria-hidden className="grid place-items-center rounded-full" style={{ width: size, height: size, background: NET.blocked, color: colors.white, boxShadow: `0 0 0 3px ${colors.white}, 0 8px 16px -8px rgba(16,32,58,0.5)`, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: instant ? 'none' : `all 360ms ${EASE}` }}>
      <X style={{ width: size * 0.6, height: size * 0.6, strokeWidth: 3 }} />
    </span>
  )
}

/* ------------------------------------------------------------------ the one VPC drawing */

/**
 * THE GEOMETRY of the one VPC drawing, on a 634 x 380 stage (the `PointsFigure`
 * stage). Section files place their own arrows and packets with these numbers,
 * so an arrow's ends are computed from the same constants as the boxes
 * (generate-slides 2c: never placed by eye). All rects are `{ x, y, w, h }` in
 * stage pixels; centres are `{ cx, cy }`.
 */
export const G = {
  W: 634,
  H: 380,
  /** the VPC (or the deployment boundary) */
  vpc: { x: 24, y: 100, w: 372, h: 268 },
  /** the two subnets inside it */
  pub: { x: 46, y: 148, w: 150, h: 158 },
  pri: { x: 222, y: 148, w: 150, h: 158 },
  /** the route table chip under each subnet */
  rtPub: { x: 46, y: 316, w: 150, h: 38 },
  rtPri: { x: 222, y: 316, w: 150, h: 38 },
  /** the internet gateway on the VPC's top edge, over the public subnet */
  igw: { cx: 150, cy: 100 },
  /** the NAT gateway inside the public subnet, under the instance */
  nat: { cx: 121, cy: 256 },
  /** one instance in each subnet */
  instPub: { cx: 121, cy: 212 },
  instPri: { cx: 297, cy: 212 },
  /** the lock on each subnet's top-right corner */
  lockPub: { cx: 196, cy: 148 },
  lockPri: { cx: 372, cy: 148 },
  /** the public internet, outside the VPC at the top right */
  cloud: { x: 290, y: 0, w: 130, h: 90 },
  /** the second VPC a peering line reaches, at the lower right */
  peer: { x: 466, y: 226, w: 154, h: 134 },
  /** the local line between the two subnets */
  local: { x1: 196, x2: 222, y: 212 },
} as const

export type VpcPart = 'vpc' | 'public' | 'private' | 'igw' | 'nat' | 'locks' | 'routeTables' | 'peer' | 'internet' | 'local' | 'instances'

/**
 * THE ONE VPC DRAWING (spec design note 1): the dashed VPC box holding a
 * public and a private subnet, the internet gateway on its top edge, the NAT
 * gateway inside the public subnet, a route table chip under each subnet, a
 * lock on each subnet, the internet outside, a second VPC on a dashed peering
 * line. Every part is switched on by a flag; `lit` rings the parts the card is
 * about; `dim` fades the rest. Draw it once here and reuse it: T02-2 builds
 * it, T03-2, T13-1, T15-1, T16-1, T18-2 and T19-1 light the part they teach.
 *
 * It fills a 634 x 380 stage (`G.W` x `G.H`); wrap it in `At` to offset it on a
 * wider stage. `children` are placed absolutely in the same coordinates (arrows,
 * packets, extra labels). The labels are the TR's words: `VPC`, `Public subnet`,
 * `Private subnet`, `Internet Gateway`, `NAT Gateway`, `route table`, `Peering`,
 * `internet`, `local`; pass another string where a card says it differently.
 */
export function VpcScene({
  label = 'VPC', subnets = true, publicLabel = 'Public subnet', privateLabel = 'Private subnet', publicCidr, privateCidr,
  igw = false, nat = false, locks = false, routeTables = false, internet = false, peer = false, local = false, instances = false,
  igwLabel = 'Internet Gateway', natLabel = 'NAT Gateway', peerLabel = 'Peering', peerVpcLabel = 'VPC', internetLabel = 'internet', localLabel = 'local', routeLabel = 'route table',
  lit = {}, dim = {}, faint = {}, slots = 0, children, vpcTone,
}: {
  label?: ReactNode; subnets?: boolean; publicLabel?: ReactNode; privateLabel?: ReactNode; publicCidr?: ReactNode; privateCidr?: ReactNode
  igw?: boolean; nat?: boolean; locks?: boolean; routeTables?: boolean; internet?: boolean; peer?: boolean; local?: boolean; instances?: boolean
  igwLabel?: ReactNode; natLabel?: ReactNode; peerLabel?: ReactNode; peerVpcLabel?: ReactNode; internetLabel?: ReactNode; localLabel?: ReactNode; routeLabel?: ReactNode
  lit?: Partial<Record<VpcPart, boolean>>; dim?: Partial<Record<VpcPart, boolean>>; faint?: Partial<Record<VpcPart, boolean>>
  /** T02-1: that many empty dashed slots inside the boundary, in place of the subnets */
  slots?: number
  children?: ReactNode
  vpcTone?: string
}) {
  const instant = useInstant()
  const ease = instant ? 'none' : `opacity 420ms ${EASE}`
  const at = (r: { x: number; y: number; w?: number; h?: number }, extra?: CSSProperties): CSSProperties => ({ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, ...extra })
  const centre = (c: { cx: number; cy: number }): CSSProperties => ({ position: 'absolute', left: c.cx, top: c.cy, transform: 'translate(-50%, -50%)' })
  const slotW = slots > 0 ? (G.vpc.w - 44 - 14 * (slots - 1)) / slots : 0
  return (
    <div className="absolute inset-0" style={{ width: G.W, height: G.H }}>
      {/* the VPC */}
      <div style={at(G.vpc)}>
        <Boundary w={G.vpc.w} h={G.vpc.h} label={label} lit={!!lit.vpc} dim={!!dim.vpc} tone={vpcTone} />
      </div>
      {/* the empty slots (T02-1) */}
      {Array.from({ length: slots }, (_, i) => (
        <div key={i} className="rounded-[14px]" style={at({ x: G.vpc.x + 22 + i * (slotW + 14), y: G.pub.y, w: slotW, h: G.pub.h }, { border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.4)' })} />
      ))}
      {/* the subnets */}
      {subnets && (
        <>
          <div style={at(G.pub)}>
            <SubnetBox w={G.pub.w} h={G.pub.h} kind="public" label={publicLabel} cidr={publicCidr} lit={!!lit.public} dim={!!dim.public} />
          </div>
          <div style={at(G.pri)}>
            <SubnetBox w={G.pri.w} h={G.pri.h} kind="private" label={privateLabel} cidr={privateCidr} lit={!!lit.private} dim={!!dim.private} />
          </div>
        </>
      )}
      {/* the local line between them */}
      {local && (
        <>
          <span aria-hidden className="absolute rounded-full" style={{ left: G.local.x1, top: G.local.y - 1.5, width: G.local.x2 - G.local.x1, height: 3, background: lit.local ? NET.lit : NET.boundary, opacity: dim.local ? 0.4 : 1, transition: ease }} />
          <div style={centre({ cx: (G.local.x1 + G.local.x2) / 2, cy: G.local.y + 22 })}>
            <Label size={14} strong tone={lit.local ? 'solid' : 'plain'} raised>
              {localLabel}
            </Label>
          </div>
        </>
      )}
      {/* the instances */}
      {instances && (
        <>
          <div style={centre(G.instPub)}>
            <Resource size={48} lit={!!lit.instances} dim={!!dim.instances} />
          </div>
          <div style={centre(G.instPri)}>
            <Resource size={48} lit={!!lit.instances} dim={!!dim.instances} />
          </div>
        </>
      )}
      {/* the route table chips */}
      {routeTables && (
        <>
          <div className="grid place-items-center" style={at(G.rtPub)}>
            <RouteChip label={routeLabel} lit={!!lit.routeTables} dim={!!dim.routeTables} />
          </div>
          <div className="grid place-items-center" style={at(G.rtPri)}>
            <RouteChip label={routeLabel} lit={!!lit.routeTables} dim={!!dim.routeTables} />
          </div>
        </>
      )}
      {/* the locks */}
      {locks && (
        <>
          <div style={centre(G.lockPub)}>
            <LockBadge lit={!!lit.locks} dim={!!dim.locks} faint={!!faint.locks} />
          </div>
          <div style={centre(G.lockPri)}>
            <LockBadge lit={!!lit.locks} dim={!!dim.locks} faint={!!faint.locks} />
          </div>
        </>
      )}
      {/* the NAT gateway inside the public subnet */}
      {nat && (
        <div style={centre({ cx: G.nat.cx, cy: G.nat.cy + 12 })}>
          <Gateway kind="nat" label={natLabel} lit={!!lit.nat} dim={!!dim.nat} faint={!!faint.nat} size={36} />
        </div>
      )}
      {/* the internet gateway on the VPC's top edge */}
      {igw && (
        <div style={centre(G.igw)}>
          <Gateway kind="igw" lit={!!lit.igw} dim={!!dim.igw} faint={!!faint.igw} />
        </div>
      )}
      {igw && igwLabel !== undefined && (
        <div style={centre({ cx: G.igw.cx, cy: G.igw.cy - 42 })}>
          <Label size={14} strong tone={lit.igw ? 'solid' : 'plain'} raised>
            {igwLabel}
          </Label>
        </div>
      )}
      {/* the internet */}
      {internet && (
        <div className="grid place-items-center" style={at(G.cloud)}>
          <InternetCloud w={100} label={internetLabel} lit={!!lit.internet} dim={!!dim.internet} />
        </div>
      )}
      {/* the peered VPC */}
      {peer && (
        <>
          <div style={at(G.peer)}>
            <Boundary w={G.peer.w} h={G.peer.h} label={peerVpcLabel} lit={!!lit.peer} dim={!!dim.peer} />
          </div>
          <span aria-hidden className="absolute" style={{ left: G.vpc.x + G.vpc.w, top: G.peer.y + G.peer.h / 2 - 1.5, width: G.peer.x - (G.vpc.x + G.vpc.w), borderTop: `3px dashed ${lit.peer ? NET.lit : NET.boundary}`, opacity: dim.peer ? 0.4 : 1, transition: ease }} />
          <div style={centre({ cx: (G.vpc.x + G.vpc.w + G.peer.x) / 2, cy: G.peer.y + G.peer.h / 2 - 22 })}>
            <Label size={14} strong tone={lit.peer ? 'solid' : 'plain'} raised>
              {peerLabel}
            </Label>
          </div>
        </>
      )}
      {children}
    </div>
  )
}

/** The screenshot highlight breathes in the template orange (course rule R4). */
export const NET_CSS = `
@keyframes net-ring { 0%, 100% { box-shadow: 0 0 0 4px rgba(255,138,61,0.22) } 50% { box-shadow: 0 0 0 9px rgba(255,138,61,0.09) } }
.net-ring { animation: net-ring 1.6s cubic-bezier(0.22,1,0.36,1) infinite }
@media (prefers-reduced-motion: reduce) { .net-ring { animation: none } }
.cc-still .net-ring, .deck-thumb .net-ring { animation: none }
`
