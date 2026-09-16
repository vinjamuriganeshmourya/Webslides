import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { T, E, c4 } from '@/ui/figureTiming'
import { INDIA, INDIA_ISLANDS, WORLD_LAND, type Ring } from './regionMapGeo'
import { REGION_CODE, ZONES } from '../deckShared'

/**
 * RegionMap — Regions are places, and a Region is more than one building.
 *
 * WHAT IT ARGUES
 *   A list of Region codes says nothing about where they are. Two states:
 *
 *     world   a low-detail world outline with every AWS Region as a dot, India
 *             filled in, Mumbai (ap-south-1) and Hyderabad (ap-south-2) named
 *     zones   India on the left with the same two cities, and Mumbai opened on
 *             the right into three separate buildings, ap-south-1a, 1b, 1c
 *
 *   The outlines are real. `regionMapGeo.ts` is generated from Natural Earth
 *   (India in the India point-of-view variant, so the north is drawn as an
 *   Indian classroom expects) and simplified hard, because the figure is about
 *   dots on a map: the coast only has to be recognisable from the back of a
 *   room, not surveyed. The first version drew the continents as hand-made
 *   polygons and India was not recognisable at all.
 *
 * WHY LABELS ARE DOM AND ONLY SHAPES ARE SVG
 *   Hard rule 17. Every city name, zone name and legend is a positioned element
 *   with an explicit width and a white ground; the `<svg>` carries land, dots,
 *   leader lines and the building glyphs. The two Indian cities are 17px apart
 *   at this scale, so both labels are pulled out over the sea with leader lines
 *   rather than set beside their dots.
 */

export type RegionMapState = 'world' | 'zones'

const W = 1100
const H = 410

/* ── the world, equirectangular ──────────────────────────────────────── */

/** Pixels per degree, chosen so 360° of longitude spans the figure. */
const PX = W / 360
const TOP_LAT = 76
const px = (lon: number) => (lon + 180) * PX
const py = (lat: number) => (TOP_LAT - lat) * PX

/**
 * AWS Regions, lon and lat, one dot each. The city each Region is named for,
 * which is where a dot should land; the exact Data Centres are not public.
 */
const REGIONS: { name: string; at: [number, number] }[] = [
  { name: 'N. Virginia', at: [-77.0, 38.9] },
  { name: 'Ohio', at: [-83.0, 40.0] },
  { name: 'N. California', at: [-122.0, 37.4] },
  { name: 'Oregon', at: [-119.7, 45.8] },
  { name: 'Canada Central', at: [-73.6, 45.5] },
  { name: 'Canada West', at: [-114.1, 51.0] },
  { name: 'Mexico', at: [-100.4, 20.6] },
  { name: 'Sao Paulo', at: [-46.6, -23.5] },
  { name: 'Ireland', at: [-6.3, 53.3] },
  { name: 'London', at: [-0.1, 51.5] },
  { name: 'Paris', at: [2.3, 48.9] },
  { name: 'Frankfurt', at: [8.7, 50.1] },
  { name: 'Stockholm', at: [18.1, 59.3] },
  { name: 'Milan', at: [9.2, 45.5] },
  { name: 'Zurich', at: [8.5, 47.4] },
  { name: 'Spain', at: [-0.9, 41.6] },
  { name: 'Tel Aviv', at: [34.8, 32.1] },
  { name: 'Bahrain', at: [50.6, 26.2] },
  { name: 'UAE', at: [54.4, 24.5] },
  { name: 'Cape Town', at: [18.4, -33.9] },
  { name: 'Mumbai', at: [72.88, 19.08] },
  { name: 'Hyderabad', at: [78.49, 17.39] },
  { name: 'Singapore', at: [103.8, 1.35] },
  { name: 'Jakarta', at: [106.8, -6.2] },
  { name: 'Malaysia', at: [101.7, 3.1] },
  { name: 'Thailand', at: [100.5, 13.8] },
  { name: 'Hong Kong', at: [114.2, 22.3] },
  { name: 'Taipei', at: [121.5, 25.0] },
  { name: 'Seoul', at: [127.0, 37.6] },
  { name: 'Tokyo', at: [139.7, 35.7] },
  { name: 'Osaka', at: [135.5, 34.7] },
  { name: 'Sydney', at: [151.2, -33.9] },
  { name: 'Melbourne', at: [145.0, -37.8] },
  { name: 'New Zealand', at: [174.8, -36.8] },
]

