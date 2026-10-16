import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Card, Stage, At, Fade, Label, Arrow, Rail, Statement, Traveller, useLoop, useCycle, STILL, BOX_W, isNow } from './scene'
import { Bell, CloudShape, Idea, MapGround, Pin, Rocket, ServerUnit, useEase } from './art'
import { ClayBalance, ClayBell, ClayCoin, ClayCoins, ClayComputer, ClayMeter, ClayPadlock, ClayPin, ClayRocket, ClayTools } from './clay-d'
import { mo } from './motion'
import { tile, WELL, solid, TILE_SKIN_BG, TILE_DROP } from './basics'
import { usePrefix } from './depth'

/**
 * SECTION 5, BENEFITS & CHALLENGES (4MAT): every benefit with the risk it
 * carries. Every string is the reference's.
 *
 * Review 2026-10-16, global rules: nothing here is pressed any more. Every
 * scene that had a button runs itself on `useCycle` (one step every 2400ms,
 * round and round) and a process draws itself along time when the slide
 * opens (`useGrown`). Durations are the deck's: state eases 520ms
 * (`useEase()`), a draw 860ms, a step 2400ms, a lap 8s.
 */

/** True once the slide has been on screen a moment, so a graph grows along time instead of standing there; at once on harness URLs and in a thumbnail. */
function useGrown(delay = 450): boolean {
  const instant = useInstant()
  const [g, setG] = useState(STILL || instant)
  useEffect(() => {
    if (g) return
    const t = window.setTimeout(() => setG(true), delay)
    return () => window.clearTimeout(t)
  }, [g, delay])
  return g
}

const DRAW = 860

/* ================================================================== 38 · Cloud Trade-Offs Map (reference 43 + 44) */

const PAIRS: [string, string][] = [
  ['Cost model shift (CapEx→OpEx)', 'Vendor lock-in'],
  ['Elasticity of resources', 'Cost overruns'],
  ['Global reach', 'Latency'],
  ['Speed to market', 'Data residency'],
]

/*
 * Split by the review, 2026-10-15: the lead with the balance, then the map
 * (Anita left the balance in the 2026-10-16 review: no person on this frame). The balance no longer carries the pair's words under its pans: that was
 * the same text the map's row says beside it (the duplication slide 47 was
 * flagged for), so the picture and the words are now on separate frames.
 */
export function TradeoffStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="tradeoffs"
      kicker="Benefits & Challenges"
      title="Cloud Trade-Offs Map"
      label="Benefits & Challenges"
      parts={[{ t: 'Cloud adoption delivers clear business benefits, but ' }, { t: 'each benefit carries a matching operational risk', hi: true }, { t: '; recognising both before migration separates sound architecture decisions from costly surprises' }]}
      lesson={lesson}
      art={<ClayBalance w={270} tilt={7} />}
    />
  )
}

export function TradeoffScale({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const ease = useEase()
  return (
    <Card id="tradeoffs-map" kicker="Benefits & Challenges" title="Cloud Trade-Offs Map" lesson={lesson} beat={beat} total={4}>
      <Stage w={BOX_W} h={430} active={false} pad={24}>
        <div className="grid items-center" style={{ gridTemplateColumns: '1fr 110px 1fr', rowGap: 16 }}>
          <span className="text-right font-heading text-[16px] font-semibold tracking-[0.06em]" style={{ color: colors.brandDark }}>BENEFITS</span>
          <span />
          <span className="font-heading text-[16px] font-semibold tracking-[0.06em]" style={{ color: colors.danger }}>CHALLENGES</span>
          {PAIRS.map(([b, c], i) => {
            const on = beat >= i + 1
            const now = isNow(beat, i + 1)
            return [
              <div key={`b${i}`} className="rounded-xl px-5 py-4 text-right text-[20px] font-semibold" style={{ ...tile(`${now ? 2 : 1.5}px ${colors.brand}`, now ? { background: colors.surface2 } : {}), color: colors.ink, opacity: on ? 1 : 0, transition: ease }}>{b}</div>,
              <div key={`a${i}`} className="relative h-[20px]"><Arrow x1={14} y1={10} x2={96} y2={10} on={on} both tone={colors.muted} /></div>,
              <div key={`c${i}`} className="rounded-xl px-5 py-4 text-[20px] font-semibold" style={{ ...tile(`${now ? 2 : 1.5}px ${colors.danger}`, now ? { background: '#FDECEC' } : {}), color: colors.ink, opacity: on ? 1 : 0, transition: ease }}>{c}</div>,
            ]
          })}
        </div>
      </Stage>
    </Card>
  )
}

/* ================================================================== 39 · CapEx To OpEx (reference 45 + 46) */

function Bars({ title, values, tone, on, w, seed = 0 }: { title: string; values: number[]; tone: string; on: boolean; w: number; seed?: number }) {
  const ease = useEase(DRAW)
  return (
    <Stage w={w} h={268} active={false} pad={18}>
      <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{title}</span>
      <div className="mt-3 flex h-[160px] items-end justify-around border-b-2" style={{ borderColor: colors.line }}>
        {values.map((v, i) => (
          <div key={i} className={`w-[64px] rounded-t-lg ${mo('breathe', seed + i, { base: true }).className}`} style={{ height: on ? Math.max(6, v * 156) : 6, ...solid(tone), transition: ease, transitionDelay: `${i * 180}ms`, ...mo('breathe', seed + i, { base: true }).style }} />
        ))}
      </div>
      <div className="mt-2 flex justify-around">
        {['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4'].map((y) => (
          <span key={y} className="w-[64px] text-center text-[15px] font-medium" style={{ color: colors.ink }}>{y}</span>
        ))}
      </div>
    </Stage>
  )
}

/* split by the review, 2026-10-15: the lead alone, then the points and the bars */
export function CapexStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="capex-opex"
      kicker="Cost Model Shift"
      title="CapEx To OpEx"
      label="Cost Model Shift"
      parts={[{ t: 'On-premise IT demands ' }, { t: 'large upfront capital expenditure', hi: true }, { t: ' on hardware before any workload runs\nCloud shifts most of that spend to ' }, { t: 'metered operating expenditure', hi: true }, { t: ", billed for resources as they're consumed" }]}
      lesson={lesson}
      art={
        <div className="flex items-end gap-8">
          <ClayCoins w={78} n={8} />
          <ClayMeter w={124} value={0.35} />
        </div>
      }
    />
  )
}

/*
 * Split by the review, 2026-10-16: the four points get a frame of their own,
 * two by two across the box, each with its picture; the graph and the chips
 * that read off it are the next frame (CapexOpexTwo).
 */
export function CapexOpex({ lesson }: { lesson: string }) {
  const items: { text: string; art: ReactNode }[] = [
    { text: 'No upfront hardware purchase or depreciation schedule', art: <ServerStackArt /> },
    { text: 'Spend scales largely with actual resource usage (committed-use options like Reserved Instances trade some flexibility for lower rates)', art: <ClayMeter w={70} value={0.55} /> },
    { text: 'Frees capital for core business investment', art: <ClayCoins w={50} n={5} /> },
    { text: 'AWS Cost Explorer and Billing Dashboard track OpEx spend', art: <img src="/assets/tech/aws.png" alt="" className="h-[34px] w-auto" draggable={false} /> },
  ]
  return (
    <Card id="capex-points" kicker="Cost Model Shift" title="CapEx To OpEx" lesson={lesson}>
      <div className="grid grid-cols-2 gap-4" style={{ width: BOX_W }}>
        {items.map((it, i) => (
          <Stage key={i} w="100%" h={150} active={false} pad={22}>
            <div className="flex h-full items-center gap-5">
              <div className="grid h-[96px] w-[96px] shrink-0 place-items-center rounded-2xl" style={WELL}>{it.art}</div>
              <p className="text-[20px] font-medium leading-snug" style={{ color: colors.ink }}>{it.text}</p>
            </div>
          </Stage>
        ))}
      </div>
    </Card>
  )
}

/** Three running servers, stacked: the hardware a CapEx budget buys up front. */
function ServerStackArt() {
  return (
    <div className="flex flex-col gap-1">
      <ServerUnit w={64} />
      <ServerUnit w={64} />
      <ServerUnit w={64} />
    </div>
  )
}

/**
 * The CapEx vs OpEx graph, its chips in one row under it. The bars grow year
 * by year when the slide opens (a process, in the direction of time), then
 * Reserved Instances switch on and off by themselves, lowering and lifting
 * the OpEx bars, so the room sees the trade without a hand on a button.
 */