const MUMBAI: [number, number] = [72.88, 19.08]
const HYDERABAD: [number, number] = [78.49, 17.39]

const toPath = (ring: Ring, fx: (lon: number) => number, fy: (lat: number) => number) =>
  ring.map(([lon, lat], i) => `${i ? 'L' : 'M'} ${fx(lon).toFixed(1)} ${fy(lat).toFixed(1)}`).join(' ') + ' Z'

/** Every ring of a land layer as one path, so a shadow or a fill is one element. */
const toPaths = (rings: Ring[], fx: (lon: number) => number, fy: (lat: number) => number) =>
  rings.map((r) => toPath(r, fx, fy)).join(' ')

/* ── the zoomed India, zones state ───────────────────────────────────── */

/** 10 px per degree, lon 66..98 and lat 37..6 into a box at the left. */
const ZOOM = { x: 30, y: 30, px: 9.5, lon0: 66, lat0: 37 }
const zx = (lon: number) => ZOOM.x + (lon - ZOOM.lon0) * ZOOM.px
const zy = (lat: number) => ZOOM.y + (ZOOM.lat0 - lat) * ZOOM.px

/** The Region opened up on the right. */
const CITY = { x: 420, y: 44, w: 660, h: 346 }
const BUILDING = { w: 150, h: 170, top: CITY.y + 60 }
const bx = (i: number) => CITY.x + 42 + i * (BUILDING.w + 60)

/* ── motion helpers ──────────────────────────────────────────────────── */

const at = (k: number) => T.lead + k * T.stagger

/* Set once per render of the figure; read by every Block below it. */
let reduced = false
const reduceMotion = () => reduced

function Block({
  x, y, w, delay, instant, children, className = '',
}: { x: number; y: number; w: number; delay: number; instant: boolean; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ left: x, top: y, width: w }}
      initial={instant ? false : { opacity: 0, transform: reduceMotion() ? 'translateY(0px)' : 'translateY(10px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: T.enter, delay, ease: c4(E.out) }}
    >
      {children}
    </motion.div>
  )
}

function Fade({ delay, instant, children }: { delay: number; instant: boolean; children: ReactNode }) {
  return (
    <motion.g
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: T.enter, delay, ease: c4(E.out) }}
    >
      {children}
    </motion.g>
  )
}

function Draw({ delay, instant, children }: { delay: number; instant: boolean; children: ReactNode }) {
  return (
    <motion.g
      initial={instant ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration: T.draw, delay, ease: c4(E.out) },
        opacity: { duration: 0.01, delay },
      }}
    >
      {children}
    </motion.g>
  )
}

function CityLabel({ name, code, tone }: { name: string; code: string; tone: string }) {
  return (
    <div className="rounded-lg bg-white px-2.5 py-1 text-center shadow-card-soft" style={{ border: `1px solid ${tone}` }}>
      <div className="text-body-sm font-bold leading-5 text-ink">{name}</div>
      <div className="font-mono text-xs leading-4" style={{ color: tone }}>{code}</div>
    </div>
  )
}

/* ── the figure ──────────────────────────────────────────────────────── */

export function RegionMap({
  state,
  className = '',
  zones = ZONES,
}: {
  state: RegionMapState
  className?: string
  zones?: [string, string, string]
}) {
  const instant = useInstant()
  reduced = !!useReducedMotion()
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      {state === 'world' ? <World instant={instant} /> : <Zones instant={instant} zones={zones} />}
    </div>
  )
}