export function CapexOpexTwo({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const grown = useGrown()
  const reserved = useCycle(2) === 1
  const opex = reserved ? [0.17, 0.18, 0.16, 0.19] : [0.22, 0.25, 0.21, 0.26]
  const cell = 'flex h-[64px] items-center gap-3 rounded-2xl px-5'
  const ring = tile(`1.5px ${colors.line}`)
  return (
    <Card id="capex-points-2" kicker="Cost Model Shift" title="CapEx To OpEx" lesson={lesson} beat={beat} total={4}>
      <div className="flex flex-col gap-4" style={{ width: BOX_W }}>
        <div className="flex gap-4">
          <Bars title="CapEx" values={[1, 0, 0, 0]} tone={colors.muted} on={grown} w={547} />
          <Bars title="OpEx" values={opex} tone={colors.brand} on={grown} w={547} seed={4} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className={cell} style={ring}>
            <Label tone={reserved ? 'good' : 'muted'} size={15} strong>{reserved ? 'Reserved Instances: on' : 'Reserved Instances: off'}</Label>
          </div>
          <div className={cell} style={ring}>
            <ClayCoins w={30} n={4} />
            <span className="text-[17px] font-semibold" style={{ color: '#137A3A' }}>Capital kept for the business</span>
          </div>
          <div className={cell} style={ring}>
            <img src="/assets/tech/aws.png" alt="" className="h-[22px] w-auto" draggable={false} />
            <span className="text-[17px] font-semibold" style={{ color: colors.brandDark }}>Cost Explorer</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ================================================================== 41 · Scale Reach Speed */

const REGIONS: [number, number][] = [
  [110, 70], [150, 120], [250, 60], [300, 95], [330, 150], [420, 75], [460, 120], [520, 170], [560, 90], [590, 200],
]

/* split by the review, 2026-10-15: the lead alone, then the points and the scene */
export function GrowthStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="growth-speed"
      kicker="Growth And Speed Benefits"
      title="Scale Reach Speed"
      label="Growth And Speed Benefits"
      parts={[{ t: 'Elasticity, global reach and speed to market', hi: true }, { t: " convert cloud's technical flexibility into concrete business value: " }, { t: 'faster launches, worldwide presence and lower idle spend', hi: true }]}
      lesson={lesson}
      art={
        <div className="flex items-end gap-8">
          <ClayPin w={64} />
          <ClayRocket w={96} />
        </div>
      }
    />
  )
}

/**
 * The stage takes the four points in turn, round and round (one lap 9.6s, a
 * picture per 2400ms step): spend follows load (the spend line draws along
 * time), the Regions light up one after another, idea to production fills,
 * then the real capture. Held on the capture on harness URLs.
 */
export function GrowthSpeed({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const lap = useLoop(9600, { mode: 'sawtooth', still: 0.8 })
  const phase = Math.min(3, Math.floor(lap * 4))
  const local = lap * 4 - phase
  const ease = useEase()
  const shown = phase >= 2 ? REGIONS.length : phase === 1 ? Math.min(REGIONS.length, 1 + Math.floor(local * REGIONS.length)) : 0
  const items = [
    { text: 'Elasticity: autoscaling matches spend to real-time load', at: 1 },
    { text: 'Global reach: new AWS Region live in minutes', at: 2 },
    { text: 'Speed to market: idea to production in days', at: 3 },
    { text: 'Real-world: AWS Auto Scaling groups, Global Infrastructure Region map', at: 4 },
  ]
  return (
    <Card id="growth-points" kicker="Growth And Speed Benefits" title="Scale Reach Speed" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          {/* beat 1: spend follows load */}
          <div className="absolute inset-0" style={{ opacity: phase === 0 ? 1 : 0, transition: ease }}>
            <At x={24} y={20}><Label strong size={14}>Load and spend</Label></At>
            <svg className="absolute" style={{ left: 24, top: 60 }} width={640} height={250} aria-hidden>
              <g className={mo('breathe', 2, { base: true }).className} style={mo('breathe', 2, { base: true }).style}>
                <path d="M 0 220 C 120 210 180 60 300 50 C 420 40 480 200 640 210" fill="none" stroke={colors.brand} strokeWidth={12} opacity={0.14} strokeLinecap="round" />
                <path d="M 0 220 C 120 210 180 60 300 50 C 420 40 480 200 640 210" fill="none" stroke={colors.brand} strokeWidth={4} />
                <path d="M 0 226 H 100 V 150 H 200 V 70 H 380 V 150 H 500 V 216 H 640" fill="none" stroke={colors.teal} strokeWidth={4} strokeDasharray="1" pathLength={1} style={{ strokeDashoffset: phase === 0 ? 0 : 1, transition: phase === 0 ? `stroke-dashoffset ${DRAW}ms cubic-bezier(0.22,1,0.36,1) 300ms` : 'none' }} />
              </g>
            </svg>
            <At x={420} y={20}>
              <div className="flex gap-3">
                <Label tone="brand" size={13}>Load</Label>
                <Label tone="good" size={13}>Spend</Label>
              </div>
            </At>
          </div>
          {/* beat 2 and 3: Regions light up, then idea to production */}
          <div className="absolute inset-0" style={{ opacity: phase === 1 || phase === 2 ? 1 : 0, transition: ease }}>
            <At x={24} y={18}><MapGround w={642} h={240} /></At>
            {REGIONS.map(([x, y], i) => (
              <At key={i} x={24 + x} y={18 + y} cx>
                <div style={{ opacity: i < shown ? 1 : 0, transform: i < shown ? 'none' : 'translateY(-10px)', transition: ease }}>
                  <Pin w={22} tone={i === shown - 1 && phase === 1 ? colors.accent : colors.brand} />
                </div>
              </At>
            ))}
            <At x={36} y={30}><Label tone="brand" size={13}>{`${shown} Regions`}</Label></At>
            <At x={24} y={272} w={642}>
              <Fade on={phase === 2}>
                <div className="flex items-center gap-3">
                  <Idea w={26} />
                  <div className="relative h-[10px] flex-1 rounded-full" style={WELL}>
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: phase === 2 ? '22%' : '0%', ...solid(colors.success), transition: `width ${DRAW}ms cubic-bezier(0.22,1,0.36,1)` }} />
                  </div>
                  <Rocket w={22} />
                  <Label tone="good" size={13}>Production in days</Label>
                </div>
                <div className="mt-2 flex items-center gap-3 opacity-60">
                  <span className="block w-[26px]" />
                  <div className="relative h-[10px] flex-1 rounded-full" style={WELL}>
                    <div className="absolute inset-y-0 left-0 w-full rounded-full" style={solid(colors.muted)} />
                  </div>
                  <span className="block w-[22px]" />
                  <Label tone="muted" size={13}>Buying hardware: months</Label>
                </div>
              </Fade>
            </At>
          </div>
          {/* beat 4: the real capture */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4" style={{ opacity: phase === 3 ? 1 : 0, transition: ease }}>
            <div className={`overflow-hidden rounded-xl ${mo('pulse', 6).className}`} style={{ boxShadow: `0 0 0 1.5px ${colors.line}, 0 24px 48px -24px rgba(31,64,140,0.34), 0 8px 18px -10px rgba(31,64,140,0.14)`, ...mo('pulse', 6).style }}>
              <img src="/shots/aws-global-infrastructure-regions.png" alt="The AWS Global Infrastructure page, showing Regions worldwide" width={540} height={304} draggable={false} style={{ display: 'block' }} />
            </div>
            <span className="text-[14px] font-medium" style={{ color: colors.ink }}>The AWS Global Infrastructure page, showing Regions worldwide</span>
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 42 · Switching Cost Risk */

/* split by the review, 2026-10-15: the lead alone, then the points and the scene */
export function LockInStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="lock-in"
      kicker="Vendor Lock-In"
      title="Switching Cost Risk"
      label="Vendor Lock-In"
      parts={[{ t: "Deep reliance on one provider's " }, { t: 'proprietary APIs, data formats or managed services', hi: true }, { t: ' makes moving a workload elsewhere ' }, { t: 'slow, risky and expensive', hi: true }]}
      lesson={lesson}
      art={<ClayPadlock w={120} />}
    />
  )
}

/*
 * Review 2026-10-16: no faces. One provider's box holds the application, its
 * proprietary parts and the team's tool skills; the exit cost sits on the way
 * out; the other providers wait on the right; the mitigation is a switch that
 * swaps the proprietary parts for open ones, after which the move succeeds.
 */
export function LockIn({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  /* the scene runs itself: fitted to one provider; a move that snaps back; the mitigation fitted; the move that succeeds */
  const step = useCycle(4)
  const open = step >= 2
  const snapping = step === 1
  const moved = step === 3
  const instant = useInstant()
  const ease = useEase()
  const tone = open ? colors.success : colors.danger
  const items = [
    { text: 'Proprietary services (Lambda triggers, DynamoDB APIs) resist portability', at: 1 },
    { text: 'Data egress fees add direct exit cost', at: 2 },
    { text: "Team skill-set built around one provider's tools", at: 3 },
    { text: 'Mitigation: multi-cloud design, open standards, Infrastructure as Code', at: 4 },
  ]
  const parts = (size: number) =>
    open ? (
      <>
        <Label tone="good" size={size}>Open standards</Label>
        <Label tone="good" size={size}>Infrastructure as Code</Label>
      </>
    ) : (
      <>
        <Label tone="brand" size={size} mono>Lambda triggers</Label>
        <Label tone="brand" size={size} mono>DynamoDB APIs</Label>
      </>
    )
  return (
    <Card id="lock-in-points" kicker="Vendor Lock-In" title="Switching Cost Risk" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          {/* one provider: the application, its parts, the team's skills */}
          <At x={20} y={20} w={310}>
            <div className="rounded-2xl p-3.5" style={tile(`2px ${colors.brand}`, { background: 'linear-gradient(180deg, #F3F7FF 0%, #E8F0FF 100%)' })}>
              <span className="block font-heading text-[14px] font-semibold tracking-[0.06em]" style={{ color: colors.brandDark }}>ONE PROVIDER</span>
              <motion.div
                key={step}
                className="mt-2 rounded-xl p-3"
                style={{ ...tile(`1.5px ${colors.line}`), opacity: moved ? 0.35 : 1, transition: ease }}
                initial={false}
                animate={{ x: instant || STILL || !snapping ? 0 : [0, 90, 70, 0] }}
                transition={{ duration: 0.86, ease: 'easeInOut' }}
              >
                <span className="block text-[15px] font-semibold" style={{ color: colors.ink }}>Your application</span>
                <div className="mt-2 flex flex-wrap gap-1.5">{parts(14)}</div>
              </motion.div>
              <div className="mt-2.5 flex items-center gap-2.5 rounded-xl px-3 py-2" style={tile(`1.5px ${colors.line}`)}>
                <ClayTools w={28} />
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>Skills in one provider's tools</span>
              </div>
            </div>
          </At>
          {/* the way out: egress fees over the arrow, the exit cost under it */}
          <At x={405} y={36} cx>
            <div className="flex flex-col items-center gap-1.5">
              <ClayPadlock w={34} open={open} tone={open ? '#2FB36B' : '#D8352F'} />
              <span className="whitespace-nowrap text-[14px] font-semibold" style={{ color: tone, transition: ease }}>Data egress fees</span>
            </div>
          </At>
          <Arrow x1={342} y1={128} x2={468} y2={128} dashed tone={tone} />
          <At x={405} y={144} cx>
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1">
                <ClayCoin w={22} />
                <ClayCoin w={22} />
                <ClayCoin w={22} />
              </div>
              <Label tone="bad" size={14}>Exit cost</Label>
            </div>
          </At>
          {/* the other providers: the application arrives here once nothing ties it to one */}
          <At x={476} y={20} w={194}>
            <div className="flex h-[218px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-3 text-center" style={{ borderColor: open ? colors.success : colors.line, background: TILE_SKIN_BG, boxShadow: TILE_DROP, transition: ease }}>
              <span className="font-heading text-[15px] font-semibold" style={{ color: colors.ink }}>Other providers</span>
              <motion.div key={moved ? 'app' : 'clouds'} initial={instant || STILL ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}>
                {moved ? (
                  <div className="rounded-xl px-3 py-2" style={tile(`2px ${colors.success}`)}>
                    <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>Your application</span>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <CloudShape w={58} />
                    <CloudShape w={46} fill={colors.brandDark} shade={colors.brandDeep} />
                  </div>
                )}
              </motion.div>
            </div>
          </At>
          <At x={20} y={268} w={650}>
            <div className="flex items-center gap-2.5">
              <Label tone={open ? 'good' : 'muted'} size={14} strong>{open ? 'Mitigation: on' : 'Mitigation: off'}</Label>
              <Label tone={moved || snapping ? 'brand' : 'muted'} size={14} strong>Moving the application</Label>
              <span className="ml-auto text-[14px] font-semibold" style={{ color: tone, transition: ease }}>
                {moved ? 'It moves: nothing fitted to one provider' : snapping ? 'It snaps back: built from one provider’s parts' : open ? 'Open parts fitted: ready to move' : 'Built from one provider’s parts'}
              </span>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 44 · Unplanned Billing Risk */

const BILL = [0.1, 0.17, 0.24, 0.32, 0.4, 0.5, 0.95]

/* split by the review, 2026-10-15: the lead alone, then the points and the bill */
export function OverrunsStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="cost-overruns"
      kicker="Cost Overruns"
      title="Unplanned Billing Risk"
      label="Cost Overruns"
      parts={[{ t: 'Pay-per-use billing ' }, { t: 'grows silently with usage', hi: true }, { t: ', unlike a fixed on-premise budget; ' }, { t: 'unmonitored or misconfigured resources', hi: true }, { t: ' can turn into a large, unexpected bill' }]}
      lesson={lesson}
      art={
        <div className="flex items-end gap-8">
          <ClayCoins w={78} n={8} />
          <ClayBell w={104} />
        </div>
      }
    />
  )
}

export function Overruns({ lesson }: { lesson: string }) {
  const beat = useBeats(4)
  const grown = useGrown()
  /* the scene runs itself: the forgotten resource runs and the bill climbs, then it is stopped and the bill flattens, round again */
  const stopped = useCycle(2) === 1
  const values = stopped ? BILL.map((v, i) => (i >= 5 ? 0.32 : v)) : BILL
  const items = [
    { text: 'Idle or forgotten resources keep billing after use', at: 1 },
    { text: 'Misconfigured autoscaling can multiply costs unexpectedly', at: 2 },
    { text: 'Data transfer and API charges accumulate unnoticed', at: 3 },
    { text: 'AWS Budgets and Cost Anomaly Detection flag abnormal spend', at: 4 },
  ]
  const id = usePrefix()
  const W = 400
  const H = 210
  const pts = values.map((v, i) => [12 + (i / (values.length - 1)) * (W - 24), H - 10 - v * (H - 24)] as [number, number])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
  return (
    <Card id="overruns-points" kicker="Cost Overruns" title="Unplanned Billing Risk" lesson={lesson} beat={beat} total={4}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false} pad={14}>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2" style={{ width: 210 }}>
              <span className="font-heading text-[14px] font-semibold" style={{ color: colors.ink }}>Resources</span>
              <div className="flex items-center gap-2 rounded-xl px-2 py-2" style={tile(`${stopped ? 1 : 2}px ${stopped ? colors.line : colors.warning}`)}>
                <ServerUnit w={60} state={stopped ? 'off' : 'run'} />
                <span className="text-[14px] font-medium" style={{ color: colors.ink }}>{stopped ? 'Stopped' : 'Forgotten, running'}</span>
              </div>
              <Fade on={beat >= 2}>
                <div className="flex items-center gap-1 rounded-xl px-2 py-2" style={tile()}>
                  {Array.from({ length: 5 }, (_, k) => <ServerUnit key={k} w={30} />)}
                </div>
              </Fade>
              <Fade on={beat >= 3}>
                <div className="flex flex-wrap gap-1">
                  <Label size={12} tone="warn">Data transfer</Label>
                  <Label size={12} tone="warn">API calls</Label>
                </div>
              </Fade>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: colors.ink }}><span className="block h-[3px] w-[16px] rounded-full" style={{ background: colors.danger }} />Monthly bill</span>
              <svg width={W} height={H} aria-hidden>
                <defs>
                  <linearGradient id={`${id}-bg`} x1={0} y1={0} x2={0} y2={1}><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F1F5FD" /></linearGradient>
                  <linearGradient id={`${id}-area`} x1={0} y1={0} x2={0} y2={1}><stop offset="0" stopColor={colors.danger} stopOpacity={0.22} /><stop offset="1" stopColor={colors.danger} stopOpacity={0.02} /></linearGradient>
                </defs>
                <rect width={W} height={H} rx={12} fill={`url(#${id}-bg)`} stroke="#D9E3F7" strokeWidth={1} />
                <g className={mo('breathe', 3, { base: true }).className} style={mo('breathe', 3, { base: true }).style}>
                  <path d={d + ` L ${W - 12} ${H - 10} L 12 ${H - 10} Z`} fill={`url(#${id}-area)`} style={{ transition: 'd 520ms cubic-bezier(0.22,1,0.36,1)' }} />
                  <path d={d} fill="none" stroke={colors.danger} strokeWidth={3} pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: grown ? 0 : 1, transition: `stroke-dashoffset ${DRAW}ms cubic-bezier(0.22,1,0.36,1), d 520ms cubic-bezier(0.22,1,0.36,1)` }} />
                </g>
                <line x1={pts[5][0] + 20} x2={pts[5][0] + 20} y1={10} y2={H - 10} stroke={colors.danger} strokeWidth={1.5} strokeDasharray="4 4" opacity={beat >= 3 ? 0.8 : 0} />
              </svg>
              <div className="flex items-center gap-2">
                <Fade on={beat >= 4}><Bell w={22} ringing={!stopped && !STILL} /></Fade>
                <Fade on={beat >= 3}><Label tone="bad" size={13}>An unmonitored resource kept billing</Label></Fade>
              </div>
              <Fade on={beat >= 4}>
                <div className="flex items-center gap-2">
                  <img src="/assets/tech/aws.png" alt="" className="h-[14px] w-auto" draggable={false} />
                  <Label tone="brand" size={12}>Budgets alert: abnormal spend</Label>
                </div>
              </Fade>
            </div>
          </div>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 46 · Distance And Law Limits */