function World({ instant }: { instant: boolean }) {
  const [mx, my] = [px(MUMBAI[0]), py(MUMBAI[1])]
  const [hx, hy] = [px(HYDERABAD[0]), py(HYDERABAD[1])]
  /* Both labels sit over the Arabian Sea and the Indian Ocean, which hold no dots. */
  const mumbaiLabel = { x: 548, y: 196, w: 132 }
  const hyderabadLabel = { x: 690, y: 262, w: 150 }
  return (
    <>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="A world map with every AWS Region as a dot, India filled in, and Mumbai and Hyderabad named">
        <Fade delay={at(0)} instant={instant}>
          {/* Two layers of land: a soft blue drop, then the land itself, for depth. */}
          <path d={toPaths(WORLD_LAND, (lon) => px(lon) + 3, (lat) => py(lat) + 4)} fill={colors.brand} opacity={0.12} />
          <path d={toPaths(WORLD_LAND, px, py)} fill={colors.white} stroke={colors.line} strokeWidth={1} strokeLinejoin="round" />
        </Fade>
        <Fade delay={at(1)} instant={instant}>
          {/* The mainland only: the islands are specks at this scale. */}
          <path d={toPath(INDIA, px, py)} fill={colors.brand} stroke={colors.brandDark} strokeWidth={1} strokeLinejoin="round" />
        </Fade>
        <Fade delay={at(2)} instant={instant}>
          {REGIONS.map(({ name, at: [lon, lat] }) => (
            <circle key={name} cx={px(lon)} cy={py(lat)} r={4.5} fill={colors.brandDark} stroke={colors.white} strokeWidth={1.5} />
          ))}
        </Fade>
        <Draw delay={at(4)} instant={instant}>
          <line x1={mx} y1={my} x2={mumbaiLabel.x + mumbaiLabel.w} y2={mumbaiLabel.y + 8} stroke={colors.ink} strokeWidth={1.5} />
          <line x1={hx} y1={hy} x2={hyderabadLabel.x + hyderabadLabel.w / 2} y2={hyderabadLabel.y} stroke={colors.ink} strokeWidth={1.5} />
        </Draw>
        <Fade delay={at(4)} instant={instant}>
          <circle cx={mx} cy={my} r={6} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
          <circle cx={hx} cy={hy} r={6} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
        </Fade>
      </svg>

      <Block x={mumbaiLabel.x} y={mumbaiLabel.y} w={mumbaiLabel.w} delay={at(5)} instant={instant}>
        <CityLabel name="Mumbai" code={REGION_CODE} tone={colors.ink} />
      </Block>
      <Block x={hyderabadLabel.x} y={hyderabadLabel.y} w={hyderabadLabel.w} delay={at(6)} instant={instant}>
        <CityLabel name="Hyderabad" code="ap-south-2" tone={colors.ink} />
      </Block>

      <Block x={20} y={H - 34} w={260} delay={at(3)} instant={instant}>
        <span className="inline-flex items-center gap-2 rounded-pill border bg-white px-3 py-1 text-xs font-semibold" style={{ borderColor: colors.line, color: colors.body }}>
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colors.brandDark }} />
          one dot is one AWS Region
        </span>
      </Block>
    </>
  )
}

function Zones({ instant, zones }: { instant: boolean; zones: [string, string, string] }) {
  const [mx, my] = [zx(MUMBAI[0]), zy(MUMBAI[1])]
  const [hx, hy] = [zx(HYDERABAD[0]), zy(HYDERABAD[1])]
  const mumbaiLabel = { x: 4, y: 252, w: 120 }
  const hyderabadLabel = { x: 214, y: 304, w: 140 }
  return (
    <>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="India with Mumbai and Hyderabad marked, and the Mumbai Region opened into three separate buildings">
        <Fade delay={at(0)} instant={instant}>
          <path d={toPaths([INDIA, ...INDIA_ISLANDS], (lon) => zx(lon) + 5, (lat) => zy(lat) + 6)} fill={colors.brand} opacity={0.18} />
          <path d={toPaths([INDIA, ...INDIA_ISLANDS], zx, zy)} fill={colors.brand} stroke={colors.brandDark} strokeWidth={1.5} strokeLinejoin="round" />
        </Fade>
        <Draw delay={at(1)} instant={instant}>
          <line x1={mx} y1={my} x2={mumbaiLabel.x + mumbaiLabel.w / 2} y2={mumbaiLabel.y} stroke={colors.ink} strokeWidth={1.5} />
          <line x1={hx} y1={hy} x2={hyderabadLabel.x + hyderabadLabel.w / 2} y2={hyderabadLabel.y} stroke={colors.ink} strokeWidth={1.5} />
        </Draw>
        <Fade delay={at(1)} instant={instant}>
          <circle cx={mx} cy={my} r={7} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
          <circle cx={hx} cy={hy} r={7} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
        </Fade>

        {/* Mumbai, opened: a soft ground, then the dashed link from the city to its frame */}
        <Fade delay={at(3)} instant={instant}>
          <rect x={CITY.x} y={CITY.y} width={CITY.w} height={CITY.h} rx={16} fill={colors.white} opacity={0.5} />
        </Fade>
        <Draw delay={at(3)} instant={instant}>
          <line x1={mx + 8} y1={my} x2={CITY.x} y2={CITY.y + 60} stroke={colors.brand} strokeWidth={1.5} strokeDasharray="5 5" />
          <rect x={CITY.x} y={CITY.y} width={CITY.w} height={CITY.h} rx={16} fill="none" stroke={colors.brand} strokeWidth={2} strokeDasharray="8 8" />
        </Draw>

        {zones.map((_, i) => (
          <Fade key={i} delay={at(4 + i)} instant={instant}>
            <Building x={bx(i)} y={BUILDING.top} w={BUILDING.w} h={BUILDING.h} />
          </Fade>
        ))}
      </svg>

      <Block x={mumbaiLabel.x} y={mumbaiLabel.y} w={mumbaiLabel.w} delay={at(2)} instant={instant}>
        <CityLabel name="Mumbai" code={REGION_CODE} tone={colors.ink} />
      </Block>
      <Block x={hyderabadLabel.x} y={hyderabadLabel.y} w={hyderabadLabel.w} delay={at(2)} instant={instant}>
        <CityLabel name="Hyderabad" code="ap-south-2" tone={colors.ink} />
      </Block>

      <Block x={CITY.x + 16} y={CITY.y - 12} w={330} delay={at(3)} instant={instant}>
        <span className="inline-block rounded-pill border bg-white px-3 py-0.5 text-xs font-semibold leading-5" style={{ borderColor: colors.brand, color: colors.brand }}>
          the Mumbai Region, {REGION_CODE}, one city
        </span>
      </Block>

      {zones.map((z, i) => (
        <Block key={z} x={bx(i) - 20} y={BUILDING.top + BUILDING.h + 14} w={BUILDING.w + 40} delay={at(5 + i)} instant={instant} className="text-center">
          <div className="font-mono text-body-sm font-bold leading-5 text-ink">{z}</div>
          <div className="text-xs leading-4" style={{ color: colors.body }}>a separate building, with its own power</div>
        </Block>
      ))}
    </>
  )
}

/** A building: a soft drop, a body with floors, lit windows, a roof line and a door. */
export function Building({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const floors = 5
  const cols = 3
  const pad = 14
  const floorH = (h - 30 - pad) / floors
  const winW = (w - pad * 2 - (cols - 1) * 10) / cols
  const parts: ReactNode[] = []
  for (let f = 0; f < floors; f++) {
    const fy = y + pad + f * floorH
    /* The floor line between storeys. */
    if (f > 0) parts.push(<line key={`fl${f}`} x1={x + 6} y1={fy} x2={x + w - 6} y2={fy} stroke={colors.line} strokeWidth={1} />)
    for (let c = 0; c < cols; c++) {
      parts.push(
        <rect
          key={`w${f}-${c}`}
          x={x + pad + c * (winW + 10)}
          y={fy + 7}
          width={winW}
          height={floorH - 14}
          rx={3}
          fill={colors.brand}
          opacity={0.7}
        />,
      )
    }
  }
  return (
    <g>
      <rect x={x + 6} y={y + 8} width={w} height={h} rx={10} fill={colors.brand} opacity={0.14} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={colors.white} stroke={colors.ink} strokeWidth={1.5} />
      <rect x={x + 10} y={y - 8} width={w - 20} height={10} rx={3} fill={colors.ink} />
      {parts}
      <rect x={x + w / 2 - 13} y={y + h - 30} width={26} height={30} rx={4} fill={colors.ink} />
      <circle cx={x + w / 2 + 6} cy={y + h - 15} r={1.6} fill={colors.white} />
    </g>
  )
}