/* split by the review, 2026-10-15: the lead alone, then the points and the map */
export function RegionStatement({ lesson }: { lesson: string }) {
  return (
    <Statement
      id="latency-residency"
      kicker="Latency And Residency"
      title="Distance And Law Limits"
      label="Latency And Residency"
      parts={[{ t: 'Physical distance to the nearest AWS Region adds ' }, { t: 'network delay', hi: true }, { t: ', and certain data must ' }, { t: 'legally remain within national borders', hi: true }, { t: ' regardless of which Region is closest' }]}
      lesson={lesson}
      art={
        <div className="flex items-end gap-8">
          <ClayPin w={76} tone="#2FB36B" />
          <ClayPin w={52} tone="#FC963C" />
        </div>
      }
    />
  )
}

/*
 * Review 2026-10-16: the user is a computer (no person), and the map is laid
 * on one grid: the residency zone holds the user and the nearest Region on
 * one line, the distant Region sits outside it on the same line, each delay
 * label sits on its own arrow's midpoint, and the controls row starts on the
 * map's left edge.
 */
export function RegionMap({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  /* the scene runs itself: a request to the nearest Region, then one to the distant Region, round again; each step sends its dot */
  const step = useCycle(2)
  const pick: 'near' | 'far' = step === 0 ? 'near' : 'far'
  const ease = useEase()
  /* two lanes from the user's screen: the near Region on the upper one, the distant one on the lower */
  const near = { x: 300, y: 140 }
  const far = { x: 570, y: 198 }
  const from = 160
  const items = [
    { text: 'Mitigation: nearest Region or a CDN edge location', at: 1 },
    { text: 'Data residency: laws such as GDPR require in-country storage', at: 2 },
    { text: 'AWS Region selection at creation enforces residency choice', at: 3 },
  ]
  const target = pick === 'near' ? near : far
  return (
    <Card id="latency-points" kicker="Latency And Residency" title="Distance And Law Limits" lesson={lesson} beat={beat} total={3}>
      <div className="flex gap-4">
        <Rail items={items} beat={beat} width={404} size={16} />
        <Stage w={690} h={360} active={false}>
          <At x={16} y={16}><MapGround w={658} h={282} /></At>
          {/* the data residency zone: the user and the near Region inside one border */}
          <svg aria-hidden className="pointer-events-none absolute" style={{ left: 32, top: 32 }} width={348} height={250}>
            <rect x={1.5} y={1.5} width={345} height={247} rx={28} fill="none" stroke={beat >= 2 ? colors.success : colors.line} strokeWidth={3} strokeDasharray="8 7" className={mo('glow', 1).className} style={{ transition: ease, ...mo('glow', 1).style }} />
          </svg>
          <At x={206} y={246} cx><Fade on={beat >= 2}><Label tone="good" size={14} strong>Data residency zone</Label></Fade></At>
          <At x={110} y={130} cx>
            <div className="flex flex-col items-center gap-1.5">
              <ClayComputer w={88} />
              <Label size={14} strong>User</Label>
            </div>
          </At>
          {/* each Region: its name over its pin, the pin's tip on its lane */}
          <At x={near.x} y={near.y - 74} cx>
            <div className="flex flex-col items-center gap-1"><Label size={14} strong tone={pick === 'near' ? 'good' : 'plain'}>Nearest Region</Label><ClayPin w={30} tone={pick === 'near' ? '#2FB36B' : '#0055E8'} /></div>
          </At>
          <At x={far.x} y={far.y - 74} cx>
            <div className="flex flex-col items-center gap-1"><Label size={14} strong tone={pick === 'far' ? 'warn' : 'plain'}>Distant Region</Label><ClayPin w={30} tone={pick === 'far' ? '#FC963C' : '#0055E8'} /></div>
          </At>
          <Arrow x1={from} y1={near.y} x2={near.x - 22} y2={near.y} tone={colors.success} />
          <At x={(from + near.x - 22) / 2} y={near.y + 10} cx><Label tone="good" size={14}>Less delay</Label></At>
          <Arrow x1={from} y1={far.y} x2={far.x - 22} y2={far.y} tone={colors.warning} dashed />
          <At x={(near.x + far.x) / 2 + 20} y={far.y + 10} cx><Label tone="warn" size={14}>More delay</Label></At>
          <Traveller k={step} run={!STILL} path={[[from, target.y], [target.x, target.y]]} dur={pick === 'near' ? 0.5 : 1.8} tone={pick === 'near' ? colors.success : colors.warning} />
          <At x={16} y={314} w={658}>
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-semibold" style={{ color: colors.ink }}>A request to</span>
              <Label tone={pick === 'near' ? 'good' : 'muted'} size={14} strong>Nearest Region</Label>
              <Label tone={pick === 'far' ? 'warn' : 'muted'} size={14} strong>Distant Region</Label>
              <Fade on={beat >= 3} className="ml-auto"><div className="flex items-center gap-1.5"><img src="/assets/tech/aws.png" alt="" className="h-[14px] w-auto" draggable={false} /><Label tone="brand" size={14}>Region chosen at creation</Label></div></Fade>
            </div>
          </At>
        </Stage>
      </div>
    </Card>
  )
}

/* ================================================================== 47 · Weighing Trade-Offs Together (reference 54 + 55) */

const RISKS: [string, string][] = [
  ['Cost model shift (OpEx)', 'Cost overruns without governance'],
  ['Elasticity & speed to market', 'Vendor lock-in via managed services'],
  ['Global reach', 'Latency & data residency limits'],
]

/*
 * Review 2026-10-15: the three balances are gone. Their pans carried the same
 * six strings the table under them repeats, so the slide said everything
 * twice; the table is now the whole body, a row per beat.
 */
export function PairScales({ lesson }: { lesson: string }) {
  const beat = useBeats(3)
  const ease = useEase()
  return (
    <Card id="benefit-risk" kicker="Benefit Risk Pairing" title="Weighing Trade-Offs Together" lead="Each cloud benefit carries a paired risk; weighing both together, not benefits alone, is what a sound migration decision requires" lesson={lesson} beat={beat} total={3}>
      <div className="overflow-hidden rounded-xl" style={{ width: BOX_W, ...tile() }}>
        <div className="grid grid-cols-2">
          <span className="px-6 py-3 font-heading text-[19px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>Benefit Driving Adoption</span>
          <span className="px-6 py-3 font-heading text-[19px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>Matching Risk To Manage</span>
          {RISKS.map(([b, r], i) => {
            const cell = { color: colors.ink, borderTop: `1px solid ${colors.line}`, background: isNow(beat, i + 1) ? 'rgba(45,99,251,0.09)' : 'transparent', opacity: beat >= i + 1 ? 1 : 0, transition: ease }
            return [
              <span key={`b${b}`} className="px-6 py-5 font-heading text-[20px] font-semibold" style={cell}>{b}</span>,
              <span key={`r${b}`} className="px-6 py-5 text-[20px] font-medium" style={cell}>{r}</span>,
            ]
          })}
        </div>
      </div>
    </Card>
  )
}
